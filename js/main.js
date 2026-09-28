/**
 * Punto de entrada principal (Orquestador de Módulos)
 */
import { CONFIG, generarWaUrl } from './data/config.js';
import { CATEGORIAS } from './data/categories.js';
import { initTheme } from './modules/theme.js';
import { initHeader } from './modules/header.js';
import { initCatalog } from './modules/catalog.js';
import { initCart } from './modules/cart.js';
import { initStoreStatus } from './modules/store-status.js';
import { initQuoteModal } from './modules/quote-modal.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar Tema y Accesibilidad
  initTheme();

  // 2. Poblar datos comerciales estáticos
  populateBusinessInfo();

  // 3. Renderizar grilla de rubros / categorías
  renderCategoriesGrid();

  // 4. Inicializar Módulos de Componentes
  initHeader();
  initCart();
  initCatalog();
  initStoreStatus();
  initQuoteModal();
});

/**
 * Vincula los datos de configuración con los elementos de la interfaz
 */
function populateBusinessInfo() {
  // Dirección
  const dirEl = document.getElementById('dir');
  if (dirEl) dirEl.textContent = CONFIG.direccion;

  // Teléfono
  const telEl = document.getElementById('tel');
  if (telEl) {
    telEl.textContent = CONFIG.telefono;
    telEl.href = `tel:${CONFIG.telefono.replace(/[^\d+]/g, '')}`;
  }

  // Enlace a Google Maps
  const mapLink = document.getElementById('mapLink');
  if (mapLink) mapLink.href = CONFIG.mapa;

  // Botones con data-wa
  document.querySelectorAll('[data-wa]').forEach(el => {
    el.href = generarWaUrl();
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  });
}

/**
 * Renderiza la sección de rubros / categorías con iconos vectoriales
 */
function renderCategoriesGrid() {
  const container = document.getElementById('categoriesGrid');
  if (!container) return;

  container.innerHTML = CATEGORIAS.map(cat => `
    <div class="cat" data-rubro-slug="${cat.id}" title="Click para ver productos de ${cat.nombre}">
      ${cat.icono}
      <h3>${cat.nombre}</h3>
      <p>${cat.desc}</p>
    </div>
  `).join('');
}
