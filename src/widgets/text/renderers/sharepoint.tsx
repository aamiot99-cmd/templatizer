import type { WidgetRendererProps } from '../../../types'
import styles from './sharepoint.module.css'

export function SharepointText({ config }: WidgetRendererProps) {
  const content = (config.content as string) || ''

  if (!content) {
    return (
      <div className={styles.empty}>
        Ajoutez votre texte ici.
      </div>
    )
  }

  return (
    <div
      className={styles.content}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
