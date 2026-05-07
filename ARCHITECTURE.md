# Templatizer — Architecture & Stack technique

Ce document décrit l'architecture globale et la stack technique de Templatizer, pour onboarding équipe et reprise de code.

---

## 1. Vue d'ensemble

**Templatizer** est un outil interne Lecko qui génère des maquettes de homepage d'intranet pour 4 plateformes cibles (LumApps, SharePoint, Jalios, Jint). Les consultants l'utilisent pour produire des supports visuels client en quelques minutes plutôt qu'en quelques heures.

**Modèle d'usage** :
- **Espace partagé** : tous les administrateurs authentifiés (consultants Lecko) voient et éditent les mêmes projets.
- **Verrou par projet** : un projet ouvert est verrouillé pour les autres admins le temps de l'édition (avec récupération automatique en cas d'oubli).
- **Auto-save** : toute modification est persistée en base après 1,2 s d'inactivité.
- À terme : génération de liens de partage pour permettre aux clients de contribuer à leurs propres projets de manière asynchrone.

---

## 2. Stack technique

### Frontend

| Couche | Outil | Version | Rôle |
|---|---|---|---|
| Build | **Vite** | ^8 | Bundler + dev server |
| Framework | **React** | ^19.2 | UI |
| Langage | **TypeScript** | ~6.0 | Typage strict |
| State | **Zustand** | ^5 | Stores globaux légers |
| Drag & drop | **@dnd-kit** | ^6 | Wireframe builder |
| Export image | **html2canvas-pro** | ^2 | Capture des previews |
| Lint | **ESLint** + **typescript-eslint** | ^9 / ^8 | Qualité de code |

### Backend / Plateforme

| Couche | Outil | Rôle |
|---|---|---|
| Auth | **Supabase Auth** | Magic link + mot de passe |
| Base de données | **Supabase Postgres** | Persistance des projets et profils |
| API | **Supabase PostgREST** | API REST auto-générée à partir du schéma Postgres |
| Sécurité | **Postgres Row-Level Security (RLS)** | Contrôle d'accès au niveau ligne |
| Client | **@supabase/supabase-js** | SDK navigateur |

### Hébergement (cible)

- **Cloudflare Pages** pour le frontend (static SPA, build Vite)
- **Supabase Cloud** pour le backend (DB + Auth, déjà déployé)

> Pas de serveur Node/Express : toute la logique métier vit dans le navigateur ou dans Postgres (via RLS et fonctions RPC). C'est un choix volontaire qui simplifie l'opérationnel.

---

## 3. Architecture

### Vue logique

```
┌──────────────────────────────────────────────┐
│           Navigateur (SPA React)             │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌────────────┐ │
│  │LoginScreen│  │AdminView │  │  Wizard /  │ │
│  │(magic /   │  │(liste des│  │  Builder / │ │
│  │ password) │  │ projets) │  │  Preview   │ │
│  └─────┬────┘  └─────┬────┘  └──────┬─────┘ │
│        │             │              │       │
│  ┌─────▼─────────────▼──────────────▼─────┐ │
│  │ useAuthSession │ useProjectsRegistry │  │ │
│  │                │ useProjectStore     │  │ │
│  └─────────────────┬───────────────────────┘ │
│                    │ supabase-js              │
└────────────────────┼─────────────────────────┘
                     │ HTTPS
┌────────────────────▼─────────────────────────┐
│              Supabase (cloud)                │
│  ┌───────────┐  ┌──────────────────────────┐ │
│  │ Auth      │  │ Postgres                 │ │
│  │ (JWT,     │  │  ├─ profiles            │ │
│  │  refresh) │  │  ├─ projects (snapshot   │ │
│  │           │  │  │     en JSONB)         │ │
│  └───────────┘  │  └─ RPC try_lock_project │ │
│                 │     heartbeat_project    │ │
│                 │     release_project_lock │ │
│                 └──────────────────────────┘ │
└──────────────────────────────────────────────┘
```

### Flux principal

