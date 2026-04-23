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
const COMPACT_COLS = 3
const COMPACT_ROWS = 3
const NON_COMPACT_ROWS = 1

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

function chunk<T>(items: T[], size: number): T[][] {
  if (size <= 0) return [items]
  const pages: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size))
  }
  return pages
}

export function JintApps({ config, size }: WidgetRendererProps) {
  const title = (config.title as string) ?? 'Mes applications'
  const tileCount = Number(config.tileCount ?? 11)
  const isCompact = size === 'one-third'
  const apps = DEFAULT_APPS.slice(0, tileCount)

  const gridRef = useRef<HTMLDivElement>(null)
  const [cols, setCols] = useState(isCompact ? COMPACT_COLS : 1)
  const [page, setPage] = useState(0)

  useEffect(() => {
    if (isCompact) {
      setCols(COMPACT_COLS)
      setPage(0)
      return
    }
    if (!gridRef.current) return
    const el = gridRef.current
    const update = () => {
      const width = el.clientWidth
      const c = Math.max(
        1,
        Math.floor((width + TILE_GAP) / (TILE_SIZE + TILE_GAP)),
      )
      setCols(c)
      setPage(0)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [isCompact])

  const rows = isCompact ? COMPACT_ROWS : NON_COMPACT_ROWS
  const perPage = Math.max(1, cols * rows)
  const pages = chunk(apps, perPage)
  const totalPages = pages.length

  // Page grid template: compact uses 1fr columns (tiles are aspect-ratio 1 in
  // CSS and stay square); non-compact uses fixed TILE_SIZE cells so tiles are
  // a consistent 100px.
  const pageGridStyle = isCompact
    ? {
        gridTemplateColumns: `repeat(${COMPACT_COLS}, 1fr)`,
      }
    : {
        gridTemplateColumns: `repeat(${cols}, ${TILE_SIZE}px)`,
        gridTemplateRows: `repeat(${rows}, ${TILE_SIZE}px)`,
      }

  return (
    <div className={styles.widget}>
      <div className={styles.header}>{title}</div>
      <div
        ref={gridRef}
        className={`${styles.grid} ${isCompact ? styles.gridCompact : ''}`}
      >
        <div className={styles.clip}>
          <div
            className={styles.track}
            style={{
              width: `${totalPages * 100}%`,
              transform: `translateX(-${(page * 100) / totalPages}%)`,
            }}
          >
            {pages.map((pageApps, idx) => (
              <div
                key={idx}
                className={styles.page}
                style={{
                  width: `${100 / totalPages}%`,
                  ...pageGridStyle,
                }}
              >
                {pageApps.map((app) => (
                  <div key={app.label} className={styles.tile}>
                    <img src={app.icon} alt={app.label} className={styles.icon} />
                    <div className={styles.label}>{app.label}</div>
                  </div>
                ))}
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
