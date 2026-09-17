/**
 * Servicio de Calendarios y Recordatorios - Territorio TdeA
 * 
 * Genera enlaces directos a Google Calendar y WhatsApp
 * calculando automáticamente la próxima ocurrencia de la asesoría.
 */

const DAY_MAP = {
  'domingo': 0,
  'lunes': 1,
  'martes': 2,
  'miercoles': 3,
  'miércoles': 3,
  'jueves': 4,
  'viernes': 5,
  'sabado': 6,
  'sábado': 6
};

/**
 * Calcula las fechas de inicio y fin (objeto Date) para la próxima sesión de la asesoría.
 * @param {string} daysStr Nombre del día (ej. 'Lunes', 'Martes')
 * @param {string} timeStr Rango de horas (ej. '13:00 - 14:00', '06:00 - 08:00')
 * @returns {{ start: Date, end: Date }}
 */
export function getNextAdvisoryDateTime(daysStr = '', timeStr = '') {
  const now = new Date();
  const normalizedDay = daysStr.toLowerCase().trim();
  
  // Encontrar el día de la semana objetivo
  let targetDay = 1; // Lunes por defecto
  for (const [name, idx] of Object.entries(DAY_MAP)) {
    if (normalizedDay.includes(name)) {
      targetDay = idx;
      break;
    }
  }

  // Parsear horas
  // Ej: '13:00 - 14:00' -> start '13:00', end '14:00'
  const parts = timeStr.split('-').map(s => s.trim());
  let startH = 8, startM = 0, endH = 10, endM = 0;

  if (parts.length >= 1 && parts[0].includes(':')) {
    const [h, m] = parts[0].split(':').map(Number);
    startH = isNaN(h) ? 8 : h;
    startM = isNaN(m) ? 0 : m;
  }
  if (parts.length >= 2 && parts[1].includes(':')) {
    const [h, m] = parts[1].split(':').map(Number);
    endH = isNaN(h) ? startH + 2 : h;
    endM = isNaN(m) ? 0 : m;
  } else {
    endH = startH + 2;
  }

  // Calcular días de diferencia hasta la próxima fecha
  let diffDays = (targetDay - now.getDay() + 7) % 7;
  
  // Si es hoy pero la hora ya pasó, agendar para la próxima semana
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = startH * 60 + startM;
  if (diffDays === 0 && currentMinutes >= startMinutes) {
    diffDays = 7;
  }

  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffDays, startH, startM, 0);
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffDays, endH, endM, 0);

  return { start: startDate, end: endDate };
}

/**
 * Formatea una fecha para Google Calendar en formato local YYYYMMDDTHHmm00
 * @param {Date} date 
 * @returns {string}
 */
function toGCalString(date) {
  const pad = n => String(n).padStart(2, '0');
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${y}${m}${d}T${hh}${mm}${ss}`;
}

/**
 * Genera el enlace directo a la plantilla de Google Calendar
 * @param {Object} advisory Objeto de asesoría de MOCK_ADVISORIES
 * @returns {string} URL completa de Google Calendar
 */
export function getGoogleCalendarUrl(advisory) {
  const { start, end } = getNextAdvisoryDateTime(advisory.days, advisory.time);
  const dates = `${toGCalString(start)}/${toGCalString(end)}`;
  
  const title = `Asesoría de ${advisory.area || 'Ciencias Básicas'} - Territorio TdeA`;
  
  const details = [
    `🎓 Asesoría Académica - Ciencias Básicas y Áreas Comunes (DCBAC)`,
    `👨‍🏫 Docente / Asesor: ${advisory.advisor || 'Docente asignado'}`,
    `🕒 Horario habitual: ${advisory.days}, ${advisory.time}`,
    `💻 Sala Virtual Microsoft Teams: ${advisory.link || ''}`,
    ``,
    `🏛️ Tecnológico de Antioquia - Institución Universitaria`,
    `⚠️ Importante: Recuerda iniciar sesión con tu correo de estudiante (@correo.tdea.edu.co) para ingresar a la sala en Teams.`
  ].join('\n');

  const location = advisory.link ? `Microsoft Teams: ${advisory.link}` : 'Microsoft Teams - Territorio TdeA';

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: dates,
    details: details,
    location: location,
    ctz: 'America/Bogota'
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Genera el enlace de WhatsApp con el mensaje estructurado
 * @param {Object} advisory Objeto de asesoría
 * @returns {string} URL de WhatsApp Web / App
 */
export function getWhatsAppShareUrl(advisory) {
  const message = [
    `🔔 *Recordatorio de Asesoría Académica TdeA* 🎓`,
    ``,
    `📚 *Materia:* Asesoría de ${advisory.area || 'Ciencias Básicas'}`,
    `👨‍🏫 *Docente:* ${advisory.advisor || 'Docente asignado'}`,
    `📅 *Día y Horario:* ${advisory.days}, ${advisory.time}`,
    `💻 *Enlace Microsoft Teams:* ${advisory.link || ''}`,
    ``,
    `🏛️ *Departamento de Ciencias Básicas y Áreas Comunes - Territorio TdeA*`,
    `💡 _Recuerda ingresar con tu cuenta de estudiante @correo.tdea.edu.co_`
  ].join('\n');

  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
}
