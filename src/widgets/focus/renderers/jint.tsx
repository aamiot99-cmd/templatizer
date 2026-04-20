import type { WidgetRendererProps } from '../../../types'
import styles from './jint.module.css'

const DEFAULTS_BY_SIZE = {
  large: {
    tag: 'Ressources Humaines',
    image: '/focus/pro-meeting.jpg',
    imagePosition: '50% 50%',
  },
  medium: {
    tag: 'Événement',
    image: '/focus/handshake.jpg',
    imagePosition: '50% 22%',
  },
  compact: {
    tag: 'Formation',
    image: '/focus/teambuilding.jpg',
    imagePosition: '50% 50%',
  },
} as const

// Any value that matches a known default (current or legacy) is treated as
// "unset" so the renderer can always substitute the layout-appropriate image.
// This lets widgets saved with an older hardcoded default auto-pick the new
// size-based image without requiring users to re-drop them.
const LEGACY_IMAGES = [
  '/news/pexels-jibarofoto-2774556.jpg',
  '/news/pexels-brunogobofoto-3861712.jpg',
  '/news/pexels-runffwpu-2530124.jpg',
  '/news/pexels-sevenstormphotography-934351.jpg',
]
const DEFAULT_IMAGES = new Set([
  ...Object.values(DEFAULTS_BY_SIZE).map((d) => d.image),
  ...LEGACY_IMAGES,
])
const DEFAULT_TAGS = new Set(Object.values(DEFAULTS_BY_SIZE).map((d) => d.tag))

export function JintFocus({ config, size }: WidgetRendererProps) {
  const defaults = DEFAULTS_BY_SIZE[size] ?? DEFAULTS_BY_SIZE.large
  const rawTag = (config.tag as string) || ''
  const tag = rawTag && !DEFAULT_TAGS.has(rawTag) ? rawTag : defaults.tag
  const title = (config.title as string) ?? 'Créons ensemble !'
  const subtitle =
    (config.subtitle as string) ??
    "6 clés pour un travail d'équipe efficace."
  const ctaLabel = (config.ctaLabel as string) ?? "Rejoindre l'atelier"
  const showCta = (config.showCta as boolean) ?? true
  const showTag = ((config.showTag as boolean) ?? true) && Boolean(tag)
  const rawImageUrl = (config.imageUrl as string) || ''
  const isCustomImage = Boolean(rawImageUrl) && !DEFAULT_IMAGES.has(rawImageUrl)
  const imageUrl = isCustomImage ? rawImageUrl : defaults.image
  // When the user provided their own image, we don't know the focal point,
  // so default to center. Otherwise use the tuned position for the default.
  const imagePosition = isCustomImage ? '50% 50%' : defaults.imagePosition
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
          <img src={imageUrl} alt="" style={{ objectPosition: imagePosition }} />
        </div>
      )}
    </div>
  )
}
