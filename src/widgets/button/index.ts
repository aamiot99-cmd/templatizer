import type { WidgetDefinition } from '../../types'
import { SharepointButton } from './renderers/sharepoint'

export const buttonWidget: WidgetDefinition = {
  id: 'button',
  purpose: {
    category: 'access',
    label: 'Lien ou action en un clic',
    description:
      "Bouton cliquable avec étiquette et icône optionnelle, alignable à gauche, au centre ou à droite.",
    keywords: ['bouton', 'lien', 'action', 'cta', 'navigation', 'accès'],
  },
  platformLabels: {
    lumapps: 'Bouton',
    sharepoint: 'Bouton',
    jalios: 'Bouton',
    jint: 'Bouton',
  },
  configSchema: [
    {
      key: 'label',
      label: 'Libellé',
      type: 'text',
      default: 'Bouton',
      placeholder: 'Ex. : Voir plus',
    },
    {
      key: 'icon',
      label: 'Icône',
      type: 'icon',
      default: 'none',
    },
    {
      key: 'alignment',
      label: 'Alignement',
      type: 'toggle',
      default: 'left',
      options: [
        { value: 'left', label: 'Gauche' },
        { value: 'center', label: 'Centre' },
        { value: 'right', label: 'Droite' },
      ],
    },
  ],
  renderers: {
    sharepoint: SharepointButton,
  },
}
