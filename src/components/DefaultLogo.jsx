export default function DefaultLogo({ size = 'medium' }) {
  const sizes = {
    small: { width: 80, height: 60, box: 28, fontSize: 10, sub: 8 },
    medium: { width: 120, height: 90, box: 42, fontSize: 15, sub: 11 },
    large: { width: 180, height: 130, box: 62, fontSize: 22, sub: 14 },
  }
  const s = sizes[size] || sizes.medium

  return (
    <svg
      width={s.width}
      height={s.height}
      viewBox={`0 0 ${s.width} ${s.height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background box shape */}
      <rect
        x={s.width / 2 - s.box / 2}
        y={4}
        width={s.box}
        height={s.box * 0.85}
        rx="6"
        fill="#1a1a2e"
      />

      {/* Box lid */}
      <rect
        x={s.width / 2 - s.box / 2 - 3}
        y={4}
        width={s.box + 6}
        height={s.box * 0.22}
        rx="4"
        fill="#2d6a4f"
      />

      {/* Lid center line */}
      <line
        x1={s.width / 2}
        y1={4}
        x2={s.width / 2}
        y2={4 + s.box * 0.22}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.5"
      />

      {/* Box tape stripe */}
      <rect
        x={s.width / 2 - 3}
        y={4 + s.box * 0.22}
        width={6}
        height={s.box * 0.63}
        fill="rgba(255,255,255,0.15)"
      />

      {/* T2T text */}
      <text
        x={s.width / 2}
        y={4 + s.box * 0.85 + s.fontSize + 6}
        textAnchor="middle"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontWeight="800"
        fontSize={s.fontSize}
        fill="#1a1a2e"
        letterSpacing="2"
      >
        T2T
      </text>

      {/* Parts Transfer subtitle */}
      <text
        x={s.width / 2}
        y={4 + s.box * 0.85 + s.fontSize + 6 + s.sub + 4}
        textAnchor="middle"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontWeight="500"
        fontSize={s.sub}
        fill="#888"
        letterSpacing="1"
      >
        PARTS TRANSFER
      </text>
    </svg>
  )
}