import type { WidgetDefinition } from '../../types'
import { JintMeetings } from './renderers/jint'

export const meetingsWidget: WidgetDefinition = {
  id: 'meetings',
  purpose: {
    category: 'collaborate',
    label: 'Afficher les réunions du jour',
    description:
      "Lister les réunions planifiées dans la journée avec les horaires, les participants et l'accès rapide à la visio.",
    keywords: [
      'réunions',
      'meetings',
      'agenda',
      'calendrier',
      'visio',
      'teams',
    ],
  },
  platformLabels: {
    lumapps: 'Mes réunions',
    sharepoint: 'Mes réunions',
    jalios: 'Mes réunions',
    jint: 'Mes réunions',
  },
  configSchema: [
    {
      key: 'title',
      label: 'Titre du widget',
      type: 'text',
      default: 'Mes réunions du jour',
      placeholder: 'Ex. : Mes réunions du jour',
    },
    {
      key: 'linkLabel',
      label: 'Libellé du lien',
      type: 'text',
      default: 'agenda',
      placeholder: 'Ex. : agenda',
    },
    {
      key: 'maxMeetings',
      label: 'Nombre de réunions à afficher',
      type: 'number',
      default: 3,
      min: 1,
      max: 6,
    },
    {
      key: 'showJoinButton',
      label: 'Afficher le bouton « Rejoindre la réunion »',
      type: 'boolean',
      default: true,
    },
  ],
  renderers: {
    jint: JintMeetings,
  },
}
