import type { ConfigValues, WidgetSize } from './widget'

export interface StackedCell {
  id: string
  widgetId: string
  config: ConfigValues
}

export interface WireframeCell {
  id: string
  widgetId: string
  config: ConfigValues
  size: WidgetSize
  stackedCells?: StackedCell[]
}

export interface WireframeRow {
  id: string
  cells: WireframeCell[]
  columnRatios?: number[]
}

export interface Wireframe {
  rows: WireframeRow[]
}
