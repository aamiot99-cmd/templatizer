import type { WidgetRendererProps } from '../../../types'
import styles from './sharepoint.module.css'

interface Tile {
  title: string
  image?: string
  color?: string
}

function ArrowRight() {
  return (
    <svg
      width="18"
      height="14"
      viewBox="0 0 24 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="2" y1="8" x2="22" y2="8" />
      <polyline points="16 2 22 8 16 14" />
    </svg>
  )
}

export function SharepointMainBanner({ config, branding }: WidgetRendererProps) {
  const featuredTitle =
    (config.featuredTitle as string) ||
    'Bienvenue ! Cliquez sur Modifier dans le coin supérieur droit de la page pour commencer la personnalisation'
  const featuredCta = (config.featuredCta as string) || 'En savoir plus'

  const tiles: Tile[] = [
    {
      title:
        (config.tile1Title as string) ||
        'En savoir plus sur votre site Communication',
      color: branding.colors.primary,
    },
    {
      title:
        (config.tile2Title as string) ||
        "Laissez-vous inspirer de l'offre de présentation SharePoint",
      image: '/focus/handshake.jpg',
    },
    {
      title:
        (config.tile3Title as string) ||
        "Découvrez comment utiliser l'élément web de bannière",
      image: '/focus/teambuilding.jpg',
    },
    {
      title:
        (config.tile4Title as string) ||
        'Découvrez des éléments web à ajouter à cette page',
      image: '/news/pexels-brunogobofoto-3861712.jpg',
    },
  ]

  return (
    <div className={styles.banner}>
      <div className={styles.featured}>
        <img
          src="/focus/pro-meeting.jpg"
          alt=""
          className={styles.featuredImg}
        />
        <div className={styles.featuredOverlay} />
        <div className={styles.featuredBody}>
          <div className={styles.featuredTitle}>{featuredTitle}</div>
          <button type="button" className={styles.featuredCta}>
            <span>{featuredCta.toUpperCase()}</span>
            <ArrowRight />
          </button>
        </div>
      </div>

      {tiles.map((tile, idx) => (
        <div
          key={idx}
          className={`${styles.tile} ${styles[`tile${idx + 1}`]} ${
            tile.image ? '' : styles.tileSolid
          }`}
          style={tile.color ? { background: tile.color } : undefined}
        >
          {tile.image && (
            <>
              <img src={tile.image} alt="" className={styles.tileImg} />
              <div className={styles.tileOverlay} />
            </>
          )}
          <div className={styles.tileTitle}>{tile.title}</div>
        </div>
      ))}
    </div>
  )
}
