import { useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import styles from './LoginScreen.module.css'

type Status = 'idle' | 'redirecting' | 'error'

export function LoginScreen() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleGoogle = async () => {
    if (!supabase) return
    setStatus('redirecting')
    setErrorMessage(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) {
      setStatus('error')
      setErrorMessage(error.message)
    }
  }

  const redirecting = status === 'redirecting'

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
              Connectez-vous avec votre compte Google.
            </p>

            <button
              type="button"
              className={styles.googleButton}
              onClick={handleGoogle}
              disabled={redirecting}
            >
              <svg
                className={styles.googleIcon}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"
                />
              </svg>
              {redirecting ? 'Redirection…' : 'Se connecter avec Google'}
            </button>

            {status === 'error' && errorMessage && (
              <div className={`${styles.message} ${styles.messageError}`}>
                {errorMessage}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
