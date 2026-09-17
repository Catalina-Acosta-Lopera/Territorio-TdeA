/**
 * Servicio de Analítica y Telemetría de Uso (Contrato Futuro)
 * 
 * Permite cuantificar cuáles son los temas más consultados por los estudiantes
 * (asesorías, Teams, permanencia, etc.) preservando la privacidad.
 */

export class AnalyticsService {
  constructor() {
    this.eventsLog = [];
  }

  /**
   * Registra la navegación hacia un flujo o interacción de opción
   * @param {string} flowId Identificador del flujo
   * @param {string} action Tipo de acción realizada
   */
  logEvent(flowId, action = 'NAVIGATE') {
    const event = {
      flowId,
      action,
      timestamp: new Date().toISOString()
    };
    this.eventsLog.push(event);
    // En producción enviará métricas agregadas al dashboard institucional
  }

  /**
   * Obtiene resumen de eventos locales para depuración
   */
  getSummary() {
    return {
      totalInteractions: this.eventsLog.length,
      events: this.eventsLog
    };
  }
}

export const analyticsService = new AnalyticsService();
