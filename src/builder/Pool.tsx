import { useDraggable } from '@dnd-kit/core'
import type { Platform, UsageCategory, WidgetDefinition } from '../types'
import { USAGE_CATEGORY_LABELS } from '../types'
import { listWidgetsForPlatform } from '../widgets/registry'
import styles from './Pool.module.css'

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

  return (
    <div
      ref={setNodeRef}
      className={`${styles.item} ${isDragging ? styles.itemDragging : ''}`}
      {...listeners}
      {...attributes}
    >
      <div className={styles.itemText}>
        <div className={styles.itemLabel}>{widget.platformLabels[platform]}</div>
        <div className={styles.itemDescription}>{widget.purpose.label}</div>
      </div>
      {isNativeJint && <span className={styles.platformPill}>Jint</span>}
    </div>
  )
}
