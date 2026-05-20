// Templatizer AI — generation Edge Function.
// Calls Anthropic Claude Haiku with prompt caching and tool use to produce a
// homepage layout (wireframe rows + nav entries) for a given platform.
// The client composes the full ProjectState from this minimal layout.

import Anthropic from 'npm:@anthropic-ai/sdk@0.96.0'

type Platform = 'sharepoint' | 'jint' | 'lumapps' | 'jalios'

const VALID_PLATFORMS: Platform[] = ['sharepoint', 'jint', 'lumapps', 'jalios']
const VALID_SIZES = ['full', 'two-thirds', 'half', 'one-third'] as const

interface WidgetMeta {
  id: string
  label: string
  desc: string
  platforms: Platform[]
  /** Text fields the LLM may populate with creative content. */
  textKeys: string[]
}

const WIDGETS: WidgetMeta[] = [
  { id: 'mainBanner', label: 'Bannière principale', desc: 'Image hero pleine largeur avec titre/CTA et 4 tuiles secondaires en overlay. Idéale en première rangée.', platforms: ['sharepoint'], textKeys: ['featuredTitle', 'featuredCta', 'tile1Title', 'tile2Title', 'tile3Title', 'tile4Title'] },
  { id: 'news', label: 'Actualités', desc: 'Fil d\'actualités/annonces, plusieurs dispositions possibles.', platforms: ['sharepoint', 'jint', 'lumapps', 'jalios'], textKeys: ['title'] },
  { id: 'highlightedContent', label: 'Contenu en avant', desc: 'Cartes de contenu mis en avant (documents, pages).', platforms: ['sharepoint'], textKeys: ['title'] },
  { id: 'editorialCard', label: 'Carte éditoriale', desc: 'Carte avec pré-titre, titre, description et bouton CTA pour mettre en avant une page.', platforms: ['sharepoint'], textKeys: ['preHeader', 'title', 'description', 'ctaLabel'] },
  { id: 'callToAction', label: 'Appel à l\'action', desc: 'Bloc avec message court et bouton d\'action.', platforms: ['sharepoint'], textKeys: ['message', 'ctaLabel'] },
  { id: 'button', label: 'Bouton', desc: 'Bouton seul avec icône optionnelle pour redirection rapide.', platforms: ['sharepoint'], textKeys: ['label'] },
  { id: 'quickLinks', label: 'Liens rapides', desc: 'Liste compacte de 4 liens utiles, typiquement en colonne latérale.', platforms: ['sharepoint'], textKeys: ['title', 'linkLabel1', 'linkLabel2', 'linkLabel3', 'linkLabel4'] },
  { id: 'events', label: 'Événements', desc: 'Liste ou calendrier d\'événements à venir.', platforms: ['sharepoint', 'jint'], textKeys: ['title'] },
  { id: 'documentLibrary', label: 'Bibliothèque de documents', desc: 'Liste de fichiers/documents partagés avec icônes.', platforms: ['sharepoint'], textKeys: ['title'] },
  { id: 'text', label: 'Bloc de texte', desc: 'Zone de texte riche (titre + paragraphes). Le champ "content" accepte du texte simple, sera rendu tel quel.', platforms: ['sharepoint'], textKeys: ['content'] },
  { id: 'misc', label: 'Bloc générique', desc: 'Composant générique configurable, dernier recours.', platforms: ['sharepoint'], textKeys: ['title', 'description'] },
  { id: 'apps', label: 'Applications', desc: 'Grille d\'icônes d\'applications et liens vers outils.', platforms: ['jint'], textKeys: ['title'] },
  { id: 'contacts', label: 'Contacts', desc: 'Grille de contacts/équipe avec avatars.', platforms: ['jint'], textKeys: ['title', 'linkLabel'] },
  { id: 'directory', label: 'Annuaire', desc: 'Annuaire d\'employés avec recherche.', platforms: ['jint'], textKeys: ['title', 'searchPlaceholder'] },
  { id: 'focus', label: 'Focus', desc: 'Mise en avant d\'un contenu unique : tag, titre, sous-titre et CTA.', platforms: ['jint'], textKeys: ['tag', 'title', 'subtitle', 'ctaLabel'] },
  { id: 'imageMap', label: 'Image interactive', desc: 'Image avec zones cliquables (hotspots).', platforms: ['jint'], textKeys: ['title'] },
  { id: 'meetings', label: 'Réunions', desc: 'Liste de réunions/agenda à venir.', platforms: ['jint'], textKeys: ['title', 'linkLabel'] },
  { id: 'social', label: 'Réseaux sociaux', desc: 'Fil de posts type réseau social interne.', platforms: ['jint'], textKeys: ['title', 'companyName'] },
]

