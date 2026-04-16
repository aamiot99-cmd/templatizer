import type { WidgetRendererProps } from '../../../types'
import styles from './jint.module.css'

interface AppItem {
  label: string
  icon: string
}

const DEFAULT_APPS: AppItem[] = [
  { label: 'Outlook', icon: '/app-icons/outlook.png' },
  { label: 'Teams', icon: '/app-icons/teams.png' },
  { label: 'SharePoint', icon: '/app-icons/sharepoint.png' },
  { label: 'OneDrive', icon: '/app-icons/onedrive.jpeg' },
  { label: 'Planner', icon: '/app-icons/planner.png' },
  { label: 'Copilot', icon: '/app-icons/Microsoft-Copilot-Logo.png' },
  { label: 'Viva', icon: '/app-icons/viva.png' },
  { label: 'Power BI', icon: '/app-icons/powerbi.png' },
  { label: 'Salesforce', icon: '/app-icons/salesforce.png' },
  { label: 'SAP', icon: '/app-icons/sap.png' },
  { label: 'Slack', icon: '/app-icons/slack.png' },
]

export function JintApps({ config }: WidgetRendererProps) {
  const title = (config.title as string) ?? 'Mes applications'
  const tileCount = Number(config.tileCount ?? 6)
  const apps = DEFAULT_APPS.slice(0, tileCount)

  return (
    <div className={styles.widget}>
      <div className={styles.header}>{title}</div>
      <div className={styles.grid}>
        {apps.map((app) => (
          <div key={app.label} className={styles.tile}>
            <img src={app.icon} alt={app.label} className={styles.icon} />
            <div className={styles.label}>{app.label}</div>
          </div>
        ))}
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowDisabled}`}
        >
          ‹
        </button>
        <div className={styles.dots}>
          <div className={`${styles.dot} ${styles.dotActive}`}></div>
          <div className={styles.dot}></div>
        </div>
        <button type="button" className={styles.arrow}>
          ›
        </button>
      </div>
    </div>
  )
}
