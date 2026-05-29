import type { WidgetDefinition } from '../../types'
import { JintContacts } from './renderers/jint'
import { SharepointContacts } from './renderers/sharepoint'

export const contactsWidget: WidgetDefinition = {
  id: 'contacts',
  purpose: {
    category: 'collaborate',
    label: 'Contacts / Nouveaux arrivants',
    description:
      'Mettre en avant des contacts ou les personnes qui viennent de rejoindre les équipes.',
    keywords: ['contacts', 'personnes', 'onboarding', 'nouveaux arrivants', 'bienvenue', 'équipe'],
  },
  platformLabels: {
    lumapps: 'New joiners',
    sharepoint: 'Contacts',
    jalios: 'Nouveaux arrivants',
    jint: 'Nouveaux arrivants',
  },
  configSchema: [
    {
      key: 'title',
      label: 'Titre',
      type: 'text',
      default: 'Contacts',
    },
    {
      key: 'linkLabel',
      label: 'Libellé du lien',
      type: 'text',
      default: 'Annuaire →',
      platforms: ['jint'],
    },
    {
      key: 'layout',
      label: 'Mise en page',
      type: 'toggle',
      default: 'moyen',
      options: [
        { value: 'petit', label: 'Petit' },
        { value: 'moyen', label: 'Moyen' },
        { value: 'grande', label: 'Grande' },
      ],
      platforms: ['sharepoint'],
    },
    {
      key: 'itemCount',
      label: 'Nombre de contacts',
      type: 'number',
      default: 5,
      min: 1,
      max: 15,
      platforms: ['sharepoint'],
    },
  ],
  renderers: {
    sharepoint: SharepointContacts,
    jint: JintContacts,
  },
}
