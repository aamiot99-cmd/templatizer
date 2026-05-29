import type { WidgetDefinition } from '../../types'
import { SharepointVideo } from './renderers/sharepoint'

export const videoWidget: WidgetDefinition = {
  id: 'video',
  purpose: {
    category: 'communicate',
    label: 'Galerie et lecteur vidéo',
    description: 'Galerie ou lecteur vidéo en disposition théâtre ou grille.',
    keywords: ['vidéo', 'lecteur', 'media', 'film', 'galerie'],
  },
  platformLabels: {
    sharepoint: 'Vidéo',
  },
  configSchema: [
    {
      key: 'singleVideo',
      label: 'Vidéo unique',
      type: 'boolean',
      default: false,
    },
    {
      key: 'title',
      label: 'Titre',
      type: 'text',
      default: 'Vidéos',
      visibleWhen: { key: 'singleVideo', notValue: true },
    },
    {
      key: 'layout',
      label: 'Disposition',
      type: 'select',
      default: 'theatre',
      options: [
        { value: 'theatre', label: 'Théâtre', layoutIcon: 'theatre' },
        { value: 'grille', label: 'Grille', layoutIcon: 'grille' },
      ],
      visibleWhen: { key: 'singleVideo', notValue: true },
    },
    {
      key: 'itemCount',
      label: 'Nombre de vidéos',
      type: 'number',
      default: 3,
      min: 1,
      max: 6,
      visibleWhen: { key: 'singleVideo', notValue: true },
    },
    {
      key: 'rowCount',
      label: 'Nombre de lignes',
      type: 'number',
      default: 1,
      min: 1,
      max: 10,
      visibleWhen: { key: 'singleVideo', notValue: true },
    },
  ],
  forceWhiteSection: true,
  renderers: {
    sharepoint: SharepointVideo,
  },
}
