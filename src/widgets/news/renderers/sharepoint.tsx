import { useState } from 'react'
import type { WidgetRendererProps } from '../../../types'
import styles from './sharepoint.module.css'

type Article = {
  title: string
  excerpt: string
  author: string
  time: string
  views?: string
  image: string
}

function getArticles(company: string): { featured: Article; secondary: Article[] } {
  return {
    featured: {
      title: `Le nouveau portail ${company} est en ligne`,
      excerpt: `Découvrez comment notre intranet favorise la connectivité et la collaboration au sein de ${company}…`,
      author: 'Théo Dumont',
      time: 'il y a 6 minutes',
      views: '2 vues',
      image: '/news/pexels-brunogobofoto-3861712.jpg',
    },
    secondary: [
      {
        title: `Résultats T1 2025 — ${company}`,
        excerpt: `Découvrez comment le partage des connaissances accélère la croissance chez ${company}…`,
        author: 'Marie Dupont',
        time: 'il y a environ une heure',
        views: '2 vues',
        image: '/news/pexels-sevenstormphotography-934351.jpg',
      },
      {
        title: `Nouveaux avantages collaborateurs chez ${company}`,
        excerpt: `Découvrez les nouveaux avantages mis en place par ${company} pour ses collaborateurs…`,
        author: 'Lucas Martin',
        time: 'il y a 3 heures',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=85',
      },
      {
        title: `Innovation & transformation digitale`,
        excerpt: `Découvrez le lancement de la nouvelle feuille de route digitale de ${company}…`,
        author: 'Sophie Bernard',
        time: 'il y a 2 jours',
        views: '1 vue',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=85',
      },
      {
        title: `${company} renforce ses équipes`,
        excerpt: `Découvrez les nouvelles initiatives de ${company} pour attirer et fidéliser les talents…`,
        author: 'Camille Leroy',
        time: 'il y a 5 jours',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=85',
      },
    ],
  }
}

