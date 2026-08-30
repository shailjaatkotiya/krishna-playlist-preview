export default function PlayerBar({
  song,
  isPlaying,
  isShuffled,
  engine,
  progress,
  currentTime,
  duration,
  volume,
  onSeek,
  onVolumeChange,
  onTogglePlay,
  onNext,
  onPrev,
  onToggleShuffle,
  trackNumber,
  total,
}) {
  const handleSeekClick = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    onSeek(fraction);
  };

  return (
    <div className="player-bar">
      <div className="player-seek-row">
        <span className="seek-time">{currentTime}</span>
        <div
          className="seek-track"
          onClick={handleSeekClick}
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') onSeek(Math.min(1, progress + 0.05));
            if (e.key === 'ArrowLeft') onSeek(Math.max(0, progress - 0.05));
          }}
        >
          <div className="seek-fill" style={{ width: `${progress * 100}%` }} />
          <div className="seek-thumb" style={{ left: `${progress * 100}%` }} />
        </div>
        <span className="seek-time">{duration}</span>
      </div>

      <div className="player-main-row">
        <div className="player-track-info">
          <div className={`disc ${isPlaying ? 'spin' : ''}`} aria-hidden="true">
            <div className="disc-center" />
          </div>
          <div className="player-text">
            <p className="player-index">
              Track {trackNumber} of {total}
              <span className={`engine-tag engine-${engine}`}>{engine === 'mp3' ? 'MP3' : 'YouTube'}</span>
            </p>
            <p className="player-title">{song.title}</p>
            <p className="player-meta">
              {[song.artist, song.album].filter(Boolean).join(' · ') || song.category}
            </p>
          </div>
        </div>

        <div className="player-controls">
          <button
            className={`ctrl-btn shuffle ${isShuffled ? 'active' : ''}`}
            onClick={onToggleShuffle}
            aria-pressed={isShuffled}
            aria-label="Shuffle"
            title="Shuffle"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 3 21 3 21 8" />
              <line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" />
              <line x1="15" y1="15" x2="21" y2="21" />
              <line x1="4" y1="4" x2="9" y2="9" />
            </svg>
          </button>

          <button className="ctrl-btn" onClick={onPrev} aria-label="Previous song" title="Previous">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zM10 12l9-6v12z" />
            </svg>
          </button>

          <button
            className="ctrl-btn play-pause"
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button className="ctrl-btn" onClick={onNext} aria-label="Next song" title="Next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6l9 6-9 6zM16 6h2v12h-2z" />
            </svg>
          </button>
        </div>

        <div className="player-volume">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 9v6h4l5 5V4L7 9H3z" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            aria-label="Volume"
            className="volume-slider"
          />
        </div>
      </div>
    </div>
  );
}