1. **Auth** — l'utilisateur se connecte via magic link (par défaut) ou mot de passe. Supabase délivre un JWT, stocké en localStorage et auto-rafraîchi.
2. **Liste des projets** — `useProjectsRegistry.fetchProjects()` charge tous les projets (RLS autorise tout admin authentifié).
3. **Ouverture d'un projet** — `tryOpenProject(id)` appelle la fonction Postgres `try_lock_project` qui pose un verrou atomique. Si quelqu'un édite déjà → modal "Verrouillé par X depuis Y minutes". Sinon → le snapshot est chargé dans `useProjectStore`.
4. **Édition** — toute modification de `useProjectStore` (état actif) déclenche un debounce de 1,2 s, puis `saveSnapshot()` qui écrit le `snapshot` (JSONB) en base et stamp `last_edited_by = moi`.
5. **Heartbeat** — toutes les 30 s, `heartbeat_project` rafraîchit `locked_at` pour empêcher la libération automatique du verrou.
6. **Fermeture** — clic sur "Retour aux projets" / déconnexion / fermeture de l'onglet → `release_project_lock` libère le verrou.
7. **Récupération automatique** — si un onglet meurt sans libérer (crash, perte réseau), un autre admin peut reprendre le verrou après 3 minutes sans heartbeat.

### Pattern à deux stores Zustand

- **`useProjectsRegistry`** ([src/store/projectsRegistry.ts](src/store/projectsRegistry.ts)) — métadonnées de tous les projets + verrous + actions CRUD synchronisées avec Supabase. Source de vérité pour la liste admin.
- **`useProjectStore`** ([src/store/projectStore.ts](src/store/projectStore.ts)) — état d'édition du projet actuellement ouvert (plateforme, branding, wireframe, navigation). Reste local en mémoire ; un effet dans `App.tsx` mirror les changements vers la registry (donc vers Supabase).

> Pourquoi deux stores et pas un seul ? Séparation claire entre données serveur (registry, async, peut échouer) et état d'édition (local, sync, jamais perdu). Le mirror est le pont entre les deux.

---

## 4. Structure du repository

```
templatizer/
├── public/                    # Assets statiques (logo, images)
├── src/
│   ├── admin/                 # Vue admin (dashboard de projets)
│   │   ├── AdminView.tsx
│   │   └── types.ts           # ProjectRecord, ProjectLock
│   ├── auth/                  # Authentification
│   │   ├── LoginScreen.tsx    # Magic link + password
│   │   └── useAuthSession.ts
│   ├── builder/               # Éditeur de wireframe (rows, cells, DnD)
│   ├── lib/
│   │   ├── supabase.ts        # Client Supabase singleton
│   │   └── database.types.ts  # Types TS du schéma Postgres
│   ├── preview/               # Rendu plein écran de la home
│   ├── store/
│   │   ├── projectsRegistry.ts # Source serveur (Supabase)
│   │   └── projectStore.ts     # État du projet actif
│   ├── themes/                # Tokens et chrome par plateforme
│   │   ├── chrome/            # Top bar, navigation par plateforme
│   │   ├── lumapps.ts | sharepoint.ts | jalios.ts | jint.ts
│   │   └── ThemeProvider.tsx
│   ├── types/                 # Types partagés (Platform, Wireframe, ...)
│   ├── widgets/               # 17 widgets (news, apps, events, ...)
│   │   └── <widget>/
│   │       ├── index.ts       # Définition + config
│   │       └── renderers/     # Rendus par plateforme
│   ├── wizard/                # Wizard 5 étapes
│   │   └── steps/
│   ├── App.tsx                # Routage auth / admin / wizard
│   └── main.tsx               # Entry point
├── supabase/
│   └── schema.sql             # Schéma DB idempotent (à exécuter dans Supabase)
├── .env.example               # Template variables d'environnement
├── SETUP.md                   # Procédure de mise en place Supabase
└── ARCHITECTURE.md            # Ce document
```

### Conventions

- **CSS Modules** pour le scoping (`Component.module.css` → `import styles from ...`).
- **Variables globales** (couleurs, espacements, polices) dans [src/index.css](src/index.css) (`--text`, `--bg`, `--wizard-accent`, ...).
- **UI en français**, code et noms de variables en anglais.
- Un dossier par widget. Chaque widget déclare son `id`, sa config schema, ses tailles supportées, et ses renderers par plateforme.
- **Strict TypeScript** (tsconfig hérité de Vite).

---

## 5. Base de données

### Schéma

```sql
profiles (
  id          uuid PK → auth.users.id
  email       text NOT NULL
  full_name   text
  created_at  timestamptz
)

projects (
  id              uuid PK
  owner_id        uuid → profiles(id)         -- créateur
  last_edited_by  uuid → profiles(id)         -- dernier éditeur
  name            text
  snapshot        jsonb                       -- ProjectState complet
  created_at      timestamptz
  updated_at      timestamptz
  locked_by       uuid → profiles(id)         -- verrou
  locked_at       timestamptz
)
```

