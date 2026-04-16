import type { WidgetDefinition } from '../../types'
import { JintSocial } from './renderers/jint'

export const socialWidget: WidgetDefinition = {
  id: 'social',
  purpose: {
    category: 'communicate',
    label: 'Diffuser les réseaux sociaux',
    description:
      "Afficher un fil agrégé des publications internes et externes de l'entreprise sur les réseaux sociaux.",
    keywords: ['réseaux sociaux', 'social', 'linkedin', 'fil', 'posts'],
  },
  platformLabels: {
    lumapps: 'Social feed',
    sharepoint: 'Social feed',
    jalios: 'Réseaux sociaux',
    jint: 'Réseaux sociaux',
  },
  configSchema: [
    {
      key: 'title',
      label: 'Titre du widget',
      type: 'text',
      default: 'Fil des réseaux sociaux',
    },
    {
      key: 'companyName',
      label: "Nom à afficher comme auteur (vide = nom de l'entreprise)",
      type: 'text',
      default: '',
    },
  ],
  renderers: {
    jint: JintSocial,
  },
}
