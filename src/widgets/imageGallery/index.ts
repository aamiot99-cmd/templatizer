import type { WidgetDefinition } from '../../types'
import { LumappsImageGallery } from './renderers/lumapps'

export const imageGalleryWidget: WidgetDefinition = {
  id: 'imageGallery',
  purpose: {
    category: 'communicate',
    label: 'Galerie photo en grille',
    description:
      "Affiche un ensemble d'images en grille, idéal pour les souvenirs d'événements, l'identité visuelle de l'équipe ou les espaces partagés.",
    keywords: ['galerie', 'gallery', 'images', 'photos', 'grille'],
  },
  platformLabels: {
    lumapps: 'Galerie d\'images',
    sharepoint: 'Galerie d\'images',
    jalios: 'Galerie d\'images',
    jint: 'Galerie d\'images',
  },
  configSchema: [
    {
      key: 'title',
      label: 'Titre du widget',
      type: 'text',
      default: 'Notre dernier événement',
      placeholder: 'Ex. : Galerie',
    },
    {
      key: 'layout',
      label: 'Disposition',
      type: 'select',
      default: 'grid',
      options: [
        { value: 'grid', label: 'Grille uniforme' },
        { value: 'masonry', label: 'Mosaïque (variable)' },
      ],
    },
    {
      key: 'columns',
      label: 'Nombre de colonnes',
      type: 'number',
      default: 3,
      min: 2,
      max: 5,
    },
  ],
  renderers: {
    lumapps: LumappsImageGallery,
  },
}
