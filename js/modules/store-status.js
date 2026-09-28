/**
 * Módulo de estado de apertura en tiempo real y horarios
 */
import { CONFIG } from '../data/config.js';

export function initStoreStatus() {
  renderHoursTable();
  updateLiveStatus();
  // Actualizar cada 60 segundos
  setInterval(updateLiveStatus, 60000);
}

function updateLiveStatus() {
  const statusContainer = document.getElementById('storeLiveStatus');
  if (!statusContainer) return;

  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Domingo, 1 = Lunes ... 6 = Sábado
  const currentHourDecimal = now.getHours() + (now.getMinutes() / 60);

  const todaysSchedule = CONFIG.horariosApertura[dayOfWeek] || [];
  let isOpen = false;
  let nextEventText = "";

  // Comprobar si está abierto en algún turno de hoy
  for (const turno of todaysSchedule) {
    if (currentHourDecimal >= turno.desde && currentHourDecimal < turno.hasta) {
      isOpen = true;
      const horaCierre = formatDecimalHour(turno.hasta);
      nextEventText = `Cierra a las ${horaCierre} hs`;
      break;
    }
  }

  if (isOpen) {
    statusContainer.className = "status-indicator open";
    statusContainer.innerHTML = `
      <span class="status-dot"></span>
      <span>Abierto ahora · ${nextEventText}</span>
    `;
  } else {
    // Buscar próximo turno de apertura hoy
    let opensLaterToday = null;
    for (const turno of todaysSchedule) {
      if (currentHourDecimal < turno.desde) {
        opensLaterToday = turno;
        break;
      }
    }

    if (opensLaterToday) {
      nextEventText = `Abre hoy a las ${formatDecimalHour(opensLaterToday.desde)} hs`;
    } else {
      // Abre en días siguientes
      nextEventText = dayOfWeek === 6 ? "Abre el lunes a las 8:30 hs" : "Abre mañana a las 8:30 hs";
    }

    statusContainer.className = "status-indicator closed";
    statusContainer.innerHTML = `
      <span class="status-dot"></span>
      <span>Cerrado ahora · ${nextEventText}</span>
    `;
  }
}

function formatDecimalHour(dec) {
  const hours = Math.floor(dec);
  const minutes = Math.round((dec - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function renderHoursTable() {
  const table = document.getElementById('horariosTable');
  if (!table) return;

  const now = new Date();
  const dayOfWeek = now.getDay();

  // Mapear días a las filas
  table.innerHTML = CONFIG.horarios.map(h => {
    let isToday = false;
    if (h.dia.includes("Lunes a viernes") && dayOfWeek >= 1 && dayOfWeek <= 5) {
      isToday = true;
    } else if (h.dia.includes("Sábados") && dayOfWeek === 6) {
      isToday = true;
    } else if (h.dia.includes("Domingos") && dayOfWeek === 0) {
      isToday = true;
    }

    return `
      <tr class="${isToday ? 'today' : ''}">
        <td>${escapeHtml(h.dia)} ${isToday ? '<b>(Hoy)</b>' : ''}</td>
        <td>${escapeHtml(h.horas)}</td>
      </tr>
    `;
  }).join('');
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
