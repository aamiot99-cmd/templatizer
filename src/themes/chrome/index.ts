import type { ComponentType, ReactNode } from 'react'
import type { Branding, NavEntry, Platform } from '../../types'
import { JintChrome } from './jint'

export interface ChromeProps {
  branding: Branding
  navEntries: NavEntry[]
  children: ReactNode
}

export const CHROMES: Partial<Record<Platform, ComponentType<ChromeProps>>> = {
  jint: JintChrome,
}

export function getChrome(
  platform: Platform,
): ComponentType<ChromeProps> | undefined {
  return CHROMES[platform]
}
