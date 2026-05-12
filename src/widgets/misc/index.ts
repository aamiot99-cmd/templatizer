import type { WidgetDefinition } from '../../types'
import { SharepointMisc } from './renderers/sharepoint'

export const miscWidget: WidgetDefinition = {
  id: 'misc',
  purpose: {
    category: 'access',
    label: 'Composant natif non catalogué',
    description: "Espace réservé pour un composant SharePoint natif non encore représenté dans le catalogue.",
    keywords: ['divers', 'placeholder', 'espace', 'autre', 'widget', 'réservé'],
  },
  platformLabels: {
    sharepoint: 'Widget divers',
    lumapps: 'Widget divers',
    jalios: 'Widget divers',
    jint: 'Widget divers',
  },
  configSchema: [
    {
      key: 'title',
      label: 'Titre',
      type: 'text',
      default: 'Autre widget',
      placeholder: 'Ex. : Flux RSS',
    },
    {
      key: 'showTitle',
      label: 'Afficher le titre',
      type: 'boolean',
      default: true,
    },
    {
      key: 'description',
      label: 'Description',
      type: 'text',
      default: 'Widget à intégrer',
      placeholder: 'Ex. : Intégration flux RSS',
    },
    {
      key: 'size',
      label: 'Hauteur',
      type: 'select',
      default: 'moyen',
      options: [
        { value: 'petit', label: 'Petit' },
        { value: 'moyen', label: 'Moyen' },
        { value: 'grand', label: 'Grand' },
      ],
    },
  ],
  renderers: {
    sharepoint: SharepointMisc,
  },
}
