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

export type RowFillType = 'none' | 'solid' | 'white'
export type RowPatternType = 'none' | 'dotted' | 'curves'
export type BrandColorKey = 'primary' | 'secondary' | 'text'

/** Legacy mono-axis types kept around so previously saved projects keep
 *  rendering correctly. New writes use `fill` + `pattern` independently. */
export type RowBackgroundType =
  | 'none'
  | 'solid'
  | 'white'
  | 'dotted'
  | 'dotted-clear'
  | 'curves'

export interface RowBackground {
  /** Color/fill layer: 'none' lets the platform default through. */
  fill?: RowFillType
  /** Decorative motif layer overlaid on top of the fill. */
  pattern?: RowPatternType
  /** Theme color key used by 'solid' fill and any non-'none' pattern. */
  colorKey?: BrandColorKey
  /** @deprecated single-axis type (kept for backward-compat with old projects). */
  type?: RowBackgroundType
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
