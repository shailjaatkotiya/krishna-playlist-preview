export default function SongList({ groups, currentIndex, isPlaying, onSelect }) {
  return (
    <div className="song-scroll">
      {Object.entries(groups).map(([category, songs]) => (
        <section key={category} className="category-group">
          <h2 className="category-title">{category}</h2>
          <ul className="song-list">
            {songs.map((song) => {
              const isCurrent = song.index === currentIndex;
              return (
                <li key={song.id}>
                  <button
                    className={`song-row ${isCurrent ? 'active' : ''}`}
                    onClick={() => onSelect(song.index)}
                    aria-current={isCurrent ? 'true' : undefined}
                  >
                    <span className="song-num">
                      {isCurrent && isPlaying ? (
                        <span className="playing-bars" aria-hidden="true">
                          <span />
                          <span />
                          <span />
                        </span>
                      ) : (
                        String(song.id).padStart(2, '0')
                      )}
                    </span>
                    <span className="song-details">
                      <span className="song-title">{song.title}</span>
                      <span className="song-sub">
                        {[song.artist, song.album].filter(Boolean).join(' · ')}
                      </span>
                    </span>
                    <span className="song-play-icon" aria-hidden="true">
                      {isCurrent && isPlaying ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="6" y="5" width="4" height="14" rx="1" />
                          <rect x="14" y="5" width="4" height="14" rx="1" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
