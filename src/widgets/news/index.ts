import type { WidgetDefinition } from '../../types'
import { LumappsNews } from './renderers/lumapps'
import { SharepointNews } from './renderers/sharepoint'
import { JaliosNews } from './renderers/jalios'
import { JintNews } from './renderers/jint'

export const newsWidget: WidgetDefinition = {
  id: 'news',
  purpose: {
    category: 'communicate',
    label: 'Communiquer des actualités',
    description:
      "Diffuser des annonces, communiqués et informations importantes à l'ensemble des équipes.",
    keywords: ['actualités', 'annonces', 'news', 'communication', 'flash info'],
  },
  platformLabels: {
    lumapps: 'News',
    sharepoint: 'Actualités',
    jalios: 'Flash Info',
    jint: 'Actualités',
  },
  configSchema: [
    {
      key: 'title',
      label: 'Titre du widget',
      type: 'text',
      default: '',
      placeholder: 'Ex. : Actualités',
    },
    {
      key: 'layout',
      label: 'Disposition',
      type: 'select',
      default: 'featured',
      platforms: ['sharepoint'],
      options: [
        { value: 'featured', label: 'Articles à la une', sizes: ['full'] },
        { value: 'list', label: 'Liste' },
        { value: 'sidebyside', label: 'Côte à côte', sizes: ['full'] },
        { value: 'carousel', label: 'Carrousel' },
      ],
    },
    {
      key: 'showMetrics',
      label: 'Afficher les réactions (likes, commentaires)',
      type: 'boolean',
      default: true,
      platforms: ['lumapps', 'jalios', 'jint'],
    },
  ],
  renderers: {
    lumapps: LumappsNews,
    sharepoint: SharepointNews,
    jalios: JaliosNews,
    jint: JintNews,
  },
}
