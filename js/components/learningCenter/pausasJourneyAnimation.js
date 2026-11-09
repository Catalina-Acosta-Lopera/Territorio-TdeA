/**
 * Animación Interactiva del Río de la Calma y las 4 Pausas Conscientes
 * Módulo 3: "Aprender a navegar los cambios - Gestionando mis emociones"
 * Campus Vital 2026 - Centro de Aprendizaje "TdeA Contigo"
 * Tecnológico de Antioquia - Institución Universitaria
 *
 * Flujo narrativo y gamificado interactivo:
 *  - Escenario panorámico de río sereno con el Robot Mascota TdeA navegando en su bote de bienestar.
 *  - 4 Muelles / Paradas temáticas a lo largo del cauce fluvial:
 *      1. Pausa 1: Reconociendo las señales de mi cuerpo (Muelle de madera, farol y boya de escaneo)
 *      2. Pausa 2: Respirar para volver a la calma (Laguna de flor de loto con pulsación 4-2-6)
 *      3. Pausa 3: Haciendo una pausa consciente (Isla del Semáforo Emocional: Rojo, Amarillo, Verde)
 *      4. Pausa 4: Volviendo al presente (Jardín sensorial y cofre de herramientas)
 *      5. Cierre: Gran Faro de Bienestar y Reconocimiento TdeA (Cumbre de la Calma)
 *  - Desplazamiento animado del robot a lo largo de las curvas del río según el progreso.
 *  - Puntos de control interactivos (clicables directamente sobre el mapa para ingresar a las pausas).
 *  - Reproductor de voz en off institucional integrado y botón de acción prominente.
 */

export class PausasJourneyAnimation {
  constructor(options = {}) {
    this.container = options.container || null;
    this.p1Done = Boolean(options.p1Done);
    this.p2Done = Boolean(options.p2Done);
    this.p3Done = Boolean(options.p3Done);
    this.p4Done = Boolean(options.p4Done);
    this.onSelectPausa = options.onSelectPausa || (() => {});
    this.onSelectCierre = options.onSelectCierre || (() => {});
    this.onResetJourney = options.onResetJourney || null;

    this.tok = 0;
    this.raf = null;
    this.boatX = 80;
    this.boatY = 445;
    this.boatAngle = 0;

    // Segmentos del cauce del río (Curvas Bézier para navegación)
    this.SEG = {
      P0_P1: 'M 80 455 C 120 455, 150 430, 200 410',
      P1_P2: 'M 200 410 C 270 390, 330 365, 430 325',
      P2_P3: 'M 430 325 C 500 290, 580 320, 670 335',
      P3_P4: 'M 670 335 C 740 345, 770 275, 820 220',
      P4_C:  'M 820 220 C 855 175, 875 135, 905 95'
    };

    // Coordenadas fijas de los muelles / waypoints
    this.WAYPOINTS = {
      1: { x: 200, y: 410, name: 'Pausa 1', title: 'Señales del cuerpo' },
      2: { x: 430, y: 325, name: 'Pausa 2', title: 'Respirar 4-2-6' },
      3: { x: 670, y: 335, name: 'Pausa 3', title: 'Semáforo emocional' },
      4: { x: 820, y: 220, name: 'Pausa 4', title: 'Volver al presente' },
      5: { x: 905, y: 95,  name: 'Cierre',  title: 'Faro de la Calma' }
    };
  }

