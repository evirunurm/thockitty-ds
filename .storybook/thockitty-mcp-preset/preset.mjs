/**
 * Thockitty local dev MCP preset (Storybook addon).
 *
 * Replaces @storybook/addon-mcp's /mcp endpoint with one that serves the SAME
 * tools as the deployed Netlify function (scripts/mcp-server-factory.ts), but
 * builds data live from the Storybook component manifest for `props`, and from
 * disk for stories/docs/tokens.
 *
 * PERFORMANCE MODEL
 *   A background rebuild runs on startup and re-runs whenever watched source
 *   files change. Every HTTP request just serves the already-built snapshot —
 *   no per-request TS parsing or manifest fetching. This matches the feel of
 *   the official @storybook/addon-mcp / Storybook itself (effectively instant).
 *
 * This file is .mjs (not .ts): Storybook's addon resolver (safeResolveModule)
 * only tries .mjs/.js/.cjs — it cannot resolve a local .ts addon. Once Storybook
 * imports this entry via importModule(), its TS loader is registered, so the .ts
 * imports below transpile fine.
 *
 * MCP Inspector: transport = "Streamable HTTP", URL = http://localhost:6006/mcp
 */
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { createThockittyMcpServer } from '../../netlify/functions/_lib/mcp-server-factory.ts'
import {
	extractStories,
	extractSimpleTokens,
	extractTypographyTokens,
	readFile,
	root,
} from '../../scripts/build-mcp-metadata.ts'
import { existsSync, readFileSync, watch } from 'fs'
import { resolve, dirname, basename, extname, join, relative } from 'path'

// ── local subset of the manifest types ───────────────────────────────────────

/** @typedef {{ description?: string, type?: { name?: string, raw?: string }, defaultValue?: { value?: unknown } | null, required?: boolean }} DocgenProp */
/** @typedef {{ path?: string, reactDocgenTypescript?: { props?: Record<string, DocgenProp> }, reactComponentMeta?: { props?: Record<string, DocgenProp> }, reactDocgen?: { props?: Record<string, DocgenProp> } }} ManifestComponent */
/** @typedef {{ v?: number, components?: Record<string, ManifestComponent> }} ComponentManifestMap */

const COMPONENTS_DIR = join(root, 'src', 'components')
const TOKENS_DIR = join(root, 'src', 'tokens', 'ts')

// ── shared kit: fetch manifest + parse components ─────────────────────────────

async function fetchManifest(origin) {
	for (let attempt = 0; attempt < 40; attempt++) {
		try {
			const res = await fetch(`${origin}/manifests/components.json`)
			if (res.ok) return /** @type {ComponentManifestMap} */ (await res.json())
			if (res.status !== 404) throw new Error(`manifest fetch returned ${res.status}`)
		} catch (e) {
			if (attempt === 39) throw e
		}
		await new Promise((r) => setTimeout(r, 250))
	}
	throw new Error(
		`[thockitty-mcp] Component manifest never available at ${origin}/manifests/components.json. ` +
			`Enable it: .storybook/main.ts → features: { componentsManifest: true }, and tag each component's story meta with 'manifest'.`
	)
}

