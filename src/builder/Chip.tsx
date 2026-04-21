import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Platform, UsageCategory, WireframeCell } from '../types'
import { USAGE_CATEGORY_LABELS } from '../types'

const CATEGORY_COLORS: Record<UsageCategory, string> = {
  communicate: 'communicate',
  access: 'access',
  collaborate: 'collaborate',
  live: 'live',
}
import { getWidget } from '../widgets/registry'
import { useProjectStore } from '../store/projectStore'
import styles from './Chip.module.css'

interface ChipProps {
  cell: WireframeCell
  rowId: string
  platform: Platform
  isSelected: boolean
  onSelect: (cellId: string) => void
}

export function Chip({ cell, rowId, platform, isSelected, onSelect }: ChipProps) {
  const removeCell = useProjectStore((s) => s.removeCell)
  const widget = getWidget(cell.widgetId)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
    active,
  } = useSortable({
    id: `cell-${cell.id}`,
    data: { type: 'cell', rowId, cellId: cell.id },
  })

  const showDropIndicator = isOver && active && active.id !== `cell-${cell.id}`

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (!widget) {
    return (
      <div ref={setNodeRef} className={styles.chip} style={style}>
        <div className={styles.label}>Widget inconnu</div>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-category={CATEGORY_COLORS[widget.purpose.category]}
      className={`${styles.chip} ${isDragging ? styles.chipDragging : ''} ${
        isSelected ? styles.chipSelected : ''
      } ${showDropIndicator ? styles.chipDropTarget : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(cell.id)
      }}
      {...listeners}
      {...attributes}
    >
      {showDropIndicator && <div className={styles.dropIndicator} />}
      <div className={styles.category}>
        {USAGE_CATEGORY_LABELS[widget.purpose.category]}
      </div>
      <div className={styles.label}>{widget.platformLabels[platform]}</div>
      <button
        type="button"
        className={styles.removeButton}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation()
          removeCell(rowId, cell.id)
        }}
        aria-label="Retirer"
      >
        ×
      </button>
    </div>
  )
}
