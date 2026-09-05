export default function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      role="img"
      aria-label="איור של דף תרגול מודפס ועיפרון"
      className={className}
    >
      <rect x={18} y={14} width={116} height="134" rx={8} fill="#efe9dc" />
      <rect x={30} y={8} width={116} height="134" rx={8} fill="#ffffff" stroke="#e3dccd" strokeWidth={2} />

      <g stroke="#23407a" strokeWidth={3} strokeLinecap="round">
        <line x1={46} y1={28} x2={104} y2={28} />
      </g>

      <line x1={45} y1={122} x2={57} y2={122} stroke="#1b2a4a" strokeWidth={1.5} strokeLinecap="round" />

      <g
        fill="#1b2a4a"
        fontSize={13}
        fontFamily="inherit"
        textAnchor="start"
        style={{ direction: "ltr", unicodeBidi: "isolate" }}
      >
        <text x={46} y={62}>
          12 + 35 =
        </text>
        <text x={46} y={92}>
          9 × 7 =
        </text>
        <text x={51} y={118} fontSize={10} textAnchor="middle">
          2
        </text>
        <text x={51} y={132} fontSize={10} textAnchor="middle">
          3
        </text>
        <text x={62} y={126}>
          × 6 =
        </text>
      </g>

      <g transform="rotate(24 168 96)">
        <rect x={160} y={30} width={17} height={78} rx={3} fill="#f2b705" />
        <rect x={160} y={30} width={17} height={12} rx={3} fill="#d64541" />
        <path d="M160 108 L168.5 128 L177 108 Z" fill="#fcd9a4" />
        <path d="M164 118 L168.5 128 L173 118 Z" fill="#1b2a4a" />
      </g>
    </svg>
  );
}
