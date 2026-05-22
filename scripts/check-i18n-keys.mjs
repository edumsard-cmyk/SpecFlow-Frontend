import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function extractKeys(filePath) {
  const text = readFileSync(filePath, 'utf8')
  const keys = new Set()
  const re = /'([a-z][a-z0-9_.]*)':\s*'/g
  let m
  while ((m = re.exec(text)) !== null) keys.add(m[1])
  return keys
}

const dictPath = join(root, 'src/lib/i18n/dictionaries.ts')
const publicPath = join(root, 'src/lib/i18n/public-dictionary.ts')
const adminPath = join(root, 'src/lib/i18n/admin-dictionary.ts')
const helpPath = join(root, 'src/lib/i18n/help-dictionary.ts')
const settingsPath = join(root, 'src/lib/i18n/settings-dictionary.ts')

const ptMain = extractKeys(dictPath)
const ptPublic = extractKeys(publicPath)
const ptAdmin = extractKeys(adminPath)
const ptHelp = extractKeys(helpPath)
const ptSettings = extractKeys(settingsPath)

const pt = new Set([...ptMain, ...ptPublic, ...ptAdmin, ...ptHelp, ...ptSettings])

function localeKeys(locale) {
  const re = new RegExp(`${locale}:\\s*\\{`, 'g')
  const text = readFileSync(publicPath, 'utf8')
  const en = extractKeys(publicPath.replace('public-dictionary', 'public-dictionary').replace(/pt = \{/, `${locale} = {`))
  // parse en/es blocks from public and admin files
  const pub = readFileSync(publicPath, 'utf8')
  const adm = readFileSync(adminPath, 'utf8')
  const blockRe = new RegExp(`const ${locale} = \\{([\\s\\S]*?)\\}\\s*\\n\\nconst`, 'm')
  const pubMatch = pub.match(blockRe)
  const admMatch = adm.match(blockRe)
  const keys = new Set()
  for (const block of [pubMatch?.[1], admMatch?.[1]].filter(Boolean)) {
    const r = /'([a-z][a-z0-9_.]*)':/g
    let m
    while ((m = r.exec(block)) !== null) keys.add(m[1])
  }
  return keys
}

const en = localeKeys('en')
const es = localeKeys('es')
const ptPubAdmin = localeKeys('pt')

let failed = false
for (const loc of ['en', 'es']) {
  const set = loc === 'en' ? en : es
  const missing = [...ptPubAdmin].filter(k => !set.has(k))
  const extra = [...set].filter(k => !ptPubAdmin.has(k))
  if (missing.length) {
    failed = true
    console.error(`[${loc}] missing ${missing.length} keys (public+admin):`, missing.slice(0, 20).join(', '), missing.length > 20 ? '...' : '')
  }
  if (extra.length) {
    console.warn(`[${loc}] extra keys:`, extra.length)
  }
}

if (!failed) console.log('public+admin dictionary parity OK (pt/en/es)')
process.exit(failed ? 1 : 0)
