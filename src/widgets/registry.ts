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
import { editorialCardWidget } from './editorialCard'
import { quickLinksWidget } from './quickLinks'
import { documentLibraryWidget } from './documentLibrary'
import { mainBannerWidget } from './mainBanner'
import { highlightedContentWidget } from './highlightedContent'
import { textWidget } from './text'
import { miscWidget } from './misc'

export const WIDGETS: Record<string, WidgetDefinition> = {
  [textWidget.id]: textWidget,
  [miscWidget.id]: miscWidget,
  [mainBannerWidget.id]: mainBannerWidget,
  [newsWidget.id]: newsWidget,
  [socialWidget.id]: socialWidget,
  [focusWidget.id]: focusWidget,
  [callToActionWidget.id]: callToActionWidget,
  [editorialCardWidget.id]: editorialCardWidget,
  [quickLinksWidget.id]: quickLinksWidget,
  [documentLibraryWidget.id]: documentLibraryWidget,
  [appsWidget.id]: appsWidget,
  [directoryWidget.id]: directoryWidget,
  [contactsWidget.id]: contactsWidget,
  [eventsWidget.id]: eventsWidget,
  [meetingsWidget.id]: meetingsWidget,
  [imageMapWidget.id]: imageMapWidget,
  [highlightedContentWidget.id]: highlightedContentWidget,
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
