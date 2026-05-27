import type { WidgetRendererProps } from '../../../types'
import styles from './lumapps.module.css'

interface Community {
  name: string
  description: string
  members: number
  bannerUrl: string
  iconLetter: string
  iconColor: string
}

const COMMUNITIES: Community[] = [
  {
    name: 'Tribu Design Système',
    description: 'Pour échanger autour de Material, Figma et des bonnes pratiques UI.',
    members: 142,
    bannerUrl: '/photos/Office 3.jpg',
    iconLetter: 'D',
    iconColor: '#4338ca',
  },
  {
    name: 'Club Café Innovation',
    description: 'Discussions hebdomadaires sur les tendances tech et les expérimentations internes.',
    members: 86,
    bannerUrl: '/photos/meeting 2.jpg',
    iconLetter: 'I',
    iconColor: '#c2410c',
  },
  {
    name: 'Réseau Mentors Lecko',
    description: 'Programme de mentorat ouvert à tous les collaborateurs de plus de 2 ans.',
    members: 54,
    bannerUrl: '/photos/team building 2.jpg',
    iconLetter: 'M',
    iconColor: '#047857',
  },
  {
    name: 'Sport & Bien-être',
    description: 'Running, yoga, escalade : retrouvez les groupes sport de tous les bureaux.',
    members: 213,
    bannerUrl: '/photos/team building.jpg',
    iconLetter: 'S',
    iconColor: '#be185d',
  },
  {
    name: 'Communauté Data',
    description: 'Échanges autour des projets data, du machine learning et des dashboards.',
    members: 67,
    bannerUrl: '/photos/Office.jpg',
    iconLetter: 'D',
    iconColor: '#0369a1',
  },
]

function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  )
}

export function LumappsCommunityList({ config, branding }: WidgetRendererProps) {
  const title = (config.title as string) || 'Communautés à rejoindre'
  const maxItems = Math.max(2, Math.min(8, (config.maxItems as number) || 4))
  const items = COMMUNITIES.slice(0, maxItems)

  return (
    <div className={styles.root}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.grid}>
        {items.map((c, i) => (
          <article key={i} className={styles.card}>
            <div
              className={styles.banner}
              style={{ backgroundImage: `url("${c.bannerUrl}")` }}
            />
            <div
              className={styles.iconAvatar}
              style={{ background: c.iconColor }}
            >
              {c.iconLetter}
            </div>
            <div className={styles.body}>
              <div className={styles.communityName}>{c.name}</div>
              <p className={styles.description}>{c.description}</p>
              <div className={styles.footer}>
                <span className={styles.members}>
                  <PeopleIcon />
                  {c.members} membres
                </span>
                <button
                  type="button"
                  className={styles.joinButton}
                  style={{
                    background: `color-mix(in srgb, ${branding.colors.primary} 14%, transparent)`,
                    color: branding.colors.primary,
                  }}
                >
                  Rejoindre
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
