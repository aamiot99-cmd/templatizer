import type { ReactNode } from 'react'
import styles from './SubSection.module.css'

interface SubSectionProps {
  number: number
  title: string
  description?: string
  children: ReactNode
}

export function SubSection({
  number,
  title,
  description,
  children,
}: SubSectionProps) {
  return (
    <section className={styles.subSection}>
      <header className={styles.header}>
        <div className={styles.badge}>{number}</div>
        <div className={styles.titles}>
          <h3 className={styles.title}>{title}</h3>
          {description && <p className={styles.description}>{description}</p>}
        </div>
      </header>
      <div className={styles.body}>{children}</div>
    </section>
  )
}
