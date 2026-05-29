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
  const rows = useProjectStore((s) => (s.wireframes[s.activePageId] ?? { rows: [] }).rows)
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
      if (field.type !== 'number') return field
      const layoutField = w.configSchema.find((f) => f.key === 'layout')
      const currentLayout = (cell.config.layout ?? layoutField?.default) as string
      if (field.key === 'itemCount') {
        if (currentLayout === 'sidebyside') return { ...field, step: 2, min: 2 }
        if (currentLayout === 'vignettes') return { ...field, max: 5 }
      }
      if (field.key === 'rowCount' && currentLayout === 'grille') {
        return { ...field, min: 2 }
      }
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
                onChange={(value) => {
                  const updates: Record<string, string | number | boolean> = { [field.key]: value }
                  if (field.key === 'layout' && value === 'grille') {
                    const currentRowCount = (cell.config.rowCount as number) ?? 1
                    if (currentRowCount < 2) updates.rowCount = 2
                  }
                  updateCellConfig(rowId, cell.id, updates)
                }}
              />
            ))}
          <div className={styles.fieldGroup}>
            <div className={styles.fieldLabel}>Fond du widget</div>
            <div className={styles.colLayoutGrid}>
              {WIDGET_BG_OPTIONS.map((opt) => {
                const current = (cell.config.widgetBg as WidgetBgValue) ?? 'default'
                const active = current === opt.value
                const swatchColor =
                  opt.value === 'white' ? '#ffffff'
                  : opt.value === 'primary' ? branding.colors.primary
                  : opt.value === 'secondary' ? branding.colors.secondary
                  : null
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={`${styles.colLayoutBtn} ${active ? styles.colLayoutBtnActive : ''}`}
                    onClick={() =>
                      updateCellConfig(rowId, cell.id, { widgetBg: opt.value })
                    }
                  >
                    {swatchColor && (
                      <span
                        className={styles.colorSwatch}
                        style={{ background: swatchColor }}
                        aria-hidden="true"
                      />
                    )}
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
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

type WidgetBgValue = 'default' | 'none' | 'white' | 'primary' | 'secondary'
const WIDGET_BG_OPTIONS: { value: WidgetBgValue; label: string }[] = [
  { value: 'default',   label: 'Défaut' },
  { value: 'none',      label: 'Sans fond' },
  { value: 'white',     label: 'Blanc' },
  { value: 'primary',   label: 'Primaire' },
  { value: 'secondary', label: 'Secondaire' },
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

  // Read the row background, normalizing legacy single-axis `type` to the
  // new (fill + pattern) model so old projects keep their previous look.
  let currentFill: RowFillType = row.background?.fill ?? 'none'
  let currentPattern: RowPatternType = row.background?.pattern ?? 'none'
  if (
    row.background &&
    row.background.fill === undefined &&
    row.background.pattern === undefined
  ) {
    switch (row.background.type) {
      case 'white':        currentFill = 'white'; break
      case 'solid':        currentFill = 'solid'; break
      case 'dotted':       currentFill = 'white'; currentPattern = 'dotted'; break
      case 'dotted-clear': currentFill = 'none';  currentPattern = 'dotted'; break
      case 'curves':       currentFill = 'none';  currentPattern = 'curves'; break
      default: break
    }
  }
  const legacyColorKey: BrandColorKey = row.background?.colorKey ?? 'primary'
  const currentFillColorKey: BrandColorKey =
    row.background?.fillColorKey ?? legacyColorKey
  const currentPatternColorKey: BrandColorKey =
    row.background?.patternColorKey ?? legacyColorKey
  const showFillColorPicker = currentFill === 'solid'
  const showPatternColorPicker = currentPattern !== 'none'

  const writeBackground = (next: Partial<RowBackground>) => {
    onBackgroundChange({
      fill: next.fill ?? currentFill,
      pattern: next.pattern ?? currentPattern,
      fillColorKey: next.fillColorKey ?? currentFillColorKey,
      patternColorKey: next.patternColorKey ?? currentPatternColorKey,
    })
  }

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
          <div className={styles.fieldLabel}>Couleur de fond</div>
          <div className={styles.colLayoutGrid}>
            {FILL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`${styles.colLayoutBtn} ${currentFill === opt.value ? styles.colLayoutBtnActive : ''}`}
                onClick={() => writeBackground({ fill: opt.value })}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.fieldGroup}>
          <div className={styles.fieldLabel}>Motif</div>
          <div className={styles.colLayoutGrid}>
            {PATTERN_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`${styles.colLayoutBtn} ${currentPattern === opt.value ? styles.colLayoutBtnActive : ''}`}
                onClick={() => writeBackground({ pattern: opt.value })}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        {showFillColorPicker && (
          <div className={styles.fieldGroup}>
            <div className={styles.fieldLabel}>Couleur du fond</div>
            <div className={styles.colLayoutGrid}>
              {COLOR_KEYS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.colLayoutBtn} ${currentFillColorKey === opt.value ? styles.colLayoutBtnActive : ''}`}
                  onClick={() => writeBackground({ fillColorKey: opt.value })}
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
        {showPatternColorPicker && (
          <div className={styles.fieldGroup}>
            <div className={styles.fieldLabel}>Couleur du motif</div>
            <div className={styles.colLayoutGrid}>
              {COLOR_KEYS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.colLayoutBtn} ${currentPatternColorKey === opt.value ? styles.colLayoutBtnActive : ''}`}
                  onClick={() => writeBackground({ patternColorKey: opt.value })}
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
  rows: WireframeRow[],
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
