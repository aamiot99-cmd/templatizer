import type { WidgetRendererProps } from '../../../types'
import styles from './jalios.module.css'

export function JaliosNews({ config, branding }: WidgetRendererProps) {
  const label = (config.label as string) ?? '⚡ Flash Info'
  const title =
    (config.title as string) ??
    `Lancement du nouveau portail ${branding.name} — bienvenue !`
  const body =
    (config.body as string) ??
    "Votre espace digital de travail vient d'être renouvelé. Retrouvez toutes vos ressources, actualités et outils au même endroit. Découvrez les nouvelles fonctionnalités dès maintenant."
  const date = (config.date as string) ?? '12 mars 2025'

  return (
    <div className={styles.flashInfo}>
      <div className={styles.label}>{label}</div>
      <div className={styles.title}>{title}</div>
      <div className={styles.body}>{body}</div>
      <div className={styles.footer}>
        <span className={styles.date}>{date}</span>
        <span className={styles.read}>Lire →</span>
      </div>
    </div>
  )
}
