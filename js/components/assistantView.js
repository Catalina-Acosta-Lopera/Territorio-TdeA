/**
 * Renderizador de Vistas del Asistente
 * Asistente Virtual de Asesorías Territorio TdeA - Versión Institucional
 */

import { modal } from './modal.js';
import { AdvisoryList } from './advisoryList.js';
import { ResourcesView } from './resourcesView.js';
import { ResourceCard } from './resourceCard.js';
import { getResourceById, getResourcesByIds, RESOURCES_DATA } from '../data/resourcesData.js';
import { MOCK_ADVISORIES, getAdvisoryLiveStatus } from '../data/advisoryMockData.js';
import { FAQ_DATA, searchFaqs } from '../data/faqData.js';
import { ADVISORY_TIPS_DATA } from '../data/advisoryTipsData.js';
import { STUDENT_SERVICES_DATA } from '../data/studentServicesData.js?v=20260909_15';
import { getMascotSvgHtml, initMascotController } from './mascotController.js';
import { reminderModal } from './reminderModal.js';

/**
 * Correo oficial de atención para soporte y contacto institucional
 * =============================================================================
 * NOTA PARA EDICIÓN: Puedes cambiar tu correo institucional aquí directamente.
 * =============================================================================
 */
export const SUPPORT_CONTACT_EMAIL = 'auxcienciasbasicas2@tdea.edu.co';

/**
 * Genera la URL mailto institucional directa (únicamente con el correo de destino)
 */
function getTdeaMailtoUrl() {
  return `mailto:${SUPPORT_CONTACT_EMAIL}`;
}

/**
 * Genera el enlace directo para redactar en Outlook en la Web (Microsoft 365 Institucional TdeA)
 * Únicamente con el correo de destino (sin mensaje predeterminado)
 */
function getTdeaOutlookOfficeUrl() {
  return `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(SUPPORT_CONTACT_EMAIL)}`;
}

export class AssistantView {
  constructor(containerEl, onSelectOption) {
    this.containerEl = containerEl;
    this.onSelectOption = onSelectOption;
  }

  /**
   * Renderiza el estado del flujo actual
   * @param {Object} flowData Objeto de configuración del flujo actual
   */
  render(flowData) {
    if (!this.containerEl || !flowData) return;

    this.containerEl.className = 'stage-body animate-fade-in';

    switch (flowData.type) {
      case 'advisory_list':
        this.renderAdvisoryList(flowData);
        break;
      case 'resources_view':
        this.renderResourcesView(flowData);
        break;
      case 'campus_vital':
        this.renderCampusVitalView(flowData);
        break;
      case 'guidance':
        this.renderGuidanceView(flowData);
        break;
      case 'escalation':
        this.renderEscalationView(flowData);
        break;
      case 'contact':
        this.renderContactView(flowData);
        break;
      default:
        this.renderOptionsView(flowData);
        break;
    }
  }

