import type { WidgetRendererProps } from '../../../types'
import styles from './jint.module.css'

const HERO_IMAGE = '/news/pexels-brunogobofoto-3861712.jpg'

const SIDE_ARTICLES: Array<{
  image: string
  title: string
  author: string
}> = [
  {
    image: '/news/pexels-jibarofoto-2774556.jpg',
    title: 'Résultats T1 2025',
    author: 'Jane Doe',
  },
  {
    image: '/news/pexels-runffwpu-2530124.jpg',
    title: 'Engagements durabilité',
    author: 'Marie Chamy',
  },
]

function initialsOf(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function JintNews({ config, branding }: WidgetRendererProps) {
  const title = (config.title as string) ?? `Actualités ${branding.name}`
  const heroTitle =
    (config.heroTitle as string) ??
    `Lancement du nouveau portail ${branding.name} — une nouvelle ère pour nos équipes`
  const author = (config.author as string) ?? 'Jane Doe'
  const date = (config.date as string) ?? '12 mars 2025'

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div className={styles.more}>Voir plus →</div>
      </div>
      <div className={styles.grid}>
        <div className={styles.hero}>
          <div
            className={styles.bgImage}
            style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          />
          <div className={styles.overlay}></div>
          <div className={styles.content}>
            <div className={styles.heroTitle}>{heroTitle}</div>
            <div className={styles.meta}>
              <div className={styles.avatar}>{initialsOf(author)}</div>
              <div className={styles.author}>
                {author} · {date}
              </div>
              <div className={styles.likes}>👍 24</div>
            </div>
          </div>
        </div>
        {SIDE_ARTICLES.map((article) => (
          <div key={article.title} className={styles.side}>
            <div
              className={styles.bgImage}
              style={{ backgroundImage: `url(${article.image})` }}
            />
            <div className={styles.sideOverlay}></div>
            <div className={styles.sideContent}>
              <div className={styles.sideTitle}>{article.title}</div>
              <div className={styles.meta}>
                <div className={styles.sideAvatar}>
                  {initialsOf(article.author)}
                </div>
                <div className={styles.sideAuthor}>{article.author}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
