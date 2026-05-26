import type { WidgetRendererProps } from '../../../types'
import styles from './lumapps.module.css'

// Mock visuals: each "image" is a colored gradient with an emoji to evoke a topic.
const IMAGES = [
  { gradient: 'linear-gradient(135deg, #fcd34d, #f59e0b)', emoji: '🎉', caption: "Soirée d'équipe" },
  { gradient: 'linear-gradient(135deg, #60a5fa, #2563eb)', emoji: '🏢', caption: 'Nouveaux locaux' },
  { gradient: 'linear-gradient(135deg, #f87171, #dc2626)', emoji: '🏆', caption: 'Remise de prix' },
  { gradient: 'linear-gradient(135deg, #6ee7b7, #10b981)', emoji: '🌱', emojiAlt: '🌳', caption: 'Journée éco' },
  { gradient: 'linear-gradient(135deg, #c4b5fd, #7c3aed)', emoji: '🎤', caption: 'Convention 2026' },
  { gradient: 'linear-gradient(135deg, #fb923c, #ea580c)', emoji: '🍽️', caption: 'Afterwork siège' },
  { gradient: 'linear-gradient(135deg, #f472b6, #db2777)', emoji: '👥', caption: 'Onboarding' },
  { gradient: 'linear-gradient(135deg, #93c5fd, #1d4ed8)', emoji: '💡', caption: 'Hackathon' },
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
            <span className={styles.emoji}>{img.emoji}</span>
            <figcaption className={styles.caption}>{img.caption}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
