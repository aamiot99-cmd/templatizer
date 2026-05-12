import type { WidgetDefinition } from '../../types'
import { SharepointQuickLinks } from './renderers/sharepoint'

export const quickLinksWidget: WidgetDefinition = {
  id: 'quickLinks',
  purpose: {
    category: 'access',
    label: 'Accès rapide aux ressources clés',
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
        { value: 'compact',   label: 'Compact',   layoutIcon: 'compact' },
        { value: 'pellicule', label: 'Pellicule',  layoutIcon: 'pellicule' },
        { value: 'grille',    label: 'Grille',     layoutIcon: 'grille' },
        { value: 'bouton',    label: 'Bouton',     layoutIcon: 'bouton' },
        { value: 'liste',     label: 'Liste',      layoutIcon: 'list' },
        { value: 'vignettes', label: 'Vignettes',  layoutIcon: 'vignettes' },
      ],
    },
    {
      key: 'linkLabel1',
      label: 'Lien 1',
      type: 'text',
      default: 'Trombinoscope',
      placeholder: 'Ex. : Trombinoscope',
    },
    {
      key: 'linkLabel2',
      label: 'Lien 2',
      type: 'text',
      default: 'Politique de télétravail',
      placeholder: 'Ex. : Politique de télétravail',
    },
    {
      key: 'linkLabel3',
      label: 'Lien 3',
      type: 'text',
      default: 'Charte graphique',
      placeholder: 'Ex. : Charte graphique',
    },
    {
      key: 'linkLabel4',
      label: 'Lien 4',
      type: 'text',
      default: 'Plan du site',
      placeholder: 'Ex. : Plan du site',
    },
  ],
  renderers: {
    sharepoint: SharepointQuickLinks,
  },
}
