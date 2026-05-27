-- Seed: MetalForge Industries — intranet LumApps
-- Coller-coller dans Supabase Dashboard > SQL Editor > Run.
-- Le projet apparaîtra dans la liste admin après refresh.

insert into public.projects (owner_id, name, snapshot, last_edited_by)
select id,
       'MetalForge Industries — intranet',
       $${
  "platform": "lumapps",
  "branding": {
    "name": "MetalForge Industries",
    "logo": null,
    "colors": {
      "primary": "#1a4d8f",
      "secondary": "#f5a623",
      "text": "#202124"
    }
  },
  "wireframe": {
    "rows": [
      {
        "id": "row-1",
        "cells": [
          {
            "id": "cell-r1-1",
            "widgetId": "title",
            "size": "full",
            "config": {
              "title": "Bienvenue chez MetalForge Industries",
              "subtitle": "Le portail des 4 200 collaborateurs des 7 sites industriels du groupe.",
              "size": "large",
              "alignment": "left",
              "showSeparator": true
            }
          }
        ]
      },
      {
        "id": "row-2",
        "cells": [
          {
            "id": "cell-r2-1",
            "widgetId": "news",
            "size": "full",
            "config": {
              "title": "À la une cette semaine",
              "layout": "featured",
              "countMode": "auto",
              "itemCount": 4,
              "showMetrics": true
            }
          }
        ]
      },
      {
        "id": "row-3",
        "columnRatios": [2, 1],
        "cells": [
          {
            "id": "cell-r3-1",
            "widgetId": "articlesList",
            "size": "two-thirds",
            "config": {
              "title": "Articles & retours d'expérience",
              "maxItems": 4,
              "layout": "list"
            }
          },
          {
            "id": "cell-r3-2",
            "widgetId": "linksList",
            "size": "one-third",
            "config": {
              "title": "Outils du quotidien",
              "layout": "list",
              "showDescriptions": true
            }
          }
        ]
      },
      {
        "id": "row-4",
        "columnRatios": [1, 1],
        "cells": [
          {
            "id": "cell-r4-1",
            "widgetId": "text",
            "size": "half",
            "config": {
              "content": "<h3>Message du Directeur Général</h3><p>2026 marque un tournant pour <b>MetalForge Industries</b>. Nous accélérons sur trois axes : la <b>sobriété énergétique</b> de nos lignes, la <b>modernisation de notre supply chain</b> et le renforcement de notre <b>politique de prévention des risques</b>.</p><p>Merci à chacune et chacun pour votre engagement au quotidien.</p><p><i>— Pierre Verlaine, Directeur Général</i></p>"
            }
          },
          {
            "id": "cell-r4-2",
            "widgetId": "calendar",
            "size": "half",
            "config": {
              "title": "Prochains rendez-vous",
              "maxItems": 4,
              "showSeeAll": true
            }
          }
        ]
      },
      {
        "id": "row-5",
        "background": {
          "fill": "solid",
          "pattern": "none",
          "fillColorKey": "primary"
        },
        "cells": [
          {
            "id": "cell-r5-1",
            "widgetId": "communityList",
            "size": "full",
            "config": {
              "title": "Communautés métier à rejoindre",
              "layout": "carousel",
              "maxItems": 4
            }
          }
        ]
      },
      {
        "id": "row-6",
        "cells": [
          {
            "id": "cell-r6-1",
            "widgetId": "usersList",
            "size": "full",
            "config": {
              "title": "Le comité de direction",
              "maxItems": 7
            }
          }
        ]
      }
    ]
  },
  "navEntries": [
    { "id": "nav-1", "label": "Accueil", "url": "#" },
    {
      "id": "nav-2",
      "label": "Production",
      "url": "#",
      "children": [
        { "id": "nav-2-1", "label": "Ateliers", "url": "#" },
        { "id": "nav-2-2", "label": "Qualité", "url": "#" },
        { "id": "nav-2-3", "label": "Maintenance", "url": "#" }
      ]
    },
    {
      "id": "nav-3",
      "label": "Sécurité (HSE)",
      "url": "#",
      "children": [
        { "id": "nav-3-1", "label": "Procédures", "url": "#" },
        { "id": "nav-3-2", "label": "Signalements", "url": "#" },
        { "id": "nav-3-3", "label": "Formations", "url": "#" }
      ]
    },
    {
      "id": "nav-4",
      "label": "Ressources humaines",
      "url": "#",
      "children": [
        { "id": "nav-4-1", "label": "Talents", "url": "#" },
        { "id": "nav-4-2", "label": "Carrières", "url": "#" },
        { "id": "nav-4-3", "label": "Avantages", "url": "#" }
      ]
    },
    { "id": "nav-5", "label": "Documentation", "url": "#" },
    { "id": "nav-6", "label": "Actualités", "url": "#" }
  ],
  "hubMenu": {
    "enabled": false,
    "entries": []
  }
}$$::jsonb,
       id
from public.profiles
where email = 'aamiot@lecko.fr';
