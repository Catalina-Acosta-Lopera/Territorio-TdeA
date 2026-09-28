/**
 * Componente de Widget Flotante de TutorIA TdeA
 * Tecnológico de Antioquia - Institución Universitaria
 * 
 * Permite acceder directamente a la página de inicio de TutorIA
 * (donde el estudiante ingresa con su documento de identidad) desde la pestaña/botón lateral,
 * mostrando una tarjeta compacta y directa sin pantallas pesadas ("sin pantallotas").
 */

export class TutoriaWidget {
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
    let root = document.getElementById('tdea-tutoria-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'tdea-tutoria-root';
      document.body.appendChild(root);
    }
    this.containerEl = root;

    this.render();
    this.bindEvents();
    console.info('🤖 Widget Flotante de TutorIA TdeA inicializado.');
  }

  /**
   * Genera el HTML del botón flotante y de la tarjeta compacta de acceso directo
   */
  render() {
    this.containerEl.innerHTML = `
      <!-- Botón Flotante Lateral TutorIA (Estilo Oficial Imagen 2) -->
      <button 
        type="button" 
        id="tutoria-floating-fab" 
        class="tutoria-floating-fab" 
        aria-label="Abrir acceso a TutorIA TdeA - Ingreso con Documento de Identidad" 
        aria-haspopup="dialog"
        aria-expanded="false"
        title="TutorIA TdeA · Ingreso con Documento de Identidad"
      >
        <span class="tutoria-fab-halo" aria-hidden="true"></span>
        <div class="tutoria-fab-inner">
          <img src="assets/icons/tutoria-avatar.png" alt="Logo TutorIA TdeA" class="tutoria-fab-mascot-img">
        </div>
        <span class="tutoria-fab-tooltip">TutorIA TdeA · Ingreso con Documento</span>
      </button>

      <!-- Fondo Oscuro Semitransparente (Backdrop) -->
      <div id="tutoria-drawer-overlay" class="tutoria-drawer-overlay" aria-hidden="true"></div>

      <!-- Tarjeta Flotante Compacta de TutorIA (Acceso directo con Documento) -->
      <aside 
        id="tutoria-drawer-panel" 
        class="tutoria-drawer-panel tutoria-compact-dialog" 
        role="dialog" 
        aria-modal="true" 
        aria-label="Acceso a TutorIA TdeA con Documento de Identidad"
        aria-hidden="true"
      >
        <!-- Cabecera de la Tarjeta Compacta -->
        <div class="tutoria-card-header">
          <div class="tutoria-card-brand">
            <div class="tutoria-card-avatar-wrap">
              <img src="assets/icons/tutoria-avatar.png" alt="Logo TutorIA TdeA" class="tutoria-card-avatar-img" width="56" height="56">
            </div>
            <div class="tutoria-card-brand-info">
              <span class="tutoria-card-inst-tag">DEPARTAMENTO DE CIENCIAS BÁSICAS Y ÁREAS COMUNES</span>
              <h3 class="tutoria-card-title">TutorIA TdeA</h3>
            </div>
          </div>
          <button 
            type="button" 
            id="tutoria-drawer-close-btn" 
            class="tutoria-card-close-btn" 
            aria-label="Cerrar ventana de TutorIA" 
            title="Cerrar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Cuerpo de la Tarjeta Compacta -->
        <div class="tutoria-card-body">
          <h4 class="tutoria-card-welcome-title">¡Bienvenido a TutorIA!</h4>
          
          <p class="tutoria-card-instructions">
            Tu compañero académico inteligente. Ingresa a la plataforma oficial de TutorIA con tu <strong>documento de identidad</strong>.
          </p>

          <div class="tutoria-card-notice-box">
            <span class="tutoria-notice-icon">🪪</span>
            <span class="tutoria-notice-text">Acceso oficial para estudiantes del TdeA mediante documento de identidad.</span>
          </div>

          <!-- Botón Principal: Envía directamente al enlace de TutorIA -->
          <a 
            href="https://asesorias-territorio-dcbac-tdea.ai.studio/" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="tutoria-direct-launch-btn"
            id="tutoria-direct-launch-link"
            aria-label="Ir a la plataforma oficial de TutorIA TdeA (abre en nueva pestaña)"
          >
            <span class="tutoria-btn-shine" aria-hidden="true"></span>
            <span>🚀 Ingresar a TutorIA con mi Documento</span>
            <span class="tutoria-arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </aside>
    `;

    this.fabBtn = document.getElementById('tutoria-floating-fab');
    this.overlayEl = document.getElementById('tutoria-drawer-overlay');
    this.drawerEl = document.getElementById('tutoria-drawer-panel');
    this.closeBtn = document.getElementById('tutoria-drawer-close-btn');
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

    // Delegación global para botones con data-open-tutoria="true"
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-open-tutoria="true"], .v2-quick-chip-tutoria');
      if (trigger) {
        e.preventDefault();
        this.open();
      }
    });
  }

  /**
   * Abre la tarjeta compacta
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
    document.body.classList.add('tutoria-drawer-active');

    // Mover foco al botón de acción para accesibilidad y agilidad
    setTimeout(() => {
      const cta = document.getElementById('tutoria-direct-launch-link');
      if (cta) cta.focus();
    }, 120);
  }

  /**
   * Cierra la tarjeta compacta
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
    document.body.classList.remove('tutoria-drawer-active');

    if (this.fabBtn) this.fabBtn.focus();
  }

  /**
   * Alterna estado
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}

export const tutoriaWidget = new TutoriaWidget();
