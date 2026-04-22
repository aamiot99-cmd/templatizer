import { useState } from 'react'
import type { WidgetRendererProps } from '../../../types'
import styles from './sharepoint.module.css'

interface LinkItem {
  label: string
  url: string
  icon: string
}

const DEFAULT_LINKS: LinkItem[] = [
  { label: 'Trombinoscope', url: '#', icon: 'users' },
  { label: 'Politique de télétravail', url: '#', icon: 'document' },
  { label: 'Charte graphique', url: '#', icon: 'palette' },
  { label: 'Plan du site', url: '#', icon: 'map' },
]

function parseLinks(raw: string): LinkItem[] {
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as LinkItem[]
  } catch { /* ignore */ }
  return DEFAULT_LINKS
}

function IconUsers({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      <path d="M21 21v-2a4 4 0 0 0-3-3.85" />
    </svg>
  )
}

function IconDocument({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  )
}

function IconPalette({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="1" />
      <circle cx="17.5" cy="10.5" r="1" />
      <circle cx="8.5" cy="7.5" r="1" />
      <circle cx="6.5" cy="12.5" r="1" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  )
}

function IconMap({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  )
}

function LinkIcon({ name, size }: { name: string; size: number }) {
  switch (name) {
    case 'users': return <IconUsers size={size} />
    case 'document': return <IconDocument size={size} />
    case 'palette': return <IconPalette size={size} />
    case 'map': return <IconMap size={size} />
    default: return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    )
  }
}

function CardItem({ link }: { link: LinkItem }) {
  return (
    <a href={link.url} className={styles.card}>
      <span className={styles.cardIconArea}>
        <span className={styles.cardIcon}><LinkIcon name={link.icon} size={40} /></span>
      </span>
      <span className={styles.cardLabelArea}>
        <span className={styles.cardLabel}>{link.label}</span>
      </span>
    </a>
  )
}

function PelliculeCarousel({ links, cols }: { links: LinkItem[]; cols: number }) {
  const [page, setPage] = useState(0)
  const pageCount = Math.ceil(links.length / cols)
  const visible = links.slice(page * cols, (page + 1) * cols)

  return (
    <>
      <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '12px' }}>
        {visible.map((link, i) => <CardItem key={i} link={link} />)}
      </div>
      {pageCount > 1 && (
        <div className={styles.pelliculeNav}>
          <button
            className={styles.navArrow}
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
          >‹</button>
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              className={i === page ? styles.navDotActive : styles.navDot}
              onClick={() => setPage(i)}
            />
          ))}
          <button
            className={styles.navArrow}
            onClick={() => setPage(p => Math.min(pageCount - 1, p + 1))}
            disabled={page === pageCount - 1}
          >›</button>
        </div>
      )}
    </>
  )
}

const COLS_BY_SIZE: Record<string, number> = {
  full: 4,
  'two-thirds': 3,
  half: 2,
  'one-third': 1,
}

export function SharepointQuickLinks({ config, size }: WidgetRendererProps) {
  const layout = (config.layout as string) || 'compact'
  const title = (config.title as string) || 'Liens utiles'
  const showTitle = (config.showTitle as boolean) ?? true
  const rawLinks = (config.links as string) || JSON.stringify(DEFAULT_LINKS)
  const links = parseLinks(rawLinks)
  const cols = COLS_BY_SIZE[size] ?? 4

  const gridStyle = { gridTemplateColumns: `repeat(${cols}, 1fr)` }

  return (
    <div className={styles.widget}>
      {showTitle && <div className={styles.widgetTitle}>{title}</div>}

      {layout === 'compact' && (
        <div className={styles.grid} style={gridStyle}>
          {links.map((link, i) => (
            <a key={i} href={link.url} className={styles.compactItem}>
              <span className={styles.compactIcon}><LinkIcon name={link.icon} size={20} /></span>
              <span className={styles.compactLabel}>{link.label}</span>
            </a>
          ))}
        </div>
      )}

      {layout === 'liste' && (
        <div className={styles.grid} style={gridStyle}>
          {links.map((link, i) => (
            <a key={i} href={link.url} className={styles.listItem}>
              <span className={styles.listIcon}><LinkIcon name={link.icon} size={20} /></span>
              <span className={styles.listLabel}>{link.label}</span>
            </a>
          ))}
        </div>
      )}

      {layout === 'pellicule' && <PelliculeCarousel links={links} cols={cols} />}

      {layout === 'grille' && (
        <div className={styles.grid} style={{ ...gridStyle, gap: '12px' }}>
          {links.map((link, i) => <CardItem key={i} link={link} />)}
        </div>
      )}

      {layout === 'bouton' && (
        <div className={styles.grid} style={{ ...gridStyle, gap: '16px' }}>
          {links.map((link, i) => (
            <a key={i} href={link.url} className={styles.btnItem}>
              <span className={styles.btnIcon}><LinkIcon name={link.icon} size={20} /></span>
              <span className={styles.btnLabel}>{link.label}</span>
            </a>
          ))}
        </div>
      )}

      {layout === 'vignettes' && (
        <div className={styles.vignetteGrid}>
          {links.map((link, i) => (
            <a key={i} href={link.url} className={styles.vignette}>
              <span className={styles.vignetteIcon}><LinkIcon name={link.icon} size={28} /></span>
              <span className={styles.vignetteLabel}>{link.label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
