/**
 * Componente del Catálogo de Asesorías Académicas
 * Asistente Virtual de Asesorías Territorio TdeA
 */

import { ADVISORY_AREAS, ADVISORY_DAYS, filterAdvisories, getAdvisoryLiveStatus, MOCK_ADVISORIES } from '../data/advisoryMockData.js';
import { modal } from './modal.js';
import { reminderModal } from './reminderModal.js';
import { PrintScheduleService } from '../services/printScheduleService.js?v=20260908_10';

export class AdvisoryList {
  constructor(containerEl) {
    this.containerEl = containerEl;
    this.selectedArea = 'Todas las áreas de Ciencias Básicas';
    this.selectedDay = 'Todos los días';
    this.searchQuery = '';
    this.favoriteIds = this.loadFavorites();
  }

  loadFavorites() {
    try {
      const raw = localStorage.getItem('tdea_fav_advisories');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  toggleFavorite(id) {
    const idx = this.favoriteIds.indexOf(id);
    if (idx >= 0) {
      this.favoriteIds.splice(idx, 1);
    } else {
      this.favoriteIds.push(id);
    }
    try {
      localStorage.setItem('tdea_fav_advisories', JSON.stringify(this.favoriteIds));
    } catch (e) {}
  }

  render() {
    if (!this.containerEl) return;

    this.containerEl.innerHTML = `
      <div class="advisory-wrapper">
        <!-- Buscador y Filtros por Botones -->
        <div style="margin-bottom: 1.5rem;">
          <div class="advisory-search-toolbar">
            <div class="advisory-search-input-box">
              <span class="advisory-search-icon" aria-hidden="true">🔍</span>
              <input 
                type="text" 
                id="advisory-search-input" 
                class="advisory-search-input"
                placeholder="Buscar por área (Matemáticas, Física...), docente o día..." 
                value="${this.escapeHtml(this.searchQuery)}"
                aria-label="Buscar en catálogo de asesorías"
              />
            </div>
            <button 
              type="button" 
              id="btn-open-print-schedule" 
              class="btn-download-pdf-schedule" 
              title="Descargar o imprimir la programación oficial de asesorías en PDF"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="6 9 6 2 18 2 18 9"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              <span>📥 Imprimir / Guardar en PDF</span>
            </button>
          </div>
          
          <!-- Filtro por Área Académica -->
          <div class="advisory-filter-bar" id="advisory-filter-chips">
            ${ADVISORY_AREAS.map(area => `
              <button 
                type="button" 
                class="filter-chip ${area === this.selectedArea ? 'active' : ''}" 
                data-area="${area}"
              >
                ${area}
              </button>
            `).join('')}
          </div>

          <!-- Filtro por Día de la Semana y Favoritas -->
          <div class="advisory-day-filter-bar" id="advisory-day-chips">
            ${ADVISORY_DAYS.map(day => {
              const isFavChip = day === '⭐ Mis Favoritas';
              const favCount = this.favoriteIds.length;
              return `
                <button 
                  type="button" 
                  class="day-chip ${isFavChip ? 'chip-fav' : ''} ${day === this.selectedDay ? 'active' : ''}" 
                  data-day="${day}"
                >
                  ${day} ${isFavChip && favCount > 0 ? `(${favCount})` : ''}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Lista de Asesorías con Formato Estandarizado -->
        <div class="advisory-list" id="advisory-items-container">
          ${this.renderItemsHtml()}
        </div>
      </div>
    `;

    this.attachEvents();
  }

  renderItemsHtml() {
    const filtered = filterAdvisories({
      area: this.selectedArea,
      day: this.selectedDay,
      query: this.searchQuery,
      favoriteIds: this.favoriteIds
    });

    if (filtered.length === 0) {
      const isFavView = this.selectedDay === '⭐ Mis Favoritas';
      return `
        <div style="text-align: center; padding: 2.5rem 1rem; background: var(--color-surface-hover); border-radius: var(--radius-lg); border: 1px dashed var(--color-border);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">${isFavView ? '⭐' : '🔍'}</div>
          <h4 style="font-size: var(--font-size-base); color: var(--color-text-main); margin-bottom: 0.25rem;">
            ${isFavView ? 'No tienes asesorías guardadas' : 'No se encontraron asesorías'}
          </h4>
          <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); margin-bottom: 1rem;">
            ${isFavView 
              ? 'Haz clic en la estrella (☆) de cualquier asesoría para guardarla en tus favoritas y acceder a ella rápidamente.' 
              : 'Intenta con otro término de búsqueda o selecciona otra área o día.'}
          </p>
          <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">
            ¿No encuentras tu asignatura? Escríbenos a: <a href="mailto:auxcienciasbasicas2@tdea.edu.co" style="font-weight: 600; color: var(--tdea-green-primary);">auxcienciasbasicas2@tdea.edu.co</a>
          </p>
        </div>
      `;
    }

    return filtered.map(item => {
      const status = getAdvisoryLiveStatus(item);
      const isFav = this.favoriteIds.includes(item.id);

      return `
        <article class="advisory-card ${status.isPast ? 'advisory-card-past' : ''}">
          <div class="advisory-card-top">
            <div class="advisory-card-header-row">
              <div class="advisory-badges-group">
                <span class="badge badge-institutional">${item.area}</span>
                <span class="${status.badgeClass}">
                  ${status.isLive ? '<span class="pulse-dot"></span>' : ''}
                  ${status.badgeText}
                </span>
              </div>
              <button 
                type="button" 
                class="btn-favorite ${isFav ? 'active' : ''}" 
                data-advisory-id="${item.id}" 
                title="${isFav ? 'Quitar de mis favoritas' : 'Guardar en mis favoritas'}"
                aria-label="${isFav ? 'Quitar de mis favoritas' : 'Guardar en mis favoritas'}"
              >
                ${isFav ? '⭐' : '☆'}
              </button>
            </div>
            
            <h3 class="advisory-title" style="margin-top: 0.4rem;">
              Asesoría de ${this.escapeHtml(item.area)}
            </h3>
          </div>

          <div class="advisory-details-list">
            <div class="advisory-detail-row">
              <span class="advisory-detail-icon" aria-hidden="true">📅</span>
              <span class="advisory-detail-label">Días:</span>
              <span class="advisory-detail-value">${this.escapeHtml(item.days)}</span>
            </div>
            <div class="advisory-detail-row">
              <span class="advisory-detail-icon" aria-hidden="true">🕒</span>
              <span class="advisory-detail-label">Horario:</span>
              <span class="advisory-detail-value">${this.escapeHtml(item.time)}</span>
            </div>
            <div class="advisory-detail-row">
              <span class="advisory-detail-icon" aria-hidden="true">👨‍🏫</span>
              <span class="advisory-detail-label">Docente / Asesor:</span>
              <span class="advisory-detail-value">${this.escapeHtml(item.advisor)}</span>
            </div>
            <div class="advisory-detail-row">
              <span class="advisory-detail-icon" aria-hidden="true">💻</span>
              <span class="advisory-detail-label">Modalidad:</span>
              <span class="advisory-detail-value">${this.escapeHtml(item.modality)}</span>
            </div>
          </div>

          <div class="advisory-action-row advisory-actions-flex">
            ${status.isAccessible ? `
              <button 
                type="button" 
                class="btn-primary mock-teams-btn" 
                data-advisory-name="${this.escapeHtml(item.area)}" 
                data-advisory-link="${item.link}"
                style="padding: 0.65rem 1.25rem; font-size: var(--font-size-sm);"
              >
                <span>🚀 Ingresar a Teams</span>
              </button>
              <button 
                type="button" 
                class="btn-copy-link" 
                data-advisory-link="${item.link}"
                title="Copiar enlace directo de Teams"
              >
                <span class="copy-icon">📋</span>
                <span class="copy-label">Copiar enlace</span>
              </button>
            ` : `
              <button 
                type="button" 
                class="btn-teams-disabled" 
                data-advisory-id="${item.id}"
                title="Esta sala no está disponible fuera del horario de asesoría"
                aria-label="Sala de Teams no disponible para ${this.escapeHtml(item.area)}"
              >
                <span aria-hidden="true">🔒</span>
                <span>Sala cerrada (${this.escapeHtml(item.days)} ${this.escapeHtml(item.time)})</span>
              </button>
            `}
            <button 
              type="button" 
              class="btn-schedule-reminder" 
              data-advisory-id="${item.id}"
              title="Agendar recordatorio en Google Calendar o WhatsApp"
              aria-label="Agendar recordatorio para la asesoría de ${this.escapeHtml(item.area)}"
            >
              <span class="schedule-icon" aria-hidden="true">🔔</span>
              <span class="schedule-label">Recordatorio / Agendar</span>
            </button>
          </div>
        </article>
      `;
    }).join('');
  }

  attachEvents() {
    const searchInput = this.containerEl.querySelector('#advisory-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.refreshItemsContainer();
      });
    }

    const btnPrint = this.containerEl.querySelector('#btn-open-print-schedule');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        const filtered = filterAdvisories({
          area: this.selectedArea,
          day: this.selectedDay,
          query: this.searchQuery,
          favoriteIds: this.favoriteIds
        });
        PrintScheduleService.openPrintPreview(filtered.length > 0 ? filtered : null);
      });
    }

    const areaChips = this.containerEl.querySelectorAll('#advisory-filter-chips .filter-chip');
    areaChips.forEach(chip => {
      chip.addEventListener('click', () => {
        areaChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.selectedArea = chip.getAttribute('data-area');
        this.refreshItemsContainer();
      });
    });

    const dayChips = this.containerEl.querySelectorAll('#advisory-day-chips .day-chip');
    dayChips.forEach(chip => {
      chip.addEventListener('click', () => {
        dayChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.selectedDay = chip.getAttribute('data-day');
        this.refreshItemsContainer();
      });
    });

    this.attachButtonEvents();
  }

  refreshItemsContainer() {
    const itemsContainer = this.containerEl.querySelector('#advisory-items-container');
    if (itemsContainer) {
      itemsContainer.innerHTML = this.renderItemsHtml();
      this.attachButtonEvents();
    }
  }

  updateDayChipsBar() {
    const dayChipsBar = this.containerEl.querySelector('#advisory-day-chips');
    if (!dayChipsBar) return;
    
    dayChipsBar.innerHTML = ADVISORY_DAYS.map(day => {
      const isFavChip = day === '⭐ Mis Favoritas';
      const favCount = this.favoriteIds.length;
      return `
        <button 
          type="button" 
          class="day-chip ${isFavChip ? 'chip-fav' : ''} ${day === this.selectedDay ? 'active' : ''}" 
          data-day="${day}"
        >
          ${day} ${isFavChip && favCount > 0 ? `(${favCount})` : ''}
        </button>
      `;
    }).join('');

    const dayChips = dayChipsBar.querySelectorAll('.day-chip');
    dayChips.forEach(chip => {
      chip.addEventListener('click', () => {
        dayChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.selectedDay = chip.getAttribute('data-day');
        this.refreshItemsContainer();
      });
    });
  }

  attachButtonEvents() {
    const btns = this.containerEl.querySelectorAll('.mock-teams-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-advisory-name');
        const link = btn.getAttribute('data-advisory-link');
        modal.open({
          title: 'Acceso a Asesoría Virtual',
          bodyHtml: `
            <div style="text-align: center; padding: 0.5rem 0;">
              <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🎓</div>
              <h4 style="font-size: var(--font-size-base); color: var(--color-text-main); margin-bottom: 0.5rem;">Asesoría de ${name}</h4>
              <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: 1.25rem; line-height: 1.6;">
                Recuerda ingresar con tu cuenta de correo institucional de estudiante del Tecnológico de Antioquia (<strong>@correo.tdea.edu.co</strong>) en Microsoft Teams.
              </p>
              
              <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 380px; margin: 0 auto 1.25rem;">
                <a 
                  href="${link}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="btn-primary" 
                  style="text-decoration: none; justify-content: center; width: 100%; font-size: var(--font-size-sm);"
                >
                  🚀 Abrir sala en Microsoft Teams
                </a>
              </div>

              <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); background: var(--color-surface-hover); padding: 0.75rem; border-radius: var(--radius-md); text-align: left;">
                ¿Tienes dificultades para ingresar a esta sala? Escríbenos a: <br>
                <a href="mailto:auxcienciasbasicas2@tdea.edu.co" style="font-weight: 600; color: var(--tdea-green-primary);">auxcienciasbasicas2@tdea.edu.co</a>
              </div>
            </div>
          `
        });
      });
    });

    const copyBtns = this.containerEl.querySelectorAll('.btn-copy-link');
    copyBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        const link = btn.getAttribute('data-advisory-link');
        if (!link) return;

        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(link);
          } else {
            const tempInput = document.createElement('textarea');
            tempInput.value = link;
            tempInput.style.position = 'fixed';
            tempInput.style.left = '-9999px';
            document.body.appendChild(tempInput);
            tempInput.focus();
            tempInput.select();
            document.execCommand('copy');
            tempInput.remove();
          }

          btn.classList.add('copied');
          btn.innerHTML = `<span>✅</span> <span>¡Enlace copiado!</span>`;

          setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = `<span class="copy-icon">📋</span> <span class="copy-label">Copiar enlace</span>`;
          }, 2200);
        } catch (err) {
          console.error('Error al copiar enlace:', err);
        }
      });
    });

    const favBtns = this.containerEl.querySelectorAll('.btn-favorite');
    favBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const advisoryId = btn.getAttribute('data-advisory-id');
        if (!advisoryId) return;

        this.toggleFavorite(advisoryId);
        this.updateDayChipsBar();
        this.refreshItemsContainer();
      });
    });

    const reminderBtns = this.containerEl.querySelectorAll('.btn-schedule-reminder');
    reminderBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-advisory-id');
        const advisory = MOCK_ADVISORIES.find(a => a.id === id);
        if (advisory) {
          reminderModal.open(advisory);
        }
      });
    });

    const disabledBtns = this.containerEl.querySelectorAll('.btn-teams-disabled');
    disabledBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-advisory-id');
        const advisory = MOCK_ADVISORIES.find(a => a.id === id);
        if (!advisory) return;

        const status = getAdvisoryLiveStatus(advisory);
        modal.open({
          title: '🔒 Sala no disponible en este momento',
          bodyHtml: `
            <div style="text-align: center; padding: 0.5rem 0;">
              <div style="font-size: 2.75rem; margin-bottom: 0.65rem;">⏳</div>
              <h4 style="font-size: var(--font-size-base); color: var(--color-text-main); margin-bottom: 0.5rem; font-weight: 800;">
                Asesoría de ${this.escapeHtml(advisory.area)}
              </h4>
              <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: 1.15rem; line-height: 1.6; max-width: 440px; margin-left: auto; margin-right: auto;">
                ${status.statusMessage}
              </p>

              <div style="background: var(--color-surface-hover); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 0.85rem; margin-bottom: 1.15rem; text-align: left; font-size: var(--font-size-xs); color: var(--color-text-main);">
                <div><strong>📅 Día programado:</strong> ${this.escapeHtml(advisory.days)}</div>
                <div style="margin-top: 0.35rem;"><strong>⏰ Horario oficial:</strong> ${this.escapeHtml(advisory.time)}</div>
                <div style="margin-top: 0.35rem;"><strong>👨‍🏫 Docente / Asesor:</strong> ${this.escapeHtml(advisory.advisor)}</div>
              </div>

              <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: var(--radius-md); padding: 0.85rem 1rem; font-size: 0.82rem; color: #1E40AF; text-align: left; margin-bottom: 1.25rem; line-height: 1.5;">
                💡 <strong>¿Qué te recomendamos?</strong><br>
                Usa el botón <strong>«Recordatorio / Agendar»</strong> para añadir la alerta a tu <strong>Google Calendar</strong> o enviártela a <strong>WhatsApp</strong>. Así recibirás una notificación cuando sea hora de ingresar.
              </div>

              <button 
                type="button" 
                class="btn-primary" 
                id="btn-open-reminder-from-locked"
                style="width: 100%; justify-content: center; font-size: var(--font-size-sm);"
              >
                <span>🔔 Agendar Recordatorio Ahora</span>
              </button>
            </div>
          `
        });

        const openReminderBtn = document.getElementById('btn-open-reminder-from-locked');
        if (openReminderBtn) {
          openReminderBtn.addEventListener('click', () => {
            reminderModal.open(advisory);
          });
        }
      });
    });
  }

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
  }
}
