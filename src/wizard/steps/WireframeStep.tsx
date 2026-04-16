import { Builder } from '../../builder'
import { useProjectStore } from '../../store/projectStore'
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

export function WireframeStep() {
  const platform = useProjectStore((s) => s.platform)

  return (
    <div className={styles.wrapper}>
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
      <Builder platform={platform} />
    </div>
  )
}
