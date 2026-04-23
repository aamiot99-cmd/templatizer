import type { WidgetDefinition } from '../../types'
import { SharepointMainBanner } from './renderers/sharepoint'

export const mainBannerWidget: WidgetDefinition = {
  id: 'mainBanner',
  purpose: {
    category: 'communicate',
    label: 'Bannière principale',
    description:
      "Grande bannière en haut de page mélangeant une tuile mise en avant et quatre tuiles secondaires. S'étend sur toute la largeur de la section (full-bleed).",
    keywords: ['bannière', 'banner', 'hero', 'tuiles', 'mise en avant', 'accueil'],
  },
  platformLabels: {
    lumapps: 'Bannière principale',
    sharepoint: 'Bannière principale',
    jalios: 'Bannière principale',
    jint: 'Bannière principale',
  },
  isFullBleed: true,
  // Bannière principale only makes sense at full width
  supportedSizes: {
    sharepoint: ['full'],
  },
  configSchema: [
    {
      key: 'featuredTitle',
      label: 'Titre de la tuile principale',
      type: 'text',
      default: 'Bienvenue ! Cliquez sur Modifier dans le coin supérieur droit de la page pour commencer la personnalisation',
      placeholder: 'Ex. : Bienvenue sur le portail',
    },
    {
      key: 'featuredCta',
      label: 'Libellé du bouton principal',
      type: 'text',
      default: 'En savoir plus',
      placeholder: 'Ex. : En savoir plus',
    },
    {
      key: 'tile1Title',
      label: 'Titre tuile 1 (haut-gauche)',
      type: 'text',
      default: 'En savoir plus sur votre site Communication',
    },
    {
      key: 'tile2Title',
      label: 'Titre tuile 2 (haut-droite)',
      type: 'text',
      default: "Laissez-vous inspirer de l'offre de présentation SharePoint",
    },
    {
      key: 'tile3Title',
      label: 'Titre tuile 3 (bas-gauche)',
      type: 'text',
      default: "Découvrez comment utiliser l'élément web de bannière",
    },
    {
      key: 'tile4Title',
      label: 'Titre tuile 4 (bas-droite)',
      type: 'text',
      default: 'Découvrez des éléments web à ajouter à cette page',
    },
  ],
  renderers: {
    sharepoint: SharepointMainBanner,
  },
}
