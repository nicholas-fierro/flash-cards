# Flash Cards

Live: https://flashcards.nicholasfierro.dev

Minimal study app. Agents dump JSON decks into `decks/`; you study them in the browser. Tracks got/missed per card for the session and lets you re-drill just the misses.

## Run

```bash
node server.js
```

Open http://localhost:4173. No dependencies. `PORT=xxxx` to change port.

You can also paste or drag-drop JSON on the start page instead of using `decks/`.

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

Tracking is in-memory for the page session; reloading resets it.

## Deploy

Deployed on Vercel as static files plus one function (`api/decks.js`). On the deployed site, decks come from what's committed in `decks/` — commit and push new decks to publish them (paste/drop still works for ad-hoc JSON). Note the repo and site are public, so don't put private material in `decks/`.
