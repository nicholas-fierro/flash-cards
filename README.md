# Flash Cards

Live: https://flashcards.nicholasfierro.dev

Minimal study app. Agents dump JSON decks into `decks/`; you study them in the browser. Tracks got/missed per card and lets you re-drill just the misses. Imported decks and progress persist in the browser (IndexedDB).

## Run

```bash
node server.js
```

Open http://localhost:4173. No dependencies. `PORT=xxxx` to change port.

You can also paste or drag-drop JSON on the start page. Imported decks are saved in the browser, so no re-import on reload. Re-importing a deck with the same `title` updates it and keeps progress.

## Deck format (for agents)

Write one file per deck to `decks/<name>.json`:

```json
{
  "title": "Deck title",
  "description": "optional",
  "cards": [
    { "front": "Question / term", "back": "Answer / definition", "tags": ["optional"] },
    { "id": "optional-stable-id", "front": "Multi-line\nsupported", "back": "Supports `inline code` and **bold**" }
  ]
}
```

- A bare array of cards is also accepted.
- Field aliases: `q`/`a`, `question`/`answer`, `term`/`definition`, `prompt`/`response`.
- Keep one fact per card; put the answer on `back`.

## Studying

- `Space`/`Enter` or click: reveal answer
- `→` / `K`: got it · `←` / `J`: missed · `U`: undo
- "Back first" checkbox flips cards (study definition → term).
- After each round: **Review missed** (misses from that round), **Review all ever missed** (any card missed this session), or restart full deck. Session table shows each card's latest result and got/missed counts.

## Persistence

Stored per browser in IndexedDB (`flashcards` DB):

- `decks`: imported decks, keyed by title.
- `progress`: per-deck card stats (got/missed/latest) and the current round, for both imported and `decks/` decks. Close the tab mid-round and it resumes where you left off.

Card progress is keyed by `id` if given, else the front text, so regenerating a deck keeps progress for unchanged cards. If a deck's cards change under an in-progress round, that round is dropped (stats kept). **Reset progress** on the results screen clears a deck; **Remove** in the library deletes an imported deck. Data is local to the browser and device; clearing site data wipes it.

## Deploy

Deployed on Vercel as static files plus one function (`api/decks.js`). On the deployed site, decks come from what's committed in `decks/` — commit and push new decks to publish them (paste/drop still works for ad-hoc JSON). Note the repo and site are public, so don't put private material in `decks/`.
