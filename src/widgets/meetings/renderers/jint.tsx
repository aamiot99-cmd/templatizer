import type { WidgetRendererProps } from '../../../types'
import styles from './jint.module.css'

interface MeetingItem {
  startTime: string
  endTime: string
  duration: string
  title: string
  attendeeInitials: string
  attendeeName: string
  accepted: boolean
  recurring: boolean
  expanded?: boolean
}

const DEFAULT_MEETINGS: MeetingItem[] = [
  {
    startTime: '2h00 PM',
    endTime: '3h00 PM',
    duration: '1h',
    title: 'After lunch meeting',
    attendeeInitials: 'AV',
    attendeeName: 'Adele V',
    accepted: true,
    recurring: true,
    expanded: true,
  },
  {
    startTime: '4h00 PM',
    endTime: '4h30 PM',
    duration: '30m',
    title: 'Weekly talks',
    attendeeInitials: 'MB',
    attendeeName: 'Marc B',
    accepted: false,
    recurring: false,
  },
  {
    startTime: '5h00 PM',
    endTime: '7h00 PM',
    duration: '2h',
    title: 'End of day Meeting',
    attendeeInitials: 'SL',
    attendeeName: 'Sophie L',
    accepted: false,
    recurring: false,
  },
]

export function JintMeetings({ config }: WidgetRendererProps) {
  const title = (config.title as string) ?? 'Mes réunions du jour'
  const linkLabel = (config.linkLabel as string) ?? 'agenda'
  const maxMeetings = Number(config.maxMeetings ?? 3)
  const showJoinButton = (config.showJoinButton as boolean) ?? true
  const meetings = DEFAULT_MEETINGS.slice(0, maxMeetings)

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <a className={styles.link} href="#" onClick={(e) => e.preventDefault()}>
          {linkLabel}
        </a>
      </div>

      <div className={styles.list}>
        {meetings.map((meeting, idx) => (
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
                    <div className={styles.acceptedBadge} aria-label="Acceptée">
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
                        <span>Join the meeting</span>
                      </button>
                    </div>
                  )}

                  <div className={styles.footerRow}>
                    <div className={styles.duration}>{meeting.duration}</div>
                    <div className={styles.attendee}>
                      <div className={styles.avatar}>
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

      <div className={styles.pager}>
        <button type="button" className={styles.pagerBtn} aria-label="Précédent">
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path
              d="M10 3l-5 5 5 5"
              fill="none"
              stroke="#5a5a5a"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className={styles.dots}>
          <span className={`${styles.dot} ${styles.dotActive}`} />
          <span className={styles.dot} />
        </div>
        <button type="button" className={styles.pagerBtn} aria-label="Suivant">
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path
              d="M6 3l5 5-5 5"
              fill="none"
              stroke="#5a5a5a"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
