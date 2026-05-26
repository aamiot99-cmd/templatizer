import type { WidgetRendererProps } from '../../../types'
import styles from './lumapps.module.css'

export function LumappsText({ config }: WidgetRendererProps) {
  const content = (config.content as string) || ''

  if (!content) {
    return (
      <div className={styles.empty}>Ajoutez votre texte ici.</div>
    )
  }

  return (
    <div
      className={styles.content}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