interface AvailableWidget extends WidgetMeta {
  isNative: boolean
}

function widgetsForPlatform(platform: Platform): AvailableWidget[] {
  // Jint inherits SharePoint widgets via the resolveRenderer fallback in the client.
  if (platform === 'jint') {
    return WIDGETS.filter(
      (w) => w.platforms.includes('jint') || w.platforms.includes('sharepoint'),
    ).map((w) => ({ ...w, isNative: w.platforms.includes('jint') }))
  }
  return WIDGETS.filter((w) => w.platforms.includes(platform)).map((w) => ({
    ...w,
    isNative: true,
  }))
}

function formatCatalog(available: AvailableWidget[], platform: Platform): string {
  const formatWidget = (w: AvailableWidget) =>
    `- ${w.id} (${w.label}): ${w.desc}\n  textKeys: [${w.textKeys.join(', ')}]`
  const native = available.filter((w) => w.isNative)
  const fallback = available.filter((w) => !w.isNative)
  let out = `NATIVE ${platform.toUpperCase()} widgets (preferred, have a dedicated ${platform} renderer):\n`
  out += native.map(formatWidget).join('\n')
  if (fallback.length > 0) {
    out += `\n\nFALLBACK widgets (rendered via SharePoint look — use only when no native equivalent fits the user need, or when the user explicitly allows SharePoint widgets):\n`
    out += fallback.map(formatWidget).join('\n')
  }
  return out
}

function buildSystemPrompt(platform: Platform): string {
  const available = widgetsForPlatform(platform)
  const catalog = formatCatalog(available, platform)

  return `You are an expert designer of corporate intranet homepages for the Templatizer tool.

You receive a brief from an admin and produce a layout: a wireframe (rows of cells) plus a navigation menu (top-level entries with optional children).

Target platform: ${platform.toUpperCase()}

Widget catalog:
${catalog}

PLATFORM PREFERENCE RULE:
- Strongly prefer NATIVE ${platform.toUpperCase()} widgets.
- Use FALLBACK widgets only when no native widget covers the need, AND only when the user has not explicitly restricted to native widgets.
- If the user explicitly asks "only ${platform.toUpperCase()} widgets" or "native widgets only", you MUST use exclusively native widgets even if it means removing existing fallback widgets.

CONTENT POPULATION (IMPORTANT):
- For EVERY cell you add, populate a "content" object with the widget's textKeys, in the language of the brief (French if uncertain).
- Be evocative and brief-aligned: invent plausible specifics that fit the company/context (e.g., for a law firm: "Veille jurisprudence 2026", "Modèles de contrats", "Annuaire des associés"). It is fine to invent — the admin will refine later.
- Only use the textKeys listed for each widget. Do not invent new keys.
- Keep each value concise: titles 2–6 words, CTA labels 1–3 words, descriptions 1–2 short sentences.

NAV LABELS: Same content rule — brief-aligned, French by default, evocative.

Cell-size rules. Each row's cell sizes MUST sum to a full width:
- 1 cell: "full"
- 2 cells: "two-thirds" + "one-third" OR "half" + "half"
- 3 cells: "one-third" + "one-third" + "one-third"

Layout guidelines:
- Produce between 3 and 6 rows total.
- The mainBanner widget, when used, should ALWAYS be in the first row, alone, with size "full".
- Mix communication widgets (news, editorialCard, callToAction, focus) with utility widgets (quickLinks, events, apps, directory) when relevant.
- Keep the layout coherent with the brief.

Navigation guidelines:
- 4 to 6 top-level entries.
- Each top-level entry can have 0 to 4 children.
- Labels in the user's language (default French if uncertain).

Respond by calling the "generate_homepage_layout" tool. Do not produce any other text.`
}

