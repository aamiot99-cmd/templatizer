import type { CSSProperties, ReactNode } from 'react'
import type { Branding, Platform } from '../types'
import { THEMES } from './index'

interface ThemeProviderProps {
  platform: Platform
  branding?: Branding
  children: ReactNode
  className?: string
}

export function ThemeProvider({
  platform,
  branding,
  children,
  className,
}: ThemeProviderProps) {
  const theme = THEMES[platform]

  const style = {
    '--color-primary': branding?.colors.primary ?? theme.colors.primary,
    '--color-secondary': branding?.colors.secondary ?? theme.colors.secondary,
    '--color-text': branding?.colors.text ?? theme.colors.text,
    '--color-background': theme.colors.background,
    '--color-surface': theme.colors.surface,
    '--color-border': theme.colors.border,
    '--font-sans': theme.typography.sans,
    '--font-heading': theme.typography.heading,
    '--radius-sm': theme.radius.sm,
    '--radius-md': theme.radius.md,
    '--radius-lg': theme.radius.lg,
    '--space-xs': theme.spacing.xs,
    '--space-sm': theme.spacing.sm,
    '--space-md': theme.spacing.md,
    '--space-lg': theme.spacing.lg,
    fontFamily: 'var(--font-sans)',
    color: 'var(--color-text)',
    background: 'var(--color-background)',
  } as CSSProperties

  return (
    <div data-platform={platform} className={className} style={style}>
      {children}
    </div>
  )
}
