/**
 * Base de Datos Declarativa de Preguntas Frecuentes (FAQ)
 * Asistente Virtual de Asesorías Territorio TdeA
 * 
 * Diseñada para resolver las dudas más comunes de los estudiantes
 * y facilitar su participación en las asesorías académicas.
 */

export const FAQ_DATA = [
  {
    id: 'faq-01',
    question: '¿Las asesorías académicas tienen algún costo?',
    answer: 'No, las asesorías académicas de Territorio TdeA son un servicio institucional 100% gratuito para todos los estudiantes de pregrado de territorio del Tecnológico de Antioquia.',
    category: 'general',
    icon: '🏷️'
  },
  {
    id: 'faq-02',
    question: '¿Puedo asistir con un docente que no sea mi profesor de clase?',
    answer: '¡Sí, totalmente! Todos los docentes y monitores del área de Ciencias Básicas atienden y orientan a cualquier estudiante del TdeA, sin importar el grupo o docente con quien tengas matriculada la materia.',
    category: 'participacion',
    icon: '👨‍🏫'
  },
  {
    id: 'faq-03',
    question: '¿Puedo ingresar si solo quiero escuchar o repasar un tema?',
    answer: 'Sí. Aunque es muy provechoso llevar dudas puntuales o ejercicios, las salas virtuales están abiertas para que escuches explicaciones de temas clave, observes las dudas de otros compañeros y afiances tus conocimientos.',
    category: 'participacion',
    icon: '🎧'
  },
  {
    id: 'faq-04',
    question: '¿Qué debo tener preparado antes de ingresar a la asesoría?',
    answer: 'Te recomendamos tener a mano tus apuntes, los enunciados de los talleres o ejercicios en los que requieras orientación, y haber iniciado sesión en Microsoft Teams con tu correo institucional de estudiante @correo.tdea.edu.co.',
    category: 'preparacion',
    icon: '📝'
  },
  {
    id: 'faq-05',
    question: '¿Cuántas veces puedo asistir a las asesorías durante el semestre?',
    answer: 'Puedes ingresar tantas veces como lo necesites en cualquier semana del periodo académico. No hay límite en el número de asesorías a las que puedes asistir.',
    category: 'general',
    icon: '🔄'
  },
  {
    id: 'faq-06',
    question: '¿Qué hago si el docente no se encuentra en la sala de Teams?',
    answer: 'Verifica primero que hayas ingresado en el día y horario exacto según la programación. Si persiste la ausencia tras unos minutos, repórtalo escribiendo a auxcienciasbasicas2@tdea.edu.co para validar la sesión.',
    category: 'soporte',
    icon: '⏰'
  },
  {
    id: 'faq-07',
    question: '¿Qué es TutorIA (TurturIA) y cómo me acompaña en mis asignaturas?',
    answer: 'TutorIA es el compañero académico inteligente del Tecnológico de Antioquia, adscrito al Departamento de Ciencias Básicas y Áreas Comunes. Ofrece tutorías interactivas adaptadas a tu facultad, seguimiento de estudio y gamificación. Puedes ingresar directamente con tu documento de identidad en: https://asesorias-territorio-dcbac-tdea.ai.studio/',
    category: 'ia_tutoria',
    icon: '🎓'
  }
];

/**
 * Busca en las preguntas frecuentes por término de búsqueda
 */
export function searchFaqs(query = '') {
  const clean = query.toLowerCase().trim();
  if (!clean) return FAQ_DATA;
  return FAQ_DATA.filter(item =>
    item.question.toLowerCase().includes(clean) ||
    item.answer.toLowerCase().includes(clean)
  );
}
