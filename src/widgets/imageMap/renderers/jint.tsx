import { useState } from 'react'
import type { WidgetRendererProps } from '../../../types'
import franceMapSvg from '/france-map.svg?raw'
import styles from './jint.module.css'

const FRANCE_MAP_INLINE = franceMapSvg
  .replace(/<\?xml[^?]*\?>/, '')
  .replace(/<!DOCTYPE[^>]*>/, '')
  .replace(/fill="#000000"/g, 'fill="currentColor"')

interface Location {
  id: string
  label: string
  city: string
  x: number
  y: number
}

const DEFAULT_LOCATIONS: Location[] = [
  { id: 'paris', label: 'Siège social', city: 'Paris', x: 49, y: 26 },
  { id: 'dijon', label: 'Antenne Bourgogne', city: 'Dijon', x: 60, y: 40 },
  { id: 'toulouse', label: 'Antenne Occitanie', city: 'Toulouse', x: 36, y: 80 },
  { id: 'marseille', label: 'Antenne Méditerranée', city: 'Marseille', x: 72, y: 86 },
  { id: 'rennes', label: 'Antenne Bretagne', city: 'Rennes', x: 18, y: 33 },
]

function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="9" className={styles.pinRing} />
      <circle cx="10" cy="10" r="4" className={styles.pinDot} />
    </svg>
  )
}

export function JintImageMap({ config }: WidgetRendererProps) {
  const title = (config.title as string) ?? 'Nos implantations'
  const [active, setActive] = useState<string | null>(null)

  const activeLocation = DEFAULT_LOCATIONS.find((l) => l.id === active)

  return (
    <div className={styles.widget}>
      <div className={styles.header}>{title}</div>
      <div className={styles.mapContainer}>
        <div className={styles.mapWrapper}>
          <div className={styles.map} role="img" aria-label="Carte de France" />
          {DEFAULT_LOCATIONS.map((loc) => (
            <div
              key={loc.id}
              className={styles.pin}
              style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
              onMouseEnter={() => setActive(loc.id)}
              onMouseLeave={() => setActive(null)}
            >
              <PinIcon />
            </div>
          ))}
          {activeLocation && (
            <div
              className={styles.popup}
              style={{
                left: `${activeLocation.x}%`,
                top: `${activeLocation.y}%`,
              }}
            >
              <div className={styles.popupCity}>{activeLocation.city}</div>
              <div className={styles.popupLabel}>{activeLocation.label}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
