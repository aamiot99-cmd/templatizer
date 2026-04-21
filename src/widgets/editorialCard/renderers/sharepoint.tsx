import type { WidgetRendererProps } from '../../../types'
import styles from './sharepoint.module.css'

function hexToLuminance(hex: string): number {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = hexToLuminance(hex1)
  const l2 = hexToLuminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

function pickButtonColor(primaryColor: string, bgColor: string): string {
  try {
    return contrastRatio(primaryColor, bgColor) >= 3 ? primaryColor : '#ffffff'
  } catch {
    return primaryColor
  }
}

const DEFAULTS_BY_SIZE: Record<string, { image: string }> = {
  full: { image: '/focus/teambuilding.jpg' },
  'two-thirds': { image: '/focus/pro-meeting.jpg' },
  half: { image: '/focus/handshake.jpg' },
  'one-third': { image: '/focus/teambuilding.jpg' },
}

const DEFAULT_IMAGES = new Set(Object.values(DEFAULTS_BY_SIZE).map((d) => d.image))

function ArrowCircleIcon({ className }: { className?: string }) {
  return (
    <div className={`${styles.iconBtn} ${className ?? ''}`}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M3 8H13M13 8L9 4M13 8L9 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export function SharepointEditorialCard({ config, size, branding }: WidgetRendererProps) {
  const layout = (config.layout as string) || 'overlay'
  const preHeader = (config.preHeader as string) || 'Ressources Humaines'
  const showPreHeader = (config.showPreHeader as boolean) ?? true
  const title = (config.title as string) || 'Créons ensemble !'
  const showTitle = (config.showTitle as boolean) ?? true
  const description = (config.description as string) || "6 clés pour un travail d'équipe efficace"
  const showDescription = (config.showDescription as boolean) ?? true
  const ctaLabel = (config.ctaLabel as string) || 'En savoir plus'
  const ctaType = (config.ctaType as string) || 'button'
  const showImage = (config.showImage as boolean) ?? true
  const bgColor = (config.backgroundColor as string) || '#1e2333'

  const rawImageUrl = (config.imageUrl as string) || ''
  const defaults = DEFAULTS_BY_SIZE[size] ?? DEFAULTS_BY_SIZE.full
  const isCustom = Boolean(rawImageUrl) && !DEFAULT_IMAGES.has(rawImageUrl)
  const imageUrl = isCustom ? rawImageUrl : defaults.image

  // Sans image : couleur unie, contenu centré, pas de bloc ni de dégradé (tous layouts)
  if (!showImage) {
    const btnColor = pickButtonColor(branding.colors.primary, bgColor)
    const btnTextColor = btnColor === '#ffffff' ? '#1a1a1a' : '#ffffff'
    return (
      <div className={`${styles.widget} ${styles.noImage}`} style={{ background: bgColor }}>
        {showPreHeader && <div className={`${styles.preHeader} ${styles.centered}`}>{preHeader}</div>}
        {showTitle && <div className={`${styles.title} ${styles.centered}`}>{title}</div>}
        {showDescription && <div className={`${styles.description} ${styles.centered}`}>{description}</div>}
        {ctaType === 'button' && (
          <button
            type="button"
            className={`${styles.cta} ${styles.ctaCenter}`}
            style={{ background: btnColor, color: btnTextColor }}
          >
            {ctaLabel}
          </button>
        )}
        {ctaType === 'icon' && <ArrowCircleIcon className={styles.iconCenter} />}
      </div>
    )
  }

  if (layout === 'colorBlock') {
    return (
      <div className={`${styles.widget} ${styles.colorBlock}`}>
        <img className={styles.bgImage} src={imageUrl} alt="" />
        <div className={styles.blockOverlay}>
          <div className={styles.block}>
            {showPreHeader && <div className={`${styles.preHeader} ${styles.centered}`}>{preHeader}</div>}
            {showTitle && <div className={`${styles.title} ${styles.centered}`}>{title}</div>}
            {showDescription && (
              <div className={`${styles.description} ${styles.centered}`}>{description}</div>
            )}
            {ctaType === 'button' && (
              <button type="button" className={`${styles.cta} ${styles.ctaCenter}`}>{ctaLabel}</button>
            )}
            {ctaType === 'icon' && <ArrowCircleIcon className={styles.iconCenter} />}
          </div>
        </div>
      </div>
    )
  }

  if (layout === 'split') {
    return (
      <div className={`${styles.widget} ${styles.split}`}>
        <div className={styles.splitPanel} style={{ background: bgColor }}>
          {showPreHeader && <div className={styles.preHeader}>{preHeader}</div>}
          {showTitle && <div className={styles.title}>{title}</div>}
          {showDescription && <div className={styles.description}>{description}</div>}
          {ctaType === 'button' && (
            <button type="button" className={styles.cta}>{ctaLabel}</button>
          )}
          {ctaType === 'icon' && <ArrowCircleIcon />}
        </div>
        <div className={styles.splitImage}>
          <img src={imageUrl} alt="" />
        </div>
      </div>
    )
  }

  // overlay (default)
  return (
    <div className={`${styles.widget} ${styles.overlay} ${ctaType === 'card' ? styles.cardClickable : ''}`}>
      <img className={styles.bgImage} src={imageUrl} alt="" />
      <div className={styles.overlayGrad} />
      <div className={styles.overlayContent}>
        {showPreHeader && <div className={styles.preHeader}>{preHeader}</div>}
        {showTitle && <div className={styles.title}>{title}</div>}
        {showDescription && <div className={styles.description}>{description}</div>}
        {ctaType === 'button' && (
          <button type="button" className={styles.cta}>{ctaLabel}</button>
        )}
        {ctaType === 'icon' && <ArrowCircleIcon />}
      </div>
    </div>
  )
}
