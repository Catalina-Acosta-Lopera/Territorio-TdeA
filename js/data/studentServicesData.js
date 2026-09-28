/**
 * Base de Datos Declarativa de Servicios para Estudiantes TdeA
 * Asistente Virtual Territorio TdeA
 * 
 * Accesos directos a las principales plataformas y servicios institucionales:
 * Campus, Correo Institucional, Reglamento y TdeA Virtual.
 */

export const STUDENT_SERVICES_DATA = [
  {
    id: 'tutoria-ia',
    title: 'TutorIA TdeA · Acompañamiento Académico Inteligente',
    description: 'Compañero académico inteligente del Departamento de Ciencias Básicas y Áreas Comunes, con tutorías interactivas adaptadas a tu facultad y malla curricular del TdeA.',
    buttonLabel: 'Ingresar a TutorIA TdeA',
    url: 'https://asesorias-territorio-dcbac-tdea.ai.studio/',
    isOpen: true
  },
  {
    id: 'campus',
    title: 'Campus TdeA',
    description: 'Accede a la plataforma institucional de gestión académica para matricular asignaturas, consultar calificaciones, horarios y trámites estudiantiles.',
    buttonLabel: 'Ingresar a Campus',
    url: 'https://campus.tdea.edu.co',
    isOpen: false
  },
  {
    id: 'correo',
    title: 'Correo Institucional',
    description: 'Ingresa a tu buzón oficial en Outlook Web (Microsoft 365) para comunicarte con tus docentes, compañeros y recibir avisos académicos oficiales.',
    buttonLabel: 'Ingresar al Correo',
    url: 'https://outlook.office.com/mail/',
    isOpen: false
  },
  {
    id: 'virtual',
    title: 'TdeA Virtual',
    description: 'En TdeA virtual puedes acceder a cursos, aulas de apoyo y herramientas de aprendizaje digital.',
    buttonLabel: 'Ingresar',
    url: 'https://virtual.tdea.edu.co',
    isOpen: false
  },
  {
    id: 'teams',
    title: 'Microsoft Teams',
    description: 'Ingresa a Microsoft Teams con tu cuenta de correo institucional (@correo.tdea.edu.co) para unirte a tus asesorías académicas virtuales, clases en vivo y tutorías.',
    buttonLabel: 'Ingresar a Teams',
    url: 'https://teams.microsoft.com',
    isOpen: false
  },
  {
    id: 'reglamento',
    title: 'Reglamento estudiantil',
    description: 'Conoce tus derechos, deberes, régimen disciplinario y normas académicas vigentes en el Tecnológico de Antioquia.',
    buttonLabel: 'Consultar reglamento',
    url: 'https://www.tdea.edu.co/index.php/reglamento-estudiantil',
    isOpen: false
  },
  {
    id: 'biblioteca',
    title: 'Biblioteca TdeA',
    description: 'En la Biblioteca Humberto Saldarriaga Carmona puedes consultar el catálogo en línea, solicitar préstamo de libros y computadores portátiles, y acceder a bases de datos y recursos digitales.',
    buttonLabel: 'Ingresar a la Biblioteca',
    url: 'https://tdea.edu.co/micrositios/biblioteca/',
    isOpen: false
  },
  {
    id: 'vbg',
    title: 'TdeA Sin Violencias Basadas en Género (Ruta de atención)',
    description: 'Estrategia institucional de Bienestar Universitario donde los estudiantes pueden consultar los lineamientos de prevención, orientación y acompañamiento integral ante situaciones de violencia basada en género (correo confidencial: alerta.genero@tdea.edu.co).',
    buttonLabel: 'Consultar protocolo',
    url: 'https://tdea.edu.co/micrositios/bienestar-universitario/sin-violencias-basadas-en-genero/',
    isOpen: false
  }
];
