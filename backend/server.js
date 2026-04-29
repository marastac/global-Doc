// backend/server.js
// SIMULACIÓN EDUCATIVA — USO INTERNO (ENTORNO ACADÉMICO)

require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, "sim_data.json");

// ====== ENV ======
const NOWPAYMENTS_API_KEY = (process.env.NOWPAYMENTS_API_KEY || "").trim();
const NOWPAYMENTS_IPN_SECRET = (process.env.NOWPAYMENTS_IPN_SECRET || "").trim();

// PUBLIC_BASE_URL = URL del FRONTEND (Vercel). Se usa para success_url / cancel_url.
const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || "").trim(); // ej: https://tu-frontend.vercel.app

// Token “real” para endpoints de operador (bloqueo real)
const OPERATOR_ACCESS_TOKEN = (process.env.OPERATOR_ACCESS_TOKEN || "").trim();

// ====== Body parsing ======
// Para IPN necesitamos el body "crudo" para verificar firma
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf; // Buffer
    },
  })
);

/* ================== CORS (PRO) ==================
   - Permite localhost (dev) y tu Vercel (prod)
   - Permite previews *.vercel.app
================================================== */
function getOriginOnly(url) {
  try {
    return new URL(url).origin;
  } catch {
    return "";
  }
}

const allowedOrigins = new Set(["http://localhost:5173", "http://127.0.0.1:5173"]);

// Si PUBLIC_BASE_URL es tu frontend (Vercel), lo permitimos también.
const frontendOrigin = getOriginOnly(PUBLIC_BASE_URL);
if (frontendOrigin) allowedOrigins.add(frontendOrigin);

function isAllowedOrigin(origin) {
  if (!origin) return true; // curl/postman o requests sin Origin
  if (allowedOrigins.has(origin)) return true;
  // Permitir previews de Vercel
  if (/^https:\/\/.*\.vercel\.app$/i.test(origin)) return true;
  return false;
}

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && isAllowedOrigin(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
  }

  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, X-Nowpayments-Sig, X-Operator-Token");

  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

/* ================== HELPERS ================== */

function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  } catch {
    return [];
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function safeJson(res, status, obj) {
  res.status(status).json(obj);
}

// Base pública REAL del backend (Render) según el request
function getBackendBase(req) {
  const proto = (req.headers["x-forwarded-proto"] || req.protocol || "https")
    .toString()
    .split(",")[0]
    .trim();
  const host = (req.headers["x-forwarded-host"] || req.headers.host || "")
    .toString()
    .split(",")[0]
    .trim();
  return `${proto}://${host}`;
}

/* ================== CONFIG SIMULACIÓN ================== */

const SERVICES = ["visa", "green_card", "pasaporte_eu", "licencia", "passport_nationality"];
const RESULTS = ["success", "success", "success", "failed"]; // ~75% éxito

/* ================== NOWPAYMENTS HELPERS ================== */

function assertNowPaymentsConfigured() {
  if (!NOWPAYMENTS_API_KEY) throw new Error("NOWPAYMENTS_API_KEY no está configurada");
  if (!NOWPAYMENTS_IPN_SECRET) throw new Error("NOWPAYMENTS_IPN_SECRET no está configurada");
  if (!PUBLIC_BASE_URL) throw new Error("PUBLIC_BASE_URL (frontend) no está configurada");
}

function computeHmacHex(algo, secret, bodyBuffer) {
  return crypto.createHmac(algo, secret).update(bodyBuffer).digest("hex");
}

function verifyNowPaymentsSignature(req) {
  const sig = (req.headers["x-nowpayments-sig"] || "").toString().trim();
  if (!sig) return false;

  const raw = req.rawBody || Buffer.from("");
  const h512 = computeHmacHex("sha512", NOWPAYMENTS_IPN_SECRET, raw);
  const h256 = computeHmacHex("sha256", NOWPAYMENTS_IPN_SECRET, raw);

  const a = sig.toLowerCase();
  return a === h512.toLowerCase() || a === h256.toLowerCase();
}

async function nowpaymentsFetch(pathname, method, bodyObj) {
  const url = `https://api.nowpayments.io${pathname}`;

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": NOWPAYMENTS_API_KEY,
  };

  const r = await fetch(url, {
    method,
    headers,
    body: bodyObj ? JSON.stringify(bodyObj) : undefined,
  });

  const text = await r.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }

  if (!r.ok) {
    const msg = json?.message || json?.error || `NOWPayments error (${r.status})`;
    const detail = json?.errors || json;
    const e = new Error(msg);
    e.detail = detail;
    throw e;
  }

  return json;
}

