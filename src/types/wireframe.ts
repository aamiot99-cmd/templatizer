import type { ConfigValues, WidgetSize } from './widget'

export interface WireframeCell {
  id: string
  widgetId: string
  config: ConfigValues
  size: WidgetSize
}

export interface WireframeRow {
  id: string
  cells: WireframeCell[]
  columnRatios?: number[]
}

export interface Wireframe {
  rows: WireframeRow[]
}
