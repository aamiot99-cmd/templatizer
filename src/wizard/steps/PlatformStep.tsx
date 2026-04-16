import type { Platform } from '../../types'
import { PLATFORMS, PLATFORM_LABELS } from '../../types'
import { useProjectStore } from '../../store/projectStore'
import styles from './PlatformStep.module.css'

interface PlatformCardInfo {
  monogram: string
  tagline: string
  description: string
  logoClass: string
}

const PLATFORM_CARDS: Record<Platform, PlatformCardInfo> = {
  lumapps: {
    monogram: 'L',
    tagline: 'Digital Workplace',
    description:
      'Design moderne inspiré de Google Workspace, cartes arrondies et typographie Inter.',
    logoClass: 'logoLumapps',
  },
  sharepoint: {
    monogram: 'S',
    tagline: 'Microsoft 365 Modern',
    description:
      'Expérience Fluent / M365, épurée et minimaliste, idéale pour les sites d\'équipe.',
    logoClass: 'logoSharepoint',
  },
  jalios: {
    monogram: 'J',
    tagline: 'JCMS Digital Workplace',
    description:
      'Solution française orientée contenus et communautés, avec widgets modulaires.',
    logoClass: 'logoJalios',
  },
  jint: {
    monogram: 'Ji',
    tagline: 'Social Intranet Platform',
    description:
      'Intranet M365-like moderne, avec layout libre en wireframe et effets glassmorphism.',
    logoClass: 'logoJint',
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
        const logoClass = styles[info.logoClass] ?? ''
        return (
          <button
            key={p}
            type="button"
            className={`${styles.card} ${selected ? styles.cardSelected : ''}`}
            onClick={() => setPlatform(p)}
          >
            {selected && <div className={styles.checkmark}>✓</div>}
            <div className={`${styles.logo} ${logoClass}`}>{info.monogram}</div>
            <h3 className={styles.name}>{PLATFORM_LABELS[p]}</h3>
            <p className={styles.tagline}>{info.tagline}</p>
            <p className={styles.description}>{info.description}</p>
          </button>
        )
      })}
    </div>
  )
}