### Pourquoi `snapshot` en JSONB ?

L'état d'un projet (plateforme, branding, navigation, wireframe avec ses cellules) est complexe et évolue rapidement. Le stocker en JSONB plutôt qu'en tables normalisées :
- supprime la friction des migrations à chaque changement de structure d'un widget,
- garde toute la logique de validation côté TypeScript,
- est largement assez performant à l'échelle attendue (quelques centaines de projets max).

Trade-off : on ne peut pas faire de requêtes SQL fines sur le contenu. Acceptable.

### Trigger automatique

Un trigger `on_auth_user_created` crée automatiquement une ligne `profiles` chaque fois qu'un nouvel utilisateur s'inscrit dans Supabase Auth. Aucun code applicatif à exécuter.

### Fonctions RPC (verrou)

| Fonction | Rôle |
|---|---|
| `try_lock_project(p_id)` | Pose le verrou atomiquement si libre, périmé (>3 min) ou déjà à nous. Retourne l'état. |
| `heartbeat_project(p_id)` | Rafraîchit `locked_at` si le verrou nous appartient. |
| `release_project_lock(p_id)` | Libère le verrou si nous le possédons. |

Le pattern `UPDATE ... WHERE locked_by IS NULL OR locked_at < now() - interval '3 minutes'` garantit l'atomicité : deux clics simultanés ne peuvent pas tous deux acquérir le verrou.

### Row-Level Security (RLS)

**Politique : espace partagé.** N'importe quel utilisateur authentifié peut SELECT, INSERT, UPDATE, DELETE sur `projects`. Le verrou applicatif (RPC ci-dessus) gère les conflits d'édition, pas RLS.

```sql
-- Exemple
create policy "projects: read all"
  on public.projects for select
  using (auth.uid() is not null);
```

Si un jour on veut rétrécir l'accès (ex : verrouiller la suppression aux propriétaires), c'est dans [supabase/schema.sql](supabase/schema.sql) qu'on modifie les `create policy`.

### Source de vérité du schéma

[`supabase/schema.sql`](supabase/schema.sql) est **idempotent** (`CREATE ... IF NOT EXISTS`, `OR REPLACE`, `DROP IF EXISTS`). On peut le rejouer sans casser la base existante. C'est notre "migration unique".

> Pour des projets plus matures, on migrerait vers un système de migrations versionnées (Supabase CLI, Atlas, ...). Pas nécessaire à ce stade.

---

## 6. Authentification & permissions

### Méthodes de connexion

1. **Magic link (par défaut)** — l'utilisateur saisit son email, reçoit un lien à usage unique. Aucun mot de passe à gérer.
2. **Mot de passe (fallback)** — utile si limite de débit email atteinte ou pour comptes de test. Le mot de passe est défini par un admin via SQL :
   ```sql
   UPDATE auth.users
   SET encrypted_password = crypt('mdp', gen_salt('bf'))
   WHERE email = 'user@lecko.fr';
   ```

### Création de comptes

Pour l'instant, **n'importe qui peut s'inscrire** en saisissant un email sur l'écran de connexion (Supabase Auth crée automatiquement le compte au premier magic link). À durcir avant production :

- soit désactiver les inscriptions ouvertes : Dashboard Supabase → Auth → Sign-Ups → désactiver, et créer les comptes manuellement,
- soit ajouter une politique RLS qui filtre par domaine d'email (`@lecko.fr`),
- soit migrer vers OAuth Microsoft (cf. plus bas).

### Migration future vers Microsoft OAuth

Le code est prêt à supporter Azure AD. Pour activer :

1. IT Lecko enregistre une app dans le portail Azure (single-tenant).
2. Dashboard Supabase → Auth → Providers → Azure → coller Client ID + Secret.
3. Dans `LoginScreen.tsx`, remplacer `signInWithOtp` par `signInWithOAuth({ provider: 'azure' })`.

Effort estimé : 10 min côté code, le délai dépend de l'IT.

---

## 7. Déploiement sur Cloudflare Pages

### Configuration de build

Cloudflare Pages détecte automatiquement Vite. Si besoin de configurer manuellement :

