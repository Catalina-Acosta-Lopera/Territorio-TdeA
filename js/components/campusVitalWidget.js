/**
 * Componente de Widget Flotante de Campus Vital TdeA
 * Tecnológico de Antioquia - Institución Universitaria
 * 
 * Estrategia de Salud Mental, Bienestar Emocional, Permanencia Estudiantil
 * y Afrontamiento Universitario en el Territorio TdeA.
 * 
 * Proporciona el botón flotante lateral con la mascota abrazando un corazón
 * y la ventana modal con las tarjetas y recursos "Próximamente".
 */

import { RESOURCES_DATA, getResourceById } from '../data/resourcesData.js';
import { ResourceCard } from './resourceCard.js';

export class CampusVitalWidget {
  constructor() {
    this.isOpen = false;
    this.containerEl = null;
    this.fabBtn = null;
    this.overlayEl = null;
    this.drawerEl = null;
    this.closeBtn = null;
  }

  /**
   * Inicializa el widget montando su estructura y registrando eventos
   */
  init() {
    let root = document.getElementById('tdea-campus-vital-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'tdea-campus-vital-root';
      document.body.appendChild(root);
    }
    this.containerEl = root;

    this.render();
    this.bindEvents();
    console.info('🌱 Widget Flotante de Campus Vital TdeA inicializado.');
  }

