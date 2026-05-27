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

export type RowBackgroundType =
  | 'none'
  | 'solid'
  | 'white'
  | 'dotted'
  | 'dotted-clear'
export type BrandColorKey = 'primary' | 'secondary' | 'text'

export interface RowBackground {
  type: RowBackgroundType
  /** Theme color key used by 'solid' and 'dotted' types. */
  colorKey?: BrandColorKey
}

export interface WireframeRow {
  id: string
  cells: WireframeCell[]
  columnRatios?: number[]
  alignment?: RowAlignment
  background?: RowBackground
}

export interface Wireframe {
  rows: WireframeRow[]
}
