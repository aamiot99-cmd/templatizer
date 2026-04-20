import type { WidgetRendererProps } from '../../../types'
import styles from './jint.module.css'

const DEFAULTS_BY_SIZE = {
  large: {
    tag: 'Ressources Humaines',
    image: '/news/pexels-jibarofoto-2774556.jpg',
  },
  medium: {
    tag: 'Événement',
    image: '/news/pexels-sevenstormphotography-934351.jpg',
  },
  compact: {
    tag: 'Formation',
    image: '/news/pexels-runffwpu-2530124.jpg',
  },
} as const

export function JintFocus({ config, size }: WidgetRendererProps) {
  const defaults = DEFAULTS_BY_SIZE[size] ?? DEFAULTS_BY_SIZE.large
  const tag = (config.tag as string) || defaults.tag
  const title = (config.title as string) ?? 'Créons ensemble !'
  const subtitle =
    (config.subtitle as string) ??
    "6 clés pour un travail d'équipe efficace."
  const ctaLabel = (config.ctaLabel as string) ?? "Rejoindre l'atelier"
  const showCta = (config.showCta as boolean) ?? true
  const showTag = ((config.showTag as boolean) ?? true) && Boolean(tag)
  const imageUrl = (config.imageUrl as string) ?? defaults.image
  const showImage = ((config.showImage as boolean) ?? true) && Boolean(imageUrl)
  const isCompact = size === 'compact'

  return (
    <div className={`${styles.widget} ${isCompact ? styles.widgetCompact : ''}`}>
      <div className={styles.background} aria-hidden="true" />

      <div className={styles.content}>
        {showTag && <div className={styles.tag}>#{tag}</div>}
        <div className={styles.title}>{title}</div>
        {!isCompact && <div className={styles.subtitle}>{subtitle}</div>}
        {showCta && (
          <button type="button" className={styles.cta}>
            {ctaLabel}
          </button>
        )}
      </div>

      {showImage && (
        <div className={styles.image}>
          <img src={imageUrl} alt="" />
        </div>
      )}
    </div>
  )
}
