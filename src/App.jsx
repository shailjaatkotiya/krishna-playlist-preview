import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import './App.css';
import NightScene from './components/NightScene';
import PlayerBar from './components/PlayerBar';
import SongList from './components/SongList';
import songsData from './data/songs.json';

const YT_PLAYLIST_URL =
  'https://www.youtube.com/playlist?list=PLUoJ_xQIQCcyw0Ii0aDOmfgaIE0A6mUc8';

function shuffleOrder(length) {
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffleMap, setShuffleMap] = useState(() => shuffleOrder(songsData.length));
  const [shufflePos, setShufflePos] = useState(0);
  const [ytReady, setYtReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [engine, setEngine] = useState('mp3');

  const audioRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const goNextRef = useRef(() => {});
  const containerRef = useRef(null);
  const progressRafRef = useRef(null);

  const currentSong = songsData[currentIndex];

  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initYt();
      return;
    }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
    window.onYouTubeIframeAPIReady = initYt;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function initYt() {
    ytPlayerRef.current = new window.YT.Player('yt-audio-engine', {
      height: '0',
      width: '0',
      videoId: '',
      playerVars: { autoplay: 0, controls: 0, disablekb: 1 },
      events: {
        onReady: () => setYtReady(true),
        onStateChange: (e) => {
          if (e.data === window.YT.PlayerState.ENDED) goNextRef.current();
          if (e.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
          if (e.data === window.YT.PlayerState.PAUSED) setIsPlaying(false);
        },
      },
    });
  }

  const buildQuery = (song) => `${song.title} ${song.album || ''} krishna bhajan`.trim();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
      setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    };
    const onEnded = () => goNextRef.current();
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onTime);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onTime);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    function tick() {
      if (engine === 'youtube' && ytPlayerRef.current && ytPlayerRef.current.getCurrentTime) {
        const cur = ytPlayerRef.current.getCurrentTime() || 0;
        const dur = ytPlayerRef.current.getDuration() || 0;
        setCurrentTime(cur);
        setDuration(dur);
        setProgress(dur ? cur / dur : 0);
      }
      progressRafRef.current = requestAnimationFrame(tick);
    }
    progressRafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(progressRafRef.current);
  }, [engine]);

  const playSongAtIndex = useCallback(
    (index) => {
      setCurrentIndex(index);
      const song = songsData[index];
      const useMp3 = Boolean(song.mp3 && song.mp3.trim());
      setEngine(useMp3 ? 'mp3' : 'youtube');
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);

      if (useMp3) {
        if (ytPlayerRef.current && ytPlayerRef.current.stopVideo) ytPlayerRef.current.stopVideo();
        const audio = audioRef.current;
        if (audio) {
          audio.src = song.mp3;
          audio.load();
          audio.play().catch(() => setIsPlaying(false));
        }
      } else {
        if (audioRef.current) audioRef.current.pause();
        if (ytPlayerRef.current && ytReady) {
          ytPlayerRef.current.loadPlaylist({ list: buildQuery(song), listType: 'search', index: 0 });
          setIsPlaying(true);
        }
      }
    },
    [ytReady]
  );

  const togglePlay = () => {
    if (engine === 'mp3') {
      const audio = audioRef.current;
      if (!audio) return;
      if (!audio.src) {
        playSongAtIndex(currentIndex);
        return;
      }
      if (audio.paused) audio.play().catch(() => {});
      else audio.pause();
    } else {
      if (!ytPlayerRef.current || !ytReady) return;
      const state = ytPlayerRef.current.getPlayerState ? ytPlayerRef.current.getPlayerState() : -1;
      if (state === -1 || state === undefined) {
        playSongAtIndex(currentIndex);
      } else if (isPlaying) {
        ytPlayerRef.current.pauseVideo();
      } else {
        ytPlayerRef.current.playVideo();
      }
    }
  };

  const seekTo = (fraction) => {
    if (engine === 'mp3') {
      const audio = audioRef.current;
      if (audio && audio.duration) audio.currentTime = fraction * audio.duration;
    } else if (ytPlayerRef.current && ytPlayerRef.current.getDuration) {
      const dur = ytPlayerRef.current.getDuration() || 0;
      ytPlayerRef.current.seekTo(fraction * dur, true);
    }
  };

  const goNext = useCallback(() => {
    if (isShuffled) {
      const nextPos = (shufflePos + 1) % shuffleMap.length;
      setShufflePos(nextPos);
      playSongAtIndex(shuffleMap[nextPos]);
    } else {
      playSongAtIndex((currentIndex + 1) % songsData.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isShuffled, shufflePos, shuffleMap, playSongAtIndex]);

  useEffect(() => {
    goNextRef.current = goNext;
  }, [goNext]);

  const goPrev = useCallback(() => {
    if (isShuffled) {
      const prevPos = (shufflePos - 1 + shuffleMap.length) % shuffleMap.length;
      setShufflePos(prevPos);
      playSongAtIndex(shuffleMap[prevPos]);
    } else {
      playSongAtIndex((currentIndex - 1 + songsData.length) % songsData.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isShuffled, shufflePos, shuffleMap, playSongAtIndex]);

  const toggleShuffle = () => {
    if (!isShuffled) {
      const map = shuffleOrder(songsData.length);
      const idx = map.indexOf(currentIndex);
      [map[0], map[idx]] = [map[idx], map[0]];
      setShuffleMap(map);
      setShufflePos(0);
    }
    setIsShuffled((s) => !s);
  };

  const groupedSongs = useMemo(() => {
    const groups = {};
    songsData.forEach((song, idx) => {
      if (!groups[song.category]) groups[song.category] = [];
      groups[song.category].push({ ...song, index: idx });
    });
    return groups;
  }, []);

  return (
    <div className="app-shell" ref={containerRef}>
      <img className="bg-image" src="./image.jpg" alt="" />

      <audio ref={audioRef} preload="metadata" />
      <div id="yt-audio-engine" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} />

      <header className="hero">
        {/* <p className="hero-eyebrow">Janmashtami · Krishna Sada Sahaayate</p> */}
        <h1 className="hero-title">Janmashtami</h1>
        {/* <p className="hero-sub">
          {songsData.length} songs of the flute, the river, and the name that never tires of being sung —
          Bollywood bhajans, Carnatic classics, and the full <em>Laalo</em> soundtrack, gathered for tonight.
        </p> */}
        <a className="yt-link" href={YT_PLAYLIST_URL} target="_blank" rel="noopener noreferrer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12Z" />
          </svg>
          Open full playlist on YouTube
        </a>
      </header>

      <main className="song-panel">
        <SongList
          groups={groupedSongs}
          currentIndex={currentIndex}
          isPlaying={isPlaying}
          onSelect={playSongAtIndex}
        />
      </main>

      <PlayerBar
        song={currentSong}
        isPlaying={isPlaying}
        isShuffled={isShuffled}
        engine={engine}
        progress={progress}
        currentTime={formatTime(currentTime)}
        duration={formatTime(duration)}
        volume={volume}
        onSeek={seekTo}
        onVolumeChange={(v) => setVolume(v)}
        onTogglePlay={togglePlay}
        onNext={goNext}
        onPrev={goPrev}
        onToggleShuffle={toggleShuffle}
        trackNumber={currentIndex + 1}
        total={songsData.length}
      />
    </div>
  );
}
