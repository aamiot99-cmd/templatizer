import { WIDGETS } from '../widgets/registry'
import { applyContent } from './aiCompose'
import type {
  ConfigValues,
  NavEntry,
  WidgetSize,
  Wireframe,
  WireframeCell,
  WireframeRow,
} from '../types'

interface OpCellSpec {
  widgetId: string
  size: WidgetSize
  content?: Record<string, string>
}

export type AiOperation =
  | { type: 'add_row'; position: 'start' | 'end' | 'after'; afterRowIndex?: number; cells: OpCellSpec[] }
  | { type: 'remove_row'; rowIndex: number }
  | { type: 'replace_cell'; rowIndex: number; cellIndex: number; widgetId: string; size: WidgetSize; content?: Record<string, string> }
  | { type: 'add_cell'; rowIndex: number; widgetId: string; size: WidgetSize; content?: Record<string, string> }
  | { type: 'remove_cell'; rowIndex: number; cellIndex: number }
  | { type: 'set_nav_entries'; entries: Array<{ label: string; children?: Array<{ label: string }> }> }

export interface AiApplyResult {
  wireframe: Wireframe
  navEntries: NavEntry[]
  applied: number
  skipped: Array<{ op: AiOperation; reason: string }>
}

function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

function defaultsFor(widgetId: string): ConfigValues {
  const widget = WIDGETS[widgetId]
  if (!widget) return {}
  const values: ConfigValues = {}
  for (const field of widget.configSchema) {
    values[field.key] = field.default
  }
  return values
}

function makeCell(
  widgetId: string,
  size: WidgetSize,
  content?: Record<string, string>,
): WireframeCell {
  return {
    id: uid('cell'),
    widgetId,
    size,
    config: applyContent(widgetId, defaultsFor(widgetId), content),
  }
}

function makeRow(cells: OpCellSpec[]): WireframeRow {
  return {
    id: uid('row'),
    cells: cells
      .filter((c) => WIDGETS[c.widgetId])
      .map((c) => makeCell(c.widgetId, c.size, c.content)),
  }
}

export function applyAiOperations(
  currentWireframe: Wireframe,
  currentNavEntries: NavEntry[],
  operations: AiOperation[],
): AiApplyResult {
  const rows = currentWireframe.rows.map((r) => ({
    ...r,
    cells: r.cells.map((c) => ({ ...c, config: { ...c.config } })),
  }))
  let nav = currentNavEntries.map((e) => ({ ...e, children: e.children?.map((c) => ({ ...c })) }))
  const skipped: AiApplyResult['skipped'] = []
  let applied = 0

  for (const op of operations) {
    try {
      switch (op.type) {
        case 'add_row': {
          if (!op.cells || op.cells.length === 0) {
            skipped.push({ op, reason: 'No cells provided' })
            continue
          }
          const newRow = makeRow(op.cells)
          if (newRow.cells.length === 0) {
            skipped.push({ op, reason: 'All widget IDs invalid' })
            continue
          }
          if (op.position === 'start') {
            rows.unshift(newRow)
          } else if (op.position === 'end') {
            rows.push(newRow)
          } else if (op.position === 'after') {
            const idx = op.afterRowIndex ?? rows.length - 1
            if (idx < 0 || idx >= rows.length) {
              skipped.push({ op, reason: `afterRowIndex out of range: ${idx}` })
              continue
            }
            rows.splice(idx + 1, 0, newRow)
          }
          applied++
          break
        }
        case 'remove_row': {
          if (op.rowIndex < 0 || op.rowIndex >= rows.length) {
            skipped.push({ op, reason: `rowIndex out of range: ${op.rowIndex}` })
            continue
          }
          rows.splice(op.rowIndex, 1)
          applied++
          break
        }
        case 'replace_cell': {
          const row = rows[op.rowIndex]
          if (!row) {
            skipped.push({ op, reason: `rowIndex out of range: ${op.rowIndex}` })
            continue
          }
          if (op.cellIndex < 0 || op.cellIndex >= row.cells.length) {
            skipped.push({ op, reason: `cellIndex out of range: ${op.cellIndex}` })
            continue
          }
          if (!WIDGETS[op.widgetId]) {
            skipped.push({ op, reason: `Unknown widget: ${op.widgetId}` })
            continue
          }
          row.cells[op.cellIndex] = makeCell(op.widgetId, op.size, op.content)
          applied++
          break
        }
        case 'add_cell': {
          const row = rows[op.rowIndex]
          if (!row) {
            skipped.push({ op, reason: `rowIndex out of range: ${op.rowIndex}` })
            continue
          }
          if (!WIDGETS[op.widgetId]) {
            skipped.push({ op, reason: `Unknown widget: ${op.widgetId}` })
            continue
          }
          if (row.cells.length >= 3) {
            skipped.push({ op, reason: 'Row already has 3 cells (max)' })
            continue
          }
          row.cells.push(makeCell(op.widgetId, op.size, op.content))
          applied++
          break
        }
        case 'remove_cell': {
          const row = rows[op.rowIndex]
          if (!row) {
            skipped.push({ op, reason: `rowIndex out of range: ${op.rowIndex}` })
            continue
          }
          if (op.cellIndex < 0 || op.cellIndex >= row.cells.length) {
            skipped.push({ op, reason: `cellIndex out of range: ${op.cellIndex}` })
            continue
          }
          row.cells.splice(op.cellIndex, 1)
          applied++
          break
        }
        case 'set_nav_entries': {
          nav = op.entries.map((entry) => ({
            id: uid('nav'),
            label: entry.label,
            url: '#',
            children:
              entry.children?.map((c) => ({ id: uid('nav'), label: c.label, url: '#' })) ?? [],
          }))
          applied++
          break
        }
        default:
          skipped.push({ op, reason: 'Unknown operation type' })
      }
    } catch (err) {
      skipped.push({ op, reason: err instanceof Error ? err.message : String(err) })
    }
  }

  return {
    wireframe: { rows: rows.filter((r) => r.cells.length > 0) },
    navEntries: nav,
    applied,
    skipped,
  }
}
