import type { WidgetRendererProps } from '../../../types'
import styles from './lumapps.module.css'

interface Post {
  author: string
  community: string
  date: string
  content: string
  reactions: number
  comments: number
  avatarColor: string
}

const POSTS: Post[] = [
  {
    author: 'Camille Vasseur',
    community: 'Tribu Design Système',
    date: 'il y a 2 h',
    content:
      'Nouvelle version du design system livrée ce matin. Les composants Form ont été refondus, n\'hésitez pas à tester et à remonter vos retours dans le canal dédié.',
    reactions: 12,
    comments: 4,
    avatarColor: '#4338ca',
  },
  {
    author: 'Lucas Berthier',
    community: 'Club Café Innovation',
    date: 'il y a 5 h',
    content:
      'Vous avez vu la dernière démo OpenAI ? Je propose qu\'on en discute ensemble jeudi 14h en visio. Qui est partant ?',
    reactions: 8,
    comments: 11,
    avatarColor: '#c2410c',
  },
  {
    author: 'Inès Moreau',
    community: 'Sport & Bien-être',
    date: 'il y a 1 j',
    content:
      'Inscription ouverte au défi 10 000 pas/jour de juin. Cette année on monte une équipe inter-bureaux, qui veut me rejoindre ?',
    reactions: 24,
    comments: 6,
    avatarColor: '#be185d',
  },
  {
    author: 'Hugo Lefranc',
    community: 'Communauté Data',
    date: 'il y a 2 j',
    content:
      'Petit retour d\'expérience après 3 mois sur dbt : ce que ça change pour notre stack et les pièges à éviter.',
    reactions: 17,
    comments: 9,
    avatarColor: '#0369a1',
  },
]

function ThumbIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M1 21h4V9H1v12zM23 10c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01.01-.08z" />
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" />
    </svg>
  )
}

function authorInitials(name: string): string {
  return name.split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('') || '?'
}

export function LumappsCommunityPosts({ config, branding }: WidgetRendererProps) {
  const title = (config.title as string) || 'Activité des communautés'
  const maxItems = Math.max(1, Math.min(6, (config.maxItems as number) || 3))
  const items = POSTS.slice(0, maxItems)

  return (
    <div className={styles.root}>
      <h3 className={styles.title}>{title}</h3>
      <ul className={styles.list}>
        {items.map((post, i) => (
          <li key={i} className={styles.post}>
            <span
              className={styles.avatar}
              style={{ background: post.avatarColor }}
            >
              {authorInitials(post.author)}
            </span>
            <div className={styles.postBody}>
              <div className={styles.header}>
                <span className={styles.author}>{post.author}</span>
                <span
                  className={styles.community}
                  style={{ color: branding.colors.primary }}
                >
                  {post.community}
                </span>
                <span className={styles.dot}>·</span>
                <span className={styles.date}>{post.date}</span>
              </div>
              <p className={styles.content}>{post.content}</p>
              <div className={styles.actions}>
                <span className={styles.actionItem}>
                  <ThumbIcon />
                  {post.reactions}
                </span>
                <span className={styles.actionItem}>
                  <CommentIcon />
                  {post.comments}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
