import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDraggable } from '@dnd-kit/core'
import type { Platform, UsageCategory, WidgetDefinition } from '../types'
import { USAGE_CATEGORY_LABELS } from '../types'
import { listWidgetsForPlatform } from '../widgets/registry'
import { getRichDoc } from '../widgets/richDocs'
import styles from './Pool.module.css'

const TOOLTIP_DELAY_MS = 350

const CATEGORY_ORDER: UsageCategory[] = [
  'communicate',
  'access',
  'collaborate',
  'live',
]

interface PoolProps {
  platform: Platform
}

export function Pool({ platform }: PoolProps) {
  const widgets = listWidgetsForPlatform(platform)
  const byCategory = groupByCategory(widgets)

  return (
    <aside className={styles.pool}>
      <h3 className={styles.poolTitle}>Widgets disponibles</h3>
      {CATEGORY_ORDER.filter((c) => byCategory[c]?.length).map((category) => (
        <div key={category} className={styles.category} data-category={category}>
          <div className={styles.categoryLabel}>
            <span className={styles.categoryDot} />
            {USAGE_CATEGORY_LABELS[category]}
          </div>
          <div className={styles.items}>
            {byCategory[category]!.map((widget) => (
              <PoolItem
                key={widget.id}
                widget={widget}
                platform={platform}
              />
            ))}
          </div>
        </div>
      ))}
    </aside>
  )
}

function groupByCategory(
  widgets: WidgetDefinition[],
): Partial<Record<UsageCategory, WidgetDefinition[]>> {
  const map: Partial<Record<UsageCategory, WidgetDefinition[]>> = {}
  for (const w of widgets) {
    const c = w.purpose.category
    if (!map[c]) map[c] = []
    map[c]!.push(w)
  }
  return map
}

interface PoolItemProps {
  widget: WidgetDefinition
  platform: Platform
}

function PoolItem({ widget, platform }: PoolItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `pool-${widget.id}`,
    data: { type: 'pool', widgetId: widget.id },
  })

  const isNativeJint = platform === 'jint' && Boolean(widget.renderers.jint)
  const richDoc = getRichDoc(widget.id)
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null)
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const itemElRef = useRef<HTMLDivElement | null>(null)

  const composedRef = (el: HTMLDivElement | null) => {
    itemElRef.current = el
    setNodeRef(el)
  }

  // Cancel any pending tooltip timer when the drag starts. Visibility itself
  // is derived at render time (see `tooltipVisible` below) so we don't need
  // to call setState here, which keeps react-hooks/set-state-in-effect happy.
  useEffect(() => {
    if (isDragging && showTimerRef.current) {
      clearTimeout(showTimerRef.current)
      showTimerRef.current = null
    }
  }, [isDragging])

  useEffect(() => {
    return () => {
      if (showTimerRef.current) clearTimeout(showTimerRef.current)
    }
  }, [])

  const showTooltip = () => {
    const el = itemElRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const TOOLTIP_WIDTH = 680
    const TOOLTIP_HEIGHT_ESTIMATE = 200
    const MARGIN = 12

    // Vertical: prefer top-aligned with item; flip up if would overflow bottom.
    let top = rect.top
    if (top + TOOLTIP_HEIGHT_ESTIMATE > window.innerHeight - MARGIN) {
      top = Math.max(MARGIN, window.innerHeight - TOOLTIP_HEIGHT_ESTIMATE - MARGIN)
    }

    // Horizontal: prefer right of item; flip to left if would overflow right edge.
    let left = rect.right + 12
    if (left + TOOLTIP_WIDTH > window.innerWidth - MARGIN) {
      left = Math.max(MARGIN, rect.left - TOOLTIP_WIDTH - 12)
    }

    setTooltipPos({ top, left })
  }

  const handleMouseEnter = () => {
    if (!richDoc || isDragging) return
    if (showTimerRef.current) clearTimeout(showTimerRef.current)
    showTimerRef.current = setTimeout(showTooltip, TOOLTIP_DELAY_MS)
  }

  const handleMouseLeave = () => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current)
      showTimerRef.current = null
    }
    setTooltipPos(null)
  }

  return (
    <>
      <div
        ref={composedRef}
        className={`${styles.item} ${isDragging ? styles.itemDragging : ''} ${isNativeJint ? styles.itemWithPill : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...listeners}
        {...attributes}
      >
        <div className={styles.itemText}>
          <div className={styles.itemLabel}>{widget.platformLabels[platform] ?? widget.purpose.label}</div>
          <div className={styles.itemDescription}>{widget.purpose.label}</div>
        </div>
        {isNativeJint && <span className={styles.platformPill}>Jint</span>}
      </div>
      {tooltipPos &&
        !isDragging &&
        richDoc &&
        createPortal(
          <div
            className={styles.tooltip}
            role="tooltip"
            style={{ top: tooltipPos.top, left: tooltipPos.left }}
          >
            {richDoc.imageUrl && (
              <img
                src={richDoc.imageUrl}
                alt=""
                className={styles.tooltipImage}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                }}
              />
            )}
            <div className={styles.tooltipTitle}>{richDoc.platformName}</div>
            <p className={styles.tooltipDescription}>{richDoc.description}</p>
          </div>,
          document.body,
        )}
    </>
  )
}
