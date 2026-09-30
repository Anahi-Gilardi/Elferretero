/**
 * El Ferretero - REST API: Catálogo de Productos
 * Compatible con Vercel Serverless Functions y Node.js vanilla
 */

const PRODUCTOS = [
  /* --- MANTENIMIENTO Y LIMPIEZA DEL HOGAR --- */
  {
    id: "hidrolavadora-1400w",
    nombre: "Hidrolavadora Alta Presión 1400W 110 Bar",
    categoriaId: "mantenimiento-limpieza",
    categoriaNombre: "Mantenimiento y Limpieza",
    desc: "Bomba de aluminio de alto rendimiento con manguera de 5m, lanza con boquilla regulable y aplicador de espuma.",
    precio: 92500,
    precioFormateado: "$92.500",
    antes: "$108.900",
    oferta: "-15%",
    imagen: "img/productos/hidrolavadora-1400w.jpg",
    destacado: true,
    stock: true
  },
  {
    id: "aspiradora-20l",
    nombre: "Aspiradora Polvo y Agua 20L 1400W",
    categoriaId: "mantenimiento-limpieza",
    categoriaNombre: "Mantenimiento y Limpieza",
    desc: "Tambor de acero inoxidable, función soplador, filtro lavable HEPA y kit de boquillas para piso y rincones.",
    precio: 84900,
    precioFormateado: "$84.900",
    antes: "$99.000",
    oferta: "-14%",
    imagen: "img/productos/aspiradora-20l.jpg",
    destacado: false,
    stock: true
  },
  {
    id: "mopa-giratoria-360",
    nombre: "Set Mopa Giratoria 360° Acero Inoxidable",
    categoriaId: "mantenimiento-limpieza",
    categoriaNombre: "Mantenimiento y Limpieza",
    desc: "Balde con centrífuga escurridora reforzada de acero y 2 paños de microfibra de alta absorción.",
    precio: 21400,
    precioFormateado: "$21.400",
    antes: "$26.000",
    oferta: "-18%",
    imagen: "img/productos/mopa-giratoria-360.jpg",
    destacado: false,
    stock: true
  },
  {
    id: "escalera-aluminio-5",
    nombre: "Escalera Tijera de Aluminio 5 Escalones",
    categoriaId: "mantenimiento-limpieza",
    categoriaNombre: "Mantenimiento y Limpieza",
    desc: "Perfil reforzado antideslizante con capacidad de carga hasta 150kg. Liviana y plegable.",
    precio: 48600,
    precioFormateado: "$48.600",
    antes: "$56.000",
    oferta: "Oferta",
    imagen: "img/productos/escalera-aluminio-5.jpg",
    destacado: false,
    stock: true
  },

  /* --- ELECTRICIDAD --- */
  {
    id: "rollo-cable-2-5",
    nombre: "Rollo Cable Unipolar 2.5mm IRAM 100m",
    categoriaId: "electricidad",
    categoriaNombre: "Electricidad",
    desc: "Cobre puro 100% antihidrocarburo y no propagante de llama. Aprobado según normativa IRAM.",
    precio: 38500,
    precioFormateado: "$38.500",
    antes: "$45.000",
    oferta: "-15%",
    imagen: "img/productos/rollo-cable-2-5.jpg",
    destacado: true,
    stock: true
  },
  {
    id: "tablero-termicas",
    nombre: "Kit Tablero Térmicas y Disyuntor Bipolar",
    categoriaId: "electricidad",
    categoriaNombre: "Electricidad",
    desc: "Caja estanca para 8 bocas + Disyuntor bipolar 25A + 2 Térmicas 16A y 20A normalizadas Sica.",
    precio: 45200,
    precioFormateado: "$45.200",
    antes: "$52.000",
    oferta: "Pack",
    imagen: "img/productos/tablero-termicas.jpg",
    destacado: false,
    stock: true
  },
  {
    id: "tester-multimetro",
    nombre: "Multímetro Tester Digital Profesional",
    categoriaId: "electricidad",
    categoriaNombre: "Electricidad",
    desc: "Medición precisa de voltaje AC/DC, amperaje, resistencia y continuidad sonora. Puntas y batería incluidas.",
    precio: 16800,
    precioFormateado: "$16.800",
    antes: "$21.000",
    oferta: "-20%",
    imagen: "img/productos/tester-multimetro.jpg",
    destacado: false,
    stock: true
  },
  {
    id: "reflector-led-50w",
    nombre: "Reflector Proyector LED 50W Exterior IP65",
    categoriaId: "electricidad",
    categoriaNombre: "Electricidad",
    desc: "Luz blanca fría de alta potencia 4500 lúmenes, resistente a lluvia y polvo para frentes o talleres.",
    precio: 19500,
    precioFormateado: "$19.500",
    antes: "$24.000",
    oferta: "Destacado",
    imagen: "img/productos/reflector-led-50w.jpg",
    destacado: false,
    stock: true
  },

  /* --- LIBROS / E-BOOK --- */
  {
    id: "ebook-electricidad",
    nombre: "E-Book: Manual de Instalaciones Eléctricas",
    categoriaId: "libros-ebook",
    categoriaNombre: "Libros / E-Book",
    desc: "Guía completa digital con diagramas de circuitos, cálculo de conductores y normativas de seguridad AEA.",
    precio: 6900,
    precioFormateado: "$6.900",
    antes: "$9.500",
    oferta: "-27%",
    imagen: "img/productos/ebook-electricidad.jpg",
    destacado: true,
    stock: true
  },
  {
    id: "ebook-plomeria",
    nombre: "E-Book: Guía Práctica de Plomería y Gas",
    categoriaId: "libros-ebook",
    categoriaNombre: "Libros / E-Book",
    desc: "Técnicas de termofusión, desagües cloacales, bombas de agua y resolución de pérdidas comunes.",
    precio: 5800,
    precioFormateado: "$5.800",
    antes: "$8.000",
    oferta: "-27%",
    imagen: "img/productos/ebook-plomeria.jpg",
    destacado: false,
    stock: true
  },
  {
    id: "ebook-herreria",
    nombre: "E-Book: Técnicas de Soldadura y Herrería",
    categoriaId: "libros-ebook",
    categoriaNombre: "Libros / E-Book",
    desc: "Soldadura con electrodo revestido y MIG/MAG, escuadras, cortes de perfiles y proyectos paso a paso.",
    precio: 7500,
    precioFormateado: "$7.500",
    antes: "$10.000",
    oferta: "-25%",
    imagen: "img/productos/ebook-herreria.jpg",
    destacado: false,
    stock: true
  },
  {
    id: "ebook-durlock",
    nombre: "E-Book: Guía de Construcción en Seco",
    categoriaId: "libros-ebook",
    categoriaNombre: "Libros / E-Book",
    desc: "Manual paso a paso para tabiques, cielorrasos suspendidos, masillado y cálculo de perfilería.",
    precio: 8200,
    precioFormateado: "$8.200",
    antes: "$11.000",
    oferta: "-25%",
    imagen: "img/productos/ebook-durlock.jpg",
    destacado: false,
    stock: true
  },

  /* --- HERRAMIENTA SEGURIDAD --- */
  {
    id: "taladro-650w",
    nombre: "Taladro Percutor 650W + Maletín",
    categoriaId: "herramienta-seguridad",
    categoriaNombre: "Herramienta Seguridad",
    desc: "Mandril de 13mm, velocidad variable y reversible. Potente motor con selector de percusión y accesorios.",
    precio: 64900,
    precioFormateado: "$64.900",
    antes: "$81.100",
    oferta: "-20%",
    imagen: "img/productos/taladro-650w.jpg",
    destacado: true,
    stock: true
  },
  {
    id: "amoladora-4-1-2",
    nombre: "Amoladora Angular 4 1/2\" 850W",
    categoriaId: "herramienta-seguridad",
    categoriaNombre: "Herramienta Seguridad",
    desc: "Diseño ergonómico, traba de eje y guarda de protección ajustable contra chispas. 11000 RPM.",
    precio: 58900,
    precioFormateado: "$58.900",
    antes: "$69.000",
    oferta: "Oferta",
    imagen: "img/productos/amoladora-4-1-2.jpg",
    destacado: false,
    stock: true
  },
  {
    id: "casco-seguridad",
    nombre: "Casco de Seguridad Industrial Homologado",
    categoriaId: "herramienta-seguridad",
    categoriaNombre: "Herramienta Seguridad",
    desc: "Casco de polietileno de alta densidad con arnés a cremallera regulable y banda antisudor.",
    precio: 8500,
    precioFormateado: "$8.500",
    antes: "$11.000",
    oferta: "-22%",
    imagen: "img/productos/casco-seguridad.jpg",
    destacado: false,
    stock: true
  },
  {
    id: "antiparras-seguridad",
    nombre: "Antiparras de Seguridad Anti-Empaño UV400",
    categoriaId: "herramienta-seguridad",
    categoriaNombre: "Herramienta Seguridad",
    desc: "Visor envolvente de policarbonato con patillas ajustables y máxima resistencia a impactos.",
    precio: 4200,
    precioFormateado: "$4.200",
    antes: "$5.500",
    oferta: "-23%",
    imagen: "img/productos/antiparras-seguridad.jpg",
    destacado: false,
    stock: true
  },
  {
    id: "arnes-seguridad",
    nombre: "Arnés de Seguridad Integral Anticaídas",
    categoriaId: "herramienta-seguridad",
    categoriaNombre: "Herramienta Seguridad",
    desc: "Con toma dorsal y frontal para trabajos en altura. Cintas de poliéster de alta tenacidad homologadas.",
    precio: 34500,
    precioFormateado: "$34.500",
    antes: "$42.000",
    oferta: "Seguridad",
    imagen: "img/productos/arnes-seguridad.jpg",
    destacado: false,
    stock: true
  },

  /* --- MAYORISTA COMBOS --- */
  {
    id: "combo-duo-power",
    nombre: "Combo Dúo Power: Taladro + Amoladora",
    categoriaId: "mayorista-combos",
    categoriaNombre: "Mayorista Combos",
    desc: "Kit profesional completo: Taladro percutor 650W + Amoladora 850W con maletín y 10 discos de corte de regalo.",
    precio: 109900,
    precioFormateado: "$109.900",
    antes: "$135.000",
    oferta: "-19%",
    imagen: "img/productos/combo-duo-power.jpg",
    destacado: true,
    stock: true
  },
  {
    id: "combo-albanileria",
    nombre: "Combo Obra: Carretilla + Cuchara + Nivel + 3 Baldes",
    categoriaId: "mayorista-combos",
    categoriaNombre: "Mayorista Combos",
    desc: "Kit mayorista para construcción: Carretilla chapa reforzada 80L + cuchara forjada + nivel de mano + baldes de albañil.",
    precio: 78000,
    precioFormateado: "$78.000",
    antes: "$94.000",
    oferta: "Pack Obra",
    imagen: "img/productos/combo-albanileria.jpg",
    destacado: false,
    stock: true
  },
  {
    id: "pack-discos-corte",
    nombre: "Pack Mayorista Discos de Corte 115mm x 50u",
    categoriaId: "mayorista-combos",
    categoriaNombre: "Mayorista Combos",
    desc: "Caja cerrada de 50 discos de corte ultrafinos 1mm para amoladora angular de 4 1/2\". Máxima durabilidad.",
    precio: 32000,
    precioFormateado: "$32.000",
    antes: "$41.000",
    oferta: "Mayorista",
    imagen: "img/productos/pack-discos-corte.jpg",
    destacado: false,
    stock: true
  },
  {
    id: "combo-electricista",
    nombre: "Combo Electricista Pro: Pasacable + Pinza + Pelacables",
    categoriaId: "mayorista-combos",
    categoriaNombre: "Mayorista Combos",
    desc: "Cinta pasacable de acero 20m + Pinza universal aislada 1000V + Pelacables automático + Buscapolo digital.",
    precio: 49900,
    precioFormateado: "$49.900",
    antes: "$62.000",
    oferta: "-20%",
    imagen: "img/productos/combo-electricista.jpg",
    destacado: false,
    stock: true
  }
];

