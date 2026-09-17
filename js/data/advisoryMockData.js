/**
 * Catálogo de Asesorías Académicas - Territorio TdeA
 * 
 * Estructura estandarizada y desacoplada, preparada para cargarse
 * desde una API o fuente de datos externa sin modificar componentes.
 */

export const ADVISORY_AREAS = [
  'Todas las áreas de Ciencias Básicas',
  'Matemáticas',
  'Física',
  'Biología',
  'Estadística',
  'Química',
  'Habilidades comunicativas I y II',
  'Lengua Materna y Habilidades comunicativas',
  'Lengua Materna',
  'Humanidades e investigación',
];

export const ADVISORY_DAYS = [
  'Todos los días',
  'Hoy',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  '⭐ Mis Favoritas'
];

/**
 * Catálogo Oficial de Asesorías de Ciencias Básicas
 */
export const MOCK_ADVISORIES = [
  // Lunes
  {
    id: 'adv-bio-01',
    area: 'Biología',
    days: 'Lunes',
    time: '06:00 - 08:00',
    advisor: 'Gina Alejandra Gil Giraldo',
    correo: 'gina.gil@tdea.edu.co',
    modality: 'Virtual',
    link: 'https://teams.microsoft.com/meet/219408212231892?p=elVZ3RUe8KllDONT9E'
  },
  {
    id: 'adv-est-01',
    area: 'Estadística',
    days: 'Lunes',
    time: '19:00 - 21:00',
    advisor: 'Sara Lucía Castillo Daza',
    correo: 'sara.castillo2@tdea.edu.co',
    modality: 'Virtual',
    link: 'https://teams.microsoft.com/meet/240218539347423?p=wIyVECKGSN53VbJhCD'
  },
  {
    id: 'adv-fis-01',
    area: 'Física',
    days: 'Lunes',
    time: '19:00 - 21:00',
    advisor: 'Gustavo Suárez Guerrero',
    correo: 'gustavo.suarez4@tdea.edu.co',
    modality: 'Virtual',
    link: 'https://teams.microsoft.com/meet/222434429436805?p=33dgQ8qOuGI8ENurI4'
  },
  {
    id: 'adv-hab-01',
    area: 'Habilidades comunicativas I y II',
    days: 'Lunes',
    time: '20:00 - 21:00',
    advisor: 'Yina Paola Moreno Hernández',
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
    advisor: 'Andrés Villabón',
    correo: 'edgar.villabon@tdea.edu.co',
    modality: 'Virtual',
    link: 'https://teams.microsoft.com/meet/242645774130079?p=HR3l4yWvTJQ4o41xsI'
  },
  {
    id: 'adv-len-01',
    area: 'Lengua Materna',
    days: 'Martes',
    time: '20:00 - 21:00',
    advisor: 'Yina Paola Moreno Hernández',
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
    advisor: 'Oscar Daniel López',
    correo: 'odlopez@tdea.edu.co',
    modality: 'Virtual',
    link: 'https://teams.microsoft.com/meet/242645774130079?p=HR3l4yWvTJQ4o41xsI'
  },
  {
    id: 'adv-hum-01',
    area: 'Humanidades e investigación',
    days: 'Miércoles',
    time: '17:00 - 18:00',
    advisor: 'Rubén Darío Ramírez Gallego',
    correo: 'rramire2@tdea.edu.co',
    modality: 'Virtual',
    link: 'https://teams.microsoft.com/meet/236120504851066?p=npMxXV5pH4n9XI4LGS'
  },
  {
    id: 'adv-qui-01',
    area: 'Química',
    days: 'Miércoles',
    time: '17:00 - 19:00',
    advisor: 'Nevis Alejandra Ruiz Marquez',
    correo: 'nevis.ruiz@tdea.edu.co',
    modality: 'Virtual',
    link: 'https://teams.microsoft.com/meet/267039514605548?p=DJQ5tznNrK2AqosR9F'
  },


  // Jueves
  {
    id: 'adv-qui-02',
    area: 'Química',
    days: 'Jueves',
    time: '17:00 - 19:00',
    advisor: 'Juliana Nanclares Orozco',
    correo: 'juliana.nanclares@tdea.edu.co',
    modality: 'Virtual',
    link: 'https://teams.microsoft.com/meet/267039514605548?p=DJQ5tznNrK2AqosR9F'
  },
  {
    id: 'adv-len-hab-01',
    area: 'Lengua Materna y Habilidades comunicativas',
    days: 'Jueves',
    time: '18:00 - 20:00',
    advisor: 'Victor Santiago Largo Gaviria',
    correo: 'slargog@tdea.edu.co',
    modality: 'Virtual',
    link: 'https://teams.microsoft.com/meet/298802026215676?p=fHVITSWOdXtB1Vdvft'
  },
  {
    id: 'adv-est-02',
    area: 'Estadística',
    days: 'Jueves',
    time: '19:00 - 21:00',
    advisor: 'Edison Humberto Osorio López',
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
    advisor: 'Diego Alberto López Cardona',
    correo: 'diego.lopez@tdea.edu.co',
    modality: 'Virtual',
    link: 'https://teams.microsoft.com/meet/242645774130079?p=HR3l4yWvTJQ4o41xsI'
  },
  {
    id: 'adv-mat-03',
    area: 'Matemáticas',
    days: 'Viernes',
    time: '13:00 - 14:00',
    advisor: 'Cindy Yurany González',
    correo: 'cindy.yurany94@tdea.edu.co',
    modality: 'Virtual',
    link: 'https://teams.microsoft.com/meet/242645774130079?p=HR3l4yWvTJQ4o41xsI'
  },
  {
    id: 'adv-bio-02',
    area: 'Biología',
    days: 'Viernes',
    time: '16:00 - 18:00',
    advisor: 'Xiomara López Legarda',
    correo: 'xiomara.lopez95@tdea.edu.co',
    modality: 'Virtual',
    link: 'https://teams.microsoft.com/meet/219408212231892?p=elVZ3RUe8KllDONT9E'
  }
];

