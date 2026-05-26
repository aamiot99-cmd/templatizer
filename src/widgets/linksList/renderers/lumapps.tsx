import type { WidgetRendererProps } from '../../../types'
import styles from './lumapps.module.css'

interface LinkItem {
  icon: string
  iconColor: string
  label: string
  description: string
}

const LINKS: LinkItem[] = [
  { icon: '📅', iconColor: '#1a73e8', label: 'Mon agenda', description: 'Accéder à Google Calendar' },
  { icon: '💼', iconColor: '#0f9d58', label: 'Espace RH', description: 'Congés, paie, formations' },
  { icon: '📁', iconColor: '#f4b400', label: 'Drive partagé', description: 'Documents équipes' },
  { icon: '💬', iconColor: '#db4437', label: 'Chat Teams', description: 'Conversations internes' },
  { icon: '📞', iconColor: '#9334e6', label: 'Annuaire', description: 'Numéros et contacts' },
  { icon: '🎫', iconColor: '#fb8c00', label: 'Support IT', description: 'Ouvrir un ticket' },
]

export function LumappsLinksList({ config, branding }: WidgetRendererProps) {
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
                background: `color-mix(in srgb, ${item.iconColor} 15%, transparent)`,
              }}
            >
              {item.icon}
            </span>
            <div className={styles.body}>
              <div className={styles.label} style={{ color: branding.colors.primary }}>
                {item.label}
              </div>
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
