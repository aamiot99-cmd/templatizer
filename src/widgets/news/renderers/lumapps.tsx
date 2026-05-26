import type { ReactNode } from 'react'
import type { WidgetRendererProps } from '../../../types'
import styles from './lumapps.module.css'

/* Google Material-style icons (filled). */
function MIcon({ path, size = 80 }: { path: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={path} />
    </svg>
  )
}

const THUMB_UP_PATH = 'M1 21h4V9H1v12zM23 10c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01.01-.08z'
const COMMENT_PATH = 'M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z'

interface Story {
  category: string
  title: string
  tags: string[]
  reactions: number
  comments: number
  gradient: string
  icon: ReactNode
}

const STORIES: Story[] = [
  {
    category: 'Top Stories',
    title: 'Lecko fête ses 20 ans : 500 collaborateurs réunis pour célébrer cette étape',
    tags: ['France', 'Culture', 'Anniversaire'],
    reactions: 1,
    comments: 0,
    gradient: 'linear-gradient(135deg, #1e3a8a, #0e7490)',
    icon: (
      <MIcon path="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
    ),
  },
  {
    category: 'Top Stories',
    title: "Lancement du nouveau Digital Workplace : retour d'expérience des équipes pilotes",
    tags: ['Innovation', 'Digital', 'Témoignage'],
    reactions: 12,
    comments: 3,
    gradient: 'linear-gradient(135deg, #047857, #65a30d)',
    icon: (
      <MIcon path="M9.19 6.35c-2.04 2.29-3.44 5.58-3.57 5.89L2 10.69l4.05-4.05c.47-.47 1.15-.68 1.81-.55l1.33.26zM11.17 17s3.74-1.55 5.89-3.7c5.4-5.4 4.5-9.62 4.21-10.57-.95-.3-5.17-1.19-10.57 4.21C8.55 9.09 7 12.83 7 12.83L11.17 17zm6.48-2.39c-2.29 2.04-5.58 3.44-5.89 3.57L13.31 22l4.05-4.05c.47-.47.68-1.15.55-1.81l-.26-1.53zM9 18c0 .83-.34 1.58-.88 2.12C6.94 21.3 2 22 2 22s.7-4.94 1.88-6.12A2.996 2.996 0 0 1 9 18zm4-9c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z" />
    ),
  },
  {
    category: 'Top Stories',
    title: 'Programme RSE 2026 : trois nouvelles initiatives engagées dès ce trimestre',
    tags: ['RSE', 'Engagement'],
    reactions: 8,
    comments: 2,
    gradient: 'linear-gradient(135deg, #b45309, #ea580c)',
    icon: (
      <MIcon path="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
    ),
  },
  {
    category: 'Top Stories',
    title: 'Recrutement : Lecko se renforce sur les expertises Data et IA',
    tags: ['Recrutement', 'Data', 'IA'],
    reactions: 4,
    comments: 1,
    gradient: 'linear-gradient(135deg, #7c3aed, #db2777)',
    icon: (
      <MIcon path="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    ),
  },
]

export function LumappsNews({ config, branding }: WidgetRendererProps) {
  const story = STORIES[0]
  const title = (config.title as string) || ''

  return (
    <div className={styles.root}>
      {title && <h3 className={styles.widgetTitle}>{title}</h3>}
      <div className={styles.frame}>
        <div className={styles.category}>{story.category}</div>
        <article className={styles.card}>
          <div className={styles.hero} style={{ background: story.gradient }}>
            <span className={styles.heroIcon}>{story.icon}</span>
            <div className={styles.heroOverlay}>
              <h4 className={styles.heroTitle}>{story.title}</h4>
              <div className={styles.tagRow}>
                {story.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <footer className={styles.footer}>
            <div className={styles.reactions}>
              <span className={styles.reactionItem}>
                <MIcon path={THUMB_UP_PATH} size={14} />
                {story.reactions}
              </span>
              <span className={styles.reactionItem}>
                <MIcon path={COMMENT_PATH} size={14} />
                {story.comments}
              </span>
            </div>
            <div className={styles.pagination}>
              <button type="button" className={styles.pagArrow} aria-label="Précédent">‹</button>
              {STORIES.map((_, i) => (
                <span
                  key={i}
                  className={`${styles.dot} ${i === 0 ? styles.dotActive : ''}`}
                />
              ))}
              <button type="button" className={styles.pagArrow} aria-label="Suivant">›</button>
            </div>
            <a
              className={styles.seeMore}
              style={{ background: branding.colors.primary }}
            >
              <span>See more</span>
              <span className={styles.seeMoreArrow}>›</span>
            </a>
          </footer>
        </article>
      </div>
    </div>
  )
}