  /**
   * Renderiza vista de opciones y preguntas con diseño institucional (Estilo Gobernación de Antioquia / TdeA)
   */
  renderOptionsView(flowData) {
    const isHome = flowData.id === 'home';

    if (isHome) {
      this.containerEl.innerHTML = `
        <!-- 1. HERO BANNER PRINCIPAL V2 CON MASCOTA DESTACADA Y BUSCADOR INTELIGENTE -->
        <section class="v2-hero-banner animate-fade-in" aria-label="Bienvenida al Asistente Virtual Territorio TdeA">
          <div class="v2-hero-top-row">
            <div class="v2-hero-mascot-wrapper" id="v2-hero-mascot-container" title="Asistente Virtual Territorio TdeA">
              ${getMascotSvgHtml({ id: 'mascota-tdea-hero', className: 'v2-hero-mascot-svg', isInteractive: true })}
            </div>

            <div class="v2-hero-info">
              <div class="v2-hero-badge">
                <span>🏛️</span>
                <span>Portal Institucional de Asesorías · DCBAC </span>
              </div>
              <h1 class="v2-hero-title">¡Hola! Soy tu Asistente Virtual<br>del Departamento de Ciencias Básicas y Áreas Comunes en el Territorio TdeA</h1>
              <p class="v2-hero-subtitle">
                Orientación académica en tiempo real, salas virtuales en Microsoft Teams, biblioteca de recursos y mesa de ayuda para estudiantes de territorio en el Tecnológico de Antioquia.
              </p>
            </div>
          </div>

          <!-- Buscador Inteligente en Tiempo Real -->
          <div class="v2-search-box">
            <div class="v2-search-input-container">
              <span class="v2-search-icon" aria-hidden="true">🔍</span>
              <input 
                type="text" 
                id="v2-hero-search-input" 
                class="v2-search-input" 
                placeholder="Escribe tu consulta: materia (Matemáticas, Física...), docente, Teams, guías..." 
                autocomplete="off"
                aria-label="Buscar en Territorio TdeA"
              />
              <button type="button" id="v2-hero-search-clear" class="v2-search-clear-btn" title="Limpiar búsqueda" aria-label="Limpiar búsqueda">✕</button>
              <button type="button" id="v2-hero-search-btn" class="v2-search-submit-btn" aria-label="Buscar">
                <span>Buscar</span>
              </button>
            </div>

            <!-- Desplegable de Resultados en Tiempo Real -->
            <div id="v2-search-dropdown" class="v2-search-dropdown" role="region" aria-label="Resultados de búsqueda"></div>

            <!-- Chips de Acceso Rápido debajo del buscador -->
            <div class="v2-search-chips" role="group" aria-label="Consultas frecuentes">
              <span class="v2-chip-label">Sugeridos:</span>
              <button type="button" class="v2-quick-chip v2-quick-chip-tutoria" data-open-tutoria="true" title="Abrir panel de TutorIA (Inteligencia Artificial TdeA)"><img src="assets/icons/tutoria-avatar.png" alt="" class="chip-tutoria-img" width="18" height="18"><span>TutorIA TdeA</span></button>
              <button type="button" class="v2-quick-chip" data-search="Cálculo">📐 Cálculo</button>
              <button type="button" class="v2-quick-chip" data-search="Física">⚡ Física</button>
              <button type="button" class="v2-quick-chip" data-flow="asesorias_disponibles">📅 Asesorías de hoy</button>
              <button type="button" class="v2-quick-chip" data-flow="recursos_estudiantes">📚 Guías y talleres</button>
              <button type="button" class="v2-quick-chip" data-flow="necesito_ayuda_asesoria">💻 Acceso Teams</button>
              <button type="button" class="v2-quick-chip v2-quick-chip-campus-vital" id="v2-chip-campus-vital" data-flow="campus_vital" data-open-campus-vital="true" title="Campus Vital: Bienestar emocional y afrontamiento universitario">❤️ Campus Vital</button>
            </div>
          </div>
        </section>

        <!-- 2. CUADRÍCULA PRINCIPAL DASHBOARD V2 (DESKTOP MULTICOLUMNA) -->
        <div class="dashboard-grid-layout">
          
          <!-- COLUMNA PRINCIPAL (68%) -->
          <div class="dashboard-main-column">

            <!-- Canales Principales Modernos -->
            <section aria-label="Canales y Opciones Principales">
              <div class="v2-section-header">
                <h2 class="v2-section-title">
                  <span>📌</span>
                  <span>Canales y Opciones Principales</span>
                </h2>
              </div>

              <div class="v2-channels-grid" role="list">
                ${(flowData.options || []).map((opt, idx) => {
        const colorClass = idx === 0 ? 'green' : idx === 1 ? 'purple' : idx === 2 ? 'amber' : 'blue';
        return `
                    <button 
                      type="button" 
                      class="v2-channel-card" 
                      data-target-flow="${opt.targetFlow}"
                      role="listitem"
                      aria-label="${opt.title}"
                    >
                      <div class="v2-channel-icon ${colorClass}" aria-hidden="true">${opt.icon || '📌'}</div>
                      <div class="v2-channel-content">
                        <div class="v2-channel-title">
                          <span>${opt.title}</span>
                          <span class="v2-channel-arrow" aria-hidden="true">›</span>
                        </div>
                        <p class="v2-channel-desc">${opt.description || ''}</p>
                      </div>
                    </button>
                  `;
      }).join('')}
              </div>
            </section>

            <!-- Sugerencias antes de iniciar una asesoría -->
            <section class="gov-announcement-section animate-fade-in" aria-label="Sugerencias antes de iniciar una asesoría">
              <div class="gov-announcement-header">
                <div class="gov-announcement-icon-badge" aria-hidden="true">💡</div>
                <div class="gov-announcement-text">
                  <span class="gov-announcement-tag">ORIENTACIÓN INSTITUCIONAL</span>
                  <h3 class="gov-announcement-title">Sugerencias antes de iniciar una asesoría</h3>
                  <p class="gov-announcement-subtitle">Recomendaciones clave para aprovechar al máximo tu espacio de acompañamiento académico.</p>
                </div>
              </div>

              <div class="advisory-tips-grid" role="list">
                ${ADVISORY_TIPS_DATA.map(tip => `
                  <div class="advisory-tip-card" role="listitem">
                    <div class="advisory-tip-card-header">
                      <span class="advisory-tip-icon" aria-hidden="true">${tip.icon}</span>
                      <h4 class="advisory-tip-title">${tip.title}</h4>
                    </div>
                    <p class="advisory-tip-desc">${tip.description}</p>
                  </div>
                `).join('')}
              </div>
            </section>

            <!-- Ecosistema Digital: Estudiantes TdeA -->
            <section class="gov-students-section animate-fade-in" aria-label="Estudiantes TdeA">
              <div class="gov-students-header">
                <h3 class="gov-students-main-title">Estudiantes TdeA</h3>
                <p class="gov-students-subtitle">Accesos directos a las plataformas y servicios oficiales de la institución.</p>
              </div>

              <div class="gov-students-accordion" role="region" aria-label="Plataformas y servicios para estudiantes">
                ${STUDENT_SERVICES_DATA.map(item => `
                  <div class="gov-accordion-item ${item.isOpen ? 'is-open' : ''}" data-service-id="${item.id}">
                    <button 
                      type="button" 
                      class="gov-accordion-header" 
                      aria-expanded="${item.isOpen ? 'true' : 'false'}"
                      aria-controls="accordion-content-${item.id}"
                    >
                      <span class="gov-accordion-icon" aria-hidden="true">
                        ${item.isOpen ? '⊖' : '⊕'}
                      </span>
                      <span class="gov-accordion-title">${item.title}</span>
                    </button>
                    <div 
                      id="accordion-content-${item.id}" 
                      class="gov-accordion-collapse"
                      style="${item.isOpen ? 'display: block;' : 'display: none;'}"
                    >
                      <div class="gov-accordion-body">
                        <p class="gov-accordion-desc">${item.description}</p>
                        <a 
                          href="${item.url}" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          class="btn-tdea-green-action"
                          aria-label="${item.buttonLabel} en una nueva pestaña"
                        >
                          <span>${item.buttonLabel}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>

          </div>

          <!-- PANEL LATERAL COMPANION (32% EN ESCRITORIO) -->
          <aside class="dashboard-side-column" aria-label="Panel lateral de acompañamiento en vivo">
            
            <!-- Widget Companion: TutorIA Inteligencia Artificial -->
            <div class="v2-side-widget tutoria-side-widget">
              <div class="v2-side-widget-header">
                <h3 class="v2-side-widget-title">
                  <img src="assets/icons/tutoria-avatar.png" alt="" class="tutoria-side-icon-img" width="24" height="24">
                  <span>TutorIA · Acompañamiento Inteligente</span>
                </h3>
                <span class="status-dot" aria-hidden="true" title="Servicio activo"></span>
              </div>

              <div class="tutoria-side-body">
                <p class="tutoria-side-desc">
                  Tu compañero académico inteligente con tutorías interactivas adaptadas a tu facultad y malla curricular del TdeA.
                </p>
                <button 
                  type="button" 
                  class="tutoria-side-launch-btn"
                  data-open-tutoria="true"
                  aria-label="Abrir panel interactivo de TutorIA TdeA"
                >
                  <span>🚀 Acceder a TutorIA</span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>

            <!-- Widget 1: Asesorías en Vivo / Hoy -->
            <div class="v2-side-widget">
              <div class="v2-side-widget-header">
                <h3 class="v2-side-widget-title">
                  <span>📅</span>
                  <span>Asesorías en Vivo / Hoy</span>
                </h3>
                <span class="status-dot" aria-hidden="true"></span>
              </div>

              <div class="v2-side-advisories-list">
                ${this.getLiveOrUpcomingAdvisoriesHtml()}
              </div>

              <a href="#/asesorias_disponibles" class="v2-side-widget-link">
                Ver todas las asesorías semanales (38) →
              </a>
            </div>

            <!-- Widget 2: Preguntas Frecuentes Más Consultadas -->
            <div class="v2-side-widget">
              <div class="v2-side-widget-header">
                <h3 class="v2-side-widget-title">
                  <span>💡</span>
                  <span>Preguntas Frecuentes</span>
                </h3>
              </div>

              <div class="v2-quick-faqs-list">
                ${this.getTopFaqsWidgetHtml()}
              </div>

              <a href="#/necesito_ayuda_asesoria" class="v2-side-widget-link">
                Ver centro de ayuda completo →
              </a>
            </div>

            <!-- Widget 3: Mesa de Ayuda y Contacto Oficial -->
            <div class="v2-side-widget">
              <div class="v2-side-widget-header">
                <h3 class="v2-side-widget-title">
                  <span>📞</span>
                  <span>Mesa de Ayuda</span>
                </h3>
              </div>

              <div class="v2-contact-widget-box">
                <div style="font-size: 0.78rem; color: var(--color-text-secondary); font-weight: 600;">
                  Atención oficial Ciencias Básicas:
                </div>
                <div class="v2-contact-widget-email">${SUPPORT_CONTACT_EMAIL}</div>
                <a 
                  href="${getTdeaMailtoUrl()}" 
                  class="v2-contact-widget-btn"
                  aria-label="Escribir correo de soporte a ${SUPPORT_CONTACT_EMAIL}"
                >
                  <span>✉️ Redactar correo</span>
                </a>
              </div>
            </div>

          </aside>

        </div>
      `;

      this.attachOptionListeners();
      this.attachHomeEvents();
      return;
    }

    // Pantallas internas de selección (Submenús V2 con layout amplio)
    this.containerEl.innerHTML = `
      <div class="gov-step-header animate-fade-in">
        ${getMascotSvgHtml({ id: 'mascota-tdea-step', className: 'gov-step-mascot-svg', isInteractive: true })}
        <div class="gov-step-text">
          <h2 class="gov-step-title">${flowData.greeting || 'Asistente de Asesorías TdeA'}</h2>
          <p class="gov-step-prompt">${flowData.prompt || ''}</p>
          ${flowData.question ? `<span class="gov-step-question">${flowData.question}</span>` : ''}
        </div>
      </div>

      <div class="v2-channels-grid" role="list">
        ${(flowData.options || []).map(opt => `
          <button 
            type="button" 
            class="v2-channel-card" 
            data-target-flow="${opt.targetFlow}"
            role="listitem"
            aria-label="${opt.title}"
          >
            <div class="v2-channel-icon green" aria-hidden="true">${opt.icon || '📌'}</div>
            <div class="v2-channel-content">
              <div class="v2-channel-title">
                <span>${opt.title}</span>
                <span class="v2-channel-arrow" aria-hidden="true">›</span>
              </div>
              ${opt.description ? `<p class="v2-channel-desc">${opt.description}</p>` : ''}
            </div>
          </button>
        `).join('')}
      </div>
    `;

    this.attachOptionListeners();
    initMascotController(this.containerEl, 'mascota-tdea-step');
  }

  /**
   * Genera el HTML para el widget de asesorías en vivo / programadas de hoy
   */
  getLiveOrUpcomingAdvisoriesHtml() {
    const liveItems = MOCK_ADVISORIES.filter(item => {
      const status = getAdvisoryLiveStatus(item);
      return status.isLive;
    });

    const todayItems = MOCK_ADVISORIES.filter(item => {
      const status = getAdvisoryLiveStatus(item);
      return status.isToday && !status.isPast;
    });

    let selected = [...liveItems, ...todayItems];
    if (selected.length < 3) {
      const additional = MOCK_ADVISORIES.filter(item => !selected.includes(item));
      selected = selected.concat(additional.slice(0, 3 - selected.length));
    } else {
      selected = selected.slice(0, 3);
    }

    return selected.map(item => {
      const status = getAdvisoryLiveStatus(item);
      return `
        <div class="v2-live-advisory-item">
          <div class="v2-live-advisory-top">
            <span class="badge badge-institutional" style="font-size: 0.72rem;">${this.escapeHtml(item.area)}</span>
            <span class="${status.badgeClass}" style="font-size: 0.7rem; padding: 0.2rem 0.5rem;">
              ${status.isLive ? '<span class="pulse-dot"></span>' : ''}
              ${status.badgeText}
            </span>
          </div>
          <div class="v2-live-advisory-name">${this.escapeHtml(item.advisor || 'Docente de Ciencias Básicas')}</div>
          <div class="v2-live-advisory-meta">
            <span>📅 ${this.escapeHtml(item.days)}</span>
            <span>·</span>
            <span>⏰ ${this.escapeHtml(item.time)}</span>
          </div>
          <div class="v2-live-advisory-actions" style="display: flex; gap: 0.4rem; margin-top: 0.65rem;">
            ${status.isAccessible ? `
              <a 
                href="${item.link}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="v2-live-btn-teams"
                style="flex: 1; margin-top: 0;"
                aria-label="Unirse a la sala Teams de ${this.escapeHtml(item.area)}"
              >
                <span>💻 Unirme en Teams</span>
              </a>
            ` : `
              <button
                type="button"
                class="v2-live-btn-teams-disabled"
                data-advisory-id="${item.id}"
                title="Sala cerrada fuera del horario de asesoría"
                aria-label="Sala no disponible para ${this.escapeHtml(item.area)}"
              >
                <span aria-hidden="true">🔒</span>
                <span>Sala cerrada (${this.escapeHtml(item.time)})</span>
              </button>
            `}
            <button
              type="button"
              class="v2-live-btn-reminder"
              data-advisory-id="${item.id}"
              title="Agendar recordatorio en Google Calendar o WhatsApp"
              aria-label="Agendar recordatorio para la asesoría de ${this.escapeHtml(item.area)}"
            >
              <span aria-hidden="true">🔔</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Genera el HTML para las 3 preguntas frecuentes más consultadas
   */
  getTopFaqsWidgetHtml() {
    const topFaqs = (FAQ_DATA || []).slice(0, 3);
    return topFaqs.map((faq, idx) => `
      <div class="v2-quick-faq-item" id="quick-faq-${idx}">
        <button 
          type="button" 
          class="v2-quick-faq-trigger" 
          aria-expanded="false" 
          data-faq-idx="${idx}"
        >
          <span>${this.escapeHtml(faq.question)}</span>
          <span style="font-size: 0.85rem; color: var(--tdea-green-primary); font-weight: bold;">+</span>
        </button>
        <div class="v2-quick-faq-answer">
          <p>${this.escapeHtml(faq.answer)}</p>
        </div>
      </div>
    `).join('');
  }

  /**
   * Conecta eventos específicos de la pantalla de Inicio (Versión 2 Dashboard)
   */
  attachHomeEvents() {
    // 1. Inicializar controlador interactivo de la mascota vectorial
    initMascotController(this.containerEl, 'mascota-tdea-hero');

    // 2. Buscador Inteligente en Tiempo Real del Hero (V2)
    const searchInput = this.containerEl.querySelector('#v2-hero-search-input');
    const searchDropdown = this.containerEl.querySelector('#v2-search-dropdown');
    const searchClearBtn = this.containerEl.querySelector('#v2-hero-search-clear');
    const searchSubmitBtn = this.containerEl.querySelector('#v2-hero-search-btn');

    const handleSearch = (query) => {
      const q = (query || '').trim().toLowerCase();
      if (!q || q.length < 2) {
        if (searchDropdown) {
          searchDropdown.style.display = 'none';
          searchDropdown.innerHTML = '';
        }
        if (searchClearBtn) searchClearBtn.style.display = 'none';
        return;
      }

      if (searchClearBtn) searchClearBtn.style.display = 'inline-flex';

      // 1. Buscar en Asesorías
      const matchingAdvisories = MOCK_ADVISORIES.filter(adv =>
        (adv.area && adv.area.toLowerCase().includes(q)) ||
        (adv.advisor && adv.advisor.toLowerCase().includes(q)) ||
        (adv.days && adv.days.toLowerCase().includes(q))
      ).slice(0, 3);

      // 2. Buscar en Recursos
      const matchingResources = (RESOURCES_DATA || []).filter(res =>
        (res.title && res.title.toLowerCase().includes(q)) ||
        (res.description && res.description.toLowerCase().includes(q)) ||
        (res.category && res.category.toLowerCase().includes(q))
      ).slice(0, 2);

      // 3. Buscar en FAQs
      const matchingFaqs = searchFaqs(q).slice(0, 2);

      // 4. Buscar coincidencia con TutorIA / Inteligencia Artificial
      const matchesTutoria = q.includes('ia') || q.includes('tutor') || q.includes('turtur') || 
                             q.includes('inteligen') || q.includes('pregunta') || q.includes('duda') || 
                             q.includes('robot') || q.includes('studio');

      const totalCount = (matchesTutoria ? 1 : 0) + matchingAdvisories.length + matchingResources.length + matchingFaqs.length;

      if (totalCount === 0) {
        searchDropdown.innerHTML = `
          <div style="padding: 1.25rem 1rem; text-align: center; color: var(--color-text-muted); font-size: 0.88rem;">
            No encontramos coincidencias para "<strong>${this.escapeHtml(q)}</strong>".<br>
            <span style="font-size: 0.8rem;">Prueba buscando: <em>TutorIA, Cálculo, Física, Teams, Guías o Docentes.</em></span>
          </div>
        `;
        searchDropdown.style.display = 'block';
        return;
      }

      let html = '';

      if (matchesTutoria) {
        html += `<div class="v2-search-category-title">🎓 Inteligencia Artificial TdeA</div>`;
        html += `
          <a href="https://asesorias-territorio-dcbac-tdea.ai.studio/" target="_blank" rel="noopener noreferrer" class="v2-search-result-item v2-search-result-tutoria" style="text-decoration: none;">
            <img src="assets/icons/tutoria-avatar.png" alt="" class="v2-search-tutoria-img" width="28" height="28">
            <div class="v2-search-result-text">
              <div class="v2-search-result-title" style="color: #00843D; font-weight: 800; display: flex; align-items: center; gap: 6px;">
                <span>TutorIA · Acompañamiento Académico Inteligente</span>
              </div>
              <div class="v2-search-result-desc">Tutorías académicas adaptadas a tu facultad · Departamento de Ciencias Básicas y Áreas Comunes</div>
            </div>
            <span class="v2-channel-arrow" style="font-size: 1rem; color: #00843D;">↗</span>
          </a>
        `;
      }

      if (matchingAdvisories.length > 0) {
        html += `<div class="v2-search-category-title">📅 Asesorías Académicas (${matchingAdvisories.length})</div>`;
        html += matchingAdvisories.map(adv => `
          <div class="v2-search-result-item" data-action="flow" data-flow="asesorias_disponibles" data-search="${this.escapeHtml(adv.area)}">
            <span class="v2-search-result-icon">📅</span>
            <div class="v2-search-result-text">
              <div class="v2-search-result-title">Asesoría de ${this.escapeHtml(adv.area)}</div>
              <div class="v2-search-result-desc">${this.escapeHtml(adv.advisor)} · ${this.escapeHtml(adv.days)} (${this.escapeHtml(adv.time)})</div>
            </div>
            <span class="v2-channel-arrow" style="font-size: 1rem;">›</span>
          </div>
        `).join('');
      }

      if (matchingResources.length > 0) {
        html += `<div class="v2-search-category-title">🎓 Recursos de Apoyo (${matchingResources.length})</div>`;
        html += matchingResources.map(res => `
          <div class="v2-search-result-item" data-action="flow" data-flow="recursos_estudiantes">
            <span class="v2-search-result-icon">📚</span>
            <div class="v2-search-result-text">
              <div class="v2-search-result-title">${this.escapeHtml(res.title)}</div>
              <div class="v2-search-result-desc">${this.escapeHtml(res.category)} · Formato ${this.escapeHtml(res.type)}</div>
            </div>
            <span class="v2-channel-arrow" style="font-size: 1rem;">›</span>
          </div>
        `).join('');
      }

      if (matchingFaqs.length > 0) {
        html += `<div class="v2-search-category-title">💡 Preguntas Frecuentes (${matchingFaqs.length})</div>`;
        html += matchingFaqs.map(faq => `
          <div class="v2-search-result-item" data-action="faq" data-faq-id="${faq.id}">
            <span class="v2-search-result-icon">❓</span>
            <div class="v2-search-result-text">
              <div class="v2-search-result-title">${this.escapeHtml(faq.question)}</div>
              <div class="v2-search-result-desc">${this.escapeHtml(faq.answer.substring(0, 90))}...</div>
            </div>
            <span class="v2-channel-arrow" style="font-size: 1rem;">›</span>
          </div>
        `).join('');
      }

      searchDropdown.innerHTML = html;
      searchDropdown.style.display = 'block';

      // Clics en resultados del buscador
      searchDropdown.querySelectorAll('.v2-search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          const action = item.getAttribute('data-action');
          if (action === 'flow') {
            const flow = item.getAttribute('data-flow');
            searchDropdown.style.display = 'none';
            this.onSelectOption(flow);
          } else if (action === 'faq') {
            const faqId = item.getAttribute('data-faq-id');
            const faqObj = FAQ_DATA.find(f => f.id === faqId);
            searchDropdown.style.display = 'none';
            if (faqObj) {
              modal.open({
                title: faqObj.question,
                content: `
                  <div style="font-size: 0.95rem; line-height: 1.6; color: var(--color-text-main); margin-bottom: 1.25rem;">
                    ${this.escapeHtml(faqObj.answer)}
                  </div>
                  ${faqObj.actionLink ? `
                    <div style="margin-top: 1rem;">
                      <a href="${faqObj.actionLink.url}" target="_blank" rel="noopener noreferrer" class="btn-tdea-green-action">
                        ${this.escapeHtml(faqObj.actionLink.label)}
                      </a>
                    </div>
                  ` : ''}
                `
              });
            }
          }
        });
      });
    };

