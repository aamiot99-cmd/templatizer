import type { WidgetDefinition } from '../../types'
import { SharepointNews } from './renderers/sharepoint'
import { JaliosNews } from './renderers/jalios'
import { JintNews } from './renderers/jint'

export const newsWidget: WidgetDefinition = {
  id: 'news',
  purpose: {
    category: 'communicate',
    label: 'Actualités et annonces',
    description:
      "Fil d'actualités en cinq dispositions : mise en avant, liste, côte à côte, carrousel ou vignettes.",
    keywords: ['actualités', 'annonces', 'news', 'communication', 'flash info'],
  },
  platformLabels: {
    lumapps: 'Actualités',
    sharepoint: 'Actualités',
    jalios: 'Flash Info',
    jint: 'Actualités',
  },
  configSchema: [
    {
      key: 'title',
      label: 'Titre du widget',
      type: 'text',
      default: '',
      placeholder: 'Ex. : Actualités',
    },
    {
      key: 'layout',
      label: 'Disposition',
      type: 'select',
      default: 'featured',
      platforms: ['sharepoint'],
      options: [
        { value: 'featured',   label: 'Articles à la une', sizes: ['full'], layoutIcon: 'featured' },
        { value: 'list',       label: 'Liste',             layoutIcon: 'list' },
        { value: 'sidebyside', label: 'Côte à côte',       layoutIcon: 'sidebyside' },
        { value: 'carousel',   label: 'Carrousel',         layoutIcon: 'carousel' },
        { value: 'vignettes',  label: 'Vignettes',         layoutIcon: 'vignettes', sizes: ['full', 'two-thirds'] },
      ],
    },
    {
      key: 'countMode',
      label: 'Remplissage',
      type: 'toggle',
      default: 'auto',
      platforms: ['sharepoint'],
      visibleWhen: { key: 'layout', notValue: 'featured' },
      options: [
        { value: 'auto', label: 'Automatique' },
        { value: 'manual', label: 'Manuel' },
      ],
    },
    {
      key: 'itemCount',
      label: "Nombre d'articles",
      type: 'number',
      default: 4,
      min: 1,
      max: 8,
      platforms: ['sharepoint'],
      visibleWhen: [
        { key: 'countMode', value: 'manual' },
        { key: 'layout', notValue: 'featured' },
      ],
    },
    {
      key: 'showMetrics',
      label: 'Afficher les réactions (likes, commentaires)',
      type: 'boolean',
      default: true,
      platforms: ['lumapps', 'jalios', 'jint'],
    },
  ],
  renderers: {
    lumapps: LumappsNews,
    sharepoint: SharepointNews,
    jalios: JaliosNews,
    jint: JintNews,
  },
}
