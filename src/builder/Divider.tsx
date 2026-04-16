import { useCallback, useRef, useState } from 'react'
import styles from './Divider.module.css'

interface SnapPoint {
  value: number
  label: string
}

const TWO_CELL_LAYOUTS: SnapPoint[] = [
  { value: 1 / 2, label: '1/2' },
  { value: 1 / 3, label: '1/3' },
  { value: 2 / 3, label: '2/3' },
]

function nearestLayout(ratio: number): SnapPoint {
  let best = TWO_CELL_LAYOUTS[0]
  let bestDist = Math.abs(ratio - best.value)
  for (let i = 1; i < TWO_CELL_LAYOUTS.length; i++) {
    const d = Math.abs(ratio - TWO_CELL_LAYOUTS[i].value)
    if (d < bestDist) {
      bestDist = d
      best = TWO_CELL_LAYOUTS[i]
    }
  }
  return best
}

function layoutFor(ratio: number): SnapPoint | undefined {
  return TWO_CELL_LAYOUTS.find((l) => Math.abs(l.value - ratio) < 0.02)
}

interface DividerProps {
  disabled?: boolean
  leftRatio: number
  onChange: (leftRatio: number) => void
  onCycle: () => void
  containerWidth: number
}

export function Divider({
  disabled,
  leftRatio,
  onChange,
  onCycle,
  containerWidth,
}: DividerProps) {
  const [active, setActive] = useState(false)
  const [displayLayout, setDisplayLayout] = useState<SnapPoint | null>(null)

  const onChangeRef = useRef(onChange)
  const onCycleRef = useRef(onCycle)
  const containerWidthRef = useRef(containerWidth)
  const startXRef = useRef(0)
  const startLeftRef = useRef(leftRatio)
  const draggedEnoughRef = useRef(false)

  onChangeRef.current = onChange
  onCycleRef.current = onCycle
  containerWidthRef.current = containerWidth

  const handlePointerMove = useCallback((e: PointerEvent) => {
    const deltaPx = e.clientX - startXRef.current
    if (Math.abs(deltaPx) > 4) draggedEnoughRef.current = true
    const width = containerWidthRef.current || 1
    const deltaRatio = deltaPx / width
    const rawRatio = startLeftRef.current + deltaRatio
    const snap = nearestLayout(rawRatio)
    setDisplayLayout(snap)
    onChangeRef.current(snap.value)
  }, [])

  const handlePointerUp = useCallback(() => {
    setActive(false)
    setDisplayLayout(null)
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
    if (!draggedEnoughRef.current) {
      onCycleRef.current()
    }
    draggedEnoughRef.current = false
  }, [handlePointerMove])

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return
    e.preventDefault()
    e.stopPropagation()
    startXRef.current = e.clientX
    startLeftRef.current = leftRatio
    draggedEnoughRef.current = false
    setActive(true)
    setDisplayLayout(layoutFor(leftRatio) ?? TWO_CELL_LAYOUTS[0])
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  if (disabled) {
    return (
      <div className={`${styles.divider} ${styles.dividerDisabled}`}>
        <div className={styles.bar} />
      </div>
    )
  }

  return (
    <div
      className={`${styles.divider} ${active ? styles.dividerActive : ''} ${
        displayLayout ? styles.dividerSnapped : ''
      }`}
      onPointerDown={handlePointerDown}
      title="Glisser pour changer la largeur, cliquer pour cycler"
    >
      <div className={styles.bar} />
      {active && displayLayout && (
        <div className={`${styles.label} ${styles.labelSnapped}`}>
          {displayLayout.label}
        </div>
      )}
    </div>
  )
}
