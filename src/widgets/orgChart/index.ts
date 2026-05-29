import type { WidgetDefinition } from '../../types'
import { SharepointOrgChart } from './renderers/sharepoint'

export const orgChartWidget: WidgetDefinition = {
  id: 'orgChart',
  purpose: {
    category: 'collaborate',
    label: 'Organigramme',
    description: 'Affiche la hiérarchie d\'une équipe avec le responsable et ses collaborateurs directs.',
    keywords: ['organigramme', 'hiérarchie', 'équipe', 'collaborateurs', 'organisation'],
  },
  platformLabels: {
    sharepoint: 'Organigramme',
    jint: 'Organigramme',
  },
  configSchema: [
    {
      key: 'title',
      label: 'Titre',
      type: 'text',
      default: 'Organigramme',
    },
  ],
  forceWhiteSection: true,
  renderers: {
    sharepoint: SharepointOrgChart,
  },
}
