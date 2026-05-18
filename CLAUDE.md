# CLAUDE.md — Templatizer

> Document de référence pour Claude Code et tout développeur reprenant ce projet.
> Source de vérité complémentaire à `ARCHITECTURE.md` et `README.md`.

---

## Description du projet

**Templatizer** est un outil interne Lecko (React 19 + TypeScript + Vite) qui permet aux consultants de générer des maquettes de homepage d'intranet pour 4 plateformes cibles : **LumApps**, **SharePoint**, **Jalios** et **Jint**. L'outil propose un wizard 5 étapes (plateforme → branding → navigation → wireframe → aperçu) et un builder drag-and-drop. Les projets sont persistés dans Supabase avec un système de verrou d'édition. Les spécifications visuelles détaillées de chaque plateforme se trouvent dans `README.md`.

---

## Commandes utiles

```bash
npm run dev        # Serveur de développement (Vite, port 5173)
npm run build      # Build production (tsc -b && vite build)
npm run lint       # ESLint (typescript-eslint + react-hooks + react-refresh)
npm run preview    # Aperçu du build de production

# Audit (dev-deps installées lors de la phase d'audit) :
npx knip           # Détection code mort / exports inutilisés
npx ts-prune       # Exports TypeScript non consommés
npx depcheck       # Dépendances npm inutilisées
npx madge --circular src/  # Détection des cycles d'imports
npx tsc --noEmit   # Vérification de types sans compilation
npx tsc --noEmit --strict  # Idem en mode strict
```

---

## Conventions de nommage

| Contexte | Convention | Exemple |
|---|---|---|
| Composants React | PascalCase | `Builder.tsx`, `PagerControls.tsx` |
| Fichiers CSS Modules | `<Composant>.module.css` | `Builder.module.css` |
| Hooks custom | camelCase préfixé `use` | `useAuthSession.ts`, `useProjectStore` |
| Stores Zustand | camelCase préfixé `use` | `useProjectsRegistry`, `useProjectStore` |
| Fichiers de types | camelCase | `platform.ts`, `widget.ts` |
| Renderers de widgets | `<plateforme>.tsx` | `jalios.tsx`, `sharepoint.tsx` |
| Thèmes de plateforme | `<plateforme>.ts` | `lumapps.ts`, `jint.ts` |
| Identifiants de widgets | camelCase | `"news"`, `"quickLinks"`, `"editorialCard"` |
| UI (labels) | Français | Boutons, titres, messages |
| Code, variables, props | Anglais | `widgetId`, `platform`, `configSchema` |

---

## Structure des dossiers

