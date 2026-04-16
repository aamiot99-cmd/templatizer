import type { WidgetDefinition } from '../../types'
import { JintDirectory } from './renderers/jint'

export const directoryWidget: WidgetDefinition = {
  id: 'directory',
  purpose: {
    category: 'collaborate',
    label: 'Trouver ses collègues',
    description:
      "Rechercher et consulter l'annuaire des collaborateurs, leurs fonctions et coordonnées.",
    keywords: ['annuaire', 'collègues', 'trombinoscope', 'directory', 'équipe'],
  },
  platformLabels: {
    lumapps: 'Directory',
    sharepoint: 'People',
    jalios: 'Annuaire',
    jint: 'Annuaire',
  },
  configSchema: [
    {
      key: 'title',
      label: 'Titre du widget',
      type: 'text',
      default: 'Annuaire',
      placeholder: 'Ex. : Trombinoscope',
    },
    {
      key: 'searchPlaceholder',
      label: 'Texte de la barre de recherche',
      type: 'text',
      default: 'Rechercher une personne...',
    },
    {
      key: 'showSearch',
      label: 'Afficher la barre de recherche',
      type: 'boolean',
      default: true,
    },
    {
      key: 'showChips',
      label: 'Afficher les filtres par fonction',
      type: 'boolean',
      default: true,
    },
  ],
  renderers: {
    jint: JintDirectory,
  },
}
