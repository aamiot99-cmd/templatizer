import type { WidgetDefinition } from '../../types'
import { JintContacts } from './renderers/jint'

export const contactsWidget: WidgetDefinition = {
  id: 'contacts',
  purpose: {
    category: 'collaborate',
    label: 'Accueillir les nouveaux collaborateurs',
    description:
      'Mettre en avant les personnes qui viennent de rejoindre les équipes avec leur rôle et leur date d\'arrivée.',
    keywords: ['onboarding', 'nouveaux arrivants', 'bienvenue', 'équipe'],
  },
  platformLabels: {
    lumapps: 'New joiners',
    sharepoint: 'New members',
    jalios: 'Nouveaux arrivants',
    jint: 'Nouveaux arrivants',
  },
  configSchema: [
    {
      key: 'title',
      label: 'Titre du widget',
      type: 'text',
      default: 'Nouveaux arrivants',
    },
    {
      key: 'linkLabel',
      label: 'Libellé du lien',
      type: 'text',
      default: 'Annuaire →',
    },
  ],
  renderers: {
    jint: JintContacts,
  },
}
