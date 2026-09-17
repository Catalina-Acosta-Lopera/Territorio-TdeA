/**
 * Servicio de Inteligencia Artificial (Contrato de Integración Futura)
 * 
 * Este módulo deja preparada la arquitectura para conectar un modelo de lenguaje (LLM),
 * embeddings o sistema RAG sobre la base de conocimiento de Territorio TdeA.
 */

export class AIService {
  constructor() {
    this.isReady = false;
    this.endpoint = null; // Se configurará con el endpoint del backend institucional
  }

  /**
   * Envía una consulta en lenguaje natural
   * @param {string} userQuery Pregunta del estudiante
   * @returns {Promise<Object>} Respuesta estructurada del asistente IA
   */
  async askQuestion(userQuery) {
    if (!this.isReady) {
      return {
        success: false,
        status: 'UPCOMING',
        message: 'El módulo de Inteligencia Artificial institucional se integrará en una fase posterior.',
        suggestedFlow: 'home'
      };
    }

    // Estructura lista para fetch hacia la API institucional del TdeA:
    // const response = await fetch(this.endpoint, { method: 'POST', body: JSON.stringify({ query: userQuery }) });
    // return await response.json();
  }

  /**
   * Obtiene preguntas sugeridas o frecuentes para orientar al estudiante
   */
  getSuggestedPrompts() {
    return [
      '¿Cuándo inician las asesorías de matemáticas?',
      '¿Cómo solicito acompañamiento para organizar mi horario?',
      '¿Qué hago si no puedo acceder a mi correo institucional?'
    ];
  }
}

export const aiService = new AIService();
