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
  shaon: (
    <g>
      <circle cx={24} cy={24} r={15} />
      <line x1={24} y1={24} x2={24} y2={14} />
      <line x1={24} y1={24} x2={31} y2={28} />
      <line x1={24} y1={9} x2={24} y2={11} />
      <line x1={39} y1={24} x2={37} y2={24} />
      <line x1={24} y1={39} x2={24} y2={37} />
      <line x1={9} y1={24} x2={11} y2={24} />
    </g>
  ),
  kesef: (
    <g>
      <circle cx={19} cy={20} r={10} />
      <circle cx={29} cy={29} r={10} />
      <line x1={29} y1={24} x2={29} y2={34} />
      <line x1={26} y1={27} x2={32} y2={27} />
      <line x1={26} y1={31} x2={32} y2={31} />
    </g>
  ),
  "yashar-hamisparim": (
    <g>
      <line x1={7} y1={28} x2={41} y2={28} />
      <path d="M37 24 L41 28 L37 32" />
      <line x1={13} y1={22} x2={13} y2={34} />
      <line x1={22} y1={22} x2={22} y2={34} />
      <line x1={31} y1={22} x2={31} y2={34} />
      <circle cx={22} cy={28} r={2.6} fill="currentColor" stroke="none" />
    </g>
  ),
  "luach-hakefel": (
    <g>
      <rect x={9} y={9} width={30} height={30} rx={3} />
      <line x1={19} y1={9} x2={19} y2={39} />
      <line x1={9} y1={19} x2={39} y2={19} />
      <line x1={24} y1={26} x2={34} y2={36} />
      <line x1={34} y1={26} x2={24} y2={36} />
    </g>
  ),
  "shetach-vehekef-malben": (
    <g>
      <rect x={8} y={14} width={32} height={20} rx={2} />
      <line x1={8} y1={38} x2={40} y2={38} strokeDasharray="3 3" />
      <line x1={44} y1={14} x2={44} y2={34} strokeDasharray="3 3" />
    </g>
  ),
  "nefach-teiva": (
    <g>
      <path d="M12 18 L24 12 L36 18 L36 32 L24 38 L12 32 Z" />
      <path d="M12 18 L24 24 L36 18" />
      <line x1={24} y1={24} x2={24} y2={38} />
    </g>
  ),
  "shetach-mishulash-umakbilit": (
    <g>
      <path d="M9 36 L24 12 L39 36 Z" />
      <line x1={24} y1={12} x2={24} y2={36} strokeDasharray="3 3" />
    </g>
  ),
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
  "misparim-mechuvanim": (
    <g>
      <line x1={6} y1={24} x2={42} y2={24} />
      <line x1={24} y1={19} x2={24} y2={29} />
      <line x1={10} y1={24} x2={16} y2={24} strokeWidth={4} />
      <line x1={32} y1={24} x2={38} y2={24} strokeWidth={4} />
      <line x1={35} y1={21} x2={35} y2={27} strokeWidth={4} />
    </g>
  ),
  zaviot: (
    <g>
      <path d="M10 36 L38 36" />
      <path d="M10 36 L34 14" />
      <path d="M22 36 A12 12 0 0 0 20 27" />
    </g>
  ),
  pitagoras: (
    <g>
      <path d="M12 36 L36 36 L12 14 Z" />
      <path d="M12 30 L18 30 L18 36" />
    </g>
  ),
  galil: (
    <g>
      <ellipse cx={24} cy={14} rx={12} ry={5} />
      <line x1={12} y1={14} x2={12} y2={34} />
      <line x1={36} y1={14} x2={36} y2={34} />
      <path d="M12 34 A12 5 0 0 0 36 34" />
    </g>
  ),
  "funktsia-kavit": (
    <g>
      <line x1={10} y1={38} x2={40} y2={38} />
      <line x1={10} y1={38} x2={10} y2={10} />
      <line x1={13} y1={34} x2={38} y2={14} />
    </g>
  ),
  "funktsia-ribuit": (
    <g>
      <line x1={10} y1={38} x2={40} y2={38} />
      <line x1={10} y1={38} x2={10} y2={10} />
      <path d="M14 14 Q24 42 38 14" />
    </g>
  ),
  parabola: (
    <g>
      <line x1={10} y1={38} x2={40} y2={38} />
      <line x1={10} y1={38} x2={10} y2={10} />
      <path d="M14 14 Q24 42 38 14" />
    </g>
  ),
  trigonometria: (
    <g>
      <path d="M12 36 L36 36 L36 14 Z" />
      <path d="M22 36 A10 10 0 0 0 19 29" />
      <path d="M30 36 L30 30 L36 30" />
    </g>
  ),
  histabrut: (
    <g>
      <rect x={11} y={11} width={26} height={26} rx={5} />
      <circle cx={18} cy={18} r={2.4} fill="currentColor" stroke="none" />
      <circle cx={30} cy={30} r={2.4} fill="currentColor" stroke="none" />
      <circle cx={24} cy={24} r={2.4} fill="currentColor" stroke="none" />
    </g>
  ),
  "middey-merkaz": (
    <g>
      <line x1={9} y1={38} x2={39} y2={38} />
      <rect x={12} y={26} width={7} height={12} />
      <rect x={21} y={16} width={7} height={22} />
      <rect x={30} y={22} width={7} height={16} />
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
