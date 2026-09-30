/**
 * El Ferretero - Motor JavaScript Global para Arquitectura Multipágina
 * Gestiona el carrito unificado con imágenes reales, cotizador a WhatsApp,
 * buscador reactivo con contador, estado de sucursal en vivo y formularios.
 */
(function() {
  'use strict';

  /* ==========================================================================
     1. CONFIGURACIÓN Y DATOS COMERCIALES
     ========================================================================== */
  const CONFIG = {
    nombre: "El Ferretero",
    slogan: "Tu ferretero de confianza",
    ciudad: "Río Cuarto, Córdoba",
    whatsapp: "5493584238976",
    telefono: "358 423-8976",
    direccion: "San Martín 2395, Río Cuarto, Córdoba",
    mapa: "https://www.google.com/maps/search/?api=1&query=San+Martin+2395+Rio+Cuarto+Cordoba",
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

  const SVG_FALLBACK = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
      <rect width="400" height="300" fill="#202020"/>
      <g fill="none" stroke="#F5A000" stroke-width="12" stroke-linecap="round" stroke-linejoin="round">
        <path d="M222 108a34 34 0 0 0-46 46l-58 58 22 22 58-58a34 34 0 0 0 46-46l-22 22-20-6-6-20z"/>
      </g>
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
    const clearBtn = document.getElementById('clearCartBtn');
    const backdrop = document.getElementById('cartBackdrop');
    const checkoutBtn = document.getElementById('cartCheckoutWa');

    openButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeCart);
    if (clearBtn) clearBtn.addEventListener('click', handleClearCart);
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
        const imgSrc = article.querySelector('.ph img')?.getAttribute('src') || `img/productos/${pid}.jpg`;

        addToCart({
          id: pid,
          nombre: nombre,
          precio: precioNum,
          precioFormateado: precioText,
          imagen: imgSrc
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
      if (!existing.imagen && product.imagen) existing.imagen = product.imagen;
    } else {
      cart.push({
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        precioFormateado: product.precioFormateado,
        imagen: product.imagen || `img/productos/${product.id}.jpg`,
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
    const item = cart.find(i => i.id === id);
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateCartBadge();
    renderCartDrawer();
    if (item) showToast(`"${item.nombre}" quitado del pedido.`);
  }

  function handleClearCart() {
    if (cart.length === 0) return;
    if (confirm('¿Deseas vaciar todos los productos del pedido?')) {
      cart = [];
      saveCart();
      updateCartBadge();
      renderCartDrawer();
      showToast('Se vació la lista de pedido.');
    }
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
    const clearBtn = document.getElementById('clearCartBtn');
    if (!container) return;

    if (clearBtn) {
      clearBtn.style.display = cart.length > 0 ? 'inline-block' : 'none';
    }

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <p>Tu lista de materiales y herramientas está vacía.</p>
          <a class="btn btn-secondary btn-sm" href="productos.html" onclick="(${closeCart.toString()})()">Explorar catálogo</a>
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
      const imgSrc = item.imagen || `img/productos/${item.id}.jpg`;
      return `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-img">
            <img src="${imgSrc}" alt="${escapeHtml(item.nombre)}" onerror="this.src='${SVG_FALLBACK}'" loading="lazy">
          </div>
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

    // Opción de entrega seleccionada
    const deliveryRadio = document.querySelector('input[name="cartDelivery"]:checked');
    const deliveryText = deliveryRadio ? deliveryRadio.value : 'Retiro en sucursal (San Martín 2395)';
    const clientInput = document.getElementById('cartClientName');
    const clientName = clientInput && clientInput.value.trim() ? clientInput.value.trim() : '';

    let clientSection = '';
    if (clientName) {
      clientSection = `\n👤 *Cliente:* ${clientName}`;
    }

    const msg = `*¡Hola El Ferretero!* 🛠️\nQuisiera consultar disponibilidad y coordinar el siguiente pedido:\n\n${itemsText}\n\n*Total estimado: $${total.toLocaleString('es-AR')}*\n📦 *Modalidad:* ${deliveryText}${clientSection}\n\n¿Tienen stock para confirmar? ¡Muchas gracias!`;
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
      if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Marcar sub-barra activa
    let activeCategoryItem = null;
    document.querySelectorAll('.category-nav-item').forEach(item => {
      const href = item.getAttribute('href');
      if (href && href === currentPath) {
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

    // Menú mobile tipo drawer
    const mobileToggle = document.getElementById('mobileNavToggle');
    const navLinks = document.getElementById('navLinks');
    
    let navBackdrop = document.getElementById('mobileNavBackdrop');
    if (!navBackdrop) {
      navBackdrop = document.createElement('div');
      navBackdrop.id = 'mobileNavBackdrop';
      navBackdrop.className = 'mobile-nav-backdrop';
      document.body.appendChild(navBackdrop);
    }

    if (mobileToggle && navLinks) {
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

      if (!navLinks.querySelector('.mobile-drawer-footer')) {
        const drawerFooter = document.createElement('div');
        drawerFooter.className = 'mobile-drawer-footer';
        drawerFooter.innerHTML = `
          <a href="https://wa.me/${CONFIG.whatsapp}?text=Hola!%20Quiero%20hacer%20una%20consulta" target="_blank" rel="noopener" class="drawer-wa-btn">
            💬 WhatsApp Directo
          </a>
          <span class="drawer-info-text">📍 San Martín 2395 · Río Cuarto</span>
        `;
        navLinks.appendChild(drawerFooter);
      }

      const header = document.querySelector('header');

      function openMobileNav() {
        if (header) header.classList.add('nav-open');
        navLinks.classList.add('open');
        navBackdrop.classList.add('open');
        mobileToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }

      function closeMobileNav() {
        if (header) header.classList.remove('nav-open');
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
     5. BUSCADOR EN VIVO DE PRODUCTOS CON CONTADOR REACTIVO
     ========================================================================== */
  function initLiveSearch() {
    const input = document.getElementById('catalogSearch');
    if (!input) return;

    const grid = document.querySelector('.grid');
    if (!grid) return;

    // Crear contador dinámico si no existe
    let counterEl = document.getElementById('catalogCounter');
    if (!counterEl) {
      counterEl = document.createElement('div');
      counterEl.id = 'catalogCounter';
      counterEl.style.cssText = 'margin-bottom: 16px; font-weight: 600; color: var(--muted); font-size: 0.95rem;';
      grid.parentNode.insertBefore(counterEl, grid);
    }

    // Crear contenedor de sin resultados si no existe
    let noResultsEl = document.getElementById('catalogNoResults');
    if (!noResultsEl) {
      noResultsEl = document.createElement('div');
      noResultsEl.id = 'catalogNoResults';
      noResultsEl.className = 'catalog-empty';
      noResultsEl.style.display = 'none';
      noResultsEl.innerHTML = `
        <p>No se encontraron productos para tu búsqueda.</p>
        <button class="btn btn-secondary btn-sm" id="resetSearchBtn">Ver todos los productos</button>
      `;
      grid.parentNode.insertBefore(noResultsEl, grid.nextSibling);
      const resetBtn = document.getElementById('resetSearchBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          input.value = '';
          input.dispatchEvent(new Event('input'));
          input.focus();
        });
      }
    }

    const articles = grid.querySelectorAll('.promo');
    const totalCount = articles.length;

    function applyFilter() {
      const q = input.value.toLowerCase().trim();
      let matchedCount = 0;

      articles.forEach(art => {
        const title = art.querySelector('h3')?.textContent.toLowerCase() || '';
        const desc = art.querySelector('.desc')?.textContent.toLowerCase() || '';
        const tag = art.querySelector('.category-tag')?.textContent.toLowerCase() || '';

        if (!q || title.includes(q) || desc.includes(q) || tag.includes(q)) {
          art.style.display = '';
          matchedCount++;
        } else {
          art.style.display = 'none';
        }
      });

      if (counterEl) {
        if (q) {
          counterEl.textContent = `Mostrando ${matchedCount} de ${totalCount} productos`;
        } else {
          counterEl.textContent = `Mostrando los ${totalCount} productos del catálogo`;
        }
      }

      if (noResultsEl) {
        noResultsEl.style.display = matchedCount === 0 ? 'block' : 'none';
      }
    }

    input.addEventListener('input', applyFilter);
    applyFilter();
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

  /* ==========================================================================
     7. FORMULARIO DE CONTACTO RÁPIDO
     ========================================================================== */
  window.submitQuickContact = function() {
    const name = document.getElementById('contactName')?.value.trim() || 'Cliente';
    const phone = document.getElementById('contactPhone')?.value.trim() || '';
    const rubro = document.getElementById('contactRubro')?.value || 'General';
    const message = document.getElementById('contactMessage')?.value.trim() || '';

    const text = `*Consulta Web - El Ferretero* 🛠️\n\n👤 *Nombre:* ${name}\n📞 *Teléfono:* ${phone}\n🏷️ *Rubro:* ${rubro}\n\n💬 *Mensaje:* ${message}`;
    window.open(generarWaUrl(text), '_blank', 'noopener,noreferrer');
  };

  /* ==========================================================================
     8. SINCRONIZACIÓN DE INFORMACIÓN DE NEGOCIO
     ========================================================================== */
  function syncBusinessInfo() {
    const dirEl = document.getElementById('dir');
    if (dirEl) dirEl.textContent = CONFIG.direccion;

    const telEl = document.getElementById('tel');
    if (telEl) {
      telEl.textContent = CONFIG.telefono;
      telEl.href = `tel:${CONFIG.telefono.replace(/[^\d+]/g, '')}`;
    }

    const mapLink = document.getElementById('mapLink');
    if (mapLink) mapLink.href = CONFIG.mapa;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  /* ==========================================================================
     9. REGISTRO DE SERVICE WORKER (PWA & SOPORTE OFFLINE)
     ========================================================================== */
  function initServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => {
            console.log('El Ferretero Service Worker activo:', reg.scope);
          })
          .catch(err => {
            console.warn('Service Worker no se pudo registrar:', err);
          });
      });
    }
  }

  function boot() {
    initTheme();
    initNavigation();
    initCart();
    initLiveSearch();
    initStoreStatus();
    syncBusinessInfo();
    initServiceWorker();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
