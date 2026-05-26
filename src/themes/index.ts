import type { Platform, ThemeTokens } from '../types'
import { lumappsTheme } from './lumapps'
import { sharepointTheme } from './sharepoint'
import { jaliosTheme } from './jalios'
import { jintTheme } from './jint'
import { powellTheme } from './powell'

export const THEMES: Record<Platform, ThemeTokens> = {
  lumapps: lumappsTheme,
  sharepoint: sharepointTheme,
  jalios: jaliosTheme,
  jint: jintTheme,
  powell: powellTheme,
}

export { ThemeProvider } from './ThemeProvider'
