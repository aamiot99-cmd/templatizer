import type { WidgetDefinition } from '../../types'
import { JintImageMap } from './renderers/jint'

export const imageMapWidget: WidgetDefinition = {
  id: 'imageMap',
  purpose: {
    category: 'communicate',
    label: 'Carte des implantations',
    description:
      "Afficher une carte interactive des sites et antennes de l'entreprise en France.",
    keywords: ['carte', 'map', 'implantations', 'sites', 'France', 'agences'],
  },
  platformLabels: {
    lumapps: 'Image Map',
    sharepoint: 'Image Map',
    jalios: 'Carte interactive',
    jint: 'Carte des sites',
  },
  configSchema: [
    {
      key: 'title',
      label: 'Titre du widget',
      type: 'text',
      default: 'Nos implantations',
      placeholder: 'Ex. : Nos agences',
    },
  ],
  renderers: {
    jint: JintImageMap,
  },
}
