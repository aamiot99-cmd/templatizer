import type { WidgetDefinition } from '../../types'
import { LumappsCommunityPosts } from './renderers/lumapps'

export const communityPostsWidget: WidgetDefinition = {
  id: 'communityPosts',
  purpose: {
    category: 'collaborate',
    label: 'Fil de posts communautaires',
    description:
      'Flux des dernières publications dans les communautés : avatar de l\'auteur, contenu du post, communauté source, réactions et commentaires. Idéal pour exposer la conversation interne.',
    keywords: ['posts', 'feed', 'communauté', 'conversation', 'social'],
  },
  platformLabels: {
    lumapps: 'Posts communautaires',
    sharepoint: 'Posts communautaires',
    jalios: 'Posts communautaires',
    jint: 'Posts communautaires',
  },
  configSchema: [
    {
      key: 'title',
      label: 'Titre du widget',
      type: 'text',
      default: 'Activité des communautés',
      placeholder: 'Ex. : Fil communautaire',
    },
    {
      key: 'maxItems',
      label: 'Nombre de posts',
      type: 'number',
      default: 3,
      min: 1,
      max: 6,
    },
  ],
  renderers: {
    lumapps: LumappsCommunityPosts,
  },
}
