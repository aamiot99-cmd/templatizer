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
}

export function getRichDoc(widgetId: string): WidgetRichDoc | null {
  return WIDGET_RICH_DOCS[widgetId] ?? null
}
