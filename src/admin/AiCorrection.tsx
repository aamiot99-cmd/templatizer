import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useProjectStore } from '../store/projectStore'
import { applyAiOperations, type AiOperation } from '../lib/aiApplyOps'
import styles from './AiCorrection.module.css'

interface AiCorrectionProps {
  open: boolean
  onClose: () => void
}

export function AiCorrection({ open, onClose }: AiCorrectionProps) {
  const platform = useProjectStore((s) => s.platform)
  const wireframe = useProjectStore((s) => s.wireframe)
  const navEntries = useProjectStore((s) => s.navEntries)
  const loadSnapshot = useProjectStore((s) => s.loadSnapshot)
  const branding = useProjectStore((s) => s.branding)
  const hubMenu = useProjectStore((s) => s.hubMenu)

  const [prompt, setPrompt] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<string | null>(null)

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return
    const trimmed = prompt.trim()
    if (!trimmed) return setError('Décrivez la modification souhaitée.')
    if (!supabase) return setError('Supabase n\'est pas configuré.')

    setError(null)
    setSummary(null)
    setBusy(true)
    try {
      const { data, error: invokeErr } = await supabase.functions.invoke(
        'templatizer-ai',
        {
          body: {
            mode: 'correct',
            platform,
            prompt: trimmed,
            currentWireframe: {
              rows: wireframe.rows.map((r) => ({
                cells: r.cells.map((c) => ({ widgetId: c.widgetId, size: c.size })),
              })),
            },
            currentNavEntries: navEntries.map((e) => ({
              label: e.label,
              children: e.children?.map((c) => ({ label: c.label })),
            })),
          },
        },
      )
      if (invokeErr) throw invokeErr
      if (!data?.success) throw new Error(data?.error ?? 'Erreur IA.')

      const ops = data.operations as AiOperation[]
      const result = applyAiOperations(wireframe, navEntries, ops)

      loadSnapshot({
        platform,
        branding,
        wireframe: result.wireframe,
        navEntries: result.navEntries,
        hubMenu,
      })

      const skippedCount = result.skipped.length
      setSummary(
        skippedCount > 0
          ? `${result.applied} opérations appliquées, ${skippedCount} ignorées (voir console).`
          : `${result.applied} opérations appliquées.`,
      )
      if (skippedCount > 0) {
        console.warn('AI correction — skipped ops:', result.skipped)
      }
      setPrompt('')
      // Auto-close after a short delay so the user sees the result.
      setTimeout(() => {
        onClose()
        setSummary(null)
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) onClose()
      }}
    >
      <div className={styles.modal} role="dialog" aria-labelledby="aicorrection-title">
        <header className={styles.header}>
          <h2 id="aicorrection-title" className={styles.title}>
            ✨ Corriger avec IA
          </h2>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            disabled={busy}
            aria-label="Fermer"
          >
            ✕
          </button>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <p className={styles.hint}>
            Décris la modification en langage naturel. L'IA applique des changements
            ciblés sur le wireframe actuel (1 à 5 opérations en général).
          </p>

          <textarea
            className={styles.textarea}
            placeholder={"Ex. : ajoute un widget Événements en deuxième ligne, ou remplace la news par une carte éditoriale."}
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={busy}
            maxLength={2000}
            required
            autoFocus
          />
          <span className={styles.charCount}>{prompt.length} / 2000</span>

          {error && <div className={styles.error}>{error}</div>}
          {summary && <div className={styles.success}>{summary}</div>}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={busy}
            >
              Annuler
            </button>
            <button type="submit" className={styles.submitBtn} disabled={busy}>
              {busy ? 'Application…' : 'Appliquer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
