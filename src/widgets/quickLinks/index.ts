import type { WidgetDefinition } from '../../types'
import { SharepointQuickLinks } from './renderers/sharepoint'

export const quickLinksWidget: WidgetDefinition = {
  id: 'quickLinks',
  purpose: {
    category: 'access',
    label: 'Liens rapides',
    description:
      "Liste de liens cliquables vers des ressources, avec six modes d'affichage : Compact, Pellicule, Grille, Bouton, Liste et Vignettes.",
    keywords: ['liens', 'rapides', 'raccourcis', 'ressources', 'navigation', 'accès'],
  },
  platformLabels: {
    lumapps: 'Liens rapides',
    sharepoint: 'Liens rapides',
    jalios: 'Liens rapides',
    jint: 'Liens rapides',
  },
  configSchema: [
    {
      key: 'title',
      label: 'Titre du widget',
      type: 'text',
      default: 'Liens utiles',
      placeholder: 'Ex. : Liens utiles',
    },
    {
      key: 'showTitle',
      label: 'Afficher le titre',
      type: 'boolean',
      default: true,
    },
    {
      key: 'layout',
      label: 'Disposition',
      type: 'select',
      default: 'compact',
      options: [
        { value: 'compact', label: 'Compact' },
        { value: 'pellicule', label: 'Pellicule' },
        { value: 'grille', label: 'Grille' },
        { value: 'bouton', label: 'Bouton' },
        { value: 'liste', label: 'Liste' },
        { value: 'vignettes', label: 'Vignettes' },
      ],
    },
  ],
  renderers: {
    sharepoint: SharepointQuickLinks,
  },
}
