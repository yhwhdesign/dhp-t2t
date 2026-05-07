export default function LandingScreen({ onTech, onManager }) {
  return (
    <div style={styles.root}>
      {/* Blurred background image */}
      <div style={styles.bgImage} />
      {/* Dark overlay */}
      <div style={styles.overlay} />

      {/* Content */}
      <div style={styles.content}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <img
            src="https://www.dhpace.com/wp-content/uploads/2026/01/DHP-100-Years-RGB_FULL-COLOR_368x60px.jpg"
            alt="DH Pace"
            style={styles.logo}
          />
        </div>

        <div style={styles.appBadge}>T2T Parts Transfer</div>

        {/* Role cards */}
        <div style={styles.cards}>
          <button style={styles.card} onClick={onTech}>
            <span style={styles.cardIcon}>🔧</span>
            <span style={styles.cardTitle}>Field Technician</span>
            <span style={styles.cardSub}>Log a parts transfer</span>
          </button>

          <button style={styles.card} onClick={onManager}>
            <span style={styles.cardIcon}>📊</span>
            <span style={styles.cardTitle}>Management</span>
            <span style={styles.cardSub}>Review & approve transfers</span>
          </button>
        </div>

        <p style={styles.footer}>© {new Date().getFullYear()} DH Pace Company</p>
      </div>
    </div>
  )
}

const BG_URL = 'https://www.dhpace.com/wp-content/uploads/2017/11/distribution-logistics-doors.jpg'

const styles = {
  root: {
    minHeight: '100vh',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bgImage: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${BG_URL})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(6px)',
    transform: 'scale(1.05)',
    zIndex: 0,
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(255,255,255,0.82)',
    zIndex: 1,
  },
  content: {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    maxWidth: 420,
    padding: '2rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    justifyContent: 'center',
    gap: '1.5rem',
  },
  logoWrap: {
    background: '#fff',
    borderRadius: 12,
    padding: '14px 20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  logo: {
    height: 40,
    objectFit: 'contain',
    display: 'block',
  },
  appBadge: {
    background: '#1a1a2e',
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    padding: '5px 14px',
    borderRadius: 20,
  },
  cards: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  card: {
    width: '100%',
    background: '#fff',
    border: 'none',
    borderRadius: 16,
    padding: '1.75rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.4rem',
    cursor: 'pointer',
    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  cardIcon: {
    fontSize: '2.5rem',
    marginBottom: '0.25rem',
  },
  cardTitle: {
    fontSize: '1.15rem',
    fontWeight: 800,
    color: '#1a1a2e',
  },
  cardSub: {
    fontSize: '0.82rem',
    color: '#888',
    fontWeight: 500,
  },
  footer: {
    fontSize: 11,
    color: '#aaa',
    marginTop: '1rem',
  },
}