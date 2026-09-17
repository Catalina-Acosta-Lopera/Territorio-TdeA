/**
 * Enrutador y Gestor de Estados de Navegación
 * Asistente Virtual Territorio TdeA
 * 
 * Gestiona el historial de navegación, la sincronización con el hash de la URL
 * y la persistencia de estados entre pantallas.
 */

import { FLOWS } from './data/flowsConfig.js';
import { analyticsService } from './services/analyticsService.js';

export class Router {
  constructor(onRouteChange) {
    this.onRouteChange = onRouteChange;
    this.historyStack = [];
    this.currentFlowId = 'home';
    this.init();
  }

  init() {
    // Escuchar cambios de hash en la ventana (soporte para botones adelante/atrás del navegador)
    window.addEventListener('hashchange', () => {
      const hashFlow = this.getFlowIdFromHash();
      this.navigate(hashFlow, false);
    });

    // Cargar flujo inicial basado en URL hash o 'home'
    const initialFlow = this.getFlowIdFromHash() || 'home';
    this.navigate(initialFlow, false);
  }

  getFlowIdFromHash() {
    const hash = window.location.hash.replace(/^#\/?/, '').trim();
    if (hash && FLOWS[hash]) {
      return hash;
    }
    return null;
  }

  /**
   * Navega hacia un flujo específico
   * @param {string} flowId Identificador del flujo destino
   * @param {boolean} updateHash Si se debe actualizar el hash en la URL
   */
  navigate(flowId, updateHash = true) {
    const targetFlow = FLOWS[flowId] || FLOWS.home;
    const resolvedId = targetFlow.id;

    if (resolvedId === 'home') {
      this.historyStack = [FLOWS.home];
    } else {
      // Si el flujo tiene padre y la pila está vacía o viene de URL directa, reconstruir jerarquía
      if (this.historyStack.length === 0) {
        this.historyStack = [FLOWS.home];
        if (targetFlow.parent && targetFlow.parent !== 'home' && FLOWS[targetFlow.parent]) {
          this.historyStack.push(FLOWS[targetFlow.parent]);
        }
        this.historyStack.push(targetFlow);
      } else {
        // Comprobar si ya existe en la pila para no duplicar
        const existingIndex = this.historyStack.findIndex(item => item.id === resolvedId);
        if (existingIndex !== -1) {
          this.historyStack = this.historyStack.slice(0, existingIndex + 1);
        } else {
          this.historyStack.push(targetFlow);
        }
      }
    }

    this.currentFlowId = resolvedId;

    if (updateHash) {
      window.location.hash = resolvedId === 'home' ? '' : `#/${resolvedId}`;
    }

    // Registrar evento analítico
    analyticsService.logEvent(resolvedId, 'NAVIGATE');

    // Notificar al oyente de cambio de ruta
    if (this.onRouteChange) {
      this.onRouteChange(targetFlow, this.historyStack);
    }
  }

  /**
   * Regresa al paso anterior en el historial
   */
  goBack() {
    if (this.historyStack.length > 1) {
      this.historyStack.pop();
      const prevFlow = this.historyStack[this.historyStack.length - 1];
      this.navigate(prevFlow.id, true);
    } else {
      this.navigate('home', true);
    }
  }

  /**
   * Regresa directamente al menú de inicio
   */
  goHome() {
    this.navigate('home', true);
  }

  getCurrentFlow() {
    return FLOWS[this.currentFlowId] || FLOWS.home;
  }

  getHistory() {
    return [...this.historyStack];
  }
}
