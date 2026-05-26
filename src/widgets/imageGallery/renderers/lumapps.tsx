import type { ReactNode } from 'react'
import type { WidgetRendererProps } from '../../../types'
import styles from './lumapps.module.css'

/* Google Material-style icons (filled). */
function MIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" width="44" height="44" fill="currentColor" aria-hidden="true">
      <path d={path} />
    </svg>
  )
}

interface ImageItem {
  gradient: string
  icon: ReactNode
  caption: string
}

const IMAGES: ImageItem[] = [
  {
    gradient: 'linear-gradient(135deg, #fcd34d, #f59e0b)',
    icon: <MIcon path="M19.5 15.5h-1l-1-1h-9l-1 1h-1L4 17v3h16v-3l-1.5-1.5zM18 8h-1V6h-2v2h-1V6h-2v2h-1V6H9v2H8V6H6v2H5l-1 7h16l-1-7h-1zm-9 7H8v-2h1v2zm3 0h-1v-2h1v2zm3 0h-1v-2h1v2zm3 0h-1v-2h1v2z" />,
    caption: "Soirée d'équipe",
  },
  {
    gradient: 'linear-gradient(135deg, #60a5fa, #2563eb)',
    icon: <MIcon path="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />,
    caption: 'Nouveaux locaux',
  },
  {
    gradient: 'linear-gradient(135deg, #f87171, #dc2626)',
    icon: <MIcon path="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />,
    caption: 'Remise de prix',
  },
  {
    gradient: 'linear-gradient(135deg, #6ee7b7, #10b981)',
    icon: <MIcon path="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />,
    caption: 'Journée éco',
  },
  {
    gradient: 'linear-gradient(135deg, #c4b5fd, #7c3aed)',
    icon: <MIcon path="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />,
    caption: 'Convention 2026',
  },
  {
    gradient: 'linear-gradient(135deg, #fb923c, #ea580c)',
    icon: <MIcon path="M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 0 0 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />,
    caption: 'Afterwork siège',
  },
  {
    gradient: 'linear-gradient(135deg, #f472b6, #db2777)',
    icon: <MIcon path="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />,
    caption: 'Onboarding',
  },
  {
    gradient: 'linear-gradient(135deg, #93c5fd, #1d4ed8)',
    icon: <MIcon path="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />,
    caption: 'Hackathon',
  },
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
