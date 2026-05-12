export default function PartPhotoPlaceholder({ size = 'large' }) {
  const isLarge = size === 'large'
  const w = isLarge ? '100%' : 36
  const h = isLarge ? '180px' : 36

  return (
    <div style={{
      width: w,
      height: h,
      background: 'linear-gradient(135deg, #1a1a2e 0%, #2d6a4f 100%)',
      borderRadius: isLarge ? 10 : 6,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: isLarge ? 8 : 0,
    }}>
      <svg
        width={isLarge ? 48 : 20}
        height={isLarge ? 48 : 20}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gear/cog icon */}
        <path
          d="M24 30a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M38.4 24c0-.6 0-1.2-.1-1.8l3.9-3a1 1 0 0 0 .2-1.3l-3.7-6.4a1 1 0 0 0-1.2-.4l-4.6 1.8a13.4 13.4 0 0 0-3.1-1.8L29 6.5a1 1 0 0 0-1-.9h-7.4a1 1 0 0 0-1 .9l-.7 4.6a13.4 13.4 0 0 0-3.1 1.8L11.2 11a1 1 0 0 0-1.2.4L6.3 17.8a1 1 0 0 0 .2 1.3l3.9 3A13.8 13.8 0 0 0 10.3 24c0 .6 0 1.2.1 1.8l-3.9 3a1 1 0 0 0-.2 1.3l3.7 6.4a1 1 0 0 0 1.2.4l4.6-1.8c1 .7 2 1.3 3.1 1.8l.7 4.6a1 1 0 0 0 1 .9H28a1 1 0 0 0 1-.9l.7-4.6a13.4 13.4 0 0 0 3.1-1.8l4.6 1.8a1 1 0 0 0 1.2-.4l3.7-6.4a1 1 0 0 0-.2-1.3l-3.9-3c.1-.6.2-1.2.2-1.8z"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {isLarge && (
        <span style={{
          color: 'rgba(255,255,255,0.6)',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          No Photo
        </span>
      )}
    </div>
  )
}