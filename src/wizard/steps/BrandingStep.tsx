import type { ChangeEvent } from 'react'
import { useProjectStore } from '../../store/projectStore'
import { SubSection } from '../SubSection'
import styles from './BrandingStep.module.css'

export function BrandingStep() {
  const branding = useProjectStore((s) => s.branding)
  const updateBranding = useProjectStore((s) => s.updateBranding)
  const updateBrandingColors = useProjectStore((s) => s.updateBrandingColors)

  function handleLogoUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === 'string') {
        updateBranding({ logo: result })
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className={styles.layout}>
      <div className={styles.form}>
        <SubSection
          number={1}
          title="Nom de l'entreprise"
          description="Il apparaît dans le logo, les titres de page et les widgets qui s'adressent directement aux collaborateurs."
        >
          <div className={styles.field}>
            <input
              id="company-name"
              type="text"
              className={styles.input}
              value={branding.name}
              onChange={(e) => updateBranding({ name: e.target.value })}
              placeholder="Ex. : Acme Corp"
            />
          </div>
        </SubSection>

        <SubSection
          number={2}
          title="Palette de couleurs"
          description="Définissez la charte graphique. Le logo reste visible à droite — utilisez la pipette du navigateur pour y prélever une couleur."
        >
          <div className={styles.colorRow}>
            <ColorControl
              label="Primaire"
              value={branding.colors.primary}
              onChange={(v) => updateBrandingColors({ primary: v })}
            />
            <ColorControl
              label="Secondaire"
              value={branding.colors.secondary}
              onChange={(v) => updateBrandingColors({ secondary: v })}
            />
            <ColorControl
              label="Texte"
              value={branding.colors.text}
              onChange={(v) => updateBrandingColors({ text: v })}
            />
          </div>
        </SubSection>

        <SubSection
          number={3}
          title="Logo de l'entreprise"
          description="Format PNG, JPG ou SVG. Il est affiché dans l'en-tête de l'intranet et dans toutes les prévisualisations."
        >
          <div className={styles.logoUpload}>
            <label className={styles.uploadButton}>
              {branding.logo ? 'Remplacer le logo' : 'Choisir un fichier'}
              <input type="file" accept="image/*" onChange={handleLogoUpload} />
            </label>
            {branding.logo && (
              <button
                type="button"
                className={styles.removeLogo}
                onClick={() => updateBranding({ logo: null })}
              >
                Retirer
              </button>
            )}
          </div>
        </SubSection>
      </div>

      <aside className={styles.preview}>
        <p className={styles.previewLabel}>Aperçu</p>
        <div className={styles.logoBox}>
          {branding.logo ? (
            <img
              src={branding.logo}
              alt={branding.name}
              className={styles.logoImage}
            />
          ) : (
            <span className={styles.logoPlaceholder}>
              Aucun logo
              <br />
              Ajoutez-en un via le bloc 3
            </span>
          )}
        </div>
        <h4 className={styles.previewName}>{branding.name}</h4>
        <div className={styles.colorStrip}>
          <div
            className={styles.colorStripItem}
            style={{ background: branding.colors.primary }}
            title={`Primaire ${branding.colors.primary}`}
          />
          <div
            className={styles.colorStripItem}
            style={{ background: branding.colors.secondary }}
            title={`Secondaire ${branding.colors.secondary}`}
          />
          <div
            className={styles.colorStripItem}
            style={{ background: branding.colors.text }}
            title={`Texte ${branding.colors.text}`}
          />
        </div>
      </aside>
    </div>
  )
}

interface ColorControlProps {
  label: string
  value: string
  onChange: (value: string) => void
}

function ColorControl({ label, value, onChange }: ColorControlProps) {
  return (
    <div className={styles.colorControl}>
      <span className={styles.colorLabel}>{label}</span>
      <div className={styles.colorInput}>
        <input
          type="color"
          className={styles.colorPicker}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <span className={styles.colorHex}>{value.toUpperCase()}</span>
      </div>
    </div>
  )
}
