import { useRef, useState, useEffect } from 'react'
import type { WidgetRendererProps } from '../../../types'
import styles from './jint.module.css'

interface NewMember {
  initials: string
  bgColor: string
  name: string
  role: string
  date: string
}

const CARD_WIDTH = 140
const CARD_GAP = 12

const DEFAULT_MEMBERS: NewMember[] = [
  {
    initials: 'ML',
    bgColor: '#e8440a',
    name: 'Marie-Laure B.',
    role: 'Product Designer',
    date: '13/03/2025',
  },
  {
    initials: 'TG',
    bgColor: '#7c3aed',
    name: 'Thomas Girard',
    role: 'Lead Developer',
    date: '15/03/2025',
  },
  {
    initials: 'SM',
    bgColor: '#0284c7',
    name: 'Sophie Martin',
    role: 'Project Manager',
    date: '17/03/2025',
  },
  {
    initials: 'AL',
    bgColor: '#16a34a',
    name: 'Alice Leblanc',
    role: 'Content Strategist',
    date: '24/03/2025',
  },
  {
    initials: 'JP',
    bgColor: '#d97706',
    name: 'Jean Petit',
    role: 'Data Analyst',
    date: '01/04/2025',
  },
  {
    initials: 'CR',
    bgColor: '#dc2626',
    name: 'Clara Rousseau',
    role: 'UX Researcher',
    date: '03/04/2025',
  },
  {
    initials: 'NB',
    bgColor: '#0891b2',
    name: 'Nicolas Blanc',
    role: 'DevOps Engineer',
    date: '07/04/2025',
  },
  {
    initials: 'LD',
    bgColor: '#7e22ce',
    name: 'Lucie Duval',
    role: 'Marketing Manager',
    date: '10/04/2025',
  },
]

function MemberCard({ person }: { person: NewMember }) {
  return (
    <div className={styles.card}>
      <div
        className={styles.avatar}
        style={{ backgroundColor: person.bgColor }}
      >
        <span>{person.initials}</span>
        <div className={styles.onlineBadge}>●</div>
      </div>
      <div className={styles.name}>{person.name}</div>
      <div className={styles.role}>{person.role}</div>
      <div className={styles.date}>{person.date}</div>
    </div>
  )
}

export function JintContacts({ config, size }: WidgetRendererProps) {
  const title = (config.title as string) ?? 'Nouveaux arrivants'
  const linkLabel = (config.linkLabel as string) ?? 'Annuaire →'
  const isCompact = size === 'compact'

  const gridRef = useRef<HTMLDivElement>(null)
  const [perPage, setPerPage] = useState(DEFAULT_MEMBERS.length)
  const [page, setPage] = useState(0)

  useEffect(() => {
    if (!gridRef.current) return
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width
      const count = Math.max(1, Math.floor((width + CARD_GAP) / (CARD_WIDTH + CARD_GAP)))
      setPerPage(count)
      setPage(0)
    })
    observer.observe(gridRef.current)
    return () => observer.disconnect()
  }, [])

  const totalPages = Math.ceil(DEFAULT_MEMBERS.length / perPage)
  const pageWidth = perPage * CARD_WIDTH + (perPage - 1) * CARD_GAP
  const offset = page * (pageWidth + CARD_GAP)

  return (
    <div className={`${styles.widget} ${isCompact ? styles.widgetCompact : ''}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <a href="#" className={styles.link}>
          {linkLabel}
        </a>
      </div>
      <div ref={gridRef} className={styles.grid}>
        <div className={styles.clip} style={{ width: pageWidth }}>
          <div
            className={styles.track}
            style={{ transform: `translateX(-${offset}px)` }}
          >
            {DEFAULT_MEMBERS.map((person) => (
              <MemberCard key={person.initials} person={person} />
            ))}
          </div>
        </div>
      </div>
      {totalPages > 1 && (
        <div className={styles.controls}>
          <button
            type="button"
            className={`${styles.arrow} ${page === 0 ? styles.arrowDisabled : ''}`}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            ‹
          </button>
          <div className={styles.dots}>
            {Array.from({ length: totalPages }, (_, i) => (
              <div
                key={i}
                className={`${styles.dot} ${i === page ? styles.dotActive : ''}`}
              />
            ))}
          </div>
          <button
            type="button"
            className={`${styles.arrow} ${page >= totalPages - 1 ? styles.arrowDisabled : ''}`}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}
