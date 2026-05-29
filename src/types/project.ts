import type { Branding, Platform } from './platform'
import type { Wireframe } from './wireframe'

export interface NavEntry {
  id: string
  label: string
  url: string
  hasMockup?: boolean
  children?: NavEntry[]
}

export interface HubMenu {
  enabled: boolean
  entries: NavEntry[]
}

export interface ProjectState {
  platform: Platform
  branding: Branding
  wireframes: Record<string, Wireframe>
  activePageId: string
  navEntries: NavEntry[]
  hubMenu: HubMenu
}
