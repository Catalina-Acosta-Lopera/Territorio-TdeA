/**
 * Componente de Accesibilidad Web Oficial TdeA
 * Tecnológico de Antioquia - Institución Universitaria
 * 
 * Recrea fielmente el botón flotante institucional y el panel desplegable
 * de opciones de accesibilidad según las especificaciones del TdeA.
 */

import { accessibilityService } from '../services/accessibilityService.js';

export class AccessibilityWidget {
  constructor() {
    this.isOpen = false;
    this.containerEl = null;
  }

  /**
   * Inicializa el widget montando su estructura y registrando oyentes
   */
  init() {
    accessibilityService.init();

    let root = document.getElementById('tdea-accessibility-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'tdea-accessibility-root';
      document.body.appendChild(root);
    }
    this.containerEl = root;

    this.render();
    this.attachEvents();

    // Suscribirse a cambios en el servicio para actualizar la interfaz
    accessibilityService.subscribe((settings) => {
      this.updateUI(settings);
    });

    // Actualización inicial
    this.updateUI(accessibilityService.getSettings());
  }

  /**
   * Genera el HTML del botón flotante, fondo y panel lateral
   */
  render() {
    this.containerEl.innerHTML = `
      <!-- Botón Flotante Lateral con Mascota Oficial TdeA -->
      <button 
        type="button" 
        id="tdea-accessibility-fab" 
        class="tdea-accessibility-fab" 
        aria-label="Abrir opciones de accesibilidad TdeA" 
        aria-haspopup="dialog"
        aria-expanded="false"
        title="Opciones de Accesibilidad Territorio TdeA"
      >
        <img src="assets/icons/tdea-mascot.svg" alt="Mascota Accesibilidad TdeA" class="tdea-accessibility-fab-mascot-img">
        <span class="tdea-accessibility-fab-tooltip">Accesibilidad TdeA</span>
      </button>

      <!-- Fondo Oscuro de Cierre (Backdrop) -->
      <div id="tdea-accessibility-overlay" class="tdea-accessibility-overlay" aria-hidden="true"></div>

      <!-- Panel Lateral "Opciones de Accesibilidad TdeA" -->
      <aside 
        id="tdea-accessibility-window" 
        class="tdea-accessibility-window" 
        role="dialog" 
        aria-modal="true" 
        aria-label="Opciones de Accesibilidad TdeA"
        aria-hidden="true"
      >
        <!-- Encabezado Institucional Verde con Mascota TdeA -->
        <div class="access-panel-header">
          <div class="access-mascot-badge">
            <img src="assets/icons/tdea-mascot.svg" alt="Mascota TdeA" class="access-mascot-header-img">
          </div>
          <h2 class="access-panel-title">Opciones de Accesibilidad TdeA</h2>
          <span class="access-panel-subtitle">Territorio TdeA · Ciencias Básicas</span>
          <button 
            type="button" 
            id="tdea-access-close-btn" 
            class="access-close-btn" 
            aria-label="Cerrar opciones de accesibilidad" 
            title="Cerrar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Cuerpo con Controles de Accesibilidad -->
        <div class="access-panel-body">
          
          <!-- Control 1: Tamaño de Texto con 5 Niveles -->
          <section class="access-text-size-card" aria-label="Control de tamaño de texto">
            <div class="access-text-size-title">Tamaño de Texto</div>
            <div class="access-text-size-controls">
              <button 
                type="button" 
                id="access-decrease-text" 
                class="access-size-btn" 
                aria-label="Disminuir tamaño de texto"
                title="Disminuir texto"
              >−</button>
              
              <div class="access-size-dots" id="access-dots-container" aria-label="Nivel de tamaño">
                <span class="access-dot" data-dot="1"></span>
                <span class="access-dot" data-dot="2"></span>
                <span class="access-dot" data-dot="3"></span>
                <span class="access-dot" data-dot="4"></span>
                <span class="access-dot" data-dot="5"></span>
              </div>

              <button 
                type="button" 
                id="access-increase-text" 
                class="access-size-btn" 
                aria-label="Aumentar tamaño de texto"
                title="Aumentar texto"
              >+</button>
            </div>
          </section>

          <!-- Cuadrícula de 6 Opciones Específicas Seleccionadas -->
          <div class="access-options-grid" role="group" aria-label="Opciones interactivas de accesibilidad">
            
            <!-- Opción 1: Widget Grande -->
            <button 
              type="button" 
              class="access-card" 
              data-option="widgetLarge" 
              role="switch" 
              aria-checked="false"
            >
              <div class="access-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                </svg>
              </div>
              <span class="access-card-label">Widget Grande</span>
            </button>

            <!-- Opción 2: Subrayar Enlaces -->
            <button 
              type="button" 
              class="access-card" 
              data-option="underlineLinks" 
              role="switch" 
              aria-checked="false"
            >
              <div class="access-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
              </div>
              <span class="access-card-label">Subrayar Enlaces</span>
            </button>

            <!-- Opción 3: Espaciado de Texto -->
            <button 
              type="button" 
              class="access-card" 
              data-option="textSpacing" 
              role="switch" 
              aria-checked="false"
            >
              <div class="access-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="4" y1="5" x2="20" y2="5"/>
                  <line x1="4" y1="12" x2="20" y2="12"/>
                  <polyline points="7 9 4 12 7 15"/>
                  <polyline points="17 9 20 12 17 15"/>
                  <line x1="4" y1="19" x2="20" y2="19"/>
                </svg>
              </div>
              <span class="access-card-label">Espaciado de Texto</span>
            </button>

            <!-- Opción 4: Cursor Grande -->
            <button 
              type="button" 
              class="access-card" 
              data-option="largeCursor" 
              role="switch" 
              aria-checked="false"
            >
              <div class="access-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 2l13 11.5-6 1.5 4 7.5-3.5 1.5-4-7.5L4 20V2z"/>
                </svg>
              </div>
              <span class="access-card-label">Cursor Grande</span>
            </button>

            <!-- Opción 5: Altura de Línea -->
            <button 
              type="button" 
              class="access-card" 
              data-option="lineHeight" 
              role="switch" 
              aria-checked="false"
            >
              <div class="access-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="12 4 8 8 16 8"/>
                  <line x1="12" y1="4" x2="12" y2="20"/>
                  <polyline points="8 16 12 20 16 16"/>
                  <line x1="17" y1="9" x2="21" y2="9"/>
                  <line x1="17" y1="15" x2="21" y2="15"/>
                  <line x1="3" y1="9" x2="7" y2="9"/>
                  <line x1="3" y1="15" x2="7" y2="15"/>
                </svg>
              </div>
              <span class="access-card-label">Altura de Línea</span>
            </button>

            <!-- Opción 6: Alinear Texto -->
            <button 
              type="button" 
              class="access-card" 
              data-option="alignText" 
              role="switch" 
              aria-checked="false"
            >
              <div class="access-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="21" y1="6" x2="3" y2="6"/>
                  <line x1="14" y1="12" x2="3" y2="12"/>
                  <line x1="18" y1="18" x2="3" y2="18"/>
                </svg>
              </div>
              <span class="access-card-label">Alinear Texto</span>
              <span class="access-align-status-badge" id="access-align-status">Normal</span>
            </button>

          </div>

        </div>

        <!-- Pie con Botón "Restablecer Todo" -->
        <div class="access-panel-footer">
          <button 
            type="button" 
            id="tdea-access-reset-btn" 
            class="access-reset-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            <span>Restablecer Todo</span>
          </button>
        </div>

      </aside>
    `;
  }

