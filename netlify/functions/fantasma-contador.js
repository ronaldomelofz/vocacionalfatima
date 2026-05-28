const crypto = require("node:crypto");

const STORE_NAME = "fantasma-analytics";
const STATS_KEY = "stats-v1";
const MAX_PATH_LENGTH = 80;

function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function normalizePath(path) {
  if (typeof path !== "string") return "/";
  const trimmed = path.trim();
  if (!trimmed) return "/";
  const safe = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return safe.slice(0, MAX_PATH_LENGTH);
}

function getIp(event) {
  return (
    event.headers["x-nf-client-connection-ip"] ||
    event.headers["x-forwarded-for"] ||
    event.headers["client-ip"] ||
    "unknown"
  );
}

async function getBlobStore(event) {
  const { getStore, connectLambda } = await import("@netlify/blobs");
  // Necessário quando a função roda em Lambda compatibility mode.
  connectLambda(event);
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
    pages: {},
    knownVisitors: {},
    provider: "netlify-blobs",
  };

  if (!saved || typeof saved !== "object") return base;

  return {
    ...base,
    ...saved,
    pages: saved.pages && typeof saved.pages === "object" ? saved.pages : {},
    knownVisitors:
      saved.knownVisitors && typeof saved.knownVisitors === "object" ? saved.knownVisitors : {},
    provider: "netlify-blobs",
  };
}

function sanitizeStats(stats) {
  return {
    total: Number(stats.total) || 0,
    uniqueVisitors: Number(stats.uniqueVisitors) || 0,
    firstAccessAt: stats.firstAccessAt || null,
    lastAccessAt: stats.lastAccessAt || null,
    lastAccess: stats.lastAccess || null,
    pages: stats.pages || {},
    provider: stats.provider || "netlify-blobs",
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
    const store = await getBlobStore(event);
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
      pagePath = normalizePath(body.path || "/");
    } catch {
      pagePath = "/";
    }

    const now = new Date().toISOString();
    const userAgent = event.headers["user-agent"] || "unknown";
    const ip = getIp(event);
    const country = event.headers["x-country"] || "desconhecido";
    const region = event.headers["x-region"] || "";
    const city = event.headers["x-city"] || "";
    const visitorId = crypto.createHash("sha256").update(`${ip}|${userAgent}`).digest("hex").slice(0, 20);

    if (!stats.knownVisitors[visitorId]) {
      stats.uniqueVisitors += 1;
    }

    stats.total += 1;
    stats.firstAccessAt = stats.firstAccessAt || now;
    stats.lastAccessAt = now;
    stats.lastAccess = { at: now, path: pagePath, country, region, city };
    stats.knownVisitors[visitorId] = now;
    stats.pages[pagePath] = (Number(stats.pages[pagePath]) || 0) + 1;

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
