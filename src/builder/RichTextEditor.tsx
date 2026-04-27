import { useRef, useState, useCallback, useEffect, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import styles from './RichTextEditor.module.css'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

type ActivePopup = 'style' | 'size' | 'color' | 'highlight' | 'align' | 'table' | null

const STYLE_OPTIONS = [
  { value: 'h2',         label: 'Titre 2',          style: { fontSize: '1.35em', fontWeight: '700' } },
  { value: 'h3',         label: 'Titre 3',          style: { fontSize: '1.15em', fontWeight: '700' } },
  { value: 'h4',         label: 'Titre 4',          style: { fontSize: '1.05em', fontWeight: '700' } },
  { value: 'p',          label: 'Normal',            style: { fontSize: '1em' } },
  { value: 'div',        label: 'Aucun interligne',  style: { fontSize: '1em', lineHeight: '1' } },
  { value: 'blockquote', label: 'Citation extraite', style: { fontSize: '1em', fontStyle: 'italic', borderTop: '2px solid #888', borderBottom: '2px solid #888', textAlign: 'center', padding: '4px 0' } },
  { value: 'pre',        label: 'Monospace',         style: { fontFamily: 'monospace', fontSize: '0.9em', background: '#f3f2f1', padding: '0 4px' } },
] as const

const FONT_SIZES: [string, string][] = [
  ['10', '1'], ['11', '1'], ['12', '2'], ['13', '2'],
  ['14', '3'], ['16', '4'], ['18', '5'], ['20', '5'],
  ['22', '6'], ['24', '6'], ['28', '6'], ['32', '7'],
  ['36', '7'], ['48', '7'], ['72', '7'],
]

const TEXT_COLORS = [
  '#000000','#434343','#666666','#999999','#b7b7b7','#cccccc','#eeeeee','#ffffff',
  '#c4001d','#e74c3c','#e67e22','#f39c12','#f1c40f','#2ecc71','#1abc9c','#3498db',
  '#2980b9','#9b59b6','#8e44ad','#ff69b4','#a0522d','#d2691e','#2f4f4f','#556b2f',
]

const HIGHLIGHT_COLORS = [
  '#ffff00','#00ff00','#00ffff','#ff69b4','#ffa500','#add8e6',
  '#ffcccc','#ccffcc','#ccccff','#ffe4b5','#e0e0e0','#ffb347',
]

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const savedRange = useRef<Range | null>(null)
  const contentSnapshot = useRef<string>('')
  const [activePopup, setActivePopup] = useState<ActivePopup>(null)
  const [tableHover, setTableHover] = useState<[number, number]>([0, 0])
  const [currentStyle, setCurrentStyle] = useState('Normal')
  const [currentSize, setCurrentSize] = useState('18')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)

  useLayoutEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = contentSnapshot.current || value || ''
      contentSnapshot.current = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded])

  const emitChange = useCallback(() => {
    if (editorRef.current) onChange(editorRef.current.innerHTML)
  }, [onChange])

  const updateFormatState = useCallback(() => {
    setIsBold(document.queryCommandState('bold'))
    setIsItalic(document.queryCommandState('italic'))
    setIsUnderline(document.queryCommandState('underline'))
  }, [])

  function saveSelection() {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
      savedRange.current = sel.getRangeAt(0).cloneRange()
    }
  }

  function restoreSelection() {
    editorRef.current?.focus()
    const sel = window.getSelection()
    sel?.removeAllRanges()
    if (savedRange.current) sel?.addRange(savedRange.current)
  }

  function exec(cmd: string, val?: string) {
    editorRef.current?.focus()
    document.execCommand(cmd, false, val)
    emitChange()
    updateFormatState()
  }

  function execRestored(cmd: string, val?: string) {
    restoreSelection()
    document.execCommand(cmd, false, val)
    emitChange()
    setActivePopup(null)
  }

  function openPopup(p: ActivePopup) {
    saveSelection()
    setActivePopup(prev => (prev === p ? null : p))
  }

  function applyStyle(tag: string) {
    restoreSelection()
    document.execCommand('formatBlock', false, tag)
    if (tag === 'blockquote') {
      document.execCommand('bold', false)
      document.execCommand('italic', false)
      document.execCommand('fontSize', false, '5') // ~20px
      document.execCommand('justifyCenter', false)
      setCurrentSize('20')
    }
    emitChange()
    const opt = STYLE_OPTIONS.find(o => o.value === tag)
    if (opt) setCurrentStyle(opt.label)
    setActivePopup(null)
  }

  function applySize(px: string, idx: string) {
    restoreSelection()
    document.execCommand('fontSize', false, idx)
    setCurrentSize(px)
    emitChange()
    setActivePopup(null)
  }

  function insertTable(rows: number, cols: number) {
    restoreSelection()
    let html = '<table style="border-collapse:collapse;width:100%;margin:8px 0">'
    for (let r = 0; r < rows; r++) {
      html += '<tr>'
      for (let c = 0; c < cols; c++) {
        html += '<td style="border:1px solid #c8c6c4;padding:6px 8px;min-width:40px">&nbsp;</td>'
      }
      html += '</tr>'
    }
    html += '</table><p><br></p>'
    document.execCommand('insertHTML', false, html)
    emitChange()
    setActivePopup(null)
    setTableHover([0, 0])
  }

  function toggleExpand() {
    setActivePopup(null)
    if (editorRef.current) {
      contentSnapshot.current = editorRef.current.innerHTML
    }
    setIsExpanded(prev => !prev)
  }

  // Sync bold/italic/underline when cursor moves
  useEffect(() => {
    document.addEventListener('selectionchange', updateFormatState)
    return () => document.removeEventListener('selectionchange', updateFormatState)
  }, [updateFormatState])

  // Close popup on outside click
  useEffect(() => {
    if (!activePopup) return
    function handler(e: MouseEvent) {
      if (!(e.target as HTMLElement).closest('[data-rte-toolbar]')) {
        setActivePopup(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [activePopup])

  // Escape key closes overlay
  useEffect(() => {
    if (!isExpanded) return
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsExpanded(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isExpanded])

  // Lock body scroll while overlay is open
  useEffect(() => {
    document.body.style.overflow = isExpanded ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isExpanded])

  const inner = (
    <>
      {/* ── Toolbar ── */}
      <div className={styles.toolbar} data-rte-toolbar="">

        {/* Style */}
        <div className={styles.group}>
          <div className={styles.popupAnchor}>
            <button
              className={styles.wideBtn}
              title="Style de paragraphe"
              onMouseDown={e => { e.preventDefault(); openPopup('style') }}
            >
              {currentStyle}<span className={styles.caret}>▾</span>
            </button>
            {activePopup === 'style' && (
              <div className={styles.dropdown}>
                {STYLE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    className={styles.dropdownItem}
                    style={opt.style as React.CSSProperties}
                    onMouseDown={e => { e.preventDefault(); applyStyle(opt.value) }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.sep} />

        {/* Font size */}
        <div className={styles.group}>
          <div className={styles.popupAnchor}>
            <button
              className={styles.sizeBtn}
              title="Taille de police"
              onMouseDown={e => { e.preventDefault(); openPopup('size') }}
            >
              {currentSize}<span className={styles.caret}>▾</span>
            </button>
            {activePopup === 'size' && (
              <div className={`${styles.dropdown} ${styles.dropdownSize}`}>
                {FONT_SIZES.map(([px, idx]) => (
                  <button
                    key={px}
                    className={styles.dropdownItem}
                    onMouseDown={e => { e.preventDefault(); applySize(px, idx) }}
                  >
                    {px}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.sep} />

        {/* Bold / Italic / Underline */}
        <div className={styles.group}>
          <button className={[styles.iconBtn, isBold ? styles.iconBtnActive : ''].filter(Boolean).join(' ')} title="Gras (Ctrl+B)"
            onMouseDown={e => { e.preventDefault(); exec('bold') }}>
            <b>B</b>
          </button>
          <button className={[styles.iconBtn, isItalic ? styles.iconBtnActive : ''].filter(Boolean).join(' ')} title="Italique (Ctrl+I)"
            onMouseDown={e => { e.preventDefault(); exec('italic') }}>
            <i>I</i>
          </button>
          <button className={[styles.iconBtn, isUnderline ? styles.iconBtnActive : ''].filter(Boolean).join(' ')} title="Souligné (Ctrl+U)"
            onMouseDown={e => { e.preventDefault(); exec('underline') }}>
            <u>U</u>
          </button>
        </div>

        <div className={styles.sep} />

        {/* Text color */}
        <div className={styles.group}>
          <div className={styles.popupAnchor}>
            <button className={styles.iconBtn} title="Couleur du texte"
              onMouseDown={e => { e.preventDefault(); openPopup('color') }}>
              <span className={styles.colorIconA}>A</span>
            </button>
            {activePopup === 'color' && (
              <div className={styles.colorPalette}>
                {TEXT_COLORS.map(c => (
                  <button
                    key={c}
                    className={styles.swatch}
                    style={{ background: c, outline: c === '#ffffff' ? '1px solid #ccc' : undefined }}
                    title={c}
                    onMouseDown={e => { e.preventDefault(); execRestored('foreColor', c) }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Highlight */}
          <div className={styles.popupAnchor}>
            <button className={styles.iconBtn} title="Surlignage"
              onMouseDown={e => { e.preventDefault(); openPopup('highlight') }}>
              <span className={styles.highlightIcon}>▐</span>
            </button>
            {activePopup === 'highlight' && (
              <div className={styles.colorPalette}>
                <button
                  className={styles.swatchNone}
                  title="Aucun surlignage"
                  onMouseDown={e => { e.preventDefault(); execRestored('hiliteColor', 'transparent') }}
                >✕</button>
                {HIGHLIGHT_COLORS.map(c => (
                  <button
                    key={c}
                    className={styles.swatch}
                    style={{ background: c }}
                    title={c}
                    onMouseDown={e => { e.preventDefault(); execRestored('hiliteColor', c) }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.sep} />

        {/* Alignment */}
        <div className={styles.group}>
          <div className={styles.popupAnchor}>
            <button className={styles.iconBtn} title="Alignement"
              onMouseDown={e => { e.preventDefault(); openPopup('align') }}>
              ≡<span className={styles.caret}>▾</span>
            </button>
            {activePopup === 'align' && (
              <div className={styles.dropdown}>
                {[
                  { cmd: 'justifyLeft',   label: '≡  Aligner à gauche' },
                  { cmd: 'justifyRight',  label: '≡  Aligner à droite' },
                  { cmd: 'justifyCenter', label: '≡  Centre' },
                  { cmd: 'justifyFull',   label: '≡  Justifier' },
                ].map(opt => (
                  <button
                    key={opt.cmd}
                    className={styles.dropdownItem}
                    onMouseDown={e => { e.preventDefault(); execRestored(opt.cmd) }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.sep} />

        {/* Lists */}
        <div className={styles.group}>
          <button className={styles.iconBtn} title="Liste à puces"
            onMouseDown={e => { e.preventDefault(); exec('insertUnorderedList') }}>
            ≔
          </button>
          <button className={styles.iconBtn} title="Liste numérotée"
            onMouseDown={e => { e.preventDefault(); exec('insertOrderedList') }}>
            №
          </button>
        </div>

        <div className={styles.sep} />

        {/* Table */}
        <div className={styles.group}>
          <div className={styles.popupAnchor}>
            <button className={styles.iconBtn} title="Insérer un tableau"
              onMouseDown={e => { e.preventDefault(); openPopup('table') }}>
              ⊞
            </button>
            {activePopup === 'table' && (
              <div className={styles.tablePicker} onMouseLeave={() => setTableHover([0, 0])}>
                <div className={styles.tablePickerLabel}>
                  {tableHover[0] > 0 && tableHover[1] > 0
                    ? `Insérer un tableau de ${tableHover[1]} × ${tableHover[0]}`
                    : 'Insérer un tableau'}
                </div>
                <div className={styles.tableGrid}>
                  {Array.from({ length: 4 }, (_, r) =>
                    Array.from({ length: 9 }, (_, c) => (
                      <div
                        key={`${r}-${c}`}
                        className={[
                          styles.tableCell,
                          r < tableHover[0] && c < tableHover[1] ? styles.tableCellActive : '',
                        ].filter(Boolean).join(' ')}
                        onMouseEnter={() => setTableHover([r + 1, c + 1])}
                        onMouseDown={e => { e.preventDefault(); insertTable(r + 1, c + 1) }}
                      />
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Expand / Collapse */}
        <div className={styles.group} style={{ marginLeft: 'auto' }}>
          <button
            className={styles.iconBtn}
            title={isExpanded ? 'Réduire (Échap)' : 'Agrandir'}
            onMouseDown={e => { e.preventDefault(); toggleExpand() }}
          >
            {isExpanded ? '⤡' : '⤢'}
          </button>
        </div>
      </div>

      {/* ── Editor area ── */}
      <div
        ref={editorRef}
        className={isExpanded ? styles.editorExpanded : styles.editor}
        contentEditable
        suppressContentEditableWarning
        onInput={emitChange}
        data-placeholder={placeholder ?? 'Ajoutez votre texte ici.'}
      />
    </>
  )

  if (isExpanded) {
    return (
      <>
        {/* Ghost placeholder keeps layout space in the config panel */}
        <div className={styles.wrapper} style={{ minHeight: 60, opacity: 0.35, pointerEvents: 'none' }} />
        {createPortal(
          <div
            className={styles.overlay}
            onMouseDown={e => { if (e.target === e.currentTarget) setIsExpanded(false) }}
          >
            <div className={styles.overlayPanel}>
              <div className={styles.overlayHeader}>
                <span className={styles.overlayTitle}>Édition du texte</span>
              </div>
              <div className={styles.wrapper}>{inner}</div>
            </div>
          </div>,
          document.body
        )}
      </>
    )
  }

  return (
    <div className={styles.wrapper}>
      {inner}
    </div>
  )
}
