/**
 * Widget Flotante Autónomo de Preguntas Frecuentes y Asesorías
 * Estilo Corporación Gilberto Echeverri (corporaciongilbertoecheverri.gov.co)
 * Territorio TdeA - Ciencias Básicas
 * 
 * Este script es 100% autónomo (vanilla JS, sin type="module") para garantizar
 * funcionamiento inmediato bajo cualquier protocolo (http://, https://, file:///)
 * y sin problemas de CORS ni dependencias de módulos.
 */

(function() {
  'use strict';

  // ==========================================================================
  // Datos Declarativos de Preguntas Frecuentes Institucionales TdeA
  // ==========================================================================
  const CHATBOT_CATEGORIES = [
    {
      id: "tutoria",
      title: "TutorIA · Inteligencia Artificial",
      icon: "🎓",
      questions: [
        {
          id: "que-es-tutoria",
          question: "¿Qué es TutorIA (TurturIA) y cómo me apoya en mis asignaturas?",
          keywords: ["tutoria", "turturia", "ia", "inteligencia artificial", "tutor", "ciencias basicas", "dudas", "asistente ia", "acompanamiento ia", "documento", "tarjeta de identidad"],
          answer: "TutorIA es el compañero académico inteligente del Tecnológico de Antioquia adscrito al Departamento de Ciencias Básicas y Áreas Comunes.\n\nOfrece tutorías interactivas adaptadas a tu facultad y malla curricular, seguimiento de avance y retos de aprendizaje.\n\nPuedes ingresar directamente con tu documento de identidad aquí: https://tutoria-tdea.ai.studio/"
        },
        {
          id: "como-ingresar-tutoria",
          question: "¿Cómo puedo acceder a TutorIA?",
          keywords: ["ingresar a tutoria", "acceder a tutoria", "link tutoria", "enlace tutoria", "entrar a tutoria", "url tutoria", "documento", "tarjeta de identidad", "documento de identidad"],
          answer: "Puedes ingresar a TutorIA de forma directa desde cualquier dispositivo en el enlace oficial:\nhttps://tutoria-tdea.ai.studio/\n\nInicia sesión con tu número de documento de identidad."
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
          answer: "Puedes acceder a las asesorías disponibles de acuerdo con la programación establecida para Territorio TdeA.\n\nConsulta los horarios y selecciona el espacio correspondiente a la asesoría que necesitas. No requieres cita previa ni inscripción previa para ingresar a las salas virtuales de Microsoft Teams.\n\nSi necesitas orientación adicional, puedes comunicarte con:\nauxcienciasbasicas2@tdea.edu.co"
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
      title: "Horarios de asesorías",
      icon: "🗓️",
      questions: [
        {
          id: "donde-consultar-horarios",
          question: "¿Dónde puedo consultar los horarios?",
          keywords: ["horarios", "horario", "horas", "dias", "cuando", "programacion", "cronograma"],
          answer: "Los horarios de las asesorías se encuentran disponibles en la sección 'Asesorías disponibles' de la página principal.\n\nPuedes consultar los días y horas programadas por área (Matemáticas, Física, Biología, Estadística, Química y Habilidades) con enlace directo a Microsoft Teams para cada sesión.\n\nSi tienes dificultades para encontrar la información, puedes comunicarte con:\nauxcienciasbasicas2@tdea.edu.co"
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
          answer: "Para participar en una asesoría virtual debes ingresar al enlace de Microsoft Teams correspondiente a la asesoría programada.\n\nPuedes consultar las asesorías en la sección 'Asesorías disponibles' de la plataforma y hacer clic en 'Ingresar a Teams'.\n\nTe recomendamos ingresar unos minutos antes de la hora establecida e iniciar sesión con tu correo institucional de estudiante @correo.tdea.edu.co.\n\nSi tienes dificultades para acceder, puedes comunicarte con:\nauxcienciasbasicas2@tdea.edu.co"
        },
        {
          id: "que-tener-preparado",
          question: "¿Qué debo tener preparado antes de ingresar a la asesoría?",
          keywords: ["preparado", "que llevar", "materiales", "ejercicios", "apuntes", "antes de ingresar"],
          answer: "Te recomendamos tener a mano tus apuntes de clase, los enunciados de los talleres o ejercicios específicos en los que requieras orientación, y haber iniciado sesión en Microsoft Teams con tu correo institucional de estudiante @correo.tdea.edu.co."
        },
        {
          id: "docente-ausente",
          question: "¿Qué hago si el docente no se encuentra en la sala de Teams?",
          keywords: ["no esta el docente", "profesor no llego", "ausente", "sala vacia", "no aparece"],
          answer: "Verifica primero que hayas ingresado en el día y horario exacto según la programación. Si persiste la ausencia tras unos minutos, repórtalo escribiendo a auxcienciasbasicas2@tdea.edu.co para validar la sesión con la coordinación."
        }
      ]
    },
    {
      id: "asignaturas",
      title: "Asignaturas con asesoría",
      icon: "📖",
      questions: [
        {
          id: "que-asignaturas",
          question: "¿Qué asignaturas tienen asesorías?",
          keywords: ["asignaturas", "materias", "areas", "temas", "matematicas", "fisica", "quimica", "estadistica", "biologia"],
          answer: "Las asesorías disponibles cubren las principales áreas de Ciencias Básicas:\n- Matemáticas (Cálculo, Álgebra, Trigonometría)\n- Física (Mecánica, Electricidad)\n- Biología\n- Estadística\n- Química (General y Orgánica)\n- Habilidades comunicativas, Lengua Materna y Humanidades\n\nPuedes ver los horarios y docentes en la sección 'Asesorías disponibles' del portal."
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
          answer: "Las asesorías están abiertas a todos los estudiantes que hacen parte de los procesos académicos de Territorio TdeA y de la comunidad institucional que requieran acompañamiento para fortalecer sus aprendizajes en Ciencias Básicas.\n\nSi tienes dudas sobre tu acceso, puedes comunicarte con:\nauxcienciasbasicas2@tdea.edu.co"
        },
        {
          id: "que-hago-si-no-puedo-asistir",
          question: "¿Qué hago si no puedo asistir a una asesoría?",
          keywords: ["asistir", "inasistencia", "no puedo", "falta", "perdida", "otra alternativa", "otro horario"],
          answer: "Puedes consultar la programación para identificar otros horarios disponibles para la misma área en diferentes días de la semana.\n\nSi ningún horario coincide con tu disponibilidad, puedes solicitar apoyo escribiendo a:\nauxcienciasbasicas2@tdea.edu.co"
        },
        {
          id: "solo-escuchar",
          question: "¿Puedo ingresar si solo quiero escuchar o repasar un tema?",
          keywords: ["solo escuchar", "escuchar", "oyente", "repasar", "sin preguntas", "observar"],
          answer: "¡Sí! Aunque es muy provechoso llevar dudas puntuales o ejercicios, las salas virtuales están abiertas para que escuches explicaciones de temas clave, observes las dudas de tus compañeros y afiances tus conocimientos."
        }
      ]
    }
  ];

  // ==========================================================================
  // Catálogo Oficial de Asesorías de Ciencias Básicas
  // ==========================================================================
  const MOCK_ADVISORIES = [
    // Lunes
    {
      id: 'adv-bio-01',
      area: 'Biología',
      days: 'Lunes',
      time: '06:00 - 08:00',
      advisor: 'Docente Gina Alejandra Gil Giraldo',
      correo: 'gina.gil@tdea.edu.co',
      modality: 'Virtual',
      link: 'https://teams.microsoft.com/meet/219408212231892?p=elVZ3RUe8KllDONT9E'
    },
    {
      id: 'adv-est-01',
      area: 'Estadística',
      days: 'Lunes',
      time: '19:00 - 21:00',
      advisor: 'Docente Sara Lucía Castillo Daza',
      correo: 'sara.castillo2@tdea.edu.co',
      modality: 'Virtual',
      link: 'https://teams.microsoft.com/meet/240218539347423?p=wIyVECKGSN53VbJhCD'
    },
    {
      id: 'adv-fis-01',
      area: 'Física',
      days: 'Lunes',
      time: '19:00 - 21:00',
      advisor: 'Docente Gustavo Suárez Guerrero',
      correo: 'gustavo.suarez4@tdea.edu.co',
      modality: 'Virtual',
      link: 'https://teams.microsoft.com/meet/222434429436805?p=33dgQ8qOuGI8ENurI4'
    },
    {
      id: 'adv-hab-01',
      area: 'Habilidades comunicativas I y II',
      days: 'Lunes',
      time: '20:00 - 21:00',
      advisor: 'Docente Yina Paola Moreno Hernández',
      correo: 'yina.moreno82@tdea.edu.co',
      modality: 'Virtual',
      link: 'https://teams.microsoft.com/meet/298802026215676?p=fHVITSWOdXtB1Vdvft'
    },

    // Martes
    {
      id: 'adv-mat-01',
      area: 'Matemáticas',
      days: 'Martes',
      time: '13:00 - 14:00',
      advisor: 'Docente Andrés Villabón',
      correo: 'edgar.villabon@tdea.edu.co',
      modality: 'Virtual',
      link: 'https://teams.microsoft.com/meet/242645774130079?p=HR3l4yWvTJQ4o41xsI'
    },
    {
      id: 'adv-qui-02',
      area: 'Química',
      days: 'Martes',
      time: '14:00 - 16:00',
      advisor: 'Docente de Química Orgánica',
      correo: 'edgar.villabon@tdea.edu.co',
      modality: 'Virtual',
      link: 'https://teams.microsoft.com/l/meetup-join/asesoria-quimica-organica-tdea'
    },
    {
      id: 'adv-len-01',
      area: 'Lengua Materna',
      days: 'Martes',
      time: '20:00 - 21:00',
      advisor: 'Docente Yina Paola Moreno Hernández',
      correo: 'yina.moreno82@tdea.edu.co',
      modality: 'Virtual',
      link: 'https://teams.microsoft.com/meet/298802026215676?p=fHVITSWOdXtB1Vdvft'
    },

    // Miércoles
    {
      id: 'adv-mat-02',
      area: 'Matemáticas',
      days: 'Miércoles',
      time: '09:00 - 10:00',
      advisor: 'Docente Oscar Daniel López',
      correo: 'odlopez@tdea.edu.co',
      modality: 'Virtual',
      link: 'https://teams.microsoft.com/meet/242645774130079?p=HR3l4yWvTJQ4o41xsI'
    },
    {
      id: 'adv-hum-01',
      area: 'Humanidades e investigación',
      days: 'Miércoles',
      time: '17:00 - 18:00',
      advisor: 'Docente Rubén Darío Ramírez Gallego',
      correo: 'rramire2@tdea.edu.co',
      modality: 'Virtual',
      link: 'https://teams.microsoft.com/meet/236120504851066?p=npMxXV5pH4n9XI4LGS'
    },

    // Jueves
    {
      id: 'adv-qui-01',
      area: 'Química',
      days: 'Jueves',
      time: '08:00 - 10:00',
      advisor: 'Docente de Química General',
      correo: 'edgar.villabon@tdea.edu.co',
      modality: 'Virtual',
      link: 'https://teams.microsoft.com/l/meetup-join/asesoria-quimica-general-tdea'
    },
    {
      id: 'adv-len-hab-01',
      area: 'Lengua Materna y Habilidades comunicativas',
      days: 'Jueves',
      time: '18:00 - 20:00',
      advisor: 'Docente Victor Santiago Largo Gaviria',
      correo: 'slargog@tdea.edu.co',
      modality: 'Virtual',
      link: 'https://teams.microsoft.com/meet/298802026215676?p=fHVITSWOdXtB1Vdvft'
    },
    {
      id: 'adv-est-02',
      area: 'Estadística',
      days: 'Jueves',
      time: '19:00 - 21:00',
      advisor: 'Docente Edison Humberto Osorio López',
      correo: 'edison.osorio@tdea.edu.co',
      modality: 'Virtual',
      link: 'https://teams.microsoft.com/meet/240218539347423?p=wIyVECKGSN53VbJhCD'
    },

    // Viernes
    {
      id: 'adv-mat-04',
      area: 'Matemáticas',
      days: 'Viernes',
      time: '10:00 - 11:00',
      advisor: 'Docente Diego Alberto López Cardona',
      correo: 'diego.lopez@tdea.edu.co',
      modality: 'Virtual',
      link: 'https://teams.microsoft.com/meet/242645774130079?p=HR3l4yWvTJQ4o41xsI'
    },
    {
      id: 'adv-mat-03',
      area: 'Matemáticas',
      days: 'Viernes',
      time: '13:00 - 14:00',
      advisor: 'Docente Cindy Yurany González',
      correo: 'cindy.yurany94@tdea.edu.co',
      modality: 'Virtual',
      link: 'https://teams.microsoft.com/meet/242645774130079?p=HR3l4yWvTJQ4o41xsI'
    },
    {
      id: 'adv-bio-02',
      area: 'Biología',
      days: 'Viernes',
      time: '16:00 - 18:00',
      advisor: 'Docente Xiomara López Legarda',
      correo: 'xiomara.lopez95@tdea.edu.co',
      modality: 'Virtual',
      link: 'https://teams.microsoft.com/meet/219408212231892?p=elVZ3RUe8KllDONT9E'
    }
  ];

  // ==========================================================================
  // Sugerencias antes de Iniciar una Asesoría
  // ==========================================================================
  const ADVISORY_TIPS_DATA = [
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

  const ADVISOR_CONTACT = {
    id: "contacto",
    title: "Contacto Institucional",
    icon: "🏛️",
    email: "auxcienciasbasicas2@tdea.edu.co"
  };

  // ==========================================================================
  // Utilidades de Texto y Enlaces a Outlook Web
  // ==========================================================================
  function normalizeText(str) {
    if (!str || typeof str !== 'string') return '';
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  }

  function escapeHtml(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatTextWithLinks(text) {
    if (!text) return '';
    const safe = escapeHtml(text);
    return safe.replace(
      /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi,
      '<a href="mailto:$1" class="faq-widget-text-link">$1</a>'
    );
  }

  /**
   * Genera el enlace directo para redactar en Outlook en la Web (Microsoft 365 Institucional TdeA)
   * Únicamente con el correo de destino al que deben escribir (sin mensaje predeterminado).
   */
  function getStructuredOutlookOfficeUrl() {
    const to = ADVISOR_CONTACT.email;
    return `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(to)}`;
  }

  /**
   * Enlace alternativo para Outlook.com / Hotmail personal en la web
   * Únicamente con el correo de destino al que deben escribir (sin mensaje predeterminado).
   */
  function getStructuredOutlookLiveUrl() {
    const to = ADVISOR_CONTACT.email;
    return `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(to)}`;
  }

  // ==========================================================================
  // Ordenamiento Cronológico en Tiempo Real (Desde la fecha/hora actual)
  // Las sesiones que van a ocurrir desde este momento aparecen primero.
  // Las que ya finalizaron en el día de hoy se colocan al final del ciclo.
  // Sesiones simultáneas se desempatan en orden alfabético por Área y Docente.
  // ==========================================================================
  function sortAdvisoriesBySchedule(advisories = [], customDate = new Date()) {
    const currentDay = customDate.getDay(); // 0: Domingo, 1: Lunes, ... 6: Sábado
    const currentMinutes = customDate.getHours() * 60 + customDate.getMinutes();

    const dayMap = {
      'domingo': 0,
      'lunes': 1,
      'martes': 2,
      'miercoles': 3,
      'jueves': 4,
      'viernes': 5,
      'sabado': 6
    };

    const getRelativeScore = (item) => {
      const normDay = normalizeText(item.days);
      const targetDay = dayMap[normDay] !== undefined ? dayMap[normDay] : 1;

      const timeParts = item.time.split('-').map(t => t.trim());
      const [startH, startM] = (timeParts[0] || '00:00').split(':').map(Number);
      const [endH, endM] = (timeParts[1] || timeParts[0] || '23:59').split(':').map(Number);

      const startMinutes = (startH || 0) * 60 + (startM || 0);
      const endMinutes = (endH || 0) * 60 + (endM || 0);

      let daysAhead = (targetDay - currentDay + 7) % 7;

      if (daysAhead === 0) {
        if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
          // En vivo ahora: máxima prioridad en el tope de la lista
          return -1;
        } else if (currentMinutes < startMinutes) {
          // Próxima hoy: ocurrirá más tarde el día de hoy
          return startMinutes - currentMinutes;
        } else {
          // Ya finalizó hoy: se traslada para la próxima semana (al final)
          daysAhead = 7;
        }
      }

      return (daysAhead * 1440) + (startMinutes - currentMinutes);
    };

    return [...advisories].sort((a, b) => {
      const scoreA = getRelativeScore(a);
      const scoreB = getRelativeScore(b);

      if (scoreA !== scoreB) {
        return scoreA - scoreB;
      }

      // Desempate alfabético por Área y luego por Docente
      const areaCmp = (a.area || '').localeCompare(b.area || '', 'es', { sensitivity: 'base' });
      if (areaCmp !== 0) return areaCmp;

      return (a.advisor || '').localeCompare(b.advisor || '', 'es', { sensitivity: 'base' });
    });
  }

  // ==========================================================================
  // Estado en Tiempo Real de Asesorías (En vivo ahora / Próxima sesión / Finalizada hoy)
  // ==========================================================================
  function getAdvisoryLiveStatus(item, customDate = new Date()) {
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const currentDayName = dayNames[customDate.getDay()];
    
    const normDays = normalizeText(item.days);
    const normToday = normalizeText(currentDayName);
    const isToday = normDays.includes(normToday);

    if (!isToday) {
      return {
        isLive: false,
        isToday: false,
        badgeText: item.days,
        badgeClass: 'faq-adv-badge'
      };
    }

    const timeParts = item.time.split('-').map(t => t.trim());
    if (timeParts.length === 2) {
      const [startH, startM] = timeParts[0].split(':').map(Number);
      const [endH, endM] = timeParts[1].split(':').map(Number);

      const currentMinutes = customDate.getHours() * 60 + customDate.getMinutes();
      const startMinutes = (startH || 0) * 60 + (startM || 0);
      const endMinutes = (endH || 0) * 60 + (endM || 0);

      if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
        return {
          isLive: true,
          isToday: true,
          badgeText: '🟢 En vivo ahora',
          badgeClass: 'faq-adv-badge badge-live'
        };
      } else if (currentMinutes < startMinutes) {
        return {
          isLive: false,
          isToday: true,
          badgeText: `🔔 Hoy a las ${timeParts[0]}`,
          badgeClass: 'faq-adv-badge badge-today'
        };
      } else {
        return {
          isLive: false,
          isToday: true,
          isPast: true,
          badgeText: `Finalizó hoy (${timeParts[1]})`,
          badgeClass: 'faq-adv-badge badge-today-past'
        };
      }
    }

    return {
      isLive: false,
      isToday: true,
      badgeText: '📅 Hoy',
      badgeClass: 'faq-adv-badge badge-today'
    };
  }

  // ==========================================================================
  // Motores de Búsqueda Determinista (FAQs y Asesorías)
  // ==========================================================================
  function findMatchingFaq(rawQuery) {
    const clean = normalizeText(rawQuery);
    if (clean.length < 2) return [];

    const words = clean.split(/\s+/).filter(w => w.length > 2);
    const results = [];

    CHATBOT_CATEGORIES.forEach(cat => {
      cat.questions.forEach(q => {
        const qText = normalizeText(q.question);
        const aText = normalizeText(q.answer);
        const keys = (q.keywords || []).map(k => normalizeText(k));

        let score = 0;
        words.forEach(w => {
          if (keys.some(k => k === w || k.includes(w) || (k.length > 3 && w.includes(k)))) score += 5;
          else if (qText.includes(w)) score += 3;
          else if (aText.includes(w)) score += 1;
        });

        if (qText.includes(clean) || keys.some(k => k.includes(clean)) || score > 0) {
          results.push({
            categoryTitle: cat.title,
            questionId: q.id,
            question: q.question,
            answer: q.answer,
            score: score
          });
        }
      });
    });

    return results.sort((a, b) => b.score - a.score);
  }

  function findMatchingAdvisories(rawQuery) {
    const clean = normalizeText(rawQuery);
    if (!clean) return [];

    const matched = MOCK_ADVISORIES.filter(item => {
      return normalizeText(item.area).includes(clean) ||
             normalizeText(item.advisor).includes(clean) ||
             normalizeText(item.days).includes(clean) ||
             normalizeText(item.time).includes(clean) ||
             normalizeText(item.correo).includes(clean);
    });

    return sortAdvisoriesBySchedule(matched);
  }

  // ==========================================================================
  // Portapapeles y Notificaciones Toast
  // ==========================================================================
  function showToast(message) {
    const windowEl = document.getElementById('tdea-faq-widget-window');
    if (!windowEl) return;

    const prevToast = windowEl.querySelector('.faq-widget-toast');
    if (prevToast) prevToast.remove();

    const toast = document.createElement('div');
    toast.className = 'faq-widget-toast';
    toast.innerHTML = `✓ ${escapeHtml(message)}`;
    windowEl.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.transition = 'opacity 0.25s ease';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 250);
      }
    }, 2400);
  }

  function fallbackCopyText(text, cb) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      if (cb) cb();
    } catch (err) {
      console.warn('Error al copiar enlace', err);
    }
    textArea.remove();
  }

  function copyToClipboard(text, buttonEl, successMsg = '¡Enlace de Teams copiado al portapapeles!') {
    const onSuccess = () => {
      if (buttonEl) {
        const originalHtml = buttonEl.innerHTML;
        buttonEl.classList.add('copied');
        buttonEl.innerHTML = '<span>✓ ¡Copiado!</span>';
        setTimeout(() => {
          buttonEl.classList.remove('copied');
          buttonEl.innerHTML = originalHtml;
        }, 2000);
      }
      showToast(successMsg);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
        fallbackCopyText(text, onSuccess);
      });
    } else {
      fallbackCopyText(text, onSuccess);
    }
  }

  // ==========================================================================
  // Componente de Retroalimentación de Utilidad (👍 Sí · 👎 No)
  // ==========================================================================
  function renderFeedbackRow(targetContainer, contextText = '') {
    if (!targetContainer) return;

    const feedbackRow = document.createElement('div');
    feedbackRow.className = 'faq-widget-feedback-row';
    feedbackRow.innerHTML = `
      <span>¿Te fue útil esta información?</span>
      <div class="faq-widget-feedback-btns">
        <button type="button" class="faq-feedback-btn" data-rate="yes">👍 Sí</button>
        <button type="button" class="faq-feedback-btn" data-rate="no">👎 No</button>
      </div>
    `;

    const btns = feedbackRow.querySelectorAll('.faq-feedback-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const rate = btn.getAttribute('data-rate');
        if (rate === 'yes') {
          feedbackRow.innerHTML = `<span class="faq-feedback-thanks">✓ ¡Gracias por tu retroalimentación!</span>`;
        } else {
          const outlookUrl = getStructuredOutlookOfficeUrl('Orientación requerida - Asistente Ciencias Básicas', contextText);
          feedbackRow.innerHTML = `
            <div class="faq-feedback-help-box">
              <span>¿Necesitas ayuda adicional?</span>
              <a href="${outlookUrl}" target="_blank" rel="noopener noreferrer" class="faq-adv-btn-teams" style="padding: 4px 10px; font-size: 0.725rem; text-decoration: none;">
                🌐 Redactar en Outlook Web
              </a>
            </div>
          `;
        }
      });
    });

    targetContainer.appendChild(feedbackRow);
  }

  // ==========================================================================
  // Componente de Renderizado de Tarjetas de Asesoría
  // ==========================================================================
  function renderAdvisoryCardHtml(adv) {
    const live = getAdvisoryLiveStatus(adv);
    return `
      <div class="faq-advisory-item-card" data-adv-id="${adv.id}">
        <div class="faq-adv-header">
          <h5 class="faq-adv-title">
            <span>${escapeHtml(adv.area)}</span>
          </h5>
          <span class="${live.badgeClass}">${live.badgeText}</span>
        </div>

        <div class="faq-adv-meta">
          <div class="faq-adv-meta-item">
            <span>🗓️</span>
            <strong>${escapeHtml(adv.days)}</strong> · <span>${escapeHtml(adv.time)}</span>
          </div>
          <div class="faq-adv-meta-item">
            <span>👨‍🏫</span>
            <span>${escapeHtml(adv.advisor)}</span>
          </div>
          <div class="faq-adv-meta-item">
            <span>✉️</span>
            <a href="mailto:${escapeHtml(adv.correo)}" class="faq-widget-text-link">${escapeHtml(adv.correo)}</a>
          </div>
        </div>

        <div class="faq-adv-actions">
          <a 
            href="${escapeHtml(adv.link)}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="faq-adv-btn-teams"
            title="Ingresar a la sala de Microsoft Teams en una pestaña nueva"
          >
            <span>🚀 Unirse a Teams</span>
          </a>
          <button 
            type="button" 
            class="faq-adv-btn-copy" 
            data-copy-link="${escapeHtml(adv.link)}"
            title="Copiar enlace de Microsoft Teams al portapapeles"
          >
            <span>📋 Copiar enlace</span>
          </button>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // Copiado al Portapapeles y Notificaciones Toast
  // ==========================================================================
  function showToast(message = '¡Copiado al portapapeles!') {
    let toast = document.getElementById('faq-widget-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'faq-widget-toast';
      toast.className = 'faq-widget-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2800);
  }

  function copyToClipboard(text, btnElement = null, customToast = '✓ ¡Copiado!') {
    if (!text) return;

    const onSuccess = () => {
      showToast(customToast);
      if (btnElement) {
        const originalHtml = btnElement.innerHTML;
        btnElement.innerHTML = `<span>✓ ¡Copiado!</span>`;
        btnElement.classList.add('is-copied');
        setTimeout(() => {
          btnElement.innerHTML = originalHtml;
          btnElement.classList.remove('is-copied');
        }, 2200);
      }
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
        fallbackCopy(text, onSuccess);
      });
    } else {
      fallbackCopy(text, onSuccess);
    }
  }

  function fallbackCopy(text, callback) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      if (callback) callback();
    } catch (err) {
      console.warn('Error al copiar:', err);
    }
    document.body.removeChild(textArea);
  }

  function attachAdvisoryEvents(container) {
    container.querySelectorAll('.faq-adv-btn-copy').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const link = btn.getAttribute('data-copy-link');
        if (link) copyToClipboard(link, btn, '✓ ¡Enlace copiado al portapapeles!');
      });
    });
  }

  // ==========================================================================
  // Estado y Referencias del DOM
  // ==========================================================================
  let isOpen = false;
  let lastToggleTime = 0;

  function getElements() {
    return {
      root: document.getElementById('tdea-faq-widget-root'),
      fab: document.getElementById('tdea-faq-widget-fab'),
      windowEl: document.getElementById('tdea-faq-widget-window'),
      dynamicContent: document.getElementById('faq-widget-dynamic-content'),
      input: document.getElementById('faq-widget-input'),
      form: document.getElementById('faq-widget-form'),
      closeBtn: document.getElementById('faq-widget-close-top'),
      iconClosed: document.getElementById('faq-fab-icon-closed'),
      iconOpen: document.getElementById('faq-fab-icon-open'),
      pillLabel: document.querySelector('.faq-fab-pill-label'),
      chipsContainer: document.getElementById('faq-widget-quick-chips')
    };
  }

  function openWidget() {
    const els = getElements();
    if (!els.windowEl || !els.fab) return;

    isOpen = true;
    els.windowEl.style.display = 'flex';
    els.windowEl.classList.add('is-open');
    els.windowEl.setAttribute('aria-hidden', 'false');

    els.fab.classList.add('is-active');
    els.fab.setAttribute('aria-expanded', 'true');

    if (els.iconClosed) els.iconClosed.style.display = 'none';
    if (els.iconOpen) els.iconOpen.style.display = 'inline-flex';

    renderHomeCategories();

    setTimeout(() => {
      if (els.input) els.input.focus();
    }, 150);
  }

  function closeWidget() {
    const els = getElements();
    if (!els.windowEl || !els.fab) return;

    isOpen = false;
    els.windowEl.style.display = 'none';
    els.windowEl.classList.remove('is-open');
    els.windowEl.setAttribute('aria-hidden', 'true');

    els.fab.classList.remove('is-active');
    els.fab.setAttribute('aria-expanded', 'false');

    if (els.iconClosed) els.iconClosed.style.display = 'inline-flex';
    if (els.iconOpen) els.iconOpen.style.display = 'none';
  }

  function toggleWidget(e) {
    if (e) {
      if (e.stopPropagation) e.stopPropagation();
      if (e.preventDefault && e.type === 'click') e.preventDefault();
    }
    const now = Date.now();
    if (now - lastToggleTime < 300) {
      return;
    }
    lastToggleTime = now;

    if (isOpen) {
      closeWidget();
    } else {
      openWidget();
    }
  }

  // ==========================================================================
  // Vista 1: Pantalla Principal de Temas (Estilo Gilberto Echeverri)
  // ==========================================================================
  function renderHomeCategories() {
    const els = getElements();
    if (!els.dynamicContent) return;

    let html = `
      <div class="faq-widget-section-header">
        <h4 class="faq-widget-section-title">Preguntas frecuentes</h4>
        <p class="faq-widget-section-subtitle">Selecciona una categoría o escribe tu consulta arriba:</p>
      </div>

      <div class="faq-widget-cards-stack" role="list">
        <!-- Tarjeta Destacada: TutorIA TdeA - Inteligencia Artificial -->
        <a 
          href="https://tutoria-tdea.ai.studio/" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="faq-widget-card-btn faq-widget-card-tutoria" 
          role="listitem"
          aria-label="Abrir TutorIA TdeA - Asistente con Inteligencia Artificial (abre en nueva pestaña)"
        >
          <img src="assets/icons/tutoria-avatar.png" alt="Logo TutorIA TdeA" class="faq-tutoria-card-img" width="30" height="30">
          <div class="faq-widget-card-info">
            <span class="faq-widget-card-title" style="color: #00843D; font-weight: 800;">
              TutorIA TdeA · Inteligencia Artificial
            </span>
            <span class="faq-widget-card-badge">Resuelve dudas y preguntas académicas 24/7 ↗</span>
          </div>
          <span class="faq-widget-card-chevron" aria-hidden="true">↗</span>
        </a>

        ${CHATBOT_CATEGORIES.map(cat => `
          <button 
            type="button" 
            class="faq-widget-card-btn" 
            data-cat-id="${cat.id}"
            role="listitem"
            aria-label="${cat.title}"
          >
            <span class="faq-widget-card-icon" aria-hidden="true">${cat.icon}</span>
            <div class="faq-widget-card-info">
              <span class="faq-widget-card-title">${cat.title}</span>
              <span class="faq-widget-card-badge">${cat.questions.length} preguntas frecuentes</span>
            </div>
            <span class="faq-widget-card-chevron" aria-hidden="true">›</span>
          </button>
        `).join('')}

        <!-- Tarjeta de sugerencias antes de iniciar una asesoría -->
        <button 
          type="button" 
          class="faq-widget-card-btn faq-widget-card-tips" 
          data-action="open-tips"
          role="listitem"
          aria-label="Sugerencias antes de iniciar una asesoría"
        >
          <span class="faq-widget-card-icon" aria-hidden="true">💡</span>
          <div class="faq-widget-card-info">
            <span class="faq-widget-card-title">Sugerencias antes de iniciar una asesoría</span>
            <span class="faq-widget-card-badge">7 recomendaciones clave</span>
          </div>
          <span class="faq-widget-card-chevron" aria-hidden="true">›</span>
        </button>

        <!-- Tarjeta de Contacto Institucional -->
        <button 
          type="button" 
          class="faq-widget-card-btn faq-widget-card-contact" 
          data-action="open-contact"
          role="listitem"
          aria-label="Contacto Institucional"
        >
          <span class="faq-widget-card-icon" aria-hidden="true">${ADVISOR_CONTACT.icon}</span>
          <div class="faq-widget-card-info">
            <span class="faq-widget-card-title">${ADVISOR_CONTACT.title}</span>
            <span class="faq-widget-card-badge" style="color: #00843D; font-weight: 700;">${ADVISOR_CONTACT.email}</span>
          </div>
          <span class="faq-widget-card-chevron" aria-hidden="true">›</span>
        </button>
      </div>
    `;

    els.dynamicContent.innerHTML = html;

    // Listeners
    els.dynamicContent.querySelectorAll('.faq-widget-card-btn[data-cat-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const catId = btn.getAttribute('data-cat-id');
        renderCategoryQuestions(catId);
      });
    });

    const tipsBtn = els.dynamicContent.querySelector('[data-action="open-tips"]');
    if (tipsBtn) {
      tipsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        renderTipsView();
      });
    }

    const contactBtn = els.dynamicContent.querySelector('[data-action="open-contact"]');
    if (contactBtn) {
      contactBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        renderAdvisorContact();
      });
    }
  }

  // ==========================================================================
  // Vista 2: Preguntas Frecuentes de una Categoría
  // ==========================================================================
  function renderCategoryQuestions(categoryId) {
    const category = CHATBOT_CATEGORIES.find(c => c.id === categoryId);
    const els = getElements();
    if (!category || !els.dynamicContent) return;

    let html = `
      <div class="faq-widget-navigation-bar">
        <button type="button" class="faq-widget-back-btn" id="faq-back-to-home" title="Regresar a todos los temas">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Volver a temas</span>
        </button>
      </div>

      <div class="faq-widget-category-banner">
        <span class="faq-widget-category-icon">${category.icon}</span>
        <div>
          <h4 class="faq-widget-category-title">${category.title}</h4>
          <span class="faq-widget-category-count">${category.questions.length} preguntas frecuentes disponibles</span>
        </div>
      </div>

      <div class="faq-widget-cards-stack" role="list">
        ${category.questions.map(q => `
          <button 
            type="button" 
            class="faq-widget-card-btn faq-widget-question-btn" 
            data-question-id="${q.id}"
            role="listitem"
            aria-label="${q.question}"
          >
            <span class="faq-widget-question-bullet" aria-hidden="true">•</span>
            <div class="faq-widget-card-info">
              <span class="faq-widget-question-title">${q.question}</span>
            </div>
            <span class="faq-widget-card-chevron" aria-hidden="true">›</span>
          </button>
        `).join('')}
      </div>

      <div class="faq-widget-inline-help">
        <span>¿No encuentras lo que buscas?</span>
        <button type="button" class="faq-widget-link-btn" id="faq-link-to-contact">
          Escribir a un asesor (${ADVISOR_CONTACT.email})
        </button>
      </div>
    `;

    els.dynamicContent.innerHTML = html;

    const backBtn = els.dynamicContent.querySelector('#faq-back-to-home');
    if (backBtn) {
      backBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        renderHomeCategories();
      });
    }

    const contactLink = els.dynamicContent.querySelector('#faq-link-to-contact');
    if (contactLink) {
      contactLink.addEventListener('click', (e) => {
        e.stopPropagation();
        renderAdvisorContact();
      });
    }

    els.dynamicContent.querySelectorAll('.faq-widget-question-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const qId = btn.getAttribute('data-question-id');
        renderQuestionDetail(qId, categoryId);
      });
    });
  }

  // ==========================================================================
  // Vista 3: Detalle de la Respuesta Oficial (Integrado con Outlook Web)
  // ==========================================================================
  function renderQuestionDetail(questionId, fromCategoryId) {
    const els = getElements();
    if (!els.dynamicContent) return;

    let foundQ = null;
    let parentCat = null;
    for (const cat of CHATBOT_CATEGORIES) {
      const q = cat.questions.find(item => item.id === questionId);
      if (q) {
        foundQ = q;
        parentCat = cat;
        break;
      }
    }
    if (!foundQ) return;

    const formattedAnswer = foundQ.answer
      .split('\n\n')
      .map(p => `<p class="faq-widget-answer-paragraph">${formatTextWithLinks(p)}</p>`)
      .join('');

    const outlookWebUrl = getStructuredOutlookOfficeUrl();

    let html = `
      <div class="faq-widget-navigation-bar">
        <button type="button" class="faq-widget-back-btn" id="faq-back-from-detail">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>${parentCat ? `Volver a ${parentCat.title}` : 'Volver'}</span>
        </button>
      </div>

      <div class="faq-widget-answer-card">
        <div class="faq-widget-verified-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Respuesta Oficial Institucional</span>
        </div>

        <h4 class="faq-widget-answer-title">${foundQ.question}</h4>

        <div class="faq-widget-answer-body">
          ${formattedAnswer}
        </div>

        <div class="faq-widget-actions-box">
          <a 
            href="${outlookWebUrl}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="faq-widget-action-pill" 
            title="Abrir Outlook Web institucional en una pestaña nueva"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span>Redactar en Outlook Web (<strong>${ADVISOR_CONTACT.email}</strong>)</span>
          </a>

          <button type="button" class="faq-widget-action-pill faq-pill-catalog" id="faq-action-go-advisories">
            <span>🗓️ Ver Horarios de Asesorías</span>
          </button>
        </div>
      </div>
    `;

    els.dynamicContent.innerHTML = html;

    // Agregar Retroalimentación
    const answerCard = els.dynamicContent.querySelector('.faq-widget-answer-card');
    renderFeedbackRow(answerCard, foundQ.question);

    const backBtn = els.dynamicContent.querySelector('#faq-back-from-detail');
    if (backBtn) {
      backBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (fromCategoryId) {
          renderCategoryQuestions(fromCategoryId);
        } else {
          renderHomeCategories();
        }
      });
    }

    const goAdv = els.dynamicContent.querySelector('#faq-action-go-advisories');
    if (goAdv) {
      goAdv.addEventListener('click', (e) => {
        e.stopPropagation();
        renderAdvisoriesList();
      });
    }
  }

  // ==========================================================================
  // Vista 4: Catálogo y Horarios Ordenados Cronológicamente en Tiempo Real
  // (Las sesiones que van a ocurrir desde la fecha/hora actual van primero;
  //  las que ya finalizaron hoy van de últimas; empates en orden alfabético)
  // ==========================================================================
  function renderAdvisoriesList(options = {}) {
    const els = getElements();
    if (!els.dynamicContent) return;

    const filterArea = options.area || null;
    let list = sortAdvisoriesBySchedule(MOCK_ADVISORIES);
    if (filterArea) {
      list = list.filter(a => normalizeText(a.area).includes(normalizeText(filterArea)));
    }

    const areas = ['Todas', 'Matemáticas', 'Física', 'Biología', 'Estadística', 'Química'];

    let html = `
      <div class="faq-widget-navigation-bar">
        <button type="button" class="faq-widget-back-btn" id="faq-back-to-home">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Volver a temas</span>
        </button>
      </div>

      <div class="faq-widget-category-banner">
        <span class="faq-widget-category-icon">🗓️</span>
        <div>
          <h4 class="faq-widget-category-title">${filterArea ? `Asesorías de ${filterArea}` : 'Horarios de Asesorías'}</h4>
          <span class="faq-widget-category-count">${list.length} sesiones organizadas cronológicamente</span>
        </div>
      </div>

      <!-- Filtros rápidos por área -->
      <div class="faq-widget-quick-chips" style="margin: 4px 0 10px 0;">
        ${areas.map(area => `
          <button 
            type="button" 
            class="faq-chip-btn ${(!filterArea && area === 'Todas') || (filterArea === area) ? 'active' : ''}" 
            data-filter-area="${area}"
            style="${(!filterArea && area === 'Todas') || (filterArea === area) ? 'background: #DCFCE7; border-color: #86EFAC; color: #166534;' : ''}"
          >
            ${area}
          </button>
        `).join('')}
      </div>

      <div class="faq-widget-cards-stack" role="list">
        ${list.map(adv => renderAdvisoryCardHtml(adv)).join('')}
      </div>
    `;

    els.dynamicContent.innerHTML = html;

    // Escuchadores de copiado
    attachAdvisoryEvents(els.dynamicContent);

    // Retroalimentación al pie
    renderFeedbackRow(els.dynamicContent, `Horarios de ${filterArea || 'Ciencias Básicas'}`);

    // Back button
    const backBtn = els.dynamicContent.querySelector('#faq-back-to-home');
    if (backBtn) {
      backBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        renderHomeCategories();
      });
    }

    // Filtros de área
    els.dynamicContent.querySelectorAll('[data-filter-area]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const a = btn.getAttribute('data-filter-area');
        if (a === 'Todas') {
          renderAdvisoriesList();
        } else {
          renderAdvisoriesList({ area: a });
        }
      });
    });
  }

  // ==========================================================================
  // ==========================================================================
  // Vista: Sugerencias antes de Iniciar una Asesoría
  // ==========================================================================
  function renderTipsView() {
    const els = getElements();
    if (!els.dynamicContent) return;

    let html = `
      <div class="faq-widget-navigation-bar">
        <button type="button" class="faq-widget-back-btn" id="faq-tips-back-home" title="Regresar al inicio">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>← Volver al inicio</span>
        </button>
      </div>

      <div class="faq-widget-category-banner">
        <span class="faq-widget-category-icon">💡</span>
        <div>
          <h4 class="faq-widget-category-title">Sugerencias antes de iniciar una asesoría</h4>
          <span class="faq-widget-category-count">Ten en cuenta estas recomendaciones para aprovechar mejor el espacio de acompañamiento académico.</span>
        </div>
      </div>

      <div class="faq-widget-tips-stack" role="list">
        ${ADVISORY_TIPS_DATA.map(tip => `
          <div class="faq-widget-tip-card" role="listitem">
            <div class="faq-widget-tip-header">
              <span class="faq-widget-tip-icon" aria-hidden="true">${tip.icon}</span>
              <h5 class="faq-widget-tip-title">${tip.title}</h5>
            </div>
            <p class="faq-widget-tip-desc">${tip.description}</p>
          </div>
        `).join('')}
      </div>

      <div class="faq-widget-inline-help" style="margin-top: 1rem;">
        <span>¿Listo para participar en tu asesoría?</span>
        <button type="button" class="faq-widget-link-btn" id="faq-tips-go-advisories" style="font-weight: 700; color: #00843D;">
          🗓️ Ver Horarios y Enlaces Teams
        </button>
      </div>
    `;

    els.dynamicContent.innerHTML = html;

    const backBtn = els.dynamicContent.querySelector('#faq-tips-back-home');
    if (backBtn) {
      backBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        renderHomeCategories();
      });
    }

    const goAdv = els.dynamicContent.querySelector('#faq-tips-go-advisories');
    if (goAdv) {
      goAdv.addEventListener('click', (e) => {
        e.stopPropagation();
        renderAdvisoriesList();
      });
    }
  }

  // ==========================================================================
  // Vista 5: Contacto Institucional (Apertura Directa en Outlook Web de Microsoft 365)
  // ==========================================================================
  function renderAdvisorContact() {
    const els = getElements();
    if (!els.dynamicContent) return;

    const outlookOfficeUrl = getStructuredOutlookOfficeUrl();
    const outlookLiveUrl = getStructuredOutlookLiveUrl();
    const mailtoUrl = `mailto:${ADVISOR_CONTACT.email}`;

    let html = `
      <div class="faq-widget-navigation-bar">
        <button type="button" class="faq-widget-back-btn" id="faq-back-to-home" title="Regresar al inicio">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>← Volver al inicio</span>
        </button>
      </div>

      <div class="faq-widget-contact-panel">
        <div class="faq-widget-contact-header-block">
          <span class="faq-widget-contact-tag">CONTACTO INSTITUCIONAL</span>
          <p class="faq-widget-contact-lead">
            Canales de atención oficial de Territorio TdeA para asesorías académicas:
          </p>
        </div>

        <div class="faq-widget-institutional-box">
          <div class="faq-widget-contact-icon-bubble">🏛️</div>
          <h4 class="faq-widget-contact-inst-title">Coordinación de Asesorías Académicas · Ciencias Básicas</h4>
          <p class="faq-widget-contact-inst-sub">
            Territorio TdeA · Tecnológico de Antioquia Institución Universitaria
          </p>

          <div class="faq-widget-contact-email-card" style="margin-bottom: 0;">
            <span class="faq-widget-email-label">Correo oficial de atención:</span>
            <a href="mailto:${ADVISOR_CONTACT.email}" class="faq-widget-email-link" title="Escribir a ${ADVISOR_CONTACT.email}">
              ${ADVISOR_CONTACT.email}
            </a>
          </div>
        </div>

        <div style="margin-top: 1.5rem; text-align: center;">
          <button type="button" class="faq-widget-secondary-btn" id="faq-contact-return-home" style="width: 100%; justify-content: center;">
            ← Volver al inicio
          </button>
        </div>
      </div>
    `;

    els.dynamicContent.innerHTML = html;

    const backBtn = els.dynamicContent.querySelector('#faq-back-to-home');
    if (backBtn) {
      backBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        renderHomeCategories();
      });
    }

    const returnHomeBtn = els.dynamicContent.querySelector('#faq-contact-return-home');
    if (returnHomeBtn) {
      returnHomeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        renderHomeCategories();
      });
    }
  }

  // ==========================================================================
  // Vista 6: Resultados de Búsqueda Integrada (Horarios + FAQs)
  // ==========================================================================
  function renderSearchResults(query) {
    const els = getElements();
    if (!els.dynamicContent) return;

    const cleanQuery = (query || '').trim();
    if (!cleanQuery) {
      renderHomeCategories();
      return;
    }

    const matchingFaqs = findMatchingFaq(cleanQuery);
    const matchingAdvisories = findMatchingAdvisories(cleanQuery);

    const totalMatches = matchingFaqs.length + matchingAdvisories.length;

    // Caso 0 Resultados: Respuestas sugeridas guiadas
    if (totalMatches === 0) {
      const outlookWebUrl = getStructuredOutlookOfficeUrl(`Consulta sobre: ${cleanQuery}`, cleanQuery);

      els.dynamicContent.innerHTML = `
        <div class="faq-widget-navigation-bar">
          <button type="button" class="faq-widget-back-btn" id="faq-search-clear">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Ver todos los temas</span>
          </button>
        </div>

        <div class="faq-widget-no-results">
          <span style="font-size: 2.2rem; display: block; margin-bottom: 0.5rem;">🔍</span>
          <h4 style="font-size: 0.95rem; font-weight: 800; color: #1E293B; margin-bottom: 0.35rem;">
            No encontramos coincidencias para "${escapeHtml(cleanQuery)}"
          </h4>
          <p style="font-size: 0.825rem; color: #64748B; margin-bottom: 1rem; line-height: 1.45;">
            Quizás te interese consultar alguno de estos accesos frecuentes:
          </p>

          <div class="faq-widget-suggestions" id="faq-zero-suggestions">
            <button type="button" class="faq-chip-btn" data-suggest="teams">💻 ¿Cómo ingresar a Teams?</button>
            <button type="button" class="faq-chip-btn" data-suggest="contacto">✉️ Contactar por correo</button>
            <button type="button" class="faq-chip-btn" data-suggest="catalogo">📅 Ver Asesorías disponibles</button>
          </div>

          <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px dashed #E2E8F0;">
            <p style="font-size: 0.775rem; color: #64748B; margin-bottom: 0.65rem;">
              ¿Tu consulta es específica? Puedes escribirnos directamente:
            </p>
            <a 
              href="${outlookWebUrl}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="faq-widget-primary-btn" 
              style="text-decoration: none; justify-content: center; width: 100%; gap: 8px;"
            >
              🌐 Redactar en Outlook Web (${ADVISOR_CONTACT.email})
            </a>
          </div>
        </div>
      `;

      const clearBtn = els.dynamicContent.querySelector('#faq-search-clear');
      if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (els.input) els.input.value = '';
          renderHomeCategories();
        });
      }

      // Conectar sugerencias guiadas
      els.dynamicContent.querySelectorAll('#faq-zero-suggestions .faq-chip-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const target = btn.getAttribute('data-suggest');
          if (target === 'teams') renderQuestionDetail('como-ingresar-virtual', 'virtuales');
          else if (target === 'contacto') renderAdvisorContact();
          else if (target === 'catalogo') {
            closeWidget();
            window.location.hash = '#/asesorias_disponibles';
          }
        });
      });

      return;
    }

    // Caso con Coincidencias (Asesorías orientadas + FAQs)
    let html = `
      <div class="faq-widget-navigation-bar">
        <button type="button" class="faq-widget-back-btn" id="faq-search-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Volver a todos los temas</span>
        </button>
      </div>

      <div class="faq-widget-search-results-meta">
        <span>Resultados para <strong>"${escapeHtml(cleanQuery)}"</strong> (${totalMatches})</span>
      </div>
    `;

    // 1. Si coincide con temas o consultas de asesorías, invitar al catálogo oficial de la página
    if (matchingAdvisories.length > 0) {
      html += `
        <div style="margin-top: 8px; background: #F0FDF4; border: 1.5px solid #86EFAC; border-radius: 12px; padding: 12px; text-align: left;">
          <div style="display: flex; align-items: center; gap: 6px; font-weight: 800; font-size: 0.85rem; color: #006830; margin-bottom: 4px;">
            <span>🗓️</span>
            <span>Programación y Salas Teams</span>
          </div>
          <p style="font-size: 0.775rem; color: #166534; margin: 0 0 10px 0; line-height: 1.45;">
            Los horarios de asesorías, docentes y salas virtuales se consultan en el catálogo principal de la plataforma.
          </p>
          <button type="button" class="faq-widget-primary-btn" id="faq-search-goto-advisories" style="font-size: 0.775rem; padding: 8px 12px; width: 100%; justify-content: center;">
            👉 Ir al Catálogo de Asesorías
          </button>
        </div>
      `;
    }

    // 2. Mostrar preguntas frecuentes coincidentes
    if (matchingFaqs.length > 0) {
      html += `
        <div style="margin-top: 14px;">
          <h5 style="font-size: 0.8rem; font-weight: 800; color: #1E293B; text-transform: uppercase; letter-spacing: 0.04em; margin: 0 0 6px 0;">
            💡 Preguntas frecuentes (${matchingFaqs.length})
          </h5>
          <div class="faq-widget-cards-stack" role="list">
            ${matchingFaqs.map(item => `
              <button 
                type="button" 
                class="faq-widget-card-btn faq-widget-result-item" 
                data-question-id="${item.questionId}"
                role="listitem"
                aria-label="${item.question}"
              >
                <span class="faq-widget-card-icon" aria-hidden="true">💡</span>
                <div class="faq-widget-card-info">
                  <span class="faq-widget-result-badge">${item.categoryTitle}</span>
                  <span class="faq-widget-card-title">${item.question}</span>
                </div>
                <span class="faq-widget-card-chevron" aria-hidden="true">›</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }

    els.dynamicContent.innerHTML = html;

    // Ir al catálogo de asesorías si hizo clic en el banner
    const gotoCatalogBtn = els.dynamicContent.querySelector('#faq-search-goto-advisories');
    if (gotoCatalogBtn) {
      gotoCatalogBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeWidget();
        window.location.hash = '#/asesorias_disponibles';
      });
    }

    // Retroalimentación al pie de la búsqueda
    renderFeedbackRow(els.dynamicContent, `Búsqueda: ${cleanQuery}`);

    // Volver
    const backBtn = els.dynamicContent.querySelector('#faq-search-back');
    if (backBtn) {
      backBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (els.input) els.input.value = '';
        renderHomeCategories();
      });
    }

    // Clic en pregunta de resultados
    els.dynamicContent.querySelectorAll('.faq-widget-result-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const qId = btn.getAttribute('data-question-id');
        renderQuestionDetail(qId, null);
      });
    });
  }

  // ==========================================================================
  // Chips de Sugerencia Rápida en Cabecera
  // ==========================================================================
  function setupQuickChips() {
    const chipsContainer = document.getElementById('faq-widget-quick-chips');
    if (!chipsContainer) return;

    chipsContainer.querySelectorAll('.faq-chip-btn').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const query = (chip.getAttribute('data-query') || '').toLowerCase().trim();
        const input = document.getElementById('faq-widget-input');
        if (input) input.value = '';

        if (query.includes('mate')) {
          renderAdvisoriesList({ area: 'Matemáticas' });
        } else if (query.includes('fisi')) {
          renderAdvisoriesList({ area: 'Física' });
        } else if (query.includes('team')) {
          renderQuestionDetail('como-ingresar-virtual', 'virtuales');
        } else if (query.includes('cost') || query.includes('gratis')) {
          renderQuestionDetail('costo', 'asesorias');
        } else if (query.includes('horario')) {
          renderAdvisoriesList();
        } else {
          renderSearchResults(query);
        }
      });
    });
  }

  // ==========================================================================
  // Configuración de Eventos Globales
  // ==========================================================================
  function setupEvents() {
    const els = getElements();

    if (els.fab) {
      els.fab.addEventListener('click', toggleWidget);
    }

    if (els.pillLabel) {
      els.pillLabel.addEventListener('click', toggleWidget);
    }

    if (els.closeBtn) {
      els.closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeWidget();
      });
    }

    if (els.form) {
      els.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = (els.input?.value || '').trim();
        if (query) {
          renderSearchResults(query);
        } else {
          renderHomeCategories();
        }
      });
    }

    if (els.input) {
      els.input.addEventListener('input', () => {
        const query = (els.input.value || '').trim();
        if (!query) {
          renderHomeCategories();
        } else if (query.length >= 2) {
          renderSearchResults(query);
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeWidget();
      }
    });

    document.addEventListener('click', (e) => {
      if (!isOpen) return;
      const root = document.getElementById('tdea-faq-widget-root');
      if (root && !root.contains(e.target)) {
        closeWidget();
      }
    });

    // Conectar chips rápidos de la cabecera
    setupQuickChips();

    // Render inicial
    renderHomeCategories();
  }

  // ==========================================================================
  // Exponer API Global para la Aplicación
  // ==========================================================================
  window.toggleTdeaFaqWidget = toggleWidget;
  window.openTdeaFaqWidget = openWidget;
  window.closeTdeaFaqWidget = closeWidget;
  window.renderAdvisoriesInWidget = renderAdvisoriesList;
  window.sortAdvisoriesBySchedule = sortAdvisoriesBySchedule;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupEvents);
  } else {
    setupEvents();
  }

  console.info('🚀 Widget Autónomo de Ciencias Básicas TdeA con orden cronológico relativo en tiempo real y Outlook Web.');
})();
