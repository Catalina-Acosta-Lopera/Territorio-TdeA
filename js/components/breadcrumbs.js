/**
 * Componente de Navegación y Breadcrumbs
 * Asistente Virtual Territorio TdeA
 */

export class Breadcrumbs {
  constructor(containerEl, onNavigateBack, onNavigateHome) {
    this.containerEl = containerEl;
    this.onNavigateBack = onNavigateBack;
    this.onNavigateHome = onNavigateHome;
  }

  /**
   * Renderiza la barra de navegación basada en la ruta actual
   * @param {Array<Object>} historyStack Pila de navegación actual
   * @param {Object} currentFlow Objeto del flujo actual
   */
  render(historyStack, currentFlow) {
    if (!this.containerEl) return;

    // Si estamos en home, no mostramos botón de volver ni migas complejas
    if (currentFlow.id === 'home' || historyStack.length <= 1) {
      this.containerEl.innerHTML = `
        <div class="breadcrumb-trail">
          <span class="breadcrumb-item active">
            <span>🏠</span>
            <span>Inicio</span>
          </span>
        </div>
        <div>
          <span class="badge badge-institutional">Orientación Territorio TdeA</span>
        </div>
      `;
      return;
    }

    // Si estamos en un subflujo, mostramos botón de retorno e historial
    const canGoBack = historyStack.length > 1;

    let trailHtml = `
      <div class="breadcrumb-trail">
        <button type="button" class="breadcrumb-item" id="nav-crumb-home" style="cursor: pointer; color: var(--color-text-muted);">
          <span>🏠 Inicio</span>
        </button>
    `;

    // Añadir pasos intermedios si existen
    for (let i = 1; i < historyStack.length - 1; i++) {
      const step = historyStack[i];
      trailHtml += `
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item">${step.breadcrumb || step.title}</span>
      `;
    }

    // Paso actual
    trailHtml += `
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-item active">${currentFlow.breadcrumb || currentFlow.title}</span>
    </div>
    `;

    this.containerEl.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        ${canGoBack ? `
          <button type="button" class="btn-back" id="nav-btn-back" title="Volver al menú anterior">
            <span>←</span>
            <span>Volver</span>
          </button>
        ` : ''}
        ${trailHtml}
      </div>
      <div>
        <button type="button" class="btn-back" id="nav-btn-home" style="font-size: var(--font-size-xs);" title="Ir al menú principal">
          <span>🏠 Menú Principal</span>
        </button>
      </div>
    `;

    // Event listeners
    const backBtn = this.containerEl.querySelector('#nav-btn-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.onNavigateBack());
    }

    const homeBtn = this.containerEl.querySelector('#nav-btn-home');
    if (homeBtn) {
      homeBtn.addEventListener('click', () => this.onNavigateHome());
    }

    const crumbHome = this.containerEl.querySelector('#nav-crumb-home');
    if (crumbHome) {
      crumbHome.addEventListener('click', () => this.onNavigateHome());
    }
  }
}
