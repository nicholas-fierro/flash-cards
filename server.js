#!/usr/bin/env node
// Zero-dependency server: serves the app and lists JSON decks from ./decks
const http = require("http");
const fs = require("fs");
const path = require("path");
const { listDecks } = require("./api/decks");

const PORT = Number(process.env.PORT) || 4173;
const ROOT = __dirname;
const DECKS = path.join(ROOT, "decks");

fs.mkdirSync(DECKS, { recursive: true });

function send(res, code, body, type = "application/json") {
  res.writeHead(code, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(body);
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");

    if (url.pathname === "/api/decks") return send(res, 200, JSON.stringify(listDecks()));

    if (url.pathname.startsWith("/decks/")) {
      const name = path.basename(decodeURIComponent(url.pathname));
      const file = path.join(DECKS, name);
      if (!name.endsWith(".json") || !fs.existsSync(file)) return send(res, 404, '{"error":"not found"}');
      return send(res, 200, fs.readFileSync(file));
    }

    if (url.pathname === "/" || url.pathname === "/index.html") {
      return send(res, 200, fs.readFileSync(path.join(ROOT, "index.html")), "text/html; charset=utf-8");
    }

    send(res, 404, "not found", "text/plain");
  })
  .listen(PORT, () => console.log(`Flash cards: http://localhost:${PORT}  (decks dir: ${DECKS})`));
