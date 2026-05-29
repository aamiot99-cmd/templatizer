import type { WidgetDefinition } from '../../types'
import { LumappsFilesList } from './renderers/lumapps'

export const filesListWidget: WidgetDefinition = {
  id: 'filesList',
  purpose: {
    category: 'access',
    label: 'Liste de documents',
    description:
      "Liste compacte de fichiers récents avec icône de type, nom, propriétaire et date de modification. Idéal pour exposer une bibliothèque documentaire ou les derniers fichiers d'une équipe.",
    keywords: ['fichiers', 'files', 'documents', 'bibliothèque'],
  },
  platformLabels: {
    lumapps: 'Liste de documents',
    sharepoint: 'Liste de documents',
    jalios: 'Liste de documents',
    jint: 'Liste de documents',
  },
  configSchema: [
    {
      key: 'title',
      label: 'Titre du widget',
      type: 'text',
      default: 'Documents récents',
      placeholder: 'Ex. : Bibliothèque',
    },
    {
      key: 'maxItems',
      label: 'Nombre de fichiers',
      type: 'number',
      default: 5,
      min: 2,
      max: 10,
    },
    {
      key: 'showOwner',
      label: 'Afficher le propriétaire',
      type: 'boolean',
      default: true,
    },
  ],
  renderers: {
    lumapps: LumappsFilesList,
  },
}
