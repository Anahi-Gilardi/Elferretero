/**
 * Módulo de Carrito & Cotizador por WhatsApp
 */
import { CONFIG, generarWaUrl } from '../data/config.js';

const CART_STORAGE_KEY = 'ferretero-cart';
let cart = [];

export function initCart() {
  // Cargar estado inicial desde localStorage
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      cart = JSON.parse(saved);
    }
  } catch (e) {
    cart = [];
  }

  setupEventListeners();
  updateCartBadge();
  renderCartDrawer();
}

function setupEventListeners() {
  const openButtons = document.querySelectorAll('[data-open-cart]');
  const closeBtn = document.getElementById('closeCartBtn');
  const backdrop = document.getElementById('cartBackdrop');
  const checkoutBtn = document.getElementById('cartCheckoutWa');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCart();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeCart);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeCart);
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', handleWhatsAppCheckout);
  }

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isCartOpen()) {
      closeCart();
    }
  });
}

export function openCart() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (drawer && backdrop) {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

export function closeCart() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function isCartOpen() {
  const drawer = document.getElementById('cartDrawer');
  return drawer && drawer.classList.contains('open');
}

export function addToCart(product) {
  const existingIndex = cart.findIndex(item => item.id === product.id);
  if (existingIndex > -1) {
    cart[existingIndex].qty += 1;
  } else {
    cart.push({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      precioFormateado: product.precioFormateado,
      imagen: product.imagen,
      qty: 1
    });
  }

  saveCart();
  updateCartBadge();
  renderCartDrawer();
  showToast(`¡"${product.nombre}" agregado al pedido!`);
}

export function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
    updateCartBadge();
    renderCartDrawer();
  }
}

export function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartBadge();
  renderCartDrawer();
}

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error('Error guardando carrito:', e);
  }
}

function updateCartBadge() {
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const badges = document.querySelectorAll('.cart-badge');
  badges.forEach(b => {
    b.textContent = totalItems;
    b.style.display = totalItems > 0 ? 'flex' : 'none';
  });
}

function renderCartDrawer() {
  const container = document.getElementById('cartItemsList');
  const totalEl = document.getElementById('cartTotalAmount');
  const checkoutBtn = document.getElementById('cartCheckoutWa');

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <p>Tu lista de materiales y herramientas está vacía.</p>
        <button class="btn btn-secondary btn-sm" onclick="document.getElementById('cartBackdrop').click(); window.location.hash='#promociones'">Ver catálogo</button>
      </div>
    `;
    if (totalEl) totalEl.textContent = '$0';
    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.style.opacity = '0.5';
      checkoutBtn.style.pointerEvents = 'none';
    }
    return;
  }

  if (checkoutBtn) {
    checkoutBtn.disabled = false;
    checkoutBtn.style.opacity = '1';
    checkoutBtn.style.pointerEvents = 'auto';
  }

  let total = 0;

  container.innerHTML = cart.map(item => {
    const subtotal = item.precio * item.qty;
    total += subtotal;
    const formattedSubtotal = `$${subtotal.toLocaleString('es-AR')}`;

    return `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-info">
          <h4>${escapeHtml(item.nombre)}</h4>
          <span class="cart-item-price">${formattedSubtotal}</span>
        </div>
        <div class="cart-item-controls">
          <div class="quantity-control">
            <button class="btn-qty" data-action="decrease" data-id="${item.id}" aria-label="Restar">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="btn-qty" data-action="increase" data-id="${item.id}" aria-label="Sumar">+</button>
          </div>
          <button class="btn-remove-item" data-action="remove" data-id="${item.id}">Quitar</button>
        </div>
      </div>
    `;
  }).join('');

  if (totalEl) {
    totalEl.textContent = `$${total.toLocaleString('es-AR')}`;
  }

  // Añadir eventos a los botones internos del drawer
  container.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const action = btn.getAttribute('data-action');
      if (action === 'increase') updateQty(id, 1);
      if (action === 'decrease') updateQty(id, -1);
      if (action === 'remove') removeFromCart(id);
    });
  });
}

function handleWhatsAppCheckout() {
  if (cart.length === 0) return;

  let total = 0;
  let itemsListText = cart.map(item => {
    const sub = item.precio * item.qty;
    total += sub;
    return `• ${item.qty}x ${item.nombre} ($${sub.toLocaleString('es-AR')})`;
  }).join('\n');

  const text = `*¡Hola El Ferretero!* 🛠️\nQuisiera consultar disponibilidad y cotizar el siguiente pedido:\n\n${itemsListText}\n\n*Total estimado: $${total.toLocaleString('es-AR')}*\n\n¿Tienen en stock y cómo coordinamos el retiro o envío? ¡Gracias!`;

  const url = generarWaUrl(text);
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function showToast(message) {
  let toast = document.getElementById('ferreteroToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'ferreteroToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
