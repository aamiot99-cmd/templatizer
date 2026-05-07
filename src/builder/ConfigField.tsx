import type { JSX } from 'react'
import type { ConfigSchemaField } from '../types'
import styles from './ConfigPanel.module.css'
import { RichTextEditor } from './RichTextEditor'
import { BUTTON_ICONS, ButtonIcon } from '../widgets/_shared/buttonIcons'
import { LAYOUT_ICONS, type LayoutIconEntry } from './layoutIcons'

interface ConfigFieldProps {
  field: ConfigSchemaField
  value: string | number | boolean | undefined
  onChange: (value: string | number | boolean) => void
}

export function ConfigField({ field, value, onChange }: ConfigFieldProps) {
  const currentValue = value ?? field.default

  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{field.label}</label>
      {field.description && (
        <div className={styles.fieldDescription}>{field.description}</div>
      )}
      {renderInput(field, currentValue, onChange)}
    </div>
  )
}

function renderInput(
  field: ConfigSchemaField,
  value: string | number | boolean,
  onChange: (value: string | number | boolean) => void,
) {
  switch (field.type) {
    case 'text':
      return (
        <input
          type="text"
          className={styles.input}
          value={String(value)}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )
    case 'icon': {
      const current = String(value || 'none')
      return (
        <div className={styles.iconPicker}>
          <button
            type="button"
            title="Aucune icône"
            className={`${styles.iconOption}${current === 'none' ? ` ${styles.iconOptionActive}` : ''}`}
            onClick={() => onChange('none')}
          >
            <span className={styles.iconOptionNone}>—</span>
          </button>
          {BUTTON_ICONS.map((icon) => (
            <button
              key={icon.value}
              type="button"
              title={icon.label}
              className={`${styles.iconOption}${current === icon.value ? ` ${styles.iconOptionActive}` : ''}`}
              onClick={() => onChange(icon.value)}
            >
              <ButtonIcon name={icon.value} size={15} />
            </button>
          ))}
        </div>
      )
    }
    case 'number':
      return (
        <input
          type="number"
          className={styles.input}
          value={Number(value)}
          min={field.min}
          max={field.max}
          step={field.step}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      )
    case 'boolean':
      return (
        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className={styles.fieldDescription}>Activé</span>
        </label>
      )
    case 'color': {
      const color = String(value || '#000000')
      return (
        <div className={styles.colorRow}>
          <input
            type="color"
            className={styles.colorPicker}
            value={color}
            onChange={(e) => onChange(e.target.value)}
          />
          <span className={styles.colorHex}>{color.toUpperCase()}</span>
        </div>
      )
    }
    case 'select': {
      const hasLayoutIcons = field.options.every((opt) => opt.layoutIcon)
      if (hasLayoutIcons) {
        const cols = 3
        return (
          <div
            className={styles.layoutPicker}
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
          >
            {field.options.map((opt) => {
              const entry: LayoutIconEntry | null = opt.layoutIcon ? LAYOUT_ICONS[opt.layoutIcon] ?? null : null
              const isImg = typeof entry === 'string'
              const SvgIcon = !isImg && entry ? (entry as () => JSX.Element) : null
              return (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.layoutOption}${String(value) === opt.value ? ` ${styles.layoutOptionActive}` : ''}${isImg ? ` ${styles.layoutOptionImg}` : ''}`}
                  onClick={() => onChange(opt.value)}
                  title={opt.label}
                >
                  {isImg && <img src={entry as string} alt={opt.label} className={styles.layoutImg} />}
                  {SvgIcon && <div className={styles.layoutPreview}><SvgIcon /></div>}
                  {!isImg && <span className={styles.layoutLabel}>{opt.label}</span>}
                </button>
              )
            })}
          </div>
        )
      }
      return (
        <select
          className={styles.input}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
        >
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )
    }
    case 'toggle':
      return (
        <div className={styles.toggle}>
          {field.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.toggleOption}${String(value) === opt.value ? ` ${styles.toggleOptionActive}` : ''}`}
              onClick={() => onChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )
    case 'richtext':
      return (
        <RichTextEditor
          value={String(value)}
          onChange={onChange}
          placeholder={field.placeholder}
        />
      )
  }
}