  /**
   * Genera el HTML del botón flotante lateral y el modal interactivo
   */
  render() {
    const campusResources = RESOURCES_DATA.filter(r => r.category === 'campus_vital');

    this.containerEl.innerHTML = `
      <!-- Botón Flotante Lateral Campus Vital (Mascota Abrazando un Corazón) -->
      <button 
        type="button" 
        id="campus-vital-floating-fab" 
        class="campus-vital-floating-fab" 
        aria-label="Abrir Campus Vital: Bienestar emocional, afrontamiento universitario, adaptación universitaria y proyecto de vida" 
        aria-haspopup="dialog"
        aria-expanded="false"
        title="Campus Vital · Bienestar emocional, afrontamiento universitario, adaptación universitaria y proyecto de vida"
      >
        <div class="campus-vital-fab-inner">
          <img src="assets/icons/campus-vital-mascot.svg" alt="Mascota Campus Vital TdeA" class="campus-vital-fab-mascot-img">
        </div>
        <span class="campus-vital-fab-tooltip">Campus Vital</span>
      </button>

      <!-- Fondo Oscuro Semitransparente (Backdrop) -->
      <div id="campus-vital-drawer-overlay" class="campus-vital-drawer-overlay" aria-hidden="true"></div>

      <!-- Ventana Modal de Campus Vital -->
      <aside 
        id="campus-vital-drawer-panel" 
        class="campus-vital-drawer-panel campus-vital-dialog" 
        role="dialog" 
        aria-modal="true" 
        aria-label="Campus Vital: Bienestar emocional y afrontamiento universitario"
        aria-hidden="true"
      >
        <!-- Cabecera del Diálogo -->
        <div class="campus-vital-header">
          <div class="campus-vital-brand">
            <div class="campus-vital-avatar-wrap">
              <img src="assets/icons/campus-vital-mascot.svg" alt="Mascota Campus Vital TdeA" class="campus-vital-avatar-img" width="56" height="56">
            </div>
            <div class="campus-vital-brand-info">
              <span class="campus-vital-inst-tag">BIENESTAR INSTITUCIONAL · PERMANENCIA TdeA</span>
              <h3 class="campus-vital-title">Campus Vital</h3>
            </div>
          </div>
          <button 
            type="button" 
            id="campus-vital-close-btn" 
            class="campus-vital-close-btn" 
            aria-label="Cerrar ventana de Campus Vital" 
            title="Cerrar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Cuerpo del Diálogo -->
        <div class="campus-vital-body">
          <!-- Tarjeta de Bienvenida y Propósito -->
          <div class="campus-vital-welcome-box">
            <div class="campus-vital-welcome-icon" aria-hidden="true">💚</div>
            <div class="campus-vital-welcome-content">
              <h4 class="campus-vital-welcome-title">Bienestar Emocional y Afrontamiento Universitario</h4>
              <p class="campus-vital-welcome-desc">
                Estrategia institucional para promover la <strong>salud mental</strong>, el <strong>equilibrio emocional</strong> y la <strong>permanencia estudiantil</strong> en el Tecnológico de Antioquia.
              </p>
            </div>
          </div>

          <!-- Encabezado de Sección Próximamente -->
          <div class="campus-vital-section-bar">
            <div class="campus-vital-section-title">
              <span class="vital-section-dot" aria-hidden="true"></span>
              <span>Próximamente: Microcursos de Autogestión del Aprendizaje y Adaptación a la Vida Universitaria</span>
            </div>
            <span class="vital-status-pill">⏱️ En producción pedagógica</span>
          </div>

          <!-- Cuadrícula de Tarjetas Próximamente (Estilo Imagen 2) -->
          <div class="campus-vital-cards-grid" id="campus-vital-dialog-cards">
            ${campusResources.map(res => ResourceCard.render(res)).join('')}
          </div>
        </div>
      </aside>
    `;

    this.fabBtn = document.getElementById('campus-vital-floating-fab');
    this.overlayEl = document.getElementById('campus-vital-drawer-overlay');
    this.drawerEl = document.getElementById('campus-vital-drawer-panel');
    this.closeBtn = document.getElementById('campus-vital-close-btn');

    // Asignar listeners a botones de las tarjetas en el modal
    const openBtns = this.drawerEl.querySelectorAll('[data-open-resource]');
    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-open-resource');
        const res = getResourceById(id);
        if (res) {
          ResourceCard.openResourceModal(res);
        }
      });
    });
  }

  /**
   * Registra eventos de apertura, cierre y accesibilidad
   */
  bindEvents() {
    if (this.fabBtn) {
      this.fabBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.close();
      });
    }

    if (this.overlayEl) {
      this.overlayEl.addEventListener('click', () => {
        this.close();
      });
    }

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Delegación global para botones con data-open-campus-vital="true" o clase .v2-quick-chip-campus-vital
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-open-campus-vital="true"], .v2-quick-chip-campus-vital');
      if (trigger) {
        e.preventDefault();
        this.open();
      }
    });
  }

  /**
   * Abre el diálogo de Campus Vital
   */
  open() {
    this.isOpen = true;
    if (this.drawerEl) {
      this.drawerEl.classList.add('is-open');
      this.drawerEl.setAttribute('aria-hidden', 'false');
    }
    if (this.overlayEl) {
      this.overlayEl.classList.add('is-visible');
    }
    if (this.fabBtn) {
      this.fabBtn.setAttribute('aria-expanded', 'true');
      this.fabBtn.classList.add('is-active');
    }
    document.body.classList.add('campus-vital-drawer-active');

    // Foco para accesibilidad
    setTimeout(() => {
      if (this.closeBtn) this.closeBtn.focus();
    }, 120);
  }

  /**
   * Cierra el diálogo de Campus Vital
   */
  close() {
    this.isOpen = false;
    if (this.drawerEl) {
      this.drawerEl.classList.remove('is-open');
      this.drawerEl.setAttribute('aria-hidden', 'true');
    }
    if (this.overlayEl) {
      this.overlayEl.classList.remove('is-visible');
    }
    if (this.fabBtn) {
      this.fabBtn.setAttribute('aria-expanded', 'false');
      this.fabBtn.classList.remove('is-active');
    }
    document.body.classList.remove('campus-vital-drawer-active');

    if (this.fabBtn) this.fabBtn.focus();
  }

  /**
   * Alterna estado abierto/cerrado
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}

export const campusVitalWidget = new CampusVitalWidget();
