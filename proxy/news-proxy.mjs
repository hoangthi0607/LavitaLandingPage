// Read-only relay for the canhsatpccc.gov.vn news API, run on a machine in Việt Nam.
// The agency API only accepts Vietnamese IPs; the website (hosted abroad) calls this relay through a
// Cloudflare Tunnel instead. See docs/news-proxy.md.
//
//   node --env-file=proxy/.env proxy/news-proxy.mjs
//
// Only four GET endpoints with validated parameters are relayed, every call needs the shared key, and the
// server listens on 127.0.0.1 so it is reachable only through the tunnel running on the same machine.
import { createServer } from "node:http";
import { timingSafeEqual } from "node:crypto";

const UPSTREAM = "https://api.canhsatpccc.gov.vn";
const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || "127.0.0.1";
const KEY = process.env.PROXY_KEY || "";
const CACHE_MS = Number(process.env.CACHE_SECONDS || 600) * 1000;
const MAX_CACHE = 500;

if (KEY.length < 24) {
  console.error("PROXY_KEY must be set to a random secret of at least 24 characters (see proxy/.env.example).");
  process.exit(1);
}

const slug = value => /^[a-z0-9-]{1,160}$/.test(value);
const int = (min, max) => value => /^\d{1,6}$/.test(value) && Number(value) >= min && Number(value) <= max;
const lang = value => value === "vi";
// Allowed endpoints and the validator for each accepted query parameter.
const routes = {
  "/api/cms/News/GetListAllFE": { pageIndex: int(1, 100000), pageSize: int(1, 50), langId: lang, CategorySlugUrl: slug },
  "/api/cms/News/GetDetailFE": { newTransId: int(1, 99999999), cateSlug: slug, langId: lang },
  "/api/cms/LegalDocument/GetListAllFE": { pageIndex: int(1, 100000), pageSize: int(1, 50), langId: lang, CategorySlugUrl: slug },
  "/api/cms/LegalDocument/GetDetailFE": { legalDocTransId: int(1, 99999999), cateSlug: slug, langId: lang },
};

const cache = new Map();
const keyMatches = header => {
  const given = Buffer.from(String(header || ""));
  const expected = Buffer.from(KEY);
  return given.length === expected.length && timingSafeEqual(given, expected);
};
const send = (res, status, body, type = "application/json; charset=utf-8") => {
  res.writeHead(status, { "content-type": type, "cache-control": "no-store", "x-content-type-options": "nosniff" });
  res.end(body);
};

createServer(async (req, res) => {
  const started = Date.now();
  const url = new URL(req.url || "/", "http://localhost");
  const log = status => console.log(`${new Date().toISOString()} ${req.method} ${url.pathname} ${status} ${Date.now() - started}ms`);

  if (url.pathname === "/health") { send(res, 200, '{"ok":true}'); return log(200); }
  if (req.method !== "GET") { send(res, 405, '{"error":"method"}'); return log(405); }
  if (!keyMatches(req.headers["x-proxy-key"])) { send(res, 401, '{"error":"key"}'); return log(401); }
  const rules = routes[url.pathname];
  if (!rules) { send(res, 404, '{"error":"route"}'); return log(404); }

  const query = new URLSearchParams();
  for (const [name, value] of url.searchParams) {
    const valid = rules[name];
    if (!valid || !valid(value)) { send(res, 400, JSON.stringify({ error: "param", name })); return log(400); }
    query.set(name, value);
  }
  const target = `${UPSTREAM}${url.pathname}?${query}`;

  const hit = cache.get(target);
  if (hit && hit.expires > Date.now()) { send(res, 200, hit.body); return log("200 cache"); }

  try {
    const upstream = await fetch(target, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(8000) });
    const body = await upstream.text();
    if (!upstream.ok) { send(res, 502, JSON.stringify({ error: "upstream", status: upstream.status })); return log(502); }
    if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value);
    cache.set(target, { body, expires: Date.now() + CACHE_MS });
    send(res, 200, body);
    log(200);
  } catch (error) {
    send(res, 504, JSON.stringify({ error: "timeout" }));
    log(`504 ${error?.name ?? ""}`);
  }
}).listen(PORT, HOST, () => console.log(`news proxy listening on http://${HOST}:${PORT}`));
