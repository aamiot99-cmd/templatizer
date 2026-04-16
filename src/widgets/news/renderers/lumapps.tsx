import type { WidgetRendererProps } from '../../../types'
import styles from './lumapps.module.css'

export function LumappsNews({ config, branding }: WidgetRendererProps) {
  const title =
    (config.title as string) ??
    `${branding.name} 2025 — New digital workplace experience now live for all employees`
  const tagLabel = (config.tagLabel as string) ?? 'Featured'
  const showMetrics = (config.showMetrics as boolean) ?? true

  return (
    <div className={styles.topStories}>
      <div className={styles.featured}>
        <div className={styles.thumb}>🚀</div>
        <div className={styles.overlay}>
          <div className={styles.tags}>
            <span className={styles.tag}>{tagLabel}</span>
            <span className={`${styles.tag} ${styles.tagGhost}`}>Company</span>
            <span className={`${styles.tag} ${styles.tagGhost}`}>Digital</span>
          </div>
          <div className={styles.title}>{title}</div>
          <div className={styles.bottom}>
            {showMetrics && (
              <div className={styles.metrics}>
                <span className={styles.metric}>❤ 24</span>
                <span className={styles.metric}>💬 8</span>
              </div>
            )}
            <div className={styles.nav}>
              <div className={styles.arrow}>‹</div>
              <div className={styles.dots}>
                <div className={`${styles.dot} ${styles.dotOn}`}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
              </div>
              <div className={styles.arrow}>›</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
