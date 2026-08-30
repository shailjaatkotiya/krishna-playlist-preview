export default function NightScene({ isPlaying }) {
  return (
    <svg
      className="night-scene"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="bgGlow" cx="50%" cy="45%" r="75%">
          <stop offset="0%" stopColor="#0d2a24" />
          <stop offset="55%" stopColor="#081c22" />
          <stop offset="100%" stopColor="#050f16" />
        </radialGradient>

        <radialGradient id="eyeCore" cx="42%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#f4d78a" />
          <stop offset="30%" stopColor="#e2a93f" />
          <stop offset="65%" stopColor="#b5731f" />
          <stop offset="100%" stopColor="#6b3d16" />
        </radialGradient>
        <radialGradient id="eyeMid" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0a4a3e" />
          <stop offset="55%" stopColor="#0f6b5c" />
          <stop offset="100%" stopColor="#134a3f" />
        </radialGradient>
        <radialGradient id="eyeOuter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1c3a6e" />
          <stop offset="60%" stopColor="#12294f" />
          <stop offset="100%" stopColor="#0a1830" />
        </radialGradient>

        <linearGradient id="barbGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1c8f6f" />
          <stop offset="45%" stopColor="#12735c" />
          <stop offset="100%" stopColor="#0a4438" />
        </linearGradient>
        <linearGradient id="barbGradR" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#1c8f6f" />
          <stop offset="45%" stopColor="#12735c" />
          <stop offset="100%" stopColor="#0a4438" />
        </linearGradient>

        <radialGradient id="vignette" cx="50%" cy="42%" r="70%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0" />
          <stop offset="70%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#020609" stopOpacity="0.75" />
        </radialGradient>

        <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>

        <g id="featherShape">
          <g id="barbsLower">
            {[...Array(34)].map((_, i) => {
              const t = i / 33;
              const y = 40 + t * 560;
              const len = 90 + t * 210;
              const droop = 18 + t * 46;
              const sway = i % 2 === 0 ? 1 : -1;
              return (
                <g key={`l${i}`}>
                  <path
                    d={`M0,${y} C${-len * 0.4},${y - droop * 0.3} ${-len * 0.8},${y + droop} ${-len},${y + droop + sway * 6}`}
                    stroke="url(#barbGrad)"
                    strokeWidth={2.6 - t * 1.1}
                    fill="none"
                    strokeLinecap="round"
                    opacity={0.88}
                  />
                  <path
                    d={`M0,${y} C${len * 0.4},${y - droop * 0.3} ${len * 0.8},${y + droop} ${len},${y + droop + sway * 6}`}
                    stroke="url(#barbGradR)"
                    strokeWidth={2.6 - t * 1.1}
                    fill="none"
                    strokeLinecap="round"
                    opacity={0.88}
                  />
                </g>
              );
            })}
          </g>

          <g id="barbsUpper">
            {[...Array(20)].map((_, i) => {
              const t = i / 19;
              const y = 600 + t * 150;
              const len = 300 - t * 260;
              const droop = 60 - t * 50;
              return (
                <g key={`u${i}`}>
                  <path
                    d={`M0,${y} C${-len * 0.5},${y - 10} ${-len * 0.85},${y + droop * 0.6} ${-len},${y + droop}`}
                    stroke="url(#barbGrad)"
                    strokeWidth={1.4}
                    fill="none"
                    strokeLinecap="round"
                    opacity={0.75}
                  />
                  <path
                    d={`M0,${y} C${len * 0.5},${y - 10} ${len * 0.85},${y + droop * 0.6} ${len},${y + droop}`}
                    stroke="url(#barbGradR)"
                    strokeWidth={1.4}
                    fill="none"
                    strokeLinecap="round"
                    opacity={0.75}
                  />
                </g>
              );
            })}
          </g>

          <path d="M0,750 C-4,520 3,260 0,20" stroke="#d9c48a" strokeWidth="4" fill="none" opacity="0.8" strokeLinecap="round" />
          <path d="M0,750 C-4,520 3,260 0,20" stroke="#8a6a2e" strokeWidth="1.2" fill="none" opacity="0.6" strokeLinecap="round" />

          <g transform="translate(0,60)">
            <ellipse cx="0" cy="0" rx="230" ry="290" fill="url(#eyeOuter)" />
            <ellipse cx="0" cy="0" rx="230" ry="290" fill="none" stroke="#3a6b9e" strokeWidth="3" opacity="0.5" />
            <ellipse cx="6" cy="-4" rx="168" ry="220" fill="url(#eyeMid)" />
            <ellipse cx="6" cy="-4" rx="168" ry="220" fill="none" stroke="#1c8f6f" strokeWidth="2.5" opacity="0.55" />
            <ellipse cx="10" cy="-6" rx="98" ry="132" fill="url(#eyeCore)" />
            <ellipse cx="10" cy="-6" rx="98" ry="132" fill="none" stroke="#f4d78a" strokeWidth="1.5" opacity="0.5" />
            <ellipse cx="-4" cy="-10" rx="30" ry="58" fill="#241407" opacity="0.75" />
            <ellipse cx="-14" cy="-30" rx="12" ry="20" fill="#000000" opacity="0.55" />
            <ellipse cx="34" cy="-46" rx="26" ry="16" fill="#fdf0c9" opacity="0.35" />
          </g>
        </g>
      </defs>

      <rect x="0" y="0" width="1440" height="900" fill="url(#bgGlow)" />

      <g opacity="0.35" filter="url(#softBlur)">
        <g transform="translate(140,780) rotate(-18) scale(0.55)">
          <use href="#featherShape" />
        </g>
        <g transform="translate(1340,760) rotate(14) scale(0.5)">
          <use href="#featherShape" />
        </g>
      </g>

      <g transform="translate(760,470) rotate(-6) scale(1.55)">
        <use href="#featherShape" />
      </g>

      <g transform="translate(430,560) rotate(9) scale(1.15)" opacity="0.85">
        <use href="#featherShape" />
      </g>

      <g fill="#f0c76b">
        {[...Array(24)].map((_, i) => {
          const x = (i * 191) % 1440;
          const y = (i * 97) % 900;
          const r = i % 3 === 0 ? 1.8 : 1;
          const op = 0.18 + ((i * 29) % 40) / 100;
          return (
            <circle key={i} cx={x} cy={y} r={r} opacity={op}>
              <animate
                attributeName="opacity"
                values={`${op};${op * 0.25};${op}`}
                dur={`${4 + (i % 6)}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}
      </g>

      {isPlaying && (
        <ellipse cx="900" cy="530" rx="120" ry="150" fill="#f4d78a" opacity="0.06">
          <animate attributeName="opacity" values="0.03;0.1;0.03" dur="2.2s" repeatCount="indefinite" />
        </ellipse>
      )}

      <rect x="0" y="0" width="1440" height="900" fill="url(#vignette)" />
    </svg>
  );
}