/* ================== OPERATOR TOKEN (BLOQUEO REAL) ==================
   Usar: Header X-Operator-Token: <OPERATOR_ACCESS_TOKEN>
   Nota: Si no configuras OPERATOR_ACCESS_TOKEN, los endpoints /api/operator/ quedarán bloqueados (401).
================================================== */

function requireOperatorToken(req, res, next) {
  const required = OPERATOR_ACCESS_TOKEN;
  const provided = (req.headers["x-operator-token"] || "").toString().trim();

  if (!required) {
    return safeJson(res, 401, { error: "operator token not configured (set OPERATOR_ACCESS_TOKEN)" });
  }
  if (!provided || provided !== required) {
    return safeJson(res, 401, { error: "invalid operator token" });
  }
  next();
}

/* ================== ROOT (PANEL INFO) ================== */

app.get("/", (req, res) => {
  const backendBase = getBackendBase(req);
  const ipnUrl = `${backendBase}/api/nowpayments/ipn`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(`
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>DocSim Backend · Online</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;margin:0;background:#0b1220;color:#e5e7eb}
    .wrap{max-width:920px;margin:0 auto;padding:28px}
    .card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:16px;margin-top:14px}
    .h{font-size:22px;font-weight:900}
    .muted{opacity:.85}
    a{color:#7dd3fc;text-decoration:none}
    code{background:rgba(0,0,0,.25);padding:2px 6px;border-radius:8px}
    .grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
    .pill{display:inline-block;padding:6px 10px;border-radius:999px;background:rgba(56,189,248,.12);border:1px solid rgba(56,189,248,.25);font-weight:800}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="h">✅ Backend SIM Online</div>
    <div class="muted">Entorno académico · Integración NOWPayments (cripto) + IPN</div>

    <div class="card">
      <div class="pill">Estado</div>
      <p class="muted">
        API Key: <b>${NOWPAYMENTS_API_KEY ? "OK" : "FALTA"}</b> ·
        IPN Secret: <b>${NOWPAYMENTS_IPN_SECRET ? "OK" : "FALTA"}</b> ·
        Frontend (PUBLIC_BASE_URL): <b>${PUBLIC_BASE_URL ? "OK" : "FALTA"}</b> ·
        Operator Token: <b>${OPERATOR_ACCESS_TOKEN ? "OK" : "FALTA"}</b>
      </p>
      <p class="muted">IPN Webhook URL (BACKEND): <code>${ipnUrl}</code></p>
      <p class="muted">Front (success/cancel): <code>${PUBLIC_BASE_URL || "(configura PUBLIC_BASE_URL)"}</code></p>
    </div>

    <div class="card">
      <div class="pill">Endpoints (públicos)</div>
      <div class="grid">
        <div class="card"><b>Stats</b><div class="muted"><a href="/api/stats">/api/stats</a></div></div>
        <div class="card"><b>Status</b><div class="muted"><a href="/api/status">/api/status</a></div></div>
        <div class="card"><b>Logs</b><div class="muted"><a href="/api/logs">/api/logs</a></div></div>
      </div>
    </div>

    <div class="card">
      <div class="pill">Endpoints (OPERADOR · requieren X-Operator-Token)</div>
      <div class="grid">
        <div class="card"><b>Operator Logs</b><div class="muted"><code>/api/operator/logs</code></div></div>
        <div class="card"><b>Export JSON</b><div class="muted"><code>/api/operator/export/json</code></div></div>
        <div class="card"><b>Export CSV</b><div class="muted"><code>/api/operator/export/csv</code></div></div>
      </div>
    </div>

    <div class="card">
      <div class="pill">Demo Invoice</div>
      <p class="muted">POST <code>/api/nowpayments/invoice</code> → devuelve <code>invoice_url</code></p>
    </div>
  </div>
</body>
</html>
`);
});

