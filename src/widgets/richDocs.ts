/**
 * Rich documentation for widgets - used by the Pool tooltip in the wireframe step.
 * Currently focused on Jint web parts (descriptions and example images sourced
 * from https://support.jint.co/hc/en-us/sections/7061840904593-Web-parts).
 *
 * Add an entry here to enable the hover tooltip for a given widget ID.
 */

export interface WidgetRichDoc {
  /** Name as it appears in the platform's official catalog (e.g. "My Apps"). */
  platformName: string
  /** 2-4 sentence description of the webpart. */
  description: string
  /** Optional URL to an example screenshot. */
  imageUrl: string | null
  /** Source URL (docs page) - shown as "Learn more". */
  docsUrl?: string
}

/**
 * Keyed by widget id (matches the WIDGETS registry keys).
 * Currently populated for native Jint webparts.
 */
export const WIDGET_RICH_DOCS: Record<string, WidgetRichDoc> = {
  apps: {
    platformName: 'My Apps',
    description:
      "Le composant My Apps permet de mettre en avant les applications centralisées via Jint, en affichant soit les favoris de l'utilisateur, soit les applications métier d'un espace. Il propose un carrousel pour faire défiler les éléments et deux styles : Normal (avec nom de l'app) ou Large (icône plus grande, nom au survol). Les applications sont audience-targetées, idéal pour exposer les outils corporate sur la page d'accueil ou des apps RH sur un portail dédié.",
    imageUrl: 'https://support.jint.co/hc/article_attachments/12048581194141',
  },
  contacts: {
    platformName: 'Newcomers',
    description:
      "Le composant Newcomers affiche automatiquement les nouveaux arrivants dans votre Digital Workplace, créant du lien social et facilitant l'onboarding pour qu'ils se sentent rapidement intégrés. Chaque carte présente nom, fonction et date d'arrivée du collaborateur, avec un bouton à droite pour démarrer une conversation Teams en un clic. Vous pouvez sélectionner une période et restreindre le périmètre via des groupes Entra ID pour cibler par exemple les arrivants du dernier mois, d'une équipe communication, ou d'un site géographique.",
    imageUrl: 'https://support.jint.co/hc/article_attachments/10009101362205',
  },
  directory: {
    platformName: 'Employee Directory',
    description:
      "Le composant Employee Directory offre une interface claire pour rechercher et consulter les profils des collaborateurs, simplifiant la collaboration interne. Outil de recherche puissant, il permet de filtrer par nom, service, compétence, projet ou tout attribut de profil pertinent, en utilisant les données de Entra ID (Azure AD) ou de l'application SharePoint User Profile. Usage : annuaire global de l'entreprise, ou recherche contextuelle limitée à un département, pays, projet ou site.",
    imageUrl: 'https://support.jint.co/hc/article_attachments/17863468029853',
  },
  events: {
    platformName: 'Events',
    description:
      "Le composant Events permet de communiquer sur la vie et l'actualité de l'entreprise en gérant tous les événements via SharePoint Events. Les événements sont filtrables par site source, catégorie et audience-targetés, et chaque carte propose un bouton + pour ajouter l'événement à son calendrier Outlook en un clic. Adapté aux annonces globales, événements communautaires, sessions de formation ou grands rendez-vous d'équipe.",
    imageUrl: 'https://support.jint.co/hc/article_attachments/11173227732125',
  },
  focus: {
    platformName: 'Focus',
    description:
      "Le composant Focus est un bloc visuel encadré conçu pour engager les collaborateurs en mettant en avant une information clé ou un bouton CTA qui redirige vers le bon contenu. Les contributeurs peuvent combiner une image, un texte, des tags d'affichage et un bouton d'action pour créer des sections impactantes et cohérentes avec la charte. Idéal pour les actus importantes, annonces majeures, invitations à un événement ou pour renforcer le design d'une page.",
    imageUrl: 'https://support.jint.co/hc/article_attachments/9049145450653',
  },
  imageMap: {
    platformName: 'Image Map',
    description:
      "Le composant Image Map est un visuel interactif sur lequel les contributeurs placent des points cliquables associant chacun une information et un lien, offrant une navigation graphique riche. Idéal pour représenter l'organisation d'une entreprise, ses gammes de produits, ses services ou ses implantations géographiques, il aide à accéder rapidement à un contenu en cliquant directement sur l'image. Usages : navigation interactive, cartographie de points d'intérêt, illustration de processus.",
    imageUrl: 'https://support.jint.co/hc/article_attachments/8869828041885',
  },
  meetings: {
    platformName: 'My Meetings',
    description:
      "Le composant My Meetings affiche les réunions de l'utilisateur pour le reste de la journée, l'aidant à organiser son agenda directement depuis une page SharePoint. Il permet de répondre aux invitations, d'ouvrir une réunion Teams en un clic, et propose un lien vers Outlook pour gérer le planning complet. Typiquement intégré au tableau de bord personnel d'un Digital Workplace.",
    imageUrl: 'https://support.jint.co/hc/article_attachments/10965402543773',
  },
  news: {
    platformName: 'News',
    description:
      "Le composant News de Jint permet de définir et diffuser des fils d'actualités dans vos espaces SharePoint, en s'assurant que l'information atteigne la bonne audience. Il propose plusieurs dispositions (Hero, Top Story, Carrousel et autres), des options d'épinglage, des paramètres de source et des réglages d'affichage pour créer des pages de communication engageantes. Outil principal pour concevoir des expériences d'actualités graphiquement soignées dans le Digital Workplace.",
    imageUrl: 'https://support.jint.co/hc/article_attachments/13647964065053',
  },
  social: {
    platformName: 'NewsHub (Social Media Wall)',
    description:
      "Le NewsHub, ou Social Media Wall, est un web part de communication qui agrège les publications de vos réseaux sociaux externes directement dans votre intranet Microsoft 365, supprimant la double saisie tout en gardant le fil naturel. Il prend en charge les flux RSS, chaînes YouTube, pages Facebook, comptes Instagram Business et pages LinkedIn (entreprise, école, vitrine), permettant aux collaborateurs d'interagir avec les publications externes et de devenir ambassadeurs de la marque. Chaque flux est connecté via une clé sans qu'aucun identifiant ne transite par les serveurs Jint.",
    imageUrl: 'https://support.jint.co/hc/article_attachments/4414329193617',
  },
  documentCenter: {
    platformName: 'Search Center (Search Bar + Filter + Result)',
    description:
      "Le Centre documentaire combine les 3 webparts Jint Search Center : Search Bar (barre de saisie), Search Filter (filtres pour affiner les résultats) et Search Result (affichage en tableau, tuiles ou cartes). Cette modularité permet de construire l'expérience de recherche adaptée aux besoins des utilisateurs, propulsée par le moteur Microsoft Search. Templatizer bundle les 3 en un seul widget occupant toute une section, pour simplifier la conception.",
    imageUrl: 'https://support.jint.co/hc/article_attachments/6978428840221',
  },

  // ── SharePoint webparts ───────────────────────────────────────────────────
  'text:sharepoint': {
    platformName: 'Texte',
    description:
      "Le composant WebPart Texte ajoute des paragraphes et des tableaux à votre page. Des options de mise en forme telles que les styles, les puces, les mises en retrait, la mise en surbrillance et les liens sont disponibles. Idéal pour tout contenu éditorial structuré sur une page SharePoint.",
    imageUrl: null,
  },
  'button:sharepoint': {
    platformName: 'Bouton',
    description:
      "Le composant WebPart Bouton ajoute facilement un bouton à votre page avec votre propre étiquette et votre propre lien. Simple et polyvalent, il s'utilise pour orienter les utilisateurs vers une ressource, un formulaire ou une page cible.",
    imageUrl: null,
  },
  'mainBanner:sharepoint': {
    platformName: 'Bannière principale (Hero)',
    description:
      "Le composant WebPart Hero est un excellent moyen d'apporter un focus et un intérêt visuel à votre page. Vous pouvez afficher jusqu'à cinq éléments combinant images attrayantes, texte et liens pour attirer l'attention sur chacun. Par défaut présent sur les sites de communication, il est également disponible sur toute autre page SharePoint.",
    imageUrl: null,
  },
  'news:sharepoint': {
    platformName: 'Actualités',
    description:
      "Le composant WebPart Actualités permet à votre équipe de rester au courant et de s'impliquer dans des histoires importantes ou intéressantes. Vous pouvez créer rapidement des billets originaux — annonces, informations, mises à jour — qui peuvent inclure des graphiques et une mise en forme enrichie.",
    imageUrl: null,
  },
  'callToAction:sharepoint': {
    platformName: 'Appel à l\'action',
    description:
      "Le composant WebPart Appel à l'action crée un bouton avec un message d'incitation à l'action pour les utilisateurs. Il permet de mettre en avant une action prioritaire avec un visuel accrocheur et un lien direct vers la ressource cible.",
    imageUrl: null,
  },
  'editorialCard:sharepoint': {
    platformName: 'Carte éditoriale (Image)',
    description:
      "Le composant WebPart Image insère une image sur la page, soit à partir de votre site, de votre OneDrive ou de votre disque dur. Utilisé en carte éditoriale, il permet d'illustrer un contenu clé avec une image pleine largeur ou intégrée dans un bloc.",
    imageUrl: null,
  },
  'quickLinks:sharepoint': {
    platformName: 'Liens rapides',
    description:
      "Le composant WebPart Liens rapides épingle des éléments à votre page pour un accès facile. Il supporte plusieurs styles d'affichage (liste, grille, compacte) et permet de regrouper les ressources essentielles de façon claire et visuelle.",
    imageUrl: null,
  },
  'documentLibrary:sharepoint': {
    platformName: 'Bibliothèque de documents',
    description:
      "Le composant WebPart Bibliothèque de documents affiche une bibliothèque que vous pouvez personnaliser avec votre propre titre, affichage et taille. Les utilisateurs peuvent afficher ou modifier des fichiers directement depuis le composant, ou accéder à la bibliothèque complète via « Afficher tout ».",
    imageUrl: null,
  },
  'highlightedContent:sharepoint': {
    platformName: 'Contenu mis en évidence',
    description:
      "Le composant WebPart Contenu en surbrillance affiche dynamiquement du contenu en fonction du type (documents, pages, actualités, vidéos, images…), du filtrage ou d'une chaîne de recherche. Vous pouvez définir l'étendue sur un site ou une collection de sites et trier les résultats.",
    imageUrl: null,
  },
  'events:sharepoint': {
    platformName: 'Événements',
    description:
      "Le composant WebPart Événements vous permet d'ajouter et d'afficher des événements à venir sur votre page. Vous pouvez inclure une carte avec l'emplacement, des informations de réunion en ligne, et filtrer par catégorie ou calendrier source.",
    imageUrl: null,
  },
  'directory:sharepoint': {
    platformName: 'Personnes',
    description:
      "Le composant WebPart Personnes affiche un groupe sélectionné de collaborateurs et leurs profils sur votre page. Il s'utilise pour les informations de contact, la présentation d'une équipe, ou la mise en avant des intervenants d'un événement.",
    imageUrl: null,
  },
}

export function getRichDoc(widgetId: string, platform?: string): WidgetRichDoc | null {
  if (platform) {
    const byPlatform = WIDGET_RICH_DOCS[`${widgetId}:${platform}`]
    if (byPlatform) return byPlatform
    // Powell hérite des entrées SharePoint (même logique que resolveRenderer)
    if (platform === 'powell') {
      const bySP = WIDGET_RICH_DOCS[`${widgetId}:sharepoint`]
      if (bySP) return bySP
    }
  }
  // Entrée générique — priorité aux descriptions Jint-spécifiques existantes
  const generic = WIDGET_RICH_DOCS[widgetId]
  if (generic) return generic
  // Jint utilise aussi les webparts SharePoint en fallback
  if (platform === 'jint') {
    return WIDGET_RICH_DOCS[`${widgetId}:sharepoint`] ?? null
  }
  return null
}
