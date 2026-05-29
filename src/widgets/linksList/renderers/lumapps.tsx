import type { ReactNode } from 'react'
import type { WidgetRendererProps } from '../../../types'
import styles from './lumapps.module.css'

interface LinkItem {
  icon: ReactNode
  iconColor: string
  label: string
  description: string
}

/* Google Material-style icons (filled). */
function Icon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d={path} />
    </svg>
  )
}

const LINKS: LinkItem[] = [
  {
    icon: <Icon path="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />,
    iconColor: '#1a73e8',
    label: 'Mon agenda',
    description: 'Accéder à Google Calendar',
  },
  {
    icon: <Icon path="M20 6h-4V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zm-6 0h-4V4h4v2z" />,
    iconColor: '#0f9d58',
    label: 'Espace RH',
    description: 'Congés, paie, formations',
  },
  {
    icon: <Icon path="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z" />,
    iconColor: '#f4b400',
    label: 'Drive partagé',
    description: 'Documents équipes',
  },
  {
    icon: <Icon path="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />,
    iconColor: '#db4437',
    label: 'Chat Teams',
    description: 'Conversations internes',
  },
  {
    icon: <Icon path="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />,
    iconColor: '#9334e6',
    label: 'Annuaire',
    description: 'Numéros et contacts',
  },
  {
    icon: <Icon path="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />,
    iconColor: '#fb8c00',
    label: 'Support IT',
    description: 'Ouvrir un ticket',
  },
]

export function LumappsLinksList({ config }: WidgetRendererProps) {
  const title = (config.title as string) || 'Liens utiles'
  const layout = (config.layout as 'list' | 'grid') || 'list'
  const showDescriptions = config.showDescriptions !== false

  const items = layout === 'grid' ? LINKS.slice(0, 6) : LINKS.slice(0, 5)

  return (
    <div className={styles.root}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.list} data-layout={layout}>
        {items.map((item, i) => (
          <a key={i} className={styles.item}>
            <span
              className={styles.icon}
              style={{
                background: `color-mix(in srgb, ${item.iconColor} 14%, transparent)`,
                color: item.iconColor,
              }}
            >
              {item.icon}
            </span>
            <div className={styles.body}>
              <div className={styles.label}>{item.label}</div>
              {showDescriptions && (
                <div className={styles.description}>{item.description}</div>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
