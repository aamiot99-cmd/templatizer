import type { WidgetDefinition } from '../../types'
import { JintFocus } from './renderers/jint'

export const focusWidget: WidgetDefinition = {
  id: 'focus',
  purpose: {
    category: 'communicate',
    label: 'Mettre en avant un contenu clé',
    description:
      "Carte de mise en avant avec image, texte et bouton d'action pour promouvoir un événement, une formation ou une campagne interne.",
    keywords: [
      'focus',
      'mise en avant',
      'cta',
      'campagne',
      'formation',
      'highlight',
    ],
  },
  platformLabels: {
    lumapps: 'Focus',
    sharepoint: 'Focus',
    jalios: 'Focus',
    jint: 'Focus',
  },
  configSchema: [
    {
      key: 'tag',
      label: 'Tag',
      type: 'text',
      default: '',
      placeholder: 'Ex. : Ressources Humaines',
      description: 'Laissez vide pour utiliser le tag adapté au layout.',
    },
    {
      key: 'showTag',
      label: 'Afficher le tag',
      type: 'boolean',
      default: true,
    },
    {
      key: 'title',
      label: 'Titre',
      type: 'text',
      default: 'Créons ensemble !',
      placeholder: 'Ex. : Créons ensemble !',
    },
    {
      key: 'subtitle',
      label: 'Sous-titre',
      type: 'text',
      default: "6 clés pour un travail d'équipe efficace.",
      placeholder: 'Un court texte descriptif.',
    },
    {
      key: 'ctaLabel',
      label: 'Libellé du bouton',
      type: 'text',
      default: "Rejoindre l'atelier",
      placeholder: "Ex. : Rejoindre l'atelier",
    },
    {
      key: 'showCta',
      label: 'Afficher le bouton',
      type: 'boolean',
      default: true,
    },
    {
      key: 'imageUrl',
      label: "URL de l'image",
      type: 'text',
      default: '',
      placeholder: '/news/ma-photo.jpg',
      description: "Laissez vide pour utiliser la photo adaptée au layout.",
    },
    {
      key: 'showImage',
      label: "Afficher l'image",
      type: 'boolean',
      default: true,
    },
  ],
  renderers: {
    jint: JintFocus,
  },
}
