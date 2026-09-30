/**
 * El Ferretero - REST API: Generador y Validador de Cotizaciones
 * Compatible con Vercel Serverless Functions y Node.js vanilla
 */

const STORE_CONFIG = {
  nombre: "El Ferretero",
  direccion: "San Martín 2395, Río Cuarto, Córdoba",
  whatsapp: "5493584238976",
  telefono: "358 423-8976"
};

function parseBody(req) {
  return new Promise((resolve) => {
    if (req.body && typeof req.body === "object") {
      return resolve(req.body);
    }

    let raw = "";
    req.on("data", chunk => { raw += chunk; });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (e) {
        // Fallback x-www-form-urlencoded
        const params = new URLSearchParams(raw);
        const obj = {};
        for (const [k, v] of params.entries()) {
          obj[k] = v;
        }
        resolve(obj);
      }
    });
    req.on("error", () => resolve({}));
  });
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  const urlObj = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  let data = {};

  if (req.method === "POST") {
    data = await parseBody(req);
  } else {
    // Para GET, leer de query params
    data = {
      cliente: urlObj.searchParams.get("cliente") || urlObj.searchParams.get("nombre") || "Cliente",
      telefono: urlObj.searchParams.get("telefono") || "",
      entrega: urlObj.searchParams.get("entrega") || "retiro",
      mensaje: urlObj.searchParams.get("mensaje") || "",
      items: urlObj.searchParams.get("items") || ""
    };
  }

  const cliente = (data.cliente || data.nombre || "Cliente").trim();
  const telefono = (data.telefono || "").trim();
  const entrega = (data.entrega || "retiro").toLowerCase();
  const notas = (data.mensaje || data.notas || "").trim();

  // Parsear items si vienen en string JSON o array
  let items = [];
  if (Array.isArray(data.items)) {
    items = data.items;
  } else if (typeof data.items === "string" && data.items.length > 0) {
    try {
      items = JSON.parse(data.items);
    } catch {
      items = [{ nombre: data.items, cantidad: 1, precio: 0 }];
    }
  }

  // Generar ID de cotización con timestamp
  const now = new Date();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const quoteId = `COT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${randomSuffix}`;

  // Calcular total
  let total = 0;
  const itemsFormateados = items.map(it => {
    const qty = parseInt(it.cantidad || it.qty || 1, 10);
    const precio = parseFloat(it.precio || 0);
    const subtotal = qty * precio;
    total += subtotal;
    return {
      nombre: it.nombre || it.name || "Artículo sin especificar",
      cantidad: qty,
      precioUnitario: precio,
      subtotal
    };
  });

  // Mapear método de entrega
  let entregaTexto = "Retiro en local (San Martín 2395, Río Cuarto)";
  if (entrega.includes("local") || entrega.includes("rio")) {
    entregaTexto = "Envío a domicilio en Río Cuarto";
  } else if (entrega.includes("nacional") || entrega.includes("pais")) {
    entregaTexto = "Envío al interior / resto del país";
  }

  // Construir mensaje para WhatsApp
  let waMsg = `🛠️ *COTIZACIÓN EL FERRETERO*\n`;
  waMsg += `📋 *Ref:* ${quoteId}\n`;
  waMsg += `👤 *Cliente:* ${cliente}\n`;
  if (telefono) waMsg += `📱 *Tel:* ${telefono}\n`;
  waMsg += `📍 *Entrega:* ${entregaTexto}\n\n`;

  if (itemsFormateados.length > 0) {
    waMsg += `*Detalle de Productos:*\n`;
    itemsFormateados.forEach(it => {
      const pText = it.precioUnitario > 0 ? ` - $${it.precioUnitario.toLocaleString("es-AR")}` : "";
      waMsg += `• ${it.cantidad}x ${it.nombre}${pText}\n`;
    });
    if (total > 0) {
      waMsg += `\n💰 *Total Estimado:* $${total.toLocaleString("es-AR")}\n`;
    }
  }

  if (notas) {
    waMsg += `\n💬 *Consulta/Notas:* ${notas}\n`;
  }

  waMsg += `\n🏬 *El Ferretero* - San Martín 2395, Río Cuarto\n`;
  waMsg += `📞 Tel/WhatsApp: ${STORE_CONFIG.telefono}`;

  const whatsappUrl = `https://wa.me/${STORE_CONFIG.whatsapp}?text=${encodeURIComponent(waMsg)}`;

  res.statusCode = 200;
  return res.end(JSON.stringify({
    ok: true,
    cotizacionId: quoteId,
    fecha: now.toISOString(),
    cliente,
    telefono: telefono || null,
    modalidadEntrega: entregaTexto,
    total,
    items: itemsFormateados,
    whatsappUrl,
    mensajeFormateado: waMsg
  }));
};
