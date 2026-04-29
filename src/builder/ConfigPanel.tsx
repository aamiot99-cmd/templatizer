import { ratioToSize } from '../types'
import type { Platform, SelectField } from '../types'
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

  function filterField(field: (typeof widget.configSchema)[number]) {
    if (field.platforms && !field.platforms.includes(platform)) return false
    if (field.visibleWhen) {
      const depField = widget.configSchema.find((f) => f.key === field.visibleWhen!.key)
      const currentVal = cell.config[field.visibleWhen.key] ?? depField?.default
      if (currentVal !== field.visibleWhen.value) return false
    }
    return true
  }

  function applySelectSizeFilter(field: (typeof widget.configSchema)[number]) {
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
    const ratios = row.columnRatios?.length === row.cells.length
      ? row.columnRatios
      : new Array(row.cells.length).fill(1 / row.cells.length)

    // Search primary cells
    const cellIdx = row.cells.findIndex((c) => c.id === cellId)
    if (cellIdx !== -1) {
      const cell = row.cells[cellIdx]
      return { rowId: row.id, cell, ratio: ratios[cellIdx] }
    }

    // Search stacked cells
    for (let colIdx = 0; colIdx < row.cells.length; colIdx++) {
      const primary = row.cells[colIdx]
      const stackedIdx = primary.stackedCells?.findIndex((sc) => sc.id === cellId) ?? -1
      if (stackedIdx !== -1) {
        const sc = primary.stackedCells![stackedIdx]
        const ratio = ratios[colIdx]
        const cell = {
          id: sc.id,
          widgetId: sc.widgetId,
          config: sc.config,
          size: ratioToSize(ratio) as ReturnType<typeof ratioToSize>,
        }
        return { rowId: row.id, cell, ratio }
      }
    }
  }
  return null
}
