const crypto = require("node:crypto");

const STORE_NAME = "fantasma-analytics";
const STATS_KEY = "stats-v1";
const RECENT_LIMIT = 25;
const VISITOR_TTL_DAYS = 180;

function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function getIp(event) {
  return (
    event.headers["x-nf-client-connection-ip"] ||
    event.headers["x-forwarded-for"] ||
    event.headers["client-ip"] ||
    "unknown"
  );
}

function buildVisitorId(ip, userAgent) {
  return crypto.createHash("sha256").update(`${ip}|${userAgent}`).digest("hex").slice(0, 20);
}

async function getBlobStore() {
  // Import dinâmico evita problemas de compatibilidade de módulo no runtime.
  const { getStore } = await import("@netlify/blobs");
  return getStore(STORE_NAME);
}

async function readStats(store) {
  const saved = await store.get(STATS_KEY, { type: "json" });
  const base = {
    total: 0,
    uniqueVisitors: 0,
    firstAccessAt: null,
    lastAccessAt: null,
    lastAccess: null,
    knownVisitors: {},
    recent: [],
    pages: {},
  };
  if (!saved || typeof saved !== "object") return base;
  return {
    ...base,
    ...saved,
    knownVisitors:
      saved.knownVisitors && typeof saved.knownVisitors === "object" ? saved.knownVisitors : {},
    recent: Array.isArray(saved.recent) ? saved.recent : [],
    pages: saved.pages && typeof saved.pages === "object" ? saved.pages : {},
  };
}

function sanitizeStats(stats) {
  return {
    total: stats.total || 0,
    uniqueVisitors: stats.uniqueVisitors || 0,
    firstAccessAt: stats.firstAccessAt || null,
    lastAccessAt: stats.lastAccessAt || null,
    lastAccess: stats.lastAccess || null,
    recent: Array.isArray(stats.recent) ? stats.recent.slice(0, RECENT_LIMIT) : [],
    pages: stats.pages || {},
  };
}

exports.handler = async function handler(event) {
  const method = event.httpMethod;
  if (method === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders(), body: "" };
  }
  if (method !== "GET" && method !== "POST") {
    return { statusCode: 405, headers: corsHeaders(), body: "Method Not Allowed" };
  }

  try {
    const store = await getBlobStore();
    const stats = await readStats(store);

    if (method === "GET") {
      return {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify(sanitizeStats(stats)),
      };
    }

    let pagePath = "/";
    try {
      const body = JSON.parse(event.body || "{}");
      if (typeof body.path === "string" && body.path.trim()) {
        pagePath = body.path.trim().slice(0, 120);
      }
    } catch {
      pagePath = "/";
    }

    const now = new Date().toISOString();
    const userAgent = event.headers["user-agent"] || "unknown";
    const ip = getIp(event);
    const country = event.headers["x-country"] || "desconhecido";
    const region = event.headers["x-region"] || "";
    const city = event.headers["x-city"] || "";
    const visitorId = buildVisitorId(ip, userAgent);
    const ttlCutoff = Date.now() - VISITOR_TTL_DAYS * 24 * 60 * 60 * 1000;

    for (const [id, lastSeen] of Object.entries(stats.knownVisitors)) {
      const lastSeenTime = new Date(lastSeen).getTime();
      if (!Number.isFinite(lastSeenTime) || lastSeenTime < ttlCutoff) {
        delete stats.knownVisitors[id];
      }
    }

    const isNewVisitor = !stats.knownVisitors[visitorId];
    if (isNewVisitor) {
      stats.uniqueVisitors += 1;
    }

    stats.total += 1;
    stats.firstAccessAt = stats.firstAccessAt || now;
    stats.lastAccessAt = now;
    stats.lastAccess = { at: now, country, region, city, path: pagePath };
    stats.knownVisitors[visitorId] = now;
    stats.pages[pagePath] = (Number(stats.pages[pagePath]) || 0) + 1;
    stats.recent = [
      { at: now, country, region, city, visitorId, path: pagePath },
      ...(Array.isArray(stats.recent) ? stats.recent : []),
    ].slice(0, RECENT_LIMIT);

    await store.setJSON(STATS_KEY, stats);

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(sanitizeStats(stats)),
    };
  } catch (error) {
    console.error("Erro no contador fantasma:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        error: "Falha ao registrar acesso.",
        detail: error?.message || "Erro interno",
      }),
    };
  }
};
