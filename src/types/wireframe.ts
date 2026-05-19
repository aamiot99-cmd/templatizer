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
  size?: WidgetSize
  stackedCells?: StackedCell[]
}

export type RowAlignment = 'top' | 'center' | 'bottom'
export type ColumnLayout = 'single' | 'two' | 'third-left' | 'third-right' | 'three'

export interface WireframeRow {
  id: string
  cells: WireframeCell[]
  columnRatios?: number[]
  alignment?: RowAlignment
}

export interface Wireframe {
  rows: WireframeRow[]
}
