/**
 * Rubros y categorías oficiales de El Ferretero con sus iconos vectoriales
 */

export const CATEGORIAS = [
  {
    id: "mantenimiento-limpieza",
    nombre: "Mantenimiento y Limpieza del Hogar",
    nombreCorto: "Limpieza y Hogar",
    slug: "mantenimiento-limpieza.html",
    desc: "Hidrolavadoras, aspiradoras de taller, selladores, escaleras y desengrasantes.",
    icono: `<svg viewBox="0 0 24 24"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><circle cx="12" cy="14" r="2"/></svg>`,
    aliases: ["limpieza", "mantenimiento", "hogar", "plomeria", "pintureria"]
  },
  {
    id: "electricidad",
    nombre: "Electricidad",
    nombreCorto: "Electricidad",
    slug: "electricidad.html",
    desc: "Cables unipolares IRAM, tableros, térmicas, disyuntores y proyectores LED.",
    icono: `<svg viewBox="0 0 24 24"><path d="M9 2v6M15 2v6M7 8h10v4a5 5 0 0 1-10 0zM12 17v5"/></svg>`,
    aliases: ["electricidad", "iluminacion", "cables", "termicas", "electricas"]
  },
  {
    id: "herramienta-seguridad",
    nombre: "Herramienta Seguridad",
    nombreCorto: "Herramientas y Seguridad",
    slug: "herramienta-seguridad.html",
    desc: "Taladros, amoladoras, cascos homologados, antiparras y arneses de altura.",
    icono: `<svg viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/></svg>`,
    aliases: ["herramientas", "herramienta", "seguridad", "epp", "manuales", "construccion"]
  },
  {
    id: "mayorista-combos",
    nombre: "Mayorista Combos",
    nombreCorto: "Mayorista y Combos",
    slug: "mayorista-combos.html",
    desc: "Kits armados para electricistas, albañiles, pintores y packs cerrados con descuento.",
    icono: `<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
    aliases: ["mayorista", "combos", "packs", "obra", "kits"]
  }
];

export const CATEGORY_ALIAS_MAP = {
  "limpieza": "mantenimiento-limpieza",
  "mantenimiento": "mantenimiento-limpieza",
  "mantenimiento-limpieza": "mantenimiento-limpieza",
  "hogar": "mantenimiento-limpieza",
  "plomeria": "mantenimiento-limpieza",
  "pintureria": "mantenimiento-limpieza",
  "electricidad": "electricidad",
  "electricas": "electricidad",
  "electrico": "electricidad",
  "cables": "electricidad",
  "herramientas": "herramienta-seguridad",
  "herramienta": "herramienta-seguridad",
  "seguridad": "herramienta-seguridad",
  "herramienta-seguridad": "herramienta-seguridad",
  "manuales": "herramienta-seguridad",
  "construccion": "herramienta-seguridad",
  "epp": "herramienta-seguridad",
  "mayorista": "mayorista-combos",
  "combos": "mayorista-combos",
  "packs": "mayorista-combos",
  "mayorista-combos": "mayorista-combos"
};

export function normalizarCategoriaId(idOrAlias) {
  if (!idOrAlias) return 'todos';
  const clean = idOrAlias.toLowerCase().trim();
  return CATEGORY_ALIAS_MAP[clean] || clean;
}
