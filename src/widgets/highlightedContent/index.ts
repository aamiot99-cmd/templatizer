import type { WidgetDefinition } from '../../types'
import { SharepointHighlightedContent } from './renderers/sharepoint'

export const highlightedContentWidget: WidgetDefinition = {
  id: 'highlightedContent',
  purpose: {
    category: 'access',
    label: 'Mettre en évidence du contenu',
    description: 'Afficher et valoriser tout type de contenu SharePoint : documents, pages, actualités, vidéos, images, événements ou contacts.',
    keywords: ['contenu', 'mise en évidence', 'documents', 'pages', 'vidéos', 'images', 'événements', 'contacts', 'highlight'],
  },
  platformLabels: {
    sharepoint: 'Contenu mis en évidence',
    lumapps: 'Contenu mis en évidence',
    jalios: 'Contenu mis en évidence',
    jint: 'Contenu mis en évidence',
  },
  configSchema: [
    {
      key: 'title',
      label: 'Titre du widget',
      type: 'text',
      default: '',
      placeholder: 'Ex. : Contenu mis en évidence',
    },
    {
      key: 'showTitle',
      label: 'Afficher le titre',
      type: 'boolean',
      default: true,
    },
    {
      key: 'countMode',
      label: 'Remplissage',
      type: 'toggle',
      default: 'auto',
      options: [
        { value: 'auto', label: 'Automatique' },
        { value: 'manual', label: 'Manuel' },
      ],
    },
    {
      key: 'itemCount',
      label: "Nombre d'éléments",
      type: 'number',
      default: 4,
      min: 1,
      max: 8,
      visibleWhen: { key: 'countMode', value: 'manual' },
    },
    {
      key: 'contentType',
      label: 'Type de contenu',
      type: 'select',
      default: 'documents',
      platforms: ['sharepoint'],
      options: [
        { value: 'documents', label: 'Documents' },
        { value: 'pages', label: 'Pages' },
        { value: 'actualites', label: 'Actualités' },
        { value: 'videos', label: 'Vidéos' },
        { value: 'images', label: 'Images' },
        { value: 'evenements', label: 'Événements' },
        { value: 'contacts', label: 'Contacts' },
        { value: 'tout', label: 'Tout' },
      ],
    },
    {
      key: 'layout',
      label: 'Disposition',
      type: 'select',
      default: 'grille',
      platforms: ['sharepoint'],
      options: [
        { value: 'grille', label: 'Grille' },
        { value: 'liste', label: 'Liste' },
        { value: 'carrousel', label: 'Carrousel' },
        { value: 'compact', label: 'Compact' },
        { value: 'pellicule', label: 'Pellicule' },
      ],
    },
  ],
  renderers: {
    sharepoint: SharepointHighlightedContent,
  },
}
