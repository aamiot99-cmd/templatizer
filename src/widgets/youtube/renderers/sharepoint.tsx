import type { WidgetRendererProps } from '../../../types'
import styles from './sharepoint.module.css'

function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname === 'youtu.be') return u.pathname.slice(1)
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v')
  } catch {
    // URL invalide
  }
  return null
}

export function SharepointYouTube({ config }: WidgetRendererProps) {
  const url = (config.url as string) || 'https://youtu.be/w0vcvcuuUwU?si=S2LEdSH6uEjuzjvx'
  const videoId = extractVideoId(url)

  if (!videoId) {
    return <div className={styles.placeholder}>Lien YouTube invalide</div>
  }

  return (
    <div className={styles.wrapper}>
      <iframe
        className={styles.iframe}
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  )
}
