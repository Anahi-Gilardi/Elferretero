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
  const CART_META_KEY = 'ferretero-cart-meta';
  let cart = [];
  let cartMeta = {
    clientName: '',
    delivery: 'Retiro en sucursal (San Martín 2395)',
    address: ''
  };
  let lastFocusedElement = null;

  function initCart() {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) cart = JSON.parse(saved);
      const savedMeta = localStorage.getItem(CART_META_KEY);
      if (savedMeta) cartMeta = Object.assign(cartMeta, JSON.parse(savedMeta));
    } catch (e) {
      cart = [];
    }

    const openButtons = document.querySelectorAll('[data-open-cart]');
    const closeBtn = document.getElementById('closeCartBtn');
    const clearBtn = document.getElementById('clearCartBtn');
    const backdrop = document.getElementById('cartBackdrop');
    const checkoutBtn = document.getElementById('cartCheckoutWa');
    const clientInput = document.getElementById('cartClientName');
    const addressInput = document.getElementById('cartDeliveryAddress');
    const deliveryRadios = document.querySelectorAll('input[name="cartDelivery"]');

    // Restaurar datos guardados del comprador
    if (clientInput && cartMeta.clientName) {
      clientInput.value = cartMeta.clientName;
    }
    if (addressInput && cartMeta.address) {
      addressInput.value = cartMeta.address;
    }
    if (deliveryRadios.length > 0 && cartMeta.delivery) {
      deliveryRadios.forEach(radio => {
        if (radio.value === cartMeta.delivery) {
          radio.checked = true;
        }
      });
    }

    // Persistir cambios en datos del comprador
    if (clientInput) {
      clientInput.addEventListener('input', () => {
        cartMeta.clientName = clientInput.value.trim();
        saveCartMeta();
      });
    }
    if (addressInput) {
      addressInput.addEventListener('input', () => {
        cartMeta.address = addressInput.value.trim();
        saveCartMeta();
      });
    }
    deliveryRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          cartMeta.delivery = radio.value;
          saveCartMeta();
        }
      });
    });

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

  function saveCartMeta() {
    try {
      localStorage.setItem(CART_META_KEY, JSON.stringify(cartMeta));
    } catch (e) {}
  }

  function openCart() {
    const drawer = document.getElementById('cartDrawer');
    const backdrop = document.getElementById('cartBackdrop');
    if (drawer && backdrop) {
      lastFocusedElement = document.activeElement;
      drawer.classList.add('open');
      backdrop.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const closeBtn = document.getElementById('closeCartBtn');
      if (closeBtn) closeBtn.focus();
    }
  }

  function closeCart() {
    const drawer = document.getElementById('cartDrawer');
    const backdrop = document.getElementById('cartBackdrop');
    if (drawer && backdrop) {
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
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
      b.setAttribute('aria-label', `${totalItems} artículos en el pedido`);
      b.setAttribute('aria-live', 'polite');
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <p>Tu lista de materiales y herramientas está vacía.</p>
          <a class="btn btn-secondary btn-sm" href="productos.html" data-action="explore-catalog">Explorar catálogo</a>
        </div>
      `;
      const exploreBtn = container.querySelector('[data-action="explore-catalog"]');
      if (exploreBtn) exploreBtn.addEventListener('click', closeCart);

      if (totalEl) totalEl.textContent = '$0';
      if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.setAttribute('aria-disabled', 'true');
        checkoutBtn.style.opacity = '0.5';
        checkoutBtn.style.pointerEvents = 'none';
      }
      return;
    }

    if (checkoutBtn) {
      checkoutBtn.disabled = false;
      checkoutBtn.removeAttribute('aria-disabled');
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
            <img src="${imgSrc}" alt="${escapeHtml(item.nombre)}" onerror="this.src='${SVG_FALLBACK}'" loading="lazy" width="60" height="60">
          </div>
          <div class="cart-item-info">
            <h4>${escapeHtml(item.nombre)}</h4>
            <span class="cart-item-price">$${sub.toLocaleString('es-AR')}</span>
          </div>
          <div class="cart-item-controls">
            <div class="quantity-control">
              <button class="btn-qty" data-action="decrease" data-id="${item.id}" aria-label="Restar una unidad de ${escapeHtml(item.nombre)}">−</button>
              <span class="qty-val" aria-label="Cantidad: ${item.qty}">${item.qty}</span>
              <button class="btn-qty" data-action="increase" data-id="${item.id}" aria-label="Sumar una unidad de ${escapeHtml(item.nombre)}">+</button>
            </div>
            <button class="btn-remove-item" data-action="remove" data-id="${item.id}" aria-label="Quitar ${escapeHtml(item.nombre)} del pedido">Quitar</button>
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
    const deliveryText = deliveryRadio ? deliveryRadio.value : (cartMeta.delivery || 'Retiro en sucursal (San Martín 2395)');
    const clientInput = document.getElementById('cartClientName');
    const clientName = clientInput && clientInput.value.trim() ? clientInput.value.trim() : (cartMeta.clientName || '');
    const addressInput = document.getElementById('cartDeliveryAddress');
    const addressText = addressInput && addressInput.value.trim() ? addressInput.value.trim() : (cartMeta.address || '');

    let extraDetails = '';
    if (clientName) {
      extraDetails += `\n👤 *Cliente:* ${clientName}`;
    }
    if (addressText) {
      extraDetails += `\n📍 *Dirección/Aclaraciones:* ${addressText}`;
    }

    const msg = `*¡Hola El Ferretero!* 🛠️\nQuisiera consultar disponibilidad y coordinar el siguiente pedido:\n\n${itemsText}\n\n*Total estimado: $${total.toLocaleString('es-AR')}*\n📦 *Modalidad:* ${deliveryText}${extraDetails}\n\n¿Tienen stock para confirmar? ¡Muchas gracias!`;
    
    abrirWhatsApp(msg);
  }

  function abrirWhatsApp(mensaje) {
    const url = generarWaUrl(mensaje);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => link.remove(), 120);
  }

  function showToast(message) {
    let toast = document.getElementById('ferreteroToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'ferreteroToast';
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
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
     5. BUSCADOR EN VIVO Y FILTRADO POR CATEGORÍAS REACTIVO
     ========================================================================== */
  const CATEGORY_ALIASES = {
    "limpieza": "mantenimiento-limpieza",
    "mantenimiento": "mantenimiento-limpieza",
    "mantenimiento-limpieza": "mantenimiento-limpieza",
    "hogar": "mantenimiento-limpieza",
    "plomeria": "mantenimiento-limpieza",
    "pintureria": "mantenimiento-limpieza",
    "electricidad": "electricidad",
    "electrico": "electricidad",
    "electricos": "electricidad",
    "electrica": "electricidad",
    "electricas": "electricidad",
    "iluminacion": "electricidad",
    "cables": "electricidad",
    "herramientas": "herramienta-seguridad",
    "herramienta": "herramienta-seguridad",
    "seguridad": "herramienta-seguridad",
    "herramienta-seguridad": "herramienta-seguridad",
    "manuales": "herramienta-seguridad",
    "construccion": "herramienta-seguridad",
    "epp": "herramienta-seguridad",
    "mayorista": "mayorista-combos",
    "combos": "mayorista-combos",
    "combo": "mayorista-combos",
    "packs": "mayorista-combos",
    "obra": "mayorista-combos",
    "mayorista-combos": "mayorista-combos"
  };

  const CATEGORY_NAMES = {
    "todos": "todas las categorías",
    "mantenimiento-limpieza": "Mantenimiento y Limpieza",
    "electricidad": "Electricidad",
    "herramienta-seguridad": "Herramienta Seguridad",
    "mayorista-combos": "Mayorista Combos"
  };

  function normalizeCategory(cat) {
    if (!cat) return 'todos';
    const c = cat.toLowerCase().trim();
    return CATEGORY_ALIASES[c] || c;
  }

  function initLiveSearch() {
    const input = document.getElementById('catalogSearch');
    const grid = document.querySelector('.grid');
    if (!grid) return;

    let activeCategory = 'todos';

    // Leer parámetros de URL si existen (soporta ?categoria=electricidad o #herramientas)
    const urlParams = new URLSearchParams(window.location.search);
    const urlCat = urlParams.get('categoria') || urlParams.get('category') || urlParams.get('rubro') || window.location.hash.replace('#', '');
    if (urlCat) {
      activeCategory = normalizeCategory(urlCat);
    }

    const urlQ = urlParams.get('q') || urlParams.get('buscar');
    if (urlQ && input) {
      input.value = urlQ;
    }

    // Crear contador dinámico si no existe
    let counterEl = document.getElementById('catalogCounter');
    if (!counterEl && input) {
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
        <p>No se encontraron productos para tu selección o búsqueda.</p>
        <button class="btn btn-secondary btn-sm" id="resetSearchBtn">Ver todos los productos</button>
      `;
      grid.parentNode.insertBefore(noResultsEl, grid.nextSibling);
    }

    const articles = grid.querySelectorAll('.promo');
    const totalCount = articles.length;

    // Vincular chips de categoría interactivos (si existen en la página)
    const chipContainer = document.querySelector('.category-chips');
    const chips = chipContainer ? chipContainer.querySelectorAll('.chip') : [];

    function updateActiveChipUI() {
      chips.forEach(chip => {
        const catAttr = chip.getAttribute('data-category') || '';
        const chipCat = normalizeCategory(catAttr);
        if (chipCat === activeCategory) {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      });
    }

    if (chips.length > 0) {
      chips.forEach(chip => {
        chip.addEventListener('click', (e) => {
          // Filtrar en la misma página de catálogo si hay artículos
          const catAttr = chip.getAttribute('data-category') || '';
          if (catAttr || document.getElementById('catalogSearch')) {
            e.preventDefault();
            activeCategory = normalizeCategory(catAttr);
            updateActiveChipUI();
            applyFilter();

            // Sincronizar URL sin recargar
            try {
              const url = new URL(window.location);
              if (activeCategory === 'todos') {
                url.searchParams.delete('categoria');
              } else {
                url.searchParams.set('categoria', activeCategory);
              }
              window.history.replaceState({}, '', url);
            } catch (err) {}
          }
        });
      });
      updateActiveChipUI();
    }

    const resetBtn = document.getElementById('resetSearchBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (input) input.value = '';
        activeCategory = 'todos';
        updateActiveChipUI();
        applyFilter();
        try {
          const url = new URL(window.location);
          url.searchParams.delete('categoria');
          url.searchParams.delete('q');
          window.history.replaceState({}, '', url);
        } catch (err) {}
        if (input) input.focus();
      });
    }

    function applyFilter() {
      const q = input ? input.value.toLowerCase().trim() : '';
      let matchedCount = 0;

      articles.forEach(art => {
        const artCat = normalizeCategory(art.getAttribute('data-category') || '');
        const title = art.querySelector('h3')?.textContent.toLowerCase() || '';
        const desc = art.querySelector('.desc')?.textContent.toLowerCase() || '';
        const tag = art.querySelector('.category-tag')?.textContent.toLowerCase() || '';
        const normTag = normalizeCategory(tag);

        const matchesCat = (activeCategory === 'todos') || (artCat === activeCategory) || (normTag === activeCategory);
        const matchesQuery = !q || title.includes(q) || desc.includes(q) || tag.includes(q) || artCat.includes(q);

        if (matchesCat && matchesQuery) {
          art.style.display = '';
          matchedCount++;
        } else {
          art.style.display = 'none';
        }
      });

      if (counterEl) {
        const catLabel = CATEGORY_NAMES[activeCategory] || activeCategory;
        if (q && activeCategory !== 'todos') {
          counterEl.textContent = `Mostrando ${matchedCount} de ${totalCount} productos en ${catLabel} para "${q}"`;
        } else if (q) {
          counterEl.textContent = `Mostrando ${matchedCount} de ${totalCount} productos para "${q}"`;
        } else if (activeCategory !== 'todos') {
          counterEl.textContent = `Mostrando ${matchedCount} productos en ${catLabel}`;
        } else {
          counterEl.textContent = `Mostrando los ${totalCount} productos del catálogo`;
        }
      }

      if (noResultsEl) {
        noResultsEl.style.display = matchedCount === 0 ? 'block' : 'none';
      }
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }
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
            // Chequear si hay actualización inmediatamente
            reg.update().catch(() => {});
            reg.addEventListener('updatefound', () => {
              const newWorker = reg.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('Nueva versión disponible de El Ferretero.');
                  }
                });
              }
            });
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
