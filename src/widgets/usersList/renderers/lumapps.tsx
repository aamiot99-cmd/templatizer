import type { WidgetRendererProps } from '../../../types'
import styles from './lumapps.module.css'

interface User {
  name: string
  email: string
  /** Optional gradient for a "real photo" effect; absent = blue silhouette icon. */
  photoGradient?: string
  photoEmoji?: string
}

const USERS: User[] = [
  { name: 'QUINTIN Sandrine',   email: 'sandrine.quintin@lecko.fr' },
  { name: 'Charlotte NGuyen',   email: 'charlotte.nguyen@lecko.fr' },
  { name: 'Hélène Soubiron',    email: 'helene.soubiron@lecko.fr' },
  { name: 'PERRIER Justine',    email: 'justine.perrier@lecko.fr' },
  { name: 'Mehdi Lahjouji',     email: 'mehdi.lahjouji@lecko.eu' },
  {
    name: 'Théo Dumont',
    email: 'tdumont@lecko.fr',
    photoGradient: 'linear-gradient(135deg, #f59e0b, #ea580c)',
    photoEmoji: '👨‍💻',
  },
  {
    name: 'Antoine Amiot',
    email: 'aamiot@lecko.fr',
    photoGradient: 'linear-gradient(135deg, #2563eb, #1e40afFF)',
    photoEmoji: '👨',
  },
]

function SilhouetteIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="#ffffff" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8H4z" />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M12 2 13.5 8 19 9.5 13.5 11 12 17 10.5 11 5 9.5 10.5 8 12 2zM19 14l.9 2.6 2.6.9-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9L19 14z" />
    </svg>
  )
}

export function LumappsUsersList({ config }: WidgetRendererProps) {
  const title = (config.title as string) || "L'équipe marketing"
  const maxItems = Math.max(3, Math.min(12, (config.maxItems as number) || 7))
  const users = USERS.slice(0, maxItems)

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <span className={styles.sparkle}>
          <SparkleIcon />
        </span>
        <h3 className={styles.title}>{title}</h3>
      </header>

      <ul className={styles.list}>
        {users.map((user) => (
          <li key={user.email} className={styles.item}>
            {user.photoGradient ? (
              <span
                className={styles.avatarPhoto}
                style={{ background: user.photoGradient }}
              >
                <span aria-hidden="true">{user.photoEmoji ?? '👤'}</span>
              </span>
            ) : (
              <span className={styles.avatarDefault}>
                <SilhouetteIcon />
              </span>
            )}
            <div className={styles.info}>
              <div className={styles.name}>{user.name}</div>
              <div className={styles.email}>{user.email}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
