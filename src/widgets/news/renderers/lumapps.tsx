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
  imageUrl: string
}

const STORIES: Story[] = [
  {
    category: 'Top Stories',
    title: 'Lecko fête ses 20 ans : 500 collaborateurs réunis pour célébrer cette étape',
    tags: ['France', 'Culture', 'Anniversaire'],
    reactions: 1,
    comments: 0,
    imageUrl: '/photos/team building.jpg',
  },
  {
    category: 'Top Stories',
    title: "Lancement du nouveau Digital Workplace : retour d'expérience des équipes pilotes",
    tags: ['Innovation', 'Digital', 'Témoignage'],
    reactions: 12,
    comments: 3,
    imageUrl: '/photos/meeting.jpg',
  },
  {
    category: 'Top Stories',
    title: 'Programme RSE 2026 : trois nouvelles initiatives engagées dès ce trimestre',
    tags: ['RSE', 'Engagement'],
    reactions: 8,
    comments: 2,
    imageUrl: '/photos/Office 3.jpg',
  },
  {
    category: 'Top Stories',
    title: 'Recrutement : Lecko se renforce sur les expertises Data et IA',
    tags: ['Recrutement', 'Data', 'IA'],
    reactions: 4,
    comments: 1,
    imageUrl: '/photos/team building 2.jpg',
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
          <div
            className={styles.hero}
            style={{ backgroundImage: `url("${story.imageUrl}")` }}
          >
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
