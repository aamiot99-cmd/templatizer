import { Wizard } from './wizard'
import { PreviewPage } from './preview/PreviewPage'
import './App.css'

function isPreviewMode(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('preview') === '1'
}

function App() {
  if (isPreviewMode()) {
    return <PreviewPage />
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1>Templatizer</h1>
        <p>
          Concevez la homepage de votre intranet, quelle que soit votre
          plateforme.
        </p>
      </header>
      <Wizard />
    </main>
  )
}

export default App
