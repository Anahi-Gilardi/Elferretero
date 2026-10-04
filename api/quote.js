/**
 * El Ferretero - REST API: Generador y Validador de Cotizaciones
 * Compatible con Vercel Serverless Functions y Node.js vanilla
 *
 * Reglas de validación:
 *  - Solo GET/POST (OPTIONS para CORS). Otros métodos -> 405.
 *  - Cuerpo máximo 64 KB. JSON inválido -> 400.
 *  - "items" debe ser un array (1..100). Cada ítem: cantidad entera 1..999.
 *  - Si el ítem trae "id" del catálogo, el precio y nombre salen del servidor
 *    (el cliente no puede manipularlos). Sin id, el precio debe ser >= 0.
 *  - Nunca lanza excepciones no controladas: cualquier error -> 500 JSON.
 */

const { PRODUCTOS } = require("./products");

const STORE_CONFIG = {
  nombre: "El Ferretero",
  direccion: "San Martín 2395, Río Cuarto, Córdoba",
  whatsapp: "5493584238976",
  telefono: "358 423-8976"
};

const LIMITS = {
  bodyBytes: 64 * 1024,
  items: 100,
  qtyMax: 999,
  precioMax: 50000000,
  texto: 300,
  nombreItem: 150
};

const CATALOGO = new Map(PRODUCTOS.map(p => [p.id, p]));

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/** Convierte cualquier valor a texto seguro y acotado (sin caracteres de control). */
function cleanText(value, max = LIMITS.texto) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const declared = Number(req.headers && req.headers["content-length"]);
    if (Number.isFinite(declared) && declared > LIMITS.bodyBytes) {
      req.resume(); // descartar el cuerpo sin guardarlo
      reject(new HttpError(413, "El pedido es demasiado grande"));
      return;
    }
    let raw = "";
    let size = 0;
    let tooLarge = false;
    req.on("data", chunk => {
      if (tooLarge) return; // seguir drenando sin acumular para poder responder 413
      size += chunk.length;
      if (size > LIMITS.bodyBytes) {
        tooLarge = true;
        raw = "";
        reject(new HttpError(413, "El pedido es demasiado grande"));
        return;
      }
      raw += chunk;
    });
    req.on("end", () => { if (!tooLarge) resolve(raw); });
    req.on("error", () => reject(new HttpError(400, "No se pudo leer el cuerpo de la petición")));
  });
}

async function parseBody(req) {
  // Vercel pre-parsea req.body; acceder a él con JSON inválido lanza una excepción.
  let preParsed;
  try {
    preParsed = req.body;
  } catch {
    throw new HttpError(400, "JSON inválido");
  }
  if (preParsed && typeof preParsed === "object") return preParsed;
  if (typeof preParsed === "string" && preParsed.length > 0) return parseRaw(preParsed, req);

  const raw = await readRawBody(req);
  return parseRaw(raw, req);
}

function parseRaw(raw, req) {
  if (!raw) return {};
  const type = String(req.headers["content-type"] || "");
  if (type.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(new URLSearchParams(raw).entries());
  }
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("not an object");
    }
    return parsed;
  } catch {
    throw new HttpError(400, "JSON inválido");
  }
}

function parseItems(rawItems) {
  let items = rawItems;
  if (typeof items === "string") {
    if (!items.trim()) return [];
    try {
      items = JSON.parse(items);
    } catch {
      throw new HttpError(400, "El campo 'items' debe ser un array JSON válido");
    }
  }
  if (items === undefined || items === null) return [];
  if (!Array.isArray(items)) {
    throw new HttpError(400, "El campo 'items' debe ser un array");
  }
  if (items.length > LIMITS.items) {
    throw new HttpError(400, `Máximo ${LIMITS.items} productos por cotización`);
  }

  return items.map((it, index) => {
    if (!it || typeof it !== "object" || Array.isArray(it)) {
      throw new HttpError(400, `Ítem #${index + 1} inválido`);
    }

    const qtyRaw = it.cantidad ?? it.qty ?? 1;
    const cantidad = Number(qtyRaw);
    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > LIMITS.qtyMax) {
      throw new HttpError(400, `Ítem #${index + 1}: la cantidad debe ser un entero entre 1 y ${LIMITS.qtyMax}`);
    }

    const id = cleanText(it.id, 80);
    const enCatalogo = id ? CATALOGO.get(id) : null;
    if (id && !enCatalogo) {
      throw new HttpError(400, `Ítem #${index + 1}: el producto '${id}' no existe en el catálogo`);
    }

    let precioUnitario;
    let nombre;
    if (enCatalogo) {
      // Fuente de verdad: precio y nombre del servidor
      precioUnitario = enCatalogo.precio;
      nombre = enCatalogo.nombre;
    } else {
      precioUnitario = Number(it.precio ?? 0);
      if (!Number.isFinite(precioUnitario) || precioUnitario < 0 || precioUnitario > LIMITS.precioMax) {
        throw new HttpError(400, `Ítem #${index + 1}: precio inválido`);
      }
      nombre = cleanText(it.nombre || it.name, LIMITS.nombreItem) || "Artículo sin especificar";
    }

    return {
      ...(enCatalogo ? { id } : {}),
      nombre,
      cantidad,
      precioUnitario,
      subtotal: cantidad * precioUnitario
    };
  });
}

