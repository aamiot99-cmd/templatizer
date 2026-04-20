import type { WidgetRendererProps } from '../../../types'
import styles from './jint.module.css'

export function JintFocus({ config }: WidgetRendererProps) {
  const tag = (config.tag as string) ?? 'ressources humaines'
  const title = (config.title as string) ?? 'Créons ensemble !'
  const subtitle =
    (config.subtitle as string) ??
    "6 clés pour un travail d'équipe efficace."
  const ctaLabel = (config.ctaLabel as string) ?? "Rejoindre l'atelier"
  const showCta = (config.showCta as boolean) ?? true
  const showTag = ((config.showTag as boolean) ?? true) && Boolean(tag)
  const imageUrl =
    (config.imageUrl as string) ?? '/news/pexels-jibarofoto-2774556.jpg'
  const showImage = ((config.showImage as boolean) ?? true) && Boolean(imageUrl)

  return (
    <div className={styles.widget}>
      <div className={styles.background} aria-hidden="true" />

      <div className={styles.content}>
        {showTag && <div className={styles.tag}>#{tag}</div>}
        <div className={styles.title}>{title}</div>
        <div className={styles.subtitle}>{subtitle}</div>
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
