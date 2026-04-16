import type { Platform, ThemeTokens } from '../types'
import { lumappsTheme } from './lumapps'
import { sharepointTheme } from './sharepoint'
import { jaliosTheme } from './jalios'
import { jintTheme } from './jint'

export const THEMES: Record<Platform, ThemeTokens> = {
  lumapps: lumappsTheme,
  sharepoint: sharepointTheme,
  jalios: jaliosTheme,
  jint: jintTheme,
}

export { lumappsTheme, sharepointTheme, jaliosTheme, jintTheme }
export { ThemeProvider } from './ThemeProvider'
