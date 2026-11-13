/**
 * Aplicación Principal - Asistente Virtual Territorio TdeA
 * Punto de entrada y orquestación de la interfaz de usuario
 */

import { Router } from './router.js?v=20260927_02';
import { Breadcrumbs } from './components/breadcrumbs.js?v=20261112_05';
import { AssistantView } from './components/assistantView.js?v=20261113_04';
import { accessibilityWidget } from './components/accessibilityWidget.js?v=20260927_02';
import { tutoriaWidget } from './components/tutoriaWidget.js?v=20261103_01';
import { campusVitalWidget } from './components/campusVitalWidget.js?v=20261112_04';
import { scrollToTop } from './components/scrollToTop.js?v=20260927_02';

class App {
  constructor() {
    this.breadcrumbsContainer = document.getElementById('navigation-bar');
    this.stageContainer = document.getElementById('stage-body');
    this.breadcrumbs = null;
    this.assistantView = null;
    this.router = null;
    this.faqChat = null;
    this.currentFlow = null;
    this.historyStack = [];
  }

  init() {
    window.tdeaApp = this;
    if (!this.breadcrumbsContainer || !this.stageContainer) {
      console.error('No se encontraron los contenedores principales del DOM.');
      return;
    }

    // Instanciar componentes con controlador único de retorno e interactividad
    this.breadcrumbs = new Breadcrumbs(
      this.breadcrumbsContainer,
      () => this.handleBack(),
      () => this.router.goHome(),
      (flowId) => this.router.navigate(flowId)
    );

    this.assistantView = new AssistantView(
      this.stageContainer,
      (flowId) => this.router.navigate(flowId),
      (subViewInfo) => this.handleSubViewChange(subViewInfo)
    );

    // Inicializar el router con callback de actualización
    this.router = new Router((currentFlow, historyStack) => {
      this.renderView(currentFlow, historyStack);
    });

    // Enlace de logo principal para ir a home
    const brandLogo = document.getElementById('brand-home-link');
    if (brandLogo) {
      brandLogo.addEventListener('click', (e) => {
        e.preventDefault();
        this.router.goHome();
      });
    }

    // Inicializar el widget y servicio de accesibilidad institucional TdeA
    accessibilityWidget.init();

    // Inicializar el widget flotante y panel lateral de TutorIA TdeA
    tutoriaWidget.init();

    // Inicializar el widget flotante y panel de Campus Vital TdeA (Bienestar Emocional)
    campusVitalWidget.init();

    // Inicializar botón flotante de retorno superior
    scrollToTop.init();

    // El widget flotante de FAQ y Asesorías se inicializa de forma autónoma en js/faqWidget.js
    // garantizando funcionamiento 100% robusto tanto en servidor http:// como en modo local file:///
    console.info('🚀 Asistente Virtual Territorio TdeA inicializado correctamente.');
  }

  handleBack() {
    // Si la vista interna (p.ej. submódulo o bitácora del Centro de Aprendizaje) consume el retorno, detener
    if (this.assistantView && typeof this.assistantView.handleBack === 'function') {
      if (this.assistantView.handleBack()) {
        return;
      }
    }
    if (this.breadcrumbs) {
      this.breadcrumbs.clearSubView();
    }
    this.router.goBack();
  }

  handleSubViewChange(subViewInfo) {
    if (this.breadcrumbs) {
      if (subViewInfo) {
        this.breadcrumbs.setSubView(subViewInfo);
      } else {
        this.breadcrumbs.clearSubView();
      }
      const activeFlow = this.currentFlow || (this.router.historyStack[this.router.historyStack.length - 1] || { id: 'home', title: 'Inicio' });
      this.breadcrumbs.render(this.router.historyStack, activeFlow);
    }
  }

  renderView(currentFlow, historyStack) {
    this.currentFlow = currentFlow;
    this.historyStack = historyStack;

    // Limpiar subvista activa al cambiar de flujo
    if (this.breadcrumbs) {
      this.breadcrumbs.clearSubView();
      this.breadcrumbs.render(historyStack, currentFlow);
    }

    // Renderizar cuerpo del asistente
    this.assistantView.render(currentFlow);

    // Scroll suave hacia la parte superior del escenario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Iniciar cuando el DOM esté listo
const startApp = () => {
  if (!window.tdeaApp) {
    const app = new App();
    app.init();
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
