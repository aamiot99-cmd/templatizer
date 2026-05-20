import { WIDGETS } from '../widgets/registry'
import type {
  Branding,
  ConfigSchemaField,
  ConfigValues,
  Platform,
  ProjectState,
  WidgetSize,
} from '../types'

export interface AiLayoutCell {
  widgetId: string
  size: WidgetSize
  content?: Record<string, string>
}

export interface AiLayoutRow {
  cells: AiLayoutCell[]
}

export interface AiLayoutNavChild {
  label: string
}

export interface AiLayoutNavEntry {
  label: string
  children?: AiLayoutNavChild[]
}

export interface AiLayout {
  wireframe: { rows: AiLayoutRow[] }
  navEntries: AiLayoutNavEntry[]
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

/** Overlay LLM-provided content onto the cell config — only on text/richtext fields. */
export function applyContent(
  widgetId: string,
  config: ConfigValues,
  content: Record<string, string> | undefined,
): ConfigValues {
  if (!content) return config
  const widget = WIDGETS[widgetId]
  if (!widget) return config
  const textKeys = new Set(
    widget.configSchema
      .filter((f: ConfigSchemaField) => f.type === 'text' || f.type === 'richtext')
      .map((f: ConfigSchemaField) => f.key),
  )
  const next = { ...config }
  for (const [key, value] of Object.entries(content)) {
    if (textKeys.has(key) && typeof value === 'string' && value.trim().length > 0) {
      next[key] = value
    }
  }
  return next
}

export function composeProjectStateFromAiLayout(
  layout: AiLayout,
  platform: Platform,
  branding: Branding,
): ProjectState {
  const rows = layout.wireframe.rows
    .filter((r) => r.cells && r.cells.length > 0)
    .map((row) => ({
      id: uid('row'),
      cells: row.cells
        .filter((c) => WIDGETS[c.widgetId])
        .map((cell) => ({
          id: uid('cell'),
          widgetId: cell.widgetId,
          size: cell.size,
          config: applyContent(
            cell.widgetId,
            defaultsFor(cell.widgetId),
            cell.content,
          ),
        })),
    }))
    .filter((r) => r.cells.length > 0)

  const navEntries = layout.navEntries.map((entry) => ({
    id: uid('nav'),
    label: entry.label,
    url: '#',
    children:
      entry.children?.map((child) => ({
        id: uid('nav'),
        label: child.label,
        url: '#',
      })) ?? [],
  }))

  return {
    platform,
    branding,
    wireframe: { rows },
    navEntries,
    hubMenu: { enabled: false, entries: [] },
  }
}
