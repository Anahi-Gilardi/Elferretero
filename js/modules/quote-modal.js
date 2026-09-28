/**
 * Módulo de Modal para Presupuestos de Obra y Pedidos Especiales
 */
import { generarWaUrl } from '../data/config.js';

export function initQuoteModal() {
  const openButtons = document.querySelectorAll('[data-open-quote]');
  const modal = document.getElementById('quoteModal');
  const closeBtn = document.getElementById('closeQuoteModal');
  const form = document.getElementById('quoteForm');

  if (!modal) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = document.getElementById('quoteName')?.value || '';
      const rubro = document.getElementById('quoteCategory')?.value || '';
      const detalle = document.getElementById('quoteDetails')?.value || '';

      const msg = `*¡Hola El Ferretero!* 📋 Solicito cotización personalizada de obra/taller:\n` +
                  `• *Nombre / Empresa:* ${nombre}\n` +
                  `• *Rubro de interés:* ${rubro}\n` +
                  `• *Detalle de materiales requeridos:*\n${detalle}\n\n` +
                  `¿Podrían confirmarme precios y plazos de entrega? ¡Muchas gracias!`;

      const url = generarWaUrl(msg);
      window.open(url, '_blank', 'noopener,noreferrer');
      closeModal();
      form.reset();
    });
  }

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}
