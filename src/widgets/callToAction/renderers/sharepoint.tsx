import type { WidgetRendererProps } from '../../../types'
import styles from './sharepoint.module.css'

const DEFAULTS_BY_SIZE: Record<string, { image: string; imagePosition: string }> = {
  full: {
    image: '/focus/teambuilding.jpg',
    imagePosition: '50% 50%',
  },
  'two-thirds': {
    image: '/focus/pro-meeting.jpg',
    imagePosition: '50% 50%',
  },
  half: {
    image: '/focus/handshake.jpg',
    imagePosition: '50% 50%',
  },
  'one-third': {
    image: '/focus/teambuilding.jpg',
    imagePosition: '50% 50%',
  },
}

const DEFAULT_IMAGES = new Set(Object.values(DEFAULTS_BY_SIZE).map((d) => d.image))

export function SharepointCallToAction({ config, size }: WidgetRendererProps) {
  const message = (config.message as string) || "6 idées pour un travail d'équipe efficace"
  const ctaLabel = (config.ctaLabel as string) || "Rejoindre l'atelier"

  const defaults = DEFAULTS_BY_SIZE[size ?? 'full'] ?? DEFAULTS_BY_SIZE.full
  const rawImageUrl = (config.imageUrl as string) || ''
  const isCustomImage = Boolean(rawImageUrl) && !DEFAULT_IMAGES.has(rawImageUrl)
  const imageUrl = isCustomImage ? rawImageUrl : defaults.image
  const imagePosition = isCustomImage ? '50% 50%' : defaults.imagePosition

  return (
    <div className={styles.widget}>
      <div className={styles.image}>
        <img src={imageUrl} alt="" style={{ objectPosition: imagePosition }} />
      </div>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <div className={styles.messageWrap}>
          <div className={styles.message}>{message}</div>
        </div>
        <button type="button" className={styles.cta}>{ctaLabel}</button>
      </div>
    </div>
  )
}
