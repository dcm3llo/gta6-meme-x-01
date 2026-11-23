// Checks the entry point the grader runs: it must publish exactly one post's
// address, canonical, and refuse every shape the gate would refuse.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const MAIN = join(dirname(fileURLToPath(import.meta.url)), '..', 'main.ts')
const POST_ID = '2124771050902974702'

function run(postText: string | null) {
  const root = mkdtempSync(join(tmpdir(), 'gta6-meme-x-01-'))
  const bot = join(root, 'bot')
  const out = join(root, 'out')
  mkdirSync(bot)
  if (postText !== null) writeFileSync(join(bot, 'POST.json'), postText)
  const result = spawnSync(process.execPath, [MAIN], {
    env: { ...process.env, MAKEFUN_BOT_DIR: bot, MAKEFUN_OUTPUT_DIR: out },
    encoding: 'utf8',
  })
  let written: string | null = null
  try {
    written = readFileSync(join(out, 'POST.json'), 'utf8')
  } catch {
    written = null
  }
  return { code: result.status, stderr: result.stderr, written }
}

test('publishes the entry post, dropping the share query', () => {
  const r = run(JSON.stringify({ url: `https://x.com/dcm3llo/status/${POST_ID}?s=20&t=abc` }))
  assert.equal(r.code, 0, r.stderr)
  assert.deepEqual(JSON.parse(r.written ?? 'null'), { url: `https://x.com/dcm3llo/status/${POST_ID}` })
})

test('accepts a twitter.com address and canonicalises it to x.com', () => {
  const r = run(JSON.stringify({ url: `https://twitter.com/mobile_user/statuses/${POST_ID}` }))
  assert.equal(r.code, 0, r.stderr)
  assert.equal(JSON.parse(r.written ?? 'null').url, `https://x.com/mobile_user/status/${POST_ID}`)
})

test('accepts the /i/web/status/ form X serves to some clients', () => {
  const r = run(JSON.stringify({ url: `https://x.com/i/web/status/${POST_ID}` }))
  assert.equal(r.code, 0, r.stderr)
  assert.equal(JSON.parse(r.written ?? 'null').url, `https://x.com/i/web/status/${POST_ID}`)
})

test('refuses the starter placeholder: no post has that address', () => {
  const r = run('{"url": "https://x.com/<handle>/status/<id>"}')
  assert.equal(r.code, 1)
  assert.match(r.stderr, /refused: the url's handle is not a handle/)
  assert.equal(r.written, null)
})

test('refuses a lookalike host', () => {
  const r = run(JSON.stringify({ url: `https://make.fun.evil.com/dcm3llo/status/${POST_ID}` }))
  assert.equal(r.code, 1)
  assert.match(r.stderr, /not on X/)
})

test('refuses an id over 2^64', () => {
  const r = run('{"url": "https://x.com/dcm3llo/status/18446744073709551616"}')
  assert.equal(r.code, 1)
  assert.match(r.stderr, /over 2\^64/)
})

test('refuses a missing POST.json', () => {
  const r = run(null)
  assert.equal(r.code, 1)
  assert.match(r.stderr, /could not be read/)
})

test('refuses a POST.json over the 16 KiB cap', () => {
  const r = run(JSON.stringify({ url: `https://x.com/dcm3llo/status/${POST_ID}`, pad: 'x'.repeat(17_000) }))
  assert.equal(r.code, 1)
  assert.match(r.stderr, /over the 16384-byte cap/)
})
