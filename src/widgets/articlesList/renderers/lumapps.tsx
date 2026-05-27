import type { WidgetRendererProps } from '../../../types'
import styles from './lumapps.module.css'

interface Article {
  authorName: string
  authorEmail: string
  authorColor: string
  badgeLetter: string
  badgeColor: string
  publishedOn: string
  community: string
  title: string
  excerpt: string
  reactions: number
  comments: number
  thumbGradient: string
}

const ARTICLES: Article[] = [
  {
    authorName: 'Stephen Bronson',
    authorEmail: 'stephen.bronson@acme.com',
    authorColor: '#0ea5e9',
    badgeLetter: 'A',
    badgeColor: '#16a34a',
    publishedOn: '16 mai 2026',
    community: 'NORA',
    title: 'Writing Procedures for SMEs',
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et ligula non nibh tincidunt tristique sed sit amet neque. Ut eleifend augue et…",
    reactions: 0,
    comments: 2,
    thumbGradient: 'linear-gradient(135deg, #fbbf24, #b45309)',
  },
  {
    authorName: 'Stephen Bronson',
    authorEmail: 'stephen.bronson@acme.com',
    authorColor: '#0ea5e9',
    badgeLetter: 'A',
    badgeColor: '#16a34a',
    publishedOn: '28 mai 2026',
    community: 'NORA',
    title: '4 Team Building Strategies for Team Productivity',
    excerpt:
      'Mark Johnson wants to help you improve your social skills within your team and explore the strategies that yield the best results in the field.',
    reactions: 0,
    comments: 2,
    thumbGradient: 'linear-gradient(135deg, #f472b6, #be185d)',
  },
  {
    authorName: 'Camille Vasseur',
    authorEmail: 'camille.vasseur@example.com',
    authorColor: '#7c3aed',
    badgeLetter: 'L',
    badgeColor: '#0f766e',
    publishedOn: '21 mai 2026',
    community: 'LeckoLab',
    title: 'Comment notre Digital Workplace a fait gagner 2 heures par semaine',
    excerpt:
      "Retour d'expérience sur 6 mois de déploiement et les leviers concrets observés sur les équipes pilotes.",
    reactions: 12,
    comments: 4,
    thumbGradient: 'linear-gradient(135deg, #34d399, #047857)',
  },
  {
    authorName: 'Hugo Lefranc',
    authorEmail: 'hugo.lefranc@example.com',
    authorColor: '#dc2626',
    badgeLetter: 'D',
    badgeColor: '#0369a1',
    publishedOn: '14 mai 2026',
    community: 'Data',
    title: 'Three patterns to keep your dashboards readable at scale',
    excerpt:
      'Why your line charts get unreadable past 8 series, and three layout tricks to fix it without sacrificing detail.',
    reactions: 17,
    comments: 9,
    thumbGradient: 'linear-gradient(135deg, #60a5fa, #1e40af)',
  },
]

/* Material icons (filled). */
function MIcon({ path, size = 14 }: { path: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={path} />
    </svg>
  )
}

const HEART_PATH =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
const COMMENT_PATH =
  'M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z'
const MORE_PATH =
  'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'

function authorInitials(name: string): string {
  return name.split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('') || '?'
}

function ArticleCard({
  article,
  variant = 'list',
  dots,
}: {
  article: Article
  variant?: 'list' | 'carousel'
  dots?: React.ReactNode
}) {
  return (
    <article className={styles.card} data-variant={variant}>
      <div className={styles.thumb} style={{ background: article.thumbGradient }} />
      <div className={styles.cardBody}>
        <header className={styles.authorRow}>
          <span
            className={styles.authorAvatar}
            style={{ background: article.authorColor }}
          >
            {authorInitials(article.authorName)}
          </span>
          <div className={styles.authorInfo}>
            <div className={styles.authorName}>{article.authorName}</div>
            <div className={styles.authorEmail}>{article.authorEmail}</div>
          </div>
          <span
            className={styles.communityBadge}
            style={{ background: article.badgeColor }}
            aria-hidden="true"
          >
            {article.badgeLetter}
          </span>
          <button type="button" className={styles.moreBtn} aria-label="Plus d'options">
            <MIcon path={MORE_PATH} size={16} />
          </button>
        </header>

        <div className={styles.publishedOn}>Publié le {article.publishedOn}</div>
        <div className={styles.community}>Dans {article.community}</div>

        <h4 className={styles.articleTitle}>{article.title}</h4>
        <p className={styles.excerpt}>{article.excerpt}</p>

        <div className={styles.actions}>
          <span className={styles.actionItem}>
            <MIcon path={HEART_PATH} />
            {article.reactions}
          </span>
          <span className={styles.actionItem}>
            <MIcon path={COMMENT_PATH} />
            {article.comments}
          </span>
        </div>

        {dots}
      </div>
    </article>
  )
}

export function LumappsArticlesList({ config }: WidgetRendererProps) {
  const title = (config.title as string) || 'Derniers articles'
  const maxItems = Math.max(2, Math.min(8, (config.maxItems as number) || 4))
  const layout = (config.layout as 'list' | 'carousel') || 'list'
  const items = ARTICLES.slice(0, maxItems)

  return (
    <div className={styles.root}>
      <h3 className={styles.title}>{title}</h3>

      {layout === 'list' ? (
        <div className={styles.listStack}>
          {items.map((article, i) => (
            <ArticleCard key={i} article={article} />
          ))}
        </div>
      ) : (
        <div className={styles.carousel}>
          <ArticleCard
            article={items[0]}
            variant="carousel"
            dots={
              <div className={styles.dots} aria-hidden="true">
                <button type="button" className={styles.dotArrow} aria-label="Précédent">‹</button>
                {items.map((_, i) => (
                  <span
                    key={i}
                    className={`${styles.dot} ${i === 0 ? styles.dotActive : ''}`}
                  />
                ))}
                <button type="button" className={styles.dotArrow} aria-label="Suivant">›</button>
              </div>
            }
          />
        </div>
      )}
    </div>
  )
}