  render() {
    if (!this.container) return;

    const allDone = this.p1Done && this.p2Done && this.p3Done && this.p4Done;
    const activePausaNum = !this.p1Done ? 1 : (!this.p2Done ? 2 : (!this.p3Done ? 3 : (!this.p4Done ? 4 : 5)));

    const statusTexts = {
      1: '📍 Muelle actual: Pausa 1 · Reconociendo las señales de mi cuerpo',
      2: '📍 Muelle actual: Pausa 2 · Respirar para volver a la calma',
      3: '📍 Muelle actual: Pausa 3 · Haciendo una pausa consciente (Semáforo)',
      4: '📍 Muelle actual: Pausa 4 · Volviendo al presente y Caja de Herramientas',
      5: '🏆 ¡Travesía completada! Todas las pausas realizadas. Accede al Cierre.'
    };

    this.container.innerHTML = `
      <div class="mod3-experience-root animate-fade-in" id="mod3-experience-wrapper" role="region" aria-label="Río de la Calma - Recorrido Interactivo Módulo 3">
        
        <!-- 1. BARRA SUPERIOR DE CONTROL INSTITUCIONAL (ESTILO MÓDULO 1) -->
        <header class="mod3-top-control-bar">
          <div class="mod3-control-left">
            <span class="mod3-badge-pill">
              <span>🌱</span>
              <span>CAMPUS VITAL TdeA · RÍO DE LA CALMA</span>
            </span>
            <div class="mod3-status-wrap">
              <span class="mod3-status-text" id="mod3-global-status">
                ${statusTexts[activePausaNum]}
              </span>
            </div>
          </div>

          <!-- Controles de Audio y Navegación Accesible -->
          <div class="mod3-audio-mini-player">
            <audio id="mod3-scene-voiceover-audio" preload="auto">
              <source src="assets/campusVital/audio/modulo3_intro_voz.mp3" type="audio/mpeg">
            </audio>

            <button type="button" class="mod3-btn-action mod3-btn-audio" id="btn-scene-audio-toggle" aria-label="Control de Voz en Off">
              <span class="mod3-soundwave" id="mod3-soundwave" style="display: none;">
                <span class="bar bar-1"></span>
                <span class="bar bar-2"></span>
                <span class="bar bar-3"></span>
                <span class="bar bar-4"></span>
              </span>
              <span id="scene-audio-icon">▶</span>
              <span id="scene-audio-text">Escuchar voz en off</span>
            </button>

            <button type="button" class="mod3-btn-action mod3-btn-transcript" id="btn-scene-transcript-toggle" title="Leer transcripción accesible DUA">
              <span>📝 Transcripción</span>
            </button>

            <button type="button" class="mod3-btn-action mod3-btn-reset" id="btn-scene-reset-journey" title="Reiniciar visualmente el viaje del río">
              <span>🔄 Reiniciar</span>
            </button>
          </div>
        </header>

        <!-- Transcripción Accesible Oficial (DUA) Desplegable -->
        <div id="mod3-scene-transcript" class="mod3-scene-transcript-card" style="display: none;" role="region" aria-label="Transcripción oficial de la locución">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <strong style="color: #022B14; font-size: 0.92rem;">🎙️ Locución oficial de navegación (DUA):</strong>
            <button type="button" id="btn-close-scene-transcript-x" style="background: none; border: none; cursor: pointer; font-size: 1.2rem; color: #64748B;">&times;</button>
          </div>
          <p style="margin: 0; line-height: 1.6; color: #334155; font-size: 0.9rem;">
            «Durante la vida universitaria vivimos momentos de entusiasmo, ilusión y aprendizaje. Pero también podemos experimentar preocupación, nervios, miedo o ansiedad frente a nuevos retos. Estas emociones hacen parte de nuestra experiencia. Lo importante no es evitarlas, sino aprender a reconocerlas y contar con herramientas que nos ayuden a responder de una manera saludable. En este módulo descubrirás algunas estrategias sencillas que podrás practicar cuando necesites volver a la calma. Vamos a tener 4 cortas pausas que nos ayudarán con esto en el viaje.»
          </p>
        </div>

        <!-- 2. LIENZO PANORÁMICO VECTORIAL DEL RÍO DE LA CALMA (1000 x 520) -->
        <div class="mod3-canvas-wrapper" id="mod3-canvas-wrapper">
          <svg id="river-scene" viewBox="0 0 1000 520" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Lienzo panorámico del Río de la Calma con el robot navegando por las 4 pausas">
            <defs>
              <!-- Gradiente de Cielo Mañanero Plácido -->
              <linearGradient id="r-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#D1FAE5"/>
                <stop offset="45%" stop-color="#E0F2FE"/>
                <stop offset="100%" stop-color="#F0FDF4"/>
              </linearGradient>

              <!-- Sol y Halo Cálido -->
              <radialGradient id="r-sun" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#FEF08A" stop-opacity="0.95"/>
                <stop offset="50%" stop-color="#FDE047" stop-opacity="0.45"/>
                <stop offset="100%" stop-color="#FDE047" stop-opacity="0"/>
              </radialGradient>

              <!-- Colinas del Valle de Aburrá Lejanas -->
              <linearGradient id="r-hills-far" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#A7F3D0" stop-opacity="0.85"/>
                <stop offset="100%" stop-color="#6EE7B7" stop-opacity="0.3"/>
              </linearGradient>

              <linearGradient id="r-hills-mid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#059669"/>
                <stop offset="50%" stop-color="#047857"/>
                <stop offset="100%" stop-color="#064E3B"/>
              </linearGradient>

              <!-- Ribera de Pasto Verde Institucional -->
              <linearGradient id="r-meadow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#10B981"/>
                <stop offset="60%" stop-color="#059669"/>
                <stop offset="100%" stop-color="#022B14"/>
              </linearGradient>

              <!-- Agua Esmeralda y Turquesa del Río de la Calma -->
              <linearGradient id="r-water" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#0284C7"/>
                <stop offset="35%" stop-color="#0D9488"/>
                <stop offset="70%" stop-color="#059669"/>
                <stop offset="100%" stop-color="#10B981"/>
              </linearGradient>

              <!-- Resplandor para Ojos y Faro -->
              <filter id="r-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3.5" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              <!-- Bote del Robot: Gradiente del Casco -->
              <linearGradient id="r-boat-hull" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#00843D"/>
                <stop offset="55%" stop-color="#005A29"/>
                <stop offset="100%" stop-color="#022B14"/>
              </linearGradient>
              <linearGradient id="r-boat-deck" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#FFFFFF"/>
                <stop offset="100%" stop-color="#E2E8F0"/>
              </linearGradient>
              <linearGradient id="r-gold-trim" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#F59E0B"/>
                <stop offset="50%" stop-color="#FBBF24"/>
                <stop offset="100%" stop-color="#D97706"/>
              </linearGradient>
            </defs>

            <!-- 1. FONDO DE CIELO Y SOL -->
            <rect x="0" y="0" width="1000" height="520" fill="url(#r-sky)"/>
            <circle cx="280" cy="110" r="160" fill="url(#r-sun)"/>

            <!-- Nubes Flotantes Suaves -->
            <g class="m3-cloud-anim-1" opacity="0.85">
              <path d="M 60 70 Q 80 45 110 50 Q 130 30 160 40 Q 185 25 210 45 Q 235 50 240 70 Z" fill="#FFFFFF"/>
            </g>
            <g class="m3-cloud-anim-2" opacity="0.7">
              <path d="M 620 90 Q 640 68 670 72 Q 690 55 720 62 Q 745 50 765 68 Q 785 72 790 90 Z" fill="#FFFFFF"/>
            </g>

            <!-- 2. CORDILLERA LEJANA DEL VALLE -->
            <path d="M 0 200 L 70 170 L 150 190 L 250 150 L 360 185 L 480 140 L 600 175 L 720 135 L 840 170 L 930 145 L 1000 170 L 1000 520 L 0 520 Z" fill="url(#r-hills-far)"/>
            <path d="M 0 240 L 90 215 L 180 235 L 300 195 L 420 230 L 540 190 L 670 225 L 800 185 L 910 210 L 1000 195 L 1000 520 L 0 520 Z" fill="url(#r-hills-mid)"/>

            <!-- 3. RIBERAS Y PRADERAS VERDES -->
            <!-- Ribera Superior / Norte -->
            <path d="M 0 310 C 180 320, 280 260, 430 250 C 580 240, 680 290, 810 190 C 890 130, 950 100, 1000 70 L 1000 520 L 0 520 Z" fill="url(#r-meadow)"/>

            <!-- 4. CAUCE DEL RÍO DE LA CALMA (Curva natural orgánica) -->
            <path id="river-bed-water" d="
              M 0 495 
              C 120 490, 170 450, 240 430 
              C 330 405, 380 375, 470 335 
              C 560 295, 620 355, 710 365 
              C 800 375, 830 295, 875 235 
              C 920 175, 940 135, 960 70 
              L 1000 70 L 1000 130 
              C 970 190, 945 235, 905 290 
              C 865 350, 835 435, 735 425 
              C 645 415, 595 355, 505 395 
              C 415 435, 365 470, 275 490 
              C 195 510, 100 525, 0 525 Z" 
              fill="url(#r-water)" opacity="0.95"/>

            <!-- Ondas y reflejos luminosos en el agua -->
            <g class="river-ripples" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" opacity="0.45" fill="none">
              <path d="M 110 475 Q 140 470 170 475"/>
              <path d="M 280 435 Q 315 430 350 436"/>
              <path d="M 520 345 Q 555 340 590 346"/>
              <path d="M 740 375 Q 770 370 800 376"/>
              <path d="M 880 255 Q 900 250 920 256"/>
            </g>

            <!-- Ribera Inferior / Sur con vegetación, piedras y flores -->
            <path d="M 0 495 C 100 500, 180 508, 260 520 L 0 520 Z" fill="#047857"/>

            <!-- 5. TRAYECTO GUÍA DE NAVEGACIÓN (Ruta con trazos punteados de calma) -->
            <g id="m3-trails-group">
              <!-- Segmentos de navegación -->
              <path id="trail-seg-0" d="M 80 455 C 120 455, 150 430, 200 410" class="m3-nav-line" stroke="#A7F3D0" stroke-width="4" stroke-dasharray="6 6" fill="none" opacity="0.8"/>
              <path id="trail-seg-1" d="M 200 410 C 270 390, 330 365, 430 325" class="m3-nav-line" stroke="#A7F3D0" stroke-width="4" stroke-dasharray="6 6" fill="none" opacity="0.8"/>
              <path id="trail-seg-2" d="M 430 325 C 500 290, 580 320, 670 335" class="m3-nav-line" stroke="#A7F3D0" stroke-width="4" stroke-dasharray="6 6" fill="none" opacity="0.8"/>
              <path id="trail-seg-3" d="M 670 335 C 740 345, 770 275, 820 220" class="m3-nav-line" stroke="#A7F3D0" stroke-width="4" stroke-dasharray="6 6" fill="none" opacity="0.8"/>
              <path id="trail-seg-4" d="M 820 220 C 855 175, 875 135, 905 95"  class="m3-nav-line" stroke="#A7F3D0" stroke-width="4" stroke-dasharray="6 6" fill="none" opacity="0.8"/>
            </g>

            <!-- 6. MUELLES Y ELEMENTOS ESCÉNICOS TEMÁTICOS -->
            
            <!-- Muelle 1: Señales del cuerpo (Muelle de madera rústica y boya reflectora) -->
            <g id="dock-1" transform="translate(180, 400)">
              <!-- Postes y tablas de madera -->
              <rect x="-24" y="-8" width="48" height="18" rx="4" fill="#78350F" stroke="#451A03" stroke-width="1.5"/>
              <line x1="-16" y1="-8" x2="-16" y2="10" stroke="#5C2C16" stroke-width="2"/>
              <line x1="16" y1="-8" x2="16" y2="10" stroke="#5C2C16" stroke-width="2"/>
              <!-- Farolillo cálido -->
              <circle cx="-16" cy="-14" r="5" fill="#FEF08A" filter="url(#r-glow)"/>
              <circle cx="-16" cy="-14" r="2.5" fill="#FFFFFF"/>
            </g>

            <!-- Muelle 2: Flor de Loto de Respiración Consciente (Pulsación rítmica) -->
            <g id="dock-2" transform="translate(415, 315)">
              <ellipse cx="0" cy="10" rx="28" ry="12" fill="#065F46" opacity="0.6"/>
              <!-- Hoja de loto -->
              <ellipse cx="0" cy="6" rx="22" ry="8" fill="#10B981"/>
              <!-- Flor de loto con pulsación 4-2-6 -->
              <g class="m3-breathing-lotus">
                <path d="M 0 -12 C -8 -4, -12 4, 0 8 C 12 4, 8 -4, 0 -12 Z" fill="#F472B6"/>
                <path d="M -7 -4 C -14 0, -12 6, 0 8 Z" fill="#FBCFE8"/>
                <path d="M 7 -4 C 14 0, 12 6, 0 8 Z" fill="#FBCFE8"/>
                <circle cx="0" cy="0" r="3.5" fill="#FEF08A" filter="url(#r-glow)"/>
              </g>
            </g>

            <!-- Muelle 3: Isla y Semáforo Emocional -->
            <g id="dock-3" transform="translate(650, 325)">
              <ellipse cx="0" cy="12" rx="30" ry="14" fill="#047857"/>
              <rect x="-6" y="-30" width="12" height="34" rx="3" fill="#1E293B"/>
              <!-- 3 Luces del semáforo: Rojo, Amarillo, Verde -->
              <circle cx="0" cy="-22" r="3.2" fill="#EF4444" filter="url(#r-glow)"/>
              <circle cx="0" cy="-14" r="3.2" fill="#F59E0B" filter="url(#r-glow)"/>
              <circle cx="0" cy="-6"  r="3.2" fill="#10B981" filter="url(#r-glow)"/>
            </g>

            <!-- Muelle 4: Jardín Sensorial y Cofre de Herramientas -->
            <g id="dock-4" transform="translate(805, 210)">
              <ellipse cx="0" cy="10" rx="26" ry="12" fill="#047857"/>
              <!-- Cofre dorado de herramientas -->
              <rect x="-10" y="-8" width="20" height="14" rx="3" fill="#D97706" stroke="#78350F" stroke-width="1.2"/>
              <path d="M -10 -4 L 10 -4" stroke="#FBBF24" stroke-width="1.8"/>
              <circle cx="0" cy="-1" r="2" fill="#FEF08A" filter="url(#r-glow)"/>
            </g>

            <!-- Cierre: Gran Faro de Bienestar Universitario TdeA -->
            <g id="dock-5" transform="translate(895, 80)">
              <!-- Base rocosa -->
              <ellipse cx="0" cy="20" rx="36" ry="14" fill="#022B14"/>
              <!-- Torre del faro -->
              <polygon points="-12,20 12,20 8,-35 -8,-35" fill="#FFFFFF" stroke="#00843D" stroke-width="2"/>
              <polygon points="-11,5 11,5 10,-8 -10,-8" fill="#00843D"/>
              <!-- Cúpula y linterna del faro -->
              <rect x="-10" y="-45" width="20" height="10" rx="2" fill="#FEF08A" filter="url(#r-glow)"/>
              <path d="M -12 -45 L 0 -58 L 12 -45 Z" fill="#005A29"/>
              <!-- Bandera TdeA -->
              <line x1="0" y1="-58" x2="0" y2="-72" stroke="#475569" stroke-width="2"/>
              <polygon points="0,-72 18,-66 0,-60" fill="#74D633"/>
              <!-- Haz de luz giratorio del faro -->
              <polygon points="0,-40 180,-10 160,-70" fill="url(#r-sun)" opacity="0.45" class="m3-lighthouse-beam"/>
            </g>

            <!-- 7. HITOS INTERACTIVOS (WAYPOINTS CLICABLES EN EL MAPA) -->
            <g id="m3-interactive-milestones">
              
              <!-- HITO 1: PAUSA 1 -->
              <g class="m3-map-waypoint ${this.p1Done ? 'is-completed' : (activePausaNum === 1 ? 'is-active' : 'is-locked')}" id="wp-node-1" transform="translate(200, 410)" role="button" tabindex="0" aria-label="Pausa 1: Reconociendo las señales de mi cuerpo">
                <circle cx="0" cy="0" r="26" class="wp-pulse-ring" fill="none" stroke="#10B981" stroke-width="2"/>
                <circle cx="0" cy="0" r="20" class="wp-bg-circle"/>
                <text x="0" y="7" text-anchor="middle" class="wp-num-text">${this.p1Done ? '✓' : '1'}</text>
                <!-- Cartel de texto flotante -->
                <g class="wp-label-group" transform="translate(0, 36)">
                  <rect x="-65" y="-12" width="130" height="24" rx="12" class="wp-label-bg"/>
                  <text x="0" y="4" text-anchor="middle" class="wp-label-title">Pausa 1 · Cuerpo</text>
                </g>
              </g>

              <!-- HITO 2: PAUSA 2 -->
              <g class="m3-map-waypoint ${this.p2Done ? 'is-completed' : (this.p1Done ? 'is-active' : 'is-locked')}" id="wp-node-2" transform="translate(430, 325)" role="button" tabindex="0" aria-label="Pausa 2: Respirar para volver a la calma">
                <circle cx="0" cy="0" r="26" class="wp-pulse-ring" fill="none" stroke="#10B981" stroke-width="2"/>
                <circle cx="0" cy="0" r="20" class="wp-bg-circle"/>
                <text x="0" y="7" text-anchor="middle" class="wp-num-text">${this.p2Done ? '✓' : (this.p1Done ? '2' : '🔒')}</text>
                <g class="wp-label-group" transform="translate(0, 36)">
                  <rect x="-65" y="-12" width="130" height="24" rx="12" class="wp-label-bg"/>
                  <text x="0" y="4" text-anchor="middle" class="wp-label-title">Pausa 2 · Respirar</text>
                </g>
              </g>

              <!-- HITO 3: PAUSA 3 -->
              <g class="m3-map-waypoint ${this.p3Done ? 'is-completed' : (this.p2Done ? 'is-active' : 'is-locked')}" id="wp-node-3" transform="translate(670, 335)" role="button" tabindex="0" aria-label="Pausa 3: Haciendo una pausa consciente">
                <circle cx="0" cy="0" r="26" class="wp-pulse-ring" fill="none" stroke="#10B981" stroke-width="2"/>
                <circle cx="0" cy="0" r="20" class="wp-bg-circle"/>
                <text x="0" y="7" text-anchor="middle" class="wp-num-text">${this.p3Done ? '✓' : (this.p2Done ? '3' : '🔒')}</text>
                <g class="wp-label-group" transform="translate(0, 36)">
                  <rect x="-68" y="-12" width="136" height="24" rx="12" class="wp-label-bg"/>
                  <text x="0" y="4" text-anchor="middle" class="wp-label-title">Pausa 3 · Semáforo</text>
                </g>
              </g>

              <!-- HITO 4: PAUSA 4 -->
              <g class="m3-map-waypoint ${this.p4Done ? 'is-completed' : (this.p3Done ? 'is-active' : 'is-locked')}" id="wp-node-4" transform="translate(820, 220)" role="button" tabindex="0" aria-label="Pausa 4: Volviendo al presente y Caja de herramientas">
                <circle cx="0" cy="0" r="26" class="wp-pulse-ring" fill="none" stroke="#10B981" stroke-width="2"/>
                <circle cx="0" cy="0" r="20" class="wp-bg-circle"/>
                <text x="0" y="7" text-anchor="middle" class="wp-num-text">${this.p4Done ? '✓' : (this.p3Done ? '4' : '🔒')}</text>
                <g class="wp-label-group" transform="translate(0, 36)">
                  <rect x="-70" y="-12" width="140" height="24" rx="12" class="wp-label-bg"/>
                  <text x="0" y="4" text-anchor="middle" class="wp-label-title">Pausa 4 · Presente</text>
                </g>
              </g>

              <!-- HITO 5: CIERRE GENERAL -->
              <g class="m3-map-waypoint ${allDone ? 'is-active' : 'is-locked'}" id="wp-node-cierre" transform="translate(905, 95)" role="button" tabindex="0" aria-label="Cierre General del Módulo 3">
                <circle cx="0" cy="0" r="28" class="wp-pulse-ring" fill="none" stroke="#F59E0B" stroke-width="2.5"/>
                <circle cx="0" cy="0" r="22" class="wp-bg-circle wp-cierre-bg"/>
                <text x="0" y="7" text-anchor="middle" class="wp-num-text wp-cierre-text">${allDone ? '🏆' : '🔒'}</text>
                <g class="wp-label-group" transform="translate(0, 36)">
                  <rect x="-65" y="-12" width="130" height="24" rx="12" class="wp-label-bg"/>
                  <text x="0" y="4" text-anchor="middle" class="wp-label-title">Cierre General</text>
                </g>
              </g>

            </g>

            <!-- 8. EL BOTE NAVEGANTE Y LA MASCOTA ROBOT TdeA (CON FÍSICAS DE FLOTABILIDAD) -->
            <g id="m3-robot-vessel" transform="translate(${this.boatX}, ${this.boatY})">
              
              <!-- Estela de agua y ondas debajo del bote -->
              <g class="m3-boat-wake" opacity="0.5" stroke="#FFFFFF" stroke-width="1.8" fill="none">
                <ellipse cx="-18" cy="18" rx="16" ry="5"/>
                <ellipse cx="14" cy="18" rx="14" ry="4"/>
              </g>

              <!-- Grupo móvil del bote que cabecea suavemente con el agua -->
              <g id="m3-boat-float-group" class="m3-boat-bobbing">
                
                <!-- Casco del Bote Ecológico TdeA -->
                <path d="M -42 12 Q -48 6 -38 0 L 36 0 Q 52 4 48 12 Q 22 22 -14 20 Q -34 18 -42 12 Z" fill="url(#r-boat-hull)"/>
                <path d="M -36 0 L 36 0 Q 42 2 40 4 L -34 4 Z" fill="url(#r-gold-trim)"/>
                <ellipse cx="0" cy="3" rx="34" ry="5" fill="url(#r-boat-deck)"/>

                <!-- Mascota Robot Sentada en el Bote Guiando el Viaje -->
                <g id="m3-robot-figure" transform="translate(0, -6)">
                  <!-- Torso y Pecho con Escudo TdeA -->
                  <path d="M -15 -20 Q -18 -4 -9 4 Q 0 8 9 4 Q 18 -4 15 -20 Z" fill="#00843D"/>
                  <ellipse cx="0" cy="-8" rx="9" ry="7" fill="#FFFFFF"/>
                  <path d="M 0 -2 C -5 -6 -4 -11 0 -9 C 4 -11 5 -6 0 -2 Z" fill="#2C9A68"/>

                  <!-- Brazo Izquierdo con Remo de Calma -->
                  <g transform="translate(-14, -14)">
                    <rect x="-3" y="-2" width="6" height="16" rx="3" fill="#FFFFFF"/>
                    <!-- Vara del remo hacia el agua -->
                    <line x1="-2" y1="8" x2="-22" y2="28" stroke="#78350F" stroke-width="2.5" stroke-linecap="round"/>
                    <ellipse cx="-23" cy="29" rx="5" ry="8" fill="#B45309" transform="rotate(-30, -23, 29)"/>
                  </g>

                  <!-- Brazo Derecho Saludando -->
                  <g transform="translate(14, -14)">
                    <rect x="-3" y="-2" width="6" height="16" rx="3" fill="#FFFFFF"/>
                  </g>

                  <!-- Cuello -->
                  <rect x="-5" y="-26" width="10" height="6" rx="2" fill="#022B14"/>

                  <!-- Cabeza y Visor LED Brillante -->
                  <g transform="translate(0, -42)">
                    <!-- Auriculares Verdes -->
                    <path d="M -24 -8 Q -24 -24 0 -24 Q 24 -24 24 -8" stroke="#74D633" stroke-width="3" fill="none"/>
                    <ellipse cx="-25" cy="-2" rx="4.5" ry="7.5" fill="#74D633"/>
                    <ellipse cx="25" cy="-2" rx="4.5" ry="7.5" fill="#74D633"/>
                    <!-- Carcasa Blanca -->
                    <rect x="-23" y="-20" width="46" height="40" rx="18" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
                    <!-- Pantalla Visor Verde Oscuro -->
                    <rect x="-19" y="-15" width="38" height="28" rx="13" fill="#022B14"/>
                    <!-- Ojos LED Felices y Luminosos -->
                    <g filter="url(#r-glow)">
                      <path d="M -12 2 Q -8 -6 -4 2 M 4 2 Q 8 -6 12 2" stroke="#74D633" stroke-width="2.8" fill="none" stroke-linecap="round"/>
                    </g>
                    <!-- Birrete Institucional TdeA -->
                    <path d="M -30 -24 L 0 -36 L 30 -24 L 0 -14 Z" fill="#00843D"/>
                    <path d="M -16 -20 V -14 Q 0 -7 16 -14 V -20 L 0 -14 Z" fill="#005A29"/>
                    <circle cx="0" cy="-25" r="2" fill="#F59E0B"/>
                    <path d="M 0 -25 Q 18 -32 26 -24 L 27 -16" stroke="#F59E0B" stroke-width="1.5" fill="none"/>
                    <rect x="25" y="-16" width="4" height="8" rx="2" fill="#F59E0B"/>
                  </g>
                </g>

                <!-- Bocadillo de Diálogo Dinámico sobre la Mascota -->
                <g id="m3-dialogue-bubble" transform="translate(0, -118)">
                  <rect id="m3-bubble-rect" x="-110" y="-18" width="220" height="38" rx="12" fill="#FFFFFF" stroke="#00843D" stroke-width="2" filter="drop-shadow(0 4px 12px rgba(0,0,0,0.15))"/>
                  <polygon points="-8,20 8,20 0,28" fill="#FFFFFF"/>
                  <polygon points="-8,20 0,28 8,20" stroke="#00843D" stroke-width="2" fill="#FFFFFF"/>
                  <text id="m3-bubble-text" x="0" y="4" text-anchor="middle" font-size="11" font-weight="800" fill="#022B14">
                    ¡Comencemos escuchando a nuestro cuerpo!
                  </text>
                </g>

              </g>
            </g>

            <!-- Contenedor para Confeti y Destellos de Victoria -->
            <g id="m3-confetti-container"></g>
          </svg>
        </div>

        <!-- 3. BARRA DE INTERACCIÓN Y BOTÓN DE ACCIÓN PROMINENTE (ESTILO MÓDULO 1) -->
        <div class="mod3-scene-action-bar">
          <div class="mod3-scene-action-left">
            <span class="mod3-active-pausa-badge" id="m3-active-pill">
              PAUSA ${activePausaNum <= 4 ? activePausaNum : 'CIERRE'}
            </span>
            <div class="mod3-active-pausa-info">
              <strong id="m3-active-title" style="color: #022B14; font-size: 1.05rem; display: block;">
                ${this.WAYPOINTS[activePausaNum].title}
              </strong>
              <span id="m3-active-desc" style="color: #475569; font-size: 0.88rem;">
                ${activePausaNum === 1 ? 'Explora tus sensaciones somáticas con el Escáner Corporal.' : 
                  (activePausaNum === 2 ? 'Regula tu respiración con la técnica visual 4-2-6.' : 
                  (activePausaNum === 3 ? 'Aplica el Semáforo Emocional ante la ansiedad.' : 
                  (activePausaNum === 4 ? 'Conecta con los 5 sentidos y arma tu caja de herramientas.' : 
                  '¡Has culminado las 4 pausas! Reclama tu certificación institucional.')))}
              </span>
            </div>
          </div>

          <div class="mod3-scene-action-right">
            <button type="button" class="lc-btn lc-btn-primary mod3-btn-embark animate-pulse" id="m3-btn-scene-action" style="padding: 0.95rem 2.4rem; font-size: 1.08rem; font-weight: 800; background: #00843D; box-shadow: 0 4px 18px rgba(0, 132, 61, 0.35);">
              <span>${activePausaNum <= 4 ? `▶ Iniciar Pausa ${activePausaNum}` : '🏆 Acceder al Cierre General'}</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

      </div>
    `;

    this.bindEvents();
    this.startJourneySequence();
  }

