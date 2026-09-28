/**
 * Configuración general del negocio El Ferretero
 */
export const CONFIG = {
  nombre: "El Ferretero",
  slogan: "Tu ferretero de confianza",
  ciudad: "Río Cuarto, Córdoba",
  whatsapp: "5493580000000",          // Número internacional sin '+' ni espacios
  telefono: "0358 000-0000",
  direccion: "Estado N° 1871, Río Cuarto, Córdoba",
  mapa: "https://www.google.com/maps/search/?api=1&query=Estado+1871+Rio+Cuarto+Cordoba",
  
  // Tabla de horarios visuales
  horarios: [
    { dia: "Lunes a viernes", horas: "8:30 a 12:30 y 16:00 a 20:00" },
    { dia: "Sábados", horas: "8:30 a 13:00" },
    { dia: "Domingos", horas: "Cerrado" }
  ],

  // Definición estructurada para cálculo de "Abierto / Cerrado" en tiempo real
  // 0: Domingo, 1: Lunes, 2: Martes, 3: Miércoles, 4: Jueves, 5: Viernes, 6: Sábado
  horariosApertura: {
    1: [{ desde: 8.5, hasta: 12.5 }, { desde: 16.0, hasta: 20.0 }],
    2: [{ desde: 8.5, hasta: 12.5 }, { desde: 16.0, hasta: 20.0 }],
    3: [{ desde: 8.5, hasta: 12.5 }, { desde: 16.0, hasta: 20.0 }],
    4: [{ desde: 8.5, hasta: 12.5 }, { desde: 16.0, hasta: 20.0 }],
    5: [{ desde: 8.5, hasta: 12.5 }, { desde: 16.0, hasta: 20.0 }],
    6: [{ desde: 8.5, hasta: 13.0 }],
    0: [] // Cerrado
  },

  moneda: "$",
  waMensajeDefecto: "¡Hola! Quisiera hacer una consulta a El Ferretero."
};

/**
 * Función utilitaria para generar links de WhatsApp
 */
export const generarWaUrl = (mensaje = CONFIG.waMensajeDefecto) => {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensaje)}`;
};
