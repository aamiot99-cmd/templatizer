import type { ComponentType } from 'react'
import type { Branding, Platform } from './platform'

export type WidgetSize = 'full' | 'two-thirds' | 'half' | 'one-third'

export type UsageCategory =
  | 'communicate'
  | 'access'
  | 'collaborate'
  | 'live'

export const USAGE_CATEGORY_LABELS: Record<UsageCategory, string> = {
  communicate: 'Communiquer',
  access: 'Accéder aux outils',
  collaborate: 'Collaborer',
  live: "Vivre l'entreprise",
}

export type ConfigFieldType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'color'
  | 'select'
  | 'icon'
  | 'richtext'

interface BaseField {
  key: string
  label: string
  description?: string
  platforms?: Platform[]
}

export interface TextField extends BaseField {
  type: 'text'
  default: string
  placeholder?: string
}

export interface NumberField extends BaseField {
  type: 'number'
  default: number
  min?: number
  max?: number
}

export interface BooleanField extends BaseField {
  type: 'boolean'
  default: boolean
}

export interface ColorField extends BaseField {
  type: 'color'
  default: string
}

export interface SelectField extends BaseField {
  type: 'select'
  default: string
  options: Array<{ value: string; label: string; sizes?: WidgetSize[] }>
}

export function ratioToSize(ratio: number): WidgetSize {
  if (ratio >= 0.9) return 'full'
  if (ratio >= 0.6) return 'two-thirds'
  if (ratio >= 0.4) return 'half'
  return 'one-third'
}

export interface IconField extends BaseField {
  type: 'icon'
  default: string
}

export interface RichTextField extends BaseField {
  type: 'richtext'
  default: string
  placeholder?: string
}

export type ConfigSchemaField =
  | TextField
  | NumberField
  | BooleanField
  | ColorField
  | SelectField
  | IconField
  | RichTextField

export type ConfigValues = Record<string, string | number | boolean>

export interface WidgetPurpose {
  category: UsageCategory
  label: string
  description: string
  keywords: string[]
}

export interface WidgetRendererProps {
  config: ConfigValues
  size: WidgetSize
  branding: Branding
}

export interface WidgetDefinition {
  id: string
  purpose: WidgetPurpose
  platformLabels: Record<Platform, string>
  configSchema: ConfigSchemaField[]
  supportedSizes?: Partial<Record<Platform, WidgetSize[]>>
  /** If true, the widget breaks out of the section's horizontal padding/max-width
   *  to span the full width of the content area (e.g. SharePoint "Bannière principale"). */
  isFullBleed?: boolean
  renderers: Partial<Record<Platform, ComponentType<WidgetRendererProps>>>
}
