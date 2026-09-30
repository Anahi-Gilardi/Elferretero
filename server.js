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

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  let pathname = parsedUrl.pathname;

  // 1. Enrutamiento de la API REST
  if (pathname === "/api/products" || pathname === "/api/products.js") {
    return productsHandler(req, res);
  }

  if (pathname === "/api/quote" || pathname === "/api/quote.js") {
    return quoteHandler(req, res);
  }

  if (pathname === "/api/health" || pathname === "/api/health.js") {
    return healthHandler(req, res);
  }

  // 2. Enrutamiento de archivos estáticos
  if (pathname === "/") {
    pathname = "/index.html";
  }

  let filePath = path.join(ROOT_DIR, pathname);

  // Soporte para URLs limpias (ej: /productos -> /productos.html)
  if (!path.extname(filePath) && fs.existsSync(filePath + ".html")) {
    filePath = filePath + ".html";
  }

  // Prevenir path traversal
  if (!filePath.startsWith(ROOT_DIR)) {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.end("403 Acceso Denegado");
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // 404 No encontrado
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.end(`
        <!DOCTYPE html>
        <html lang="es">
        <head><meta charset="utf-8"><title>404 - No Encontrado | El Ferretero</title></head>
        <body style="font-family:sans-serif; text-align:center; padding:50px; background:#141414; color:#fff;">
          <h1 style="color:#F5A000;">404 - Página o recurso no encontrado</h1>
          <p>El archivo <code>${pathname}</code> no existe en el servidor.</p>
          <a href="/" style="color:#F5A000; text-decoration:underline;">Volver al inicio</a>
        </body>
        </html>
      `);
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.statusCode = 200;
    res.setHeader("Content-Type", contentType);

    // Headers de caché según el tipo de archivo
    if (ext === ".jpg" || ext === ".png" || ext === ".webp" || ext === ".svg") {
      res.setHeader("Cache-Control", "public, max-age=86400");
    } else if (ext === ".html" || pathname === "/sw.js") {
      res.setHeader("Cache-Control", "no-cache");
    }

    const stream = fs.createReadStream(filePath);
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
