import type { WidgetDefinition } from '../../types'
import { SharepointCallToAction } from './renderers/sharepoint'

export const callToActionWidget: WidgetDefinition = {
  id: 'callToAction',
  purpose: {
    category: 'communicate',
    label: "Appel à l'action illustré",
    description:
      "Bannière pleine largeur avec image de fond, accroche et bouton d'appel à l'action.",
    keywords: ['cta', "appel à l'action", 'bannière', 'bouton', 'campagne', 'promo'],
  },
  platformLabels: {
    lumapps: "Appel à l'action",
    sharepoint: "Appel à l'action",
    jalios: "Appel à l'action",
    jint: "Appel à l'action",
  },
  configSchema: [
    {
      key: 'message',
      label: 'Message',
      type: 'text',
      default: "6 idées pour un travail d'équipe efficace",
      placeholder: "Ex. : Rejoignez notre programme de mentorat",
    },
    {
      key: 'ctaLabel',
      label: 'Libellé du bouton',
      type: 'text',
      default: "Rejoindre l'atelier",
      placeholder: "Ex. : En savoir plus",
    },
    {
      key: 'imageUrl',
      label: "URL de l'image",
      type: 'text',
      default: '',
      placeholder: '/focus/ma-photo.jpg',
      description: "Laissez vide pour utiliser la photo adaptée au layout.",
    },
  ],
  renderers: {
    sharepoint: SharepointCallToAction,
  },
}
