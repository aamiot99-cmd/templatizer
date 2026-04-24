import type { ComponentType, ReactNode } from 'react'
import type { Branding, NavEntry, Platform } from '../../types'
import { JintChrome } from './jint'
import { SharepointChrome } from './sharepoint'

export interface ChromeProps {
  branding: Branding
  navEntries: NavEntry[]
  children: ReactNode
}

export const CHROMES: Partial<Record<Platform, ComponentType<ChromeProps>>> = {
  jint: JintChrome,
  sharepoint: SharepointChrome,
}

export function getChrome(
  platform: Platform,
): ComponentType<ChromeProps> | undefined {
  return CHROMES[platform]
}
