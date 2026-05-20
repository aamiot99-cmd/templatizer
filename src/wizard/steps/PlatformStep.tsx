import type { Platform } from '../../types'
import { PLATFORMS, PLATFORM_LABELS } from '../../types'
import { useProjectStore } from '../../store/projectStore'
import styles from './PlatformStep.module.css'

interface PlatformCardInfo {
  logoSrc: string
  tagline: string
  description: string
}

const PLATFORM_CARDS: Record<Platform, PlatformCardInfo> = {
  lumapps: {
    logoSrc: '/logos-technos/lumapps.jpg',
    tagline: 'Digital Workplace',
    description:
      'Design moderne inspiré de Google Workspace, cartes arrondies et typographie Inter.',
  },
  sharepoint: {
    logoSrc: '/logos-technos/sharepoint.png',
    tagline: 'Microsoft 365 Modern',
    description:
      'Expérience Fluent / M365, épurée et minimaliste, idéale pour les sites d\'équipe.',
  },
  jalios: {
    logoSrc: '/logos-technos/jalios.png',
    tagline: 'JCMS Digital Workplace',
    description:
      'Solution française orientée contenus et communautés, avec widgets modulaires.',
  },
  jint: {
    logoSrc: '/logos-technos/jint.png',
    tagline: 'Social Intranet Platform',
    description:
      'Intranet M365-like moderne, avec layout libre en wireframe et effets glassmorphism.',
  },
}

export function PlatformStep() {
  const platform = useProjectStore((s) => s.platform)
  const setPlatform = useProjectStore((s) => s.setPlatform)

  return (
    <div className={styles.grid}>
      {PLATFORMS.map((p) => {
        const info = PLATFORM_CARDS[p]
        const selected = p === platform
        const label = PLATFORM_LABELS[p]
        return (
          <button
            key={p}
            type="button"
            className={`${styles.card} ${selected ? styles.cardSelected : ''}`}
            onClick={() => setPlatform(p)}
          >
            {selected && <div className={styles.checkmark}>✓</div>}
            <div className={styles.logo}>
              <img
                src={info.logoSrc}
                alt={`Logo ${label}`}
                title={label}
                className={styles.logoImg}
              />
            </div>
            <h3 className={styles.name}>{label}</h3>
            <p className={styles.tagline}>{info.tagline}</p>
            <p className={styles.description}>{info.description}</p>
          </button>
        )
      })}
    </div>
  )
}
