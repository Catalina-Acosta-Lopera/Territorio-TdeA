/**
 * Base de Datos Declarativa para el Chatbot Interactivo de FAQ
 * Asistente Virtual Territorio TdeA
 * 
 * Separación completa entre lógica y datos. Permite modificar o agregar
 * preguntas, respuestas y categorías sin tocar la lógica del chatbot.
 * NO utiliza IA generativa: todas las respuestas son predeterminadas e institucionales.
 */

export const CHATBOT_CATEGORIES = [
  {
    id: "tutoria",
    title: "TutorIA · Inteligencia Artificial",
    icon: "🎓",
    questions: [
      {
        id: "que-es-tutoria",
        question: "¿Qué es TutorIA (TurturIA) y cómo me apoya en mis asignaturas?",
        keywords: ["tutoria", "turturia", "ia", "inteligencia artificial", "tutor", "ciencias basicas", "dudas", "asistente ia", "acompanamiento ia", "documento", "tarjeta de identidad"],
        answer: "TutorIA es el compañero académico inteligente del Tecnológico de Antioquia adscrito al Departamento de Ciencias Básicas y Áreas Comunes.\n\nOfrece tutorías interactivas adaptadas a tu facultad y malla curricular, seguimiento de avance y retos de aprendizaje.\n\nPuedes ingresar directamente con tu documento de identidad aquí: https://asesorias-territorio-dcbac-tdea.ai.studio/"
      },
      {
        id: "como-ingresar-tutoria",
        question: "¿Cómo puedo acceder a TutorIA?",
        keywords: ["ingresar a tutoria", "acceder a tutoria", "link tutoria", "enlace tutoria", "entrar a tutoria", "url tutoria", "documento", "tarjeta de identidad", "documento de identidad"],
        answer: "Puedes ingresar a TutorIA de forma directa desde cualquier dispositivo en el enlace oficial:\nhttps://asesorias-territorio-dcbac-tdea.ai.studio/\n\nInicia sesión con tu número de documento de identidad."
      }
    ]
  },
  {
    id: "asesorias",
    title: "Asesorías académicas",
    icon: "📚",
    questions: [
      {
        id: "que-son",
        question: "¿Qué son las asesorías académicas?",
        keywords: ["que son", "definicion", "concepto", "para que sirven", "acompanamiento", "apoyo"],
        answer: "Las asesorías académicas son espacios de acompañamiento diseñados para apoyar a los estudiantes en la comprensión de los temas de sus asignaturas, resolver dudas y fortalecer su proceso de aprendizaje.\n\nAprovecha estos espacios para aclarar tus inquietudes y reforzar tus conocimientos."
      },
      {
        id: "como-solicitar",
        question: "¿Cómo puedo solicitar una asesoría?",
        keywords: ["solicitar", "pedir", "solicitud", "inscribirme", "agendar", "cita"],
        answer: "Puedes acceder a las asesorías disponibles de acuerdo con la programación establecida para Territorio TdeA.\n\nConsulta los horarios y selecciona el espacio correspondiente a la asesoría que necesitas.\n\nSi necesitas orientación, puedes comunicarte con nosotros:\nauxcienciasbasicas2@tdea.edu.co"
      },
      {
        id: "costo",
        question: "¿Las asesorías académicas tienen algún costo?",
        keywords: ["costo", "precio", "cobro", "pagar", "gratis", "gratuito", "valor"],
        answer: "No, las asesorías académicas de Territorio TdeA son un servicio institucional 100% gratuito para todos los estudiantes del Tecnológico de Antioquia."
      },
      {
        id: "otro-docente",
        question: "¿Puedo asistir con un docente que no sea mi profesor de clase?",
        keywords: ["otro docente", "mi profesor", "diferente profesor", "otro profesor", "grupo"],
        answer: "¡Sí, totalmente! Todos los docentes y monitores del área de Ciencias Básicas atienden y orientan a cualquier estudiante del TdeA, sin importar el grupo o docente con quien tengas matriculada la materia."
      },
      {
        id: "cuantas-veces",
        question: "¿Cuántas veces puedo asistir a las asesorías durante el semestre?",
        keywords: ["cuantas veces", "limite", "frecuencia", "numero de veces", "semanas", "semestre"],
        answer: "Puedes ingresar tantas veces como lo necesites en cualquier semana del periodo académico. No hay límite en el número de asesorías a las que puedes asistir."
      }
    ]
  },
  {
    id: "horarios",
    title: "Horarios",
    icon: "🗓️",
    questions: [
      {
        id: "donde-consultar-horarios",
        question: "¿Dónde puedo consultar los horarios?",
        keywords: ["horarios", "horario", "horas", "dias", "cuando", "programacion", "cronograma"],
        answer: "Los horarios de las asesorías se encuentran disponibles en el catálogo de asesorías de esta plataforma.\n\nPuedes consultar las asesorías disponibles, revisar el día y horario correspondiente y acceder al enlace de Microsoft Teams cuando la asesoría sea virtual.\n\nSi tienes dificultades para encontrar la información, puedes comunicarte con:\nauxcienciasbasicas2@tdea.edu.co"
      }
    ]
  },
  {
    id: "virtuales",
    title: "Asesorías virtuales",
    icon: "💻",
    questions: [
      {
        id: "como-ingresar-virtual",
        question: "¿Cómo ingreso a una asesoría virtual?",
        keywords: ["teams", "microsoft teams", "virtual", "virtuales", "ingreso", "ingresar", "entrar", "entro", "enlace", "link", "unirme"],
        answer: "Para participar en una asesoría virtual debes ingresar al enlace de Microsoft Teams correspondiente a la asesoría programada.\n\nPuedes consultar las asesorías disponibles en el catálogo de esta plataforma y utilizar el enlace correspondiente.\n\nTe recomendamos ingresar unos minutos antes de la hora establecida.\n\nSi tienes dificultades para acceder, puedes comunicarte con:\nauxcienciasbasicas2@tdea.edu.co"
      },
      {
        id: "que-tener-preparado",
        question: "¿Qué debo tener preparado antes de ingresar a la asesoría?",
        keywords: ["preparado", "que llevar", "materiales", "ejercicios", "apuntes", "antes de ingresar"],
        answer: "Te recomendamos tener a mano tus apuntes, los enunciados de los talleres o ejercicios en los que requieras orientación, y haber iniciado sesión en Microsoft Teams con tu correo institucional de estudiante @correo.tdea.edu.co."
      },
      {
        id: "docente-ausente",
        question: "¿Qué hago si el docente no se encuentra en la sala de Teams?",
        keywords: ["no esta el docente", "profesor no llego", "ausente", "sala vacia", "no aparece"],
        answer: "Verifica primero que hayas ingresado en el día y horario exacto según la programación. Si persiste la ausencia tras unos minutos, repórtalo escribiendo a auxcienciasbasicas2@tdea.edu.co para validar la sesión."
      }
    ]
  },
  {
    id: "asignaturas",
    title: "Asignaturas",
    icon: "📖",
    questions: [
      {
        id: "que-asignaturas",
        question: "¿Qué asignaturas tienen asesorías?",
        keywords: ["asignaturas", "materias", "areas", "temas", "matematicas", "fisica", "quimica", "estadistica", "biologia"],
        answer: "Las asesorías disponibles se encuentran organizadas en el catálogo de asesorías académicas.\n\nConsulta allí las áreas disponibles y los horarios correspondientes.\n\nLa programación puede variar durante el periodo académico.\n\nSi necesitas confirmar una asesoría específica, puedes comunicarte con:\nauxcienciasbasicas2@tdea.edu.co"
      }
    ]
  },
  {
    id: "estudiantes",
    title: "Estudiantes de Territorio",
    icon: "👨‍🎓",
    questions: [
      {
        id: "quienes-pueden-acceder",
        question: "¿Quiénes pueden acceder a las asesorías?",
        keywords: ["quienes", "acceder", "requisitos", "quien puede", "participar", "estudiantes"],
        answer: "Las asesorías están orientadas a apoyar a los estudiantes que hacen parte de los procesos académicos de Territorio TdeA y requieren acompañamiento para fortalecer sus aprendizajes.\n\nSi tienes dudas sobre tu acceso a estos espacios, puedes comunicarte con:\nauxcienciasbasicas2@tdea.edu.co"
      },
      {
        id: "que-hago-si-no-puedo-asistir",
        question: "¿Qué hago si no puedo asistir a una asesoría?",
        keywords: ["asistir", "inasistencia", "no puedo", "falta", "perdida", "otra alternativa", "otro horario"],
        answer: "Puedes consultar nuevamente el catálogo de asesorías para identificar otros espacios disponibles para la misma área.\n\nSi necesitas ayuda para encontrar una alternativa, puedes comunicarte con:\nauxcienciasbasicas2@tdea.edu.co"
      },
      {
        id: "solo-escuchar",
        question: "¿Puedo ingresar si solo quiero escuchar o repasar un tema?",
        keywords: ["solo escuchar", "escuchar", "oyente", "repasar", "sin preguntas", "observar"],
        answer: "Sí. Aunque es muy provechoso llevar dudas puntuales o ejercicios, las salas virtuales están abiertas para que escuches explicaciones de temas clave, observes las dudas de otros compañeros y afiances tus conocimientos."
      }
    ]
  },
  {
    id: "campus_vital",
    title: "Campus Vital · Bienestar y Proyecto de Vida",
    icon: "🌱",
    questions: [
      {
        id: "que-es-campus-vital",
        question: "¿Qué es Campus Vital y cómo me apoya en mi vida universitaria?",
        keywords: ["campus vital", "bienestar", "salud mental", "emocional", "estres", "ansiedad", "permanencia", "vida universitaria", "vital"],
        answer: "Campus Vital es la estrategia pedagógica de bienestar institucional y permanencia del Tecnológico de Antioquia con enfoque DUA.\n\nOfrece dos módulos formativos gamificados:\n🚂 Módulo 1: «Preparar el equipaje» (Bienestar emocional y brújula de autorregulación).\n🏔️ Módulo 2: «Elegir el rumbo» (Adaptación universitaria y árbol del proyecto de vida).\n\nPuedes acceder directamente desde el botón flotante con la mascota institucional 🌱."
      },
      {
        id: "modulo-1-campus-vital",
        question: "¿En qué consiste el Módulo 1 de Campus Vital (Preparar el equipaje)?",
        keywords: ["modulo 1", "preparar el equipaje", "brujula emocional", "rueda de la vida", "caso juan", "estacion", "tren", "maleta", "zona roja", "zona amarilla", "zona verde", "zona azul", "estres", "parciales", "ansiedad", "respiracion"],
        answer: "El Módulo 1 es un recorrido en tren por tres estaciones para empacar tu maleta de bienestar:\n\n1. Estación 1: Brújula emocional en 4 zonas (🔴 Roja: pausa y respiración; 🟡 Amarilla: ansiedad por parciales, técnica 4-7-8; 🟢 Verde: calma y estudio; 🔵 Azul: descanso y apoyo interpersonal).\n2. Estación 2: Rueda interactiva de la vida (8 dimensiones de equilibrio personal).\n3. Estación 3: Red de apoyo institucional (Caso Juan y directorio TdeA).\n\nIncluye el Microcurso 1 de Autogestión del Aprendizaje (cápsula y taller práctico)."
      },
      {
        id: "modulo-2-campus-vital",
        question: "¿Qué es el Módulo 2 de Campus Vital y cuáles son las partes del árbol de proyecto de vida?",
        keywords: ["modulo 2", "elegir el rumbo", "arbol", "proyecto de vida", "raices", "tronco", "ramas", "frutos", "valores", "fortalezas", "metas", "suenos", "montana", "ascenso", "adaptacion", "caso daniel"],
        answer: "El Módulo 2 es un ascenso a la montaña dividido en dos rutas:\n\n🌲 Ruta 1: Construyendo mi proyecto de vida con «El árbol de mi proyecto de vida»:\n- 🌿 Raíces = Valores éticos y principios que dan firmeza.\n- 🪵 Tronco = Fortalezas y habilidades que dan soporte ante dificultades.\n- 🍃 Ramas = Metas concretas a corto y mediano plazo.\n- 🍎 Frutos = Sueños y anhelos profundos a cosechar.\n\n🧗 Ruta 2: Adaptación a la vida universitaria (Podcast DUA, termómetro, caso Daniel y plan personal).\n\nIncluye el Microcurso 2 de Adaptación a la Vida Universitaria (cápsula y taller práctico)."
      },
      {
        id: "ansiedad-estres-apoyo",
        question: "¿Qué hago si siento mucho estrés, ansiedad o dificultades para adaptarme?",
        keywords: ["estres", "ansiedad", "angustia", "desespero", "perdido", "colapso", "miedo", "parciales", "nervios", "panico", "psicologia", "apoyo emocional", "ayuda psicologica", "bienestar"],
        answer: "En el TdeA cuentas con una red de apoyo integral:\n\n1. En Campus Vital (Módulo 1) aplica la técnica de respiración 4-7-8 y fragmenta tus tareas en metas escalonadas.\n2. Asiste libremente a las Asesorías en Teams y practica en TutorIA con tu documento de identidad.\n3. Para citas de psicología y orientación psicoeducativa, acude a la Dirección de Bienestar Institucional (Bloque 2, Campus Robledo) o escribe a: bienestar@tdea.edu.co."
      }
    ]
  }
];

