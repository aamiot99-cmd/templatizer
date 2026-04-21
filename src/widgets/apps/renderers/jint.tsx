import { useRef, useState, useEffect } from 'react'
import type { WidgetRendererProps } from '../../../types'
import { PagerControls } from '../../_shared/PagerControls'
import styles from './jint.module.css'

interface AppItem {
  label: string
  icon: string
}

const TILE_SIZE = 100
const TILE_GAP = 10

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

export function JintApps({ config, size }: WidgetRendererProps) {
  const title = (config.title as string) ?? 'Mes applications'
  const tileCount = Number(config.tileCount ?? 6)
  const isCompact = size === 'compact'
  const apps = DEFAULT_APPS.slice(0, isCompact ? Math.min(tileCount, 9) : tileCount)

  const gridRef = useRef<HTMLDivElement>(null)
  const [perPage, setPerPage] = useState(apps.length)
  const [page, setPage] = useState(0)

  useEffect(() => {
    if (isCompact || !gridRef.current) return
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width
      const count = Math.max(1, Math.floor((width + TILE_GAP) / (TILE_SIZE + TILE_GAP)))
      setPerPage(count)
      setPage(0)
    })
    observer.observe(gridRef.current)
    return () => observer.disconnect()
  }, [isCompact, apps.length])

  const totalPages = isCompact ? 1 : Math.ceil(apps.length / perPage)
  const pageWidth = perPage * TILE_SIZE + (perPage - 1) * TILE_GAP
  const offset = isCompact ? 0 : page * (pageWidth + TILE_GAP)

  return (
    <div className={styles.widget}>
      <div className={styles.header}>{title}</div>
      <div
        ref={gridRef}
        className={`${styles.grid} ${isCompact ? styles.gridCompact : ''}`}
      >
        <div
          className={isCompact ? undefined : styles.clip}
          style={isCompact ? undefined : { width: pageWidth }}
        >
          <div
            className={styles.track}
            style={isCompact ? undefined : { transform: `translateX(-${offset}px)` }}
          >
          {apps.map((app) => (
            <div key={app.label} className={styles.tile}>
              <img src={app.icon} alt={app.label} className={styles.icon} />
              <div className={styles.label}>{app.label}</div>
            </div>
          ))}
          </div>
        </div>
      </div>
      <PagerControls
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        variant="light"
      />
    </div>
  )
}
