import type { WidgetRendererProps } from '../../../types'
import styles from './lumapps.module.css'

interface ImageItem {
  url: string
  caption: string
}

const IMAGES: ImageItem[] = [
  { url: '/photos/team building.jpg',    caption: "Soirée d'équipe" },
  { url: '/photos/Office.jpg',           caption: 'Nouveaux locaux' },
  { url: '/photos/meeting.jpg',          caption: 'Atelier produit' },
  { url: '/photos/team building 2.jpg',  caption: 'Journée cohésion' },
  { url: '/photos/Office 2.jpg',         caption: 'Espace collaboratif' },
  { url: '/photos/meeting 2.jpg',        caption: 'Comité hebdo' },
  { url: '/photos/Office 3.jpg',         caption: 'Open space' },
  { url: '/photos/team building.jpg',    caption: 'Convention 2026' },
]

export function LumappsImageGallery({ config }: WidgetRendererProps) {
  const title = (config.title as string) || 'Galerie'
  const layout = (config.layout as 'grid' | 'masonry') || 'grid'
  const columns = Math.max(2, Math.min(5, (config.columns as number) || 3))

  const items = IMAGES.slice(0, columns * 2)

  return (
    <div className={styles.root}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div
        className={styles.grid}
        data-layout={layout}
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {items.map((img, i) => (
          <figure
            key={i}
            className={styles.tile}
            data-tall={layout === 'masonry' && (i % 3 === 1) ? 'true' : undefined}
            style={{ background: img.gradient }}
          >
            <span className={styles.tileIcon}>{img.icon}</span>
            <figcaption className={styles.caption}>{img.caption}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