export const ADVISOR_CONTACT = {
  id: "contacto",
  title: "Contacto por correo institucional",
  icon: "✉️",
  email: "auxcienciasbasicas2@tdea.edu.co",
  message: "¿Necesitas resolver una situación específica o no encontraste la respuesta que buscabas?\n\nPuedes comunicarte directamente con el equipo de Ciencias Básicas.\n\nauxcienciasbasicas2@tdea.edu.co"
};

export const UNKNOWN_QUESTION_RESPONSE = {
  message: "No tengo información disponible sobre esa consulta.\n\nPara recibir orientación personalizada, puedes comunicarte con un asesor:\n\nauxcienciasbasicas2@tdea.edu.co",
  email: "auxcienciasbasicas2@tdea.edu.co"
};

/**
 * Busca coincidencias en las preguntas y respuestas preconfiguradas.
 * NO utiliza IA ni inventa respuestas.
 * Realiza un emparejamiento determinista de palabras clave.
 * @param {string} rawQuery Término de búsqueda
 * @returns {Array<{categoryTitle: string, questionId: string, question: string, answer: string, score: number}>}
 */
export function findMatchingFaq(rawQuery) {
  if (!rawQuery || typeof rawQuery !== 'string') return [];
  
  const normalized = rawQuery
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!.,:;()]/g, " ")
    .trim();
  
  if (normalized.length < 2) return [];

  const queryWords = normalized.split(/\s+/).filter(w => w.length > 2);
  const results = [];

  for (const cat of CHATBOT_CATEGORIES) {
    for (const q of cat.questions) {
      const qNorm = q.question
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const aNorm = q.answer
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const keywordsNorm = (q.keywords || []).map(k => 
        k.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      );

      let matchCount = 0;
      for (const word of queryWords) {
        if (keywordsNorm.some(k => k.includes(word) || word.includes(k))) {
          matchCount += 5; // Máxima relevancia a palabras clave directas
        } else if (qNorm.includes(word)) {
          matchCount += 3; // Mayor peso si coincide en el título de la pregunta
        } else if (aNorm.includes(word)) {
          matchCount += 1;
        }
      }

      if (qNorm.includes(normalized) || keywordsNorm.some(k => k.includes(normalized)) || matchCount > 0) {
        results.push({
          categoryTitle: cat.title,
          questionId: q.id,
          question: q.question,
          answer: q.answer,
          score: matchCount
        });
      }
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
