import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import type { Platform } from '../types'
import { useProjectStore } from '../store/projectStore'
import { getWidget } from '../widgets/registry'
import { Pool } from './Pool'
import { Wireframe } from './Wireframe'
import { ConfigPanel } from './ConfigPanel'
import { PLATFORMS, PLATFORM_LABELS } from '../types'
import styles from './Builder.module.css'

interface BuilderProps {
  platform: Platform
}

type ActiveDrag =
  | { type: 'pool'; widgetId: string }
  | { type: 'cell'; rowId: string; cellId: string }
  | { type: 'row'; rowId: string }
  | null

export function Builder({ platform }: BuilderProps) {
  const rows = useProjectStore((s) => s.wireframe.rows)
  const addCell = useProjectStore((s) => s.addCell)
  const moveCell = useProjectStore((s) => s.moveCell)
  const reorderRows = useProjectStore((s) => s.reorderRows)
  const addRow = useProjectStore((s) => s.addRow)
  const setPlatform = useProjectStore((s) => s.setPlatform)
  const resetProject = useProjectStore((s) => s.resetProject)

  const [activeDrag, setActiveDrag] = useState<ActiveDrag>(null)
  const [selectedCellId, setSelectedCellId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current as
      | { type: 'pool'; widgetId: string }
      | { type: 'cell'; rowId: string; cellId: string }
      | { type: 'row'; rowId: string }
      | undefined
    if (!data) return
    setActiveDrag(data)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveDrag(null)
    if (!over) return

    const activeData = active.data.current as
      | { type: 'pool'; widgetId: string }
      | { type: 'cell'; rowId: string; cellId: string }
      | { type: 'row'; rowId: string }
      | undefined
    const overData = over.data.current as
      | { type: 'row-drop'; rowId: string }
      | { type: 'cell'; rowId: string; cellId: string }
      | { type: 'row'; rowId: string }
      | undefined
    if (!activeData) return

    if (activeData.type === 'pool') {
      let targetRowId: string | null = null
      let targetIndex: number | undefined = undefined
      if (overData?.type === 'row-drop' || overData?.type === 'row') {
        targetRowId = overData.rowId
      } else if (overData?.type === 'cell') {
        targetRowId = overData.rowId
        const targetRow = rows.find((r) => r.id === targetRowId)
        if (targetRow) {
          const idx = targetRow.cells.findIndex((c) => c.id === overData.cellId)
          if (idx >= 0) targetIndex = idx
        }
      }
      if (targetRowId) {
        const targetRow = rows.find((r) => r.id === targetRowId)
        if (targetRow && targetRow.cells.length >= 3) {
          targetRowId = null
          targetIndex = undefined
        }
      }
      if (!targetRowId) {
        targetRowId = addRow()
      }
      const widget = getWidget(activeData.widgetId)
      if (!widget) return
      const config = Object.fromEntries(
        widget.configSchema.map((f) => [f.key, f.default]),
      )
      addCell(targetRowId, widget.id, config, 'large', targetIndex)
      return
    }

    if (activeData.type === 'cell') {
      if (!overData) return
      if (overData.type === 'cell') {
        if (active.id === over.id) return
        const fromRow = rows.find((r) => r.id === activeData.rowId)
        const toRow = rows.find((r) => r.id === overData.rowId)
        if (!fromRow || !toRow) return
        const toIndex = toRow.cells.findIndex((c) => c.id === overData.cellId)
        if (toIndex < 0) return
        moveCell(
          activeData.rowId,
          activeData.cellId,
          overData.rowId,
          toIndex,
        )
      } else if (overData.type === 'row-drop' || overData.type === 'row') {
        const targetRow = rows.find((r) => r.id === overData.rowId)
        if (!targetRow) return
        if (activeData.rowId === overData.rowId) return
        moveCell(
          activeData.rowId,
          activeData.cellId,
          overData.rowId,
          targetRow.cells.length,
        )
      }
      return
    }

    if (activeData.type === 'row') {
      if (overData?.type !== 'row') return
      if (activeData.rowId === overData.rowId) return
      const fromIndex = rows.findIndex((r) => r.id === activeData.rowId)
      const toIndex = rows.findIndex((r) => r.id === overData.rowId)
      if (fromIndex < 0 || toIndex < 0) return
      reorderRows(fromIndex, toIndex)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveDrag(null)}
    >
      <div className={styles.builder}>
        <div className={styles.poolColumn}>
          <Pool platform={platform} />
        </div>
        <div
          className={styles.canvasColumn}
          onClick={() => setSelectedCellId(null)}
        >
          <div className={styles.canvasHeader}>
            <h2 className={styles.canvasTitle}>
              Wireframe — {PLATFORM_LABELS[platform]}
            </h2>
            <div className={styles.canvasActions}>
              <select
                className={styles.button}
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {PLATFORM_LABELS[p]}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className={styles.button}
                onClick={() => {
                  if (confirm('Réinitialiser le projet ?')) resetProject()
                }}
              >
                Réinitialiser
              </button>
            </div>
          </div>
          <Wireframe
            platform={platform}
            rows={rows}
            selectedCellId={selectedCellId}
            onSelectCell={setSelectedCellId}
          />
        </div>
        <ConfigPanel platform={platform} selectedCellId={selectedCellId} />
      </div>
      <DragOverlay className={styles.dragOverlay}>
        {activeDrag?.type === 'pool' ? (
          <PoolDragPreview widgetId={activeDrag.widgetId} platform={platform} />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

function PoolDragPreview({
  widgetId,
  platform,
}: {
  widgetId: string
  platform: Platform
}) {
  const widget = getWidget(widgetId)
  if (!widget) return null
  return (
    <div
      style={{
        padding: '10px 14px',
        background: '#fff',
        border: '1px solid #08060d',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
    >
      {widget.platformLabels[platform]}
    </div>
  )
}
