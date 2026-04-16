import type { NavEntry } from '../../types'
import { useProjectStore } from '../../store/projectStore'
import { defaultNavEntries } from '../../store/projectStore'
import { SubSection } from '../SubSection'
import styles from './NavStep.module.css'

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function NavStep() {
  const navEntries = useProjectStore((s) => s.navEntries)
  const setNavEntries = useProjectStore((s) => s.setNavEntries)

  function updateEntry(id: string, patch: Partial<NavEntry>) {
    setNavEntries(
      navEntries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    )
  }

  function removeEntry(id: string) {
    setNavEntries(navEntries.filter((e) => e.id !== id))
  }

  function addEntry() {
    setNavEntries([
      ...navEntries,
      { id: uid(), label: 'Nouvelle entrée', url: '#' },
    ])
  }

  function addChild(parentId: string) {
    setNavEntries(
      navEntries.map((e) =>
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
    setNavEntries(
      navEntries.map((e) =>
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
    setNavEntries(
      navEntries.map((e) =>
        e.id === parentId
          ? {
              ...e,
              children: (e.children ?? []).filter((c) => c.id !== childId),
            }
          : e,
      ),
    )
  }

  function resetToDefaults() {
    setNavEntries(defaultNavEntries())
  }

  const totalChildren = navEntries.reduce(
    (sum, e) => sum + (e.children?.length ?? 0),
    0,
  )

  return (
    <div className={styles.wrapper}>
      <SubSection
        number={1}
        title="Structure du menu"
        description="Les éléments du menu horizontal de l'intranet. Cliquez sur « + sous-entrée » à droite d'une entrée pour lui ajouter un menu déroulant."
      >
        <div className={styles.actionsRow}>
          <div className={styles.countPill}>
            {navEntries.length} entrée{navEntries.length > 1 ? 's' : ''}
            {totalChildren > 0 &&
              ` · ${totalChildren} sous-entrée${totalChildren > 1 ? 's' : ''}`}
          </div>
          <button
            type="button"
            className={styles.resetButton}
            onClick={resetToDefaults}
          >
            Valeurs par défaut
          </button>
        </div>

        {navEntries.length === 0 ? (
          <div className={styles.empty}>
            Aucune entrée de navigation. Ajoutez-en une ci-dessous.
          </div>
        ) : (
          <div className={styles.entries}>
            {navEntries.map((entry, entryIdx) => (
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
      </SubSection>
    </div>
  )
}