function mapEntrega(entregaRaw) {
  const entrega = cleanText(entregaRaw, 80)
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (/nacional|pais|interior/.test(entrega)) return "Envío al interior / resto del país";
  if (/domicilio|rio cuarto|cuarto/.test(entrega)) return "Envío a domicilio en Río Cuarto";
  return "Retiro en local (San Martín 2395, Río Cuarto)";
}

function buildQuote(data) {
  const cliente = cleanText(data.cliente || data.nombre, 80) || "Cliente";
  const telefono = cleanText(data.telefono, 30).replace(/[^\d+\s()-]/g, "");
  const notas = cleanText(data.mensaje || data.notas, 500);
  const entregaTexto = mapEntrega(data.entrega || "retiro");
  const items = parseItems(data.items);

  if (items.length === 0 && !notas) {
    throw new HttpError(400, "La cotización debe incluir al menos un producto o una consulta");
  }

  const total = items.reduce((acc, it) => acc + it.subtotal, 0);

  const now = new Date();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const quoteId = `COT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${randomSuffix}`;

  let waMsg = `🛠️ *COTIZACIÓN EL FERRETERO*\n`;
  waMsg += `📋 *Ref:* ${quoteId}\n`;
  waMsg += `👤 *Cliente:* ${cliente}\n`;
  if (telefono) waMsg += `📱 *Tel:* ${telefono}\n`;
  waMsg += `📍 *Entrega:* ${entregaTexto}\n\n`;

  if (items.length > 0) {
    waMsg += `*Detalle de Productos:*\n`;
    items.forEach(it => {
      const pText = it.precioUnitario > 0 ? ` - $${it.precioUnitario.toLocaleString("es-AR")}` : "";
      waMsg += `• ${it.cantidad}x ${it.nombre}${pText}\n`;
    });
    if (total > 0) {
      waMsg += `\n💰 *Total Estimado:* $${total.toLocaleString("es-AR")}\n`;
    }
  }

  if (notas) waMsg += `\n💬 *Consulta/Notas:* ${notas}\n`;

  waMsg += `\n🏬 *El Ferretero* - San Martín 2395, Río Cuarto\n`;
  waMsg += `📞 Tel/WhatsApp: ${STORE_CONFIG.telefono}`;

  return {
    ok: true,
    cotizacionId: quoteId,
    fecha: now.toISOString(),
    cliente,
    telefono: telefono || null,
    modalidadEntrega: entregaTexto,
    total,
    items,
    whatsappUrl: `https://wa.me/${STORE_CONFIG.whatsapp}?text=${encodeURIComponent(waMsg)}`,
    mensajeFormateado: waMsg
  };
}

function send(res, status, payload) {
  res.statusCode = status;
  res.end(JSON.stringify(payload));
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST, OPTIONS");
    return send(res, 405, { ok: false, error: "Método no permitido" });
  }

  try {
    let data;
    if (req.method === "POST") {
      data = await parseBody(req);
    } else {
      const params = new URL(req.url, `http://${req.headers.host || "localhost"}`).searchParams;
      data = {
        cliente: params.get("cliente") || params.get("nombre"),
        telefono: params.get("telefono"),
        entrega: params.get("entrega"),
        mensaje: params.get("mensaje"),
        items: params.get("items")
      };
    }
    return send(res, 200, buildQuote(data));
  } catch (err) {
    if (err instanceof HttpError) {
      return send(res, err.status, { ok: false, error: err.message });
    }
    console.error("[api/quote] Error inesperado:", err);
    return send(res, 500, { ok: false, error: "Error interno al generar la cotización" });
  }
};
