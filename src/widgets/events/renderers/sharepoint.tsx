import { useState } from 'react'
import type { WidgetRendererProps } from '../../../types'
import styles from './sharepoint.module.css'

interface EventItem {
  title: string
  day: string
  month: string
  dateText: string
  image: string
}

const EVENTS: EventItem[] = [
  {
    title: 'Séminaire annuel des managers',
    day: '28',
    month: 'AVR.',
    dateText: 'lun. 28 avr., Journée entière',
    image: '/focus/pro-meeting.jpg',
  },
  {
    title: 'Formation : Prévention des risques',
    day: '5',
    month: 'MAI',
    dateText: 'lun. 5 mai, 09:00',
    image: '/news/pexels-brunogobofoto-3861712.jpg',
  },
  {
    title: 'Journée portes ouvertes',
    day: '15',
    month: 'MAI',
    dateText: 'ven. 15 mai, Journée entière',
    image: '/focus/handshake.jpg',
  },
  {
    title: 'Conférence RSE & Innovation',
    day: '22',
    month: 'MAI',
    dateText: 'ven. 22 mai, 14:00',
    image: '/news/pexels-jibarofoto-2774556.jpg',
  },
  {
    title: 'Team building – Marketing',
    day: '11-12',
    month: 'JUIN',
    dateText: 'jeu. 11 juin – ven. 12 juin',
    image: '/focus/teambuilding.jpg',
  },
]

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="2" width="14" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M1 6h14" stroke="currentColor" strokeWidth="1.5" />
      <rect x="4" y="0" width="1.5" height="4" rx="0.75" fill="currentColor" />
      <rect x="10.5" y="0" width="1.5" height="4" rx="0.75" fill="currentColor" />
    </svg>
  )
}

function DateBadge({ day, month, large }: { day: string; month: string; large?: boolean }) {
  return (
    <div className={[styles.dateBadge, large ? styles.dateBadgeLarge : ''].filter(Boolean).join(' ')}>
      <span className={styles.badgeMonth}>{month}</span>
      <span className={styles.badgeDay}>{day}</span>
    </div>
  )
}

function CompactCard({ event }: { event: EventItem }) {
  return (
    <div className={styles.compactCard}>
      <div className={styles.compactThumb}>
        <img src={event.image} alt="" className={styles.coverImg} />
        <DateBadge day={event.day} month={event.month} />
      </div>
      <div className={styles.compactInfo}>
        <div className={styles.compactTitle}>{event.title}</div>
        <div className={styles.compactDate}>{event.dateText}</div>
      </div>
    </div>
  )
}

function FilmCard({ event }: { event: EventItem }) {
  return (
    <div className={styles.filmCard}>
      <div className={styles.filmImage}>
        <img src={event.image} alt="" className={styles.coverImg} />
        <DateBadge day={event.day} month={event.month} large />
      </div>
      <div className={styles.filmBody}>
        <div className={styles.filmTitle}>{event.title}</div>
        <div className={styles.filmDate}>{event.dateText}</div>
        <div className={styles.filmCalIcon}><CalendarIcon /></div>
      </div>
    </div>
  )
}

function FilmStrip({ events, visibleCount }: { events: EventItem[]; visibleCount: number }) {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(events.length / visibleCount)
  const visible = events.slice(page * visibleCount, page * visibleCount + visibleCount)

  return (
    <div className={styles.filmStrip}>
      <div className={styles.filmCardsWrapper}>
        <div className={styles.filmCards} style={{ gridTemplateColumns: `repeat(${visibleCount}, 1fr)` }}>
          {visible.map((event, i) => <FilmCard key={page * visibleCount + i} event={event} />)}
        </div>
        <button
          className={`${styles.filmArrow} ${styles.filmArrowLeft}`}
          onClick={() => setPage(p => p - 1)}
          disabled={page === 0}
          aria-label="Précédent"
        >‹</button>
        <button
          className={`${styles.filmArrow} ${styles.filmArrowRight}`}
          onClick={() => setPage(p => p + 1)}
          disabled={page >= totalPages - 1}
          aria-label="Suivant"
        >›</button>
      </div>
      <div className={styles.dots}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={[styles.dot, i === page ? styles.dotActive : ''].filter(Boolean).join(' ')}
            onClick={() => setPage(i)}
            aria-label={`Page ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export function SharepointEvents({ config, size }: WidgetRendererProps) {
  const title = (config.title as string) || 'Évènements'
  const showTitle = (config.showTitle as boolean) ?? true
  const layout = (config.layout as string) || 'compact'
  const effectiveLayout = size === 'one-third' ? 'compact' : layout

  const filmCols = size === 'full' ? 4 : size === 'two-thirds' ? 3 : 2
  const compactCols = size === 'full' ? 4 : size === 'one-third' ? 1 : 2

  const countMode = (config.countMode as string) || 'auto'
  const configItemCount = (config.itemCount as number) || 3
  const displayEvents = countMode === 'manual'
    ? EVENTS.slice(0, configItemCount)
    : effectiveLayout === 'filmstrip'
      ? EVENTS
      : EVENTS.slice(0, compactCols)

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        {showTitle && <h2 className={styles.title}>{title}</h2>}
        <a className={styles.viewAll} href="#">Afficher tout</a>
      </div>
      <button className={styles.addEvent}>+ Ajouter un événement</button>
      {effectiveLayout === 'filmstrip' ? (
        <FilmStrip events={displayEvents} visibleCount={filmCols} />
      ) : (
        <div
          className={styles.compactGrid}
          style={{ gridTemplateColumns: `repeat(${compactCols}, 1fr)` }}
        >
          {displayEvents.map((event, i) => <CompactCard key={i} event={event} />)}
        </div>
      )}
    </div>
  )
}
