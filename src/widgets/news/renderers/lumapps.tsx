import type { WidgetRendererProps } from '../../../types'
import styles from './lumapps.module.css'

interface Story {
  category: string
  title: string
  tags: string[]
  reactions: number
  comments: number
  gradient: string
  emoji: string
}

const STORIES: Story[] = [
  {
    category: 'Top Stories',
    title: 'Lecko fête ses 20 ans : 500 collaborateurs réunis pour célébrer cette étape',
    tags: ['France', 'Culture', 'Anniversaire'],
    reactions: 1,
    comments: 0,
    gradient: 'linear-gradient(135deg, #1e3a8a, #0e7490)',
    emoji: '🎉',
  },
  {
    category: 'Top Stories',
    title: "Lancement du nouveau Digital Workplace : retour d'expérience des équipes pilotes",
    tags: ['Innovation', 'Digital', 'Témoignage'],
    reactions: 12,
    comments: 3,
    gradient: 'linear-gradient(135deg, #047857, #65a30d)',
    emoji: '🚀',
  },
  {
    category: 'Top Stories',
    title: 'Programme RSE 2026 : trois nouvelles initiatives engagées dès ce trimestre',
    tags: ['RSE', 'Engagement'],
    reactions: 8,
    comments: 2,
    gradient: 'linear-gradient(135deg, #b45309, #ea580c)',
    emoji: '🌱',
  },
  {
    category: 'Top Stories',
    title: 'Recrutement : Lecko se renforce sur les expertises Data et IA',
    tags: ['Recrutement', 'Data', 'IA'],
    reactions: 4,
    comments: 1,
    gradient: 'linear-gradient(135deg, #7c3aed, #db2777)',
    emoji: '🤝',
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
            <span className={styles.heroEmoji}>{story.emoji}</span>
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
              <span className={styles.reactionItem}>👍 {story.reactions}</span>
              <span className={styles.reactionItem}>💬 {story.comments}</span>
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
            <a className={styles.seeMore} style={{ color: '#ffffff' }}>
              <span>See more</span>
              <span className={styles.seeMoreArrow}>›</span>
            </a>
          </footer>
        </article>
      </div>
    </div>
  )
}
