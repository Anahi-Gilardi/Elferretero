/**
 * Catálogo ampliado y categorizado para El Ferretero (46 productos)
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
  { id: "herramienta-seguridad", nombre: "Herramienta Seguridad", slug: "herramienta-seguridad.html" },
  { id: "mayorista-combos", nombre: "Mayorista Combos", slug: "mayorista-combos.html" }
];

export const PRODUCTOS = [
  /* --- MANTENIMIENTO Y LIMPIEZA DEL HOGAR --- */
  {
    id: "hidrolavadora-1400w",
    nombre: "Hidrolavadora Alta Presi\u00f3n 1400W 110 Bar",
    categoriaId: "mantenimiento-limpieza",
    categoriaNombre: "Mantenimiento y Limpieza",
    desc: "Bomba de aluminio de alto rendimiento con manguera de 5m, lanza con boquilla regulable y aplicador de espuma.",
    precio: 92500,
    precioFormateado: "$92.500",
    antes: "$108.900",
    oferta: "-15%",
    imagen: "img/productos/hidrolavadora-1400w.jpg"
  },
  {
    id: "aspiradora-20l",
    nombre: "Aspiradora Polvo y Agua 20L 1400W",
    categoriaId: "mantenimiento-limpieza",
    categoriaNombre: "Mantenimiento y Limpieza",
    desc: "Tambor de acero inoxidable, funci\u00f3n soplador, filtro lavable HEPA y kit de boquillas para piso y rincones.",
    precio: 84900,
    precioFormateado: "$84.900",
    antes: "$99.000",
    oferta: "-14%",
    imagen: "img/productos/aspiradora-20l.jpg"
  },
  {
    id: "mopa-giratoria-360",
    nombre: "Set Mopa Giratoria 360\u00b0 Acero Inoxidable",
    categoriaId: "mantenimiento-limpieza",
    categoriaNombre: "Mantenimiento y Limpieza",
    desc: "Balde con centr\u00edfuga escurridora reforzada de acero y 2 pa\u00f1os de microfibra de alta absorci\u00f3n.",
    precio: 21400,
    precioFormateado: "$21.400",
    antes: "$26.000",
    oferta: "-18%",
    imagen: "img/productos/mopa-giratoria-360.jpg"
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
    imagen: "img/productos/escalera-aluminio-5.jpg"
  },
  {
    id: "cinta-teflon-3-4",
    nombre: "Cinta de Tefl\u00f3n Alta Densidad 3/4\" x 20m",
    categoriaId: "mantenimiento-limpieza",
    categoriaNombre: "Mantenimiento y Limpieza",
    desc: "Cinta selladora de PTFE para roscas y ca\u00f1os de agua y gas. Sella sin endurecer y previene fugas.",
    precio: 2400,
    precioFormateado: "$2.400",
    antes: "$3.100",
    oferta: "-22%",
    imagen: "img/productos/cinta-teflon-3-4.jpg"
  },
  {
    id: "flexible-mallado-1-2",
    nombre: "Flexible Mallado Acero Inoxidable 1/2\" x 40cm",
    categoriaId: "mantenimiento-limpieza",
    categoriaNombre: "Mantenimiento y Limpieza",
    desc: "Conexi\u00f3n flexible macho-hembra para grifer\u00eda, bidet y termotanques. Malla de acero quir\u00fargico AISI 304.",
    precio: 6800,
    precioFormateado: "$6.800",
    antes: "$8.500",
    oferta: "-20%",
    imagen: "img/productos/flexible-mallado-1-2.jpg"
  },
  {
    id: "canilla-esferica-1-2",
    nombre: "Canilla Esf\u00e9rica para Jard\u00edn Met\u00e1lica 1/2\"",
    categoriaId: "mantenimiento-limpieza",
    categoriaNombre: "Mantenimiento y Limpieza",
    desc: "Paso total con palanca ergon\u00f3mica roja y pico para acople r\u00e1pido de manguera de riego.",
    precio: 9900,
    precioFormateado: "$9.900",
    antes: "$12.500",
    oferta: "-20%",
    imagen: "img/productos/canilla-esferica-1-2.jpg"
  },
  {
    id: "adhesivo-pvc-250",
    nombre: "Adhesivo para Ca\u00f1os de PVC R\u00edgido 250cc",
    categoriaId: "mantenimiento-limpieza",
    categoriaNombre: "Mantenimiento y Limpieza",
    desc: "Pegamento para ca\u00f1er\u00edas cloacales y pluviales con pincel aplicador integrado. Secado ultra r\u00e1pido.",
    precio: 7400,
    precioFormateado: "$7.400",
    antes: "$9.200",
    oferta: "-19%",
    imagen: "img/productos/adhesivo-pvc-250.jpg"
  },
  {
    id: "tubo-termofusion-20mm",
    nombre: "Tubo Termofusi\u00f3n Verde 20mm x 4m PN20",
    categoriaId: "mantenimiento-limpieza",
    categoriaNombre: "Mantenimiento y Limpieza",
    desc: "Ca\u00f1o tricapa para agua fr\u00eda y caliente de alta presi\u00f3n. M\u00e1xima resistencia a la temperatura y at\u00f3xico.",
    precio: 11500,
    precioFormateado: "$11.500",
    antes: "$14.200",
    oferta: "-19%",
    imagen: "img/productos/tubo-termofusion-20mm.jpg"
  },
  {
    id: "silicona-neutra-transparente",
    nombre: "Silicona Neutra Transparente 280ml",
    categoriaId: "mantenimiento-limpieza",
    categoriaNombre: "Mantenimiento y Limpieza",
    desc: "Sellador multiuso para ba\u00f1os, cocinas, aberturas y vidrio. Antihongos y resistente a la intemperie.",
    precio: 8200,
    precioFormateado: "$8.200",
    antes: "$10.400",
    oferta: "-21%",
    imagen: "img/productos/silicona-neutra-transparente.jpg"
  },
  {
    id: "espuma-poliuretano-500ml",
    nombre: "Espuma de Poliuretano Expansiva 500ml",
    categoriaId: "mantenimiento-limpieza",
    categoriaNombre: "Mantenimiento y Limpieza",
    desc: "Aislante t\u00e9rmico y ac\u00fastico para fijaci\u00f3n de marcos de puertas, ventanas y relleno de huecos.",
    precio: 12800,
    precioFormateado: "$12.800",
    antes: "$15.900",
    oferta: "-19%",
    imagen: "img/productos/espuma-poliuretano-500ml.jpg"
  },
  {
    id: "cinta-papel-enmascarar",
    nombre: "Cinta de Papel para Pintor 24mm x 50m",
    categoriaId: "mantenimiento-limpieza",
    categoriaNombre: "Mantenimiento y Limpieza",
    desc: "Cinta de enmascarar masking tape de f\u00e1cil desprendimiento sin dejar residuos adhesivos.",
    precio: 3100,
    precioFormateado: "$3.100",
    antes: "$4.000",
    oferta: "-22%",
    imagen: "img/productos/cinta-papel-enmascarar.jpg"
  },
  {
    id: "adhesivo-montaje-pulpito",
    nombre: "Adhesivo de Montaje Agarre Inmediato 250g",
    categoriaId: "mantenimiento-limpieza",
    categoriaNombre: "Mantenimiento y Limpieza",
    desc: "Reemplaza clavos y tornillos. Gran agarre inicial para z\u00f3calos, madera, metal y cer\u00e1micos.",
    precio: 7900,
    precioFormateado: "$7.900",
    antes: "$9.800",
    oferta: "-19%",
    imagen: "img/productos/adhesivo-montaje-pulpito.jpg"
  },
  {
    id: "sellador-acrilico-grietas",
    nombre: "Sellador Acr\u00edlico Pintable para Grietas 280ml",
    categoriaId: "mantenimiento-limpieza",
    categoriaNombre: "Mantenimiento y Limpieza",
    desc: "Sellador el\u00e1stico blanco para fisuras en paredes de yeso y mamposter\u00eda. F\u00e1cil de lijar y pintar.",
    precio: 5900,
    precioFormateado: "$5.900",
    antes: "$7.500",
    oferta: "-21%",
    imagen: "img/productos/sellador-acrilico-grietas.jpg"
  },
  {
    id: "balde-albanil-reforzado",
    nombre: "Balde de Alba\u00f1il Pl\u00e1stico Reforzado 10L",
    categoriaId: "mantenimiento-limpieza",
    categoriaNombre: "Mantenimiento y Limpieza",
    desc: "Balde de obra con manija met\u00e1lica resistente y graduaci\u00f3n interna. Ideal mezclas y limpieza pesada.",
    precio: 3600,
    precioFormateado: "$3.600",
    antes: "$4.800",
    oferta: "-25%",
    imagen: "img/productos/balde-albanil-reforzado.jpg"
  },
  /* --- ELECTRICIDAD --- */
  {
    id: "rollo-cable-2-5",
    nombre: "Rollo Cable Unipolar 2.5mm IRAM 100m",
    categoriaId: "electricidad",
    categoriaNombre: "Electricidad",
    desc: "Cobre puro 100% antihidrocarburo y no propagante de llama. Aprobado seg\u00fan normativa IRAM.",
    precio: 38500,
    precioFormateado: "$38.500",
    antes: "$45.000",
    oferta: "-15%",
    imagen: "img/productos/rollo-cable-2-5.jpg"
  },
  {
    id: "tablero-termicas",
    nombre: "Kit Tablero T\u00e9rmicas y Disyuntor Bipolar",
    categoriaId: "electricidad",
    categoriaNombre: "Electricidad",
    desc: "Caja estanca para 8 bocas + Disyuntor bipolar 25A + 2 T\u00e9rmicas 16A y 20A normalizadas Sica.",
    precio: 45200,
    precioFormateado: "$45.200",
    antes: "$52.000",
    oferta: "Pack",
    imagen: "img/productos/tablero-termicas.jpg"
  },
  {
    id: "tester-multimetro",
    nombre: "Mult\u00edmetro Tester Digital Profesional",
    categoriaId: "electricidad",
    categoriaNombre: "Electricidad",
    desc: "Medici\u00f3n precisa de voltaje AC/DC, amperaje, resistencia y continuidad sonora. Puntas y bater\u00eda incluidas.",
    precio: 16800,
    precioFormateado: "$16.800",
    antes: "$21.000",
    oferta: "-20%",
    imagen: "img/productos/tester-multimetro.jpg"
  },
  {
    id: "reflector-led-50w",
    nombre: "Reflector Proyector LED 50W Exterior IP65",
    categoriaId: "electricidad",
    categoriaNombre: "Electricidad",
    desc: "Luz blanca fr\u00eda de alta potencia 4500 l\u00famenes, resistente a lluvia y polvo para frentes o talleres.",
    precio: 19500,
    precioFormateado: "$19.500",
    antes: "$24.000",
    oferta: "Destacado",
    imagen: "img/productos/reflector-led-50w.jpg"
  },
  {
    id: "cinta-aisladora-tacsa",
    nombre: "Cinta Aisladora PVC Ign\u00edfuga 20m Tacsa",
    categoriaId: "electricidad",
    categoriaNombre: "Electricidad",
    desc: "Cinta aislante profesional de PVC de 20 metros. Aislaci\u00f3n el\u00e9ctrica certificada hasta 600V.",
    precio: 2800,
    precioFormateado: "$2.800",
    antes: "$3.600",
    oferta: "-22%",
    imagen: "img/productos/cinta-aisladora-tacsa.jpg"
  },
  {
    id: "pack-led-9w-x10",
    nombre: "Pack x10 L\u00e1mparas LED 9W E27 Luz Fr\u00eda",
    categoriaId: "electricidad",
    categoriaNombre: "Electricidad",
    desc: "Pack ahorro de 10 focos LED rosca est\u00e1ndar E27 de bajo consumo A+. Equivalente a 75W incandescente.",
    precio: 16500,
    precioFormateado: "$16.500",
    antes: "$21.000",
    oferta: "-21%",
    imagen: "img/productos/pack-led-9w-x10.jpg"
  },
  {
    id: "punto-toma-armado",
    nombre: "Punto y Toma Corriente Armado con Placa",
    categoriaId: "electricidad",
    categoriaNombre: "Electricidad",
    desc: "M\u00f3dulo armado blanco con llave interruptora y tomacorriente de 10A con placa y bastidor.",
    precio: 4900,
    precioFormateado: "$4.900",
    antes: "$6.200",
    oferta: "-21%",
    imagen: "img/productos/punto-toma-armado.jpg"
  },
  {
    id: "cano-corrugado-3-4",
    nombre: "Ca\u00f1o Corrugado Blanco Ign\u00edfugo 3/4\" x 25m",
    categoriaId: "electricidad",
    categoriaNombre: "Electricidad",
    desc: "Rollo de ca\u00f1o corrugado normalizado para embutir en pared o losa. Autoextinguible y flexible.",
    precio: 14200,
    precioFormateado: "$14.200",
    antes: "$17.800",
    oferta: "-20%",
    imagen: "img/productos/cano-corrugado-3-4.jpg"
  },

  /* --- HERRAMIENTA SEGURIDAD --- */
  {
    id: "taladro-650w",
    nombre: "Taladro Percutor 650W + Malet\u00edn",
    categoriaId: "herramienta-seguridad",
    categoriaNombre: "Herramienta Seguridad",
    desc: "Mandril de 13mm, velocidad variable y reversible. Potente motor con selector de percusi\u00f3n y accesorios.",
    precio: 64900,
    precioFormateado: "$64.900",
    antes: "$81.100",
    oferta: "-20%",
    imagen: "img/productos/taladro-650w.jpg"
  },
  {
    id: "amoladora-4-1-2",
    nombre: "Amoladora Angular 4 1/2\" 850W",
    categoriaId: "herramienta-seguridad",
    categoriaNombre: "Herramienta Seguridad",
    desc: "Dise\u00f1o ergon\u00f3mico, traba de eje y guarda de protecci\u00f3n ajustable contra chispas. 11000 RPM.",
    precio: 58900,
    precioFormateado: "$58.900",
    antes: "$69.000",
    oferta: "Oferta",
    imagen: "img/productos/amoladora-4-1-2.jpg"
  },
  {
    id: "casco-seguridad",
    nombre: "Casco de Seguridad Industrial Homologado",
    categoriaId: "herramienta-seguridad",
    categoriaNombre: "Herramienta Seguridad",
    desc: "Casco de polietileno de alta densidad con arn\u00e9s a cremallera regulable y banda antisudor.",
    precio: 8500,
    precioFormateado: "$8.500",
    antes: "$11.000",
    oferta: "-22%",
    imagen: "img/productos/casco-seguridad.jpg"
  },
  {
    id: "antiparras-seguridad",
    nombre: "Antiparras de Seguridad Anti-Empa\u00f1o UV400",
    categoriaId: "herramienta-seguridad",
    categoriaNombre: "Herramienta Seguridad",
    desc: "Visor envolvente de policarbonato con patillas ajustables y m\u00e1xima resistencia a impactos.",
    precio: 4200,
    precioFormateado: "$4.200",
    antes: "$5.500",
    oferta: "-23%",
    imagen: "img/productos/antiparras-seguridad.jpg"
  },
  {
    id: "arnes-seguridad",
    nombre: "Arn\u00e9s de Seguridad Integral Antica\u00eddas",
    categoriaId: "herramienta-seguridad",
    categoriaNombre: "Herramienta Seguridad",
    desc: "Con toma dorsal y frontal para trabajos en altura. Cintas de poli\u00e9ster de alta tenacidad homologadas.",
    precio: 34500,
    precioFormateado: "$34.500",
    antes: "$42.000",
    oferta: "Seguridad",
    imagen: "img/productos/arnes-seguridad.jpg"
  },
  {
    id: "martillo-galponero",
    nombre: "Martillo Galponero Cabo Fibra de Vidrio",
    categoriaId: "herramienta-seguridad",
    categoriaNombre: "Herramienta Seguridad",
    desc: "Cabeza forjada de acero al carbono con u\u00f1a curva sacaclavos y mango ergon\u00f3mico antideslizante.",
    precio: 18900,
    precioFormateado: "$18.900",
    antes: "$23.500",
    oferta: "-20%",
    imagen: "img/productos/martillo-galponero.jpg"
  },
  {
    id: "pinza-universal-8",
    nombre: "Pinza Universal 8 Pulgadas Aislada 1000V",
    categoriaId: "herramienta-seguridad",
    categoriaNombre: "Herramienta Seguridad",
    desc: "Pinza de fuerza forjada en acero cromo vanadio con mangos bimateriales de alta aislaci\u00f3n.",
    precio: 15400,
    precioFormateado: "$15.400",
    antes: "$19.200",
    oferta: "-20%",
    imagen: "img/productos/pinza-universal-8.jpg"
  },
  {
    id: "llave-francesa-10",
    nombre: "Llave Francesa Ajustable 10\" Cromada",
    categoriaId: "herramienta-seguridad",
    categoriaNombre: "Herramienta Seguridad",
    desc: "Apertura amplia con escala milim\u00e9trica grabada con l\u00e1ser y mecanismo de ajuste suave y preciso.",
    precio: 17800,
    precioFormateado: "$17.800",
    antes: "$22.000",
    oferta: "-19%",
    imagen: "img/productos/llave-francesa-10.jpg"
  },
  {
    id: "cinta-metrica-5m",
    nombre: "Cinta M\u00e9trica Flex\u00f3metro 5m con Freno",
    categoriaId: "herramienta-seguridad",
    categoriaNombre: "Herramienta Seguridad",
    desc: "Cinta met\u00e1lica de 19mm con recubrimiento mate antirreflejo, bot\u00f3n de traba y clip para cintur\u00f3n.",
    precio: 6500,
    precioFormateado: "$6.500",
    antes: "$8.200",
    oferta: "-20%",
    imagen: "img/productos/cinta-metrica-5m.jpg"
  },
  {
    id: "nivel-aluminio-40cm",
    nombre: "Nivel Tubular de Aluminio Magn\u00e9tico 40cm",
    categoriaId: "herramienta-seguridad",
    categoriaNombre: "Herramienta Seguridad",
    desc: "Cuerpo de aluminio reforzado con base magn\u00e9tica y 3 burbujas de precisi\u00f3n (45\u00b0, 90\u00b0 y 180\u00b0).",
    precio: 13900,
    precioFormateado: "$13.900",
    antes: "$17.500",
    oferta: "-20%",
    imagen: "img/productos/nivel-aluminio-40cm.jpg"
  },
  {
    id: "juego-destornilladores-x6",
    nombre: "Set x6 Destornilladores Planos y Phillips",
    categoriaId: "herramienta-seguridad",
    categoriaNombre: "Herramienta Seguridad",
    desc: "Puntas imantadas templadas de acero Cr-V. Incluye 3 planos y 3 phillips con mango bimaterial.",
    precio: 16200,
    precioFormateado: "$16.200",
    antes: "$20.500",
    oferta: "-21%",
    imagen: "img/productos/juego-destornilladores-x6.jpg"
  },
  {
    id: "arco-sierra-metales",
    nombre: "Arco de Sierra para Metales 12\" con Hoja",
    categoriaId: "herramienta-seguridad",
    categoriaNombre: "Herramienta Seguridad",
    desc: "Estructura tubular robusta con tuerca mariposa de tensi\u00f3n y hoja bimet\u00e1lica flexible de 24 dpp.",
    precio: 12400,
    precioFormateado: "$12.400",
    antes: "$15.500",
    oferta: "-20%",
    imagen: "img/productos/arco-sierra-metales.jpg"
  },
  {
    id: "tarugos-nylon-8",
    nombre: "Tarugos de Nylon N\u00ba 8 con Tope y Tornillos x100",
    categoriaId: "herramienta-seguridad",
    categoriaNombre: "Herramienta Seguridad",
    desc: "Bolsa de 100 tarugos pl\u00e1sticos fijadores con tope para ladrillo com\u00fan y hueco, con tornillos fix.",
    precio: 5800,
    precioFormateado: "$5.800",
    antes: "$7.500",
    oferta: "-23%",
    imagen: "img/productos/tarugos-nylon-8.jpg"
  },
  {
    id: "tornillos-drywall-t2",
    nombre: "Tornillos Drywall T2 Aguja para Durlock x100",
    categoriaId: "herramienta-seguridad",
    categoriaNombre: "Herramienta Seguridad",
    desc: "Tornillos fosfatizados negros 6x1 1/4\" punta aguja especiales para fijaci\u00f3n de placas de yeso.",
    precio: 4300,
    precioFormateado: "$4.300",
    antes: "$5.600",
    oferta: "-23%",
    imagen: "img/productos/tornillos-drywall-t2.jpg"
  },
  {
    id: "tornillos-t1-aguja",
    nombre: "Tornillos T1 Punta Aguja 8x9/16\" x100",
    categoriaId: "herramienta-seguridad",
    categoriaNombre: "Herramienta Seguridad",
    desc: "Tornillos autoperforantes cabeza lenteja punta aguja para uni\u00f3n de perfiles de chapa y durlock.",
    precio: 3900,
    precioFormateado: "$3.900",
    antes: "$5.000",
    oferta: "-22%",
    imagen: "img/productos/tornillos-t1-aguja.jpg"
  },
  {
    id: "clavos-punta-paris",
    nombre: "Clavos Punta Par\u00eds 2 1/2 Pulgadas x 1 Kg",
    categoriaId: "herramienta-seguridad",
    categoriaNombre: "Herramienta Seguridad",
    desc: "Clavos de acero pulido de primera calidad para carpinter\u00eda, encofrados y madera general.",
    precio: 4700,
    precioFormateado: "$4.700",
    antes: "$6.000",
    oferta: "-22%",
    imagen: "img/productos/clavos-punta-paris.jpg"
  },
  {
    id: "remaches-aluminio-ciegos",
    nombre: "Remaches R\u00e1pidos de Aluminio 4x12mm x100",
    categoriaId: "herramienta-seguridad",
    categoriaNombre: "Herramienta Seguridad",
    desc: "Remaches ciegos de cuerpo de aluminio y v\u00e1stago de acero para uniones met\u00e1licas duraderas.",
    precio: 3800,
    precioFormateado: "$3.800",
    antes: "$4.900",
    oferta: "-22%",
    imagen: "img/productos/remaches-aluminio-ciegos.jpg"
  },
  {
    id: "cuchara-albanil-7",
    nombre: "Cuchara de Alba\u00f1il Forjada N\u00ba 7 Cabo Madera",
    categoriaId: "herramienta-seguridad",
    categoriaNombre: "Herramienta Seguridad",
    desc: "Hoja forjada de una sola pieza en acero especial, templada y rectificada con cabo de madera lustrado.",
    precio: 14500,
    precioFormateado: "$14.500",
    antes: "$18.200",
    oferta: "-20%",
    imagen: "img/productos/cuchara-albanil-7.jpg"
  },
  {
    id: "disco-diamantado-115",
    nombre: "Disco Diamantado Continuo 115mm Cer\u00e1micos",
    categoriaId: "herramienta-seguridad",
    categoriaNombre: "Herramienta Seguridad",
    desc: "Corte fino y prolijo sin desportillar en cer\u00e1micas, azulejos y porcelanatos para amoladora 4 1/2\".",
    precio: 9200,
    precioFormateado: "$9.200",
    antes: "$11.800",
    oferta: "-22%",
    imagen: "img/productos/disco-diamantado-115.jpg"
  },
  /* --- MAYORISTA COMBOS --- */
  {
    id: "combo-duo-power",
    nombre: "Combo D\u00fao Power: Taladro + Amoladora",
    categoriaId: "mayorista-combos",
    categoriaNombre: "Mayorista Combos",
    desc: "Kit profesional completo: Taladro percutor 650W + Amoladora 850W con malet\u00edn y 10 discos de regalo.",
    precio: 109900,
    precioFormateado: "$109.900",
    antes: "$135.000",
    oferta: "-19%",
    imagen: "img/productos/combo-duo-power.jpg"
  },
  {
    id: "combo-albanileria",
    nombre: "Combo Obra: Carretilla + Cuchara + Nivel + 3 Baldes",
    categoriaId: "mayorista-combos",
    categoriaNombre: "Mayorista Combos",
    desc: "Kit mayorista para construcci\u00f3n: Carretilla chapa reforzada 80L + cuchara forjada + nivel + baldes.",
    precio: 78000,
    precioFormateado: "$78.000",
    antes: "$94.000",
    oferta: "Pack Obra",
    imagen: "img/productos/combo-albanileria.jpg"
  },
  {
    id: "pack-discos-corte",
    nombre: "Pack Mayorista Discos de Corte 115mm x 50u",
    categoriaId: "mayorista-combos",
    categoriaNombre: "Mayorista Combos",
    desc: "Caja cerrada de 50 discos de corte ultrafinos 1mm para amoladora angular de 4 1/2\". M\u00e1xima durabilidad.",
    precio: 32000,
    precioFormateado: "$32.000",
    antes: "$41.000",
    oferta: "Mayorista",
    imagen: "img/productos/pack-discos-corte.jpg"
  },
  {
    id: "combo-electricista",
    nombre: "Combo Electricista Pro: Pasacable + Pinza + Pelacables",
    categoriaId: "mayorista-combos",
    categoriaNombre: "Mayorista Combos",
    desc: "Cinta pasacable de acero 20m + Pinza universal aislada 1000V + Pelacables autom\u00e1tico + Buscapolo digital.",
    precio: 49900,
    precioFormateado: "$49.900",
    antes: "$62.000",
    oferta: "-20%",
    imagen: "img/productos/combo-electricista.jpg"
  }
];
