import type { Branding, Platform } from './platform'
import type { Wireframe } from './wireframe'

export interface NavEntry {
  id: string
  label: string
  url: string
  children?: NavEntry[]
}

export interface ProjectState {
  platform: Platform
  branding: Branding
  wireframe: Wireframe
  navEntries: NavEntry[]
}
