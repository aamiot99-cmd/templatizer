import type { WidgetRendererProps } from '../../../types'
import styles from './lumapps.module.css'

interface CalEvent {
  day: string
  month: string
  title: string
  time: string
  location: string
}

const EVENTS: CalEvent[] = [
  { day: '28', month: 'mai', title: 'All-hands trimestriel', time: '10:00 - 11:30', location: 'Auditorium · Paris' },
  { day: '03', month: 'juin', title: "Lancement de l'offre 2026", time: '14:00 - 16:00', location: 'Visio Teams' },
  { day: '10', month: 'juin', title: 'Petit-déjeuner partenaires', time: '08:30 - 10:00', location: 'Lobby siège' },
  { day: '17', month: 'juin', title: 'Hackathon interne · Edition #5', time: 'Toute la journée', location: 'Campus innovation' },
  { day: '24', month: 'juin', title: 'Onboarding nouveaux arrivants', time: '09:00 - 12:00', location: 'Salle Lumière' },
  { day: '02', month: 'juil.', title: 'Retour d\'expérience client Alpha', time: '11:00 - 12:00', location: 'Visio Meet' },
]

export function LumappsCalendar({ config, branding }: WidgetRendererProps) {
  const title = (config.title as string) || 'Agenda'
  const maxItems = Math.max(1, Math.min(8, (config.maxItems as number) || 4))
  const showSeeAll = config.showSeeAll !== false
  const items = EVENTS.slice(0, maxItems)

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {showSeeAll && (
          <a className={styles.seeAll} style={{ color: branding.colors.primary }}>
            Voir tout
          </a>
        )}
      </header>
      <ul className={styles.list}>
        {items.map((ev, i) => (
          <li key={i} className={styles.item}>
            <div
              className={styles.dateBadge}
              style={{
                background: `color-mix(in srgb, ${branding.colors.primary} 12%, transparent)`,
                color: branding.colors.primary,
              }}
            >
              <span className={styles.day}>{ev.day}</span>
              <span className={styles.month}>{ev.month}</span>
            </div>
            <div className={styles.eventBody}>
              <div className={styles.eventTitle}>{ev.title}</div>
              <div className={styles.eventMeta}>
                <span>🕒 {ev.time}</span>
                <span>📍 {ev.location}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
