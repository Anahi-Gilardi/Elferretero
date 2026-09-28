/**
 * Catálogo ampliado y categorizado para El Ferretero
 */

export const SVG_PLACEHOLDER = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <rect width="400" height="300" fill="#202020"/>
  <rect x="20" y="20" width="360" height="260" rx="8" fill="none" stroke="#333333" stroke-width="2" stroke-dasharray="8 8"/>
  <g fill="none" stroke="#F5A000" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity="0.9">
    <path d="M222 108a34 34 0 0 0-46 46l-58 58 22 22 58-58a34 34 0 0 0 46-46l-22 22-20-6-6-20z"/>
  </g>
  <text x="200" y="245" fill="#888888" font-family="sans-serif" font-weight="bold" font-size="14" text-anchor="middle" letter-spacing="1">EL FERRETERO · RÍO CUARTO</text>
</svg>
`);

export const CATEGORIAS_TIENDA = [
  { id: "mantenimiento-limpieza", nombre: "Mantenimiento y Limpieza del Hogar", slug: "mantenimiento-limpieza.html" },
  { id: "electricidad", nombre: "Electricidad", slug: "electricidad.html" },
  { id: "libros-ebook", nombre: "Libros / E-Book", slug: "libros-ebook.html" },
  { id: "herramienta-seguridad", nombre: "Herramienta Seguridad", slug: "herramienta-seguridad.html" },
  { id: "mayorista-combos", nombre: "Mayorista Combos", slug: "mayorista-combos.html" }
];

export const PRODUCTOS = [
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
    imagen: ""
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
    imagen: ""
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
    imagen: ""
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
    imagen: ""
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
    imagen: ""
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
    imagen: ""
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
    imagen: ""
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
    imagen: ""
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
    imagen: ""
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
    imagen: ""
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
    imagen: ""
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
    imagen: ""
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
    imagen: ""
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
    imagen: ""
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
    imagen: ""
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
    imagen: ""
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
    imagen: ""
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
    imagen: ""
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
    imagen: ""
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
    imagen: ""
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
    imagen: ""
  }
];
