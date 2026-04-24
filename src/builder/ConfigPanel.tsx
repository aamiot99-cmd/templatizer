import { ratioToSize } from '../types'
import type { ConfigSchemaField, Platform, SelectField } from '../types'
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

  const { rowId, cell, ratio } = found
  const size = ratioToSize(ratio)
  const widget = getWidget(cell.widgetId)

  if (!widget) {
    return (
      <aside className={styles.panel}>
        <h3 className={styles.panelTitle}>Widget inconnu</h3>
      </aside>
    )
  }

  function filterField(field: ConfigSchemaField) {
    if (field.platforms && !field.platforms.includes(platform)) return false
    return true
  }

  function applySelectSizeFilter(field: ConfigSchemaField) {
    if (field.type !== 'select') return field
    const filtered = (field as SelectField).options.filter(
      (opt) => !opt.sizes || opt.sizes.includes(size),
    )
    return { ...field, options: filtered } as SelectField
  }

  return (
    <aside className={styles.panel}>
      <div className={styles.panelHeader} data-category={widget.purpose.category}>
        <span className={styles.panelBadge}>{widget.purpose.category === 'communicate' ? 'COM' : widget.purpose.category === 'access' ? 'ACC' : widget.purpose.category === 'collaborate' ? 'COL' : 'VIE'}</span>
        <div>
          <h3 className={styles.panelTitle}>{widget.platformLabels[platform]}</h3>
          <p className={styles.panelSubtitle}>{widget.purpose.label}</p>
        </div>
      </div>
      <div className={styles.fields}>
        {widget.configSchema
          .filter(filterField)
          .map(applySelectSizeFilter)
          .map((field) => (
            <ConfigField
              key={`${selectedCellId}-${field.key}`}
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
    const cellIdx = row.cells.findIndex((c) => c.id === cellId)
    if (cellIdx === -1) continue
    const cell = row.cells[cellIdx]
    const ratios = row.columnRatios?.length === row.cells.length
      ? row.columnRatios
      : new Array(row.cells.length).fill(1 / row.cells.length)
    const ratio = ratios[cellIdx]
    return { rowId: row.id, cell, ratio }
  }
  return null
}
