import type { Platform, WidgetDefinition } from '../types'
import { newsWidget } from './news'
import { appsWidget } from './apps'
import { eventsWidget } from './events'
import { directoryWidget } from './directory'
import { contactsWidget } from './contacts'
import { socialWidget } from './social'
import { imageMapWidget } from './imageMap'
import { meetingsWidget } from './meetings'
import { focusWidget } from './focus'
import { callToActionWidget } from './callToAction'

export const WIDGETS: Record<string, WidgetDefinition> = {
  [newsWidget.id]: newsWidget,
  [socialWidget.id]: socialWidget,
  [focusWidget.id]: focusWidget,
  [callToActionWidget.id]: callToActionWidget,
  [appsWidget.id]: appsWidget,
  [directoryWidget.id]: directoryWidget,
  [contactsWidget.id]: contactsWidget,
  [eventsWidget.id]: eventsWidget,
  [meetingsWidget.id]: meetingsWidget,
  [imageMapWidget.id]: imageMapWidget,
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
