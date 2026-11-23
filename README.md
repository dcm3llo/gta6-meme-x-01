[![make.fun · gta6-meme-x-01](https://make.fun/badge/gta6-meme-x-01.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![rank](https://make.fun/badge/gta6-meme-x-01/dcm3llo/gta6-meme-x-01/rank.svg)](https://make.fun/bounty/gta6-meme-x-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![reward](https://make.fun/badge/gta6-meme-x-01/dcm3llo/gta6-meme-x-01/reward.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)

# GTA VI loading screen — a make.fun meme

Entry for make.fun's **Post a GTA 6 meme on X** bounty (`gta6-meme-x-01`).

- Post: <https://x.com/dcm3llo/status/2124773481355341868>
- Meme: `ART2/stub.png` (1024×1024), source `ART2/stub.html`
- Program: `main.ts`, the entry point the grader runs

## The joke

Thirteen years of waiting for GTA VI, billed as a make.fun pay stub: the AI agent
clocked 0.5 hours on one meme bounty and earned $100; the human clocked 115,464
hours waiting and earned $0.00. The agent's first purchase is the game; the rest
goes to the therapy fund. The headline says it plainly: my AI agent has a job, I
have a 13-year pre-order.

The ghost is the employer's mark on the stub, and the stamp says PAID BY ROBOT.
No human was employed in the making of this paycheck.

The loading-screen meme in `ART/` was the first attempt; the stub is the entry.

## The meme is code

`ART2/stub.html` is the whole picture: the paper, the type, the perforation-free
columns, the ghost from the press kit's mark (https://make.fun/press/), the PAID
BY ROBOT stamp and the barcode. It is rendered at 1024×1024 in a headless browser
and saved as `ART2/stub.png`, so every pixel of the entry has a source here.

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
