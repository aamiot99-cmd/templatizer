import type { WidgetRendererProps } from '../../../types'
import styles from './jint.module.css'

interface NewMember {
  initials: string
  bgColor: string
  name: string
  role: string
  date: string
}

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
]

export function JintContacts({ config }: WidgetRendererProps) {
  const title = (config.title as string) ?? 'Nouveaux arrivants'
  const linkLabel = (config.linkLabel as string) ?? 'Annuaire →'

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <a href="#" className={styles.link}>
          {linkLabel}
        </a>
      </div>
      <div className={styles.grid}>
        {DEFAULT_MEMBERS.map((person) => (
          <div key={person.initials} className={styles.card}>
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
        ))}
      </div>
    </div>
  )
}
