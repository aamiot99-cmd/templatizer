import type { NavEntry } from '../../types'
import { useProjectStore } from '../../store/projectStore'
import { defaultNavEntries, defaultHubMenu } from '../../store/projectStore'
import { SubSection } from '../SubSection'
import styles from './NavStep.module.css'

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function NavStep() {
  const navEntries = useProjectStore((s) => s.navEntries)
  const setNavEntries = useProjectStore((s) => s.setNavEntries)
  const hubMenu = useProjectStore((s) => s.hubMenu)
  const setHubMenuEnabled = useProjectStore((s) => s.setHubMenuEnabled)
  const setHubMenuEntries = useProjectStore((s) => s.setHubMenuEntries)

  return (
    <div className={styles.wrapper}>
      <SubSection
        number={1}
        title="Menu Hub"
        description="Le menu Hub est une barre horizontale qui se glisse tout en haut de l'intranet, juste sous la barre noire SharePoint. Il sert à naviguer entre les sites associés à un même hub. Désactivé par défaut."
      >
        <label className={styles.toggleRow}>
          <input
            type="checkbox"
            checked={hubMenu.enabled}
            onChange={(e) => setHubMenuEnabled(e.target.checked)}
            className={styles.toggleCheckbox}
          />
          <span className={styles.toggleLabel}>
            Activer le menu Hub
          </span>
        </label>

        {hubMenu.enabled && (
          <div className={styles.hubMenuEditor}>
            <NavEntriesEditor
              entries={hubMenu.entries}
              onChange={setHubMenuEntries}
              onReset={() => setHubMenuEntries(defaultHubMenu().entries)}
            />
          </div>
        )}
      </SubSection>

      <SubSection
        number={2}
        title="Structure du menu"
        description="Les éléments du menu horizontal de l'intranet. Cliquez sur « + sous-entrée » à droite d'une entrée pour lui ajouter un menu déroulant."
      >
        <NavEntriesEditor
          entries={navEntries}
          onChange={setNavEntries}
          onReset={() => setNavEntries(defaultNavEntries())}
        />
      </SubSection>
    </div>
  )
}

interface NavEntriesEditorProps {
  entries: NavEntry[]
  onChange: (entries: NavEntry[]) => void
  onReset: () => void
}

function NavEntriesEditor({ entries, onChange, onReset }: NavEntriesEditorProps) {
  function updateEntry(id: string, patch: Partial<NavEntry>) {
    onChange(entries.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  }

  function removeEntry(id: string) {
    onChange(entries.filter((e) => e.id !== id))
  }

  function addEntry() {
    onChange([...entries, { id: uid(), label: 'Nouvelle entrée', url: '#' }])
  }

  function addChild(parentId: string) {
    onChange(
      entries.map((e) =>
        e.id === parentId
          ? {
              ...e,
              children: [
                ...(e.children ?? []),
                { id: uid(), label: 'Sous-entrée', url: '#' },
              ],
            }
          : e,
      ),
    )
  }

  function updateChild(
    parentId: string,
    childId: string,
    patch: Partial<NavEntry>,
  ) {
    onChange(
      entries.map((e) =>
        e.id === parentId
          ? {
              ...e,
              children: (e.children ?? []).map((c) =>
                c.id === childId ? { ...c, ...patch } : c,
              ),
            }
          : e,
      ),
    )
  }

  function removeChild(parentId: string, childId: string) {
    onChange(
      entries.map((e) =>
        e.id === parentId
          ? {
              ...e,
              children: (e.children ?? []).filter((c) => c.id !== childId),
            }
          : e,
      ),
    )
  }

  const totalChildren = entries.reduce(
    (sum, e) => sum + (e.children?.length ?? 0),
    0,
  )

  return (
    <>
      <div className={styles.actionsRow}>
        <div className={styles.countPill}>
          {entries.length} entrée{entries.length > 1 ? 's' : ''}
          {totalChildren > 0 &&
            ` · ${totalChildren} sous-entrée${totalChildren > 1 ? 's' : ''}`}
        </div>
        <button
          type="button"
          className={styles.resetButton}
          onClick={onReset}
        >
          Valeurs par défaut
        </button>
      </div>

      {entries.length === 0 ? (
        <div className={styles.empty}>
          Aucune entrée. Ajoutez-en une ci-dessous.
        </div>
      ) : (
        <div className={styles.entries}>
          {entries.map((entry, entryIdx) => (
            <div key={entry.id} className={styles.entry}>
              <div className={styles.entryRow}>
                <div className={styles.entryBadge}>{entryIdx + 1}</div>
                <input
                  type="text"
                  className={styles.input}
                  value={entry.label}
                  onChange={(e) =>
                    updateEntry(entry.id, { label: e.target.value })
                  }
                  placeholder="Libellé"
                />
                <input
                  type="text"
                  className={styles.input}
                  value={entry.url}
                  onChange={(e) =>
                    updateEntry(entry.id, { url: e.target.value })
                  }
                  placeholder="URL"
                />
                <div className={styles.rowButtons}>
                  <button
                    type="button"
                    className={styles.addChildButton}
                    onClick={() => addChild(entry.id)}
                    title="Ajouter une sous-entrée"
                  >
                    + sous-entrée
                  </button>
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => removeEntry(entry.id)}
                    aria-label="Supprimer"
                  >
                    ×
                  </button>
                </div>
              </div>
              {entry.children && entry.children.length > 0 && (
                <div className={styles.children}>
                  <div className={styles.childrenLabel}>Sous-entrées</div>
                  {entry.children.map((child, childIdx) => (
                    <div key={child.id} className={styles.childRow}>
                      <span className={styles.childBullet}>
                        {entryIdx + 1}.{childIdx + 1}
                      </span>
                      <input
                        type="text"
                        className={styles.input}
                        value={child.label}
                        onChange={(e) =>
                          updateChild(entry.id, child.id, {
                            label: e.target.value,
                          })
                        }
                        placeholder="Libellé"
                      />
                      <input
                        type="text"
                        className={styles.input}
                        value={child.url}
                        onChange={(e) =>
                          updateChild(entry.id, child.id, {
                            url: e.target.value,
                          })
                        }
                        placeholder="URL"
                      />
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => removeChild(entry.id, child.id)}
                        aria-label="Supprimer"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <button type="button" className={styles.addButton} onClick={addEntry}>
        + Ajouter une entrée
      </button>
    </>
  )
}
