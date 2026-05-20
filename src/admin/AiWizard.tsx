import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useProjectsRegistry } from '../store/projectsRegistry'
import { PLATFORMS, PLATFORM_LABELS, type Platform, type Branding } from '../types'
import { composeProjectStateFromAiLayout, type AiLayout } from '../lib/aiCompose'
import { THEMES } from '../themes'
import styles from './AiWizard.module.css'

interface AiWizardProps {
  open: boolean
  onClose: () => void
}

interface FormState {
  platform: Platform
  title: string
  primaryColor: string
  secondaryColor: string
  textColor: string
  logo: string | null
  prompt: string
}

function initialForm(): FormState {
  const platform: Platform = 'sharepoint'
  const theme = THEMES[platform]
  return {
    platform,
    title: '',
    primaryColor: theme.colors.primary,
    secondaryColor: theme.colors.secondary,
    textColor: theme.colors.text,
    logo: null,
    prompt: '',
  }
}

export function AiWizard({ open, onClose }: AiWizardProps) {
  const createProject = useProjectsRegistry((s) => s.createProject)
  const tryOpenProject = useProjectsRegistry((s) => s.tryOpenProject)

  const [form, setForm] = useState<FormState>(initialForm)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handlePlatformChange = (platform: Platform) => {
    const theme = THEMES[platform]
    setForm((prev) => ({
      ...prev,
      platform,
      primaryColor: theme.colors.primary,
      secondaryColor: theme.colors.secondary,
      textColor: theme.colors.text,
    }))
  }

  const handleLogoUpload = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === 'string') setField('logo', result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return

    const title = form.title.trim()
    const prompt = form.prompt.trim()
    if (!title) return setError('Donnez un titre à votre projet.')
    if (!prompt) return setError('Décrivez l\'intranet que vous souhaitez générer.')
    if (!supabase) return setError('Supabase n\'est pas configuré.')

    setError(null)
    setBusy(true)
    try {
      const { data, error: invokeErr } = await supabase.functions.invoke(
        'templatizer-ai',
        {
          body: {
            platform: form.platform,
            brandTitle: title,
            prompt,
          },
        },
      )
      if (invokeErr) throw invokeErr
      if (!data?.success) {
        throw new Error(data?.error ?? 'Réponse invalide de l\'IA.')
      }

      const layout = data.layout as AiLayout
      const branding: Branding = {
        name: title,
        logo: form.logo,
        colors: {
          primary: form.primaryColor,
          secondary: form.secondaryColor,
          text: form.textColor,
        },
      }
      const snapshot = composeProjectStateFromAiLayout(layout, form.platform, branding)

      const id = await createProject(title, snapshot)
      const result = await tryOpenProject(id)
      if (!result.acquired) {
        throw new Error('Projet créé mais impossible de l\'ouvrir (verrou).')
      }
      onClose()
      setForm(initialForm())
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
      <div className={styles.modal} role="dialog" aria-labelledby="aiwizard-title">
        <header className={styles.header}>
          <h2 id="aiwizard-title" className={styles.title}>
            ✨ Créer avec IA
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
          <div className={styles.field}>
            <label className={styles.label}>Plateforme</label>
            <div className={styles.platformRow}>
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`${styles.platformBtn} ${form.platform === p ? styles.platformBtnActive : ''}`}
                  onClick={() => handlePlatformChange(p)}
                  disabled={busy}
                >
                  {PLATFORM_LABELS[p]}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="aiwizard-title-input" className={styles.label}>
              Titre du projet
            </label>
            <input
              id="aiwizard-title-input"
              type="text"
              className={styles.input}
              placeholder="Ex. Cabinet Dupont"
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              disabled={busy}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Couleurs</label>
            <div className={styles.colorsRow}>
              <ColorInput
                label="Principale"
                value={form.primaryColor}
                onChange={(v) => setField('primaryColor', v)}
                disabled={busy}
              />
              <ColorInput
                label="Secondaire"
                value={form.secondaryColor}
                onChange={(v) => setField('secondaryColor', v)}
                disabled={busy}
              />
              <ColorInput
                label="Texte"
                value={form.textColor}
                onChange={(v) => setField('textColor', v)}
                disabled={busy}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Logo (optionnel)</label>
            <div className={styles.logoRow}>
              {form.logo && (
                <img src={form.logo} alt="Logo" className={styles.logoPreview} />
              )}
              <label className={styles.uploadBtn}>
                {form.logo ? 'Remplacer' : 'Téléverser un logo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleLogoUpload(e.target.files?.[0])}
                  disabled={busy}
                />
              </label>
              {form.logo && (
                <button
                  type="button"
                  className={styles.removeLogoBtn}
                  onClick={() => setField('logo', null)}
                  disabled={busy}
                >
                  Retirer
                </button>
              )}
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="aiwizard-prompt" className={styles.label}>
              Décrivez l'intranet souhaité
            </label>
            <textarea
              id="aiwizard-prompt"
              className={styles.textarea}
              placeholder="Ex. Intranet pour un cabinet d'avocats. Mettre en avant la veille juridique, les actualités internes et un annuaire des collaborateurs. Ton institutionnel mais accessible."
              rows={5}
              value={form.prompt}
              onChange={(e) => setField('prompt', e.target.value)}
              disabled={busy}
              maxLength={2000}
              required
            />
            <span className={styles.hint}>{form.prompt.length} / 2000 caractères</span>
          </div>

          {error && <div className={styles.error}>{error}</div>}

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
              {busy ? 'Génération en cours…' : 'Générer le projet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ColorInput({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}) {
  return (
    <div className={styles.colorControl}>
      <span className={styles.colorLabel}>{label}</span>
      <div className={styles.colorBox}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={styles.colorPicker}
        />
        <span className={styles.colorHex}>{value.toUpperCase()}</span>
      </div>
    </div>
  )
}
