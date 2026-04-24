import type { WidgetDefinition } from '../../types'
import { SharepointEditorialCard } from './renderers/sharepoint'

export const editorialCardWidget: WidgetDefinition = {
  id: 'editorialCard',
  purpose: {
    category: 'communicate',
    label: 'Carte éditoriale',
    description:
      "Carte visuelle avec image de fond, titre et description. Trois dispositions : superposition, bloc de couleur ou fractionné.",
    keywords: ['carte', 'éditoriale', 'hero', 'bannière', 'mise en avant', 'image'],
  },
  platformLabels: {
    lumapps: 'Carte éditoriale',
    sharepoint: 'Carte éditoriale',
    jalios: 'Carte éditoriale',
    jint: 'Carte éditoriale',
  },
  configSchema: [
    {
      key: 'layout',
      label: 'Mise en page',
      type: 'select',
      default: 'overlay',
      options: [
        { value: 'overlay', label: "Superposition d'images" },
        { value: 'colorBlock', label: 'Bloc de couleur' },
        { value: 'split', label: 'Fractionner' },
      ],
    },
    {
      key: 'preHeader',
      label: 'Pré-en-tête',
      type: 'text',
      default: 'Ressources Humaines',
      placeholder: 'Ex. : Ressources Humaines',
    },
    {
      key: 'showPreHeader',
      label: 'Afficher le pré-en-tête',
      type: 'boolean',
      default: true,
    },
    {
      key: 'title',
      label: 'Titre',
      type: 'text',
      default: 'Créons ensemble !',
      placeholder: 'Ex. : Créons ensemble !',
    },
    {
      key: 'showTitle',
      label: 'Afficher le titre',
      type: 'boolean',
      default: true,
    },
    {
      key: 'description',
      label: 'Description',
      type: 'text',
      default: "6 clés pour un travail d'équipe efficace",
      placeholder: 'Un court texte descriptif.',
    },
    {
      key: 'showDescription',
      label: 'Afficher la description',
      type: 'boolean',
      default: true,
    },
    {
      key: 'ctaType',
      label: 'Type de lien',
      type: 'select',
      default: 'button',
      options: [
        { value: 'button', label: 'Bouton texte' },
        { value: 'icon', label: 'Icône flèche' },
        { value: 'card', label: 'Carte entière cliquable' },
      ],
    },
    {
      key: 'ctaLabel',
      label: 'Libellé du bouton',
      type: 'text',
      default: 'En savoir plus',
      placeholder: "Ex. : En savoir plus",
    },
    {
      key: 'link',
      label: 'Lien',
      type: 'text',
      default: '',
      placeholder: 'https://...',
    },
    {
      key: 'imageUrl',
      label: "URL de l'image",
      type: 'text',
      default: '',
      placeholder: '/focus/ma-photo.jpg',
      description: "Laissez vide pour utiliser la photo adaptée au layout.",
    },
    {
      key: 'showImage',
      label: "Afficher l'image",
      type: 'boolean',
      default: true,
    },
    {
      key: 'backgroundColor',
      label: 'Couleur de fond',
      type: 'color',
      default: '#1e2333',
      description: "Utilisée quand l'image est masquée, ou comme couleur du panneau (Fractionner).",
    },
  ],
  renderers: {
    sharepoint: SharepointEditorialCard,
  },
}
