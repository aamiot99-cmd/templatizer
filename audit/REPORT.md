# Rapport d'audit — Templatizer
> Branche : `cleanup/audit-2026-05` — Date : 2026-05-18  
> Outils : knip, ts-prune, depcheck, madge + analyse manuelle

---

## Axe 1 — Code mort & exports inutilisés

> `ts-prune` : 0 résultat (passe sans erreur)  
> `knip` : 8 exports valeur + 13 exports type signalés → vérifiés ci-dessous par grep

---

### [A1-01] Faux positif knip — import SVG Vite
- **Fichier :** `src/widgets/imageMap/renderers/jint.tsx:3`
- **Nature :** `import franceMapSvg from '/france-map.svg?raw'` — syntaxe Vite de chargement d'asset public brut. Knip ne comprend pas `?raw` et signale l'import comme non résolu. Le fichier `public/france-map.svg` existe bien.
- **Impact :** ✅ Faux positif — aucune action
- **Correction proposée :** Aucune
- **Effort :** —
- **Risque de régression :** —

---

### [A1-02] Export de valeur mort — `MAX_CELLS_PER_ROW`
- **Fichier :** `src/store/projectStore.ts:170`
- **Nature :** `export const MAX_CELLS_PER_ROW = 3` — utilisé uniquement en interne dans `projectStore.ts` (lignes 311 et 389). Aucun fichier externe n'importe cette constante.
- **Impact :** 🟡 Cosmétique
- **Correction proposée :** Retirer le mot-clé `export` → `const MAX_CELLS_PER_ROW = 3`
- **Effort :** S
- **Risque de régression :** Faible

---

### [A1-03] Export de valeur mort — `CHROMES`
- **Fichier :** `src/themes/chrome/index.ts:13`
- **Nature :** `export const CHROMES` — utilisé uniquement en interne par `getChrome()` dans le même fichier. Aucun fichier externe n'importe `CHROMES` directement (seul `getChrome` est importé depuis `PreviewPage.tsx`).
- **Impact :** 🟡 Cosmétique
- **Correction proposée :** Retirer le mot-clé `export` → `const CHROMES`
- **Effort :** S
- **Risque de régression :** Faible

---

### [A1-04] Export de valeur mort — `WIDGETS`
- **Fichier :** `src/widgets/registry.ts:21`
- **Nature :** `export const WIDGETS` — utilisé uniquement en interne par `getWidget()` dans le même fichier. Les consommateurs externes n'importent que `getWidget`, `listWidgetsForPlatform`, `resolveRenderer`.
- **Impact :** 🟡 Cosmétique
- **Correction proposée :** Retirer le mot-clé `export` → `const WIDGETS`
- **Effort :** S
- **Risque de régression :** Faible

---

### [A1-05] Export de fonction mort — `listWidgets`
- **Fichier :** `src/widgets/registry.ts:46`
- **Nature :** `export function listWidgets()` — utilisée uniquement en interne par `listWidgetsForPlatform()` dans le même fichier. Aucun fichier externe ne l'importe.
- **Impact :** 🟡 Cosmétique
- **Correction proposée :** Retirer le mot-clé `export` → `function listWidgets()`
- **Effort :** S
- **Risque de régression :** Faible

---

### [A1-06] Re-exports morts — thèmes individuels
- **Fichier :** `src/themes/index.ts:14`
- **Nature :** `export { lumappsTheme, sharepointTheme, jaliosTheme, jintTheme }` — ces 4 objets de tokens sont re-exportés depuis `index.ts` mais aucun fichier externe ne les importe directement. Les consommateurs (`projectStore.ts`, `projectsRegistry.ts`) n'importent que `THEMES`.
- **Impact :** 🟡 Cosmétique
- **Correction proposée :** Supprimer la ligne de re-export (ligne 14 de `themes/index.ts`)
- **Effort :** S
- **Risque de régression :** Faible

---

### [A1-07] Export de type mort — `AuthStatus`
- **Fichier :** `src/auth/useAuthSession.ts:5`
- **Nature :** `export type AuthStatus` — utilisé uniquement dans le même fichier. `App.tsx` importe `useAuthSession` mais pas `AuthStatus` directement.
- **Impact :** 🟡 Cosmétique
- **Correction proposée :** Retirer `export` → `type AuthStatus`
- **Effort :** S
- **Risque de régression :** Faible

