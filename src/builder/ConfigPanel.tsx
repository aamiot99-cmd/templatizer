import { ratioToSize } from '../types'
import type {
  BrandColorKey,
  ColumnLayout,
  ConfigSchemaField,
  Platform,
  RowAlignment,
  RowBackground,
  RowFillType,
  RowPatternType,
  SelectField,
  WireframeRow,
} from '../types'
import { useProjectStore } from '../store/projectStore'
import { getWidget } from '../widgets/registry'
import { ConfigField } from './ConfigField'
import styles from './ConfigPanel.module.css'

interface ConfigPanelProps {
  platform: Platform
  selectedCellId: string | null
  selectedRowId: string | null
}

export function ConfigPanel({ platform, selectedCellId, selectedRowId }: ConfigPanelProps) {
  const rows = useProjectStore((s) => s.wireframe.rows)
  const branding = useProjectStore((s) => s.branding)
  const updateCellConfig = useProjectStore((s) => s.updateCellConfig)
  const setRowColumnLayout = useProjectStore((s) => s.setRowColumnLayout)
  const updateRowAlignment = useProjectStore((s) => s.updateRowAlignment)
  const setRowBackground = useProjectStore((s) => s.setRowBackground)

  // Cell config takes priority over row config
  if (selectedCellId) {
    const found = findCell(rows, selectedCellId)
    if (!found) {
      return (
        <aside className={styles.panel}>
          <h3 className={styles.panelTitle}>Paramètres</h3>
          <div className={styles.empty}>Sélectionnez un widget dans le wireframe pour modifier ses paramètres.</div>
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

    const w = widget

    function filterField(field: ConfigSchemaField) {
      if (field.platforms && !field.platforms.includes(platform)) return false
      if (field.visibleWhen) {
        const conditions = Array.isArray(field.visibleWhen) ? field.visibleWhen : [field.visibleWhen]
        for (const cond of conditions) {
          const depField = w.configSchema.find((f) => f.key === cond.key)
          const currentVal = cell.config[cond.key] ?? depField?.default
          if (cond.notValue !== undefined && currentVal === cond.notValue) return false
          if (cond.value !== undefined && currentVal !== cond.value) return false
        }
      }
      return true
    }

    function applySelectSizeFilter(field: ConfigSchemaField) {
      if (field.type !== 'select') return field
      const filtered = (field as SelectField).options.filter(
        (opt) => !opt.sizes || opt.sizes.includes(size),
      )
      return { ...field, options: filtered } as SelectField
    }

    function applyNumberStep(field: ConfigSchemaField) {
      if (field.type !== 'number' || field.key !== 'itemCount') return field
      const layoutField = w.configSchema.find((f) => f.key === 'layout')
      const currentLayout = (cell.config.layout ?? layoutField?.default) as string
      if (currentLayout === 'sidebyside') return { ...field, step: 2, min: 2 }
      if (currentLayout === 'vignettes') return { ...field, max: 5 }
      return field
    }

    return (
      <aside className={styles.panel}>
        <div className={styles.panelHeader} data-category={widget.purpose.category}>
          <span className={styles.panelBadge}>{widget.purpose.category === 'communicate' ? 'COM' : widget.purpose.category === 'access' ? 'ACC' : widget.purpose.category === 'collaborate' ? 'COL' : 'VIE'}</span>
          <div>
            <h3 className={styles.panelTitle}>{widget.platformLabels[platform] ?? widget.purpose.label}</h3>
            <p className={styles.panelSubtitle}>{widget.purpose.label}</p>
          </div>
        </div>
        <div className={styles.fields}>
          {widget.configSchema
            .filter(filterField)
            .map(applySelectSizeFilter)
            .map(applyNumberStep)
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

  if (selectedRowId) {
    const row = rows.find((r) => r.id === selectedRowId)
    if (!row) {
      return (
        <aside className={styles.panel}>
          <h3 className={styles.panelTitle}>Paramètres</h3>
          <div className={styles.empty}>Sélectionnez un widget dans le wireframe pour modifier ses paramètres.</div>
        </aside>
      )
    }
    return (
      <RowConfigPanel
        row={row}
        brandingColors={branding.colors}
        onLayoutChange={(l) => setRowColumnLayout(selectedRowId, l)}
        onAlignmentChange={(a) => updateRowAlignment(selectedRowId, a)}
        onBackgroundChange={(bg) => setRowBackground(selectedRowId, bg)}
      />
    )
  }

  return (
    <aside className={styles.panel}>
      <h3 className={styles.panelTitle}>Paramètres</h3>
      <div className={styles.empty}>
        Sélectionnez un widget dans le wireframe pour modifier ses paramètres.
      </div>
    </aside>
  )
}

// ── Row config panel ─────────────────────────────────────────────────────────

const COL_LAYOUTS: { value: ColumnLayout; label: string; count: number }[] = [
  { value: 'single',      label: 'Une colonne',       count: 1 },
  { value: 'two',         label: 'Deux colonnes',      count: 2 },
  { value: 'third-left',  label: '⅓ à gauche',         count: 2 },
  { value: 'third-right', label: '⅓ à droite',         count: 2 },
  { value: 'three',       label: 'Trois colonnes',     count: 3 },
]

const ALIGN_OPTIONS: { value: RowAlignment; label: string }[] = [
  { value: 'top',    label: 'Haut' },
  { value: 'center', label: 'Centré' },
  { value: 'bottom', label: 'Bas' },
]

const FILL_OPTIONS: { value: RowFillType; label: string }[] = [
  { value: 'none',  label: 'Sans fond' },
  { value: 'white', label: 'Fond blanc' },
  { value: 'solid', label: 'Fond plein' },
]

const PATTERN_OPTIONS: { value: RowPatternType; label: string }[] = [
  { value: 'none',    label: 'Aucun' },
  { value: 'dotted',  label: 'Pointillés' },
  { value: 'curves',  label: 'Courbes' },
]

const COLOR_KEYS: { value: BrandColorKey; label: string }[] = [
  { value: 'primary',   label: 'Principale' },
  { value: 'secondary', label: 'Secondaire' },
  { value: 'text',      label: 'Texte' },
]

function deriveColumnLayout(row: WireframeRow): ColumnLayout {
  const n = row.cells.length
  if (n <= 1) return 'single'
  if (n >= 3) return 'three'
  const r = row.columnRatios?.[0] ?? 0.5
  if (Math.abs(r - 1 / 3) < 0.02) return 'third-left'
  if (Math.abs(r - 2 / 3) < 0.02) return 'third-right'
  return 'two'
}

function RowConfigPanel({
  row,
  brandingColors,
  onLayoutChange,
  onAlignmentChange,
  onBackgroundChange,
}: {
  row: WireframeRow
  brandingColors: { primary: string; secondary: string; text: string }
  onLayoutChange: (layout: ColumnLayout) => void
  onAlignmentChange: (alignment: RowAlignment) => void
  onBackgroundChange: (background: RowBackground) => void
}) {
  const currentLayout = deriveColumnLayout(row)
  const currentAlignment = row.alignment ?? 'top'
  const currentBgType: RowBackgroundType = row.background?.type ?? 'none'
  const currentColorKey: BrandColorKey = row.background?.colorKey ?? 'primary'
  const showColorPicker =
    currentBgType === 'solid' ||
    currentBgType === 'dotted' ||
    currentBgType === 'dotted-clear' ||
    currentBgType === 'curves'

  return (
    <aside className={styles.panel}>
      <div className={styles.panelHeader} data-category="row">
        <span className={styles.panelBadge}>LIG</span>
        <div>
          <h3 className={styles.panelTitle}>Ligne</h3>
          <p className={styles.panelSubtitle}>Disposition, alignement, fond</p>
        </div>
      </div>
      <div className={styles.fields}>
        <div className={styles.fieldGroup}>
          <div className={styles.fieldLabel}>Colonnes</div>
          <div className={styles.colLayoutGrid}>
            {COL_LAYOUTS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`${styles.colLayoutBtn} ${currentLayout === opt.value ? styles.colLayoutBtnActive : ''}`}
                onClick={() => onLayoutChange(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        {currentLayout !== 'single' && (
          <div className={styles.fieldGroup}>
            <div className={styles.fieldLabel}>Alignement</div>
            <div className={styles.alignGroup}>
              {ALIGN_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.alignBtn} ${currentAlignment === opt.value ? styles.alignBtnActive : ''}`}
                  onClick={() => onAlignmentChange(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className={styles.fieldGroup}>
          <div className={styles.fieldLabel}>Fond de la section</div>
          <div className={styles.colLayoutGrid}>
            {BG_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`${styles.colLayoutBtn} ${currentBgType === opt.value ? styles.colLayoutBtnActive : ''}`}
                onClick={() =>
                  onBackgroundChange({ type: opt.value, colorKey: currentColorKey })
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        {showColorPicker && (
          <div className={styles.fieldGroup}>
            <div className={styles.fieldLabel}>Couleur</div>
            <div className={styles.colLayoutGrid}>
              {COLOR_KEYS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.colLayoutBtn} ${currentColorKey === opt.value ? styles.colLayoutBtnActive : ''}`}
                  onClick={() =>
                    onBackgroundChange({ type: currentBgType, colorKey: opt.value })
                  }
                >
                  <span
                    className={styles.colorSwatch}
                    style={{ background: brandingColors[opt.value] }}
                    aria-hidden="true"
                  />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
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

    const cellIdx = row.cells.findIndex((c) => c.id === cellId)
    if (cellIdx !== -1) {
      const cell = row.cells[cellIdx]
      return { rowId: row.id, cell, ratio: ratios[cellIdx] }
    }

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
