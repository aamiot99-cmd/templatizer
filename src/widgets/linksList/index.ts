import type { WidgetDefinition } from '../../types'
import { LumappsLinksList } from './renderers/lumapps'

export const linksListWidget: WidgetDefinition = {
  id: 'linksList',
  purpose: {
    category: 'access',
    label: 'Liste de liens curés (icône + libellé)',
    description:
      "Liste de raccourcis vers des ressources internes ou externes. Chaque lien combine une icône et un libellé, parfait pour exposer les outils ou pages clés.",
    keywords: ['liens', 'links', 'raccourcis', 'shortcuts', 'navigation'],
  },
  platformLabels: {
    lumapps: 'Liens',
    sharepoint: 'Liens',
    jalios: 'Liens',
    jint: 'Liens',
  },
  configSchema: [
    {
      key: 'title',
      label: 'Titre du widget',
      type: 'text',
      default: 'Liens utiles',
      placeholder: 'Ex. : Outils internes',
    },
    {
      key: 'layout',
      label: 'Disposition',
      type: 'select',
      default: 'list',
      options: [
        { value: 'list', label: 'Liste verticale' },
        { value: 'grid', label: 'Grille' },
      ],
    },
    {
      key: 'showDescriptions',
      label: 'Afficher les descriptions',
      type: 'boolean',
      default: true,
    },
  ],
  renderers: {
    lumapps: LumappsLinksList,
  },
}
