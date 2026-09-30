/**
 * Módulo de Catálogo, Búsqueda y Filtros de Productos
 */
import { PRODUCTOS, SVG_PLACEHOLDER } from '../data/products.js';
import { CATEGORIAS, normalizarCategoriaId } from '../data/categories.js';
import { generarWaUrl } from '../data/config.js';
import { addToCart } from './cart.js';

let activeCategory = 'todos';
let searchQuery = '';

export function initCatalog() {
  renderCategoryChips();
  renderProducts();
  setupCatalogListeners();
  setupCategorySectionSync();
}

function renderCategoryChips() {
  const container = document.getElementById('categoryChips');
  if (!container) return;

  const chips = [
    { id: 'todos', nombre: 'Todos' },
    ...CATEGORIAS.map(c => ({ id: c.id, nombre: c.nombre }))
  ];

  container.innerHTML = chips.map(chip => `
    <button class="chip ${chip.id === activeCategory ? 'active' : ''}" data-category="${chip.id}">
      ${chip.nombre}
    </button>
  `).join('');

  container.querySelectorAll('.chip').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.getAttribute('data-category');
      container.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      renderProducts();
    });
  });
}

export function filterByCategory(categoryId) {
  activeCategory = normalizarCategoriaId(categoryId);
  const container = document.getElementById('categoryChips');
  if (container) {
    container.querySelectorAll('.chip').forEach(c => {
      const chipCat = normalizarCategoriaId(c.getAttribute('data-category'));
      if (chipCat === activeCategory) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });
  }
  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById('promoGrid');
  if (!grid) return;

  const filtered = PRODUCTOS.filter(p => {
    const prodCategory = normalizarCategoriaId(p.categoriaId);
    const matchesCategory = activeCategory === 'todos' || prodCategory === activeCategory;
    const matchesQuery = !searchQuery || 
      p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.categoriaNombre && p.categoriaNombre.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="catalog-empty">
        <p>No se encontraron productos en esta categoría o búsqueda.</p>
        <button class="btn btn-secondary btn-sm" id="resetFiltersBtn">Ver todas las ofertas</button>
      </div>
    `;
    const resetBtn = document.getElementById('resetFiltersBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        searchQuery = '';
        activeCategory = 'todos';
        const searchInput = document.getElementById('catalogSearch');
        if (searchInput) searchInput.value = '';
        renderCategoryChips();
        renderProducts();
      });
    }
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const waUrl = generarWaUrl(`¡Hola! Quisiera consultar stock y precio de: ${p.nombre}`);
    
    return `
      <article class="promo" data-id="${p.id}">
        ${p.oferta ? `<span class="tag">${escapeHtml(p.oferta)}</span>` : ''}
        <div class="ph">
          <img src="${p.imagen || SVG_PLACEHOLDER}" alt="${escapeHtml(p.nombre)}" loading="lazy">
        </div>
        <div class="body">
          <div class="body-header">
            <span class="category-tag">${escapeHtml(p.categoriaNombre || '')}</span>
          </div>
          <h3>${escapeHtml(p.nombre)}</h3>
          <p class="desc">${escapeHtml(p.desc)}</p>
          <div class="price">
            <b>${escapeHtml(p.precioFormateado)}</b>
            ${p.antes ? `<s>${escapeHtml(p.antes)}</s>` : ''}
          </div>
          <div class="card-actions">
            <button class="btn-add-cart" data-action="add-cart" data-product-id="${p.id}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Sumar al pedido
            </button>
            <a class="btn-wa-single" href="${waUrl}" target="_blank" rel="noopener" title="Consultar directo por WhatsApp">
              <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7a11.5 11.5 0 0 1-4.8-4.2c-.4-.5-1.2-1.6-1.2-3s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.4.1.1.1.7-.1 1.2z"/></svg>
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Vincular eventos de "Sumar al pedido"
  grid.querySelectorAll('[data-action="add-cart"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-product-id');
      const prod = PRODUCTOS.find(p => p.id === pid);
      if (prod) {
        addToCart(prod);
      }
    });
  });
}

function setupCatalogListeners() {
  const searchInput = document.getElementById('catalogSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderProducts();
    });
  }
}

function setupCategorySectionSync() {
  // Sincronizar clicks en la grilla de Rubros inferior para filtrar el catálogo
  document.querySelectorAll('[data-rubro-slug]').forEach(card => {
    card.addEventListener('click', () => {
      const slug = card.getAttribute('data-rubro-slug');
      filterByCategory(slug);
      const catalogSection = document.getElementById('promociones');
      if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
