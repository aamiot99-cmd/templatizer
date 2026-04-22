import type { WidgetDefinition } from '../../types'
import { SharepointQuickLinks } from './renderers/sharepoint'

const DEFAULT_LINKS_STR =
  '[{"label":"Trombinoscope","url":"#","icon":"users"},{"label":"Politique de télétravail","url":"#","icon":"document"},{"label":"Charte graphique","url":"#","icon":"palette"},{"label":"Plan du site","url":"#","icon":"map"}]'

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
      key: 'layout',
      label: 'Affichage',
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
    {
      key: 'title',
      label: 'Titre',
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
      key: 'links',
      label: 'Liens (JSON)',
      type: 'text',
      default: DEFAULT_LINKS_STR,
      description:
        'Tableau JSON : [{"label":"...", "url":"...", "icon":"users|document|palette|map"}]',
    },
  ],
  renderers: {
    sharepoint: SharepointQuickLinks,
  },
}
