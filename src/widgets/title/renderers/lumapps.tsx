import type { WidgetRendererProps } from '../../../types'
import styles from './lumapps.module.css'

export function LumappsTitle({ config, branding }: WidgetRendererProps) {
  const title = (config.title as string) || ''
  const subtitle = (config.subtitle as string) || ''
  const size = (config.size as 'small' | 'medium' | 'large') || 'large'
  const alignment = (config.alignment as 'left' | 'center') || 'left'
  const showSeparator = config.showSeparator !== false

  if (!title && !subtitle) {
    return <div className={styles.empty}>Renseignez un titre de section.</div>
  }

  return (
    <div className={styles.root} data-align={alignment}>
      {title && (
        <h2 className={styles.title} data-size={size}>
          {title}
        </h2>
      )}
      {showSeparator && (
        <div
          className={styles.separator}
          style={{ background: branding.colors.primary }}
        />
      )}
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  )
}