    if (searchInput) {
      searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (searchDropdown) searchDropdown.style.display = 'none';
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const q = searchInput.value.trim();
          if (q) {
            this.onSelectOption('asesorias_disponibles');
          }
        }
      });
    }

    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        handleSearch('');
      });
    }

    if (searchSubmitBtn) {
      searchSubmitBtn.addEventListener('click', () => {
        const q = searchInput ? searchInput.value.trim() : '';
        if (q) {
          this.onSelectOption('asesorias_disponibles');
        }
      });
    }

    // Chips de sugerencia
    const quickChips = this.containerEl.querySelectorAll('.v2-quick-chip');
    quickChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const flow = chip.getAttribute('data-flow');
        const searchTerm = chip.getAttribute('data-search');
        if (flow) {
          this.onSelectOption(flow);
        } else if (searchTerm) {
          if (searchInput) {
            searchInput.value = searchTerm;
            searchInput.focus();
            handleSearch(searchTerm);
          }
        }
      });
    });

    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (searchDropdown && !e.target.closest('.v2-search-box')) {
        searchDropdown.style.display = 'none';
      }
    });

    // Acordeón de FAQs del panel lateral
    const faqTriggers = this.containerEl.querySelectorAll('.v2-quick-faq-trigger');
    faqTriggers.forEach(btn => {
      btn.addEventListener('click', () => {
        const parent = btn.closest('.v2-quick-faq-item');
        if (parent) {
          const wasOpen = parent.classList.contains('is-open');
          this.containerEl.querySelectorAll('.v2-quick-faq-item').forEach(item => {
            item.classList.remove('is-open');
            const b = item.querySelector('.v2-quick-faq-trigger');
            if (b) {
              b.setAttribute('aria-expanded', 'false');
              const span = b.querySelector('span:last-child');
              if (span) span.textContent = '+';
            }
          });

          if (!wasOpen) {
            parent.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');
            const span = btn.querySelector('span:last-child');
            if (span) span.textContent = '−';
          }
        }
      });
    });

    // 3. Botón de FAQ flotante
    const openFloatingFaqBtn = this.containerEl.querySelector('#btn-open-floating-faq');
    if (openFloatingFaqBtn) {
      openFloatingFaqBtn.addEventListener('click', () => {
        if (window.__tdeaFaqChat) {
          window.__tdeaFaqChat.open();
        }
      });
    }

    // 3.1 Botones de recordatorio en widget lateral de asesorías en vivo
    const liveReminderBtns = this.containerEl.querySelectorAll('.v2-live-btn-reminder');
    liveReminderBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-advisory-id');
        const advisory = MOCK_ADVISORIES.find(a => a.id === id);
        if (advisory) {
          reminderModal.open(advisory);
        }
      });
    });

    // 3.2 Botones de sala cerrada en widget lateral
    const liveDisabledBtns = this.containerEl.querySelectorAll('.v2-live-btn-teams-disabled');
    liveDisabledBtns.forEach(btn => {
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
                id="btn-open-reminder-from-locked-home"
                style="width: 100%; justify-content: center; font-size: var(--font-size-sm);"
              >
                <span>🔔 Agendar Recordatorio Ahora</span>
              </button>
            </div>
          `
        });

        const openReminderBtn = document.getElementById('btn-open-reminder-from-locked-home');
        if (openReminderBtn) {
          openReminderBtn.addEventListener('click', () => {
            reminderModal.open(advisory);
          });
        }
      });
    });

    // 4. Acordeón interactivo de Estudiantes TdeA (+)
    const accordionItems = this.containerEl.querySelectorAll('.gov-accordion-item');
    accordionItems.forEach(item => {
      const headerBtn = item.querySelector('.gov-accordion-header');
      const collapseEl = item.querySelector('.gov-accordion-collapse');
      const iconEl = item.querySelector('.gov-accordion-icon');

      if (headerBtn && collapseEl && iconEl) {
        headerBtn.addEventListener('click', () => {
          const isOpen = item.classList.contains('is-open');

          accordionItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('is-open');
              const otherBtn = otherItem.querySelector('.gov-accordion-header');
              const otherCollapse = otherItem.querySelector('.gov-accordion-collapse');
              const otherIcon = otherItem.querySelector('.gov-accordion-icon');
              if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
              if (otherCollapse) otherCollapse.style.display = 'none';
              if (otherIcon) otherIcon.textContent = '⊕';
            }
          });

          if (isOpen) {
            item.classList.remove('is-open');
            headerBtn.setAttribute('aria-expanded', 'false');
            collapseEl.style.display = 'none';
            iconEl.textContent = '⊕';
          } else {
            item.classList.add('is-open');
            headerBtn.setAttribute('aria-expanded', 'true');
            collapseEl.style.display = 'block';
            iconEl.textContent = '⊖';
          }
        });
      }
    });
  }

  /**
   * Renderiza una pantalla de orientación con video, recursos y feedback
   */
  renderGuidanceView(flowData) {
    let videoBlockHtml = '';
    const videoInfo = flowData.videoData;

    if (videoInfo) {
      videoBlockHtml = `
        <div class="tutorial-preview-card">
          <div class="tutorial-thumbnail-placeholder">
            <button type="button" class="tutorial-play-btn" id="btn-play-guidance-video" title="Reproducir tutorial: ${videoInfo.title}">
              <span>▶</span>
            </button>
            <div style="font-size: var(--font-size-sm); font-weight: 600; color: #E2E8F0;">
              Video Orientador Institucional
            </div>
            <div style="font-size: var(--font-size-xs); color: #94A3B8; margin-top: 0.25rem;">
              ${videoInfo.placeholder || 'Video pendiente de carga'}
            </div>
          </div>
          <div class="tutorial-info-bar">
            <span class="tutorial-title-text">${videoInfo.title}</span>
            <button type="button" class="btn-primary" id="btn-action-guidance-video" style="padding: 0.45rem 1.15rem; font-size: var(--font-size-xs);">
              <span>▶ Ver tutorial</span>
            </button>
          </div>
        </div>
      `;
    }

    let quickActionHtml = '';
    if (flowData.quickAction) {
      quickActionHtml = `
        <div style="margin: 1.25rem 0;">
          <button type="button" class="btn-primary" id="btn-quick-action" data-target-flow="${flowData.quickAction.targetFlow}">
            <span>${flowData.quickAction.label}</span>
          </button>
        </div>
      `;
    }

    // Recursos relacionados
    let relatedResourcesHtml = '';
    if (flowData.relatedResourceIds && flowData.relatedResourceIds.length > 0) {
      const relatedList = getResourcesByIds(flowData.relatedResourceIds);
      if (relatedList.length > 0) {
        relatedResourcesHtml = `
          <div class="related-resources-section" style="margin-top: 1.75rem;">
            <div class="related-resources-title">
              <span>📚</span>
              <span>Recursos y tutoriales relacionados:</span>
            </div>
            <div class="related-resources-grid">
              ${relatedList.map(res => ResourceCard.render(res)).join('')}
            </div>
          </div>
        `;
      }
    }

    // Soporte técnico institucional directo para incidencias
    let supportBoxHtml = '';
    if (flowData.supportContact) {
      supportBoxHtml = `
        <div class="escalation-box" style="margin-top: 1.5rem; text-align: left;">
          <div class="escalation-header">
            <span style="font-size: 1.35rem;">🛠️</span>
            <div>
              <div class="escalation-title">Soporte Técnico Institucional</div>
              <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: 0.35rem;">
                ${flowData.supportContact.message || 'Si la incidencia técnica persiste, comunícate con:'}
              </p>
              <a href="mailto:${SUPPORT_CONTACT_EMAIL}" class="escalation-email">${SUPPORT_CONTACT_EMAIL}</a>
            </div>
          </div>
        </div>
      `;
    }

    let html = `
      <div class="guidance-card">
        <div class="guidance-header">
          <span style="font-size: 1.75rem;" aria-hidden="true">💡</span>
          <h3 class="guidance-title">${flowData.title}</h3>
        </div>
        <p style="font-size: var(--font-size-base); color: var(--color-text-secondary); margin-bottom: 1rem; font-weight: 500;">
          ${flowData.summary || ''}
        </p>
        <div class="guidance-body">
          ${flowData.content || ''}
        </div>

        ${videoBlockHtml}
        ${quickActionHtml}
        ${relatedResourcesHtml}
        ${supportBoxHtml}

        <!-- Sistema Interactivo de Retroalimentación del Estudiante -->
        <div class="feedback-card" id="feedback-block">
          <div class="feedback-prompt" id="feedback-prompt-text">¿Te fue útil esta información?</div>
          <div class="feedback-buttons" id="feedback-buttons-row">
            <button type="button" class="btn-feedback btn-feedback-yes" id="btn-feedback-yes">
              <span>👍 Sí, resolví mi duda</span>
            </button>
            <button type="button" class="btn-feedback btn-feedback-no" id="btn-feedback-no">
              <span>👎 Necesito más ayuda</span>
            </button>
          </div>
          <div id="feedback-response-container" style="display: none; margin-top: 1rem;"></div>
        </div>

        <div style="margin-top: 1.75rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button type="button" class="btn-secondary" id="btn-guidance-back">
            <span>← Volver</span>
          </button>
          <button type="button" class="btn-secondary" id="btn-guidance-home">
            <span>🏠 Ir al inicio</span>
          </button>
        </div>
      </div>
    `;

    this.containerEl.innerHTML = html;

    // Attach eventos de videos
    if (videoInfo) {
      const openVideoModal = () => {
        modal.open({
          title: videoInfo.title,
          bodyHtml: `
            <div style="text-align: center; padding: 0.5rem 0;">
              <div style="background: #0F172A; border-radius: var(--radius-lg); height: 260px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #ffffff; padding: 1.5rem; margin-bottom: 1.25rem;">
                <div style="font-size: 3rem; margin-bottom: 0.75rem;">🎬</div>
                <h4 style="font-size: var(--font-size-base); font-weight: 600; margin-bottom: 0.5rem; color: #F8FAFC;">
                  ${videoInfo.title}
                </h4>
                <p style="font-size: var(--font-size-xs); color: #94A3B8; max-width: 420px; line-height: 1.6;">
                  ${videoInfo.placeholder || 'Video orientador institucional en preparación'}
                </p>
              </div>

              <div style="text-align: left; background: var(--color-surface-hover); padding: 1rem; border-radius: var(--radius-md); font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 1.6;">
                <strong>Orientación institucional:</strong>
                <p style="margin-top: 0.25rem;">
                  Este espacio alojará el reproductor oficial del video tutorial producido por la Coordinación de Asesorías Académicas de Territorio TdeA.
                </p>
              </div>

              <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: 1rem;">
                ¿Continúas con dificultades? Escríbenos a: 
                <a href="${getTdeaMailtoUrl('Consulta sobre video orientador - Asesorías TdeA')}" style="font-weight: 600; color: var(--tdea-green-primary);">${SUPPORT_CONTACT_EMAIL}</a>
              </div>
            </div>
          `
        });
      };

      const playBtn = this.containerEl.querySelector('#btn-play-guidance-video');
      const actionBtn = this.containerEl.querySelector('#btn-action-guidance-video');
      if (playBtn) playBtn.addEventListener('click', openVideoModal);
      if (actionBtn) actionBtn.addEventListener('click', openVideoModal);
    }

    // Attach eventos a recursos relacionados
    ResourceCard.attachEvents(this.containerEl, getResourceById);

    // Attach eventos de feedback interactivo
    this.attachFeedbackEvents();

    // Acción rápida
    if (flowData.quickAction) {
      const qaBtn = this.containerEl.querySelector('#btn-quick-action');
      if (qaBtn) {
        qaBtn.addEventListener('click', () => {
          this.onSelectOption(flowData.quickAction.targetFlow);
        });
      }
    }

    // Botones de retorno
    const backBtn = this.containerEl.querySelector('#btn-guidance-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.history.back();
      });
    }

    const homeBtn = this.containerEl.querySelector('#btn-guidance-home');
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        this.onSelectOption('home');
      });
    }
  }

  /**
   * Conecta los eventos del bloque de feedback interactivo
   */
  attachFeedbackEvents() {
    const yesBtn = this.containerEl.querySelector('#btn-feedback-yes');
    const noBtn = this.containerEl.querySelector('#btn-feedback-no');
    const buttonsRow = this.containerEl.querySelector('#feedback-buttons-row');
    const promptText = this.containerEl.querySelector('#feedback-prompt-text');
    const responseContainer = this.containerEl.querySelector('#feedback-response-container');

    if (yesBtn && buttonsRow && responseContainer) {
      yesBtn.addEventListener('click', () => {
        buttonsRow.style.display = 'none';
        promptText.style.display = 'none';
        responseContainer.style.display = 'block';
        responseContainer.innerHTML = `
          <div class="feedback-success-box">
            <span style="font-size: 1.5rem;">🎉</span>
            <div>
              <div style="font-weight: 700; color: var(--tdea-green-dark); margin-bottom: 0.25rem;">
                ¡Excelente! Nos alegra haber resuelto tu duda.
              </div>
              <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: 0.75rem;">
                Estamos comprometidos con tu éxito académico en las asesorías de Territorio TdeA.
              </p>
              <button type="button" class="btn-secondary" id="btn-feedback-return-home" style="padding: 0.4rem 0.9rem; font-size: var(--font-size-xs);">
                <span>🏠 Volver al inicio</span>
              </button>
            </div>
          </div>
        `;

        const retHome = responseContainer.querySelector('#btn-feedback-return-home');
        if (retHome) {
          retHome.addEventListener('click', () => this.onSelectOption('home'));
        }
      });
    }

    if (noBtn && buttonsRow && responseContainer) {
      noBtn.addEventListener('click', () => {
        buttonsRow.style.display = 'none';
        promptText.style.display = 'none';
        responseContainer.style.display = 'block';
        responseContainer.innerHTML = `
          <div class="escalation-box" style="margin-top: 0.5rem; text-align: left;">
            <div class="escalation-header">
              <span style="font-size: 1.35rem;">✉️</span>
              <div>
                <div class="escalation-title">No te preocupes, estamos para ayudarte personalmente</div>
                <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: 0.5rem;">
                  Comunícate con la Coordinación de Asesorías Académicas para recibir orientación individual:
                </p>
                <div style="font-size: var(--font-size-sm); margin-bottom: 0.25rem;">
                  <strong>Correo de atención:</strong><br>
                  <a href="${getTdeaMailtoUrl()}" class="escalation-email">${SUPPORT_CONTACT_EMAIL}</a>
                </div>
              </div>
            </div>
          </div>
        `;
      });
    }
  }

  /**
   * Renderiza vista de la biblioteca de recursos estudiantiles
   */
  renderResourcesView(flowData) {
    const resourcesView = new ResourcesView(this.containerEl, (flowId) => this.onSelectOption(flowId));
    resourcesView.render();
  }

  /**
   * Renderiza vista de Campus Vital (Bienestar emocional y afrontamiento universitario)
   */
  renderCampusVitalView(flowData) {
    const campusResources = RESOURCES_DATA.filter(r => r.category === 'campus_vital');
    this.containerEl.innerHTML = `
      <div class="campus-vital-stage-view">
        <div class="assistant-message-card campus-vital-message-card" style="margin-bottom: 1.5rem; background: linear-gradient(135deg, #022B14 0%, #064E24 60%, #08632E 100%); color: #FFFFFF; border-radius: var(--radius-lg); padding: 1.75rem 2rem; display: flex; align-items: center; gap: 1.5rem; box-shadow: 0 10px 25px rgba(0, 56, 22, 0.25);">
          <div class="campus-vital-stage-avatar-wrap" style="width: 76px; height: 76px; flex-shrink: 0; background: rgba(255, 255, 255, 0.12); border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid rgba(116, 214, 51, 0.5);">
            <img src="assets/icons/campus-vital-mascot.svg" alt="Mascota Campus Vital TdeA" width="62" height="62" style="object-fit: contain;">
          </div>
          <div class="assistant-text-block">
            <div style="display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(116, 214, 51, 0.2); color: #A3E635; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.76rem; font-weight: 800; letter-spacing: 0.04em; margin-bottom: 0.45rem;">
              <span>🌱</span>
              <span>BIENESTAR INSTITUCIONAL · CIENCIAS BÁSICAS</span>
            </div>
            <h2 class="assistant-greeting" style="color: #FFFFFF; font-weight: 800; font-size: 1.45rem; margin: 0 0 0.4rem 0;">
              Campus Vital: Bienestar Emocional y Afrontamiento Universitario
            </h2>
            <p class="assistant-prompt" style="color: rgba(255, 255, 255, 0.9); font-size: 0.92rem; margin: 0; line-height: 1.55;">
              Estrategia institucional del Tecnológico de Antioquia orientada a la salud mental, la permanencia estudiantil y el acompañamiento psicoeducativo para afrontar con tranquilidad y equilibrio la vida académica y las semanas de evaluaciones.
            </p>
          </div>
        </div>

        <!-- Encabezado de la Sección Próximamente (Estilo Imagen 2) -->
        <div style="margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--color-text-main); margin: 0; display: flex; align-items: center; gap: 0.5rem;">
              <span>🌸</span>
              <span>Próximamente: Bienestar Emocional y Afrontamiento Universitario</span>
            </h3>
            <p style="font-size: 0.85rem; color: var(--color-text-secondary); margin: 0.25rem 0 0 0;">
              Micro-lecciones audiovisuales, talleres de respiración y guías prácticas en producción pedagógica.
            </p>
          </div>
          <span class="badge badge-status-upcoming" style="font-size: 0.82rem; padding: 0.4rem 0.85rem;">⏱️ En producción pedagógica</span>
        </div>

        <!-- Grid de Recursos Próximamente (Diseño idéntico a Imagen 2) -->
        <div class="resources-grid" id="campus-vital-cards-container">
          ${campusResources.map(res => ResourceCard.render(res)).join('')}
        </div>

        <!-- Tarjeta de Acompañamiento e Información Institucional -->
        <div class="escalation-box" style="margin-top: 2rem; background: #F0FDF4; border: 1.5px solid rgba(0, 132, 61, 0.25); border-radius: 18px; padding: 1.5rem;">
          <div class="escalation-header" style="display: flex; gap: 1.15rem; align-items: flex-start;">
            <div style="font-size: 2.2rem; line-height: 1;">💚</div>
            <div>
              <div class="escalation-title" style="font-size: 1.05rem; font-weight: 800; color: #022B14; margin-bottom: 0.35rem;">
                ¿Requieres orientación o acompañamiento emocional ahora?
              </div>
              <p style="font-size: 0.88rem; color: #2D3748; margin: 0 0 0.85rem 0; line-height: 1.5;">
                La Dirección de Bienestar Universitario y el programa de Permanencia del TdeA disponen de asesoría psicológica, redes de apoyo familiar y programas de acompañamiento integral para toda la comunidad universitaria.
              </p>
              <div style="display: flex; gap: 1.25rem; flex-wrap: wrap; align-items: center;">
                <a href="mailto:bienestar@tdea.edu.co" class="escalation-email" style="font-weight: 700; color: #00843D; text-decoration: none;">
                  ✉️ bienestar@tdea.edu.co
                </a>
                <span style="color: #CBD5E0;">|</span>
                <span style="font-size: 0.85rem; color: #4A5568;">Bloque 2 · Oficina de Bienestar Universitario TdeA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Asignar oyentes a botones de las tarjetas
    const openBtns = this.containerEl.querySelectorAll('[data-open-resource]');
    openBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-open-resource');
        const res = getResourceById(id);
        if (res) {
          ResourceCard.openResourceModal(res);
        }
      });
    });
  }

  /**
   * Renderiza vista de escalamiento directo con plantilla prellenada
   */
  /**
   * Renderiza vista de escalamiento directo
   */
  renderEscalationView(flowData) {
    const formattedMessage = (flowData.message || '')
      .split('\n')
      .map(line => `<p style="margin-bottom: 0.5rem;">${line}</p>`)
      .join('');

    const mailtoLink = getTdeaMailtoUrl();

    let html = `
      <div class="guidance-card" style="text-align: center; padding: 2.5rem 2rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">✉️</div>
        <h3 class="guidance-title" style="margin-bottom: 1.25rem; font-size: var(--font-size-2xl);">
          ${flowData.title}
        </h3>
        
        <div style="font-size: var(--font-size-base); color: var(--color-text-secondary); line-height: 1.7; max-width: 520px; margin: 0 auto 2rem;">
          ${formattedMessage}
          <div style="margin-top: 1rem;">
            <a href="${mailtoLink}" class="escalation-email" style="font-size: var(--font-size-xl); font-weight: 800; text-decoration: underline;">
              ${flowData.email}
            </a>
          </div>
        </div>

        <div>
          <button type="button" class="btn-secondary" id="btn-escalation-home">
            <span>← Volver al inicio</span>
          </button>
        </div>
      </div>
    `;

    this.containerEl.innerHTML = html;

    const homeBtn = this.containerEl.querySelector('#btn-escalation-home');
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        this.onSelectOption('home');
      });
    }
  }

  /**
   * Renderiza vista de Contacto Institucional
   */
  renderContactView(flowData) {
    const mailtoLink = getTdeaMailtoUrl();

    let html = `
      <div class="guidance-card">
        <div class="guidance-header">
          <span style="font-size: 1.85rem;">📞</span>
          <h3 class="guidance-title">${flowData.title}</h3>
        </div>
        
        <p style="font-size: var(--font-size-base); color: var(--color-text-secondary); margin-bottom: 1.5rem;">
          ${flowData.summary}
        </p>

        <div class="contact-info-card">
          <div class="contact-info-icon">🏛️</div>
          <div class="contact-info-content">
            <h4 style="font-size: var(--font-size-base); font-weight: 700; color: var(--color-text-main); margin-bottom: 0.35rem;">
              Coordinación de Asesorías Académicas · Ciencias Básicas
            </h4>
            <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: 0.75rem;">
              Territorio TdeA · Tecnológico de Antioquia Institución Universitaria
            </p>
            <div style="font-size: var(--font-size-sm); color: var(--color-text-main);">
              <strong>Correo oficial de atención:</strong><br>
              <a href="${mailtoLink}" class="escalation-email" style="font-size: var(--font-size-lg); font-weight: 700;">
                ${flowData.email}
              </a>
            </div>
          </div>
        </div>

        <div style="margin-top: 1.75rem;">
          <button type="button" class="btn-secondary" id="btn-contact-home">
            <span>← Volver al inicio</span>
          </button>
        </div>
      </div>
    `;

    this.containerEl.innerHTML = html;

    const homeBtn = this.containerEl.querySelector('#btn-contact-home');
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        this.onSelectOption('home');
      });
    }
  }

  /**
   * Renderiza el catálogo de asesorías académicas
   */
  renderAdvisoryList(flowData) {
    let html = `
      <div class="assistant-message-card" style="margin-bottom: 1.5rem;">
        <div class="assistant-avatar" aria-hidden="true">📅</div>
        <div class="assistant-text-block">
          <h2 class="assistant-greeting">${flowData.greeting}</h2>
          <p class="assistant-prompt">${flowData.prompt}</p>
        </div>
      </div>

      <div id="advisory-container-slot"></div>
    `;

    this.containerEl.innerHTML = html;

    const slot = this.containerEl.querySelector('#advisory-container-slot');
    const list = new AdvisoryList(slot);
    list.render();
  }

  attachOptionListeners() {
    const optionCards = this.containerEl.querySelectorAll('.gov-channel-button, .option-card, [data-target-flow]');
    optionCards.forEach(card => {
      card.addEventListener('click', () => {
        const targetFlow = card.getAttribute('data-target-flow');
        if (targetFlow) {
          this.onSelectOption(targetFlow);
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
