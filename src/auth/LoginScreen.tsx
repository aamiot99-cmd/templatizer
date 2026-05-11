import { useState, type FormEvent } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import styles from './LoginScreen.module.css'

type PasswordMode = 'signin' | 'signup'
type Status = 'idle' | 'sending' | 'error'

export function LoginScreen() {
  const [passwordMode, setPasswordMode] = useState<PasswordMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const switchPasswordMode = (next: PasswordMode) => {
    if (passwordMode === next) return
    setPasswordMode(next)
    setStatus('idle')
    setErrorMessage(null)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!supabase) return
    const trimmedEmail = email.trim()
    if (!trimmedEmail || !password) return

    setStatus('sending')
    setErrorMessage(null)

    if (passwordMode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
      })
      if (error) {
        setStatus('error')
        setErrorMessage(error.message)
      } else {
        setStatus('idle')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      })
      if (error) {
        setStatus('error')
        setErrorMessage(error.message)
      } else {
        setStatus('idle')
      }
    }
  }

  const submitting = status === 'sending'

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
          <div className={styles.warning}>
            Supabase n'est pas configuré. Copiez <code>.env.example</code>{' '}
            vers <code>.env.local</code> et renseignez{' '}
            <code>VITE_SUPABASE_URL</code> et{' '}
            <code>VITE_SUPABASE_ANON_KEY</code>, puis redémarrez le serveur
            de développement.
          </div>
        ) : (
          <>
            <p className={styles.subtitle}>
              {passwordMode === 'signin'
                ? 'Connectez-vous avec votre adresse e-mail et votre mot de passe.'
                : 'Créez votre compte avec votre adresse e-mail et un mot de passe.'}
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
                disabled={submitting}
              />

              <label className={styles.label} htmlFor="login-password">
                Mot de passe
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete={passwordMode === 'signup' ? 'new-password' : 'current-password'}
                required
                minLength={passwordMode === 'signup' ? 8 : undefined}
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
              />

              <button
                type="submit"
                className={styles.button}
                disabled={!email.trim() || !password || submitting}
              >
                {submitting
                  ? passwordMode === 'signup'
                    ? 'Création en cours…'
                    : 'Connexion en cours…'
                  : passwordMode === 'signup'
                    ? 'Créer un compte'
                    : 'Se connecter'}
              </button>

              <button
                type="button"
                className={styles.switchLink}
                onClick={() => switchPasswordMode(passwordMode === 'signin' ? 'signup' : 'signin')}
                disabled={submitting}
              >
                {passwordMode === 'signin'
                  ? "Pas encore de compte ? Créer un compte"
                  : 'Déjà un compte ? Se connecter'}
              </button>

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
