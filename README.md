# 🛠️ El Ferretero - Sitio Web Modular

Sitio web comercial para **"El Ferretero"** (Río Cuarto, Córdoba). Diseñado con arquitectura modular en CSS, JavaScript ES Modules y componentes desacoplados.

---

## 📁 Estructura del Proyecto

```
el-ferretero/
│
├── index.html                   # Documento HTML principal
├── README.md                    # Documentación y guía de uso
│
├── css/                         # Hojas de estilo modularizadas
│   ├── variables.css            # Paleta de colores, tokens, tipografías y tema claro/oscuro
│   ├── base.css                 # Resets, tipografía base y botones
│   ├── components.css           # Header, Hero, Cards de producto, Grilla, Carrito y Modales
│   └── responsive.css           # Reglas responsive para dispositivos móviles y tablets
│
└── js/
    ├── main.js                  # Punto de entrada y orquestador de inicialización
    │
    ├── data/                    # Capa de datos desacoplada (fácilmente editable)
    │   ├── config.js            # Teléfonos, WhatsApp, dirección en Río Cuarto y horarios
    │   ├── categories.js        # Rubros con sus iconos SVG vectoriales
    │   └── products.js          # Catálogo de productos, ofertas y precios
    │
    └── modules/                 # Componentes funcionales
        ├── theme.js             # Modo Oscuro / Claro con persistencia en localStorage
        ├── header.js            # Barra de navegación sticky y menú móvil
        ├── catalog.js           # Buscador en tiempo real y filtrado por rubros
        ├── cart.js              # Carrito/Cotizador con cálculo y generación de pedido a WhatsApp
        ├── store-status.js      # Indicador dinámico en vivo (🟢 Abierto / 🔴 Cerrado)
        └── quote-modal.js       # Modal para solicitud de presupuestos de obra
```

---

## 🚀 Cómo Ejecutar el Proyecto

Dado que utiliza módulos nativos de JavaScript (`<script type="module">`), se recomienda abrirlo con cualquier servidor estático local:

### Opción 1: Python (Recomendado)
Abre una terminal en esta carpeta y ejecuta:
```bash
python -m http.server 8000
```
Luego abre tu navegador en: [http://localhost:8000](http://localhost:8000)

### Opción 2: VS Code / Live Server
Abre la carpeta en VS Code y haz clic derecho en `index.html` > **"Open with Live Server"**.

### Opción 3: Node / NPX
```bash
npx serve .
```

---

## ⚙️ Cómo Personalizar Datos

### 1. Cambiar teléfono, WhatsApp o dirección
Edita el archivo `js/data/config.js`:
```javascript
export const CONFIG = {
  whatsapp: "5493580000000",   // Código de país + código de área + número sin 0 ni 15
  telefono: "0358 000-0000",
  direccion: "Estado N° 1871, Río Cuarto, Córdoba",
  // ...
};
```

### 2. Agregar o editar productos
Edita el archivo `js/data/products.js`:
```javascript
{
  id: "mi-nuevo-producto",
  nombre: "Nombre del Producto",
  categoriaId: "electricas", // o manuales, pintureria, electricidad, plomeria, construccion
  categoriaNombre: "Herramientas eléctricas",
  desc: "Descripción de características técnicas.",
  precio: 45000,
  precioFormateado: "$45.000",
  antes: "$52.000",
  oferta: "-15%",
  imagen: "ruta/a/la/imagen.jpg" // Si está vacío se usa el icono institucional
}
```

---

## ✨ Características Destacadas
- **Cotizador & Carrito por WhatsApp**: Permite a los clientes sumar herramientas a una lista y enviar un mensaje desglosado con subtotales y total con un solo clic.
- **Estado de Atención en Tiempo Real**: Muestra automáticamente si el local está abierto o cerrado según los turnos de atención de Río Cuarto.
- **Modo Claro / Oscuro**: Alternador intuitivo con persistencia en el navegador del usuario.
- **Búsqueda Dinámica**: Búsqueda instantánea por palabra clave combinada con filtros de rubros.
