/* Layout icons - PNG images for known layouts */

import type { JSX } from 'react'

export type LayoutIconEntry = string | (() => JSX.Element)

export const LAYOUT_ICONS: Record<string, LayoutIconEntry> = {
  theatre:       '/layout-icons/theatre.png',
  featured:      '/layout-icons/featured.png',
  list:          '/layout-icons/list.png',
  sidebyside:    '/layout-icons/sidebyside.png',
  hub:           '/layout-icons/hub.png',
  carousel:      '/layout-icons/carousel.png',
  compact:       '/layout-icons/compact.png',
  pellicule:     '/layout-icons/pellicule.png',
  grille:        '/layout-icons/grille.png',
  bouton:        '/layout-icons/bouton.png',
  vignettes:     '/layout-icons/vignettes.png',
  compactList:   '/layout-icons/compact-list.png',
  grilleContent: '/layout-icons/grille-content.png',
  overlay:       '/layout-icons/overlay.png',
  colorBlock:    '/layout-icons/color-block.png',
  split:         '/layout-icons/split.png',
}
