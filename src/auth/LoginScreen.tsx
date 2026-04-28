import { useState, type FormEvent } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import styles from './LoginScreen.module.css'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function LoginScreen() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!supabase) return
    const trimmed = email.trim()
    if (!trimmed) return
    setStatus('sending')
    setErrorMessage(null)
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo: window.location.origin,
      },
    })
    if (error) {
      setStatus('error')
      setErrorMessage(error.message)
    } else {
      setStatus('sent')
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <img
          src="/templatizer_logo.svg"
          alt="Templatizer"
          className={styles.logo}
        />
        <h1 className={styles.title}>Connexion</h1>
        <p className={styles.subtitle}>
          Recevez un lien de connexion par e-mail. Aucun mot de passe à retenir.
        </p>

        {!isSupabaseConfigured ? (
          <div className={styles.warning}>
            Supabase n'est pas configuré. Copiez <code>.env.example</code> vers{' '}
            <code>.env.local</code> et renseignez{' '}
            <code>VITE_SUPABASE_URL</code> et{' '}
            <code>VITE_SUPABASE_ANON_KEY</code>, puis redémarrez le serveur de
            développement.
          </div>
        ) : (
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
              disabled={status === 'sending' || status === 'sent'}
            />
            <button
              type="submit"
              className={styles.button}
              disabled={
                !email.trim() || status === 'sending' || status === 'sent'
              }
            >
              {status === 'sending'
                ? 'Envoi en cours…'
                : status === 'sent'
                  ? 'Lien envoyé ✓'
                  : 'Envoyer le lien de connexion'}
            </button>

            {status === 'sent' && (
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
        )}
      </div>
    </div>
  )
}