function initialsOf(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

function ArticleCard({ item, className }: { item: Article; className?: string }) {
  return (
    <div className={className ?? styles.secondaryItem}>
      <div className={styles.secondaryImage}>
        <img src={item.image} alt={item.title} />
      </div>
      <div className={styles.secondaryBody}>
        <div className={styles.secondaryTitle}>{item.title}</div>
        <div className={styles.secondaryExcerpt}>{item.excerpt}</div>
        <div className={styles.meta}>
          <span className={styles.authorName}>{item.author}</span>
          <span className={styles.metaDivider}>{item.time}</span>
        </div>
        {item.views && <div className={styles.views}>{item.views}</div>}
      </div>
    </div>
  )
}

function FeaturedLayout({ featured, secondary }: { featured: Article; secondary: Article[] }) {
  return (
    <div className={styles.grid}>
      <div className={styles.featured}>
        <div className={styles.featuredImage}>
          <img src={featured.image} alt={featured.title} />
        </div>
        <div className={styles.featuredBody}>
          <div className={styles.featuredTitle}>{featured.title}</div>
          <div className={styles.featuredExcerpt}>{featured.excerpt}</div>
          <div className={styles.meta}>
            <div className={styles.avatar}>{initialsOf(featured.author)}</div>
            <span className={styles.authorName}>{featured.author}</span>
            <span className={styles.metaDivider}>{featured.time}</span>
          </div>
          {featured.views && <div className={styles.views}>{featured.views}</div>}
        </div>
      </div>

      <div className={styles.secondaryList}>
        {secondary.slice(0, 3).map((item) => (
          <ArticleCard key={item.title} item={item} />
        ))}
      </div>
    </div>
  )
}

function ListLayout({ secondary, size }: { featured: Article; secondary: Article[]; size?: string }) {
  if (size === 'one-third') {
    return (
      <div className={styles.listLayout}>
        {secondary.map((item) => (
          <div key={item.title} className={styles.listItemCompact}>
            <div className={styles.listImageCompact}>
              <img src={item.image} alt={item.title} />
            </div>
            <div className={styles.listBodyCompact}>
              <div className={styles.listTitleCompact}>{item.title}</div>
              <div className={styles.listExcerptCompact}>{item.excerpt}</div>
              <div className={styles.metaCompact}>
                <span className={styles.authorCompact}>{item.author}</span>
                <span className={styles.timeCompact}>{item.time}</span>
              </div>
              {item.views && <div className={styles.viewsCompact}>{item.views}</div>}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const isHalf = size === 'half'

  return (
    <div className={styles.listLayout}>
      {secondary.map((item) => (
        <div key={item.title} className={isHalf ? styles.listItemHalf : styles.listItem}>
          <div className={isHalf ? styles.listImageHalf : styles.listImage}>
            <img src={item.image} alt={item.title} />
          </div>
          <div className={styles.listBody}>
            <div className={isHalf ? styles.listTitleHalf : styles.listTitle}>{item.title}</div>
            <div className={styles.listExcerpt}>{item.excerpt}</div>
            <div className={styles.meta}>
              <div className={styles.avatar}>{initialsOf(item.author)}</div>
              <span className={styles.authorName}>{item.author}</span>
              <span className={styles.metaDivider}>{item.time}</span>
            </div>
            {item.views && <div className={styles.views}>{item.views}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}

function SideBySideLayout({ secondary }: { secondary: Article[] }) {
  return (
    <div className={styles.sideBySideGrid}>
      {secondary.map((item) => (
        <ArticleCard key={item.title} item={item} className={styles.sideBySideItem} />
      ))}
    </div>
  )
}

function CarouselLayout({ featured, secondary, size }: { featured: Article; secondary: Article[]; size?: string }) {
  const all = [featured, ...secondary]
  const [index, setIndex] = useState(0)
  const current = all[index]

  const prev = () => setIndex((i) => (i - 1 + all.length) % all.length)
  const next = () => setIndex((i) => (i + 1) % all.length)

  const slideClass = [
    styles.carouselSlide,
    size === 'two-thirds' && styles.carouselSlideTwoThirds,
    size === 'half' && styles.carouselSlideHalf,
    size === 'one-third' && styles.carouselSlideCompact,
  ].filter(Boolean).join(' ')

  const titleClass = [
    styles.carouselTitle,
    size === 'half' && styles.carouselTitleHalf,
    size === 'one-third' && styles.carouselTitleCompact,
  ].filter(Boolean).join(' ')

  return (
    <div className={styles.carousel}>
      <div className={slideClass}>
        <img src={current.image} alt={current.title} className={styles.carouselImg} />
        <div className={styles.carouselGradient} />
        <div className={titleClass}>{current.title}</div>
      </div>
      <div className={styles.carouselNav}>
        <button className={styles.carouselArrow} onClick={prev} aria-label="Précédent">
          <ChevronLeft />
        </button>
        {all.map((_, i) => (
          <button
            key={i}
            className={`${styles.carouselDot} ${i === index ? styles.carouselDotActive : ''}`}
            onClick={() => setIndex(i)}
            aria-label={`Article ${i + 1}`}
          />
        ))}
        <button className={styles.carouselArrow} onClick={next} aria-label="Suivant">
          <ChevronRight />
        </button>
      </div>
    </div>
  )
}

function ChevronLeft() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 1 2 8 8 15" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2 1 8 8 2 15" />
    </svg>
  )
}

const FULL_ONLY_LAYOUTS = ['featured', 'sidebyside']

export function SharepointNews({ config, branding, size }: WidgetRendererProps) {
  const title = (config.title as string) || 'Actualités'
  const rawLayout = (config.layout as string) || 'featured'
  const layout = size !== 'full' && FULL_ONLY_LAYOUTS.includes(rawLayout) ? 'list' : rawLayout
  const { featured, secondary } = getArticles(branding.name)

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <span className={styles.viewAll}>Afficher tout</span>
      </div>

      {layout === 'list' ? (
        <ListLayout featured={featured} secondary={secondary} size={size} />
      ) : layout === 'sidebyside' ? (
        <SideBySideLayout secondary={secondary} />
      ) : layout === 'carousel' ? (
        <CarouselLayout featured={featured} secondary={secondary} size={size} />
      ) : (
        <FeaturedLayout featured={featured} secondary={secondary} />
      )}
    </div>
  )
}