/**
 * Normaliza cadenas de texto para comparaciones sin tildes ni mayúsculas
 */
function normalizeText(str = '') {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

/**
 * Ordena las asesorías de forma dinámica y cronológica relativa al momento actual (tiempo real).
 * Las sesiones en vivo o próximas a ocurrir desde la hora y día actual aparecen primero.
 * Las que ya finalizaron en el día de hoy se colocan al final del ciclo semanal.
 * Si dos sesiones coinciden en el mismo horario, se desempatan en orden alfabético por Área y Docente.
 * 
 * @param {Array} advisories Lista de asesorías a ordenar
 * @param {Date} [customDate=new Date()] Fecha/hora de referencia
 */
export function sortAdvisoriesBySchedule(advisories = [], customDate = new Date()) {
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

/**
 * Calcula el estado de una asesoría en tiempo real (En vivo ahora / Próxima sesión hoy / Otro día)
 */
export function getAdvisoryLiveStatus(item, customDate = new Date()) {
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const currentDayName = dayNames[customDate.getDay()];

  const isToday = normalizeText(item.days).includes(normalizeText(currentDayName));

  if (!isToday) {
    return {
      isLive: false,
      isAccessible: false,
      isToday: false,
      isPast: false,
      badgeText: item.days,
      badgeClass: 'badge-schedule',
      statusMessage: `Esta asesoría está programada para los días ${item.days} de ${item.time}. Para evitar ingresar a una sala vacía, el enlace de Teams se habilitará automáticamente durante ese horario.`
    };
  }

  // Si es hoy, verificar franja de hora: ej. "13:00 - 14:00"
  const timeParts = item.time.split('-').map(t => t.trim());
  if (timeParts.length === 2) {
    const [startH, startM] = timeParts[0].split(':').map(Number);
    const [endH, endM] = timeParts[1].split(':').map(Number);

    const currentMinutes = customDate.getHours() * 60 + customDate.getMinutes();
    const startMinutes = (startH || 0) * 60 + (startM || 0);
    const endMinutes = (endH || 0) * 60 + (endM || 0);
    const EARLY_ACCESS_MINUTES = 15; // Margen de ingreso previo

    if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
      return {
        isLive: true,
        isAccessible: true,
        isToday: true,
        isPast: false,
        badgeText: '🟢 En vivo ahora',
        badgeClass: 'badge-live',
        statusMessage: 'La sala virtual de Microsoft Teams se encuentra abierta en este momento.'
      };
    } else if (currentMinutes >= (startMinutes - EARLY_ACCESS_MINUTES) && currentMinutes < startMinutes) {
      const remaining = startMinutes - currentMinutes;
      return {
        isLive: false,
        isAccessible: true,
        isStartingSoon: true,
        isToday: true,
        isPast: false,
        badgeText: `🟡 Inicia en ${remaining} min`,
        badgeClass: 'badge-today-upcoming',
        statusMessage: 'La sala virtual ya está abierta para que verifiques tu conexión e ingreso antes de iniciar.'
      };
    } else if (currentMinutes < (startMinutes - EARLY_ACCESS_MINUTES)) {
      return {
        isLive: false,
        isAccessible: false,
        isToday: true,
        isPast: false,
        badgeText: `🔔 Hoy a las ${timeParts[0]}`,
        badgeClass: 'badge-today-upcoming',
        statusMessage: `Esta asesoría está programada para hoy a las ${timeParts[0]}. El enlace de Teams se habilitará automáticamente 15 minutos antes.`
      };
    } else {
      return {
        isLive: false,
        isAccessible: false,
        isToday: true,
        isPast: true,
        badgeText: `Finalizó hoy (${timeParts[1] || timeParts[0]})`,
        badgeClass: 'badge-today-past',
        statusMessage: `La asesoría de hoy finalizó a las ${timeParts[1] || timeParts[0]}. Te sugerimos agendar tu recordatorio para la próxima sesión.`
      };
    }
  }

  return {
    isLive: false,
    isAccessible: false,
    isToday: true,
    isPast: false,
    badgeText: '📅 Hoy',
    badgeClass: 'badge-today',
    statusMessage: `Asesoría programada para hoy en el horario ${item.time}.`
  };
}

/**
 * Consulta asesorías con soporte para filtros de área, día, favoritos y texto,
 * garantizando siempre el orden cronológico relativo en tiempo real.
 */
export function filterAdvisories(arg1 = 'Todas las áreas de Ciencias Básicas', arg2 = '', arg3 = 'Todos los días', arg4 = [], customDate = new Date()) {
  let area = 'Todas las áreas de Ciencias Básicas';
  let query = '';
  let day = 'Todos los días';
  let favoriteIds = [];

  if (typeof arg1 === 'object' && arg1 !== null) {
    area = arg1.area || area;
    query = arg1.query || query;
    day = arg1.day || day;
    favoriteIds = arg1.favoriteIds || favoriteIds;
  } else {
    area = arg1 || area;
    query = arg2 || query;
    day = arg3 || day;
    favoriteIds = arg4 || favoriteIds;
  }

  const cleanQuery = normalizeText(query);
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const todayName = dayNames[customDate.getDay()];

  const filtered = MOCK_ADVISORIES.filter(item => {
    // Filtro por Área
    const matchArea = area === 'Todas las áreas de Ciencias Básicas' || item.area === area;

    // Filtro por Día / Favoritas
    let matchDay = true;
    if (day === '⭐ Mis Favoritas') {
      matchDay = favoriteIds.includes(item.id);
    } else if (day === 'Hoy') {
      matchDay = normalizeText(item.days).includes(normalizeText(todayName));
    } else if (day !== 'Todos los días') {
      matchDay = normalizeText(item.days).includes(normalizeText(day));
    }

    // Filtro por Búsqueda de texto
    const matchQuery = !cleanQuery ||
      normalizeText(item.area).includes(cleanQuery) ||
      normalizeText(item.advisor).includes(cleanQuery) ||
      normalizeText(item.days).includes(cleanQuery);

    return matchArea && matchDay && matchQuery;
  });

  return sortAdvisoriesBySchedule(filtered, customDate);
}
