import { useState } from 'react'
import type { WidgetRendererProps } from '../../../types'
import { PagerControls } from '../../_shared/PagerControls'
import styles from './jint.module.css'

interface MeetingItem {
  startTime: string
  endTime: string
  duration: string
  title: string
  attendeeInitials: string
  attendeeName: string
  avatarColor: string
  accepted: boolean
  recurring: boolean
  expanded?: boolean
}

const DEFAULT_MEETINGS: MeetingItem[] = [
  {
    startTime: '14h00',
    endTime: '15h00',
    duration: '1h',
    title: 'Réunion après déjeuner',
    attendeeInitials: 'AV',
    attendeeName: 'Adèle V.',
    avatarColor: '#6f4ab0',
    accepted: true,
    recurring: true,
    expanded: true,
  },
  {
    startTime: '16h00',
    endTime: '16h30',
    duration: '30m',
    title: 'Point hebdomadaire',
    attendeeInitials: 'MB',
    attendeeName: 'Marc B.',
    avatarColor: '#0284c7',
    accepted: false,
    recurring: false,
  },
  {
    startTime: '17h00',
    endTime: '19h00',
    duration: '2h',
    title: 'Réunion de fin de journée',
    attendeeInitials: 'SL',
    attendeeName: 'Sophie L.',
    avatarColor: '#16a34a',
    accepted: false,
    recurring: false,
  },
  {
    startTime: '09h00',
    endTime: '10h00',
    duration: '1h',
    title: 'Suivi projet client',
    attendeeInitials: 'TG',
    attendeeName: 'Thomas G.',
    avatarColor: '#e8440a',
    accepted: true,
    recurring: false,
  },
  {
    startTime: '10h30',
    endTime: '12h00',
    duration: '1h30',
    title: 'Atelier design produit',
    attendeeInitials: 'CR',
    attendeeName: 'Clara R.',
    avatarColor: '#d97706',
    accepted: false,
    recurring: true,
  },
  {
    startTime: '15h00',
    endTime: '16h00',
    duration: '1h',
    title: 'Rétrospective sprint',
    attendeeInitials: 'NB',
    attendeeName: 'Nicolas B.',
    avatarColor: '#7c3aed',
    accepted: true,
    recurring: true,
  },
]

function chunk<T>(items: T[], size: number): T[][] {
  const pages: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size))
  }
  return pages
}

export function JintMeetings({ config }: WidgetRendererProps) {
  const title = (config.title as string) ?? 'Mes réunions du jour'
  const linkLabel = (config.linkLabel as string) ?? 'agenda'
  const perPage = Math.max(1, Number(config.maxMeetings ?? 3))
  const showJoinButton = (config.showJoinButton as boolean) ?? true

  const [page, setPage] = useState(0)
  const pages = chunk(DEFAULT_MEETINGS, perPage)
  const totalPages = pages.length

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <a className={styles.link} href="#" onClick={(e) => e.preventDefault()}>
          {linkLabel}
        </a>
      </div>

      <div className={styles.clip}>
        <div
          className={styles.track}
          style={{
            width: `${totalPages * 100}%`,
            transform: `translateX(-${(page * 100) / totalPages}%)`,
          }}
        >
          {pages.map((pageMeetings, pageIdx) => (
            <div
              key={pageIdx}
              className={styles.page}
              style={{ width: `${100 / totalPages}%` }}
            >
              {pageMeetings.map((meeting, idx) => (
                <div
                  key={`${meeting.title}-${idx}`}
                  className={`${styles.card} ${meeting.expanded ? styles.cardExpanded : ''}`}
                >
                  <div className={styles.accentBar} />

                  <div className={styles.cardContent}>
                    <div className={styles.row}>
                      <div className={styles.times}>
                        <div className={styles.timeStart}>{meeting.startTime}</div>
                        <div className={styles.timeEnd}>{meeting.endTime}</div>
                      </div>
                      <div className={styles.meetingTitle}>{meeting.title}</div>
                      <div className={styles.status}>
                        {meeting.accepted && (
                          <div
                            className={styles.acceptedBadge}
                            aria-label="Acceptée"
                          >
                            <svg viewBox="0 0 16 16" width="10" height="10">
                              <path
                                d="M3 8.5l3 3 7-7"
                                fill="none"
                                stroke="#fff"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        )}
                        <svg
                          className={`${styles.chevron} ${meeting.expanded ? styles.chevronOpen : ''}`}
                          viewBox="0 0 16 16"
                          width="14"
                          height="14"
                          aria-hidden="true"
                        >
                          <path
                            d="M4 6l4 4 4-4"
                            fill="none"
                            stroke="#5a5a5a"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    {meeting.expanded && (
                      <>
                        {showJoinButton && (
                          <div className={styles.joinRow}>
                            <button type="button" className={styles.joinBtn}>
                              <svg
                                viewBox="0 0 20 14"
                                width="14"
                                height="14"
                                aria-hidden="true"
                              >
                                <rect
                                  x="0.5"
                                  y="1.5"
                                  width="12"
                                  height="11"
                                  rx="1.5"
                                  fill="none"
                                  stroke="#fff"
                                  strokeWidth="1.4"
                                />
                                <path
                                  d="M13 5l5.5-3v10L13 9z"
                                  fill="none"
                                  stroke="#fff"
                                  strokeWidth="1.4"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span>Rejoindre la réunion</span>
                            </button>
                          </div>
                        )}

                        <div className={styles.footerRow}>
                          <div className={styles.duration}>{meeting.duration}</div>
                          <div className={styles.attendee}>
                            <div
                              className={styles.avatar}
                              style={{ backgroundColor: meeting.avatarColor }}
                            >
                              {meeting.attendeeInitials}
                            </div>
                            <div className={styles.attendeeName}>
                              {meeting.attendeeName}
                            </div>
                          </div>
                          {meeting.recurring && (
                            <svg
                              className={styles.recurringIcon}
                              viewBox="0 0 16 16"
                              width="16"
                              height="16"
                              aria-label="Réunion récurrente"
                            >
                              <path
                                d="M3 8a5 5 0 0 1 8.5-3.5M13 8a5 5 0 0 1-8.5 3.5"
                                fill="none"
                                stroke="#5a5a5a"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                              />
                              <path
                                d="M11.5 2v2.5H9M4.5 14v-2.5H7"
                                fill="none"
                                stroke="#5a5a5a"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <PagerControls
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        variant="dark"
      />
    </div>
  )
}