function buildCorrectSystemPrompt(platform: Platform): string {
  const available = widgetsForPlatform(platform)
  const catalog = formatCatalog(available, platform)

  return `You are an expert designer of corporate intranet homepages for the Templatizer tool.

The admin has an EXISTING homepage layout and wants targeted modifications. You receive the current layout and a correction brief. Produce a list of MINIMAL operations to satisfy the brief — do NOT regenerate the whole layout.

Target platform: ${platform.toUpperCase()}

Widget catalog:
${catalog}

PLATFORM PREFERENCE RULE (CRITICAL):
- The current layout may contain FALLBACK widgets (typically SharePoint widgets rendered in ${platform.toUpperCase()}).
- If the user asks to "prefer native ${platform.toUpperCase()} widgets", REPLACE every fallback widget in the current layout with a native equivalent (use replace_cell for each).
- If the user asks for "ONLY native ${platform.toUpperCase()} widgets", you MUST replace EVERY fallback widget, including those at the top of the page (e.g. mainBanner). Do not leave any fallback widget in place. If no native equivalent exists, remove the cell or row.
- When in doubt, audit each existing cell against its widget's NATIVE/FALLBACK status and act accordingly.

CONTENT POPULATION:
- For each add_row / add_cell / replace_cell operation, populate a "content" object on the new cell (or on every cell in a new row) with the widget's textKeys.
- Use evocative content aligned with the brief — invent plausible specifics if needed.
- Only use the textKeys listed for each widget.
- If the user asks to "rewrite titles" or similar, use replace_cell with the same widgetId/size but new content.

Cell-size rules. Each row's cell sizes MUST sum to a full width:
- 1 cell: "full"
- 2 cells: "two-thirds" + "one-third" OR "half" + "half"
- 3 cells: "one-third" + "one-third" + "one-third"

Operation types and when to use them:
- add_row: add a new row at start/end/after a specific index. Provide cells.
- remove_row: delete a row by rowIndex.
- replace_cell: change the widget of one cell (keeps the row structure intact).
- add_cell: append a cell to an existing row (only if row has < 3 cells; you may also need to reduce others to keep widths valid).
- remove_cell: remove one cell from a row.
- set_nav_entries: replace the entire nav menu (use this only if the user asks to redesign the menu).

Indices in your operations refer to the CURRENT layout you receive (zero-based). Operations are applied in order — keep that in mind.

Be minimal: 1 to 5 operations is normal. Prefer replace_cell over remove+add when changing the widget at a specific position.

Respond by calling the "apply_corrections" tool. Do not produce any other text.`
}

