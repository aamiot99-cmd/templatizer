import type { WidgetRendererProps } from '../../../types'
import styles from './lumapps.module.css'

interface Community {
  name: string
  description: string
  bannerUrl: string
}

const COMMUNITIES: Community[] = [
  {
    name: 'Tribu Design Système',
    description: 'Pour échanger autour de Material, Figma et des bonnes pratiques UI.',
    bannerUrl: '/photos/Office 3.jpg',
  },
  {
    name: 'Club Café Innovation',
    description: 'Discussions hebdomadaires sur les tendances tech et les expérimentations internes.',
    bannerUrl: '/photos/meeting 2.jpg',
  },
  {
    name: 'Réseau Mentors Lecko',
    description: 'Programme de mentorat ouvert à tous les collaborateurs de plus de 2 ans.',
    bannerUrl: '/photos/team building 2.jpg',
  },
  {
    name: 'Sport & Bien-être',
    description: 'Running, yoga, escalade : retrouvez les groupes sport de tous les bureaux.',
    bannerUrl: '/photos/team building.jpg',
  },
  {
    name: 'Communauté Data',
    description: 'Échanges autour des projets data, du machine learning et des dashboards.',
    bannerUrl: '/photos/Office.jpg',
  },
]

export function LumappsCommunityList({ config }: WidgetRendererProps) {
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
            <div className={styles.body}>
              <div className={styles.communityName}>{c.name}</div>
              <p className={styles.description}>{c.description}</p>
              <a className={styles.followLink}>Suivre</a>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