---

### [A1-08] Export de type mort — `OpenAttemptResult`
- **Fichier :** `src/store/projectsRegistry.ts:39`
- **Nature :** `export interface OpenAttemptResult` — type de retour de `tryOpenProject()`, jamais importé depuis l'extérieur. `App.tsx` utilise `tryOpenProject()` mais n'importe pas le type de retour.
- **Impact :** 🟡 Cosmétique
- **Correction proposée :** Retirer `export` → `interface OpenAttemptResult`
- **Effort :** S
- **Risque de régression :** Faible

---

### [A1-09] Exports de types morts — types de champs de config
- **Fichier :** `src/types/widget.ts:19,29,43,49,57,62,73,86,91,109`
- **Nature :** Les types `ConfigFieldType`, `VisibleWhenCondition`, `TextField`, `NumberField`, `BooleanField`, `ColorField`, `ToggleField`, `IconField`, `RichTextField`, `WidgetPurpose` sont exportés mais aucun fichier externe ne les importe directement. Les consommateurs utilisent uniquement `ConfigSchemaField` (union de ces types) ou `WidgetDefinition` (qui contient `purpose: WidgetPurpose`).
- **Impact :** 🟡 Cosmétique — cependant, ces types constituent le "vocabulaire" du système de config widgets. Les retirer de l'export limiterait les capacités d'extension future.
- **Correction proposée :** Laisser les exports tels quels pour cette raison. Documenter leur rôle via JSDoc en phase 4.
- **Effort :** —
- **Risque de régression :** —
- **Décision :** ⏸ Ne pas traiter (valeur documentaire > coût d'entropie)

---

### [A1-10] Export de type mort — `PagerVariant`
- **Fichier :** `src/widgets/_shared/PagerControls.tsx:3`
- **Nature :** `export type PagerVariant = 'dark' | 'light'` — utilisé uniquement en interne. Aucun fichier externe ne l'importe.
- **Impact :** 🟡 Cosmétique
- **Correction proposée :** Retirer `export` → `type PagerVariant`
- **Effort :** S
- **Risque de régression :** Faible

---

## Axe 2 — Dépendances npm inutilisées

> `depcheck` : signale knip, madge, ts-prune, depcheck comme "inutilisés" → **faux positifs** (utilisés via `npx`, pas importés dans le code). Aucune vraie dépendance inutilisée détectée.

### [A2-01] Audit tools ajoutés en devDependencies
- **Fichier :** `package.json`
- **Nature :** `knip`, `ts-prune`, `depcheck`, `madge` ajoutés pour l'audit. Depcheck les signale comme inutilisés car ils s'exécutent en CLI, pas importés.
- **Impact :** 🟡 Cosmétique
- **Correction proposée :** Supprimer ces 4 devDependencies après l'audit (phase 2)
- **Effort :** S
- **Risque de régression :** Faible

---

### [A2-02] Toutes les dépendances runtime correctement classifiées
- **Nature :** `react`, `react-dom`, `zustand`, `@dnd-kit/*`, `@supabase/supabase-js`, `html2canvas-pro` → tous en `dependencies` ✅. ESLint, TypeScript, Vite, types → tous en `devDependencies` ✅.
- **Impact :** ✅ Rien à faire

---

## Axe 3 — Cycles d'imports

> `madge --circular src/` : **"✔ No circular dependency found!"** ✅

Aucun cycle d'import détecté. L'architecture est propre : types → stores → themes/widgets → builder/wizard/preview.

---

## Axe 4 — Doublons logiques inter-renderers

### [A4-01] Fonction `initials()` / `initialsOf()` dupliquée 4 fois
- **Fichier :** `src/themes/chrome/jint.tsx:19`, `src/themes/chrome/sharepoint.tsx:19`, `src/widgets/news/renderers/jint.tsx:23`, `src/widgets/news/renderers/sharepoint.tsx:87`
- **Nature :** Quatre implémentations identiques de la même fonction utilitaire :
  ```typescript
  // Toutes font la même chose :
  name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  ```
  Deux nommages différents (`initials` vs `initialsOf`) pour la même logique.
- **Impact :** 🟠 Important (maintenance : modifier la logique → 4 endroits)
- **Correction proposée :** Créer `src/widgets/_shared/utils.ts` avec `export function initials(name: string): string`. Remplacer les 4 occurrences locales par un import.
- **Effort :** S
- **Risque de régression :** Faible

---

### [A4-02] Tokens de thème identiques Jint ≈ SharePoint (intentionnel)
- **Fichier :** `src/themes/jint.ts`, `src/themes/sharepoint.ts`
- **Nature :** Jint et SharePoint partagent les mêmes valeurs pour `primary (#0078d4)`, `text (#323130)`, `background (#f3f2f1)`, `surface (#ffffff)`, `border (#edebe9)`, `typography (Segoe UI)`. C'est intentionnel : Jint est documenté comme "surcouche SharePoint" dans `registry.ts:60`.
- **Impact :** ✅ Intentionnel — pas de factorisation pertinente
- **Correction proposée :** Aucune. Documenter explicitement en phase 4.

---

### [A4-03] Chrome absent pour Jalios et LumApps
- **Fichier :** `src/themes/chrome/index.ts`
- **Nature :** `CHROMES` ne contient que `jint` et `sharepoint`. `getChrome('jalios')` et `getChrome('lumapps')` retournent `undefined`. Dans `PreviewPage.tsx`, si `getChrome` retourne undefined, aucune barre chrome n'est rendue. C'est cohérent avec le fait que ces plateformes sont moins représentées (1 widget chacune).
- **Impact :** 🟡 Cosmétique — comportement délibéré mais non documenté dans le code
- **Correction proposée :** Ajouter un commentaire dans `chrome/index.ts` expliquant l'absence, plutôt que d'implémenter des chromes incomplets. Phase 4.
- **Effort :** S
- **Risque de régression :** Faible

---

### [A4-04] Couverture widgets Jalios et LumApps très limitée (décision produit)
- **Nature :** Jalios → 1 widget (`news`). LumApps → 1 widget (`news`). Jint → 18 widgets. SharePoint → 11 widgets. Résulte du fait qu'il n'y a pas de fallback pour jalios/lumapps (contrairement à jint→sharepoint).
- **Impact :** 🟡 Cosmétique — décision produit, pas un bug de code
- **Correction proposée :** Documenter explicitement dans `CLAUDE.md` et dans le commentaire de `resolveRenderer`.

---

## Axe 5 — Legacy & assets

### [A5-01] `legacy/` non référencé depuis `src/` ✅
- **Nature :** Aucun import depuis `src/` vers `legacy/`. Le dossier est bien isolé.
- **Impact :** ✅ RAS — conformément à la consigne, conservé tel quel.

---

### [A5-02] `dist/` non tracké par git ✅
- **Nature :** `dist/` est dans `.gitignore` et `git ls-files dist/ | wc -l` retourne 0.
- **Impact :** ✅ RAS

---

### [A5-03] `public/france-map.svg` correctement référencé ✅
- **Nature :** Fichier présent dans `public/`. Import Vite `?raw` depuis `imageMap/renderers/jint.tsx`. Knip génère un faux positif (voir A1-01).
- **Impact :** ✅ RAS

---

## Axe 6 — Anti-patterns React 19

### [A6-01] **BUILD CASSÉ** — `JSX.Element` déprécié (React 19)
- **Fichier :** `src/widgets/_shared/buttonIcons.tsx:101`
- **Nature :** `type IconComponent = (props: IconProps) => JSX.Element` — En React 19 avec `"jsx": "react-jsx"`, le namespace global `JSX` n'est plus disponible. Erreur `TS2503: Cannot find namespace 'JSX'`. Bloque `npm run build` (tsc -b).
- **Impact :** 🔴 Bloquant — le build de production est cassé
- **Correction proposée :** Remplacer `JSX.Element` par `React.JSX.Element` et ajouter `import React from 'react'` (ou utiliser `ReactElement` via `import type { ReactElement } from 'react'`).
- **Effort :** S
- **Risque de régression :** Faible

---

### [A6-02] Potentiel — `JSX.Element` dans un cast de type
- **Fichier :** `src/builder/ConfigField.tsx:120`
- **Nature :** `entry as () => JSX.Element` — même problème potentiel. La raison pour laquelle ce cast ne bloque pas `tsc -b` actuellement est que la compilation s'arrête avant de traiter ce fichier (à cause de A6-01). À corriger en même temps.
- **Impact :** 🟠 Important (potentiellement bloquant une fois A6-01 corrigé)
- **Correction proposée :** Remplacer par `entry as () => React.JSX.Element`
- **Effort :** S
- **Risque de régression :** Faible

---

### [A6-03] **CRITIQUE** — Violation `rules-of-hooks` dans `RenderedRow`
- **Fichier :** `src/preview/PreviewPage.tsx:343-407`
- **Nature :** Le composant `RenderedRow` effectue un early return à la ligne 343 (`if (row.cells.length === 0) return null`) AVANT les appels à `useState` (l.357), `useRef` (l.358), `useCallback` (l.360), `useEffect` (l.392). Violation de la règle des Hooks : les hooks doivent être appelés dans le même ordre à chaque rendu, sans conditions ni early returns.
  ```tsx
  function RenderedRow({ row, index }) {
    const platform = useProjectStore(...)  // ✓ avant le return
    const branding = useProjectStore(...)  // ✓ avant le return
    if (row.cells.length === 0) return null  // ← early return ICI
    // ...
    const [itemCountOverrides, setItemCountOverrides] = useState<...>({})  // ✗ APRÈS
    const cellRefs = useRef<...>(new Map())  // ✗ APRÈS
    const measure = useCallback(...)  // ✗ APRÈS
    useEffect(...)  // ✗ APRÈS
  ```
- **Impact :** 🔴 Bloquant — peut provoquer des crashs React en production si `row.cells` est parfois vide et parfois non (l'ordre des hooks change entre les rendus).
- **Correction proposée :** Déplacer tous les hooks avant l'early return. Initialiser `itemCountOverrides` comme state vide, et conditionner l'`useEffect` intérieurement (`if (!hasStacked) return`). Le guard `if (row.cells.length === 0)` peut rester comme rendu conditionnel (ne pas appeler `return null` avant les hooks).
- **Effort :** M
- **Risque de régression :** Moyen (logique de mesure de hauteur à vérifier)

---

### [A6-04] `setState` synchrone en corps d'effet — `useAuthSession`
- **Fichier :** `src/auth/useAuthSession.ts:18`
- **Nature :** `setStatus('unauthenticated')` appelé directement dans le corps d'un `useEffect`, avant de retourner (guard sur `!supabase`). ESLint `react-hooks/set-state-in-effect` flag ce pattern. Fonctionnellement, ce guard est exécuté une seule fois (dépendances `[]`), donc pas de cascades réelles.
- **Impact :** 🟡 Cosmétique (lint échoue, mais comportement runtime correct)
- **Correction proposée :** Extraire l'initialisation dans `useState` : `useState<AuthStatus>(!supabase ? 'unauthenticated' : 'loading')`. Supprimer le guard `if (!supabase)` du `useEffect`.
- **Effort :** S
- **Risque de régression :** Faible

---

### [A6-05] `setState` synchrone en corps d'effet — `JintApps`
- **Fichier :** `src/widgets/apps/renderers/jint.tsx:52`
- **Nature :** `setCols(COMPACT_COLS)` et `setPage(0)` appelés directement dans un `useEffect` (branche `if (isCompact)`). ESLint `react-hooks/set-state-in-effect` flag ce pattern. Fonctionnellement correct : la branche `isCompact` permet d'éviter le `ResizeObserver` quand inutile.
- **Impact :** 🟡 Cosmétique (lint échoue, comportement runtime correct)
- **Correction proposée :** Initialiser `cols` avec la valeur correcte directement : `useState(isCompact ? COMPACT_COLS : 1)` (déjà fait à la ligne 47). Supprimer la branche `if (isCompact)` du `useEffect` et conditionner uniquement l'observation DOM.
- **Effort :** S
- **Risque de régression :** Faible

---

### [A6-06] `handlePointerUp` auto-référencé via closure dans `Divider`
- **Fichier :** `src/builder/Divider.tsx:72-81`
- **Nature :** `handlePointerUp` est un `useCallback` qui se référence lui-même dans son corps (pour le `removeEventListener`). ESLint `react-hooks/immutability` détecte l'accès à la variable avant sa déclaration complète. Fonctionnellement correct car les event listeners sont attachés via `handlePointerDown` (après que `handlePointerUp` est initialisé).
- **Impact :** 🟡 Cosmétique (lint échoue, comportement runtime correct)
- **Correction proposée :** Utiliser un `useRef` pour stocker le handler de pointerUp et le passer à l'écouteur — évite la self-référence. Ou stocker la référence dans un ref séparé.
- **Effort :** M
- **Risque de régression :** Moyen (logique drag critique du builder)

---

### [A6-07] Dépendance manquante `row.cells` dans `useEffect` de `RenderedRow`
- **Fichier :** `src/preview/PreviewPage.tsx:407`
- **Nature :** `useEffect(() => {...}, [hasStacked, measure])` — `row.cells` est utilisé dans la boucle de l'effet mais absent du tableau de dépendances. ESLint `react-hooks/exhaustive-deps` (warning). `measure` est déjà calculé depuis `row`, donc ce warning est en pratique peu risqué.
- **Impact :** 🟡 Cosmétique (warning, non bloquant)
- **Correction proposée :** Ajouter `row.cells` aux dépendances de l'`useEffect`. Ce changement est lié à A6-03 (refactoring du composant), à traiter ensemble.
- **Effort :** S (dans le cadre de A6-03)
- **Risque de régression :** Faible

---

### [A6-08] Composants denses mais justifiés (> 300 lignes)
- **Fichiers :** `PreviewPage.tsx` (476l), `projectStore.ts` (464l), `RichTextEditor.tsx` (449l), `highlightedContent/sharepoint.tsx` (664l)
- **Nature :** `PreviewPage.tsx` gère la capture html2canvas + rendu wireframe (densité justifiée). `projectStore.ts` est le store d'état central (densité acceptable). `RichTextEditor.tsx` implémente un éditeur complet (densité justifiée). `highlightedContent/sharepoint.tsx` implémente 5 layouts dans un seul fichier (candidat au découpage, mais fonctionnellement cohérent).
- **Impact :** 🟡 Cosmétique pour `highlightedContent` uniquement
- **Correction proposée :** `highlightedContent/sharepoint.tsx` — extraire chaque layout (`GridLayout`, `ListeLayout`, `CarrouselLayout`, etc.) dans un sous-composant dédié dans le même fichier, ou dans des fichiers séparés dans `renderers/highlightedContent/`. Les autres sont acceptables.
- **Effort :** L (highlightedContent uniquement, si validé)
- **Risque de régression :** Moyen

---

## Axe 7 — Typage

### [A7-01] `tsc --noEmit` ✅ — 0 erreur
### [A7-02] `tsc --noEmit --strict` ✅ — 0 erreur
### [A7-03] Zéro `any` explicite ✅
### [A7-04] Zéro `@ts-ignore` / `@ts-expect-error` ✅

### [A7-05] Casts `as` douteux — `config.xxx as Type` dans les renderers
- **Fichier :** `src/widgets/highlightedContent/renderers/sharepoint.tsx:629-630`
  ```typescript
  const contentType = (config.contentType as ContentType) || 'documents'
  const rawLayout = (config.layout as Layout) || 'grille'
  ```
- **Nature :** Pattern systématique dans tous les renderers : `config` est de type `ConfigValues = Record<string, string|number|boolean>`, donc les valeurs sont accédées via un cast. C'est une conséquence du design générique de `ConfigValues`. Acceptable et homogène dans tout le projet.
- **Impact :** 🟡 Cosmétique — design volontaire, pas un bug
- **Correction proposée :** Aucune modification nécessaire. Documenter le pattern en phase 4.

---

### [A7-06] Cast `as unknown as ProjectRow` dans `projectsRegistry.ts`
- **Fichier :** `src/store/projectsRegistry.ts:133,160,192`
- **Nature :** `(data as unknown as ProjectRow)` — nécessaire car le client Supabase retourne des types génériques. Pattern courant avec Supabase JS v2.
- **Impact :** 🟡 Cosmétique
- **Correction proposée :** Aucune. Alternative : définir des fonctions de parsing typées (zod/valibot), mais c'est hors périmètre.

---

## Axe 8 — Cohérence inter-plateformes

### [A8-01] Contrat de props uniforme ✅
- **Nature :** Tous les renderers de tous les widgets utilisent `WidgetRendererProps` comme interface de props (`{ config: ConfigValues, size: WidgetSize, branding: Branding }`). Aucune divergence détectée.
- **Impact :** ✅ RAS

---

### [A8-02] Fallback Jint → SharePoint documenté et cohérent ✅
- **Fichier :** `src/widgets/registry.ts:60-61`
- **Nature :** `if (platform === 'jint') return widget.renderers.sharepoint` — commentaire explicatif présent. Comportement intentionnel, cohérent avec la description de Jint comme "surcouche SharePoint".
- **Impact :** ✅ RAS

---

### [A8-03] Jalios et LumApps : couverture intentionnellement limitée
- **Nature :** Jalios et LumApps n'ont pas de fallback → uniquement 1 widget (`news`) disponible pour le builder sur ces plateformes. C'est une décision de priorisation produit, pas un oubli. Aucune incohérence de contrat de props.
- **Impact :** 🟡 Cosmétique — à documenter clairement
- **Correction proposée :** Documenter dans `CLAUDE.md` et commentaire de `resolveRenderer`.

---

## Récapitulatif — Matrice de décision

| ID | Titre | Impact | Effort | Risque | Recommandation |
|---|---|---|---|---|---|
| A1-02 | `export MAX_CELLS_PER_ROW` | 🟡 | S | Faible | Phase 2 |
| A1-03 | `export CHROMES` | 🟡 | S | Faible | Phase 2 |
| A1-04 | `export WIDGETS` | 🟡 | S | Faible | Phase 2 |
| A1-05 | `export listWidgets` | 🟡 | S | Faible | Phase 2 |
| A1-06 | Re-exports thèmes morts | 🟡 | S | Faible | Phase 2 |
| A1-07 | `export AuthStatus` | 🟡 | S | Faible | Phase 2 |
| A1-08 | `export OpenAttemptResult` | 🟡 | S | Faible | Phase 2 |
| A1-09 | Types de champs exportés | 🟡 | — | — | ⏸ Abandonné |
| A1-10 | `export PagerVariant` | 🟡 | S | Faible | Phase 2 |
| A2-01 | Audit tools en devDeps | 🟡 | S | Faible | Phase 2 |
| A4-01 | `initials()` dupliquée ×4 | 🟠 | S | Faible | Phase 3 |
| A4-03 | Chrome absent Jalios/LumApps | 🟡 | S | Faible | Phase 4 (doc) |
| A4-04 | Couverture Jalios/LumApps | 🟡 | S | Faible | Phase 4 (doc) |
| A6-01 | `JSX.Element` casse build | 🔴 | S | Faible | Phase 2 |
| A6-02 | `JSX.Element` dans cast | 🟠 | S | Faible | Phase 2 |
| A6-03 | Rules-of-hooks `RenderedRow` | 🔴 | M | Moyen | Phase 3 |
| A6-04 | setState useEffect auth | 🟡 | S | Faible | Phase 3 |
| A6-05 | setState useEffect JintApps | 🟡 | S | Faible | Phase 3 |
| A6-06 | handlePointerUp self-ref | 🟡 | M | Moyen | Phase 3 |
| A6-07 | deps manquante useEffect | 🟡 | S | Faible | Phase 3 (avec A6-03) |
| A6-08 | `highlightedContent` 664l | 🟡 | L | Moyen | Phase 3 (si validé) |
| A7-05 | Casts config.xxx | 🟡 | — | — | Phase 4 (doc) |
| A7-06 | Cast `as unknown as ProjectRow` | 🟡 | — | — | Phase 4 (doc) |
| A8-03 | Doc Jalios/LumApps | 🟡 | S | Faible | Phase 4 (doc) |

---

*Rapport généré en phase 1 — branche `cleanup/audit-2026-05` — 2026-05-18*
