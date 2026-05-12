import type { WidgetDefinition } from '../../types'
import { JintEvents } from './renderers/jint'
import { SharepointEvents } from './renderers/sharepoint'

export const eventsWidget: WidgetDefinition = {
  id: 'events',
  purpose: {
    category: 'live',
    label: 'Agenda des prochains événements',
    description:
      "Prochains événements avec badge de date. Deux modes : grille compacte ou carrousel pellicule.",
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
        { value: 'compact',   label: 'Compacte',  layoutIcon: 'compact' },
        { value: 'filmstrip', label: 'Pellicule',  layoutIcon: 'pellicule', sizes: ['full', 'two-thirds', 'half'] },
      ],
    },
    {
      key: 'countMode',
      label: 'Remplissage',
      type: 'toggle',
      default: 'auto',
      platforms: ['sharepoint'],
      options: [
        { value: 'auto', label: 'Automatique' },
        { value: 'manual', label: 'Manuel' },
      ],
    },
    {
      key: 'itemCount',
      label: "Nombre d'événements",
      type: 'number',
      default: 3,
      min: 1,
      max: 8,
      platforms: ['sharepoint'],
      visibleWhen: { key: 'countMode', value: 'manual' },
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
