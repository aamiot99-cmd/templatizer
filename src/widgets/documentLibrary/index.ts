import type { WidgetDefinition } from '../../types'
import { SharepointDocumentLibrary } from './renderers/sharepoint'

export const documentLibraryWidget: WidgetDefinition = {
  id: 'documentLibrary',
  purpose: {
    category: 'access',
    label: 'Bibliothèque de documents',
    description:
      'Affiche le contenu d\'une bibliothèque SharePoint avec navigation dans les dossiers, colonnes Nom / Modifié / Modifié par.',
    keywords: ['documents', 'bibliothèque', 'fichiers', 'dossiers', 'partage', 'ressources'],
  },
  platformLabels: {
    lumapps: 'Bibliothèque de documents',
    sharepoint: 'Bibliothèque de documents',
    jalios: 'Bibliothèque de documents',
    jint: 'Bibliothèque de documents',
  },
  configSchema: [
    {
      key: 'title',
      label: 'Titre du widget',
      type: 'text',
      default: 'Documents',
      placeholder: 'Ex. : Documents',
    },
    {
      key: 'showTitle',
      label: 'Afficher le titre',
      type: 'boolean',
      default: true,
    },
    {
      key: 'tableSize',
      label: 'Taille',
      type: 'select',
      default: 'auto',
      options: [
        { value: 'auto', label: 'Redimensionnement automatique – Ajuster au nombre d\'éléments' },
        { value: 'small', label: 'Petit : environ 5 éléments' },
        { value: 'medium', label: 'Moyenne – Environ 15 éléments' },
        { value: 'large', label: 'Grande – Environ 30 éléments' },
      ],
    },
  ],
  renderers: {
    sharepoint: SharepointDocumentLibrary,
  },
}
