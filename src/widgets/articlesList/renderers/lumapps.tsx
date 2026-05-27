import type { WidgetRendererProps } from '../../../types'
import styles from './lumapps.module.css'

interface Article {
  category: string
  title: string
  excerpt: string
  author: string
  date: string
  thumbGradient: string
}

const ARTICLES: Article[] = [
  {
    category: 'RH',
    title: 'Nouveau dispositif de mobilité interne lancé ce trimestre',
    excerpt: 'Découvrez les modalités et les opportunités ouvertes aux collaborateurs avec ce nouveau programme.',
    author: 'Camille Vasseur',
    date: 'Aujourd\'hui',
    thumbGradient: 'linear-gradient(135deg, #60a5fa, #2563eb)',
  },
  {
    category: 'Innovation',
    title: 'Retour sur la 5ᵉ édition du Hackathon interne',
    excerpt: 'Quatre projets primés et plus de 80 participants : ce que retiennent les organisateurs.',
    author: 'Lucas Berthier',
    date: 'Hier',
    thumbGradient: 'linear-gradient(135deg, #c4b5fd, #7c3aed)',
  },
  {
    category: 'RSE',
    title: 'Notre engagement zéro déchet entre dans une nouvelle phase',
    excerpt: 'Trois actions concrètes mises en place dans tous les bureaux et leur impact mesuré.',
    author: 'Inès Moreau',
    date: 'Il y a 2 jours',
    thumbGradient: 'linear-gradient(135deg, #6ee7b7, #10b981)',
  },
  {
    category: 'Métier',
    title: 'Le rapport annuel d\'activité 2025 disponible en ligne',
    excerpt: 'Chiffres clés, faits marquants et perspectives 2026 — accessible à l\'ensemble des collaborateurs.',
    author: 'Hugo Lefranc',
    date: 'Il y a 4 jours',
    thumbGradient: 'linear-gradient(135deg, #fb923c, #ea580c)',
  },
  {
    category: 'Culture',
    title: 'Soirée des 20 ans : programme et inscriptions ouvertes',
    excerpt: 'Réservez votre soirée du 14 juin pour célébrer ensemble cet anniversaire.',
    author: 'Émilie Saint-Pierre',
    date: 'Il y a 1 semaine',
    thumbGradient: 'linear-gradient(135deg, #f472b6, #db2777)',
  },
]

function ArticleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" aria-hidden="true">
      <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 4H7v2h7V7zm0 4H7v2h7v-2zm-7 4h4v2H7v-2zM16 7h3v2h-3V7zm0 4h3v2h-3v-2zm0 4h3v2h-3v-2z" />
    </svg>
  )
}

export function LumappsArticlesList({ config, branding }: WidgetRendererProps) {
  const title = (config.title as string) || 'Derniers articles'
  const maxItems = Math.max(2, Math.min(8, (config.maxItems as number) || 4))
  const layout = (config.layout as 'list' | 'grid') || 'list'
  const items = ARTICLES.slice(0, maxItems)

  return (
    <div className={styles.root}>
      <h3 className={styles.title}>{title}</h3>
      <ul className={styles.list} data-layout={layout}>
        {items.map((article, i) => (
          <li key={i} className={styles.item}>
            <div
              className={styles.thumb}
              style={{ background: article.thumbGradient }}
            >
              <span className={styles.thumbIcon}>
                <ArticleIcon />
              </span>
            </div>
            <div className={styles.body}>
              <div
                className={styles.category}
                style={{ color: branding.colors.primary }}
              >
                {article.category}
              </div>
              <div className={styles.articleTitle}>{article.title}</div>
              <p className={styles.excerpt}>{article.excerpt}</p>
              <div className={styles.meta}>
                <span>{article.author}</span>
                <span className={styles.dot}>·</span>
                <span>{article.date}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
