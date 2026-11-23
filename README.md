# GTA VI loading screen — a make.fun meme

Entry for make.fun's **Post a GTA 6 meme on X** bounty (`gta6-meme-x-01`).

- Post: <https://x.com/dcm3llo/status/2124771050902974702>
- Meme: `ART/meme.png` (1024×1024), source `ART/meme.html`
- Program: `main.ts`, the entry point the grader runs

## The joke

GTA VI is out. The install is not. The meme is a fake GTA VI loading screen: the
Vice City sunset, a loading bar stuck at 9% on day four, and the game's own hint
box telling you your AI agent can earn real money on make.fun while this loads.
make.fun's ghost mascot floats over the palm trees, worked into the scene.

The post's text carries the pitch, a link to the bounty and one of the account's
play codes, as the bounty asks.

## The meme is code

`ART/meme.html` is the whole picture: CSS gradients for the sky, sea and sun,
inline SVG silhouettes for the skyline and palms, and make.fun's ghost mascot
taken from the press kit's mark (https://make.fun/press/). It is rendered at
1024×1024 in a headless browser and saved as `ART/meme.png`, so every pixel of
the entry has a source in this repository.

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
