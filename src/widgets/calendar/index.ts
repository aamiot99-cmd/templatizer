import type { WidgetDefinition } from '../../types'
import { LumappsCalendar } from './renderers/lumapps'

export const calendarWidget: WidgetDefinition = {
  id: 'calendar',
  purpose: {
    category: 'live',
    label: 'Agenda des prochains événements',
    description:
      "Liste les prochains événements d'une source (calendrier Google, communauté…). Chaque entrée affiche une pastille de date à gauche et le titre + horaire + lieu à droite.",
    keywords: ['calendrier', 'agenda', 'événements', 'calendar', 'event'],
  },
  platformLabels: {
    lumapps: 'Calendrier',
    sharepoint: 'Calendrier',
    jalios: 'Calendrier',
    jint: 'Calendrier',
  },
  configSchema: [
    {
      key: 'title',
      label: 'Titre du widget',
      type: 'text',
      default: 'Agenda',
      placeholder: 'Ex. : Prochains événements',
    },
    {
      key: 'maxItems',
      label: "Nombre d'événements affichés",
      type: 'number',
      default: 4,
      min: 1,
      max: 8,
    },
    {
      key: 'showSeeAll',
      label: 'Afficher le lien "Voir tout"',
      type: 'boolean',
      default: true,
    },
  ],
  renderers: {
    lumapps: LumappsCalendar,
  },
}
