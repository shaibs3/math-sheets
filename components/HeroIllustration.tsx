export default function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      role="img"
      aria-label="איור של דף תרגול מודפס ועיפרון"
      className={className}
    >
      <rect x={18} y={14} width={116} height="134" rx={8} fill="#dbe6fb" />
      <rect x={30} y={8} width={116} height="134" rx={8} fill="#ffffff" stroke="#c7d8f7" strokeWidth={2} />

      <g stroke="#2563eb" strokeWidth={3} strokeLinecap="round">
        <line x1={46} y1={28} x2={104} y2={28} />
      </g>

      <g
        fill="#0f172a"
        fontSize={13}
        fontFamily="inherit"
        textAnchor="start"
        style={{ direction: "ltr", unicodeBidi: "isolate" }}
      >
        <text x={46} y={57}>
          2/3 × 6 =
        </text>
        <text x={46} y={85}>
          25% · 80 =
        </text>
        <text x={46} y={113}>
          3 : 4
        </text>
      </g>

      <g stroke="#cbd5e1" strokeWidth={2} strokeLinecap="round" strokeDasharray="4 5">
        <line x1={46} y1={66} x2={128} y2={66} />
        <line x1={46} y1={94} x2={128} y2={94} />
        <line x1={46} y1={122} x2={128} y2={122} />
      </g>

      <g transform="rotate(24 168 96)">
        <rect x={160} y={30} width={17} height={78} rx={3} fill="#f59e0b" />
        <rect x={160} y={30} width={17} height={12} rx={3} fill="#ec4899" />
        <path d="M160 108 L168.5 128 L177 108 Z" fill="#fcd9a4" />
        <path d="M164 118 L168.5 128 L173 118 Z" fill="#0f172a" />
      </g>
    </svg>
  );
}
