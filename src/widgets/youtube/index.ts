import type { WidgetDefinition } from '../../types'
import { SharepointYouTube } from './renderers/sharepoint'

export const youtubeWidget: WidgetDefinition = {
  id: 'youtube',
  purpose: {
    category: 'communicate',
    label: 'Vidéo YouTube',
    description: 'Lecteur YouTube intégré directement dans la page.',
    keywords: ['youtube', 'vidéo', 'lecteur', 'embed', 'media'],
  },
  platformLabels: {
    sharepoint: 'YouTube',
    jint: 'YouTube',
  },
  configSchema: [
    {
      key: 'url',
      label: 'Lien',
      type: 'text',
      default: 'https://youtu.be/w0vcvcuuUwU?si=S2LEdSH6uEjuzjvx',
      placeholder: 'https://youtu.be/…',
    },
  ],
  forceWhiteSection: true,
  renderers: {
    sharepoint: SharepointYouTube,
  },
}
