type Props = {
  topicId: string;
  className?: string;
};

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function FractionBar({ x, label, bottom }: { x: number; label: string; bottom: string }) {
  return (
    <g>
      <text x={x} y={17} textAnchor="middle" fontSize="13" fill="currentColor" stroke="none">
        {label}
      </text>
      <line x1={x - 7} y1={23} x2={x + 7} y2={23} />
      <text x={x} y={38} textAnchor="middle" fontSize="13" fill="currentColor" stroke="none">
        {bottom}
      </text>
    </g>
  );
}

function TwoFractions({ operator }: { operator: string }) {
  return (
    <g>
      <FractionBar x={11} label="1" bottom="2" />
      <text x={24} y={28} textAnchor="middle" fontSize="14" fill="currentColor" stroke="none">
        {operator}
      </text>
      <FractionBar x={37} label="3" bottom="4" />
    </g>
  );
}

const icons: Record<string, React.ReactNode> = {
  "kefel-shvarim": <TwoFractions operator="×" />,
  "hiluk-shvarim": <TwoFractions operator="÷" />,
  "hibur-hisur-shvarim": <TwoFractions operator="+" />,
  "helek-shel-kamut": (
    <g>
      <circle cx={24} cy={24} r={15} />
      <path d="M24 9 A15 15 0 0 1 39 24 L24 24 Z" fill="currentColor" stroke="none" opacity={0.35} />
      <line x1={24} y1={9} x2={24} y2={24} />
      <line x1={24} y1={24} x2={39} y2={24} />
    </g>
  ),
  "shvarim-asroniim": (
    <g>
      <rect x={8} y={12} width={32} height={24} rx={3} />
      <line x1={18} y1={12} x2={18} y2={36} />
      <line x1={30} y1={12} x2={30} y2={36} />
      <rect x={8} y={12} width={10} height={24} fill="currentColor" stroke="none" opacity={0.3} />
      <circle cx={24} cy={40} r={1.6} fill="currentColor" stroke="none" />
    </g>
  ),
  achuzim: (
    <g>
      <circle cx={24} cy={24} r={15} />
      <path d="M9 24 A15 15 0 0 1 24 9" strokeWidth={5} />
      <circle cx={18} cy={18} r={2.5} />
      <circle cx={30} cy={30} r={2.5} />
      <line x1={31} y1={17} x2={17} y2={31} />
    </g>
  ),
  yachas: (
    <g>
      <rect x={9} y={22} width={10} height={17} rx={2} />
      <rect x={29} y={11} width={10} height={28} rx={2} />
      <circle cx={24} cy={20} r={1.6} fill="currentColor" stroke="none" />
      <circle cx={24} cy={30} r={1.6} fill="currentColor" stroke="none" />
    </g>
  ),
  "kne-mida": (
    <g>
      <path d="M9 14 L19 10 L29 14 L39 10 L39 34 L29 38 L19 34 L9 38 Z" />
      <line x1={19} y1={10} x2={19} y2={34} />
      <line x1={29} y1={14} x2={29} y2={38} />
      <circle cx={24} cy={22} r={2.5} />
    </g>
  ),
  "midot-asroniot": (
    <g>
      <rect x={7} y={17} width={34} height={14} rx={2} />
      <line x1={14} y1={17} x2={14} y2={25} />
      <line x1={20} y1={17} x2={20} y2={22} />
      <line x1={26} y1={17} x2={26} y2={25} />
      <line x1={32} y1={17} x2={32} y2={22} />
    </g>
  ),
  "maagal-veigul": (
    <g>
      <circle cx={24} cy={24} r={15} />
      <circle cx={24} cy={24} r={1.8} fill="currentColor" stroke="none" />
      <line x1={24} y1={24} x2={39} y2={24} strokeDasharray="3 3" />
    </g>
  ),
  nefach: (
    <g>
      <path d="M12 18 L24 12 L36 18 L36 32 L24 38 L12 32 Z" />
      <path d="M12 18 L24 24 L36 18" />
      <line x1={24} y1={24} x2={24} y2={38} />
    </g>
  ),
};

const fallbackIcon = (
  <g>
    <rect x={9} y={9} width={30} height={30} rx={4} />
    <line x1={17} y1={24} x2={31} y2={24} />
    <line x1={24} y1={17} x2={24} y2={31} />
  </g>
);

export default function TopicIcon({ topicId, className }: Props) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className} {...strokeProps}>
      {icons[topicId] ?? fallbackIcon}
    </svg>
  );
}
