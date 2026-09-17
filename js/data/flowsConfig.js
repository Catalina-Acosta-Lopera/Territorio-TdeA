/**
 * Configuración Declarativa de Flujos de Navegación
 * Asistente Virtual de Asesorías Territorio TdeA
 * 
 * Especialización estricta:
 * - "Recursos para estudiantes": Apoyo pedagógico y académico (guías, talleres, técnicas y grabaciones).
 * - "Necesito ayuda con una asesoría": Soporte técnico rápido e incidencias (Teams, enlaces, salas virtuales).
 */

export const FLOWS = {
  // Pantalla de Inicio (4 canales principales)
  home: {
    id: 'home',
    title: 'Inicio',
    greeting: 'Hola 👋 Soy el asistente virtual de Territorio TdeA.',
    prompt: 'Estoy aquí para orientarte y ayudarte a encontrar información sobre las asesorías académicas.',
    question: '¿En qué necesitas ayuda?',
    options: [
      {
        id: 'opt_asesorias_disponibles',
        title: 'Asesorías disponibles',
        description: 'Consulta horarios, áreas, docentes y enlaces de acceso a Teams.',
        icon: '📅',
        targetFlow: 'asesorias_disponibles'
      },
      {
        id: 'opt_recursos_estudiantes',
        title: 'Recursos para estudiantes',
        description: 'Guías académicas, talleres descargables, técnicas de estudio y grabaciones.',
        icon: '🎓',
        targetFlow: 'recursos_estudiantes'
      },
      {
        id: 'opt_necesito_ayuda_asesoria',
        title: 'Necesito ayuda con una asesoría',
        description: 'Soporte técnico rápido para incidencias con Teams, salas virtuales y enlaces.',
        icon: '📝',
        targetFlow: 'necesito_ayuda_asesoria'
      },
      {
        id: 'opt_contacto',
        title: 'Contacto institucional',
        description: 'Canales de atención oficiales de Territorio TdeA en Ciencias Básicas.',
        icon: '📞',
        targetFlow: 'contacto'
      }
    ]
  },

  // Flujo: Asesorías disponibles (Catálogo con filtros por área y estado en vivo)
  asesorias_disponibles: {
    id: 'asesorias_disponibles',
    parent: 'home',
    breadcrumb: 'Asesorías disponibles',
    type: 'advisory_list',
    title: 'Asesorías Académicas Disponibles',
    greeting: 'Asesorías Académicas Territorio TdeA',
    prompt: 'Consulta la programación semanal en Ciencias Básicas, filtra por tu área de interés e ingresa a las salas virtuales de Microsoft Teams.'
  },

  // Flujo: Centro de Recursos para Estudiantes (Biblioteca Pedagógica y Académica)
  recursos_estudiantes: {
    id: 'recursos_estudiantes',
    parent: 'home',
    breadcrumb: 'Recursos para estudiantes',
    type: 'resources_view',
    title: 'Recursos Académicos para Estudiantes',
    greeting: 'Biblioteca Pedagógica y Material de Estudio',
    prompt: 'Guías de estudio por asignaturas, talleres prácticos descargables, técnicas de repaso y repositorio de grabaciones de clase de Ciencias Básicas.'
  },

  // Flujo: Necesito ayuda con una asesoría (Soporte Técnico e Incidencias Rápido)
  necesito_ayuda_asesoria: {
    id: 'necesito_ayuda_asesoria',
    parent: 'home',
    breadcrumb: 'Soporte técnico de asesorías',
    greeting: 'Soporte Técnico e Incidencias en Asesorías',
    prompt: 'Diagnóstico y resolución rápida para inconvenientes técnicos con salas virtuales, enlaces o Microsoft Teams.',
    question: '¿Qué inconveniente técnico estás experimentando?',
    options: [
      {
        id: 'opt_enlace_no_funciona',
        title: 'El enlace de Teams marca error o no abre',
        description: 'Qué hacer si el link de la reunión virtual arroja error o no carga',
        icon: '🔗',
        targetFlow: 'ayuda_enlace_no_funciona'
      },
      {
        id: 'opt_inicio_sesion',
        title: 'No puedo iniciar sesión con mi correo institucional',
        description: 'Solución a problemas de cuenta y autenticación en Teams (@correo.tdea.edu.co)',
        icon: '🔑',
        targetFlow: 'ayuda_inicio_sesion'
      },
      {
        id: 'opt_sala_vacia',
        title: 'El docente no está en la sala o la sesión se cayó',
        description: 'Protocolo de confirmación si la sala virtual está desierta o la llamada se cerró',
        icon: '🚪',
        targetFlow: 'ayuda_sala_vacia'
      },
      {
        id: 'opt_audio_video',
        title: 'Problemas de audio, micrófono o cámara en Teams',
        description: 'Configuración de dispositivos de sonido y permisos del navegador en la llamada',
        icon: '🎙️',
        targetFlow: 'ayuda_audio_video'
      },
      {
        id: 'opt_ninguna_anteriores',
        title: 'Reportar otra incidencia técnica o contactar soporte',
        description: 'Atención personalizada para contingencias técnicas no listadas',
        icon: '✉️',
        targetFlow: 'ayuda_ninguna_anteriores'
      }
    ]
  },

  // 1. Incidencia: Enlace no abre o marca error
  ayuda_enlace_no_funciona: {
    id: 'ayuda_enlace_no_funciona',
    parent: 'necesito_ayuda_asesoria',
    breadcrumb: 'Enlace no abre',
    type: 'guidance',
    title: '¿Qué hacer si el enlace de Teams no abre o marca error?',
    summary: 'Comprobaciones técnicas inmediatas para ingresar a tu sala virtual:',
    content: `
      <div style="line-height: 1.8;">
        <p>1. <strong>Verifica tu cuenta activa:</strong> Asegúrate de que tu navegador tenga abierta la sesión con tu correo institucional de estudiante <code>@correo.tdea.edu.co</code>. Las cuentas personales de Microsoft (Hotmail u Outlook) impiden el ingreso a salas institucionales.</p>
        <p>2. <strong>Abre el enlace en una ventana de incógnito:</strong> Copia el enlace de la asesoría y pégalo en una pestaña privada o de incógnito para descartar bloqueos de cookies o conflictos entre múltiples cuentas de correo.</p>
        <p>3. <strong>Ingresa desde la aplicación oficial de Teams:</strong> Si estás en computador o celular, abre directamente la aplicación de Microsoft Teams con tu usuario institucional en lugar de la versión web.</p>
        <p>4. <strong>Confirma el horario programado:</strong> Ten presente que las salas virtuales de Teams solo están activas durante el día y rango de horas oficial fijado para la asesoría.</p>
      </div>
    `,
    quickAction: {
      label: '📅 Verificar horario en Asesorías disponibles',
      targetFlow: 'asesorias_disponibles'
    },
    supportContact: {
      message: 'Si el enlace continúa arrojando error o no abre, repórtalo inmediatamente a:',
      email: 'auxcienciasbasicas2@tdea.edu.co'
    }
  },

  // 2. Incidencia: Inicio de sesión en Teams
  ayuda_inicio_sesion: {
    id: 'ayuda_inicio_sesion',
    parent: 'necesito_ayuda_asesoria',
    breadcrumb: 'Inicio de sesión Teams',
    type: 'guidance',
    title: 'No puedo iniciar sesión con mi correo institucional en Teams',
    summary: 'Orientación para validar tus credenciales institucionales TdeA:',
    content: `
      <div style="line-height: 1.8;">
        <p>1. <strong>Estructura del usuario:</strong> Escribe tu correo institucional de estudiante completo incluyendo el dominio <code>@correo.tdea.edu.co</code> (ejemplo: <code>nombre.apellido@correo.tdea.edu.co</code>). No ingreses únicamente el prefijo.</p>
        <p>2. <strong>Cierra sesiones previas de Microsoft:</strong> Si tienes una cuenta personal activa en el navegador, ingresa a <code>login.microsoftonline.com</code>, cierra sesión e inicia nuevamente con tus datos de estudiante TdeA.</p>
        <p>3. <strong>Autenticación en dos pasos:</strong> Si la plataforma te solicita aprobación por la app Microsoft Authenticator o código SMS, autorízalo desde tu teléfono móvil.</p>
        <p>4. <strong>Contraseña bloqueada:</strong> Si tu contraseña no es reconocida, puedes restablecerla a través de los canales de autoservicio de TI institucional o comunicarte con la Mesa de Ayuda de Tecnologías.</p>
      </div>
    `,
    supportContact: {
      message: 'Si requieres soporte con la validación de tu acceso en Ciencias Básicas, escribe a:',
      email: 'auxcienciasbasicas2@tdea.edu.co'
    }
  },

  // 3. Incidencia: Docente no está en la sala / sala caída
  ayuda_sala_vacia: {
    id: 'ayuda_sala_vacia',
    parent: 'necesito_ayuda_asesoria',
    breadcrumb: 'Docente no está en sala',
    type: 'guidance',
    title: 'El docente no está en la sala o la sesión se cayó',
    summary: 'Protocolo de contingencia si la reunión se encuentra desierta o se interrumpió:',
    content: `
      <div style="line-height: 1.8;">
        <p>1. <strong>Margen de espera inicial:</strong> Espera entre 5 y 10 minutos al iniciar la franja horaria. El docente puede estar cerrando la asesoría anterior o reiniciando su conexión a internet.</p>
        <p>2. <strong>Verifica el horario en el catálogo:</strong> Confirma en <strong>Asesorías disponibles</strong> que estás ingresando en el día de la semana y bloque de horas exacto de ese docente.</p>
        <p>3. <strong>Reingreso por desconexión:</strong> Si la llamada se cerró inesperadamente, vuelve a hacer clic en el enlace de la sala desde el catálogo para unirte de nuevo.</p>
        <p>4. <strong>Deja constancia en el chat de Teams:</strong> Escribe tu nombre y la duda o tema que deseas consultar en el chat de la llamada para que el docente te registre tan pronto restablezca conexión.</p>
      </div>
    `,
    quickAction: {
      label: '📅 Comprobar horario en Asesorías disponibles',
      targetFlow: 'asesorias_disponibles'
    },
    supportContact: {
      message: 'Si pasados 10 minutos el docente no ingresa a la sesión programada, repórtalo para activar la contingencia a:',
      email: 'auxcienciasbasicas2@tdea.edu.co'
    }
  },

  // 4. Incidencia: Audio, micrófono o cámara en Teams
  ayuda_audio_video: {
    id: 'ayuda_audio_video',
    parent: 'necesito_ayuda_asesoria',
    breadcrumb: 'Audio y video en Teams',
    type: 'guidance',
    title: 'Problemas de audio, micrófono o cámara en Teams',
    summary: 'Ajustes rápidos para solucionar problemas de audio y micrófono en la llamada:',
    content: `
      <div style="line-height: 1.8;">
        <p>1. <strong>Permisos del navegador:</strong> En Edge o Chrome, haz clic en el ícono del candado (🔒) en la barra de direcciones y asegúrate de que el permiso de <em>Micrófono</em> y <em>Cámara</em> esté en "Permitir".</p>
        <p>2. <strong>Selección de dispositivos:</strong> En la llamada de Teams, ve a <strong>Más (...) > Ajustes > Dispositivos</strong> y verifica que el micrófono y altavoz seleccionados coincidan con tus audífonos o parlantes.</p>
        <p>3. <strong>Estado de silenciado (Mute):</strong> Comprueba si el ícono de micrófono en Teams tiene una línea diagonal. Pulsa sobre él para reactivar tu audio antes de hablar.</p>
        <p>4. <strong>Canal de respaldo por chat:</strong> Si la falla técnica persiste, puedes escribir tus preguntas y compartir apuntes directamente en el chat de la reunión de Teams para no perder la asesoría.</p>
      </div>
    `,
    supportContact: {
      message: 'Si continúas presentando dificultades técnicas para participar en la asesoría, comunícate con:',
      email: 'auxcienciasbasicas2@tdea.edu.co'
    }
  },

  // 5. Escalamiento: Incidencia técnica no listada
  ayuda_ninguna_anteriores: {
    id: 'ayuda_ninguna_anteriores',
    parent: 'necesito_ayuda_asesoria',
    breadcrumb: 'Incidencia técnica',
    type: 'escalation',
    title: 'Reportar Incidencia Técnica',
    message: 'Si tu inconveniente técnico no figura en las opciones anteriores o requieres asistencia personalizada con las plataformas de Ciencias Básicas, comunícate con la Coordinación:',
    email: 'auxcienciasbasicas2@tdea.edu.co'
  },

  // Flujo: Contacto Institucional
  contacto: {
    id: 'contacto',
    parent: 'home',
    breadcrumb: 'Contacto institucional',
    type: 'contact',
    title: 'Contacto Institucional',
    summary: 'Canales de atención oficial de Territorio TdeA para asesorías académicas en Ciencias Básicas:',
    email: 'auxcienciasbasicas2@tdea.edu.co'
  }
};
