import type { WidgetDefinition } from '../../types'
import { LumappsUsersList } from './renderers/lumapps'

export const usersListWidget: WidgetDefinition = {
  id: 'usersList',
  purpose: {
    category: 'collaborate',
    label: 'Liste de collaborateurs (avatar, nom, rôle)',
    description:
      "Affiche un panel de collaborateurs avec avatar, nom et rôle. Idéal pour présenter l'équipe d'un projet, les référents d'un service ou les nouveaux arrivants.",
    keywords: ['utilisateurs', 'users', 'collaborateurs', 'équipe', 'team', 'profils'],
  },
  platformLabels: {
    lumapps: 'Liste de collaborateurs',
    sharepoint: 'Liste de collaborateurs',
    jalios: 'Liste de collaborateurs',
    jint: 'Liste de collaborateurs',
  },
  configSchema: [
    {
      key: 'title',
      label: 'Titre du widget',
      type: 'text',
      default: 'Notre équipe',
      placeholder: 'Ex. : Équipe projet',
    },
    {
      key: 'layout',
      label: 'Disposition',
      type: 'select',
      default: 'grid',
      options: [
        { value: 'grid', label: 'Grille' },
        { value: 'list', label: 'Liste verticale' },
      ],
    },
    {
      key: 'maxItems',
      label: "Nombre d'utilisateurs",
      type: 'number',
      default: 6,
      min: 3,
      max: 12,
    },
    {
      key: 'showRole',
      label: 'Afficher le rôle',
      type: 'boolean',
      default: true,
    },
  ],
  renderers: {
    lumapps: LumappsUsersList,
  },
}
