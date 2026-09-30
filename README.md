# 🛠️ El Ferretero - Plataforma Comercial & Catálogo Digital Fullstack

Sitio web oficial y plataforma de pedidos para **"El Ferretero"** (San Martín 2395, Río Cuarto, Córdoba). Diseñado con arquitectura responsive de alta fidelidad para teléfonos móviles, tablets y PCs, motor PWA offline, backend con API REST (Vercel Serverless Functions + Node.js nativo), cotizador interactivo directo a WhatsApp y catálogo con fotografías reales.

- 🌐 **Sitio en Producción (Vercel):** [https://el-ferretero-riocuarto.vercel.app](https://el-ferretero-riocuarto.vercel.app)
- 📱 **WhatsApp de Atención:** [+54 9 358 423-8976](https://wa.me/5493584238976)
- 📞 **Teléfono Sucursal:** [358 423-8976](tel:3584238976)
- 📍 **Dirección:** San Martín 2395, Río Cuarto, Córdoba, Argentina

---

## 🚀 Inicio Rápido

### En Windows:
Simplemente haz doble clic en el archivo **`abrir-web.bat`**. Detectará automáticamente si dispones de Node.js o Python, levantará el servidor en `http://localhost:8000` y abrirá tu navegador.

### Con Node.js (Servidor Fullstack con API REST):
```bash
npm start
# o bien: node server.js
```
Abre en tu navegador: [http://localhost:8000](http://localhost:8000)

### Con Python:
```bash
python -m http.server 8000
```

---

## 🧪 Pruebas Automatizadas

El proyecto incluye una suite integral de pruebas automatizadas que valida 99 puntos de control (integridad de páginas HTML, etiquetas viewport y PWA, todas las imágenes de productos y banners, respuestas HTTP 200, endpoints de API REST, filtros y cotizaciones):

```bash
npm test
# o bien: python test_suite.py
```

---

## 📱 Optimizaciones Multi-Dispositivo (Frontend)

1. **Teléfonos Inteligentes (< 768px - iPhone, Samsung Galaxy, etc.):**
   - Menú móvil deslizante de pantalla completa con backdrop táctil.
   - Header ultra-compacto con botón de carrito ergonómico adaptado a pulgares.
   - Grilla adaptable de 1 a 2 columnas en orientación horizontal (480px - 768px).
   - Soporte nativo para *Safe Area Insets* (Dynamic Island y notch de iPhone).
2. **Tablets (768px a 1024px - iPad, iPad Mini, Galaxy Tab):**
   - Navegación optimizada con tipografía Barlow e interlineados proporcionados.
   - Grilla de 3 columnas para navegación rápida de rubros.
3. **Escritorio y Monitores Ultra-Wide (> 1200px):**
   - Grilla de 4 columnas para máxima densidad informativa de herramientas.
   - Hero banner cinematográfico con imagen real de la tienda.
4. **PWA (Progressive Web App):**
   - [`manifest.json`](manifest.json) con iconos en alta resolución e instalación en pantalla de inicio.
   - [`sw.js`](sw.js) Service Worker con estrategia *stale-while-revalidate* y fallback offline.

---

## ⚡ Backend y API REST

El backend es compatible tanto de manera local (`server.js`) como en la nube con **Vercel Serverless Functions** (`api/`):

| Endpoint | Método | Descripción |
| :--- | :---: | :--- |
| `/api/products` | `GET` | Devuelve el catálogo completo (21 productos). Admite `?category=` y `?q=`. |
| `/api/health` | `GET` | Healthcheck y cálculo dinámico de apertura de sucursal en horario argentino (UTC-3). |
| `/api/quote` | `POST` / `GET` | Valida ítems, calcula totales y devuelve el enlace estructurado de WhatsApp. |

---

## 📁 Estructura del Directorio

```
el-ferretero/
│
├── index.html                   # Portada principal con buscador, banners y sucursal
├── productos.html               # Catálogo completo con las 21 referencias comerciales
├── contacto.html                # Formulario de cotizaciones y mapa de San Martín 2395
├── electricidad.html            # Categoría: Cables IRAM, tableros y reflectores
├── herramienta-seguridad.html   # Categoría: Taladros, amoladoras y EPP
├── libros-ebook.html            # Categoría: Manuales técnicos y guías prácticas
├── mantenimiento-limpieza.html  # Categoría: Hidrolavadoras, aspiradoras y escaleras
├── mayorista-combos.html        # Categoría: Kits de obra, electricista y cajas
│
├── api/                         # Backend Vercel Serverless / Node REST API
│   ├── products.js              # Endpoint de catálogo y filtros
│   ├── quote.js                 # Generador de cotizaciones y enlace WhatsApp
│   └── health.js                # Monitoreo de sucursal y salud del servidor
│
├── css/                         # Hojas de estilo modulares
│   ├── variables.css            # Tokens de diseño, tema oscuro/claro
│   ├── base.css                 # Reset y tipografía
│   ├── components.css           # Componentes UI (header, cards, drawer, botones)
│   └── responsive.css           # Reglas responsive de móviles, tablets y ultrawide
│
├── img/                         # Recursos gráficos reales
│   ├── productos/               # 21 fotografías de estudio en proporción 4:3
│   ├── banners/                 # Banner hero del salón de ventas
│   └── local/                   # Fachada comercial de San Martín 2395
│
├── js/                          # Lógica del cliente
│   ├── app.js                   # Motor global unificado con Service Worker
│   ├── data/                    # Catálogo estático y configuración
│   └── modules/                 # Módulos desacoplados
│
├── manifest.json                # Especificación PWA para móviles
├── sw.js                        # Service Worker de almacenamiento en caché
├── server.js                    # Servidor local Node.js sin dependencias
├── vercel.json                  # Encabezados de seguridad y caché en el edge
├── abrir-web.bat                # Lanzador en un clic para Windows
└── test_suite.py                # Suite de pruebas automatizadas integrales (99 checks)
```

---

## 🔒 Despliegue en Producción

El proyecto está configurado para desplegarse instantáneamente en **Vercel** (`vercel.json`), incluyendo:
- Encabezados de seguridad HTTP (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).
- Caché inmutable para imágenes (`max-age=31536000`).
- URLs limpias (`cleanUrls: true`).
- Dominio oficial de producción: [https://el-ferretero-riocuarto.vercel.app](https://el-ferretero-riocuarto.vercel.app)
