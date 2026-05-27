import type { WidgetDefinition } from '../../types'
import { LumappsArticlesList } from './renderers/lumapps'

export const articlesListWidget: WidgetDefinition = {
  id: 'articlesList',
  purpose: {
    category: 'communicate',
    label: 'Liste d\'articles publiés',
    description:
      "Affiche les derniers articles publiés sur la plateforme (vignette, catégorie, titre, accroche, auteur, date). Idéal pour exposer un fil éditorial filtré (RH, métier, communauté).",
    keywords: ['articles', 'publications', 'éditorial', 'feed'],
  },
  platformLabels: {
    lumapps: 'Liste d\'articles',
    sharepoint: 'Liste d\'articles',
    jalios: 'Liste d\'articles',
    jint: 'Liste d\'articles',
  },
  configSchema: [
    {
      key: 'title',
      label: 'Titre du widget',
      type: 'text',
      default: 'Derniers articles',
      placeholder: 'Ex. : Articles à la une',
    },
    {
      key: 'maxItems',
      label: "Nombre d'articles",
      type: 'number',
      default: 4,
      min: 2,
      max: 8,
    },
    {
      key: 'layout',
      label: 'Disposition',
      type: 'select',
      default: 'list',
      options: [
        { value: 'list', label: 'Liste verticale' },
        { value: 'grid', label: 'Grille' },
      ],
    },
  ],
  renderers: {
    lumapps: LumappsArticlesList,
  },
}
