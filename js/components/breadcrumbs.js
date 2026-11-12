/**
 * Componente de Navegación y Breadcrumbs
 * Asistente Virtual Territorio TdeA
 *
 * Barra superior única y oficial para todo el sistema de navegación.
 * Proporciona migas de pan interactivas y retorno lógico jerárquico.
 */

export class Breadcrumbs {
  constructor(containerEl, onNavigateBack, onNavigateHome, onNavigateTo) {
    this.containerEl = containerEl;
    this.onNavigateBack = onNavigateBack;
    this.onNavigateHome = onNavigateHome;
    this.onNavigateTo = onNavigateTo;
    this.subViewInfo = null;
  }

  setSubView(subViewInfo) {
    this.subViewInfo = subViewInfo;
  }

  clearSubView() {
    this.subViewInfo = null;
  }

  /**
   * Renderiza la barra de navegación basada en la ruta actual
   * @param {Array<Object>} historyStack Pila de navegación actual
   * @param {Object} currentFlow Objeto del flujo actual
   */
  render(historyStack, currentFlow) {
    if (!this.containerEl) return;

    // Si estamos en home y sin subvistas activas, mostramos indicador limpio
    if (currentFlow.id === 'home' && !this.subViewInfo) {
      this.containerEl.innerHTML = `
        <div class="breadcrumb-trail">
          <span class="breadcrumb-item active" style="font-weight: 700; color: var(--tdea-green-primary);">
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

    const canGoBack = historyStack.length > 1 || Boolean(this.subViewInfo);

    let trailHtml = `
      <div class="breadcrumb-trail" style="display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;">
        <button type="button" class="breadcrumb-item breadcrumb-item-clickable" id="nav-crumb-home" style="cursor: pointer; background: transparent; border: none; padding: 0.2rem 0.45rem; border-radius: 6px; font-weight: 600; color: #475569; display: inline-flex; align-items: center; gap: 0.35rem; transition: all 0.2s ease;">
          <span>🏠 Inicio</span>
        </button>
    `;

    // Pasos intermedios del historial
    for (let i = 1; i < historyStack.length - 1; i++) {
      const step = historyStack[i];
      trailHtml += `
        <span class="breadcrumb-separator" style="color: #94A3B8; font-weight: bold;">/</span>
        <button type="button" class="breadcrumb-item breadcrumb-item-clickable" data-flow-id="${step.id}" style="cursor: pointer; background: transparent; border: none; padding: 0.2rem 0.45rem; border-radius: 6px; font-weight: 600; color: #005A29; display: inline-flex; align-items: center; transition: all 0.2s ease;">
          ${step.breadcrumb || step.title}
        </button>
      `;
    }

    // Paso del flujo actual
    if (!this.subViewInfo) {
      trailHtml += `
        <span class="breadcrumb-separator" style="color: #94A3B8; font-weight: bold;">/</span>
        <span class="breadcrumb-item active" style="font-weight: 700; color: var(--tdea-green-primary); padding: 0.2rem 0.45rem;" aria-current="page">
          ${currentFlow.breadcrumb || currentFlow.title}
        </span>
      `;
    } else {
      // El flujo actual se vuelve clicable porque estamos en una subvista interna
      trailHtml += `
        <span class="breadcrumb-separator" style="color: #94A3B8; font-weight: bold;">/</span>
        <button type="button" class="breadcrumb-item breadcrumb-item-clickable" data-flow-id="${currentFlow.id}" style="cursor: pointer; background: transparent; border: none; padding: 0.2rem 0.45rem; border-radius: 6px; font-weight: 600; color: #005A29; display: inline-flex; align-items: center; transition: all 0.2s ease;">
          ${currentFlow.breadcrumb || currentFlow.title}
        </button>
        <span class="breadcrumb-separator" style="color: #94A3B8; font-weight: bold;">/</span>
        <span class="breadcrumb-item active" style="font-weight: 700; color: var(--tdea-green-primary); padding: 0.2rem 0.45rem;" aria-current="page">
          ${this.subViewInfo.label}
        </span>
      `;
    }

    trailHtml += `</div>`;

    this.containerEl.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
        ${canGoBack ? `
          <button type="button" class="btn-back" id="nav-btn-back" title="Volver al paso anterior" style="display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.45rem 1rem; font-weight: 700; border-radius: 8px; cursor: pointer; transition: all 0.2s ease;">
            <span aria-hidden="true">←</span>
            <span>Volver</span>
          </button>
        ` : ''}
        ${trailHtml}
      </div>
      <div>
        <button type="button" class="btn-back" id="nav-btn-home" style="font-size: var(--font-size-xs); font-weight: 700; cursor: pointer;" title="Ir al menú principal de inicio">
          <span aria-hidden="true">🏠</span>
          <span>Menú Principal</span>
        </button>
      </div>
    `;

    // Event listeners
    const backBtn = this.containerEl.querySelector('#nav-btn-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (this.onNavigateBack) this.onNavigateBack();
      });
    }

    const homeBtn = this.containerEl.querySelector('#nav-btn-home');
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        if (this.onNavigateHome) this.onNavigateHome();
      });
    }

    const crumbHome = this.containerEl.querySelector('#nav-crumb-home');
    if (crumbHome) {
      crumbHome.addEventListener('click', () => {
        if (this.onNavigateHome) this.onNavigateHome();
      });
    }

    // Oyentes para todas las migas intermedias clicables
    const clickableCrumbs = this.containerEl.querySelectorAll('[data-flow-id]');
    clickableCrumbs.forEach(btn => {
      btn.addEventListener('click', () => {
        const flowId = btn.getAttribute('data-flow-id');
        if (flowId && this.onNavigateTo) {
          this.onNavigateTo(flowId);
        }
      });
    });
  }
}
