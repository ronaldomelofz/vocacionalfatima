const crypto = require("node:crypto");
const { getStore } = require("@netlify/blobs");

const STORE_NAME = "fantasma-analytics";
const STATS_KEY = "stats-v1";
const RECENT_LIMIT = 25;

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

async function readStats(store) {
  const saved = await store.get(STATS_KEY, { type: "json" });
  return (
    saved || {
      total: 0,
      uniqueVisitors: 0,
      firstAccessAt: null,
      lastAccessAt: null,
      lastAccess: null,
      knownVisitors: {},
      recent: [],
    }
  );
}

function sanitizeStats(stats) {
  return {
    total: stats.total || 0,
    uniqueVisitors: stats.uniqueVisitors || 0,
    firstAccessAt: stats.firstAccessAt || null,
    lastAccessAt: stats.lastAccessAt || null,
    lastAccess: stats.lastAccess || null,
    recent: Array.isArray(stats.recent) ? stats.recent.slice(0, RECENT_LIMIT) : [],
  };
}

exports.handler = async function handler(event) {
  const method = event.httpMethod;
  if (method !== "GET" && method !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const store = getStore(STORE_NAME);
    const stats = await readStats(store);

    if (method === "GET") {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        body: JSON.stringify(sanitizeStats(stats)),
      };
    }

    const now = new Date().toISOString();
    const userAgent = event.headers["user-agent"] || "unknown";
    const ip = getIp(event);
    const country = event.headers["x-country"] || "desconhecido";
    const region = event.headers["x-region"] || "";
    const city = event.headers["x-city"] || "";
    const visitorId = buildVisitorId(ip, userAgent);

    const isNewVisitor = !stats.knownVisitors[visitorId];
    if (isNewVisitor) {
      stats.uniqueVisitors += 1;
    }

    stats.total += 1;
    stats.firstAccessAt = stats.firstAccessAt || now;
    stats.lastAccessAt = now;
    stats.lastAccess = { at: now, country, region, city };
    stats.knownVisitors[visitorId] = now;
    stats.recent = [
      { at: now, country, region, city, visitorId },
      ...(Array.isArray(stats.recent) ? stats.recent : []),
    ].slice(0, RECENT_LIMIT);

    await store.setJSON(STATS_KEY, stats);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      body: JSON.stringify(sanitizeStats(stats)),
    };
  } catch (error) {
    console.error("Erro no contador fantasma:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Falha ao registrar acesso." }),
    };
  }
};
