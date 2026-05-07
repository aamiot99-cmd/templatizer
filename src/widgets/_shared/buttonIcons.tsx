/**
 * Stub for the icon picker.
 *
 * The full implementation (icon definitions + glyph rendering) is owned by
 * @tdumont and was not included in his commit. This stub keeps the icon
 * picker compiling and behaving as a no-op until the real module lands.
 *
 * When the full file is added, this stub can be deleted (or its empty array
 * replaced with the real entries).
 */

export interface ButtonIconEntry {
  value: string
  label: string
}

export const BUTTON_ICONS: ButtonIconEntry[] = []

interface ButtonIconProps {
  name: string
  size?: number
}

export function ButtonIcon(_props: ButtonIconProps) {
  return null
}
