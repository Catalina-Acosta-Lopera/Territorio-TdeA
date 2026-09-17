/**
 * Sugerencias Institucionales antes de Iniciar una Asesoría
 * Asistente Virtual Territorio TdeA - Ciencias Básicas
 * Tecnológico de Antioquia Institución Universitaria
 * 
 * Contenido orientador y formativo para estudiantes.
 * Tono institucional, cercano, educativo y claro.
 */

export const ADVISORY_TIPS_DATA = [
  {
    id: "microfono",
    icon: "🎙️",
    title: "Micrófono en silencio",
    description: "Al ingresar a la asesoría, mantén tu micrófono en silencio mientras el docente o asesor esté explicando. Actívalo cuando necesites participar o realizar una pregunta."
  },
  {
    id: "puntualidad",
    icon: "⏰",
    title: "Sé puntual",
    description: "Procura ingresar a la asesoría unos minutos antes de la hora programada para verificar tu conexión y estar listo cuando inicie el encuentro."
  },
  {
    id: "asistencia-qr",
    icon: "📱",
    title: "Solicita el código QR de asistencia",
    description: "Al finalizar la asesoría, recuerda solicitar al docente o asesor el código QR de asistencia y diligenciarlo antes de retirarte."
  },
  {
    id: "materiales",
    icon: "📚",
    title: "Ten preparados tus materiales",
    description: "Antes de ingresar, procura tener disponibles tus apuntes, talleres, ejercicios o preguntas específicas sobre las que necesitas orientación."
  },
  {
    id: "conexion",
    icon: "💻",
    title: "Verifica tu conexión",
    description: "Comprueba previamente que tengas conexión a internet y que Microsoft Teams funcione correctamente en tu dispositivo."
  },
  {
    id: "participacion",
    icon: "🙋",
    title: "Participa y pregunta",
    description: "Las asesorías son espacios para resolver dudas. No dudes en participar, formular preguntas y solicitar explicaciones cuando un tema no haya quedado claro."
  },
  {
    id: "identifica-duda",
    icon: "🎯",
    title: "Identifica tu duda",
    description: "Si tienes una dificultad específica, procura identificar previamente el ejercicio, tema o concepto que deseas revisar. Esto ayudará a aprovechar mejor el tiempo de la asesoría."
  }
];

// Compatibilidad con scripts no modulares en el navegador
if (typeof window !== 'undefined') {
  window.ADVISORY_TIPS_DATA = ADVISORY_TIPS_DATA;
}
