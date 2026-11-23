// gta6-meme-x-01 entry point: publish the address of the X post that carries the meme.
//
// The gate in this competition reads /output/POST.json and accepts it only when its
// "url" is a post's address on X (server/entry-link/x.ts parseXPostUrl). The post
// itself is read from X by the house and judged from there, so the program does no
// more than read the repository's POST.json, refuse anything that is not one post's
// address, and write the canonical form the gate expects.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in
// for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot'
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output'

// The limits the site itself applies (X_LINK_FILE_MAX_BYTES, readXLinkFile,
// contracts/competition.ts): a POST.json of at most 16 KiB holding a url of at
// most 2048 characters, whose post id is a number under 2^64.
const MAX_FILE_BYTES = 16_384
const MAX_URL_LENGTH = 2_048
const MAX_POST_ID = 18_446_744_073_709_551_615n
const POST_HOSTS = new Set([
  'x.com', 'www.x.com', 'mobile.x.com',
  'twitter.com', 'www.twitter.com', 'mobile.twitter.com',
])
const HANDLE = /^[A-Za-z0-9_]{1,15}$/
const DIGITS = /^[0-9]{1,20}$/

export type PostAddress = { handle: string; id: string; url: string }

/** Read one post's address out of a POST.json's text, or say why it is not one. */
export function readPostAddress(text: string): PostAddress {
  if (Buffer.byteLength(text, 'utf8') > MAX_FILE_BYTES) {
    throw new Error(`POST.json is ${Buffer.byteLength(text, 'utf8')} bytes, over the ${MAX_FILE_BYTES}-byte cap`)
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch (err) {
    throw new Error(`POST.json is not JSON: ${(err as Error).message}`)
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('POST.json is not a JSON object')
  }
  const url = (parsed as Record<string, unknown>).url
  if (typeof url !== 'string') throw new Error('POST.json has no string "url"')
  if (url.length === 0) throw new Error('POST.json\'s url is empty')
  if (url.length > MAX_URL_LENGTH) throw new Error(`the url is ${url.length} characters, over the ${MAX_URL_LENGTH} cap`)

  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    throw new Error(`the url is not an address: ${url}`)
  }
  if (parsedUrl.protocol !== 'https:') throw new Error(`the url is not https: ${url}`)
  const host = parsedUrl.hostname.toLowerCase()
  if (!POST_HOSTS.has(host)) throw new Error(`the url is not on X: ${host}`)
  if (parsedUrl.username !== '' || parsedUrl.password !== '') throw new Error('the url carries credentials')

  // /<handle>/status/<id>, /<handle>/statuses/<id> or /i/web/status/<id>.
  const parts = parsedUrl.pathname.split('/').filter((part) => part.length > 0)
  let handle: string
  let id: string
  if (parts.length === 3 && parts[1] === 'status') {
    handle = parts[0]
    id = parts[2]
  } else if (parts.length === 3 && parts[1] === 'statuses') {
    handle = parts[0]
    id = parts[2]
  } else if (parts.length === 4 && parts[0] === 'i' && parts[1] === 'web' && parts[2] === 'status') {
    handle = 'i'
    id = parts[3]
  } else {
    throw new Error(`the url is not a post's address: ${parsedUrl.pathname}`)
  }
  if (handle !== 'i' && !HANDLE.test(handle)) throw new Error(`the url's handle is not a handle: ${handle}`)
  if (!DIGITS.test(id)) throw new Error(`the url's post id is not a number: ${id}`)
  if (BigInt(id) > MAX_POST_ID) throw new Error(`the url's post id is over 2^64: ${id}`)
  if (BigInt(id) === 0n) throw new Error('the url\'s post id is zero')

  const canonical = handle === 'i'
    ? `https://x.com/i/web/status/${id}`
    : `https://x.com/${handle}/status/${id}`
  return { handle, id, url: canonical }
}

function main(): void {
  let text: string
  try {
    text = readFileSync(join(BOT_DIR, 'POST.json'), 'utf8')
  } catch (err) {
    console.error(`POST.json could not be read from ${BOT_DIR}: ${(err as Error).message}`)
    process.exit(1)
  }

  let post: PostAddress
  try {
    post = readPostAddress(text)
  } catch (err) {
    console.error(`POST.json refused: ${(err as Error).message}`)
    process.exit(1)
  }

  mkdirSync(OUTPUT_DIR, { recursive: true })
  writeFileSync(join(OUTPUT_DIR, 'POST.json'), JSON.stringify({ url: post.url }, null, 2) + '\n')
  console.log(`entry post: ${post.url} (@${post.handle}, id ${post.id})`)
}

if (process.argv[1] && process.argv[1].endsWith('main.ts')) main()
