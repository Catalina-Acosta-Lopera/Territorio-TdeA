/**
 * Aplicación Principal - Asistente Virtual Territorio TdeA
 * Punto de entrada y orquestación de la interfaz de usuario
 */

import { Router } from './router.js?v=20260908_08';
import { Breadcrumbs } from './components/breadcrumbs.js?v=20260908_08';
import { AssistantView } from './components/assistantView.js?v=20260909_15';
import { accessibilityWidget } from './components/accessibilityWidget.js?v=20260916_07';
import { tutoriaWidget } from './components/tutoriaWidget.js?v=20260916_07';
import { scrollToTop } from './components/scrollToTop.js?v=20260908_10';

class App {
  constructor() {
    this.breadcrumbsContainer = document.getElementById('navigation-bar');
    this.stageContainer = document.getElementById('stage-body');
    this.breadcrumbs = null;
    this.assistantView = null;
    this.router = null;
    this.faqChat = null;
  }

  init() {
    if (!this.breadcrumbsContainer || !this.stageContainer) {
      console.error('No se encontraron los contenedores principales del DOM.');
      return;
    }

    // Instanciar componentes
    this.breadcrumbs = new Breadcrumbs(
      this.breadcrumbsContainer,
      () => this.router.goBack(),
      () => this.router.goHome()
    );

    this.assistantView = new AssistantView(
      this.stageContainer,
      (flowId) => this.router.navigate(flowId)
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

    // Inicializar botón flotante de retorno superior
    scrollToTop.init();

    // El widget flotante de FAQ y Asesorías se inicializa de forma autónoma en js/faqWidget.js
    // garantizando funcionamiento 100% robusto tanto en servidor http:// como en modo local file:///
    console.info('🚀 Asistente Virtual Territorio TdeA inicializado correctamente.');
  }

  renderView(currentFlow, historyStack) {
    // Actualizar migas de pan y botón de regreso
    this.breadcrumbs.render(historyStack, currentFlow);

    // Renderizar cuerpo del asistente
    this.assistantView.render(currentFlow);

    // Scroll suave hacia la parte superior del escenario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
