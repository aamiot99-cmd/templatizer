import { useDndContext, useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { Platform, WireframeRow as WireframeRowT } from '../types'
import { useProjectStore } from '../store/projectStore'
import { getWidget } from '../widgets/registry'
import { Row } from './Row'
import styles from './Wireframe.module.css'

interface WireframeProps {
  platform: Platform
  rows: WireframeRowT[]
  selectedCellId: string | null
  onSelectCell: (cellId: string) => void
  selectedRowId: string | null
  onSelectRow: (rowId: string) => void
}

export function Wireframe({
  platform,
  rows,
  selectedCellId,
  onSelectCell,
  selectedRowId,
  onSelectRow,
}: WireframeProps) {
  const addRow = useProjectStore((s) => s.addRow)

  const { active } = useDndContext()
  const draggedWidgetId =
    active?.data.current?.type === 'pool'
      ? (active.data.current.widgetId as string | undefined)
      : undefined
  const draggedWidget = draggedWidgetId ? getWidget(draggedWidgetId) : undefined
  const isSectionExclusiveDrag = Boolean(draggedWidget?.isSectionExclusive)

  return (
    <div className={styles.wireframe}>
      <SortableContext
        items={rows.map((r) => `row-${r.id}`)}
        strategy={verticalListSortingStrategy}
      >
        {isSectionExclusiveDrag && <RowGap index={0} />}
        {rows.map((row, idx) => (
          <div key={row.id}>
            <Row
              row={row}
              platform={platform}
              selectedCellId={selectedCellId}
              onSelectCell={onSelectCell}
              selectedRowId={selectedRowId}
              onSelectRow={onSelectRow}
            />
            {isSectionExclusiveDrag && <RowGap index={idx + 1} />}
          </div>
        ))}
      </SortableContext>
      <button
        type="button"
        className={styles.addRow}
        onClick={() => addRow()}
      >
        + Ajouter une ligne
      </button>
    </div>
  )
}

function RowGap({ index }: { index: number }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `row-gap-${index}`,
    data: { type: 'row-gap', index },
  })
  return (
    <div
      ref={setNodeRef}
      className={`${styles.rowGap} ${isOver ? styles.rowGapOver : ''}`}
      aria-hidden="true"
    />
  )
}
