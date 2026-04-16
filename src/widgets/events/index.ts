import type { WidgetDefinition } from '../../types'
import { JintEvents } from './renderers/jint'

export const eventsWidget: WidgetDefinition = {
  id: 'events',
  purpose: {
    category: 'live',
    label: "Mettre en avant les événements",
    description:
      "Afficher les prochains événements, réunions ou temps forts de l'entreprise.",
    keywords: ['événements', 'agenda', 'réunions', 'temps forts', 'calendar'],
  },
  platformLabels: {
    lumapps: 'Events',
    sharepoint: 'Events',
    jalios: 'Agenda',
    jint: 'Événements',
  },
  configSchema: [
    {
      key: 'title',
      label: 'Titre du widget',
      type: 'text',
      default: 'Événements à venir',
      placeholder: 'Ex. : Agenda',
    },
    {
      key: 'maxEvents',
      label: "Nombre d'événements à afficher",
      type: 'number',
      default: 3,
      min: 1,
      max: 10,
    },
    {
      key: 'showLocation',
      label: 'Afficher le lieu',
      type: 'boolean',
      default: true,
    },
  ],
  renderers: {
    jint: JintEvents,
  },
}