| Champ | Valeur |
|---|---|
| **Framework preset** | Vite |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` |
| **Node version** | 20.x ou 22.x |

### Variables d'environnement

À renseigner dans **Cloudflare Pages → Settings → Environment variables** (côté **Production** ET **Preview**) :

```
VITE_SUPABASE_URL=https://hdadnbdxaauqtdgtsitm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...   # clé anon publique uniquement
```

> ⚠️ **Ne jamais** mettre la `service_role` key. Seule la `anon` key va dans le client.

### URLs de redirection Supabase

Une fois le domaine Cloudflare connu (par ex. `templatizer.pages.dev` ou un domaine custom comme `templatizer.lecko.fr`), aller dans **Supabase → Auth → URL Configuration** et :

- **Site URL** : l'URL prod (`https://templatizer.lecko.fr`)
- **Redirect URLs** : ajouter aussi l'URL prod (sans casser l'URL dev `http://localhost:5173`)

Sans ça, les magic links redirigent en 404.

### Domaine custom

Cloudflare Pages → **Custom domains** → ajouter `templatizer.lecko.fr` → suivre l'instruction CNAME / certificat SSL automatique. Compter 5–10 min pour la propagation DNS.

### CI/CD

Cloudflare Pages déploie automatiquement à chaque push sur la branche configurée (par défaut `main`). Branches autres que main → **preview deployments** avec URL temporaire — utile pour partager une feature en revue.

> Recommandation : protéger `main` (ne push direct, passer par PR), et utiliser `v2-dev` comme branche de travail en attendant la fusion.

---

## 8. Conventions de développement

### Hooks Git

Le repo utilise des **auto-save commits** (un commit ~ toutes les ~10 secondes pendant l'édition). Avant de fusionner sur `main`, **squasher** :

```bash
git reset --soft origin/main
git commit -m "feat: ..."
git push --force-with-lease
```

### Ajouter un widget

1. Créer le dossier [`src/widgets/<nom>/`](src/widgets/) avec `index.ts` et `renderers/<plateforme>.tsx`.
2. Ajouter l'import dans [`src/widgets/registry.ts`](src/widgets/registry.ts).
3. Renseigner `purpose`, `platformLabels`, `configSchema`, `supportedSizes`, et au moins un renderer.

Les widgets non implémentés pour une plateforme tombent automatiquement sur le renderer SharePoint si la cible est Jint (cf. `resolveRenderer` dans [registry.ts](src/widgets/registry.ts)).

### Ajouter une plateforme

Plus impliqué : créer un fichier dans [`src/themes/`](src/themes/), un chrome dans [`src/themes/chrome/`](src/themes/chrome/), enrichir le type `Platform` dans [`src/types/platform.ts`](src/types/platform.ts), et ajouter les renderers dans chaque widget.

### Tests

Aucune suite de tests automatisés à ce jour. Vérification manuelle via :

```bash
npm run dev      # serveur dev
npm run build    # build production
npm run lint     # ESLint
```

Le code est petit et la surface fonctionnelle bien encadrée par TypeScript ; ajouter des tests unitaires devient pertinent quand le projet stabilise son périmètre.

---

## 9. Checklist d'onboarding

Pour un nouveau membre de l'équipe :

1. ✅ Cloner le repo, `npm install`, lire `SETUP.md`
2. ✅ Avoir accès au projet Supabase (lecture/écriture du dashboard) — demander à @aamiot
3. ✅ Récupérer `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` (dashboard Supabase → API)
4. ✅ Créer `.env.local` à partir de `.env.example`
5. ✅ `npm run dev` → tester la connexion magic link sur son email pro
6. ✅ Lire ce document + parcourir [`src/App.tsx`](src/App.tsx) pour comprendre le routage haut niveau
7. ✅ Lire [`src/store/projectsRegistry.ts`](src/store/projectsRegistry.ts) pour le pattern Supabase

---

## 10. Liens utiles

- **Code** : repo GitHub `aamiot99-cmd/templatizer`, branche active `v2-dev`
- **Backend** : [Supabase Dashboard](https://supabase.com/dashboard) (projet `hdadnbdxaauqtdgtsitm`)
- **Hébergement** : Cloudflare Pages (à configurer)
- **Documentation Supabase** : https://supabase.com/docs
- **Documentation Vite** : https://vite.dev
- **Documentation Zustand** : https://github.com/pmndrs/zustand

---

*Document maintenu par l'équipe Lecko. Dernière mise à jour : voir l'historique git.*
