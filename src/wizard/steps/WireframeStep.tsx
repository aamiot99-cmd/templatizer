import { useEffect } from 'react'
import { Builder } from '../../builder'
import { useProjectStore } from '../../store/projectStore'
import type { NavEntry } from '../../types'
import styles from './WireframeStep.module.css'

interface Zone {
  number: number
  title: string
  description: string
}

const ZONES: Zone[] = [
  {
    number: 1,
    title: 'Bibliothèque',
    description:
      "Les widgets disponibles pour cette plateforme, regroupés par usage client.",
  },
  {
    number: 2,
    title: 'Composition',
    description:
      "Glissez les widgets ici. Drag ou clic sur le divider pour régler les largeurs (1/2, 1/3, 2/3).",
  },
  {
    number: 3,
    title: 'Paramètres',
    description:
      "Cliquez sur un widget placé pour éditer ses paramètres (titre, nombre d'items, options…).",
  },
]

function flatMockupPages(entries: NavEntry[]): NavEntry[] {
  const result: NavEntry[] = []
  for (const e of entries) {
    if (e.hasMockup) result.push(e)
    if (e.children) {
      for (const c of e.children) {
        if (c.hasMockup) result.push(c)
      }
    }
  }
  return result
}

export function WireframeStep() {
  const platform = useProjectStore((s) => s.platform)
  const navEntries = useProjectStore((s) => s.navEntries)
  const activePageId = useProjectStore((s) => s.activePageId)
  const setActivePageId = useProjectStore((s) => s.setActivePageId)

  const mockupPages = flatMockupPages(navEntries)

  // Sync activePageId to the first mockup page if the current one isn't in the list
  useEffect(() => {
    if (
      mockupPages.length > 0 &&
      !mockupPages.some((p) => p.id === activePageId)
    ) {
      setActivePageId(mockupPages[0].id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navEntries])

  return (
    <div className={styles.wrapper}>
      {mockupPages.length > 0 && (
        <div className={styles.pageTabsBar}>
          {mockupPages.map((page) => (
            <button
              key={page.id}
              type="button"
              className={`${styles.pageTab} ${page.id === activePageId ? styles.pageTabActive : ''}`}
              onClick={() => setActivePageId(page.id)}
            >
              {page.label}
            </button>
          ))}
        </div>
      )}

      <div className={styles.legend}>
        {ZONES.map((zone) => (
          <div key={zone.number} className={styles.zone}>
            <div className={styles.zoneBadge}>{zone.number}</div>
            <div className={styles.zoneBody}>
              <h4 className={styles.zoneTitle}>{zone.title}</h4>
              <p className={styles.zoneDescription}>{zone.description}</p>
            </div>
          </div>
        ))}
      </div>

      {mockupPages.length === 0 ? (
        <div className={styles.noMockupHint}>
          Aucune page maquettée. Activez « Maquette » sur au moins une entrée
          dans l'étape Navigation.
        </div>
      ) : (
        <Builder platform={platform} />
      )}
    </div>
  )
}
