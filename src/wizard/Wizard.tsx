import { useState, type ReactNode } from 'react'
import { PlatformStep } from './steps/PlatformStep'
import { BrandingStep } from './steps/BrandingStep'
import { WireframeStep } from './steps/WireframeStep'
import { NavStep } from './steps/NavStep'
import { PreviewStep } from './steps/PreviewStep'
import styles from './Wizard.module.css'

type StepId = 'platform' | 'branding' | 'wireframe' | 'navigation' | 'preview'

interface StepConfig {
  id: StepId
  label: string
  title: string
  subtitle: string
  render: () => ReactNode
}

const STEPS: StepConfig[] = [
  {
    id: 'platform',
    label: 'Plateforme',
    title: 'Choisissez votre plateforme cible',
    subtitle:
      "Sélectionnez l'environnement intranet pour lequel vous concevez votre page.",
    render: () => <PlatformStep />,
  },
  {
    id: 'branding',
    label: 'Charte',
    title: 'Personnalisez votre charte graphique',
    subtitle: 'Nom, couleurs et logo de votre entreprise.',
    render: () => <BrandingStep />,
  },
  {
    id: 'wireframe',
    label: 'Wireframe',
    title: 'Composez votre page',
    subtitle:
      'Glissez les widgets depuis le panneau de gauche, organisez-les en lignes.',
    render: () => <WireframeStep />,
  },
  {
    id: 'navigation',
    label: 'Navigation',
    title: 'Définissez votre menu de navigation',
    subtitle: 'Les entrées du menu principal de votre intranet.',
    render: () => <NavStep />,
  },
  {
    id: 'preview',
    label: 'Récapitulatif',
    title: 'Récapitulatif de votre projet',
    subtitle:
      'Vérifiez vos choix avant de générer la page : identité, navigation et structure.',
    render: () => <PreviewStep />,
  },
]

export function Wizard() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const currentStep = STEPS[currentStepIndex]
  const isLastStep = currentStepIndex === STEPS.length - 1

  const goPrevious = () => setCurrentStepIndex((i) => Math.max(0, i - 1))
  const goNext = () => {
    if (isLastStep) {
      window.open('?preview=1', '_blank')
      return
    }
    setCurrentStepIndex((i) => Math.min(STEPS.length - 1, i + 1))
  }

  return (
    <div className={styles.wizard}>
      <nav className={styles.sidebar}>
        <h3 className={styles.sidebarTitle}>Étapes</h3>
        <ul className={styles.steps}>
          {STEPS.map((step, index) => {
            const active = index === currentStepIndex
            return (
              <li key={step.id}>
                <button
                  type="button"
                  className={`${styles.step} ${active ? styles.stepActive : ''}`}
                  onClick={() => setCurrentStepIndex(index)}
                >
                  <span className={styles.stepNumber}>{index + 1}</span>
                  <span className={styles.stepLabel}>{step.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <section className={styles.content}>
        <header className={styles.contentHeader}>
          <p className={styles.contentEyebrow}>
            Étape {currentStepIndex + 1} sur {STEPS.length}
          </p>
          <h2 className={styles.contentTitle}>{currentStep.title}</h2>
          <p className={styles.contentSubtitle}>{currentStep.subtitle}</p>
        </header>

        {currentStep.render()}

        <div className={styles.nav}>
          <button
            type="button"
            className={styles.navButton}
            onClick={goPrevious}
            disabled={currentStepIndex === 0}
          >
            ← Précédent
          </button>
          <button
            type="button"
            className={`${styles.navButton} ${styles.navButtonPrimary}`}
            onClick={goNext}
          >
            {isLastStep ? 'Générer la page ↗' : 'Suivant →'}
          </button>
        </div>
      </section>
    </div>
  )
}
