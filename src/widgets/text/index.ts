import type { WidgetDefinition } from '../../types'
import { SharepointText } from './renderers/sharepoint'
import { LumappsText } from './renderers/lumapps'

export const textWidget: WidgetDefinition = {
  id: 'text',
  purpose: {
    category: 'communicate',
    label: 'Bloc de contenu éditorial libre',
    description: 'Bloc de texte libre avec mise en forme : titres, gras, italique, couleurs, listes et tableaux.',
    keywords: ['texte', 'riche', 'éditorial', 'contenu', 'paragraphe', 'titre'],
  },
  platformLabels: {
    sharepoint: 'Texte',
    lumapps: 'Rich Text',
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
    lumapps: LumappsText,
  },
}
