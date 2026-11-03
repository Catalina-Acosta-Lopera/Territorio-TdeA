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
    if (!userQuery || typeof userQuery !== 'string') {
      return {
        success: false,
        message: 'Por favor ingresa una pregunta válida.'
      };
    }

    const q = userQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Respuestas deterministas pedagógicas inmediatas de la Base de Conocimiento oficial
    if (q.includes('costo') || q.includes('gratis') || q.includes('precio') || q.includes('pagar')) {
      return {
        success: true,
        answer: 'Todas las asesorías académicas, microcursos, talleres y servicios de Territorio TdeA son 100% gratuitos para todos los estudiantes de la institución.',
        category: 'asesorias'
      };
    }

    if (q.includes('tutoria') || q.includes('turturia') || q.includes('inteligencia artificial') || q.includes('ia')) {
      return {
        success: true,
        answer: 'TutorIA es el compañero interactivo inteligente de Ciencias Básicas. Puedes ingresar directamente desde cualquier dispositivo con tu número de documento de identidad en: https://tutoria-tdea.ai.studio/',
        category: 'tutoria'
      };
    }

    if (q.includes('arbol') || q.includes('proyecto de vida')) {
      return {
        success: true,
        answer: 'En el Módulo 2 de Campus Vital («Elegir el rumbo»), «El árbol de mi proyecto de vida» se compone de:\n🌿 Raíces: Tus Valores que dan firmeza ética.\n🪵 Tronco: Tus Fortalezas y soporte personal.\n🍃 Ramas: Tus Metas escalonadas a corto y mediano plazo.\n🍎 Frutos: Tus Sueños y anhelos profundos a cosechar.',
        category: 'campus_vital'
      };
    }

    if (q.includes('estres') || q.includes('ansiedad') || q.includes('parcial') || q.includes('nervios')) {
      return {
        success: true,
        answer: 'Para gestionar la ansiedad ante parciales, en el Módulo 1 de Campus Vital recomendamos la técnica de respiración 4-7-8, fragmentar tus repasos y asistir a las asesorías virtuales de Microsoft Teams. Si necesitas orientación psicológica, Bienestar Institucional atiende en el Bloque 2 o en bienestar@tdea.edu.co.',
        category: 'campus_vital'
      };
    }

    if (q.includes('teams') || q.includes('virtual') || q.includes('entrar') || q.includes('acceder') || q.includes('horario')) {
      return {
        success: true,
        answer: 'Para ingresar a las asesorías de Ciencias Básicas, consulta la sección "Asesorías disponibles" en la plataforma. Las sesiones se realizan en salas de Microsoft Teams sin cita previa.',
        category: 'asesorias'
      };
    }

    return {
      success: true,
      answer: 'Para inquietudes particulares o acompañamiento docente, puedes escribir al correo oficial del Departamento de Ciencias Básicas: auxcienciasbasicas2@tdea.edu.co o consultar el catálogo de horarios de Territorio TdeA.',
      suggestedFlow: 'home'
    };
  }

  /**
   * Obtiene preguntas sugeridas o frecuentes para orientar al estudiante
   */
  getSuggestedPrompts() {
    return [
      '¿Cuánto cuesta asistir a las asesorías de cálculo?',
      '¿Cómo ingreso a TutorIA?',
      '¿Cuáles son las partes del árbol de proyecto de vida en Campus Vital?',
      '¿Qué hago si siento mucha ansiedad antes de un parcial?',
      '¿Cómo entro a las asesorías virtuales en Teams?'
    ];
  }
}

export const aiService = new AIService();
