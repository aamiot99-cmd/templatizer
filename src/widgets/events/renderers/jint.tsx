import type { WidgetRendererProps } from '../../../types'
import styles from './jint.module.css'

interface EventItem {
  day: string
  month: string
  title: string
  location: string
  time: string
}

const DEFAULT_EVENTS: EventItem[] = [
  {
    day: '12',
    month: 'Mai',
    title: 'Réunion stratégique trimestrielle',
    location: 'Salle Lumière',
    time: '14:00 – 16:00',
  },
  {
    day: '18',
    month: 'Mai',
    title: 'Point hebdo équipe produit',
    location: 'En visio',
    time: '10:00 – 11:00',
  },
  {
    day: '26',
    month: 'Mai',
    title: 'Team building Paris',
    location: 'Paris, France',
    time: 'Journée',
  },
]

export function JintEvents({ config }: WidgetRendererProps) {
  const title = (config.title as string) ?? 'Événements à venir'
  const showLocation = (config.showLocation as boolean) ?? true
  const maxEvents = Number(config.maxEvents ?? 3)
  const events = DEFAULT_EVENTS.slice(0, maxEvents)

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <button type="button" className={styles.viewAll}>
          Voir tout →
        </button>
      </div>
      <div className={styles.list}>
        {events.map((event) => (
          <div key={event.title} className={styles.card}>
            <div className={styles.dateBox}>
              <div className={styles.day}>{event.day}</div>
              <div className={styles.month}>{event.month}</div>
            </div>
            <div className={styles.content}>
              <div className={styles.title}>{event.title}</div>
              {showLocation && (
                <div className={styles.detail}>📍 {event.location}</div>
              )}
              <div className={styles.detail}>🕐 {event.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
