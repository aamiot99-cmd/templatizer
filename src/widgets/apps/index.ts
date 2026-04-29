import type { WidgetDefinition } from '../../types'
import { JintApps } from './renderers/jint'

export const appsWidget: WidgetDefinition = {
  id: 'apps',
  purpose: {
    category: 'access',
    label: 'Accéder aux applications',
    description:
      'Permettre aux collaborateurs de lancer rapidement les applications métier du quotidien.',
    keywords: ['applications', 'outils', 'lanceur', 'raccourcis', 'apps'],
  },
  platformLabels: {
    lumapps: 'App launcher',
    sharepoint: 'App launcher',
    jalios: 'Applications',
    jint: 'Mes applications',
  },
  configSchema: [
    {
      key: 'title',
      label: 'Titre du widget',
      type: 'text',
      default: 'Mes applications',
      placeholder: 'Ex. : Mes outils',
    },
    {
      key: 'tileCount',
      label: 'Nombre de tuiles affichées',
      type: 'number',
      default: 11,
      min: 1,
      max: 12,
    },
  ],
  renderers: {
    jint: JintApps,
  },
}
