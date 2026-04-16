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
    sharepoint: 'News',
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
      key: 'showMetrics',
      label: 'Afficher les réactions (likes, commentaires)',
      type: 'boolean',
      default: true,
    },
  ],
  renderers: {
    lumapps: LumappsNews,
    sharepoint: SharepointNews,
    jalios: JaliosNews,
    jint: JintNews,
  },
}
