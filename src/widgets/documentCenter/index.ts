import type { WidgetDefinition } from '../../types'
import { JintDocumentCenter } from './renderers/jint'

export const documentCenterWidget: WidgetDefinition = {
  id: 'documentCenter',
  purpose: {
    category: 'access',
    label: 'Centre documentaire (recherche + filtres + résultats)',
    description:
      'Expérience de recherche complète : barre de saisie, filtres latéraux et zone de résultats. Bundle des 3 webparts Jint Search Center, occupe toute la largeur de la section.',
    keywords: [
      'recherche',
      'search',
      'centre documentaire',
      'document center',
      'filtres',
      'search center',
    ],
  },
  platformLabels: {
    lumapps: 'Centre documentaire',
    sharepoint: 'Centre documentaire',
    jalios: 'Centre documentaire',
    jint: 'Centre documentaire',
  },
  isSectionExclusive: true,
  forceWhiteSection: true,
  supportedSizes: {
    jint: ['full'],
  },
  configSchema: [
    {
      key: 'title',
      label: 'Titre du widget',
      type: 'text',
      default: 'Centre documentaire',
      placeholder: 'Ex. : Centre documentaire',
    },
    {
      key: 'searchPlaceholder',
      label: "Texte d'invite de la barre de recherche",
      type: 'text',
      default: 'Rechercher des documents…',
      placeholder: 'Ex. : Rechercher dans la base documentaire',
    },
    {
      key: 'resultsLayout',
      label: 'Disposition des résultats',
      type: 'select',
      default: 'tile',
      options: [
        { value: 'table', label: 'Tableau' },
        { value: 'tile', label: 'Tuiles' },
        { value: 'card', label: 'Cartes' },
      ],
    },
    {
      key: 'showFilterDate',
      label: 'Afficher le filtre Date',
      type: 'boolean',
      default: true,
    },
    {
      key: 'showFilterType',
      label: 'Afficher le filtre Type de contenu',
      type: 'boolean',
      default: true,
    },
    {
      key: 'showFilterAuthor',
      label: 'Afficher le filtre Auteur',
      type: 'boolean',
      default: false,
    },
  ],
  renderers: {
    jint: JintDocumentCenter,
  },
}
