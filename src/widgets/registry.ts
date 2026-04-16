import type { Platform, WidgetDefinition } from '../types'
import { newsWidget } from './news'
import { appsWidget } from './apps'
import { eventsWidget } from './events'
import { directoryWidget } from './directory'
import { contactsWidget } from './contacts'
import { socialWidget } from './social'

export const WIDGETS: Record<string, WidgetDefinition> = {
  [newsWidget.id]: newsWidget,
  [socialWidget.id]: socialWidget,
  [appsWidget.id]: appsWidget,
  [directoryWidget.id]: directoryWidget,
  [contactsWidget.id]: contactsWidget,
  [eventsWidget.id]: eventsWidget,
}

export function getWidget(id: string): WidgetDefinition | undefined {
  return WIDGETS[id]
}

export function listWidgets(): WidgetDefinition[] {
  return Object.values(WIDGETS)
}

export function listWidgetsForPlatform(platform: Platform): WidgetDefinition[] {
  return listWidgets().filter((w) => Boolean(w.renderers[platform]))
}
