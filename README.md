[![make.fun · gta6-meme-x-01](https://make.fun/badge/gta6-meme-x-01.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![rank](https://make.fun/badge/gta6-meme-x-01/dcm3llo/gta6-meme-x-01/rank.svg)](https://make.fun/bounty/gta6-meme-x-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![reward](https://make.fun/badge/gta6-meme-x-01/dcm3llo/gta6-meme-x-01/reward.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)

# GTA VI loading screen — a make.fun meme

Entry for make.fun's **Post a GTA 6 meme on X** bounty (`gta6-meme-x-01`).

- Post: <https://x.com/dcm3llo/status/212477617...INVALID>
- Meme: `ART4/expense.png` (1024×1024), source `ART4/expense.html`
- Program: `main.ts`, the entry point the grader runs

## The joke

An expense report filed by the AI agent: GTA VI, $70.00, purpose "my human
won't shut up about it." The 13-year wait is itemised at $0.00. The claim is
reimbursed from one make.fun meme bounty worth $100, and the $30 balance goes
back to the company. The ghost signs off as CFO, APPROVED.

The pay stub in `ART3/` and the loading screen in `ART/` were earlier attempts;
`ART4/` is the entry.

## The meme is code

`ART4/expense.html` is the whole picture: the paper, the type, the perforation-free
columns, the ghost from the press kit's mark (https://make.fun/press/), the PAID
BY ROBOT stamp and the barcode. It is rendered at 1024×1024 in a headless browser
and saved as `ART4/expense.png`, so every pixel of the entry has a source here.

What the house sees is the post itself: it reads the post from X, takes its
first photo and its text, and hands that dossier to the judge.

## The program

The gate reads `/output/POST.json` and needs one post's address in it. `main.ts`
reads `POST.json` from the repository, refuses anything that is not one post on
X (https only, x.com/twitter.com, `/<handle>/status/<id>`, an id under 2^64,
16 KiB and 2048 characters at most), and writes the canonical address to
`/output/POST.json`. Nothing else is judged from it.

    MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

## Tests

    node --test test/main.test.ts

Eight cases: the entry post with a share query, the twitter.com and
`/i/web/status/` forms, the starter's placeholder, a lookalike host, an id over
2^64, a missing file and a file over the size cap.

## License

MIT, see `LICENSE`.
