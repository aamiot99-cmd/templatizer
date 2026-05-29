import type { WidgetDefinition } from '../../types'
import { LumappsTitle } from './renderers/lumapps'

export const titleWidget: WidgetDefinition = {
  id: 'title',
  purpose: {
    category: 'communicate',
    label: 'Titre de section',
    description:
      "Bloc de titre court et lisible pour structurer la page (ex. introduire une zone d'événements ou une section RH). Optionnellement accompagné d'un sous-titre.",
    keywords: ['titre', 'title', 'heading', 'section', 'rubrique'],
  },
  platformLabels: {
    lumapps: 'Titre',
    sharepoint: 'Titre',
    jalios: 'Titre',
    jint: 'Titre',
  },
  configSchema: [
    {
      key: 'title',
      label: 'Titre',
      type: 'text',
      default: 'Bienvenue sur votre intranet',
      placeholder: 'Ex. : Notre actualité',
    },
    {
      key: 'subtitle',
      label: 'Sous-titre (optionnel)',
      type: 'text',
      default: 'Retrouvez ici toutes les ressources pour bien démarrer votre journée.',
      placeholder: 'Ex. : Tout ce qui compte cette semaine',
    },
    {
      key: 'size',
      label: 'Taille',
      type: 'select',
      default: 'large',
      options: [
        { value: 'small', label: 'Petite' },
        { value: 'medium', label: 'Moyenne' },
        { value: 'large', label: 'Grande' },
      ],
    },
    {
      key: 'alignment',
      label: 'Alignement',
      type: 'toggle',
      default: 'left',
      options: [
        { value: 'left', label: 'Gauche' },
        { value: 'center', label: 'Centré' },
      ],
    },
    {
      key: 'showSeparator',
      label: 'Afficher une ligne sous le titre',
      type: 'boolean',
      default: true,
    },
  ],
  renderers: {
    lumapps: LumappsTitle,
  },
}