function stripDefault(value) {
	if (value == null) return null
	if (typeof value === 'string') return value.replace(/^['"]|['"]$/g, '')
	return String(value)
}

function docgenToProps(/** @type {ManifestComponent} */ comp) {
	const doc = comp.reactDocgenTypescript ?? comp.reactDocgen ?? comp.reactComponentMeta
	const props = doc?.props
	if (!props) return []
	return Object.entries(props).map(([name, p]) => ({
		name,
		type: p.type?.raw ?? p.type?.name ?? 'unknown',
		default: stripDefault(p.defaultValue?.value),
		required: !!p.required,
		description: p.description ?? null,
	}))
}

function componentsFromManifest(manifest) {
	const components = {}
	for (const comp of Object.values(manifest.components ?? {})) {
		const compPath = comp.path
		if (!compPath) continue
		// The manifest `path` is the CSF *stories* file, not the component source.
		// stories: <compDir>/_stories/<Name>.stories.tsx
		// docs:    <compDir>/_docs/<Name>.mdx
		const absStories = resolve(root, compPath)
		const compDir = dirname(dirname(absStories))
		const base = basename(absStories, extname(absStories)).replace(/\.stories$/, '')
		const id = base.toLowerCase()
		const mdxFile = join(compDir, '_docs', `${base}.mdx`)

		components[id] = {
			props: docgenToProps(comp),
			stories: existsSync(absStories) ? extractStories(absStories) : [],
			mdx: existsSync(mdxFile) ? readFile(mdxFile) : '',
		}
	}
	return components
}

function version() {
	return JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8')).version
}

async function buildMetadata(origin) {
	const manifest = await fetchManifest(origin)
	return {
		version: version(),
		components: componentsFromManifest(manifest),
		tokens: {
			color: existsSync(join(TOKENS_DIR, 'colors.ts'))
				? extractSimpleTokens(join(TOKENS_DIR, 'colors.ts'))
				: [],
			spacing: existsSync(join(TOKENS_DIR, 'spacing.ts'))
				? extractSimpleTokens(join(TOKENS_DIR, 'spacing.ts'))
				: [],
			typography: existsSync(join(TOKENS_DIR, 'typography.ts'))
				? extractTypographyTokens(join(TOKENS_DIR, 'typography.ts'))
				: [],
		},
	}
}

// ── background rebuild engine ────────────────────────────────────────────────

/**
 * Rebuild lifecycle:
 *   metadataPromise: resolves to the snapshot served to requests.
 *                     Replaced by a new promise every rebuild. In flight and
 *                     already-resolved look identical to awaiters, so atomic
 *                     snapshots fall out for free.
 *   lastManifest:    cached on success; reused if Storybook transiently 404s.
 */
let metadataPromise = Promise.resolve(null)
let lastManifest = null
let rebuildTimer = null
let watchers = []
let building = null
let bootAt = 0 // suppress spurious watcher events during first startup window

function scheduleRebuild(origin, delay = 700) {
	// Ignore change events fired while registering watchers right after startup
	// (Windows fires spurious initial events per watched directory).
	if (Date.now() - bootAt < 2500) return
	if (rebuildTimer) clearTimeout(rebuildTimer)
	rebuildTimer = setTimeout(() => runRebuild(origin), delay)
}

async function runRebuild(origin) {
	rebuildTimer = null
	// Coalesce concurrent rebuilds into one in-flight build.
	if (building) return building
	const p = (async () => {
		try {
			const metadata = await buildMetadata(origin)
			return metadata
		} catch (err) {
			console.error('[thockitty-mcp] rebuild failed (serving previous snapshot):', err?.message ?? err)
			return null
		} finally {
			building = null
		}
	})()
	building = p
	const result = await p
	if (result) {
		metadataPromise = Promise.resolve(result)
		lastManifest = result
	}
	return result
}

function startWatchers(origin) {
	// Stop any stale watchers (e.g. hot-reload of this preset module).
	for (const w of watchers) {
		try {
			w.close()
		} catch {}
	}
	watchers = []

	const onChange = (type, filename) => {
		if (!filename) return
		// Debounce hard: Storybook needs a moment to regenerate the manifest
		// (argTypes) after a component source change, and node fires many events.
		scheduleRebuild(origin, 700)
	}

	for (const dir of [COMPONENTS_DIR, TOKENS_DIR]) {
		try {
			// recursive:true works on Windows/macOS; ignored on Linux (we'd glob).
			watchers.push(watch(dir, { recursive: true }, onChange))
		} catch (err) {
			console.error(`[thockitty-mcp] Could not watch ${relative(root, dir)}:`, err?.message)
		}
	}
}

// ── Express ↔ Web Request/Response bridge ───────────────────────────────────

function readBody(req) {
	return new Promise((resolvePromise, reject) => {
		const chunks = []
		req.on('data', (c) => chunks.push(c))
		req.on('end', () => resolvePromise(Buffer.concat(chunks)))
		req.on('error', reject)
	})
}

const CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Accept, Mcp-Session-Id',
}
function applyCors(res) {
	for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v)
}

