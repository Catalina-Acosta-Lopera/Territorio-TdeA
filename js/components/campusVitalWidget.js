/**
 * Componente de Acceso Rápido Flotante de Campus Vital TdeA
 * Tecnológico de Antioquia - Institución Universitaria
 * 
 * Estrategia de Salud Mental, Bienestar Emocional, Permanencia Estudiantil
 * y Afrontamiento Universitario en el Territorio TdeA.
 * 
 * Proporciona el botón flotante lateral institucional que conduce directamente
 * a la vista oficial de Campus Vital (#/campus_vital) sin ventanas emergentes de presentación.
 */

export class CampusVitalWidget {
  constructor() {
    this.containerEl = null;
    this.fabBtn = null;
  }

  /**
   * Inicializa el widget montando el botón flotante y registrando eventos
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
    console.info('🌱 Acceso Rápido Flotante de Campus Vital TdeA inicializado.');
  }

  /**
   * Genera el HTML del botón flotante lateral
   */
  render() {
    this.containerEl.innerHTML = `
      <!-- Botón Flotante Lateral Campus Vital (Acceso Directo a #/campus_vital) -->
      <button 
        type="button" 
        id="campus-vital-floating-fab" 
        class="campus-vital-floating-fab" 
        aria-label="Ir a Campus Vital: Bienestar emocional y Centro de Aprendizaje" 
        title="Campus Vital · Bienestar emocional y Centro de Aprendizaje"
      >
        <div class="campus-vital-fab-inner">
          <img src="assets/icons/campus-vital-mascot.svg" alt="Mascota Campus Vital TdeA" class="campus-vital-fab-mascot-img">
        </div>
        <span class="campus-vital-fab-tooltip">Campus Vital</span>
      </button>
    `;

    this.fabBtn = document.getElementById('campus-vital-floating-fab');
  }

  /**
   * Registra eventos de navegación directa y actualización de estado
   */
  bindEvents() {
    if (this.fabBtn) {
      this.fabBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateToCampusVital();
      });
    }

    // Actualizar estado visual activo al cambiar de ruta
    window.addEventListener('hashchange', () => {
      this.updateActiveState();
    });
    this.updateActiveState();
  }

  /**
   * Navega directamente a la vista de Campus Vital
   */
  navigateToCampusVital() {
    if (window.location.hash === '#/campus_vital') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = '#/campus_vital';
    }
  }

  /**
   * Resalta visualmente el botón flotante cuando el usuario está en una ruta de Campus Vital
   */
  updateActiveState() {
    if (!this.fabBtn) return;
    const isCampusVital = window.location.hash === '#/campus_vital' || window.location.hash.startsWith('#/centro_aprendizaje');
    if (isCampusVital) {
      this.fabBtn.classList.add('is-active');
    } else {
      this.fabBtn.classList.remove('is-active');
    }
  }

  // Métodos de compatibilidad retroactiva
  open() {
    this.navigateToCampusVital();
  }

  close() {}

  toggle() {
    this.navigateToCampusVital();
  }
}

export const campusVitalWidget = new CampusVitalWidget();