module.exports = function handler(req, res) {
  // Configuración de encabezados HTTP & Edge Caching
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  // Parsear URL y parámetros de consulta
  const urlObj = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const q = (urlObj.searchParams.get("q") || "").trim().toLowerCase();
  const category = (urlObj.searchParams.get("category") || urlObj.searchParams.get("categoria") || "").trim().toLowerCase();
  const id = (urlObj.searchParams.get("id") || "").trim().toLowerCase();

  // Búsqueda por ID directo
  if (id) {
    const item = PRODUCTOS.find(p => p.id.toLowerCase() === id);
    if (!item) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ ok: false, error: "Producto no encontrado", id }));
    }
    res.statusCode = 200;
    return res.end(JSON.stringify({ ok: true, product: item }));
  }

  // Filtrado por categoría y/o texto
  let results = PRODUCTOS;

  if (category) {
    results = results.filter(p => 
      p.categoriaId.toLowerCase() === category || 
      p.categoriaNombre.toLowerCase().includes(category)
    );
  }

  if (q) {
    results = results.filter(p => 
      p.nombre.toLowerCase().includes(q) || 
      p.desc.toLowerCase().includes(q) ||
      p.categoriaNombre.toLowerCase().includes(q)
    );
  }

  res.statusCode = 200;
  return res.end(JSON.stringify({
    ok: true,
    total: results.length,
    catalogoTotal: PRODUCTOS.length,
    filtros: {
      query: q || null,
      categoria: category || null
    },
    productos: results
  }));
};
