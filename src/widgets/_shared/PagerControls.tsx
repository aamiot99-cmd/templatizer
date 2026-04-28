import styles from './PagerControls.module.css'

export type PagerVariant = 'dark' | 'light'

interface PagerControlsProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  variant?: PagerVariant
  className?: string
  /** Render the controls even when there is only one page (arrows disabled,
   *  single dot). Default: hide when totalPages <= 1. */
  alwaysShow?: boolean
}

export function PagerControls({
  page,
  totalPages,
  onPageChange,
  variant = 'dark',
  className,
  alwaysShow = false,
}: PagerControlsProps) {
  if (totalPages <= 1 && !alwaysShow) return null

  const effectivePages = Math.max(1, totalPages)
  const isFirst = page === 0
  const isLast = page >= effectivePages - 1

  return (
    <div
      className={[
        styles.pager,
        variant === 'light' ? styles.pagerLight : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button
        type="button"
        className={styles.arrow}
        onClick={() => onPageChange(Math.max(0, page - 1))}
        disabled={isFirst}
        aria-label="Précédent"
      >
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path
            d="M10 3l-5 5 5 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className={styles.dots}>
        {Array.from({ length: totalPages }, (_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i === page ? styles.dotActive : ''}`}
          />
        ))}
      </div>

      <button
        type="button"
        className={styles.arrow}
        onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
        disabled={isLast}
        aria-label="Suivant"
      >
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path
            d="M6 3l5 5-5 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}
