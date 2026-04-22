import type { WidgetDefinition } from '../../types'
import { JintEvents } from './renderers/jint'
import { SharepointEvents } from './renderers/sharepoint'

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
    sharepoint: 'Évènements',
    jalios: 'Agenda',
    jint: 'Événements',
  },
  configSchema: [
    {
      key: 'title',
      label: 'Titre du widget',
      type: 'text',
      default: 'Évènements',
      placeholder: 'Ex. : Agenda',
    },
    {
      key: 'showTitle',
      label: 'Afficher le titre',
      type: 'boolean',
      default: true,
      platforms: ['sharepoint'],
    },
    {
      key: 'layout',
      label: 'Disposition',
      type: 'select',
      default: 'compact',
      platforms: ['sharepoint'],
      options: [
        { value: 'compact', label: 'Compacte' },
        { value: 'filmstrip', label: 'Pellicule', sizes: ['full', 'two-thirds', 'half'] },
      ],
    },
    {
      key: 'maxEvents',
      label: "Nombre d'événements à afficher",
      type: 'number',
      default: 3,
      min: 1,
      max: 10,
      platforms: ['jint'],
    },
    {
      key: 'showLocation',
      label: 'Afficher le lieu',
      type: 'boolean',
      default: true,
      platforms: ['jint'],
    },
  ],
  renderers: {
    sharepoint: SharepointEvents,
    jint: JintEvents,
  },
}
