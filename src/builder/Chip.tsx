import { useEffect, useRef, useState } from 'react'
import { useDndContext, useDroppable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Platform, StackedCell, UsageCategory, WireframeCell } from '../types'
import { USAGE_CATEGORY_LABELS } from '../types'
import { getWidget } from '../widgets/registry'
import { useProjectStore } from '../store/projectStore'
import styles from './Chip.module.css'

const CATEGORY_COLORS: Record<UsageCategory, string> = {
  communicate: 'communicate',
  access: 'access',
  collaborate: 'collaborate',
  live: 'live',
}

interface ChipProps {
  cell: WireframeCell
  rowId: string
  platform: Platform
  isSelected: boolean
  selectedCellId: string | null
  onSelect: (cellId: string) => void
}

export function Chip({
  cell,
  rowId,
  platform,
  isSelected,
  selectedCellId,
  onSelect,
}: ChipProps) {
  const removeCell = useProjectStore((s) => s.removeCell)
  const removeStackedCell = useProjectStore((s) => s.removeStackedCell)
  const widget = getWidget(cell.widgetId)

  const { active } = useDndContext()
  const isPoolDragging = active?.data.current?.type === 'pool'

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
    active: sortableActive,
  } = useSortable({
    id: `cell-${cell.id}`,
    data: { type: 'cell', rowId, cellId: cell.id },
  })

  const { setNodeRef: stackZoneRef, isOver: stackZoneIsOver } = useDroppable({
    id: `col-stack-${cell.id}`,
    data: { type: 'col-stack', rowId, cellId: cell.id },
  })

  const showDropIndicator = isOver && sortableActive && sortableActive.id !== `cell-${cell.id}`

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const stackedCells = cell.stackedCells ?? []

  if (!widget) {
    return (
      <div ref={setNodeRef} className={styles.chipColumn} style={style}>
        <div className={styles.chip}>
          <div className={styles.label}>Widget inconnu</div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.chipColumn} ${isDragging ? styles.chipColumnDragging : ''}`}
    >
      {showDropIndicator && <div className={styles.dropIndicator} />}

      {/* Primary chip — drag handle for the whole column */}
      <div
        data-category={CATEGORY_COLORS[widget.purpose.category]}
        className={`${styles.chip} ${isSelected ? styles.chipSelected : ''} ${showDropIndicator ? styles.chipDropTarget : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(cell.id)
        }}
        {...listeners}
        {...attributes}
      >
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

      {/* Stacked sub-chips */}
      {stackedCells.map((sc) => (
        <StackedChip
          key={sc.id}
          stacked={sc}
          platform={platform}
          isSelected={selectedCellId === sc.id}
          onSelect={onSelect}
          onRemove={() => removeStackedCell(rowId, cell.id, sc.id)}
        />
      ))}

      {/* Drop zone for stacking — visible during pool drag */}
      <div
        ref={stackZoneRef}
        className={[
          styles.stackZone,
          isPoolDragging ? styles.stackZoneVisible : '',
          stackZoneIsOver ? styles.stackZoneOver : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className={styles.stackZoneLabel}>Empiler ici</span>
      </div>
    </div>
  )
}

interface StackedChipProps {
  stacked: StackedCell
  platform: Platform
  isSelected: boolean
  onSelect: (cellId: string) => void
  onRemove: () => void
}

function StackedChip({
  stacked,
  platform,
  isSelected,
  onSelect,
  onRemove,
}: StackedChipProps) {
  const widget = getWidget(stacked.widgetId)
  if (!widget) return null

  return (
    <div
      data-category={CATEGORY_COLORS[widget.purpose.category]}
      className={`${styles.chip} ${styles.chipStacked} ${isSelected ? styles.chipSelected : ''}`}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(stacked.id)
      }}
    >
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
          onRemove()
        }}
        aria-label="Retirer"
      >
        ×
      </button>
    </div>
  )
}
