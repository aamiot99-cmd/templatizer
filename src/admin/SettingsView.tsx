import { useTheme } from '../lib/theme'
import styles from './SettingsView.module.css'

export function SettingsView() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className={styles.root}>
      <div>
        <h2 className={styles.heading}>Paramètres</h2>
        <p className={styles.subheading}>
          Personnalisez votre espace de travail Templatizer.
        </p>
      </div>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Apparence</h3>
        <label className={styles.row}>
          <div className={styles.rowText}>
            <span className={styles.rowLabel}>Mode sombre</span>
            <span className={styles.rowHint}>
              Bascule l'interface en thème sombre. Appliqué à toute l'application.
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isDark}
            className={`${styles.toggle} ${isDark ? styles.toggleOn : ''}`}
            onClick={toggleTheme}
          >
            <span className={styles.toggleThumb} />
          </button>
        </label>
      </section>
    </div>
  )
}
