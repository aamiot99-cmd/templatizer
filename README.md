# Intranet Visual Specifications
> Reference document for visual inspiration and layout constraints per platform.
> Organized in 4 sections per platform: **UI Signature**, **native blocks**, **block capabilities**, **layout & margins**.

---

## ━━━━━━━━━━  JINT  ━━━━━━━━━━
*Personnalité visuelle : corporate-social, modulaire, intégré M365. Contenu large avec peu de marges latérales. Mélange de blocs illustration/photo, widgets de type "carte arrondie", séparateurs texte entre les sections. Palette bleue dominante avec accents jaune-or possibles selon le thème.*

### Signature UI — Boutons & Icônes

- **Intégration M365** : barre suite Microsoft en haut (fond sombre, ~48px) avec logo M365, recherche, icônes notifications/profil — présente quand Jint tourne sur Microsoft 365.
- **Barre site** : fond blanc, logo marque à gauche, navigation horizontale (items texte avec dropdowns, ~5–7 items), pas de sidebar gauche visible dans cette configuration.
- **Hero illustré** : fond blanc avec motif de points/grille discret, illustration 3D (personnages, objets) à droite, titre bold en couleur de marque à gauche — alternative au hero photo plein fond.
- **Carré date événement** : carré aux coins arrondis (~border-radius 12px), fond couleur de marque (bleu), grand chiffre jour en blanc + mois en dessous — signature distinctive du widget événements.
- **Carte contenu gradient** : grande carte avec fond dégradé couleur de marque (shapes/bulles translucides), inner card blanche à border-radius élevé (~20px) avec titre, texte et bouton CTA bleu rectangle arrondi.
- **Bouton "Show more" / CTA secondaire** : rectangle bleu à coins légèrement arrondis (~border-radius 8px), pas une pill — distinct du bouton pill jaune-or des cartes éditoriales.
- **Boutons CTA sur cartes éditoriales** : pilule arrondie (border-radius max) jaune-or (#F5C200 approx), label blanc ou sombre — signature reconnaisable.
- **Tags/pills sur les news** : petites pills à coins légèrement arrondis, couleur de catégorie unie, texte blanc ou foncé — style plat, sans bordure.
- **Icônes de réaction sociale** : ligne horizontale d'icônes avec label texte en dessous — "Discussion" (bulle), "Compliment" (étoile), "Gamification" (trophée), "Sondage" (graphique). Style flat icon + label.
- **Actions sur articles** : icône like + chiffre, icône commentaire + chiffre, icône partage — rangée compacte inline sous les posts.
- **Lanceur d'applications** : icônes app aux coins arrondis (logos couleur marque), label texte en dessous, en ligne horizontale avec carrousel et flèches de navigation.
- **Séparateurs de section** : label texte centré (ex. "Internal news") avec lignes horizontales de part et d'autre — marque visuellement la transition entre zones de contenu.

---

### Part 1 — Native Blocks

| Block | Description |
|-------|-------------|
| Hero Banner (photo) | Pleine largeur, photo de fond, grand titre blanc, sous-titre |
| Hero Banner (illustré) | Fond blanc + motif dots, illustration 3D droite, titre bold couleur marque gauche, sous-titre — style éditorial sans photo plein fond |
| News Grid ("News at…") | 1 grande carte vedette + grille 2×2 cartes secondaires, toutes avec image fond + overlay sombre + titre blanc |
| My News Feed | Colonne de cartes articles personnalisées : image, titre, auteur, actions (like, commentaire, partage) |
| Editorial Cards | 3 colonnes, image fond avec overlay sombre, titre, sous-titre, bouton CTA pill or |
| Rich Text Block | Texte formaté : titres, paragraphes, liens |
| Section Separator | Label texte centré entre deux lignes horizontales — marque le passage entre zones (ex. "Internal news") |
| Applications Launcher | Rangée horizontale d'icônes app (logos couleur marque, coins arrondis) + labels, avec carrousel et flèches nav |
| Company Events | Carte blanche : liste d'événements avec carré date coloré (jour + mois), titre en bleu, plage horaire en gris |
| My Events | Agenda personnel : carré date coloré + titre lien bleu + horaire — même structure que Company Events |
| CTA Content Card | Grande carte border-radius élevé : fond dégradé couleur marque + shapes translucides, inner card blanche avec titre, texte, bouton CTA bleu rectangle |
| CTA Question Block | Bloc blanc avec texte question + bouton bleu arrondi (ex. "Visit our FAQ", "Let's go!"), souvent avec illustration 3D |
| Birthday Widget | Grille d'avatars avec nom, poste, "It's today!" sous chaque profil |
| New Arrivals | Carrousel de profils nouveaux arrivants : avatar circulaire, nom, poste, date d'arrivée |
| Social Media Feed | Grille 4 colonnes de posts sociaux : logo réseau, nom, texte, image, "View all" |
| Social Feed | Posts utilisateurs avec réactions, commentaires, icônes typées (Discussion, Compliment, Gamification, Sondage) |
| People Contacts | Grille d'avatars circulaires avec nom et rôle |
| People Directory (Trombinoscope) | Grille employés avec recherche et filtres |
| Org Chart | Arbre hiérarchique de profils avec expand/collapse |
| My Meetings | Agenda groupé par date : heure, titre, participants |
| My Tasks | Liste checkbox : titre, date d'échéance |
| My Documents | Liste docs récents : icône, titre, date modif |
| Document Cards (Search) | Grille de cartes contenu : miniature image, tags géo, étoile, titre, date, avatar auteur |
| Map | Carte géographique interactive avec épingles de localisation |

---

### Part 2 — Block Capabilities

| Block | Dimensions | Nb éléments max | Types de contenu | Options de mise en page |
|-------|-----------|-----------------|------------------|--------------------------|
| Hero Banner (photo) | Pleine largeur, ~400–600px hauteur | 1 | Image fond, titre, sous-titre | Texte aligné gauche ou centré |
| Hero Banner (illustré) | Pleine largeur, ~220–280px hauteur | 1 | Fond blanc + motif dots, illustration droite, titre couleur marque gauche | Texte gauche / illustration droite |
| News Grid | Pleine largeur | 1 vedette + 4 secondaires | Image fond, overlay sombre, titre blanc, avatar, actions like/share | Grande carte gauche (col span 2) + 2×2 grille droite |
| My News Feed | ~35–40% largeur (col droite) | 3–5 | Image card, titre, auteur, like/commentaire/partage | Liste verticale compacte |
| Editorial Cards | Pleine largeur | 3 | Image fond, overlay sombre, titre, sous-titre, bouton pill or | 3 colonnes égales |
| Section Separator | Pleine largeur, ~20px | — | Label texte centré, deux lignes flanquantes | Centré, fond blanc |
| Applications Launcher | Pleine largeur | 6–8 visibles | Icône app (logo couleur marque, carré arrondi), label texte | Rangée horizontale, carrousel avec flèches gauche/droite + dots |
| Company Events | ~50% largeur | 3–5 | Carré date couleur marque (jour bold + mois), titre bleu, horaire gris | Liste verticale dans carte blanche |
| CTA Content Card | ~50% largeur | 1 | Fond gradient + shapes translucides, inner card blanche : titre, corps, bouton bleu rect. arrondi | Outer card grand radius ; inner card centrée |
| CTA Question Block | ~50% largeur | 1 | Texte question, bouton bleu arrondi, illustration 3D | Texte gauche + illustration droite (ou haut/bas) |
| Birthday Widget | Pleine largeur | 3–5 visibles | Avatar circulaire, nom, poste, "It's today!" | Grille 3–5 colonnes |
| New Arrivals | Pleine largeur | 5 visibles | Avatar circulaire, nom, poste, date arrivée | Carrousel horizontal avec loupe droite |
| Social Media Feed | Pleine largeur | 4 colonnes | Logo réseau, nom compte, texte post, image, lien "View all" | Grille 4 colonnes, posts empilés par colonne |
| Social Feed | ~40% largeur | 4–6 posts | Avatar, nom, texte, lien, icônes réaction typées | Colonne unique défilante |
| People Contacts | Contenu | 4–6 | Avatar circulaire, nom, rôle | 4 par rangée |
| People Directory | Pleine largeur | Paginé | Avatar, nom, poste, tag département | Grille 6 colonnes, filtres à gauche |
| Org Chart | Pleine largeur | Illimité (paginé) | Avatar, nom, rôle, département | Arbre hiérarchique |
| My Meetings | ~30% largeur | 5–8 | Groupe date, heure, titre | Liste chronologique |
| My Documents | ~30% largeur | 4–5 | Icône, titre, date modif | Liste |
| Document Cards | Pleine largeur | 9 (grille 3×3) | Miniature image, tags géo pills, étoile, titre, date, avatar | Grille 3 colonnes |
| Map | ~50% largeur | Épingles multiples | Marqueurs de localisation | Interactif, non éditable |

---

### Part 3 — Layout & Marges

- **Intégration M365 (optionnelle)** : quand Jint tourne sur Microsoft 365, une barre suite sombre (~48px) coiffe la page au-dessus de la barre site. Elle contient logo M365, search global, notifications, profil.
- **Barre site** : fond blanc, logo marque gauche, navigation horizontale (~5–7 items avec dropdowns), pas de sidebar gauche dans la configuration standard observée.
- **Largeur du contenu** : quasi pleine largeur après légères marges (~20–40px de chaque côté). Les blocs s'étendent bord à bord dans leur zone.
- **Colonnes** : 1 ou 2 colonnes par section. La 2-col typique : ~60% gauche (news/events) + ~40% droite (feed/CTA).
- **Blocs pleine largeur** : Hero (photo ou illustré), News Grid, Editorial Cards, Social Media Feed, Section Separator, New Arrivals, Birthday Widget
- **Empilement des sections** : vertical, séparés par des labels texte centrés (Section Separator) ou du whitespace.
- **Fond de page alternatif** : certaines implémentations Jint utilisent un fond dégradé bleu avec une vague organique blanche séparant les sections — signature visuelle forte.
- **Typographie** : titres bold en couleur de marque (bleu ou jaune-or), texte corps regular sombre sur fond blanc.
- **Palette observée** : bleu (#0078D4 approx Microsoft / ou bleu marque), blanc, gris clair pour fonds de page, jaune-or (#F5C200) pour boutons pill éditoriaux, dégradés violet/lavande pour cartes CTA.

---
---

## ━━━━  SHAREPOINT  ━━━━
*Personnalité visuelle : modulaire, épuré, Microsoft-natif. Contraste fort entre sections blanches et sections couleur de marque. Le contenu est délibérément contenu en largeur sous le banner — pas de pleine largeur.*

### Signature UI — Boutons & Icônes

- **Quick Links (style bouton)** : rectangle outlined (sans fill, juste une bordure fine), icône line art À GAUCHE du label texte, fond transparent ou couleur de marque — style "ghost button", très plat et minimaliste.
- **Boutons de navigation (Précédent/Suivant)** : rectangle outlined, `«` chevrons À GAUCHE pour Précédent, `»` À DROITE pour Suivant — format deux lignes (label de section au-dessus + label du bouton). Aucune autre plateforme n'utilise ce pattern de navigation paginée entre pages.
- **Lien CTA dans le Hero** : PAS un bouton — lien texte inline avec flèche → en fin de phrase, blanc sur fond sombre. Aucun vrai bouton dans le hero natif.
- **Miniatures événements** : carré coloré uni (couleur de marque) OU photo, ~120px, avec pill de catégorie overlay en bas à gauche.
- **Icon Cards** : icônes en trait fin (line art abstrait/géométrique), grises, centrées au-dessus du label dans une carte outlined — style très institutionnel.
- **Bouton Top Page / Ancre** : rectangle outlined avec flèche ↑, aligné gauche, petit — même style que Quick Links.
- **Illustrated banners** : illustrations plates style vectoriel (personnages, objets, scènes) utilisées à la place des photos dans le hero — caractéristique SharePoint pour les espaces thématiques.

---

### Part 1 — Native Blocks

| Block | Description |
|-------|-------------|
| Hero (Banner) | Pleine largeur, photo ou illustration de fond, grand titre blanc, sous-titre, lien CTA texte optionnel |
| Hero Tiles | Split : grande photo gauche + grille 2×2 de tuiles droite (mix tuiles couleur unie et photo) |
| Text | Bloc texte riche : titres, paragraphes, gras, italique, puces, tableaux, liens inline |
| Image | Photo seule avec légende optionnelle, alignement configurable |
| Quick Links (style bouton) | Liens outlined icon+label sur section fond coloré de marque |
| Quick Links (style tuile) | Tuiles icon+label en grille, fond clair ou coloré |
| Navigation Buttons | Boutons Précédent / Suivant en 2 colonnes (outlined, icône chevron) |
| News | Cartes articles autopullées depuis les pages news SharePoint |
| Events | Cartes événements : miniature colorée/photo, pill catégorie, titre, date, lieu |
| Highlighted Content | Cartes contenu autopullées : image, titre, date, auteur |
| People | Cartes profil depuis M365 / AAD |
| Text + Image (2-col) | Section côte à côte : texte gauche + photo droite (ou inversé) |
| Icon Cards Grid | Grille de cartes outlined : icône line art + label + description courte (3–4 col) |
| Competency Diagram | Image ou SVG inséré comme bloc Image (diagrammes, schémas) |
| Data Table | Tableau avec en-tête colorée (via bloc Text ou List web part) |
| Divider | Ligne horizontale de séparation |
| Top Page / Anchor Button | Bouton retour en haut ou ancre (outlined, flèche ↑) |
| File Viewer | Aperçu inline de documents Office |
| Embed | iFrame pour contenu externe |
| Spacer | Bloc d'espacement vertical |

---

### Part 2 — Block Capabilities

| Block | Dimensions | Nb éléments max | Types de contenu | Options de mise en page |
|-------|-----------|-----------------|------------------|--------------------------|
| Hero (Banner) | Pleine largeur, ~350–500px hauteur | 1 | Photo ou illustration fond, titre blanc, sous-titre, lien texte CTA | Texte overlay bas-gauche ; pas de vrai bouton |
| Hero Tiles | Pleine largeur, ~500px hauteur | 1 grand + 4 tuiles | Grande photo, tuiles (couleur unie ou photo), texte blanc overlay | Grand gauche / grille 2×2 droite |
| Text | Contraint par colonne | — | Titres, corps, puces, gras/italique, tableaux, liens | Hérite la largeur de colonne |
| Image | Contraint par colonne | 1 | Photo, légende | Gauche / Centre / Droite ; inline ou pleine colonne |
| Quick Links (bouton) | Pleine largeur, dans section couleur de marque | 3–8 par rangée | Bordure outlined, icône line art gauche, label, lien | 3–4 par rangée ; rangées empilables |
| Quick Links (tuile) | Pleine largeur | Illimité | Icône, label | Grille 2–4 col / Filmstrip |
| Navigation Buttons | Pleine largeur | 2 (préc + suiv) | Chevron, label section, label bouton | 2 colonnes égales |
| News | Pleine largeur | 5 | Miniature, titre, auteur, date, extrait | Top story + tuiles / Côte à côte / Empilé / Carousel |
| Events | Pleine largeur | 3–4 visibles | Miniature carrée colorée ou photo, pill catégorie, titre, date+heure, lieu | Cartes 3 colonnes |
| Highlighted Content | Pleine largeur | ~12 | Image autopullée, titre, date, auteur | Cartes / Liste / Carousel |
| People | Pleine largeur | ~12 | Avatar circulaire, nom, rôle, email | Grille |
| Text + Image (2-col) | Pleine largeur | 1 texte + 1 image | Titre, corps, puces ; photo | Texte gauche/image droite ou inversé ; ~50/50 ou 60/40 |
| Icon Cards Grid | Pleine largeur | 4–6 | Icône line art, label, description 1 ligne | Grille 3–4 col, carte outlined |
| Data Table | Contraint par colonne | Illimité (rangées) | En-tête couleur de marque (fill + texte blanc), rangées corps | Pleine largeur dans la colonne |
| Divider | Pleine largeur | — | Ligne horizontale | — |
| Top Page / Anchor | Contraint par colonne | 1 | Flèche ↑ + label | Bouton outlined aligné gauche |

---

### Part 3 — Layout & Marges

- **App bar gauche M365** : fixe, ~50px, icônes mono-couleur — 7 icônes (Home, Globe/Sites, Documents, Pages, Lists, People, Settings)
- **Barre M365** : waffle menu, nom app "SharePoint", recherche globale, notifications, people, settings, avatar profil
- **Barre site** : logo carré couleur de marque, nom du site, nav horizontale (4–6 items + "Edit" en couleur primaire), "Not following" à droite
- **Barre toolbar** : + New, Page details, Preview, Analytics, Copy in another site | Published date, Share, Edit, Fullscreen
- **Layout page : 2 colonnes** — zone contenu principale (~70%) + sidebar droite sombre (~300px, fond couleur de marque foncée)
- **Hero** : 2 tuiles photo égales côte à côte (~280px haut), gradient de fond, titre blanc overlay bas-gauche
- **Zone contenu** : fond blanc, sections empilées avec padding 20–24px
- **Sidebar droite** : fond `var(--S)` (couleur marque sombre) — contient : "How do I..." FAQ avec icônes, calendriers de jours fériés (US, Canada…) avec badges date colorés
- **Sections contenu principales** : catégories 3-col (photo + lien souligné + description), liens thématiques 2-col (icon + titre + desc), contacts "We're here to help" 4-col, CTA banner (gradient clair + bouton + décoration), News + Celebrations 2-col, Documents récents
- **Fonds de section** : blanc (défaut), `#f3f2f1` gris clair (sections de liens), gradient clair (CTA)
- **Typographie** : Segoe UI, titres 600–700, corps regular, couleur primaire pour liens soulignés (catégories)
- **Rythme visuel** : zones blanches alternant avec zones gris clair ; sidebar sombre = ancre visuelle droite forte

---
---

## ━━━━━  JALIOS  ━━━━━
*Personnalité visuelle : communautaire, institutionnel, dense en information. Le plus "widget-driven" des quatre. Pas de sidebar — contenu large avec marges légères. Chaque communauté est un espace distinct avec ses propres onglets.*

### Signature UI — Boutons & Icônes

- **Icônes Accès rapide** : très distinctives — grandes icônes (~60px) sur CERCLE COLORÉ SOLIDE : étoile sur cercle doré (Favoris), caméra sur cercle teal (Appel vidéo), coche sur cercle vert (Tâches), poubelle sur cercle gris (Corbeille). Aucune autre plateforme n'utilise ce style d'icône en cercle coloré plein.
- **Bouton "Voir mes applications"** : rectangle outlined simple, texte plain, aucune icône — style neutre et sobre.
- **Tags de statut communauté** : pills remplies — "Public" en vert, "Secret" en rouge — texte blanc, légèrement arrondis. Visibilité immédiate du niveau d'accès.
- **Tags de type communauté** : "Projet", "Thématique" — pills outlined en gris clair avec icône dossier — ton neutre vs les tags de statut.
- **Bouton Flash Info (top bar)** : pill bleue remplie avec icône éclair ⚡, texte blanc — positionnée de façon très visible dans la barre du haut, signature de Jalios.
- **Icône ⋮ de widget** : trois points verticaux dans le coin supérieur droit de chaque widget — menu options (présent sur tous les widgets).
- **Actions post dans le feed** : liens texte + petites icônes — "Partager", compteur like, compteur commentaire — discrets, pas de bouton franc.
- **Tabs de navigation communauté** : onglets texte avec indicateur de couleur vive sur l'onglet actif, scrollables horizontalement si trop nombreux.

---

### Part 1 — Native Blocks

| Block | Description |
|-------|-------------|
| Quick Access (Accès rapide) | Grille d'icônes sur cercles colorés (Favoris, Appel vidéo, Tâches, Corbeille) + bouton "Voir mes applications" |
| Recent Documents | Liste de fichiers : icône type (PDF etc.), nom document, heure dernière modif |
| My Communities | Grille 3 colonnes de cartes communauté avec image de couverture, nom, nb participants, tags |
| Community Card | Image couverture, nom communauté, nb participants, tag statut (Public/Secret), tag type (Projet/Thématique) |
| Community Header | Titre pleine largeur + image ou motif géométrique de fond, barre de recherche interne |
| Community Nav Tabs | Onglets horizontaux configurables par communauté (Accueil, Blog, Agenda, Documents, Wiki, Forums, etc.) |
| Participant Bar | Rangée d'avatars membres, nb total, nb invités, bouton abonnement, "Voir plus" |
| Presentation Widget | Bloc texte riche sur fond coloré (bleu marine foncé) — description de la communauté |
| Flash Info | Carte annonce mise en avant (fond teal) : titre, corps, date, lien "Lire", pagination carousel |
| Activity Feed (Activité) | Feed tabulé : Messages / Page web / Question / Forum / Sondage — posts avec avatar, auteur, action, contenu embarqué |
| Activity Post | Avatar, nom auteur, libellé action, horodatage, contenu embarqué (carte événement / image / vidéo / lien), actions share/like/comment |
| Blog Widget | Liste de billets de blog ou état vide avec bouton d'ajout |
| Wiki Widget | Liste de pages wiki + bouton "+ Ajouter une page Wiki" |
| Glossary / FAQs Widget | Liste d'entrées avec icône type (? pour FAQ, AZ pour glossaire), titre, date — paginé |
| Conversations Widget | Liste de fils de conversation avec tabs Toutes/Non lues, indicateurs non lus, horodatage |
| Latest Content Widget | Liste contenu récent : icône type colorée, titre, date |
| Latest Exchanges Widget | Échanges récents avec tag horaire coloré (ex: 12:47, 11:31), titre |
| Polls & Surveys Widget | Liste sondages/questionnaires avec titre et date |
| Agenda (Calendar Widget) | Vue semaine avec navigation par flèches et colonnes par jour |
| Learning Paths Widget | Liste Parcours / Savoirs / Tutoriels avec icônes type (document, drapeau) et titres |
| Online Presence Widget | Tabs Connecté / Déconnecté, liste utilisateurs avec avatar, nom, heure dernière connexion |
| Create Event Button | Bouton "+ Planifier un événement" |
| Document Comments Widget | Liste de commentaires sur documents avec liens vers les documents |
| Poster / Visual Block | Grande image insérée dans une colonne (illustrations, visuels de campagne) |

---

### Part 2 — Block Capabilities

| Block | Dimensions | Nb éléments max | Types de contenu | Options de mise en page |
|-------|-----------|-----------------|------------------|--------------------------|
| Quick Access | ~35% largeur | 4 icônes + 1 bouton | Icône sur cercle coloré, label, lien | Grille 3 icônes/rangée + bouton pleine largeur |
| Recent Documents | ~35% largeur | 5–8 | Icône type (PDF/etc.), nom fichier, horodatage | Liste colonne unique |
| My Communities | ~65% largeur | 3 visibles | Image couverture, nom, nb participants, tags statut + type | Grille 3 col + boutons "Voir plus" |
| Community Header | Pleine largeur, ~120px | 1 | Titre, image ou motif géométrique fond, barre recherche | Titre aligné gauche, fond pleine largeur |
| Community Nav Tabs | Pleine largeur | 8–12 visibles + overflow "+" | Label onglet, icône verrou optionnelle | Barre tabs horizontale scrollable |
| Participant Bar | Pleine largeur, ~40px | Illimité (avatars empilés) | Pills tags, avatars circulaires, compteurs, actions texte | Barre horizontale inline |
| Presentation Widget | ~25% largeur colonne | 1 | Fond coloré (bleu marine), texte riche avec surlignages colorés, images | Carte colonne unique |
| Flash Info | ~45% largeur colonne | Multiple (paginé 1/2) | Fond teal, titre, corps, date, lien "Lire" | Carte unique, pagination carousel |
| Activity Feed | ~45% largeur colonne | Illimité (scroll + "Voir plus") | Avatar, auteur, action, contenu embarqué événement/image/vidéo/lien, actions | Liste verticale, tabulée par type |
| Activity Post (événement) | Largeur du feed | 1 événement/post | Badge date, titre, lieu, nb participants, description, programme liste | Carte embarquée dans le post du feed |
| Blog Widget | ~25% colonne | 3–5 | Titre, date (ou état vide) | Liste |
| Wiki Widget | ~25% colonne | 3–5 | Lien page + bouton "+ Ajouter" | Liste |
| Glossary Widget | ~25–30% colonne | 5–8 paginés | Icône AZ ou ?, titre terme, date | Liste paginée colonne unique |
| Conversations Widget | ~25–30% colonne | 8–10 | Tab (Toutes/Non lues), badge lu/non lu, titre, horodatage | Liste tabulée |
| Latest Content Widget | ~25–30% colonne | 8–10 | Icône type colorée, titre, date | Liste colonne unique |
| Latest Exchanges | ~25–30% colonne | 8–10 | Tag horaire coloré, titre/extrait | Liste compacte |
| Polls & Surveys | ~25–30% colonne | 3–5 | Icône graphique barre, titre, date | Liste |
| Agenda | ~25–30% colonne | 1 semaine | Colonnes par jour, lignes horaires, flèches navigation | Vue semaine, non éditable |
| Learning Paths | ~45% colonne | 3–5 | Icône type (doc/drapeau), titre | Liste |
| Online Presence | ~25–30% colonne | Illimité (paginé) | Avatar, nom, heure dernière connexion | Liste tabulée (Connecté/Déconnecté) |
| Poster / Visual | Toute colonne | 1 | Image pleine (illustration, affiche) | Remplit la largeur de la colonne |

---

### Part 3 — Layout & Marges

- **Pas de sidebar gauche** — toute la largeur du navigateur est disponible pour le contenu
- **Barre supérieure** : logo(s) institution à gauche, bouton "Flash Info" pill bleue (alerte globale), barre de recherche centrée, icônes droite (aide ?, grille apps, cloche notification avec badge, avatar profil)
- **Homepage** : 2 colonnes (~35% gauche / ~65% droite). Légères marges naturelles (~20–30px de chaque côté) — le contenu est large mais pas bord à bord.
- **Page communauté** : header pleine largeur (titre + fond image), puis barre participants pleine largeur, puis corps en **3 colonnes** (~25% / ~45% / ~30%) avec les mêmes légères marges latérales.
- **Widgets** : chaque colonne empile des widgets modulaires verticalement. Chaque widget a son propre titre, icône ⋮, et pagination indépendante.
- **Navigation communauté** : chaque communauté a son propre jeu d'onglets, entièrement configurable (onglets différents entre communautés).
- **Fonds de section** : blanc global ; les widgets individuels utilisent des cartes colorées (bleu marine, teal, gris clair).
- **Tags statut/type** : pills colorées — vert "Public", rouge "Secret", gris labels type (Projet, Thématique)
- **Pagination** : contrôles standard `< 1 2 3 … >` sur la quasi-totalité des widgets liste
- **Palette observée** : bleu marine foncé (#1A2B5E approx), teal (#00BCD4 approx), fond header bleu géométrique, blanc, rouge (tag Secret), vert (tag Public), gris
- **Typographie** : titre widget bold dark, texte corps regular, liens hypertexte colorés (bleu/teal)
- **Salutation personnalisée** : "Bonjour [Prénom Nom] | date heure" affichée en haut des pages communauté

---
---

## ━━━━━━  LUMAPPS  ━━━━━━
*Personnalité visuelle : éditorial, chaleureux, qualité consumer. Le plus "magazine" des quatre. Contenu explicitement centré avec de généreuses marges des deux côtés — la plateforme la plus contrainte en largeur de contenu. Boutons pill teal ultra-consistants sur tout le site.*

### Signature UI — Boutons & Icônes

- **Barre top** : fond blanc, logo marque à gauche (stylisé, coloré), barre de recherche centrée avec bouton icône loupe teal, bouton CREATE teal arrondi, puis icônes : grid apps, play, cloche notification, avatar utilisateur, settings, help
- **Navigation** : fond blanc, items en majuscules avec flèches dropdown, icône home active (bleu), icônes directory et sparkle/AI en fin de barre
- **Boutons CTA primaires** : teal (#009688 approx), pill entièrement arrondie (border-radius ~24px), label blanc, aucune bordure — identiques sur tout le site
- **Bouton CREATE** : teal, rectangle arrondi, label blanc — distinct par sa position dans la top bar
- **Pills de tags articles** : petites, entièrement arrondies, fill couleur unie — visibles sur les cartes du carousel hero
- **Icônes de réaction** : 👍 like + 💬 commentaire avec compteurs numériques — rangée sous les articles du carousel
- **Tags "New" sur communautés** : petite pill colorée vive

---

### Part 1 — Native Blocks

| Block | Description |
|-------|-------------|
| Hero Zone (homepage) | Zone pleine largeur fond gradient (couleur primaire → secondaire), contenant le layout 2 colonnes : carousel featured gauche + widgets droite. Démarre directement sous la nav, pas de bannière de salutation séparée. |
| Featured Article Carousel ("À ne pas manquer") | Grande carte photo avec overlay : titre en blanc, pills tags colorées, compteurs réaction (like/comment), flèches et dots de pagination. Colonne gauche du hero. |
| Zoom sur / Spotlight | Carte widget en colonne droite du hero : image ou illustration pleine carte (fond sombre avec texte blanc), titre de section au-dessus. |
| Vos news pays / Country News | Widget colonne droite sous Spotlight : carte photo avec titre section, image pays. |
| My Feed | Liste verticale de cartes articles : grande image, titre, auteur, date, pills tags, réactions |
| Right Sidebar | Colonne droite ~35% empilant des widgets verticalement |
| My Apps Grid | Grille 2×3 d'icônes d'applis + labels |
| Upcoming Events Widget | Carte événement fond coloré : titre, date/heure, lieu, bouton RSVP |
| Featured Communities Widget | Titre communauté + tag type (ex. "New") + lien "See more" |
| My Country Widget | Image + label pays + bouton CTA pill teal |
| My Apps Grid | Grille 2×3 d'icônes d'applis + labels |
| Upcoming Events Widget | Carte événement fond coloré : titre, date/heure, lieu, bouton RSVP |
| Featured Communities Widget | Titre communauté + tag type (ex. "New") + lien "See more" |
| Video Gallery | Grille 2 colonnes de miniatures vidéo avec bouton play overlay centré |
| Social Media Feed | Grille de posts sociaux carrés (style Instagram/LinkedIn) |
| Quote Block | Grande citation pull-quote + photo interlocuteur + nom + titre en attribution |
| Text + Video (2-col) | Titre en couleur de marque + texte corps gauche ; miniature vidéo droite |
| Content Cards Grid (2×2) | Photo gauche + grille 2×2 de cartes outlined (icône, titre, sous-titre, lien CTA) droite |
| Text + Image Row (alternating) | Rangées répétées : bloc texte (titre + corps + bouton CTA pill teal) avec image côtés alternés |
| CTA Card (fond coloré) | Section pleine largeur : fond couleur de marque, image d'un côté, texte + bouton de l'autre |
| Brand Identity Card | Bloc pleine couleur solide (teal ou autre) avec logo/texte blanc — pour communautés ou highlights de marque |
| Breadcrumb | Navigation chemin de page sous la barre top sur les pages de contenu |
| Footer | Deux zones : bande haute couleur primaire avec logo entreprise centré + bande basse blanche avec liens légaux (Mentions légales, Confidentialité, Cookies, Nous contacter) |

---

### Part 2 — Block Capabilities

| Block | Dimensions | Nb éléments max | Types de contenu | Options de mise en page |
|-------|-----------|-----------------|------------------|--------------------------|
| Hero Zone (homepage) | Pleine largeur, ~420px hauteur | 1 | Fond gradient (couleurs primaire→secondaire), layout 2 colonnes internes | Démare directement sous la nav, pas de banner séparé |
| Featured Article Carousel | ~60% largeur du hero (col gauche) | Multiple (carousel paginé) | Grande photo plein fond, overlay blanc bas : titre, pills tags colorées, compteurs like/comment, flèches et dots pagination | Carousel auto-play ou arrows, overlay dégradé bas→haut |
| Zoom sur / Spotlight | ~40% largeur du hero (col droite, haut) | 1 | Image ou illustration pleine carte, fond sombre, titre section blanc au-dessus | Carte pleine hauteur dans la colonne droite |
| Vos news pays / Country News | ~40% largeur du hero (col droite, bas) | 1 | Carte photo pays, titre section blanc au-dessus | Carte sous le Spotlight dans la colonne droite |
| My Feed | ~65% largeur (col principale) | Illimité (scroll) | Grande image, titre, auteur+date, pills tags, icônes like/comment/share | Liste verticale colonne unique |
| Right Sidebar | ~30% largeur, hauteur pleine page | ~5–6 widgets empilés | Divers (voir widgets individuels) | Panneau droit fixe, empilement vertical |
| Spotlight Widget | Largeur sidebar | 1 | Miniature image ou vidéo, titre, texte court, CTA | Carte unique |
| My Apps Grid | Largeur sidebar | 6–8 apps | Icône carrée arrondie, label | Grille 2×3 avec pagination points |
| Upcoming Events Widget | Largeur sidebar | 1–2 | Fond coloré, titre événement, date+heure, lieu, bouton RSVP | Style carte |
| Featured Communities | Largeur sidebar | 2–3 | Nom communauté, tag type | Liste compacte avec "See more" |
| Video Gallery | Pleine largeur | 4–6 | Miniature vidéo, titre, bouton play overlay | Grille 2 col avec "See more" |
| Social Media Feed | Pleine largeur | 6–9 | Posts carrés réseaux sociaux | Grille 3 colonnes |
| Quote Block | Pleine largeur | 1 | Photo circulaire, grande citation (2-col), nom + titre auteur | Photo gauche / citation droite |
| Text + Video | Pleine largeur | 1 texte + 1 vidéo | Titre coloré, corps, liens hypertexte ; miniature vidéo | ~60/40 gauche/droite |
| Content Cards Grid | Pleine largeur | 1 image + 4 cartes | Photo gauche ; cartes 2×2 outlined (icône, titre, sous-titre, lien CTA) | Split 2 col fixe |
| Text + Image Row | Pleine largeur | 1 texte + 1 image par rangée | Titre couleur de marque, corps, bouton pill teal "Explore more" ; photo | Alternance gauche/droite par rangée |
| CTA Card | Pleine largeur, ~250px hauteur | 1 texte + 1 image | Fond couleur de marque, titre, corps, bouton pill teal ; image | Split 50/50 ou 60/40 |
| Brand Identity Card | Pleine largeur ou contenu | 1 | Fond couleur solide, texte/logo blanc | Bloc pleine couleur, centré |

---

### Part 3 — Layout & Marges

- **Barre top et nav** : pleine largeur du navigateur — fond blanc, logo gauche, recherche centrée, icônes droite (Create, grid, cloche, avatar, settings, help)
- **Navigation secondaire** : pleine largeur, fond blanc — items avec dropdowns, icône home active

- **⚠️ RÈGLE STRUCTURELLE ABSOLUE — Conteneur centré LumApps** :
  La structure HTML/CSS obligatoire est la suivante — sans exception :
  ```
  .lm-shell  { padding-top:92px; min-height:100vh; background:#f0f2f5; }
  .lm-center { max-width:1100px; margin:0 auto; display:flex; gap:16px; padding:20px 0 40px; }
  .lm-main   { flex:1; min-width:0; display:flex; flex-direction:column; gap:16px; }
  .lm-main>* { border-radius:12px; overflow:hidden; }
  .lm-sidebar{ width:280px; flex-shrink:0; display:flex; flex-direction:column; gap:16px; align-self:flex-start; position:sticky; top:112px; }
  .lm-sb-w   { background:#fff; border-radius:12px; padding:16px; }
  ```
  ```html
  <div class="lm-shell">
    <div class="lm-center">          ← wrapper centré obligatoire
      <main class="lm-main">...</main>
      <aside class="lm-sidebar">...</aside>
    </div>
  </div>
  ```
  - **lm-shell** = fond de page pleine largeur, SANS display:flex
  - **lm-center** = le seul vrai conteneur, `max-width:1100px; margin:0 auto` — c'est lui qui crée les marges
  - **À ne jamais faire** : mettre `display:flex` sur `.lm-shell` ou `flex:1` sans wrapper centré — cela colle le contenu aux bords
  - Les barres top et nav restent en `position:fixed; left:0; right:0` — elles seules sont pleine largeur

- **Layout homepage (dans le conteneur)** : 2 colonnes — colonne principale ~65% gauche + sidebar ~35% droite
- **Layout page de contenu (dans le conteneur)** : colonne unique, sections empilées verticalement, sans sidebar
- **Boutons CTA** : teal (#009688), pill entièrement arrondie, label blanc — même style sur toutes les pages
- **Palette observée** : rose/magenta (~#E0185A), orange (~#FF5200), teal (~#009688), blanc
- **Typographie** : titres bold en couleur de marque, corps regular sombre
- **Personnalisation** : feed et salutation adaptés par utilisateur

---

> ✅ Les 4 plateformes sont documentées. Mettre à jour une section si de nouveaux screenshots ou corrections arrivent.
