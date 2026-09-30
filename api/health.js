/**
 * El Ferretero - REST API: Estado del Servidor y Sucursal en Vivo
 * Compatible con Vercel Serverless Functions y Node.js vanilla
 */

const STORE_CONFIG = {
  nombre: "El Ferretero",
  slogan: "Tu ferretero de confianza",
  direccion: "San Martín 2395, Río Cuarto, Córdoba",
  ciudad: "Río Cuarto, Córdoba, Argentina",
  telefono: "358 423-8976",
  whatsapp: "+54 9 358 423-8976",
  coordenadas: {
    lat: -33.125,
    lon: -64.349
  },
  horarios: [
    { dia: "Lunes a viernes", manana: "8:30 a 12:30", tarde: "16:00 a 20:00" },
    { dia: "Sábados", horario: "8:30 a 13:00" },
    { dia: "Domingos", horario: "Cerrado" }
  ]
};

function getArgentinaDateTime() {
  // Argentina está en UTC-3 sin horario de verano
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const argTime = new Date(utc - (3 * 3600000));
  return argTime;
}

function checkStoreOpen(dateArg) {
  const day = dateArg.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  const hours = dateArg.getHours() + (dateArg.getMinutes() / 60);

  if (day === 0) {
    return {
      abierto: false,
      mensaje: "Cerrado los domingos. Reabrimos el lunes a las 08:30."
    };
  }

  if (day >= 1 && day <= 5) {
    // Lunes a Viernes: 8:30 a 12:30 y 16:00 a 20:00
    if (hours >= 8.5 && hours < 12.5) {
      return {
        abierto: true,
        mensaje: "Abierto ahora por la mañana (cierra 12:30)."
      };
    }
    if (hours >= 12.5 && hours < 16.0) {
      return {
        abierto: false,
        mensaje: "En receso del mediodía. Reabrimos a las 16:00."
      };
    }
    if (hours >= 16.0 && hours < 20.0) {
      return {
        abierto: true,
        mensaje: "Abierto ahora por la tarde (cierra 20:00)."
      };
    }
    return {
      abierto: false,
      mensaje: hours < 8.5 ? "Cerrado por la noche. Abrimos a las 08:30." : "Cerrado por hoy. Reabrimos a las 08:30."
    };
  }

  if (day === 6) {
    // Sábado: 8:30 a 13:00
    if (hours >= 8.5 && hours < 13.0) {
      return {
        abierto: true,
        mensaje: "Abierto hoy sábado (cierra 13:00)."
      };
    }
    return {
      abierto: false,
      mensaje: "Cerrado. Reabrimos el lunes a las 08:30."
    };
  }

  return { abierto: false, mensaje: "Cerrado" };
}

module.exports = function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  const argDate = getArgentinaDateTime();
  const estadoSucursal = checkStoreOpen(argDate);

  res.statusCode = 200;
  return res.end(JSON.stringify({
    status: "healthy",
    version: "2.2.0",
    entorno: process.env.VERCEL ? "vercel-serverless" : "node-local",
    fechaServidorUTC: new Date().toISOString(),
    horaArgentina: argDate.toLocaleTimeString("es-AR", { hour12: false }),
    fechaArgentina: argDate.toLocaleDateString("es-AR"),
    sucursal: {
      abierto: estadoSucursal.abierto,
      estadoTexto: estadoSucursal.mensaje,
      tienda: STORE_CONFIG.nombre,
      direccion: STORE_CONFIG.direccion,
      ciudad: STORE_CONFIG.ciudad,
      telefono: STORE_CONFIG.telefono,
      whatsapp: STORE_CONFIG.whatsapp,
      horarios: STORE_CONFIG.horarios
    }
  }));
};
