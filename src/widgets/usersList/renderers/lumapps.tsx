import type { WidgetRendererProps } from '../../../types'
import styles from './lumapps.module.css'

interface User {
  initials: string
  name: string
  role: string
  color: string
}

const USERS: User[] = [
  { initials: 'AM', name: 'Antoine Amiot',  role: 'Lead Designer',     color: '#1a73e8' },
  { initials: 'TD', name: 'Théo Dumont',    role: 'Senior Engineer',   color: '#0f9d58' },
  { initials: 'CM', name: 'Clara Martin',   role: 'Product Manager',   color: '#db4437' },
  { initials: 'LB', name: 'Léa Bernard',    role: 'Marketing',         color: '#9334e6' },
  { initials: 'SD', name: 'Samuel Dupont',  role: 'Sales',             color: '#fb8c00' },
  { initials: 'MR', name: 'Marie Roussel',  role: 'RH',                color: '#00897b' },
  { initials: 'JL', name: 'Julien Lefèvre', role: 'Support client',    color: '#f4b400' },
  { initials: 'NP', name: 'Nathalie Petit', role: 'Finance',           color: '#5e35b1' },
  { initials: 'OG', name: 'Olivier Garcia', role: 'Architecte SI',     color: '#039be5' },
  { initials: 'EN', name: 'Élise Noir',     role: 'Data scientist',    color: '#43a047' },
  { initials: 'PV', name: 'Paul Vidal',     role: 'Ops',               color: '#e53935' },
  { initials: 'CH', name: 'Camille Henry',  role: 'Direction générale', color: '#3949ab' },
]

export function LumappsUsersList({ config }: WidgetRendererProps) {
  const title = (config.title as string) || 'Notre équipe'
  const layout = (config.layout as 'grid' | 'list') || 'grid'
  const maxItems = Math.max(3, Math.min(12, (config.maxItems as number) || 6))
  const showRole = config.showRole !== false

  const users = USERS.slice(0, maxItems)

  return (
    <div className={styles.root}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.list} data-layout={layout}>
        {users.map((user, i) => (
          <article key={i} className={styles.card}>
            <span
              className={styles.avatar}
              style={{
                background: `color-mix(in srgb, ${user.color} 20%, transparent)`,
                color: user.color,
              }}
            >
              {user.initials}
            </span>
            <div className={styles.info}>
              <div className={styles.name}>{user.name}</div>
              {showRole && <div className={styles.role}>{user.role}</div>}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