  bindEvents() {
    // 1. Audio Voz en off institucional
    const audioEl = this.container.querySelector('#mod3-scene-voiceover-audio');
    const btnAudio = this.container.querySelector('#btn-scene-audio-toggle');
    const audioIcon = this.container.querySelector('#scene-audio-icon');
    const audioText = this.container.querySelector('#scene-audio-text');
    const soundwave = this.container.querySelector('#mod3-soundwave');

    if (btnAudio && audioEl) {
      btnAudio.addEventListener('click', () => {
        if (audioEl.paused) {
          audioEl.play().catch(() => {});
          if (audioIcon) audioIcon.textContent = '⏸';
          if (audioText) audioText.textContent = 'Pausar locución';
          if (soundwave) soundwave.style.display = 'inline-flex';
        } else {
          audioEl.pause();
          if (audioIcon) audioIcon.textContent = '▶';
          if (audioText) audioText.textContent = 'Escuchar voz en off';
          if (soundwave) soundwave.style.display = 'none';
        }
      });

      audioEl.addEventListener('ended', () => {
        if (audioIcon) audioIcon.textContent = '▶';
        if (audioText) audioText.textContent = 'Escuchar voz en off';
        if (soundwave) soundwave.style.display = 'none';
      });
    }

    // 2. Transcripción DUA
    const btnTrans = this.container.querySelector('#btn-scene-transcript-toggle');
    const transBox = this.container.querySelector('#mod3-scene-transcript');
    const btnCloseTrans = this.container.querySelector('#btn-close-scene-transcript-x');

    if (btnTrans && transBox) {
      btnTrans.addEventListener('click', () => {
        const isShown = transBox.style.display !== 'none';
        transBox.style.display = isShown ? 'none' : 'block';
      });
    }
    if (btnCloseTrans && transBox) {
      btnCloseTrans.addEventListener('click', () => {
        transBox.style.display = 'none';
      });
    }

    // 3. Reiniciar visualmente el recorrido
    const btnReset = this.container.querySelector('#btn-scene-reset-journey');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (this.onResetJourney) {
          this.onResetJourney();
        } else {
          this.tok++;
          this.startJourneySequence(true);
        }
      });
    }

    // 4. Clics en los waypoints / hitos del mapa
    const wp1 = this.container.querySelector('#wp-node-1');
    const wp2 = this.container.querySelector('#wp-node-2');
    const wp3 = this.container.querySelector('#wp-node-3');
    const wp4 = this.container.querySelector('#wp-node-4');
    const wpC = this.container.querySelector('#wp-node-cierre');

    if (wp1) wp1.addEventListener('click', () => this.onSelectPausa(1));
    if (wp2) {
      wp2.addEventListener('click', () => {
        if (this.p1Done) this.onSelectPausa(2);
      });
    }
    if (wp3) {
      wp3.addEventListener('click', () => {
        if (this.p2Done) this.onSelectPausa(3);
      });
    }
    if (wp4) {
      wp4.addEventListener('click', () => {
        if (this.p3Done) this.onSelectPausa(4);
      });
    }
    if (wpC) {
      wpC.addEventListener('click', () => {
        if (this.p1Done && this.p2Done && this.p3Done && this.p4Done) {
          this.onSelectCierre();
        }
      });
    }

    // 5. Botón de acción principal
    const btnAction = this.container.querySelector('#m3-btn-scene-action');
    if (btnAction) {
      btnAction.addEventListener('click', () => {
        if (!this.p1Done) this.onSelectPausa(1);
        else if (!this.p2Done) this.onSelectPausa(2);
        else if (!this.p3Done) this.onSelectPausa(3);
        else if (!this.p4Done) this.onSelectPausa(4);
        else this.onSelectCierre();
      });
    }
  }

  setBubbleText(text) {
    const bubble = this.container.querySelector('#m3-bubble-text');
    const rect = this.container.querySelector('#m3-bubble-rect');
    if (bubble) {
      bubble.textContent = text;
      const len = text.length;
      const w = Math.max(160, Math.min(340, len * 7.5));
      if (rect) {
        rect.setAttribute('x', (-w / 2).toFixed(1));
        rect.setAttribute('width', w.toFixed(1));
      }
    }
  }

  putBoat(x, y, angle = 0) {
    this.boatX = x;
    this.boatY = y;
    this.boatAngle = angle;
    const vessel = this.container.querySelector('#m3-robot-vessel');
    if (vessel) {
      vessel.setAttribute('transform', `translate(${x.toFixed(1)}, ${y.toFixed(1)}) rotate(${angle.toFixed(1)})`);
    }
  }

  async sailAlong(segmentKey, speed = 55) {
    return new Promise((resolve) => {
      const myTok = ++this.tok;
      const pathD = this.SEG[segmentKey];
      if (!pathD) return resolve(false);

      // Crear elemento path SVG temporal para calcular coordenadas
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathD);
      const L = path.getTotalLength();
      const dur = (L / speed) * 1000;
      const t0 = performance.now();

      const step = (now) => {
        if (myTok !== this.tok) return resolve(false);
        const p = Math.min(1, (now - t0) / dur);
        // Easing suave (ease-in-out)
        const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
        const pt = path.getPointAtLength(ease * L);
        const nextPt = path.getPointAtLength(Math.min(L, ease * L + 3));
        const angle = Math.atan2(nextPt.y - pt.y, nextPt.x - pt.x) * (180 / Math.PI);

        this.putBoat(pt.x, pt.y, angle * 0.4);

        if (p < 1) {
          this.raf = requestAnimationFrame(step);
        } else {
          this.putBoat(pt.x, pt.y, 0);
          resolve(true);
        }
      };

      this.raf = requestAnimationFrame(step);
    });
  }

  confetti(x, y, n = 32) {
    const conf = this.container.querySelector('#m3-confetti-container');
    if (!conf) return;
    conf.innerHTML = '';
    const cols = ['#10B981', '#74D633', '#F59E0B', '#38BDF8', '#FFFFFF', '#F472B6'];
    for (let i = 0; i < n; i++) {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x);
      rect.setAttribute('y', y);
      rect.setAttribute('width', (Math.random() * 6 + 4).toFixed(1));
      rect.setAttribute('height', (Math.random() * 8 + 5).toFixed(1));
      rect.setAttribute('rx', '2');
      rect.setAttribute('fill', cols[Math.floor(Math.random() * cols.length)]);
      
      const vx = (Math.random() - 0.5) * 180;
      const vy = -(Math.random() * 110 + 40);
      rect.style.transition = 'transform 1.1s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.1s ease';
      rect.style.transformOrigin = `${x}px ${y}px`;
      conf.appendChild(rect);

      requestAnimationFrame(() => {
        rect.style.transform = `translate(${vx}px, ${vy + 60}px) rotate(${Math.random() * 360}deg)`;
        rect.style.opacity = '0';
      });
    }
  }

  async startJourneySequence(isReplay = false) {
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    if (isReplay || !this.p1Done) {
      // Estado Inicial: Navegando hacia Pausa 1
      this.putBoat(80, 455, 0);
      this.setBubbleText('¡Hola! Naveguemos hacia la Pausa 1: Señales del cuerpo.');
      await sleep(500);
      await this.sailAlong('P0_P1', 65);
      this.setBubbleText('¡Llegamos a la Pausa 1! Observa cómo responde tu cuerpo.');
      this.confetti(200, 410, 18);
    } else if (this.p1Done && !this.p2Done) {
      // De Pausa 1 a Pausa 2
      this.putBoat(200, 410, 0);
      this.setBubbleText('¡Pausa 1 lista! Naveguemos a la Pausa 2 para respirar.');
      await sleep(400);
      await this.sailAlong('P1_P2', 65);
      this.setBubbleText('¡Pausa 2 desbloqueada! Practiquemos la respiración 4-2-6.');
      this.confetti(430, 325, 24);
    } else if (this.p2Done && !this.p3Done) {
      // De Pausa 2 a Pausa 3
      this.putBoat(430, 325, 0);
      this.setBubbleText('¡Excelente respiración! Navegando hacia la Pausa 3...');
      await sleep(400);
      await this.sailAlong('P2_P3', 65);
      this.setBubbleText('¡Llegamos al Semáforo! Me detengo, Observo y Elijo.');
      this.confetti(670, 335, 24);
    } else if (this.p3Done && !this.p4Done) {
      // De Pausa 3 a Pausa 4
      this.putBoat(670, 335, 0);
      this.setBubbleText('¡Gran análisis! Naveguemos a la Pausa 4 y Caja de Herramientas.');
      await sleep(400);
      await this.sailAlong('P3_P4', 65);
      this.setBubbleText('¡Pausa 4 lista! Conecta con los 5 sentidos y guarda tus herramientas.');
      this.confetti(820, 220, 26);
    } else {
      // Todas completadas -> Cierre General
      this.putBoat(820, 220, 0);
      this.setBubbleText('¡Misión cumplida! Llegando al Faro de Bienestar y Reconocimiento.');
      await sleep(400);
      await this.sailAlong('P4_C', 55);
      this.setBubbleText('🌟 ¡Felicitaciones! Has completado el viaje del Módulo 3.');
      this.confetti(905, 95, 45);
    }
  }
}
