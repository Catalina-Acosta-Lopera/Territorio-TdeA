/**
 * Servicio de Seguimiento y Permanencia Estudiantil (Contrato Futuro)
 * 
 * Diseñado para gestionar remisiones institucionales, alertas tempranas
 * y registro de apoyo pedagógico sin comprometer datos personales en esta fase.
 */

export class TrackingService {
  constructor() {
    this.sessionRecords = [];
  }

  /**
   * Registra una intención de remisión o acompañamiento
   * @param {Object} referralData Datos de la solicitud de apoyo
   */
  async registerReferral(referralData) {
    const record = {
      id: 'ref-' + Date.now(),
      category: referralData.category,
      timestamp: new Date().toISOString(),
      status: 'PENDING_INSTITUTIONAL_INTEGRATION'
    };

    this.sessionRecords.push(record);
    // Arquitectura preparada para persistir en backend / CRM de Permanencia TdeA
    return {
      success: true,
      referenceCode: record.id
    };
  }

  /**
   * Obtiene el historial de consultas de la sesión actual
   */
  getSessionHistory() {
    return [...this.sessionRecords];
  }
}

export const trackingService = new TrackingService();
