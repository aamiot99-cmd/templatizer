import type { ComponentType, ReactNode } from 'react'
import type { Branding, HubMenu, NavEntry, Platform } from '../../types'
import { JintChrome } from './jint'
import { SharepointChrome } from './sharepoint'
import { LumappsChrome } from './lumapps'

export interface ChromeProps {
  branding: Branding
  navEntries: NavEntry[]
  hubMenu?: HubMenu
  children: ReactNode
}

// Jalios n'a pas de chrome dédié : son aperçu affiche les widgets directement,
// stylés par le ThemeProvider, sans enveloppe de navigation.
const CHROMES: Partial<Record<Platform, ComponentType<ChromeProps>>> = {
  jint: JintChrome,
  sharepoint: SharepointChrome,
  lumapps: LumappsChrome,
}

export function getChrome(
  platform: Platform,
): ComponentType<ChromeProps> | undefined {
  return CHROMES[platform]
}
