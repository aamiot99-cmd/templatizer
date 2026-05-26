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
import { buttonWidget } from './button'
import { documentCenterWidget } from './documentCenter'

export const WIDGETS: Record<string, WidgetDefinition> = {
  [textWidget.id]: textWidget,
  [miscWidget.id]: miscWidget,
  [buttonWidget.id]: buttonWidget,
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
  [documentCenterWidget.id]: documentCenterWidget,
}

export function getWidget(id: string): WidgetDefinition | undefined {
  return WIDGETS[id]
}

function listWidgets(): WidgetDefinition[] {
  return Object.values(WIDGETS)
}

export function listWidgetsForPlatform(platform: Platform): WidgetDefinition[] {
  return listWidgets().filter((w) => Boolean(resolveRenderer(w, platform)))
}

export function resolveRenderer(
  widget: WidgetDefinition,
  platform: Platform,
) {
  const direct = widget.renderers[platform]
  if (direct) return direct
  // Jint and Powell are SharePoint overlays: SharePoint webparts are usable in both.
  if (platform === 'jint' || platform === 'powell') return widget.renderers.sharepoint
  return undefined
}