  /**
   * Conecta los oyentes de interacción a los botones del panel
   */
  attachEvents() {
    const fabBtn = document.getElementById('tdea-accessibility-fab');
    const closeBtn = document.getElementById('tdea-access-close-btn');
    const overlay = document.getElementById('tdea-accessibility-overlay');
    const decreaseBtn = document.getElementById('access-decrease-text');
    const increaseBtn = document.getElementById('access-increase-text');
    const resetBtn = document.getElementById('tdea-access-reset-btn');
    const cards = this.containerEl.querySelectorAll('.access-card[data-option]');

    // Abrir al hacer clic en FAB flotante
    if (fabBtn) {
      fabBtn.addEventListener('click', () => this.togglePanel());
    }

    // Botón superior institucional (si existe)
    const topBarBtn = document.getElementById('gov-accessibility-btn');
    if (topBarBtn) {
      topBarBtn.addEventListener('click', () => this.openPanel());
    }

    // Cerrar al hacer clic en X o en fondo
    if (closeBtn) closeBtn.addEventListener('click', () => this.closePanel());
    if (overlay) overlay.addEventListener('click', () => this.closePanel());

    // Tecla Escape para cerrar accesibilidad
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closePanel();
      }
    });

    // Controles de tamaño de texto
    if (decreaseBtn) {
      decreaseBtn.addEventListener('click', () => {
        accessibilityService.decreaseTextSize();
      });
    }

    if (increaseBtn) {
      increaseBtn.addEventListener('click', () => {
        accessibilityService.increaseTextSize();
      });
    }

    // Tarjetas de opciones interactivas
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const option = card.getAttribute('data-option');
        if (option) {
          accessibilityService.toggleOption(option);
        }
      });
    });

    // Botón de restablecer
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        accessibilityService.resetAll();
      });
    }
  }

  /**
   * Abre el panel de accesibilidad
   */
  openPanel() {
    this.isOpen = true;
    document.body.classList.add('accessibility-panel-active');
    const windowEl = document.getElementById('tdea-accessibility-window');
    const overlay = document.getElementById('tdea-accessibility-overlay');
    const fab = document.getElementById('tdea-accessibility-fab');

    if (windowEl) {
      windowEl.classList.add('is-open');
      windowEl.setAttribute('aria-hidden', 'false');
    }
    if (overlay) {
      overlay.classList.add('is-visible');
    }
    if (fab) {
      fab.setAttribute('aria-expanded', 'true');
    }

    // Enfocar el primer botón por accesibilidad
    const firstBtn = document.getElementById('access-decrease-text');
    if (firstBtn) firstBtn.focus();
  }

  /**
   * Cierra el panel de accesibilidad
   */
  closePanel() {
    this.isOpen = false;
    document.body.classList.remove('accessibility-panel-active');
    const windowEl = document.getElementById('tdea-accessibility-window');
    const overlay = document.getElementById('tdea-accessibility-overlay');
    const fab = document.getElementById('tdea-accessibility-fab');

    if (windowEl) {
      windowEl.classList.remove('is-open');
      windowEl.setAttribute('aria-hidden', 'true');
    }
    if (overlay) {
      overlay.classList.remove('is-visible');
    }
    if (fab) {
      fab.setAttribute('aria-expanded', 'false');
      fab.focus();
    }
  }

  togglePanel() {
    if (this.isOpen) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }

  /**
   * Sincroniza visualmente los estados de las tarjetas y los puntos indicadores
   * @param {Object} settings Configuración actual del servicio
   */
  updateUI(settings) {
    if (!this.containerEl) return;

    // 1. Actualizar puntos indicadores de tamaño de texto
    const dots = this.containerEl.querySelectorAll('.access-dot');
    dots.forEach((dot, index) => {
      const dotLevel = index + 1;
      dot.classList.toggle('active', dotLevel === settings.textSize);
    });

    const decreaseBtn = document.getElementById('access-decrease-text');
    const increaseBtn = document.getElementById('access-increase-text');
    if (decreaseBtn) decreaseBtn.disabled = settings.textSize <= 1;
    if (increaseBtn) increaseBtn.disabled = settings.textSize >= 5;

    // 2. Actualizar tarjetas de opciones activas/inactivas
    const cards = this.containerEl.querySelectorAll('.access-card[data-option]');
    cards.forEach(card => {
      const option = card.getAttribute('data-option');
      if (option === 'alignText') {
        const isAlignActive = !!settings.alignText;
        card.classList.toggle('is-active', isAlignActive);
        card.setAttribute('aria-checked', isAlignActive ? 'true' : 'false');
        const alignStatus = document.getElementById('access-align-status');
        if (alignStatus) {
          const labels = {
            'justify': 'Justificado',
            'center': 'Centrado',
            'left': 'Izquierda'
          };
          alignStatus.textContent = labels[settings.alignText] || 'Normal';
        }
      } else {
        const isActive = !!settings[option];
        card.classList.toggle('is-active', isActive);
        card.setAttribute('aria-checked', isActive ? 'true' : 'false');
      }
    });
  }
}

export const accessibilityWidget = new AccessibilityWidget();