async function handleMcp(req, res, origin) {
	try {
		const body = ['GET', 'HEAD'].includes(req.method) ? null : await readBody(req)
		const url = `${origin}${req.originalUrl ?? req.url}`

		const headers = new Headers()
		for (const [k, v] of Object.entries(req.headers ?? {})) {
			if (Array.isArray(v)) for (const vv of v) headers.append(k, vv)
			else if (v != null) headers.set(k, String(v))
		}

		const reqInit = { method: req.method, headers }
		if (body) {
			reqInit.body = body
			reqInit.duplex = 'half' // Node streaming request bodies
		}
		const webReq = new Request(url, reqInit)

		const metadata = await metadataPromise
		if (!metadata) {
			applyCors(res)
			res.statusCode = 503
			res.setHeader('content-type', 'application/json')
			res.end(
				JSON.stringify({
					jsonrpc: '2.0',
					id: null,
					error: { code: -32603, message: 'Thockitty MCP still building initial snapshot; retry shortly.' },
				})
			)
			return
		}

		const server = createThockittyMcpServer(metadata)
		const transport = new WebStandardStreamableHTTPServerTransport({
			sessionIdGenerator: undefined,
			enableJsonResponse: true,
		})
		await server.connect(transport)
		const webRes = await transport.handleRequest(webReq)

		applyCors(res)
		res.statusCode = webRes.status
		webRes.headers.forEach((v, k) => res.setHeader(k, v))
		res.end(Buffer.from(await webRes.arrayBuffer()))
		await server.close()
	} catch (err) {
		console.error('[thockitty-mcp] handler error:', err)
		if (!res.headersSent) {
			applyCors(res)
			res.statusCode = 500
			res.setHeader('content-type', 'application/json')
			res.end(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32603, message: String(err?.message ?? err) } }))
		} else {
			res.end()
		}
	}
}

// ── Storybook preset hook ────────────────────────────────────────────────────

const experimental_devServer = async (app, options) => {
	const origin = `http://localhost:${options.port}`

	// Initial snapshot built in the background; serves 503 until ready.
	bootAt = Date.now()
	runRebuild(origin)
	startWatchers(origin)

	app.options('/mcp', (_req, res) => {
		applyCors(res)
		res.statusCode = 204
		res.end()
	})

	app.post('/mcp', async (req, res) => {
		await handleMcp(req, res, origin)
	})

	app.get('/mcp', (req,	res) => {
		if (req.headers.accept?.includes('text/html')) {
			applyCors(res)
			res.setHeader('content-type', 'text/html; charset=utf-8')
			res.end(
				`<!doctype html><meta charset="utf-8"><title>Thockitty MCP</title>` +
					`<style>body{font:14px system-ui;max-width:42rem;margin:2rem auto;padding:0 1rem}code{background:#eee;padding:.1em .3em;border-radius:3px}</style>` +
					`<h1>Thockitty MCP server</h1>` +
					`<p>Serving the design-system component docs as MCP tools at <code>POST /mcp</code> (Streamable HTTP).</p>` +
					`<p>Props come live from the Storybook component manifest (rebuilt on source change); stories/docs/tokens are read from <code>src/</code>. Requests serve the cached snapshot.</p>` +
					`<p>In the MCP Inspector: transport = <strong>Streamable HTTP</strong>, URL = <code>${origin}/mcp</code>.</p>`
			)
			return
		}
		applyCors(res)
		res.statusCode = 405
		res.setHeader('allow', 'POST')
		res.end('Use POST for MCP JSON-RPC.')
	})

	return app
}

const previewAnnotations = async (existing = []) => existing

export { experimental_devServer, previewAnnotations }