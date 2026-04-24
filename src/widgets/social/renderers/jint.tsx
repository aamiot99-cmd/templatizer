import type { WidgetRendererProps } from '../../../types'
import styles from './jint.module.css'

interface SocialPost {
  company: string
  date: string
  text: string
  tags: string
  image?: {
    gradient: string
    emoji: string
    quote: string
  }
}

function buildPosts(company: string): [SocialPost[], SocialPost[]] {
  const col1: SocialPost[] = [
    {
      company,
      date: '22/03/2026',
      text: "🌱 Notre engagement durable : objectif zéro émission nette d'ici 2030. Chaque action compte pour nos collaborateurs et nos territoires ! ♻️",
      tags: '#Sustainability #RSE #GreenStrategy',
    },
    {
      company,
      date: '19/03/2026',
      text: "🎉 Welcoming our new Group CFO ! Nous avons le plaisir d'accueillir Marie Fontaine. Bienvenue dans l'équipe ! 💼",
      tags: '#Leadership #WelcomeOnBoard',
      image: {
        gradient: 'linear-gradient(135deg,#1a5c3a,#2d8a5e)',
        emoji: '👩‍💼',
        quote:
          '"Je suis ravie de rejoindre cette équipe exceptionnelle." — Marie Fontaine, Group CFO',
      },
    },
  ]
  const col2: SocialPost[] = [
    {
      company,
      date: '18/03/2026',
      text: "🌍 Journée internationale des droits des femmes — Droits. Justice. Action. pour toutes les femmes. 💜",
      tags: '#IWD2026 #Inclusion #Equity',
    },
    {
      company,
      date: '15/03/2026',
      text: "🚀 Notre programme d'innovation interne a accueilli 40 projets cette année. Merci à tous les participants !",
      tags: '#Innovation #Hackathon',
      image: {
        gradient: 'linear-gradient(135deg,#5b21b6,#8b5cf6)',
        emoji: '💡',
        quote:
          '"Les meilleures idées viennent du terrain." — Jury du programme',
      },
    },
  ]
  return [col1, col2]
}

function Card({ post }: { post: SocialPost }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <div className={styles.company}>{post.company}</div>
          <div className={styles.date}>{post.date}</div>
        </div>
        <span style={{ fontSize: 14, color: '#0a66c2', fontWeight: 700 }}>
          in
        </span>
      </div>
      <div className={styles.text}>
        {post.text} <span className={styles.tags}>{post.tags}</span>
      </div>
      {post.image && (
        <div className={styles.image} style={{ background: post.image.gradient }}>
          <div className={styles.emoji}>{post.image.emoji}</div>
          <div className={styles.quote}>{post.image.quote}</div>
        </div>
      )}
      <div className={styles.actions}>
        <span>↗ Partager</span>
        <span>⋯</span>
      </div>
    </div>
  )
}

export function JintSocial({ config, branding, size }: WidgetRendererProps) {
  const title = (config.title as string) ?? 'Fil des réseaux sociaux'
  const companyName = (config.companyName as string) || branding.name
  const isCompact = size === 'one-third'
  const [col1, col2] = buildPosts(companyName)
  const allPosts = [...col1, ...col2]

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <a href="#" className={styles.viewAll}>
          Voir tout →
        </a>
      </div>
      <div className={styles.feed}>
        {isCompact ? (
          <div className={styles.column}>
            {allPosts.map((p, i) => (
              <Card key={i} post={p} />
            ))}
          </div>
        ) : (
          <div className={styles.columns}>
            <div className={styles.column}>
              {col1.map((p, i) => (
                <Card key={i} post={p} />
              ))}
            </div>
            <div className={styles.column}>
              {col2.map((p, i) => (
                <Card key={i} post={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
