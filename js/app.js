/**
 * El Ferretero - Motor JavaScript Global para Arquitectura Multipágina
 * Gestiona el carrito unificado, el menú desplegable, la sub-barra activa y el envío a WhatsApp
 */
(function() {
  'use strict';

  /* ==========================================================================
     1. CONFIGURACIÓN Y DATOS
     ========================================================================== */
  const CONFIG = {
    nombre: "El Ferretero",
    slogan: "Tu ferretero de confianza",
    ciudad: "Río Cuarto, Córdoba",
    whatsapp: "5493580000000",
    telefono: "0358 000-0000",
    direccion: "Estado N° 1871, Río Cuarto, Córdoba",
    mapa: "https://www.google.com/maps/search/?api=1&query=Estado+1871+Rio+Cuarto+Cordoba",
    horarios: [
      { dia: "Lunes a viernes", horas: "8:30 a 12:30 y 16:00 a 20:00" },
      { dia: "Sábados", horas: "8:30 a 13:00" },
      { dia: "Domingos", horas: "Cerrado" }
    ],
    horariosApertura: {
      1: [{ desde: 8.5, hasta: 12.5 }, { desde: 16.0, hasta: 20.0 }],
      2: [{ desde: 8.5, hasta: 12.5 }, { desde: 16.0, hasta: 20.0 }],
      3: [{ desde: 8.5, hasta: 12.5 }, { desde: 16.0, hasta: 20.0 }],
      4: [{ desde: 8.5, hasta: 12.5 }, { desde: 16.0, hasta: 20.0 }],
      5: [{ desde: 8.5, hasta: 12.5 }, { desde: 16.0, hasta: 20.0 }],
      6: [{ desde: 8.5, hasta: 13.0 }],
      0: []
    }
  };

  const generarWaUrl = (mensaje = "¡Hola! Quisiera hacer una consulta a El Ferretero.") => {
    return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensaje)}`;
  };

  const SVG_PLACEHOLDER = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
      <rect width="400" height="300" fill="#202020"/>
      <rect x="20" y="20" width="360" height="260" rx="8" fill="none" stroke="#333333" stroke-width="2" stroke-dasharray="8 8"/>
      <g fill="none" stroke="#F5A000" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity="0.9">
        <path d="M222 108a34 34 0 0 0-46 46l-58 58 22 22 58-58a34 34 0 0 0 46-46l-22 22-20-6-6-20z"/>
      </g>
      <text x="200" y="245" fill="#888888" font-family="sans-serif" font-weight="bold" font-size="14" text-anchor="middle" letter-spacing="1">EL FERRETERO · RÍO CUARTO</text>
    </svg>
  `);

  /* ==========================================================================
     2. GESTIÓN DEL CARRITO PERSISTENTE ENTRE PÁGINAS
     ========================================================================== */
  const CART_KEY = 'ferretero-cart';
  let cart = [];

  function initCart() {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) cart = JSON.parse(saved);
    } catch (e) {
      cart = [];
    }

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

    if (closeBtn) closeBtn.addEventListener('click', closeCart);
    if (backdrop) backdrop.addEventListener('click', closeCart);
    if (checkoutBtn) checkoutBtn.addEventListener('click', handleWhatsAppCheckout);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isCartOpen()) closeCart();
    });

    // Vincular botones de "Sumar al pedido" presentes en cualquier página
    document.querySelectorAll('[data-action="add-cart"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const article = btn.closest('.promo');
        if (!article) return;
        const pid = article.getAttribute('data-id') || btn.getAttribute('data-product-id');
        const nombre = article.querySelector('h3')?.textContent.trim() || 'Producto';
        const precioText = article.querySelector('.price b')?.textContent.trim() || '$0';
        const precioNum = parseInt(precioText.replace(/[^\d]/g, ''), 10) || 0;

        addToCart({
          id: pid,
          nombre: nombre,
          precio: precioNum,
          precioFormateado: precioText
        });
      });
    });

    updateCartBadge();
    renderCartDrawer();
  }

  function openCart() {
    const drawer = document.getElementById('cartDrawer');
    const backdrop = document.getElementById('cartBackdrop');
    if (drawer && backdrop) {
      drawer.classList.add('open');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCart() {
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

  function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        precioFormateado: product.precioFormateado,
        qty: 1
      });
    }

    saveCart();
    updateCartBadge();
    renderCartDrawer();
    showToast(`¡"${product.nombre}" agregado al pedido!`);
  }

  function updateQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
    saveCart();
    updateCartBadge();
    renderCartDrawer();
  }

  function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateCartBadge();
    renderCartDrawer();
  }

  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
  }

  function updateCartBadge() {
    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
    document.querySelectorAll('.cart-badge').forEach(b => {
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
          <a class="btn btn-secondary btn-sm" href="productos.html">Ver catálogo general</a>
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
      const sub = item.precio * item.qty;
      total += sub;
      return `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-info">
            <h4>${escapeHtml(item.nombre)}</h4>
            <span class="cart-item-price">$${sub.toLocaleString('es-AR')}</span>
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

    if (totalEl) totalEl.textContent = `$${total.toLocaleString('es-AR')}`;

    container.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const act = btn.getAttribute('data-action');
        if (act === 'increase') updateQty(id, 1);
        if (act === 'decrease') updateQty(id, -1);
        if (act === 'remove') removeFromCart(id);
      });
    });
  }

  function handleWhatsAppCheckout() {
    if (cart.length === 0) return;
    let total = 0;
    const itemsText = cart.map(item => {
      const sub = item.precio * item.qty;
      total += sub;
      return `• ${item.qty}x ${item.nombre} ($${sub.toLocaleString('es-AR')})`;
    }).join('\n');

    const msg = `*¡Hola El Ferretero!* 🛠️\nQuisiera consultar disponibilidad y encargar el siguiente pedido:\n\n${itemsText}\n\n*Total estimado: $${total.toLocaleString('es-AR')}*\n\n¿Tienen en stock y cómo coordinamos el retiro o envío? ¡Muchas gracias!`;
    window.open(generarWaUrl(msg), '_blank', 'noopener,noreferrer');
  }

  function showToast(message) {
    let toast = document.getElementById('ferreteroToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'ferreteroToast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 2500);
  }

  /* ==========================================================================
     3. HEADER, NAVEGACIÓN Y MENÚ DESPLEGABLE
     ========================================================================== */
  function initNavigation() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    // Marcar activo en la barra superior
    document.querySelectorAll('nav.nav-links > a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Marcar activo en la sub-barra de categorías y centrar en móviles/tablets
    let activeCategoryItem = null;
    document.querySelectorAll('.category-nav-item').forEach(item => {
      const href = item.getAttribute('href');
      if (href === currentPath) {
        item.classList.add('active');
        activeCategoryItem = item;
      } else {
        item.classList.remove('active');
      }
    });

    if (activeCategoryItem) {
      setTimeout(() => {
        activeCategoryItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }, 120);
    }

    // Dropdown toggle click en dispositivos táctiles / mobile
    const dropdown = document.querySelector('.nav-dropdown');
    const dropdownToggle = document.querySelector('.nav-dropdown-toggle');
    if (dropdown && dropdownToggle) {
      dropdownToggle.addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.classList.toggle('open');
      });

      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('open');
        }
      });
    }

    // Menú mobile tipo drawer con backdrop y botón de cierre táctil
    const mobileToggle = document.getElementById('mobileNavToggle');
    const navLinks = document.getElementById('navLinks');
    
    // Crear backdrop si no existe
    let navBackdrop = document.getElementById('mobileNavBackdrop');
    if (!navBackdrop) {
      navBackdrop = document.createElement('div');
      navBackdrop.id = 'mobileNavBackdrop';
      navBackdrop.className = 'mobile-nav-backdrop';
      document.body.appendChild(navBackdrop);
    }

    if (mobileToggle && navLinks) {
      // Inyectar cabecera del drawer móvil si no existe
      if (!navLinks.querySelector('.mobile-drawer-header')) {
        const drawerHeader = document.createElement('div');
        drawerHeader.className = 'mobile-drawer-header';
        drawerHeader.innerHTML = `
          <span>EL <b>FERRETERO</b></span>
          <button class="btn-close-drawer" type="button" aria-label="Cerrar menú">✕</button>
        `;
        navLinks.prepend(drawerHeader);
        drawerHeader.querySelector('.btn-close-drawer').addEventListener('click', closeMobileNav);
      }

      function openMobileNav() {
        navLinks.classList.add('open');
        navBackdrop.classList.add('open');
        mobileToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }

      function closeMobileNav() {
        navLinks.classList.remove('open');
        navBackdrop.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }

      mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (navLinks.classList.contains('open')) {
          closeMobileNav();
        } else {
          openMobileNav();
        }
      });

      navBackdrop.addEventListener('click', closeMobileNav);

      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileNav);
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) {
          closeMobileNav();
        }
      });
    }
  }

  /* ==========================================================================
     4. TEMA OSCURO / CLARO
     ========================================================================== */
  const THEME_KEY = 'ferretero-theme';
  function initTheme() {
    const toggleBtn = document.getElementById('themeToggleBtn');
    const root = document.documentElement;
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = saved || (systemPrefersDark ? 'dark' : 'light');

    root.setAttribute('data-theme', initialTheme);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const current = root.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      });
    }
  }

  /* ==========================================================================
     5. BUSCADOR EN VIVO DE PRODUCTOS (SI EXISTE #catalogSearch EN LA PÁGINA)
     ========================================================================== */
  function initLiveSearch() {
    const input = document.getElementById('catalogSearch');
    if (!input) return;

    input.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const articles = document.querySelectorAll('.promo');

      articles.forEach(art => {
        const title = art.querySelector('h3')?.textContent.toLowerCase() || '';
        const desc = art.querySelector('.desc')?.textContent.toLowerCase() || '';
        const tag = art.querySelector('.category-tag')?.textContent.toLowerCase() || '';

        if (!q || title.includes(q) || desc.includes(q) || tag.includes(q)) {
          art.style.display = '';
        } else {
          art.style.display = 'none';
        }
      });
    });
  }

  /* ==========================================================================
     6. ESTADO DE HORARIOS EN VIVO
     ========================================================================== */
  function initStoreStatus() {
    const el = document.getElementById('storeLiveStatus');
    if (!el) return;

    const now = new Date();
    const day = now.getDay();
    const timeDec = now.getHours() + (now.getMinutes() / 60);
    const schedule = CONFIG.horariosApertura[day] || [];

    let isOpen = false;
    let nextText = "";

    for (const turno of schedule) {
      if (timeDec >= turno.desde && timeDec < turno.hasta) {
        isOpen = true;
        const h = Math.floor(turno.hasta);
        const m = Math.round((turno.hasta - h) * 60);
        nextText = `Cierra a las ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} hs`;
        break;
      }
    }

    if (isOpen) {
      el.className = "status-indicator open";
      el.innerHTML = `<span class="status-dot"></span><span>Abierto ahora · ${nextText}</span>`;
    } else {
      let nextTurno = schedule.find(t => timeDec < t.desde);
      if (nextTurno) {
        const h = Math.floor(nextTurno.desde);
        const m = Math.round((nextTurno.desde - h) * 60);
        nextText = `Abre hoy a las ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} hs`;
      } else {
        nextText = day === 6 ? "Abre el lunes a las 8:30 hs" : "Abre mañana a las 8:30 hs";
      }
      el.className = "status-indicator closed";
      el.innerHTML = `<span class="status-dot"></span><span>Cerrado ahora · ${nextText}</span>`;
    }
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function boot() {
    initTheme();
    initNavigation();
    initCart();
    initLiveSearch();
    initStoreStatus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
