import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { Platform, WireframeRow as WireframeRowT } from '../types'
import { useProjectStore } from '../store/projectStore'
import { Row } from './Row'
import styles from './Wireframe.module.css'

interface WireframeProps {
  platform: Platform
  rows: WireframeRowT[]
  selectedCellId: string | null
  onSelectCell: (cellId: string) => void
}

export function Wireframe({
  platform,
  rows,
  selectedCellId,
  onSelectCell,
}: WireframeProps) {
  const addRow = useProjectStore((s) => s.addRow)

  return (
    <div className={styles.wireframe}>
      <SortableContext
        items={rows.map((r) => `row-${r.id}`)}
        strategy={verticalListSortingStrategy}
      >
        {rows.map((row) => (
          <Row
            key={row.id}
            row={row}
            platform={platform}
            selectedCellId={selectedCellId}
            onSelectCell={onSelectCell}
          />
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
