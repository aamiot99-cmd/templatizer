import type { WidgetRendererProps } from '../../../types'
import { ButtonIcon } from '../../_shared/buttonIcons'
import styles from './sharepoint.module.css'

const ALIGN_MAP: Record<string, string> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
}

export function SharepointButton({ config }: WidgetRendererProps) {
  const label = (config.label as string) ?? 'Bouton'
  const icon = (config.icon as string) || 'none'
  const alignment = (config.alignment as string) || 'left'

  return (
    <div className={styles.widget} style={{ justifyContent: ALIGN_MAP[alignment] ?? 'flex-start' }}>
      <button type="button" className={styles.btn}>
        {icon !== 'none' && (
          <span className={styles.icon}>
            <ButtonIcon name={icon} size={16} />
          </span>
        )}
        {label && <span>{label}</span>}
      </button>
    </div>
  )
}