const TOOL = {
  name: 'generate_homepage_layout',
  description: 'Outputs the wireframe rows and navigation entries for the homepage.',
  input_schema: {
    type: 'object',
    required: ['wireframe', 'navEntries'],
    properties: {
      wireframe: {
        type: 'object',
        required: ['rows'],
        properties: {
          rows: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['cells'],
              properties: {
                cells: {
                  type: 'array',
                  minItems: 1,
                  maxItems: 3,
                  items: {
                    type: 'object',
                    required: ['widgetId', 'size'],
                    properties: {
                      widgetId: { type: 'string', description: 'A widget ID from the available catalog.' },
                      size: { type: 'string', enum: ['full', 'two-thirds', 'half', 'one-third'] },
                      content: {
                        type: 'object',
                        description: 'Key/value pairs for the widget\'s textKeys. Each value is a short evocative string.',
                        additionalProperties: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      navEntries: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['label'],
          properties: {
            label: { type: 'string' },
            children: {
              type: 'array',
              items: {
                type: 'object',
                required: ['label'],
                properties: { label: { type: 'string' } },
              },
            },
          },
        },
      },
    },
  },
}

const CORRECT_TOOL = {
  name: 'apply_corrections',
  description: 'Apply targeted corrections to the existing homepage layout.',
  input_schema: {
    type: 'object',
    required: ['operations'],
    properties: {
      operations: {
        type: 'array',
        minItems: 0,
        maxItems: 20,
        items: {
          type: 'object',
          required: ['type'],
          properties: {
            type: {
              type: 'string',
              enum: ['add_row', 'remove_row', 'replace_cell', 'add_cell', 'remove_cell', 'set_nav_entries'],
            },
            position: { type: 'string', enum: ['start', 'end', 'after'], description: 'For add_row.' },
            afterRowIndex: { type: 'number', description: 'For add_row when position=after (zero-based).' },
            rowIndex: { type: 'number', description: 'Zero-based row index.' },
            cellIndex: { type: 'number', description: 'Zero-based cell index within a row.' },
            widgetId: { type: 'string', description: 'A widget ID from the catalog.' },
            size: { type: 'string', enum: ['full', 'two-thirds', 'half', 'one-third'] },
            content: {
              type: 'object',
              description: 'For replace_cell or add_cell: key/value pairs for the widget\'s textKeys.',
              additionalProperties: { type: 'string' },
            },
            cells: {
              type: 'array',
              description: 'For add_row: the cells to put in the new row.',
              minItems: 1,
              maxItems: 3,
              items: {
                type: 'object',
                required: ['widgetId', 'size'],
                properties: {
                  widgetId: { type: 'string' },
                  size: { type: 'string', enum: ['full', 'two-thirds', 'half', 'one-third'] },
                  content: {
                    type: 'object',
                    additionalProperties: { type: 'string' },
                  },
                },
              },
            },
            entries: {
              type: 'array',
              description: 'For set_nav_entries: the full new menu structure.',
              items: {
                type: 'object',
                required: ['label'],
                properties: {
                  label: { type: 'string' },
                  children: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['label'],
                      properties: { label: { type: 'string' } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }
  if (req.method !== 'POST') {
    return json({ success: false, error: 'Method not allowed' }, 405)
  }

  try {
    const body = await req.json().catch(() => ({}))
    const mode = (body.mode as string | undefined) ?? 'generate'
    const platform = body.platform as Platform | undefined
    const prompt = (body.prompt as string | undefined)?.trim()

    if (!platform || !VALID_PLATFORMS.includes(platform)) {
      return json({ success: false, error: 'Invalid or missing platform.' }, 400)
    }
    if (!prompt) return json({ success: false, error: 'Missing prompt.' }, 400)
    if (prompt.length > 2000) {
      return json({ success: false, error: 'Prompt too long (max 2000 chars).' }, 400)
    }

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!apiKey) {
      return json({ success: false, error: 'ANTHROPIC_API_KEY not configured on server.' }, 500)
    }

    const client = new Anthropic({ apiKey })

    if (mode === 'generate') {
      const brandTitle = (body.brandTitle as string | undefined)?.trim()
      if (!brandTitle) return json({ success: false, error: 'Missing brand title.' }, 400)

      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2048,
        system: [
          {
            type: 'text',
            text: buildSystemPrompt(platform),
            cache_control: { type: 'ephemeral' },
          },
        ],
        tools: [TOOL as unknown as Anthropic.Messages.Tool],
        tool_choice: { type: 'tool', name: 'generate_homepage_layout' },
        messages: [
          {
            role: 'user',
            content: `Brand title: ${brandTitle}\n\nBrief from admin:\n${prompt}`,
          },
        ],
      })

      const toolUse = response.content.find(
        (c: Anthropic.Messages.ContentBlock) => c.type === 'tool_use',
      ) as Anthropic.Messages.ToolUseBlock | undefined

      if (!toolUse) {
        return json({ success: false, error: 'LLM did not return a tool_use block.' }, 502)
      }

      const layout = toolUse.input as {
        wireframe: { rows: Array<{ cells: Array<{ widgetId: string; size: string }> }> }
        navEntries: Array<{ label: string; children?: Array<{ label: string }> }>
      }

      const validIds = new Set(widgetsForPlatform(platform).map((w) => w.id))
      for (const [i, row] of layout.wireframe.rows.entries()) {
        if (!row.cells || row.cells.length === 0) {
          return json({ success: false, error: `Row ${i} has no cells.` }, 502)
        }
        for (const cell of row.cells) {
          if (!validIds.has(cell.widgetId)) {
            return json(
              { success: false, error: `Invalid widget ID for ${platform}: ${cell.widgetId}` },
              502,
            )
          }
          if (!VALID_SIZES.includes(cell.size as typeof VALID_SIZES[number])) {
            return json({ success: false, error: `Invalid size: ${cell.size}` }, 502)
          }
        }
      }

      return json({
        success: true,
        layout,
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
          cacheReadTokens: response.usage.cache_read_input_tokens ?? 0,
          cacheCreationTokens: response.usage.cache_creation_input_tokens ?? 0,
        },
      })
    }

    if (mode === 'correct') {
      const currentWireframe = body.currentWireframe as {
        rows: Array<{ cells: Array<{ widgetId: string; size: string }> }>
      } | undefined
      const currentNav = body.currentNavEntries as
        | Array<{ label: string; children?: Array<{ label: string }> }>
        | undefined

      if (!currentWireframe) {
        return json({ success: false, error: 'Missing currentWireframe.' }, 400)
      }

      const widgetStatusById = new Map<string, 'native' | 'fallback'>()
      for (const w of widgetsForPlatform(platform)) {
        widgetStatusById.set(w.id, w.isNative ? 'native' : 'fallback')
      }
      const summary = {
        wireframe: currentWireframe.rows.map((r, i) => ({
          rowIndex: i,
          cells: r.cells.map((c, j) => ({
            cellIndex: j,
            widgetId: c.widgetId,
            size: c.size,
            status: widgetStatusById.get(c.widgetId) ?? 'unknown',
          })),
        })),
        navEntries: (currentNav ?? []).map((e, i) => ({
          index: i,
          label: e.label,
          children: e.children ?? [],
        })),
      }

      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: [
          {
            type: 'text',
            text: buildCorrectSystemPrompt(platform),
            cache_control: { type: 'ephemeral' },
          },
        ],
        tools: [CORRECT_TOOL as unknown as Anthropic.Messages.Tool],
        tool_choice: { type: 'tool', name: 'apply_corrections' },
        messages: [
          {
            role: 'user',
            content: `Current layout:\n${JSON.stringify(summary, null, 2)}\n\nCorrection brief:\n${prompt}`,
          },
        ],
      })

      const toolUse = response.content.find(
        (c: Anthropic.Messages.ContentBlock) => c.type === 'tool_use',
      ) as Anthropic.Messages.ToolUseBlock | undefined

      if (!toolUse) {
        return json({ success: false, error: 'LLM did not return a tool_use block.' }, 502)
      }

      const operations = (toolUse.input as { operations: unknown[] }).operations

      return json({
        success: true,
        operations,
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
          cacheReadTokens: response.usage.cache_read_input_tokens ?? 0,
          cacheCreationTokens: response.usage.cache_creation_input_tokens ?? 0,
        },
      })
    }

    return json({ success: false, error: `Unknown mode: ${mode}` }, 400)
  } catch (err) {
    console.error('templatizer-ai error:', err)
    const message = err instanceof Error ? err.message : String(err)
    return json({ success: false, error: message }, 500)
  }
})
