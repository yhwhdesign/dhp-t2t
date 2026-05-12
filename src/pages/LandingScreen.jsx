import { landingStyles, shared, BG_URL, LOGO_URL } from '../styles'
const styles = { ...shared, ...landingStyles }

export default function LandingScreen({ onTech, onManager }) {
  return (
    <div style={styles.bgRoot}>
      {/* Blurred background image */}
      <div style={styles.bgImage} />
      {/* Dark overlay */}
      <div style={styles.bgOverlay} />

      {/* Content */}
      <div style={styles.bgContent}>
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