import type { WidgetRendererProps } from '../../../types'
import styles from './sharepoint.module.css'

export function SharepointNews({ config }: WidgetRendererProps) {
  const title = (config.title as string) ?? 'News'
  const emptyText =
    (config.emptyText as string) ?? 'No news posts are available right now'

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
      </div>
      <div className={styles.wp}>
        <svg
          className={styles.icon}
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
        >
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
          <line x1="18" y1="14" x2="10" y2="14" />
          <line x1="18" y1="10" x2="10" y2="10" />
          <line x1="12" y1="6" x2="10" y2="6" />
        </svg>
        <div className={styles.empty}>{emptyText}</div>
      </div>
    </div>
  )
}