```
templatizer/
├── audit/                     # Rapports et captures d'audit (généré lors du cleanup)
├── legacy/                    # Ancien code HTML vanilla — CONSERVER, ne pas modifier
├── public/                    # Assets statiques servis directement
├── src/
│   ├── admin/                 # Vue admin : liste et gestion des projets
│   │   ├── AdminView.tsx
│   │   └── types.ts           # ProjectRecord, ProjectLock
│   ├── auth/                  # Authentification Supabase
│   │   ├── LoginScreen.tsx    # Magic link + mot de passe
│   │   └── useAuthSession.ts  # Hook de session
│   ├── builder/               # Moteur de composition (rows, cells, DnD)
│   │   ├── Builder.tsx        # Composant racine de l'éditeur
│   │   ├── Wireframe.tsx      # Grille drag-and-drop des rows
│   │   ├── Row.tsx            # Une ligne de la grille
│   │   ├── Pool.tsx           # Palette de widgets disponibles
│   │   ├── ConfigPanel.tsx    # Panneau de configuration du widget sélectionné
│   │   ├── ConfigField.tsx    # Champ générique de configuration
│   │   ├── Chip.tsx           # Tag/pill dans le configurateur
│   │   ├── Divider.tsx        # Séparateur visuel
│   │   ├── RichTextEditor.tsx # Éditeur de texte enrichi
│   │   ├── layoutIcons.tsx    # Icônes SVG pour les layouts de row
│   │   └── index.ts           # Exports publics du module builder
│   ├── lib/
│   │   ├── supabase.ts        # Client Supabase singleton
│   │   └── database.types.ts  # Types TypeScript auto-générés du schéma Postgres
│   ├── preview/               # Rendu plein écran de la home (export html2canvas)
│   ├── store/
│   │   ├── projectsRegistry.ts # Source serveur : liste projets + verrous (Supabase)
│   │   └── projectStore.ts     # État d'édition du projet actif (local, mirroré)
│   ├── themes/                # Tokens de design et chromes par plateforme
│   │   ├── chrome/            # Barres top + navigation rendues pour chaque plateforme
│   │   │   ├── index.ts       # Résolution du chrome par plateforme
│   │   │   ├── jint.tsx       # Chrome Jint (barre M365 + site)
│   │   │   └── sharepoint.tsx # Chrome SharePoint (app bar + site bar)
│   │   ├── jalios.ts          # Tokens Jalios
│   │   ├── jint.ts            # Tokens Jint
│   │   ├── lumapps.ts         # Tokens LumApps
│   │   ├── sharepoint.ts      # Tokens SharePoint
│   │   ├── ThemeProvider.tsx  # Injecte les CSS vars de la plateforme active
│   │   └── index.ts           # Exports publics du module themes
│   ├── types/                 # Types TypeScript partagés
│   │   ├── index.ts
│   │   ├── platform.ts        # Type Platform = 'jalios' | 'jint' | 'lumapps' | 'sharepoint'
│   │   ├── project.ts         # ProjectState, ProjectConfig
│   │   ├── widget.ts          # WidgetDefinition, WidgetConfig, WidgetSize
│   │   └── wireframe.ts       # WireframeState, Row, Cell
│   ├── widgets/               # Widgets métier, un dossier par widget
│   │   ├── _shared/           # Composants partagés entre plusieurs renderers
│   │   │   ├── PagerControls.tsx      # Pagination réutilisable
│   │   │   └── buttonIcons.tsx        # Icônes de boutons partagées
│   │   ├── <widget>/
│   │   │   ├── index.ts               # Définition : id, config schema, sizes, renderers
│   │   │   └── renderers/
│   │   │       ├── jalios.tsx         # Rendu Jalios
│   │   │       ├── jint.tsx           # Rendu Jint
│   │   │       ├── lumapps.tsx        # Rendu LumApps
│   │   │       └── sharepoint.tsx     # Rendu SharePoint
│   │   └── registry.ts        # Registre global des widgets + resolveRenderer()
│   ├── wizard/                # Assistant multi-étapes
│   │   ├── Wizard.tsx         # Orchestrateur des étapes
│   │   ├── SubSection.tsx     # Sous-section réutilisable dans les étapes
│   │   ├── index.ts
│   │   └── steps/
│   │       ├── PlatformStep.tsx   # Étape 1 : choix de la plateforme
│   │       ├── BrandingStep.tsx   # Étape 2 : couleurs, logo, police
│   │       ├── NavStep.tsx        # Étape 3 : navigation
│   │       ├── WireframeStep.tsx  # Étape 4 : composition des widgets
│   │       └── PreviewStep.tsx    # Étape 5 : aperçu + export
│   ├── App.tsx                # Routage de haut niveau : auth → admin → wizard/builder
│   ├── App.css
│   ├── index.css              # Variables CSS globales (--text, --bg, --wizard-accent…)
│   └── main.tsx               # Point d'entrée (ReactDOM.createRoot)
├── supabase/
│   └── schema.sql             # Schéma DB idempotent (idempotent, safe à rejouer)
├── .env.example               # Template (ne jamais committer .env.local)
├── ARCHITECTURE.md            # Architecture complète + DB + auth + déploiement
├── CLAUDE.md                  # Ce document
├── README.md                  # Spécifications visuelles des 4 plateformes (source de vérité UI)
└── SETUP.md                   # Procédure de mise en place Supabase
```

---

## Règle fondamentale — 1 renderer par plateforme par widget

Chaque widget dans `src/widgets/<nom>/renderers/` doit avoir exactement un fichier par plateforme supportée :
- `jalios.tsx` → rendu Jalios
- `jint.tsx` → rendu Jint
- `lumapps.tsx` → rendu LumApps
- `sharepoint.tsx` → rendu SharePoint

**Note** : si un widget ne supporte pas une plateforme donnée, il peut tomber en fallback sur SharePoint (cf. `resolveRenderer` dans `registry.ts`). Ce fallback doit être documenté dans l'`index.ts` du widget.

Les composants réutilisables entre plusieurs renderers (ex. pagination, icônes) vont dans `src/widgets/_shared/`.

---

## Règles absolues

1. **NE JAMAIS toucher à `.env.local`** — il contient les clés Supabase (gitignored).
2. **NE JAMAIS committer de secrets** (clés Supabase, tokens). Vérifier avant tout commit.
3. **NE JAMAIS modifier `legacy/`** — conservé à titre de référence historique.
4. **`dist/` est gitignored** — ne pas l'ajouter au tracking git.
5. Toute modification de comportement utilisateur visible doit être décrite dans le message de commit et validée manuellement.

---

## Patterns Zustand

Deux stores séparés par responsabilité :
- **`useProjectsRegistry`** : données serveur (liste, verrous, CRUD Supabase). Asynchrone, peut échouer.
- **`useProjectStore`** : état d'édition local du projet actif. Synchrone, jamais perdu. `App.tsx` le miroire vers la registry (donc vers Supabase) via un effet.

---

## LumApps — Règle structurelle CSS absolue

La structure `.lm-shell > .lm-center > .lm-main + .lm-sidebar` est **obligatoire** (voir `README.md § "Conteneur centré LumApps"`). Ne jamais mettre `display:flex` sur `.lm-shell` — cela colle le contenu aux bords.

---

## Points de vigilance identifiés lors de l'audit

*(Section mise à jour au fur et à mesure des phases d'audit)*

- Chrome Jalios et LumApps **absents** de `src/themes/chrome/` — uniquement Jint et SharePoint. À vérifier si volontaire.
- Jint utilise SharePoint comme fallback renderer pour certains widgets — comportement intentionnel documenté dans `registry.ts`.

---

*Dernière mise à jour : 2026-05-18 — Audit phase 0 (branche `cleanup/audit-2026-05`)*