/* ================== STATUS ================== */

app.get("/api/status", (req, res) => {
  const backendBase = getBackendBase(req);
  safeJson(res, 200, {
    ok: true,
    env: {
      NOWPAYMENTS_API_KEY: NOWPAYMENTS_API_KEY ? "OK" : "MISSING",
      NOWPAYMENTS_IPN_SECRET: NOWPAYMENTS_IPN_SECRET ? "OK" : "MISSING",
      PUBLIC_BASE_URL_frontend: PUBLIC_BASE_URL ? PUBLIC_BASE_URL : "MISSING",
      OPERATOR_ACCESS_TOKEN: OPERATOR_ACCESS_TOKEN ? "OK" : "MISSING",
      ipn_url_expected_backend: `${backendBase}/api/nowpayments/ipn`,
    },
  });
});

/* ================== ENDPOINTS BASE ================== */

// Registro real desde el frontend
app.post("/api/mock-payment", (req, res) => {
  const { name, emailHash, service } = req.body || {};

  if (!service || !SERVICES.includes(service)) {
    return res.status(400).json({ error: "invalid service" });
  }

  const simRecord = {
    simId: "SIM-" + Date.now(),
    service,
    emailHash: emailHash || null,
    nameSanitized: (name || "").replace(/[^a-zA-Z0-9 \-]/g, "").slice(0, 60),
    timestamp: new Date().toISOString(),
    result: randomFrom(RESULTS),
  };

  const db = readDB();
  db.push(simRecord);
  writeDB(db);

  res.json({ status: simRecord.result, simId: simRecord.simId });
});

// Logs públicos
app.get("/api/logs", (req, res) => {
  const db = readDB();
  res.json({ count: db.length, records: db });
});

// Stats públicos
app.get("/api/stats", (req, res) => {
  const db = readDB();

  const total = db.length;
  const byService = db.reduce((acc, r) => {
    acc[r.service] = (acc[r.service] || 0) + 1;
    return acc;
  }, {});

  const last10 = db.slice(-10).reverse();
  res.json({ total, byService, last10 });
});

/* ================== OPERADOR (BLOQUEO REAL) ================== */

// Logs protegidos (para demo de “privacidad/seguridad”)
app.get("/api/operator/logs", requireOperatorToken, (req, res) => {
  const db = readDB();
  res.json({ count: db.length, records: db });
});

// Export JSON protegido
app.get("/api/operator/export/json", requireOperatorToken, (req, res) => {
  const db = readDB();
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", 'attachment; filename="sim_data.json"');
  res.send(JSON.stringify(db, null, 2));
});

