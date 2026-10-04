/**
 * El Ferretero - Servidor Local HTTP y API REST (Node.js sin dependencias)
 * Permite ejecutar la aplicación completa localmente con frontend y backend.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8000;
const ROOT_DIR = __dirname;

// Importar controladores de la API
const productsHandler = require("./api/products");
const quoteHandler = require("./api/quote");
const healthHandler = require("./api/health");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf"
};

// Archivos/carpetas internos que nunca deben servirse
const BLOCKED_SEGMENTS = new Set(["node_modules", "scripts", "api"]);
const BLOCKED_FILES = new Set(["server.js", "package.json", "package-lock.json", "test_suite.py", "abrir-web.bat", "readme.md"]);

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function isBlocked(relativePath) {
  const segments = relativePath.split(/[\\/]+/).filter(Boolean);
  if (segments.some(s => s.startsWith("."))) return true; // .git, .vercel, .env...
  if (segments.length > 1 && BLOCKED_SEGMENTS.has(segments[0].toLowerCase())) return true;
  return BLOCKED_FILES.has((segments[segments.length - 1] || "").toLowerCase());
}

function sendNotFound(res, pathname) {
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(`<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><title>404 - No Encontrado | El Ferretero</title></head>
<body style="font-family:sans-serif; text-align:center; padding:50px; background:#141414; color:#fff;">
  <h1 style="color:#E07A2B;">404 - Página o recurso no encontrado</h1>
  <p>El archivo <code>${escapeHtml(pathname)}</code> no existe en el servidor.</p>
  <a href="/" style="color:#E07A2B; text-decoration:underline;">Volver al inicio</a>
</body>
</html>`);
}

async function runApi(handler, req, res) {
  try {
    await handler(req, res);
  } catch (err) {
    console.error("[server] Error en API:", err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
    }
    res.end(JSON.stringify({ ok: false, error: "Error interno del servidor" }));
  }
}

const server = http.createServer(async (req, res) => {
  let parsedUrl;
  try {
    parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  } catch {
    res.statusCode = 400;
    return res.end("400 Bad Request");
  }
  let pathname;
  try {
    pathname = decodeURIComponent(parsedUrl.pathname);
  } catch {
    res.statusCode = 400;
    return res.end("400 Bad Request");
  }

  // 1. Enrutamiento de la API REST
  if (pathname === "/api/products" || pathname === "/api/products.js") {
    return runApi(productsHandler, req, res);
  }

  if (pathname === "/api/quote" || pathname === "/api/quote.js") {
    return runApi(quoteHandler, req, res);
  }

  if (pathname === "/api/health" || pathname === "/api/health.js") {
    return runApi(healthHandler, req, res);
  }

  // 2. Enrutamiento de archivos estáticos
  if (pathname === "/") {
    pathname = "/index.html";
  }

  let filePath = path.resolve(ROOT_DIR, "." + pathname);

  // Prevenir path traversal (comparación con separador para evitar prefijos falsos)
  if (filePath !== ROOT_DIR && !filePath.startsWith(ROOT_DIR + path.sep)) {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.end("403 Acceso Denegado");
  }

  // Soporte para URLs limpias (ej: /productos -> /productos.html)
  if (!path.extname(filePath) && fs.existsSync(filePath + ".html")) {
    filePath = filePath + ".html";
  }

  if (isBlocked(path.relative(ROOT_DIR, filePath))) {
    return sendNotFound(res, pathname);
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return sendNotFound(res, pathname);
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.statusCode = 200;
    res.setHeader("Content-Type", contentType);
    res.setHeader("X-Content-Type-Options", "nosniff");

    // Headers de caché según el tipo de archivo
    if (ext === ".jpg" || ext === ".png" || ext === ".webp" || ext === ".svg") {
      res.setHeader("Cache-Control", "public, max-age=86400");
    } else if (ext === ".html" || pathname === "/sw.js") {
      res.setHeader("Cache-Control", "no-cache");
    }

    const stream = fs.createReadStream(filePath);
    stream.on("error", () => {
      if (!res.headersSent) res.statusCode = 500;
      res.end();
    });
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log("==================================================");
  console.log("🛠️  EL FERRETERO - Servidor Local Fullstack Node.js");
  console.log("📍  San Martín 2395, Río Cuarto, Córdoba");
  console.log("📞  Tel/WhatsApp: +54 9 358 423-8976");
  console.log("--------------------------------------------------");
  console.log(`🌐  Servidor web: http://localhost:${PORT}`);
  console.log(`📦  API Productos: http://localhost:${PORT}/api/products`);
  console.log(`🏥  API Salud:     http://localhost:${PORT}/api/health`);
  console.log(`📝  API Cotizador: http://localhost:${PORT}/api/quote`);
  console.log("==================================================");
});
