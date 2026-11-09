/**
 * Datos Oficiales de la Serie de Podcasts Campus Vital TdeA
 * Bienestar Institucional y Ciencias Básicas - Tecnológico de Antioquia
 * 
 * Contiene los 4 episodios oficiales conducidos por los psicólogos de Bienestar Universitario:
 * - Episodio 1: El Estrés Académico (~28 min) - Psic. Andrés Felipe Gómez
 * - Episodio 2: Aprender a Aprender (~30 min) - Psic. Ana María & Psic. Andrés Felipe Gómez
 * - Episodio 3: Adaptarnos para Permanecer (~33 min) - Psic. Andrés Felipe Gómez
 * - Episodio 4: Proyecto de Vida (~38 min) - Psic. Ana María
 */

export const PODCASTS_DATA = [
  {
    id: 'podcast-vital-01',
    episodeNumber: 1,
    episodeTag: 'Episodio 01',
    duration: '28:40 min',
    durationSec: 1720,
    title: 'Episodio 1: El Estrés Académico: Estrategias para Gestionar la Presión y las Entregas',
    shortTitle: 'El Estrés Académico',
    speaker: 'Psic. Andrés Felipe Gómez · Bienestar Universitario TdeA',
    description: 'Imagina que son las 10 de la noche, tienes una entrega para mañana y un parcial en camino... En este episodio exploramos qué es el estrés académico, cómo responde el cuerpo ante la sobrecarga y herramientas prácticas para recuperar la calma y priorizar.',
    audioUrl: 'assets/campusVital/audio/podcasts/podcast_episodio_1_estres_academico.mp3',
    downloadFilename: 'CampusVital_Podcast_Episodio1_EstresAcademico.mp3',
    robotPoseSrc: 'assets/icons/campus-vital-mascot-red-heart.svg',
    robotPoseAlt: 'Robot de Campus Vital abrazando un corazón rojo luminoso (autorregulación somática)',
    coverGradient: 'linear-gradient(135deg, #022B14 0%, #064E3B 55%, #059669 100%)',
    haloColor: 'rgba(239, 68, 68, 0.45)',
    accentColor: '#10B981',
    tagCategory: 'BIENESTAR Y SALUD MENTAL',
    badgeText: '🎙️ Podcast',
    statusText: 'Disponible',
    topics: [
      'Identificación temprana de señales somáticas de estrés (tensión muscular, respiración corta, pensamientos acelerados)',
      'La diferencia entre el estrés adaptativo y la sobrecarga paralizante en la vida académica',
      'Estrategias para dosificar tareas grandes en pasos pequeños y alcanzables',
      'Técnicas inmediatas para recuperar la calma antes de un examen o una entrega final'
    ]
  },
  {
    id: 'podcast-vital-02',
    episodeNumber: 2,
    episodeTag: 'Episodio 02',
    duration: '30:29 min',
    durationSec: 1829,
    title: 'Episodio 2: Aprender a Aprender: Hábitos de Estudio y Estrategias Efectivas',
    shortTitle: 'Aprender a Aprender',
    speaker: 'Psic. Ana María & Psic. Andrés Felipe Gómez · Bienestar Universitario TdeA',
    description: '¿Aprender mejor significa necesariamente pasar más horas agotadoras frente a los apuntes? Reflexionamos sobre estudiar de forma estratégica: técnicas de estudio activo, gestión de distractores y organización cognitiva para la universidad.',
    audioUrl: 'assets/campusVital/audio/podcasts/podcast_episodio_2_aprender_a_aprender.mp3',
    downloadFilename: 'CampusVital_Podcast_Episodio2_AprenderAAprender.mp3',
    robotPoseSrc: 'assets/icons/campus-vital-mascot.svg',
    robotPoseAlt: 'Robot de Campus Vital con birrete y libro académico institucional (estudio activo)',
    coverGradient: 'linear-gradient(135deg, #0F4A27 0%, #0D5C3A 55%, #008744 100%)',
    haloColor: 'rgba(116, 214, 51, 0.45)',
    accentColor: '#34D399',
    tagCategory: 'CIENCIAS BÁSICAS · HÁBITOS',
    badgeText: '🎙️ Podcast',
    statusText: 'Disponible',
    topics: [
      'Desmitificando el estudio: calidad y estrategia por encima de cantidad de horas',
      'Métodos de aprendizaje activo, autoevaluación y evocación espaciada',
      'Organización de los tiempos y control de distractores digitales',
      'Hábitos sostenibles para rendir académicamente sin sacrificar el descanso ni la salud'
    ]
  },
  {
    id: 'podcast-vital-03',
    episodeNumber: 3,
    episodeTag: 'Episodio 03',
    duration: '33:03 min',
    durationSec: 1983,
    title: 'Episodio 3: Adaptarnos para Permanecer: Navegar la Transición Universitaria',
    shortTitle: 'Adaptarnos para Permanecer',
    speaker: 'Psic. Andrés Felipe Gómez · Bienestar Universitario TdeA',
    description: 'Ingresar a la universidad es como llegar a una ciudad nueva y desconocida: hay rutas por descubrir, mapas que trazar y retos que asumir. Abordamos cómo navegar la incertidumbre de los primeros semestres y construir redes de apoyo para permanecer.',
    audioUrl: 'assets/campusVital/audio/podcasts/podcast_episodio_3_adaptarnos_para_permanecer.mp3',
    downloadFilename: 'CampusVital_Podcast_Episodio3_AdaptarnosParaPermanecer.mp3',
    robotPoseSrc: 'assets/images/learningCenter/tdea_mascot_chibi_3d.png',
    robotPoseAlt: 'Robot Chibi 3D en pose amigable de bienvenida y exploración del campus',
    coverGradient: 'linear-gradient(135deg, #065F46 0%, #047857 55%, #0284C7 100%)',
    haloColor: 'rgba(56, 189, 248, 0.45)',
    accentColor: '#38BDF8',
    tagCategory: 'PERMANENCIA INSTITUCIONAL',
    badgeText: '🎙️ Podcast',
    statusText: 'Disponible',
    topics: [
      'La metáfora de la ciudad desconocida: cómo orientarse en el ecosistema universitario',
      'Manejo del cambio: transición del colegio o del trabajo a la educación superior',
      'Construcción de vínculos saludables con compañeros, profesores y asesores',
      'Acompañamiento institucional: cuándo y cómo activar las redes de apoyo del TdeA'
    ]
  },
  {
    id: 'podcast-vital-04',
    episodeNumber: 4,
    episodeTag: 'Episodio 04',
    duration: '37:51 min',
    durationSec: 2271,
    title: 'Episodio 4: Proyecto de Vida: Construir tu Propósito y Mantener la Motivación',
    shortTitle: 'Proyecto de Vida y Propósito',
    speaker: 'Psic. Ana María · Bienestar Universitario TdeA',
    description: '¿Qué quiero construir con mi carrera y qué me impulsa a seguir adelante? Reflexionamos sobre las preguntas vocacionales, cómo resignificar los momentos de duda o frustración y conectar el esfuerzo académico con un sentido de vida trascendente.',
    audioUrl: 'assets/campusVital/audio/podcasts/podcast_episodio_4_proyecto_de_vida.mp3',
    downloadFilename: 'CampusVital_Podcast_Episodio4_ProyectoDeVida.mp3',
    robotPoseSrc: 'assets/images/learningCenter/tdea_mascot_fullbody_transparent.png',
    robotPoseAlt: 'Robot cuerpo completo 3D mirando con determinación y visión hacia el futuro',
    coverGradient: 'linear-gradient(135deg, #022B14 0%, #074E26 50%, #15803D 100%)',
    haloColor: 'rgba(163, 230, 53, 0.45)',
    accentColor: '#A3E635',
    tagCategory: 'DESARROLLO HUMANO Y PROPÓSITO',
    badgeText: '🎙️ Podcast',
    statusText: 'Disponible',
    topics: [
      'Preguntarnos el «para qué»: conectar la formación académica con valores personales',
      'Afrontar los momentos de duda vocacional o desánimo a mitad de carrera',
      'El error y el tropiezo como maestros del aprendizaje, no como fracaso definitivo',
      'Visualización de metas a corto, mediano y largo plazo con bienestar y equilibrio'
    ]
  }
];

export function getPodcastById(id) {
  return PODCASTS_DATA.find(p => p.id === id) || null;
}

