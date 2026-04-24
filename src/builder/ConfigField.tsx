import type { ConfigSchemaField } from '../types'
import styles from './ConfigPanel.module.css'
import { RichTextEditor } from './RichTextEditor'

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
    case 'icon':
      return (
        <input
          type="text"
          className={styles.input}
          value={String(value)}
          placeholder={field.type === 'text' ? field.placeholder : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      )
    case 'number':
      return (
        <input
          type="number"
          className={styles.input}
          value={Number(value)}
          min={field.min}
          max={field.max}
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
    case 'select':
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
