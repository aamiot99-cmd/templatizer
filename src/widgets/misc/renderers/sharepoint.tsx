import type { WidgetRendererProps } from '../../../types'
import styles from './sharepoint.module.css'

const HEIGHT: Record<string, string> = {
  petit: '240px',
  moyen: '360px',
  grand: '480px',
}

export function SharepointMisc({ config, branding }: WidgetRendererProps) {
  const title = (config.title as string) || 'Autre widget'
  const showTitle = (config.showTitle as boolean) ?? true
  const description = (config.description as string) || 'Widget à intégrer'
  const size = (config.size as string) || 'moyen'
  const primary = branding.colors.primary

  return (
    <div className={styles.widget}>
      {showTitle && (
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </div>
      )}
      <div className={styles.body} style={{ minHeight: HEIGHT[size] ?? HEIGHT.moyen }}>
        <div className={styles.badge} style={{ borderColor: primary }}>
          <div className={styles.badgeIcon} style={{ background: primary }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" opacity=".9"/>
              <rect x="11" y="1" width="6" height="6" rx="1" fill="currentColor" opacity=".9"/>
              <rect x="1" y="11" width="6" height="6" rx="1" fill="currentColor" opacity=".9"/>
              <rect x="11" y="11" width="6" height="6" rx="1" fill="currentColor" opacity=".9"/>
            </svg>
          </div>
          <span className={styles.badgeText}>{description}</span>
        </div>
      </div>
    </div>
  )
}
