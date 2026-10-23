// Lists JSON decks in ./decks. Used as a Vercel Function and by server.js locally.
const fs = require("fs");
const path = require("path");

const DECKS = path.join(__dirname, "..", "decks");

function listDecks() {
  if (!fs.existsSync(DECKS)) return [];
  return fs
    .readdirSync(DECKS)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({ file: f, mtime: fs.statSync(path.join(DECKS, f)).mtimeMs }))
    // Newest first locally; Vercel normalizes mtimes, so fall back to name
    .sort((a, b) => b.mtime - a.mtime || a.file.localeCompare(b.file));
}

module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(listDecks()));
};
module.exports.listDecks = listDecks;
