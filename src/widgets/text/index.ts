import type { WidgetDefinition } from '../../types'
import { SharepointText } from './renderers/sharepoint'

export const textWidget: WidgetDefinition = {
  id: 'text',
  purpose: {
    category: 'communicate',
    label: 'Texte enrichi',
    description: 'Bloc de texte libre avec mise en forme : titres, gras, italique, couleurs, listes et tableaux.',
    keywords: ['texte', 'riche', 'éditorial', 'contenu', 'paragraphe', 'titre'],
  },
  platformLabels: {
    sharepoint: 'Texte',
    lumapps: 'Texte',
    jalios: 'Texte',
    jint: 'Texte',
  },
  configSchema: [
    {
      key: 'content',
      label: 'Contenu',
      type: 'richtext',
      default: '',
      placeholder: 'Ajoutez votre texte ici.',
    },
  ],
  renderers: {
    sharepoint: SharepointText,
  },
}
