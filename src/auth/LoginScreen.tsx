import { useState, type FormEvent } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import styles from './LoginScreen.module.css'

type Mode = 'magic' | 'password'
type Status = 'idle' | 'sending' | 'sent' | 'error'

export function LoginScreen() {
  const [mode, setMode] = useState<Mode>('magic')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const switchMode = (next: Mode) => {
    if (mode === next) return
    setMode(next)
    setStatus('idle')
    setErrorMessage(null)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!supabase) return
    const trimmedEmail = email.trim()
    if (!trimmedEmail) return

    setStatus('sending')
    setErrorMessage(null)

    if (mode === 'magic') {
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmedEmail,
        options: { emailRedirectTo: window.location.origin },
      })
      if (error) {
        setStatus('error')
        setErrorMessage(error.message)
      } else {
        setStatus('sent')
      }
    } else {
      if (!password) {
        setStatus('idle')
        return
      }
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      })
      if (error) {
        setStatus('error')
        setErrorMessage(error.message)
      } else {
        // useAuthSession picks up the new session and re-renders App.
        setStatus('idle')
      }
    }
  }

  const submitting = status === 'sending'
  const sent = status === 'sent'

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <img
          src="/templatizer_logo.svg"
          alt="Templatizer"
          className={styles.logo}
        />
        <h1 className={styles.title}>Connexion</h1>

        {!isSupabaseConfigured ? (
          <>
            <p className={styles.subtitle}>
              Recevez un lien de connexion par e-mail. Aucun mot de passe à
              retenir.
            </p>
            <div className={styles.warning}>
              Supabase n'est pas configuré. Copiez <code>.env.example</code>{' '}
              vers <code>.env.local</code> et renseignez{' '}
              <code>VITE_SUPABASE_URL</code> et{' '}
              <code>VITE_SUPABASE_ANON_KEY</code>, puis redémarrez le serveur
              de développement.
            </div>
          </>
        ) : (
          <>
            <div className={styles.tabs} role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'magic'}
                className={`${styles.tab} ${mode === 'magic' ? styles.tabActive : ''}`}
                onClick={() => switchMode('magic')}
              >
                Lien magique
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'password'}
                className={`${styles.tab} ${mode === 'password' ? styles.tabActive : ''}`}
                onClick={() => switchMode('password')}
              >
                Mot de passe
              </button>
            </div>

            <p className={styles.subtitle}>
              {mode === 'magic'
                ? 'Recevez un lien de connexion par e-mail. Aucun mot de passe à retenir.'
                : 'Connectez-vous directement avec votre adresse e-mail et votre mot de passe.'}
            </p>

            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.label} htmlFor="login-email">
                Adresse e-mail
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                className={styles.input}
                placeholder="vous@lecko.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting || sent}
              />

              {mode === 'password' && (
                <>
                  <label className={styles.label} htmlFor="login-password">
                    Mot de passe
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={submitting}
                  />
                </>
              )}

              <button
                type="submit"
                className={styles.button}
                disabled={
                  !email.trim() ||
                  submitting ||
                  (mode === 'magic' && sent) ||
                  (mode === 'password' && !password)
                }
              >
                {submitting
                  ? mode === 'magic'
                    ? 'Envoi en cours…'
                    : 'Connexion en cours…'
                  : mode === 'magic'
                    ? sent
                      ? 'Lien envoyé ✓'
                      : 'Envoyer le lien de connexion'
                    : 'Se connecter'}
              </button>

              {mode === 'magic' && sent && (
                <div className={`${styles.message} ${styles.messageSuccess}`}>
                  Vérifiez votre boîte e-mail. Cliquez sur le lien pour vous
                  connecter — il expire dans 1 heure.
                </div>
              )}
              {status === 'error' && errorMessage && (
                <div className={`${styles.message} ${styles.messageError}`}>
                  {errorMessage}
                </div>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  )
}
