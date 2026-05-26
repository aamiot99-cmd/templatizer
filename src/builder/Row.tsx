import { useEffect, useRef, useState } from 'react'
import { useDndContext, useDroppable } from '@dnd-kit/core'
import { getWidget } from '../widgets/registry'
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Platform, WireframeRow } from '../types'
import { useProjectStore } from '../store/projectStore'
import { Chip } from './Chip'
import { Divider } from './Divider'
import styles from './Row.module.css'

interface RowProps {
  row: WireframeRow
  platform: Platform
  selectedCellId: string | null
  onSelectCell: (cellId: string) => void
  selectedRowId: string | null
  onSelectRow: (rowId: string) => void
}

function defaultRatios(count: number): number[] {
  if (count === 0) return []
  return new Array(count).fill(1 / count)
}

const ALIGN_ITEMS: Record<string, string> = {
  top: 'flex-start',
  center: 'center',
  bottom: 'flex-end',
}

export function Row({ row, platform, selectedCellId, onSelectCell, selectedRowId, onSelectRow }: RowProps) {
  const removeRow = useProjectStore((s) => s.removeRow)
  const setRowColumnRatios = useProjectStore((s) => s.setRowColumnRatios)
  const cycleRowLayout = useProjectStore((s) => s.cycleRowLayout)

  const cellsContainerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const el = cellsContainerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0
      setContainerWidth(width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const { active: dndActive } = useDndContext()
  const dndDraggedWidget =
    dndActive?.data.current?.type === 'pool'
      ? getWidget(dndActive.data.current.widgetId as string)
      : null
  const isSectionExclusiveDrag = Boolean(dndDraggedWidget?.isSectionExclusive)

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `row-${row.id}`,
    data: { type: 'row', rowId: row.id },
    disabled: isSectionExclusiveDrag,
  })

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `row-drop-${row.id}`,
    data: { type: 'row-drop', rowId: row.id },
    disabled: isSectionExclusiveDrag,
  })

  const showRowDraggingOver = isOver && !isSectionExclusiveDrag

  const composedRef = (node: HTMLDivElement | null) => {
    setSortableRef(node)
    setDroppableRef(node)
  }

  const ratios =
    row.columnRatios && row.columnRatios.length === row.cells.length
      ? row.columnRatios
      : defaultRatios(row.cells.length)

  const rowStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const isEmpty = row.cells.length === 0
  const isRowSelected = selectedRowId === row.id
  const alignItems = ALIGN_ITEMS[row.alignment ?? 'top'] ?? 'flex-start'

  return (
    <div
      ref={composedRef}
      style={rowStyle}
      className={`${styles.row} ${isEmpty ? styles.rowEmpty : ''} ${
        showRowDraggingOver ? styles.rowDraggingOver : ''
      } ${isDragging ? styles.rowSortableDragging : ''} ${
        isRowSelected ? styles.rowSelected : ''
      }`}
      onClick={(e) => {
        e.stopPropagation()
        onSelectRow(row.id)
      }}
    >
      <div className={styles.handle} {...listeners} {...attributes}>
        ⋮⋮
      </div>
      <div
        ref={cellsContainerRef}
        className={styles.cellsContainer}
        style={{ alignItems }}
      >
        {isEmpty ? (
          <span>Déposez un widget ici</span>
        ) : (
          <SortableContext
            items={row.cells.map((c) => `cell-${c.id}`)}
            strategy={horizontalListSortingStrategy}
          >
            {row.cells.map((cell, idx) => {
              const flex = ratios[idx] ?? 1 / row.cells.length
              const isLast = idx === row.cells.length - 1
              const cellCount = row.cells.length
              const MIN_RATIO = 0.15
              return (
                <DividerAwareCell
                  key={cell.id}
                  flex={flex}
                  isLast={isLast}
                  containerWidth={containerWidth}
                  dividerDisabled={false}
                  onChangeLeft={(newLeft) => {
                    if (cellCount === 2) {
                      setRowColumnRatios(row.id, [newLeft, 1 - newLeft])
                    } else {
                      const nextRatio = ratios[idx + 1] + (ratios[idx] - newLeft)
                      if (newLeft < MIN_RATIO || nextRatio < MIN_RATIO) return
                      const newRatios = [...ratios]
                      newRatios[idx] = newLeft
                      newRatios[idx + 1] = nextRatio
                      const sum = newRatios.reduce((a, b) => a + b, 0)
                      setRowColumnRatios(row.id, newRatios.map((r) => r / sum))
                    }
                  }}
                  onCycle={cellCount === 2 ? () => cycleRowLayout(row.id) : () => {}}
                >
                  <Chip
                    cell={cell}
                    rowId={row.id}
                    platform={platform}
                    isSelected={cell.id === selectedCellId}
                    selectedCellId={selectedCellId}
                    onSelect={(cellId) => {
                      onSelectCell(cellId)
                    }}
                  />
                </DividerAwareCell>
              )
            })}
          </SortableContext>
        )}
      </div>
      <button
        type="button"
        className={styles.deleteRow}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation()
          removeRow(row.id)
        }}
        aria-label="Supprimer la ligne"
      >
        ×
      </button>
    </div>
  )
}

interface DividerAwareCellProps {
  children: React.ReactNode
  flex: number
  isLast: boolean
  containerWidth: number
  dividerDisabled: boolean
  onChangeLeft: (leftRatio: number) => void
  onCycle: () => void
}

function DividerAwareCell({
  children,
  flex,
  isLast,
  containerWidth,
  dividerDisabled,
  onChangeLeft,
  onCycle,
}: DividerAwareCellProps) {
  return (
    <>
      <div className={styles.cellWrapper} style={{ flex: `${flex} 1 0` }}>
        {children}
      </div>
      {!isLast && (
        <Divider
          disabled={dividerDisabled}
          leftRatio={flex}
          onChange={onChangeLeft}
          onCycle={onCycle}
          containerWidth={containerWidth}
        />
      )}
    </>
  )
}
