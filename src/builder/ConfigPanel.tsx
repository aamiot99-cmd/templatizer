import type { Platform } from '../types'
import { useProjectStore } from '../store/projectStore'
import { getWidget } from '../widgets/registry'
import { ConfigField } from './ConfigField'
import styles from './ConfigPanel.module.css'

interface ConfigPanelProps {
  platform: Platform
  selectedCellId: string | null
}

export function ConfigPanel({ platform, selectedCellId }: ConfigPanelProps) {
  const rows = useProjectStore((s) => s.wireframe.rows)
  const updateCellConfig = useProjectStore((s) => s.updateCellConfig)

  const found = findCell(rows, selectedCellId)

  if (!found || !selectedCellId) {
    return (
      <aside className={styles.panel}>
        <h3 className={styles.panelTitle}>Paramètres</h3>
        <div className={styles.empty}>
          Sélectionnez un widget dans le wireframe pour modifier ses paramètres.
        </div>
      </aside>
    )
  }

  const { rowId, cell } = found
  const widget = getWidget(cell.widgetId)

  if (!widget) {
    return (
      <aside className={styles.panel}>
        <h3 className={styles.panelTitle}>Widget inconnu</h3>
      </aside>
    )
  }

  return (
    <aside className={styles.panel}>
      <h3 className={styles.panelTitle}>{widget.platformLabels[platform]}</h3>
      <p className={styles.panelSubtitle}>{widget.purpose.label}</p>
      <div className={styles.fields}>
        {widget.configSchema
          .filter((field) => !field.platforms || field.platforms.includes(platform))
          .map((field) => (
            <ConfigField
              key={field.key}
              field={field}
              value={cell.config[field.key]}
              onChange={(value) =>
                updateCellConfig(rowId, cell.id, { [field.key]: value })
              }
            />
          ))}
      </div>
    </aside>
  )
}

function findCell(
  rows: ReturnType<typeof useProjectStore.getState>['wireframe']['rows'],
  cellId: string | null,
) {
  if (!cellId) return null
  for (const row of rows) {
    const cell = row.cells.find((c) => c.id === cellId)
    if (cell) return { rowId: row.id, cell }
  }
  return null
}
