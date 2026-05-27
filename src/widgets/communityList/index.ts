import type { WidgetDefinition } from '../../types'
import { LumappsCommunityList } from './renderers/lumapps'

export const communityListWidget: WidgetDefinition = {
  id: 'communityList',
  purpose: {
    category: 'collaborate',
    label: 'Liste de communautés à rejoindre',
    description:
      'Présente des communautés (espaces collaboratifs) avec leur bannière, leur nom, leur description et le nombre de membres. Idéal pour exposer les espaces clés à découvrir.',
    keywords: ['communautés', 'communities', 'espaces', 'collaboration'],
  },
  platformLabels: {
    lumapps: 'Liste de communautés',
    sharepoint: 'Liste de communautés',
    jalios: 'Liste de communautés',
    jint: 'Liste de communautés',
  },
  configSchema: [
    {
      key: 'title',
      label: 'Titre du widget',
      type: 'text',
      default: 'Communautés à rejoindre',
      placeholder: 'Ex. : Communautés métier',
    },
    {
      key: 'maxItems',
      label: 'Nombre de communautés',
      type: 'number',
      default: 4,
      min: 2,
      max: 8,
    },
  ],
  renderers: {
    lumapps: LumappsCommunityList,
  },
}
