import type { WidgetRendererProps } from '../../../types'
import styles from './lumapps.module.css'

interface CalEvent {
  weekday: string
  day: string
  title: string
  timeLabel: string
}

interface MonthGroup {
  month: string
  events: CalEvent[]
}

const MONTHS: MonthGroup[] = [
  {
    month: 'Mai',
    events: [
      { weekday: 'Jeu', day: '28', title: 'All-hands trimestriel', timeLabel: 'De 10:00 à 11:30' },
      { weekday: 'Ven', day: '29', title: 'Petit-déjeuner partenaires', timeLabel: 'De 08:30 à 10:00' },
    ],
  },
  {
    month: 'Juin',
    events: [
      { weekday: 'Lun', day: '03', title: "Lancement de l'offre 2026", timeLabel: 'De 14:00 à 16:00' },
      { weekday: 'Mer', day: '17', title: 'Hackathon interne · Édition #5', timeLabel: 'Toute la journée' },
      { weekday: 'Mer', day: '24', title: 'Onboarding nouveaux arrivants', timeLabel: 'De 09:00 à 12:00' },
    ],
  },
]

export function LumappsCalendar({ config, branding }: WidgetRendererProps) {
  const title = (config.title as string) || 'Calendar'
  const maxItems = Math.max(1, Math.min(8, (config.maxItems as number) || 4))
  const showSeeAll = config.showSeeAll !== false

  // Flatten + cap to maxItems while keeping month grouping.
  const flat: { month: string; event: CalEvent }[] = []
  for (const group of MONTHS) {
    for (const ev of group.events) {
      if (flat.length >= maxItems) break
      flat.push({ month: group.month, event: ev })
    }
    if (flat.length >= maxItems) break
  }

  // Re-group capped list back into months for rendering.
  const visible: MonthGroup[] = []
  for (const { month, event } of flat) {
    const last = visible[visible.length - 1]
    if (last && last.month === month) {
      last.events.push(event)
    } else {
      visible.push({ month, events: [event] })
    }
  }

  return (
    <div className={styles.root}>
      <h3 className={styles.title}>{title}</h3>

      {visible.map((group) => (
        <div key={group.month} className={styles.monthBlock}>
          <div className={styles.monthHeader}>
            <span className={styles.monthLabel}>{group.month}</span>
            <span className={styles.monthRule} />
          </div>
          <ul className={styles.list}>
            {group.events.map((ev, i) => (
              <li key={i} className={styles.item}>
                <div className={styles.dateCol}>
                  <span className={styles.weekday}>{ev.weekday}</span>
                  <span className={styles.day}>{ev.day}</span>
                </div>
                <div
                  className={styles.eventCard}
                  style={{ background: branding.colors.primary }}
                >
                  <div className={styles.eventTitle}>{ev.title}</div>
                  <div className={styles.eventTime}>{ev.timeLabel}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {showSeeAll && (
        <button type="button" className={styles.moreButton}>
          <span>Plus</span>
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      )}
    </div>
  )
}