// Export CSV protegido
app.get("/api/operator/export/csv", requireOperatorToken, (req, res) => {
  const db = readDB();
  const header = "simId,service,result,timestamp\n";
  const rows = db
    .map((r) =>
      [r.simId, r.service, r.result, r.timestamp]
        .map((v) => `"${(v || "").toString().replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="sim_data.csv"');
  res.send(header + rows);
});

/* ================== NOWPAYMENTS ================== */

// Crear invoice
app.post("/api/nowpayments/invoice", async (req, res) => {
  try {
    assertNowPaymentsConfigured();

    const {
      order_id,
      price_amount,
      price_currency = "usd",
      order_description = "Document service (simulation)",
    } = req.body || {};

    if (!order_id || typeof order_id !== "string") {
      return safeJson(res, 400, { error: "order_id requerido" });
    }

    const amount = Number(price_amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return safeJson(res, 400, { error: "price_amount inválido" });
    }

    // success/cancel apuntan al FRONTEND (Vercel)
    const success_url = `${PUBLIC_BASE_URL}/api/nowpayments/ok?order_id=${encodeURIComponent(order_id)}`;
    const cancel_url = `${PUBLIC_BASE_URL}/api/nowpayments/cancel?order_id=${encodeURIComponent(order_id)}`;

    const payload = {
      price_amount: amount,
      price_currency,
      order_id,
      order_description,
      success_url,
      cancel_url,
    };

    const created = await nowpaymentsFetch("/v1/invoice", "POST", payload);

    // Guardar evidencia
    const db = readDB();
    db.push({
      simId: `SIM-INVOICE-${Date.now()}`,
      service: "invoice",
      emailHash: null,
      nameSanitized: "nowpayments-invoice",
      timestamp: new Date().toISOString(),
      result: "pending",
      invoice: created,
    });
    writeDB(db);

    return safeJson(res, 200, {
      invoice_id: created?.id || created?.invoice_id || null,
      invoice_url: created?.invoice_url || created?.invoiceUrl || created?.payment_url || null,
      raw: created,
    });
  } catch (e) {
    return safeJson(res, 500, { error: e?.message || "Error creando invoice", detail: e?.detail || null });
  }
});

// Consultar invoice
app.get("/api/nowpayments/invoice/:id", async (req, res) => {
  try {
    assertNowPaymentsConfigured();
    const id = String(req.params.id || "").trim();
    if (!id) return safeJson(res, 400, { error: "id requerido" });

    const data = await nowpaymentsFetch(`/v1/invoice/${encodeURIComponent(id)}`, "GET");
    return safeJson(res, 200, data);
  } catch (e) {
    return safeJson(res, 500, { error: e?.message || "Error consultando invoice", detail: e?.detail || null });
  }
});

// IPN webhook (apunta al BACKEND)
app.post("/api/nowpayments/ipn", (req, res) => {
  try {
    assertNowPaymentsConfigured();

    const okSig = verifyNowPaymentsSignature(req);
    if (!okSig) return safeJson(res, 401, { error: "invalid signature" });

    const ipn = req.body || {};
    const db = readDB();
    db.push({
      simId: `SIM-IPN-${Date.now()}`,
      service: "ipn",
      emailHash: null,
      nameSanitized: "nowpayments-ipn",
      timestamp: new Date().toISOString(),
      result: "success",
      ipn,
    });
    writeDB(db);

    return safeJson(res, 200, { ok: true });
  } catch (e) {
    return safeJson(res, 500, { error: e?.message || "ipn error" });
  }
});

// success / cancel (front redirige aquí como demo)
app.get("/api/nowpayments/ok", (req, res) => res.send("OK (simulation)"));
app.get("/api/nowpayments/cancel", (req, res) => res.send("CANCEL (simulation)"));

/* ================== GENERADOR AUTOMÁTICO ================== */

function generateAutoRecord() {
  const simRecord = {
    simId: "SIM-" + Date.now(),
    service: randomFrom(SERVICES),
    emailHash: null,
    nameSanitized: "auto-user",
    timestamp: new Date().toISOString(),
    result: randomFrom(RESULTS),
  };

  const db = readDB();
  db.push(simRecord);
  writeDB(db);
}

function scheduleAutoGeneration() {
  const delay = randomDelay(10000, 50000); // 10–50 segundos
  setTimeout(() => {
    generateAutoRecord();
    scheduleAutoGeneration();
  }, delay);
}

scheduleAutoGeneration();

/* ================== START SERVER ================== */

app.listen(PORT, () => {
  console.log(`Backend SIM corriendo en puerto ${PORT}`);
  console.log(`PUBLIC_BASE_URL (frontend): ${PUBLIC_BASE_URL || "(missing)"}`);
  console.log(`OPERATOR_ACCESS_TOKEN: ${OPERATOR_ACCESS_TOKEN ? "OK" : "(missing)"}`);
});