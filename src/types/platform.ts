export type Platform = 'lumapps' | 'sharepoint' | 'jalios' | 'jint'

export const PLATFORMS: Platform[] = ['lumapps', 'sharepoint', 'jalios', 'jint']

export const PLATFORM_LABELS: Record<Platform, string> = {
  lumapps: 'LumApps',
  sharepoint: 'SharePoint',
  jalios: 'Jalios',
  jint: 'Jint',
}

export interface Branding {
  name: string
  logo: string | null
  colors: {
    primary: string
    secondary: string
    text: string
  }
}

export interface ThemeTokens {
  colors: {
    primary: string
    secondary: string
    text: string
    background: string
    surface: string
    border: string
  }
  typography: {
    sans: string
    heading: string
  }
  radius: {
    sm: string
    md: string
    lg: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
  }
}
