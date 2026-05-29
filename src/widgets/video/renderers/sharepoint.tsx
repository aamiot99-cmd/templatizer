import { useState } from 'react'
import type { WidgetRendererProps } from '../../../types'
import styles from './sharepoint.module.css'

type Video = { src: string; title: string }

const VIDEOS: Video[] = [
  { src: '/videos/episode-01.mp4', title: 'Épisode 01' },
  { src: '/videos/welcome.mp4', title: 'Welcome' },
  { src: '/videos/videoplayback.mp4', title: 'Découvrez le LID' },
  { src: '/videos/Teams - Gestion documentaire.mp4', title: 'Gestion documentaire' },
  { src: '/videos/Teams - Calendar.mp4', title: 'Calendrier Teams' },
  { src: '/videos/Gestion des notes.mp4', title: 'Gestion des notes' },
]

function fmtDuration(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function thumbsPerView(size: string): number {
  if (size === 'full') return 3
  if (size === 'two-thirds') return 2
  return 1
}

function PlayIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="20" fill="rgba(0,0,0,0.55)" />
      <polygon points="16,13 29,20 16,27" fill="white" />
    </svg>
  )
}

function ChevronLeft() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 1 2 8 8 15" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2 1 8 8 2 15" />
    </svg>
  )
}

function Thumb({ video, active, onClick }: { video: Video; active: boolean; onClick: () => void }) {
  const [duration, setDuration] = useState<string | null>(null)
  return (
    <div
      className={`${styles.thumb}${active ? ` ${styles.thumbActive}` : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <video
        className={styles.thumbVideo}
        src={video.src}
        preload="metadata"
        muted
        playsInline
        onLoadedMetadata={(e) => {
          e.currentTarget.currentTime = 0.01
          setDuration(fmtDuration(e.currentTarget.duration))
        }}
      />
      <div className={styles.thumbOverlay}>
        <PlayIcon size={30} />
      </div>
      <div className={styles.thumbFooter}>
        <span className={styles.thumbTitle}>{video.title}</span>
        {duration && <span className={styles.thumbDuration}>{duration}</span>}
      </div>
    </div>
  )
}

function GrilleCard({ video, onPlay }: { video: Video; onPlay: () => void }) {
  const [duration, setDuration] = useState<string | null>(null)
  return (
    <div
      className={styles.grilleCard}
      onClick={onPlay}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onPlay()}
    >
      <video
        className={styles.grilleThumb}
        src={video.src}
        preload="metadata"
        muted
        playsInline
        onLoadedMetadata={(e) => {
          e.currentTarget.currentTime = 0.01
          setDuration(fmtDuration(e.currentTarget.duration))
        }}
      />
      <div className={styles.thumbOverlay}>
        <PlayIcon size={36} />
      </div>
      <div className={styles.thumbFooter}>
        <span className={styles.thumbTitle}>{video.title}</span>
        {duration && <span className={styles.thumbDuration}>{duration}</span>}
      </div>
    </div>
  )
}

function SingleVideoMode() {
  const [playing, setPlaying] = useState(false)
  const video = VIDEOS[0]
  return (
    <div className={styles.singleVideoWrap}>
      {playing ? (
        <div className={styles.grilleActive}>
          <video className={styles.grilleVideo} src={video.src} controls autoPlay />
        </div>
      ) : (
        <GrilleCard video={video} onPlay={() => setPlaying(true)} />
      )}
    </div>
  )
}

function SimpleCarousel({ videos }: { videos: Video[] }) {
  const [idx, setIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const total = videos.length

  const goTo = (newIdx: number) => {
    setIdx(newIdx)
    setPlaying(false)
  }

  return (
    <div>
      {playing ? (
        <div className={styles.grilleActive}>
          <video className={styles.grilleVideo} src={videos[idx].src} controls autoPlay />
        </div>
      ) : (
        <GrilleCard video={videos[idx]} onPlay={() => setPlaying(true)} />
      )}
      {total > 1 && (
        <div className={styles.nav}>
          <button
            className={styles.navArrow}
            onClick={() => goTo(Math.max(0, idx - 1))}
            disabled={idx === 0}
            aria-label="Précédent"
          >
            <ChevronLeft />
          </button>
          <span className={styles.navText}>{idx + 1} sur {total}</span>
          <button
            className={styles.navArrow}
            onClick={() => goTo(Math.min(total - 1, idx + 1))}
            disabled={idx === total - 1}
            aria-label="Suivant"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  )
}

function TheatreLayout({ videos, size, rowCount }: { videos: Video[]; size: string; rowCount: number }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [page, setPage] = useState(0)
  const cols = thumbsPerView(size)
  const perPage = cols * rowCount
  const totalPages = Math.ceil(videos.length / perPage)
  const thumbSlice = videos.slice(page * perPage, page * perPage + perPage)

  const goPage = (p: number) => setPage(Math.max(0, Math.min(totalPages - 1, p)))

  return (
    <div>
      <div className={styles.mainPlayer}>
        <video
          key={videos[activeIdx]?.src}
          className={styles.mainVideo}
          src={videos[activeIdx]?.src}
          controls
        />
      </div>

      {videos.length >= 1 && (
        <>
          <div
            className={styles.thumbStrip}
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
          >
            {(totalPages > 1 ? Array.from({ length: perPage }) : thumbSlice).map((_, i) => {
              const gIdx = page * perPage + i
              const v = videos[gIdx]
              if (!v) return <div key={`empty-${i}`} className={styles.thumbEmpty} />
              return (
                <Thumb
                  key={v.src}
                  video={v}
                  active={gIdx === activeIdx}
                  onClick={() => setActiveIdx(gIdx)}
                />
              )
            })}
          </div>

          {totalPages > 1 && (
            <div className={styles.nav}>
              <button
                className={styles.navArrow}
                onClick={() => goPage(page - 1)}
                disabled={page === 0}
                aria-label="Précédent"
              >
                <ChevronLeft />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`${styles.navDot}${i === page ? ` ${styles.navDotActive}` : ''}`}
                  onClick={() => goPage(i)}
                  aria-label={`Page ${i + 1}`}
                />
              ))}
              <button
                className={styles.navArrow}
                onClick={() => goPage(page + 1)}
                disabled={page === totalPages - 1}
                aria-label="Suivant"
              >
                <ChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function GrilleLayout({ videos, size, rowCount }: { videos: Video[]; size: string; rowCount: number }) {
  const [page, setPage] = useState(0)
  const [playingIdx, setPlayingIdx] = useState<number | null>(null)
  const cols = size === 'two-thirds' ? 2 : 3
  const perPage = cols * rowCount
  const totalPages = Math.ceil(videos.length / perPage)
  const pageVideos = videos.slice(page * perPage, page * perPage + perPage)

  const goPage = (p: number) => {
    setPage(Math.max(0, Math.min(totalPages - 1, p)))
    setPlayingIdx(null)
  }

  return (
    <div>
      <div
        className={styles.grille}
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {(totalPages > 1 ? Array.from({ length: perPage }) : pageVideos).map((_, i) => {
          const gIdx = page * perPage + i
          const v = videos[gIdx]
          if (!v) return <div key={`empty-${i}`} className={styles.grilleEmpty} />
          return playingIdx === gIdx ? (
            <div key={v.src} className={styles.grilleActive}>
              <video className={styles.grilleVideo} src={v.src} controls autoPlay />
            </div>
          ) : (
            <GrilleCard key={v.src} video={v} onPlay={() => setPlayingIdx(gIdx)} />
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className={styles.nav}>
          <button
            className={styles.navArrow}
            onClick={() => goPage(page - 1)}
            disabled={page === 0}
            aria-label="Précédent"
          >
            <ChevronLeft />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`${styles.navDot}${i === page ? ` ${styles.navDotActive}` : ''}`}
              onClick={() => goPage(i)}
              aria-label={`Page ${i + 1}`}
            />
          ))}
          <button
            className={styles.navArrow}
            onClick={() => goPage(page + 1)}
            disabled={page === totalPages - 1}
            aria-label="Suivant"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  )
}

export function SharepointVideo({ config, size }: WidgetRendererProps) {
  const singleVideo = Boolean(config.singleVideo)
  if (singleVideo) return <SingleVideoMode />

  const title = (config.title as string) || 'Vidéos'
  const itemCount = Math.max(1, Math.min(6, (config.itemCount as number) || 3))
  const rawLayout = (config.layout as string) || 'theatre'
  const rowCount = Math.max(1, Math.min(10, (config.rowCount as number) || 1))
  const isSmall = size === 'half' || size === 'one-third'
  const videos = VIDEOS.slice(0, itemCount)

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <span className={styles.viewAll}>Afficher tout</span>
      </div>
      {isSmall ? (
        <SimpleCarousel videos={videos} />
      ) : rawLayout === 'grille' ? (
        <GrilleLayout videos={videos} size={size} rowCount={Math.max(2, rowCount)} />
      ) : (
        <TheatreLayout videos={videos} size={size} rowCount={rowCount} />
      )}
    </div>
  )
}
