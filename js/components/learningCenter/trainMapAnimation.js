/**
 * Animación Interactiva del Tren y Mapa Panorámico de las 3 Estaciones
 * Campus Vital 2026 - Centro de Aprendizaje "TdeA Contigo"
 * Tecnológico de Antioquia - Institución Universitaria
 * 
 * Reestructuración Absoluta de UI/UX (Directiva de Expansión y Atmósfera):
 * 1. Contenedor Expansivo al 100% de Ancho y 620px de Altura Útil.
 * 2. Cero etiquetas técnicas 'E-1, E-2, E-3' y 'Km 0, Km 5, Km 10'.
 * 3. Botón de navegación: '⏩ Ir a Estación Actual'.
 * 4. Nombres conceptuales limpios: 'Conocer el terreno', 'Cuando el camino cambia', 'Viajar acompañado'.
 * 5. Escenario Andino Vectorial Orgánico y Realista (perspectiva atmosférica del Valle de Aburrá).
 * 6. Tren 2.5D ampliado con avatar grande del Robot Mascota TdeA conduciendo en la cabina panorámica.
 * 7. Ruedas en contacto físico directo al milímetro con los rieles.
 */

export class TrainMapAnimation {
  constructor(options = {}) {
    this.container = options.container || null;
    this.currentStation = options.currentStation !== undefined ? Number(options.currentStation) : 1;
    this.autoStart = options.autoStart ?? true;
    this.s1Done = Boolean(options.s1Done);
    this.s2Done = Boolean(options.s2Done);
    this.s3Done = Boolean(options.s3Done);
    this.onSelectStation = options.onSelectStation || (() => {});
    this.onResetJourney = options.onResetJourney || null;
    
    this.audioEl = null;
    this.isPlayingIntro = options.isPlayingIntro ?? true;
    this.showIntroArrival = !this.s1Done && (options.showIntroArrival !== false);
    this.arrivalFinished = !this.showIntroArrival;
    this.introTimeline = null;
    this.synthAudioContext = null;
    this.synthIsPlaying = false;
  }

  /**
   * Renderiza el componente completo integrado en la página del asistente
   */
  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="train-experience-root animate-fade-in" id="train-experience-wrapper">
        
        <!-- ===================================================================
             1. HEADER CON CONTENEDOR FLEXIBLE Y ESPACIADO LIMPIO (GAP: 16PX)
             =================================================================== -->
        <header class="train-top-control-bar">
          <div class="train-control-left">
            <span class="train-badge-pill">
              <span>🌱</span>
              <span>CAMPUS VITAL TdeA · RUTA DE BIENESTAR</span>
            </span>
            <div class="train-status-wrap">
              <span class="train-status-text" id="train-global-status">
                ${!this.s1Done 
                  ? (this.showIntroArrival ? '🚂 El Expreso Campus Vital inicia su marcha hacia: Conocer el terreno...' : '📍 Parada actual: Conocer el terreno') 
                  : (!this.s2Done 
                    ? '📍 Parada actual: Cuando el camino cambia' 
                    : (!this.s3Done 
                      ? '📍 Parada final: Viajar acompañado'
                      : '🏆 ¡Recorrido completado! Has preparado tu equipaje universitario.')
                  )
                }
              </span>
            </div>
          </div>

          <!-- Controles de Audio y Navegación en Contenedor Flexible (16px de separación limpia) -->
          <div class="train-audio-mini-player">
            <audio id="train-voiceover-audio" preload="auto">
              <source src="assets/campusVital/audio/narracion_intro.mp3" type="audio/mpeg">
              <source src="assets/campusVital/audio/bienvenida_estaciones.mp3" type="audio/mpeg">
            </audio>

            <button type="button" class="train-btn-action train-btn-audio" id="btn-train-audio-toggle" aria-label="Control de Voz en Off">
              <span class="train-soundwave" id="train-soundwave" style="display: none;">
                <span class="bar bar-1"></span>
                <span class="bar bar-2"></span>
                <span class="bar bar-3"></span>
                <span class="bar bar-4"></span>
              </span>
              <span id="train-audio-icon">▶</span>
              <span id="train-audio-text">Escuchar voz en off</span>
            </button>

            <button type="button" class="train-btn-action train-btn-skip" id="btn-skip-cinematic" title="Avanzar de inmediato a la estación actual" style="${!this.showIntroArrival ? 'display: none;' : ''}">
              <span>⏩ Ir a Estación Actual</span>
            </button>

            <button type="button" class="train-btn-action train-btn-transcript" id="btn-train-transcript-toggle" title="Leer transcripción accesible DUA">
              <span>📝 Transcripción</span>
            </button>

            <button type="button" class="train-btn-action train-btn-reset" id="btn-train-reset-journey" title="Reiniciar el recorrido desde el inicio">
              <span>🔄 Reiniciar</span>
            </button>
          </div>
        </header>

        <!-- Transcripción Accesible Oficial (DUA) -->
        <div id="train-voiceover-transcript" class="train-transcript-card" style="display: none;" role="region" aria-label="Transcripción oficial">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <strong style="color: var(--journey-primary-dark); font-size: 0.92rem;">🎙️ Narración en off (Transcripción accesible oficial DUA):</strong>
            <button type="button" id="btn-close-transcript-x" style="background: none; border: none; cursor: pointer; font-size: 1.2rem; color: #64748B;">&times;</button>
          </div>
          <p style="margin: 0; line-height: 1.6; color: #334155;">
            "¡Bienvenido(a) a Campus Vital y al Módulo 1 de este viaje! La universidad es mucho más que asistir a clases. Es un espacio donde también aprendemos sobre nosotros mismos, construimos relaciones, enfrentamos desafíos y descubrimos nuevas capacidades. Durante este recorrido conocerás herramientas que podrán acompañarte cuando el camino parezca difícil. No buscamos que tengas respuestas perfectas, sino recursos para cuidarte mientras avanzas. Exploraremos tres paradas fundamentales: Conocer el terreno, Cuando el camino cambia y Viajar acompañado. Descúbrelas:"
          </p>
        </div>

        <!-- ===================================================================
             2. ESCENARIO VECTORIAL NÍTIDO EXPANDIDO A 620PX (ATMÓSFERA ORGÁNICA)
             =================================================================== -->
        <div class="train-stage-viewport" id="train-stage-viewport">
          <div class="camera-zoom-stage" id="camera-zoom-stage">
            <!-- ===================================================================
                 [CAPA DE FONDO DEDICADA: PRADERA / CÓDIGO HTML PERSONALIZADO]
                 z-index: 1 | Posicionamiento absoluto para inserción directa de HTML
                 =================================================================== -->
            <div id="custom-meadow-background" class="custom-meadow-background" aria-hidden="true">
              <iframe src="Pradera.html" class="pradera-bg-iframe" title="Fondo Pradera" frameborder="0" scrolling="no" tabindex="-1"></iframe>
            </div>

            <!-- ===================================================================
                 [DEFS GLOBALES: FILTRO DE ILUSTRACIÓN EDITORIAL Y GRADIENTES DE VOLUMEN]
                 =================================================================== -->
            <svg width="0" height="0" style="position: absolute; pointer-events: none;" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <!-- Filtro de trazo organico / pulso a mano (editorial de Pradera.html) -->
                <filter id="rough" x="-10%" y="-10%" width="120%" height="120%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="3" result="n"/>
                  <feDisplacementMap in="SourceGraphic" in2="n" scale="2.8"/>
                  <feGaussianBlur stdDeviation="0.25"/>
                </filter>

                <!-- Gradientes de volumen editorial para tren y edificios -->
                <linearGradient id="editorial-train-body" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#15803D"/>
                  <stop offset="25%" stop-color="#00843D"/>
                  <stop offset="70%" stop-color="#005A29"/>
                  <stop offset="100%" stop-color="#022B14"/>
                </linearGradient>

                <linearGradient id="editorial-gold-trim" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#FEF08A"/>
                  <stop offset="45%" stop-color="#F59E0B"/>
                  <stop offset="100%" stop-color="#B45309"/>
                </linearGradient>

                <linearGradient id="editorial-headlight-cone" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#FEF08A" stop-opacity="0.9"/>
                  <stop offset="35%" stop-color="#FEF9C3" stop-opacity="0.45"/>
                  <stop offset="100%" stop-color="#FEF9C3" stop-opacity="0"/>
                </linearGradient>

                <linearGradient id="editorial-wood-plank" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#78350F"/>
                  <stop offset="50%" stop-color="#5C2C16"/>
                  <stop offset="100%" stop-color="#451A03"/>
                </linearGradient>

                <linearGradient id="editorial-terracotta-roof" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#C25A38"/>
                  <stop offset="55%" stop-color="#B5694F"/>
                  <stop offset="100%" stop-color="#8C442A"/>
                </linearGradient>

                <linearGradient id="editorial-verdigris-dome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#6EE7B7"/>
                  <stop offset="45%" stop-color="#34D399"/>
                  <stop offset="85%" stop-color="#059669"/>
                  <stop offset="100%" stop-color="#064E3B"/>
                </linearGradient>
              </defs>
            </svg>

            <!-- [CAPA 1: CIELO PASTEL, SOL CÁLIDO Y NUBES SUAVES] -->
            <div class="parallax-bg-far" id="parallax-bg-far">
              <div class="scenic-sun-corona"></div>

              <!-- Nubes vectoriales volumétricas suaves -->
              <div class="parallax-cloud parallax-cloud-1" id="cloud-far-1">
                <svg width="170" height="52" viewBox="0 0 170 52" fill="#FFFFFF">
                  <path d="M22,44 Q28,22 50,24 Q68,8 96,17 Q120,4 142,20 Q164,24 158,44 Z" opacity="0.95"/>
                </svg>
              </div>

              <div class="parallax-cloud parallax-cloud-2" id="cloud-far-2">
                <svg width="200" height="60" viewBox="0 0 200 60" fill="#FFFFFF">
                  <path d="M24,52 Q34,26 60,28 Q80,12 112,20 Q136,6 166,24 Q192,28 184,52 Z" opacity="0.8"/>
                </svg>
              </div>

              <div class="parallax-cloud parallax-cloud-3" id="cloud-far-3">
                <svg width="145" height="46" viewBox="0 0 145 46" fill="#FFFFFF">
                  <path d="M18,38 Q25,18 46,22 Q64,8 88,15 Q108,4 128,18 Q144,22 138,38 Z" opacity="0.9"/>
                </svg>
              </div>

              <!-- Cordillera Andina Realista: Picos recortados con perspectiva atmosférica del Valle de Aburrá -->
              <svg class="distant-mountains-svg" viewBox="0 0 1440 220" preserveAspectRatio="none">
                <defs>
                  <!-- Gradiente para la cordillera más lejana (Niebla periwinkle andina) -->
                  <linearGradient id="grad-andes-far" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#93C5FD" stop-opacity="0.85"/>
                    <stop offset="45%" stop-color="#BAE6FD" stop-opacity="0.65"/>
                    <stop offset="100%" stop-color="#E0F2FE" stop-opacity="0.15"/>
                  </linearGradient>

                  <!-- Gradiente para cordillera intermedia (Verde azulado de bosque de niebla) -->
                  <linearGradient id="grad-andes-mid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#6EE7B7" stop-opacity="0.75"/>
                    <stop offset="50%" stop-color="#34D399" stop-opacity="0.55"/>
                    <stop offset="100%" stop-color="#E8F8F5" stop-opacity="0.1"/>
                  </linearGradient>
                </defs>

                <!-- Cadena montañosa lejana con picos facetados y silueta andina natural -->
                <path d="M 0,160 
                         L 60,135 L 120,150 L 190,110 L 260,130 L 340,95 L 420,125 L 510,80 L 590,115 L 680,70 L 760,105 L 850,60 L 940,98 L 1020,75 L 1110,115 L 1200,85 L 1290,120 L 1370,100 L 1440,135 
                         L 1440,220 L 0,220 Z" 
                      fill="url(#grad-andes-far)"/>

                <!-- Cadena montañosa frontal con crestas y valles orgánicos -->
                <path d="M 0,175 
                         L 80,145 L 160,160 L 240,125 L 320,140 L 410,105 L 500,135 L 600,95 L 700,128 L 790,85 L 890,118 L 980,90 L 1080,125 L 1180,98 L 1270,130 L 1360,110 L 1440,145 
                         L 1440,220 L 0,220 Z" 
                      fill="url(#grad-andes-mid)"/>
              </svg>
            </div>

            <!-- [CAPA 2: LADERAS ANDINAS Y CAMPUS UNIVERSITARIO TdeA] -->
            <div class="parallax-bg-mid" id="parallax-bg-mid">
              <svg class="midground-hills-svg" viewBox="0 0 1440 250" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="grad-hills-lush-1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#10B981"/>
                    <stop offset="40%" stop-color="#059669"/>
                    <stop offset="100%" stop-color="#047857"/>
                  </linearGradient>

                  <linearGradient id="grad-hills-lush-2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#059669"/>
                    <stop offset="50%" stop-color="#047857"/>
                    <stop offset="100%" stop-color="#022B14"/>
                  </linearGradient>
                </defs>

                <!-- Colina media con relieve natural sinuoso -->
                <path d="M 0,130 
                         C 120,95 240,140 380,105 
                         C 520,70 640,120 780,88 
                         C 920,56 1040,115 1180,82 
                         C 1300,55 1380,90 1440,100 
                         L 1440,250 L 0,250 Z" 
                      fill="url(#grad-hills-lush-1)" opacity="0.9"/>

                <!-- Relieve inferior con bosque denso -->
                <path d="M 0,165 
                         C 140,135 280,170 440,130 
                         C 600,90 740,150 900,115 
                         C 1060,80 1200,140 1340,110 
                         C 1390,100 1420,115 1440,125 
                         L 1440,250 L 0,250 Z" 
                      fill="url(#grad-hills-lush-2)"/>

                <!-- Silueta Arquitectónica del Campus TdeA Robledo en la colina -->
                <g transform="translate(680, 52)">
                  <!-- Edificio Académico Central -->
                  <rect x="20" y="38" width="56" height="32" rx="3" fill="#022B14" opacity="0.75"/>
                  <polygon points="14,38 48,18 82,38" fill="#022B14" opacity="0.75"/>
                  
                  <!-- Torre del Reloj del Campus -->
                  <rect x="42" y="6" width="12" height="16" rx="2" fill="#022B14" opacity="0.8"/>
                  <circle cx="48" cy="14" r="3.8" fill="#F59E0B" opacity="0.9"/>
                  <line x1="48" y1="6" x2="48" y2="-4" stroke="#74D633" stroke-width="2"/>
                  <polygon points="48,-4 58, -1 48, 2" fill="#74D633"/>

                  <!-- Ventanas iluminadas de la facultad -->
                  <rect x="28" y="44" width="7" height="9" rx="1.5" fill="#FEF08A" opacity="0.6"/>
                  <rect x="44" y="44" width="7" height="9" rx="1.5" fill="#FEF08A" opacity="0.6"/>
                  <rect x="60" y="44" width="7" height="9" rx="1.5" fill="#FEF08A" opacity="0.6"/>
                </g>

                <!-- Pinos Andinos y cipreses nativos a lo largo de la ladera -->
                <g fill="#022B14" opacity="0.75">
                  <polygon points="120,145 125,120 130,145"/>
                  <polygon points="128,148 134,115 140,148"/>
                  <polygon points="180,158 186,132 192,158"/>
                  <polygon points="420,128 426,100 432,128"/>
                  <polygon points="429,132 435,108 441,132"/>
                  <polygon points="880,124 887,95 894,124"/>
                  <polygon points="891,128 898,102 905,128"/>
                  <polygon points="1120,118 1127,90 1134,118"/>
                  <polygon points="1132,122 1139,96 1146,122"/>
                  <polygon points="1260,132 1266,108 1272,132"/>
                </g>
              </svg>
            </div>

            <!-- [CAPA 3: VEGETACIÓN CERCANA Y GUAYACANES FLORIDOS] -->
            <div class="parallax-bg-near" id="parallax-bg-near">
              <svg class="foreground-trees-svg" viewBox="0 0 1440 135" preserveAspectRatio="none">
                <!-- Árbol Guayacán Amarillo Florido (Parada 1: Conocer el terreno) -->
                <g transform="translate(80, 24)">
                  <rect x="25" y="52" width="8" height="52" rx="2.5" fill="#5C2C16"/>
                  <!-- Copa frondosa dorada -->
                  <path d="M 12 50 C 2 40 8 22 22 20 C 22 8 38 6 48 15 C 60 10 72 22 68 36 C 75 48 58 60 44 56 C 32 62 18 58 12 50 Z" fill="#FACC15" opacity="0.95"/>
                  <circle cx="34" cy="32" r="16" fill="#FDE047" opacity="0.9"/>
                  <circle cx="52" cy="38" r="12" fill="#FEF08A" opacity="0.85"/>
                </g>

                <!-- Árbol Nativo Verde Andino (Parada 2: Cuando el camino cambia) -->
                <g transform="translate(540, 26)">
                  <rect x="24" y="50" width="7" height="52" rx="2.5" fill="#451A03"/>
                  <path d="M 10 50 C 0 38 8 20 24 20 C 26 8 42 8 52 18 C 64 14 74 26 68 40 C 72 52 56 62 42 56 C 28 62 16 56 10 50 Z" fill="#10B981" opacity="0.94"/>
                  <circle cx="34" cy="32" r="15" fill="#34D399" opacity="0.88"/>
                </g>

                <!-- Árbol Guayacán Rosado Florido (Parada 3: Viajar acompañado) -->
                <g transform="translate(1020, 20)">
                  <rect x="26" y="54" width="8" height="54" rx="2.5" fill="#5C2C16"/>
                  <path d="M 14 52 C 4 40 10 22 26 20 C 28 8 46 8 56 18 C 68 14 80 26 74 40 C 80 54 62 64 46 60 C 32 66 18 62 14 52 Z" fill="#F472B6" opacity="0.95"/>
                  <circle cx="38" cy="34" r="17" fill="#F9A8D4" opacity="0.9"/>
                </g>
              </svg>
            </div>

            <!-- ===================================================================
                 [CAPA 4: EDIFICACIONES ARQUITECTÓNICAS DE ESTACIONES REALES]
                 Situadas en el nivel exacto del andén detrás de la vía férrea (bottom: 134px)
                 =================================================================== -->
                        <div class="station-buildings-layer" id="station-buildings-layer">
              
              <!-- EDIFICIO 1: CONOCER EL TERRENO (Arquitectura pastoral andina calida) -->
              <div class="station-building-item ${this.s1Done ? 'is-completed' : 'is-active'}" id="station-building-1" style="left: 18%;">
                <svg class="station-building-svg" viewBox="0 0 280 180" width="280" height="180" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Sombra de contacto en el suelo -->
  <ellipse cx="140" cy="172" rx="126" ry="6" fill="#022B14" opacity="0.25"/>

  <!-- Base de piedra irregular / mamposteria rustica -->
  <g class="station-stone-foundation">
    <path d="M 12,156 Q 140,154 268,156 L 268,170 Q 140,172 12,170 Z" fill="#8B7D6E"/>
    <!-- Piedras individuales con leve variacion tonal -->
    <path d="M 16,158 Q 38,157 60,158 L 59,168 Q 37,169 15,168 Z" fill="#9C8E7F"/>
    <path d="M 64,158 Q 98,157 132,158 L 131,168 Q 97,169 63,168 Z" fill="#786B5D"/>
    <path d="M 136,158 Q 172,157 208,158 L 207,168 Q 171,169 135,168 Z" fill="#9C8E7F"/>
    <path d="M 212,158 Q 238,157 264,158 L 263,168 Q 237,169 211,168 Z" fill="#786B5D"/>
  </g>

  <!-- Anden de madera calida con borde desgastado -->
  <path d="M 8,152 Q 140,150 272,152 L 272,157 Q 140,158 8,157 Z" fill="#5A4636"/>
  <path d="M 10,152 Q 140,151 270,152" stroke="#8C6A5A" stroke-width="1.2" stroke-linecap="round"/>

  <!-- Fachada principal de piedra crema calida (Parchment Cream) -->
  <path d="M 36,66 Q 34,108 35,152 L 245,152 Q 246,108 244,66 Z" fill="#F3EAD7" stroke="#3E6B48" stroke-width="2.2"/>
  
  <!-- Zocalo inferior de la fachada -->
  <path d="M 35,138 Q 140,137 245,138 L 245,152 Q 140,153 35,152 Z" fill="#E6DAC2"/>

  <!-- Sombra propia volumetrica (mitad derecha mas oscura 10%) -->
  <path d="M 140,66 L 244,66 Q 246,108 245,152 L 140,152 Z" fill="#000000" opacity="0.09"/>

  <!-- Alero y Tejado a 4 aguas estilo andino (Terracota editorial calida con curvatura suave) -->
  <!-- Masa principal del tejado -->
  <path d="M 18,68 Q 140,58 262,68 L 246,28 Q 140,18 34,28 Z" fill="url(#editorial-terracotta-roof)" stroke="#6B3222" stroke-width="2.4"/>
  <!-- Sombra propia en la vertiente derecha del tejado -->
  <path d="M 140,23 Q 193,25 246,28 L 262,68 Q 201,63 140,63 Z" fill="#000000" opacity="0.12"/>
  <!-- Lineas de tejas con curvatura organica -->
  <path d="M 52,30 Q 56,48 60,67" stroke="#8C442A" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M 88,26 Q 90,46 94,65" stroke="#8C442A" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M 124,24 Q 125,45 128,64" stroke="#8C442A" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M 156,24 Q 155,45 152,64" stroke="#8C442A" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M 192,26 Q 190,46 186,65" stroke="#8C442A" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M 228,30 Q 224,48 220,67" stroke="#8C442A" stroke-width="1.6" stroke-linecap="round"/>
  <!-- Caballete de coronacion del tejado -->
  <path d="M 34,28 Q 140,18 246,28" stroke="#FFE4D6" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>

  <!-- Sombra arrojada por el alero sobre la fachada -->
  <path d="M 28,68 Q 140,60 252,68 L 246,75 Q 140,67 34,75 Z" fill="#000000" opacity="0.14"/>

  <!-- Buhardilla / Fronton central con el Reloj de Estacion -->
  <path d="M 108,46 Q 140,32 172,46 L 172,66 L 108,66 Z" fill="#F3EAD7" stroke="#3E6B48" stroke-width="2"/>
  <path d="M 102,46 Q 140,30 178,46 L 172,50 Q 140,35 108,50 Z" fill="#B5694F"/>
  <!-- Reloj de estacion redondo con esfera crema -->
  <circle cx="140" cy="53" r="11" fill="#FFFFFF" stroke="#5A4636" stroke-width="2"/>
  <circle cx="140" cy="53" r="8.8" fill="#FEF3C7"/>
  <!-- Agujas del reloj indicando las 10:10 -->
  <line x1="140" y1="53" x2="137" y2="47" stroke="#1E293B" stroke-width="1.6" stroke-linecap="round"/>
  <line x1="140" y1="53" x2="145" y2="55" stroke="#1E293B" stroke-width="1.4" stroke-linecap="round"/>
  <circle cx="140" cy="53" r="1.4" fill="#1E293B"/>

  <!-- Placa Oficial Colgante con Tipografia Limpia -->
  <g class="station-name-sign">
    <!-- Cadenas de forja -->
    <line x1="84" y1="74" x2="84" y2="80" stroke="#334155" stroke-width="1.4"/>
    <line x1="196" y1="74" x2="196" y2="80" stroke="#334155" stroke-width="1.4"/>
    <!-- Placa de madera pintada verde bosque con marco dorado -->
    <rect x="70" y="80" width="140" height="15" rx="5" fill="#022B14" stroke="#F59E0B" stroke-width="1.5"/>
    <text x="140" y="91" fill="#FFFFFF" font-size="7.5" font-weight="bold" font-family="'Nunito', sans-serif" text-anchor="middle" letter-spacing="0.4">CONOCER EL TERRENO</text>
  </g>

  <!-- Marquesina del Anden con soportes de madera tallada -->
  <path d="M 22,86 Q 140,82 258,86 L 250,92 Q 140,88 30,92 Z" fill="#005A29" stroke="#022B14" stroke-width="1.6"/>
  <!-- Columnas y tornapuntas de madera -->
  <path d="M 44,92 L 44,152" stroke="#5A4636" stroke-width="3" stroke-linecap="round"/>
  <path d="M 44,106 Q 52,100 58,92" stroke="#5A4636" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  <path d="M 236,92 L 236,152" stroke="#5A4636" stroke-width="3" stroke-linecap="round"/>
  <path d="M 236,106 Q 228,100 222,92" stroke="#5A4636" stroke-width="2.2" stroke-linecap="round" fill="none"/>

  <!-- Puerta Arqueada con Luz Calida Interior -->
  <path d="M 122,152 L 122,108 Q 140,96 158,108 L 158,152 Z" fill="#022B14"/>
  <path d="M 125,152 L 125,110 Q 140,99 155,110 L 155,152 Z" fill="#1E3A2B"/>
  <path d="M 127,112 Q 140,103 153,112 L 153,130 L 127,130 Z" fill="#FEF08A" opacity="0.9"/>
  <!-- Cuadricula del ventanal de la puerta -->
  <line x1="140" y1="105" x2="140" y2="130" stroke="#022B14" stroke-width="1.2"/>
  <line x1="127" y1="120" x2="153" y2="120" stroke="#022B14" stroke-width="1.2"/>

  <!-- Ventanales Laterales Arqueados con Luz Suave de Candil -->
  <g class="station-window-left">
    <path d="M 56,104 Q 56,92 70,92 Q 84,92 84,104 L 84,136 L 56,136 Z" fill="#FEF08A" stroke="#005A29" stroke-width="1.8"/>
    <line x1="70" y1="92" x2="70" y2="136" stroke="#005A29" stroke-width="1.4"/>
    <line x1="56" y1="116" x2="84" y2="116" stroke="#005A29" stroke-width="1.4"/>
    <!-- Alfeizar de madera -->
    <rect x="53" y="135" width="34" height="4" rx="1.5" fill="#5A4636"/>
  </g>

  <g class="station-window-right">
    <path d="M 196,104 Q 196,92 210,92 Q 224,92 224,104 L 224,136 L 196,136 Z" fill="#FDE68A" stroke="#005A29" stroke-width="1.8"/>
    <!-- Sombra propia suave en ventana derecha -->
    <path d="M 196,104 Q 196,92 210,92 Q 224,92 224,104 L 224,136 L 196,136 Z" fill="#000000" opacity="0.08"/>
    <line x1="210" y1="92" x2="210" y2="136" stroke="#005A29" stroke-width="1.4"/>
    <line x1="196" y1="116" x2="224" y2="116" stroke="#005A29" stroke-width="1.4"/>
    <rect x="193" y="135" width="34" height="4" rx="1.5" fill="#5A4636"/>
  </g>

  <!-- Farol Clasico de Estacion con Halo Calido -->
  <g class="station-lantern-glow">
    <path d="M 38,100 Q 30,98 28,106" stroke="#334155" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="28" cy="108" r="8" fill="#FEF08A" opacity="0.95"/>
    <circle cx="28" cy="108" r="14" fill="#F59E0B" opacity="0.32"/>
    <polygon points="25,102 31,102 28,105" fill="#1E293B"/>
    <rect x="26.5" y="112" width="3" height="2" rx="0.5" fill="#1E293B"/>
  </g>

  <!-- Vegetacion Organica al pie (Arbustos redondeados con flores silvestres de Pradera.html) -->
  <g class="station-footing-flora">
    <!-- Arbusto izquierdo (blobs de follaje) -->
    <path d="M 8,170 Q 14,152 26,154 Q 38,150 48,158 Q 54,166 52,172 Z" fill="#245F38"/>
    <path d="M 12,170 Q 20,156 32,157 Q 42,154 46,165 Z" fill="#3E8456"/>
    <!-- Flores amarillas y blancas salpicadas -->
    <circle cx="22" cy="158" r="2.2" fill="#FFFFFF"/>
    <circle cx="22" cy="158" r="1" fill="#F2C94C"/>
    <circle cx="36" cy="159" r="2.2" fill="#FDE047"/>
    <circle cx="44" cy="164" r="1.8" fill="#FFFFFF"/>

    <!-- Arbusto derecho con flores rosadas y amarillas -->
    <path d="M 226,172 Q 228,154 240,152 Q 254,148 266,158 Q 272,166 270,172 Z" fill="#245F38"/>
    <path d="M 234,171 Q 242,156 252,155 Q 262,154 265,165 Z" fill="#4F8F4F"/>
    <circle cx="242" cy="158" r="2.2" fill="#FFE3EA"/>
    <circle cx="242" cy="158" r="1" fill="#F2C94C"/>
    <circle cx="256" cy="157" r="2" fill="#FFFFFF"/>
    <circle cx="262" cy="162" r="1.8" fill="#FDE047"/>
  </g>
</svg>
              </div>

<!-- EDIFICIO 2: CUANDO EL CAMINO CAMBIA (Chalet de montana con vigas de roble) -->
              <div class="station-building-item ${this.s2Done ? 'is-completed' : (this.s1Done ? 'is-active' : 'is-locked')}" id="station-building-2" style="left: 50%;">
                <svg class="station-building-svg" viewBox="0 0 280 180" width="280" height="180" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Sombra de contacto en el suelo -->
  <ellipse cx="140" cy="172" rx="126" ry="6" fill="#022B14" opacity="0.25"/>

  <!-- Base de mamposteria de rio / piedra rustica irregular -->
  <g class="station-stone-foundation">
    <path d="M 12,156 Q 140,154 268,156 L 268,170 Q 140,172 12,170 Z" fill="#475569"/>
    <!-- Maderos de soporte del anden -->
    <path d="M 8,152 Q 140,150 272,152 L 272,157 Q 140,158 8,157 Z" fill="#451A03"/>
    <path d="M 10,152 Q 140,151 270,152" stroke="#78350F" stroke-width="1.2" stroke-linecap="round"/>
  </g>

  <!-- Primer piso: Muro de piedra labrada montana -->
  <path d="M 36,112 Q 35,132 36,152 L 244,152 Q 245,132 244,112 Z" fill="#64748B" stroke="#334155" stroke-width="2.2"/>
  <!-- Textura de piedras irregulares en el primer piso -->
  <path d="M 42,120 Q 56,119 70,120 L 69,132 Q 55,133 41,132 Z" fill="#475569"/>
  <path d="M 76,122 Q 94,121 112,122 L 111,134 Q 93,135 75,134 Z" fill="#718096"/>
  <path d="M 168,120 Q 186,119 204,120 L 203,132 Q 185,133 167,132 Z" fill="#475569"/>
  <path d="M 208,122 Q 224,121 240,122 L 239,134 Q 223,135 207,134 Z" fill="#718096"/>

  <!-- Segundo piso: Muros de madera de cedro calida (Placas horizontales con trazo organico) -->
  <path d="M 40,68 Q 38,90 40,114 L 240,114 Q 242,90 240,68 Z" fill="#D97706" stroke="#92400E" stroke-width="2"/>
  <!-- Listones de madera horizontales -->
  <path d="M 40,78 Q 140,77 240,78" stroke="#B45309" stroke-width="1.5"/>
  <path d="M 40,90 Q 140,89 240,90" stroke="#B45309" stroke-width="1.5"/>
  <path d="M 40,102 Q 140,101 240,102" stroke="#B45309" stroke-width="1.5"/>

  <!-- Sombra propia en la mitad derecha del chalet (11%) -->
  <path d="M 140,68 L 240,68 Q 242,90 240,114 L 244,114 Q 245,132 244,152 L 140,152 Z" fill="#000000" opacity="0.11"/>

  <!-- Chimenea de ladrillo rustico en el tejado con humo suave -->
  <g class="station-chimney-group">
    <path d="M 202,18 L 216,16 L 217,46 L 203,46 Z" fill="#8C442A" stroke="#5A2E22" stroke-width="1.6"/>
    <rect x="200" y="14" width="18" height="4" rx="1.5" fill="#5A2E22"/>
    <!-- Bocanadas de humo suave en animacion continua -->
    <circle class="station-chimney-smoke" cx="209" cy="8" r="4.5" fill="#FFFFFF" opacity="0.6"/>
    <circle class="station-chimney-smoke" cx="214" cy="-2" r="6" fill="#F8FAFC" opacity="0.45" style="animation-delay: 0.8s;"/>
  </g>

  <!-- Gran Tejado Alpino empinado a dos aguas (Castano profundo con caida suave) -->
  <!-- Masa principal del tejado con curvatura hacia los aleros -->
  <path d="M 16,74 Q 140,14 264,74 L 252,62 Q 140,6 28,62 Z" fill="#6B4A3A" stroke="#451A03" stroke-width="2.5"/>
  <!-- Vertiente derecha en sombra propia -->
  <path d="M 140,10 Q 196,36 252,62 L 264,74 Q 202,44 140,44 Z" fill="#000000" opacity="0.14"/>
  <!-- Viga de remate y caballete -->
  <path d="M 28,62 Q 140,6 252,62" stroke="#A8715A" stroke-width="2.2" stroke-linecap="round" fill="none"/>

  <!-- Buhardilla / Ventana gabled superior -->
  <path d="M 118,44 Q 140,24 162,44 L 162,64 L 118,64 Z" fill="#D97706" stroke="#92400E" stroke-width="1.8"/>
  <path d="M 112,44 Q 140,20 168,44 L 164,48 Q 140,26 116,48 Z" fill="#5A3828"/>
  <!-- Ventanita de la buhardilla -->
  <rect x="130" y="44" width="20" height="15" rx="3.5" fill="#FEF08A" stroke="#451A03" stroke-width="1.4"/>
  <line x1="140" y1="44" x2="140" y2="59" stroke="#451A03" stroke-width="1.2"/>

  <!-- Sombra del alero sobre la pared -->
  <path d="M 26,74 Q 140,22 254,74 L 246,82 Q 140,32 34,82 Z" fill="#000000" opacity="0.16"/>

  <!-- Placa Oficial Limpia en Fachada -->
  <g class="station-name-sign">
    <rect x="62" y="74" width="156" height="15" rx="5" fill="#022B14" stroke="#F59E0B" stroke-width="1.5"/>
    <text x="140" y="85" fill="#FFFFFF" font-size="7.5" font-weight="bold" font-family="'Nunito', sans-serif" text-anchor="middle" letter-spacing="0.4">CUANDO EL CAMINO CAMBIA</text>
  </g>

  <!-- Marquesina Rustica de Madera con Vigas -->
  <path d="M 26,104 Q 140,100 254,104 L 246,110 Q 140,106 34,110 Z" fill="#5A3828" stroke="#382216" stroke-width="1.6"/>
  <path d="M 50,110 L 50,152" stroke="#5A4636" stroke-width="3" stroke-linecap="round"/>
  <path d="M 50,122 Q 58,116 64,110" stroke="#5A4636" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  <path d="M 230,110 L 230,152" stroke="#5A4636" stroke-width="3" stroke-linecap="round"/>
  <path d="M 230,122 Q 222,116 216,110" stroke="#5A4636" stroke-width="2.2" stroke-linecap="round" fill="none"/>

  <!-- Puerta de Roble Arqueada y Ventanales Cálidos -->
  <path d="M 124,152 L 124,116 Q 140,106 156,116 L 156,152 Z" fill="#451A03" stroke="#260F02" stroke-width="1.6"/>
  <path d="M 128,118 Q 140,110 152,118 L 152,130 L 128,130 Z" fill="#FEF08A" opacity="0.9"/>
  <line x1="140" y1="112" x2="140" y2="130" stroke="#451A03" stroke-width="1.2"/>

  <!-- Ventana Izquierda con Contraventanas Verdes -->
  <g class="station-window-left">
    <!-- Contraventanas de madera verde bosque -->
    <rect x="52" y="118" width="8" height="24" rx="2" fill="#245F38" stroke="#163E24" stroke-width="1.2"/>
    <rect x="88" y="118" width="8" height="24" rx="2" fill="#245F38" stroke="#163E24" stroke-width="1.2"/>
    <!-- Cristal con luz calida -->
    <rect x="62" y="116" width="24" height="26" rx="3.5" fill="#FEF08A" stroke="#451A03" stroke-width="1.5"/>
    <line x1="74" y1="116" x2="74" y2="142" stroke="#451A03" stroke-width="1.2"/>
    <line x1="62" y1="129" x2="86" y2="129" stroke="#451A03" stroke-width="1.2"/>
  </g>

  <!-- Ventana Derecha -->
  <g class="station-window-right">
    <rect x="174" y="118" width="8" height="24" rx="2" fill="#245F38" stroke="#163E24" stroke-width="1.2"/>
    <rect x="210" y="118" width="8" height="24" rx="2" fill="#245F38" stroke="#163E24" stroke-width="1.2"/>
    <rect x="184" y="116" width="24" height="26" rx="3.5" fill="#FDE68A" stroke="#451A03" stroke-width="1.5"/>
    <path d="M 184,116 L 208,116 L 208,142 L 184,142 Z" fill="#000000" opacity="0.08"/>
    <line x1="196" y1="116" x2="196" y2="142" stroke="#451A03" stroke-width="1.2"/>
    <line x1="184" y1="129" x2="208" y2="129" stroke="#451A03" stroke-width="1.2"/>
  </g>

  <!-- Semaforo Ferroviario Clasico en Verde TdeA -->
  <g class="station-railway-semaphore" transform="translate(252, 42)">
    <rect x="0" y="0" width="5" height="114" rx="2.5" fill="#334155"/>
    <!-- Brazo oscilante con lanterna -->
    <path d="M 2,12 L 18,6 L 18,18 L 2,24 Z" fill="#B45309" stroke="#78350F" stroke-width="1.2"/>
    <!-- Disco del semaforo -->
    <circle cx="2" cy="18" r="7.5" fill="#1E293B"/>
    <circle cx="2" cy="18" r="5" fill="#10B981" stroke="#047857" stroke-width="1.5"/>
    <circle cx="2" cy="18" r="8" fill="#10B981" opacity="0.35"/>
  </g>

  <!-- Enredadera y Flores Silvestres de Montana al pie -->
  <g class="station-footing-flora">
    <!-- Enredadera trepando por la pared izquierda -->
    <path d="M 38,154 Q 32,140 36,128 Q 40,120 37,110" stroke="#245F38" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <circle cx="34" cy="138" r="2.4" fill="#3E8456"/>
    <circle cx="38" cy="126" r="2.2" fill="#4F8F4F"/>
    <circle cx="35" cy="116" r="2" fill="#5F9F6C"/>

    <!-- Pinos / Arbustos montaneses en la base -->
    <path d="M 8,170 Q 14,150 26,152 Q 38,148 48,158 Q 54,166 52,172 Z" fill="#1E3A2B"/>
    <path d="M 12,170 Q 20,154 32,155 Q 42,152 46,165 Z" fill="#245F38"/>
    <!-- Flores de brezo y margaritas -->
    <circle cx="20" cy="158" r="2" fill="#F472B6"/>
    <circle cx="28" cy="155" r="1.8" fill="#FFFFFF"/>
    <circle cx="38" cy="157" r="2.2" fill="#FDE047"/>

    <path d="M 224,172 Q 228,152 240,150 Q 254,146 266,156 Q 272,166 270,172 Z" fill="#1E3A2B"/>
    <path d="M 232,171 Q 240,154 250,153 Q 260,152 264,165 Z" fill="#3E8456"/>
    <circle cx="240" cy="156" r="2.2" fill="#FFFFFF"/>
    <circle cx="252" cy="154" r="2" fill="#F472B6"/>
    <circle cx="260" cy="160" r="1.8" fill="#FDE047"/>
  </g>
</svg>
              </div>

<!-- EDIFICIO 3: VIAJAR ACOMPAÑADO / TERMINAL CAMPUS VITAL (Neoclasica academica) -->
              <div class="station-building-item ${this.s3Done ? 'is-completed' : (this.s2Done ? 'is-active' : 'is-locked')}" id="station-building-3" style="left: 82%;">
                <svg class="station-building-svg" viewBox="0 0 280 180" width="280" height="180" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Sombra de contacto en el suelo -->
  <ellipse cx="140" cy="172" rx="130" ry="6.5" fill="#022B14" opacity="0.25"/>

  <!-- Base de gradas y zocalo de granito / piedra caliza -->
  <g class="station-granite-steps">
    <!-- Grada inferior -->
    <path d="M 8,162 Q 140,160 272,162 L 272,170 Q 140,172 8,170 Z" fill="#475569"/>
    <!-- Grada intermedia -->
    <path d="M 16,156 Q 140,154 264,156 L 264,163 Q 140,164 16,163 Z" fill="#64748B"/>
    <!-- Grada superior de anden -->
    <path d="M 22,151 Q 140,149 258,151 L 258,157 Q 140,158 22,157 Z" fill="#94A3B8"/>
    <path d="M 24,151 Q 140,150 256,151" stroke="#E2E8F0" stroke-width="1.2" stroke-linecap="round"/>
  </g>

  <!-- Fachada Principal Institucional de Silleria Crema (Estilo Campus Universitario TdeA) -->
  <path d="M 28,74 Q 26,112 28,151 L 252,151 Q 254,112 252,74 Z" fill="#F3EAD7" stroke="#004D25" stroke-width="2.2"/>
  
  <!-- Lineas sutiles de juntas de canteria en la piedra -->
  <path d="M 28,94 Q 140,93 252,94" stroke="#E6DAC2" stroke-width="1.4"/>
  <path d="M 28,114 Q 140,113 252,114" stroke="#E6DAC2" stroke-width="1.4"/>
  <path d="M 28,134 Q 140,133 252,134" stroke="#E6DAC2" stroke-width="1.4"/>

  <!-- Sombra propia volumetrica (mitad derecha mas oscura 8%) -->
  <path d="M 140,74 L 252,74 Q 254,112 252,151 L 140,151 Z" fill="#000000" opacity="0.08"/>

  <!-- Columnas / Pilastras Institucionales TdeA con Fuste Verde Institucional -->
  <!-- Columna 1 (Izquierda extrema) -->
  <g class="column-tdea" transform="translate(36, 76)">
    <rect x="0" y="0" width="14" height="74" rx="3.5" fill="#005A29" stroke="#022B14" stroke-width="1.4"/>
    <rect x="2" y="2" width="4" height="70" rx="1.5" fill="#00843D" opacity="0.8"/>
    <!-- Capitel y Base -->
    <rect x="-2" y="-3" width="18" height="6" rx="2" fill="#E2E8F0" stroke="#022B14" stroke-width="1.2"/>
    <rect x="-2" y="71" width="18" height="5" rx="2" fill="#E2E8F0" stroke="#022B14" stroke-width="1.2"/>
  </g>

  <!-- Columna 2 (Izquierda portal) -->
  <g class="column-tdea" transform="translate(90, 76)">
    <rect x="0" y="0" width="14" height="74" rx="3.5" fill="#005A29" stroke="#022B14" stroke-width="1.4"/>
    <rect x="2" y="2" width="4" height="70" rx="1.5" fill="#00843D" opacity="0.8"/>
    <rect x="-2" y="-3" width="18" height="6" rx="2" fill="#E2E8F0" stroke="#022B14" stroke-width="1.2"/>
    <rect x="-2" y="71" width="18" height="5" rx="2" fill="#E2E8F0" stroke="#022B14" stroke-width="1.2"/>
  </g>

  <!-- Columna 3 (Derecha portal) -->
  <g class="column-tdea" transform="translate(176, 76)">
    <rect x="0" y="0" width="14" height="74" rx="3.5" fill="#004D25" stroke="#022B14" stroke-width="1.4"/>
    <rect x="2" y="2" width="4" height="70" rx="1.5" fill="#00602B" opacity="0.8"/>
    <rect x="-2" y="-3" width="18" height="6" rx="2" fill="#CBD5E1" stroke="#022B14" stroke-width="1.2"/>
    <rect x="-2" y="71" width="18" height="5" rx="2" fill="#CBD5E1" stroke="#022B14" stroke-width="1.2"/>
  </g>

  <!-- Columna 4 (Derecha extrema) -->
  <g class="column-tdea" transform="translate(230, 76)">
    <rect x="0" y="0" width="14" height="74" rx="3.5" fill="#004D25" stroke="#022B14" stroke-width="1.4"/>
    <rect x="2" y="2" width="4" height="70" rx="1.5" fill="#00602B" opacity="0.8"/>
    <rect x="-2" y="-3" width="18" height="6" rx="2" fill="#CBD5E1" stroke="#022B14" stroke-width="1.2"/>
    <rect x="-2" y="71" width="18" height="5" rx="2" fill="#CBD5E1" stroke="#022B14" stroke-width="1.2"/>
  </g>

  <!-- Entablamento / Cornisa Neoclasica Superior con moldura curva -->
  <path d="M 22,74 Q 140,70 258,74 L 254,64 Q 140,60 26,64 Z" fill="#E2E8F0" stroke="#004D25" stroke-width="1.8"/>
  <path d="M 26,64 Q 140,60 254,64" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>

  <!-- Campanario / Torre del Reloj Central Monumental -->
  <g class="station-clock-tower">
    <!-- Cuerpo de la torre en piedra crema -->
    <path d="M 104,26 Q 103,46 104,66 L 176,66 Q 177,46 176,26 Z" fill="#F3EAD7" stroke="#004D25" stroke-width="2"/>
    <!-- Sombra en lateral derecho de la torre -->
    <path d="M 140,26 L 176,26 Q 177,46 176,66 L 140,66 Z" fill="#000000" opacity="0.09"/>
    <!-- Pilastras esquineras verdes -->
    <rect x="104" y="26" width="6" height="40" rx="2" fill="#00602B"/>
    <rect x="170" y="26" width="6" height="40" rx="2" fill="#004D25"/>

    <!-- Gran Reloj Monumental de la Terminal -->
    <circle cx="140" cy="46" r="13.5" fill="#FFFFFF" stroke="#022B14" stroke-width="2.2"/>
    <circle cx="140" cy="46" r="10.8" fill="#FEF3C7"/>
    <!-- Numeros cardinales / indices -->
    <line x1="140" y1="36" x2="140" y2="38.5" stroke="#022B14" stroke-width="1.6"/>
    <line x1="140" y1="56" x2="140" y2="53.5" stroke="#022B14" stroke-width="1.6"/>
    <line x1="130" y1="46" x2="132.5" y2="46" stroke="#022B14" stroke-width="1.6"/>
    <line x1="150" y1="46" x2="147.5" y2="46" stroke="#022B14" stroke-width="1.6"/>
    <!-- Agujas del reloj -->
    <line x1="140" y1="46" x2="140" y2="39" stroke="#0F172A" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="140" y1="46" x2="146" y2="46" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="140" cy="46" r="1.6" fill="#022B14"/>

    <!-- Cornisa superior de la torre -->
    <rect x="98" y="22" width="84" height="5" rx="2" fill="#E2E8F0" stroke="#004D25" stroke-width="1.4"/>

    <!-- Cupula de Cobre Verdigris (Turquesa / Verde agua envejecido con caida concava suave) -->
    <path d="M 102,22 C 102,4 178,4 178,22 Z" fill="url(#editorial-verdigris-dome)" stroke="#064E3B" stroke-width="2"/>
    <!-- Sombra propia en vertiente derecha de la cupula -->
    <path d="M 140,5 C 160,5 178,12 178,22 L 140,22 Z" fill="#000000" opacity="0.12"/>
    <!-- Nervios de cobre de la cupula -->
    <path d="M 120,22 C 122,12 132,6 140,5" stroke="#6EE7B7" stroke-width="1.4" fill="none" opacity="0.7"/>
    <path d="M 160,22 C 158,12 148,6 140,5" stroke="#064E3B" stroke-width="1.4" fill="none" opacity="0.7"/>

    <!-- Aguja / Veleta dorada y Banderin Verde TdeA ondeando -->
    <line x1="140" y1="5" x2="140" y2="-4" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/>
    <circle cx="140" cy="-4" r="2.2" fill="#F59E0B"/>
    <!-- Banderin ondeando suavemente hacia la derecha -->
    <path d="M 140,-4 Q 152,-9 164,-3 Q 156,2 140,1 Z" fill="#74D633" stroke="#022B14" stroke-width="1.2"/>
  </g>

  <!-- Fronton / Placa Oficial Limpia: TERMINAL CAMPUS VITAL -->
  <g class="station-name-sign">
    <path d="M 52,66 Q 140,64 228,66 L 226,79 Q 140,81 54,79 Z" fill="#022B14" stroke="#74D633" stroke-width="1.5"/>
    <text x="140" y="75.5" fill="#FFFFFF" font-size="7.5" font-weight="bold" font-family="'Nunito', sans-serif" text-anchor="middle" letter-spacing="0.4">TERMINAL CAMPUS VITAL</text>
  </g>

  <!-- Gran Porton de Cristal Arqueado (Vestibulo Luminoso de la Estacion) -->
  <g class="station-grand-arch">
    <!-- Marco de silleria del arco -->
    <path d="M 112,151 L 112,106 Q 140,88 168,106 L 168,151 Z" fill="#022B14" stroke="#004D25" stroke-width="1.8"/>
    <!-- Vidriera luminosa con resplandor calido -->
    <path d="M 116,151 L 116,108 Q 140,92 164,108 L 164,151 Z" fill="#FEF08A" opacity="0.94"/>
    <!-- Trazado de cancela vidriada -->
    <path d="M 116,108 Q 140,92 164,108" stroke="#022B14" stroke-width="1.8" fill="none"/>
    <line x1="140" y1="92" x2="140" y2="151" stroke="#022B14" stroke-width="1.8"/>
    <line x1="116" y1="124" x2="164" y2="124" stroke="#022B14" stroke-width="1.5"/>
    <line x1="122" y1="102" x2="158" y2="102" stroke="#022B14" stroke-width="1.2"/>
    <!-- Resplandor interior suave -->
    <circle cx="140" cy="120" r="16" fill="#FDE047" opacity="0.35"/>
  </g>

  <!-- Ventanas Laterales Institucionales con Arco de Medio Punto -->
  <g class="station-side-windows">
    <!-- Ventana izquierda -->
    <path d="M 58,104 Q 58,92 72,92 Q 86,92 86,104 L 86,134 L 58,134 Z" fill="#FEF08A" stroke="#005A29" stroke-width="1.6"/>
    <line x1="72" y1="92" x2="72" y2="134" stroke="#005A29" stroke-width="1.3"/>
    <line x1="58" y1="116" x2="86" y2="116" stroke="#005A29" stroke-width="1.3"/>
    <rect x="55" y="133" width="34" height="4" rx="1.5" fill="#E2E8F0" stroke="#005A29" stroke-width="1"/>

    <!-- Ventana derecha con sombra suave -->
    <path d="M 194,104 Q 194,92 208,92 Q 222,92 222,104 L 222,134 L 194,134 Z" fill="#FDE68A" stroke="#005A29" stroke-width="1.6"/>
    <path d="M 194,104 Q 194,92 208,92 Q 222,92 222,104 L 222,134 L 194,134 Z" fill="#000000" opacity="0.08"/>
    <line x1="208" y1="92" x2="208" y2="134" stroke="#005A29" stroke-width="1.3"/>
    <line x1="194" y1="116" x2="222" y2="116" stroke="#005A29" stroke-width="1.3"/>
    <rect x="191" y="133" width="34" height="4" rx="1.5" fill="#CBD5E1" stroke="#005A29" stroke-width="1"/>
  </g>

  <!-- Jardineria Ornamental y Topiarios TdeA al pie de la escalinata -->
  <g class="station-footing-flora">
    <!-- Topiario redondeado izquierdo -->
    <circle cx="26" cy="148" r="9" fill="#005A29"/>
    <circle cx="24" cy="146" r="7" fill="#00843D"/>
    <circle cx="23" cy="144" r="3" fill="#74D633" opacity="0.6"/>
    <rect x="23" y="155" width="6" height="7" rx="1.5" fill="#78350F"/>
    <rect x="20" y="161" width="12" height="7" rx="2" fill="#8B7D6E"/>

    <!-- Macizo de flores y lavandas silvestres izquierda -->
    <path d="M 8,170 Q 14,152 26,154 Q 34,150 42,160 Q 48,168 46,172 Z" fill="#245F38"/>
    <circle cx="14" cy="158" r="2.2" fill="#D7C6F0"/>
    <circle cx="20" cy="156" r="2" fill="#FFFFFF"/>
    <circle cx="34" cy="158" r="2.2" fill="#FDE047"/>

    <!-- Topiario redondeado derecho -->
    <circle cx="254" cy="148" r="9" fill="#004D25"/>
    <circle cx="252" cy="146" r="7" fill="#00602B"/>
    <circle cx="251" cy="144" r="3" fill="#10B981" opacity="0.5"/>
    <rect x="251" y="155" width="6" height="7" rx="1.5" fill="#5A2E22"/>
    <rect x="248" y="161" width="12" height="7" rx="2" fill="#6B7280"/>

    <!-- Macizo de flores derecha -->
    <path d="M 234,172 Q 238,154 248,152 Q 258,150 268,160 Q 272,168 270,172 Z" fill="#1E3A2B"/>
    <circle cx="242" cy="158" r="2" fill="#FFFFFF"/>
    <circle cx="258" cy="156" r="2.2" fill="#D7C6F0"/>
    <circle cx="266" cy="160" r="1.8" fill="#FDE047"/>
  </g>
</svg>
              </div>

            </div>

            <!-- ===================================================================
                 [CAPA 5: VÍA FÉRREA 2.5D]
                 Riel superior exactamente en bottom: 134px (90px base + 44px altura riel)
                 =================================================================== -->
                        <div class="railway-track-system" id="railway-track-system">
              <svg class="organic-railway-track-svg" viewBox="0 0 1440 52" preserveAspectRatio="none" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Lecho de balasto de grava con borde organico y textura -->
  <path d="M 0,15 Q 180,13 360,16 Q 540,14 720,15 Q 900,13 1080,16 Q 1260,14 1440,15 L 1440,50 Q 1260,52 1080,49 Q 900,51 720,50 Q 540,52 360,49 Q 180,51 0,50 Z" fill="#6B5E52"/>
  <!-- Capa de sombra inferior del balasto -->
  <path d="M 0,46 Q 360,45 720,46 Q 1080,45 1440,46 L 1440,52 L 0,52 Z" fill="#2E231C" opacity="0.6"/>

  <!-- Durmientes de madera con espaciado y tonos organicos -->
  <g class="track-sleepers-group">
    <rect x="10.0" y="12.6" width="13.9" height="37.4" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(-0.76 17.0 29.8)"/><rect x="10.0" y="11.1" width="13.9" height="37.4" rx="2" fill="#5A4636" stroke="#2A1508" stroke-width="0.8" transform="rotate(-0.76 17.0 29.8)"/><line x1="14.2" y1="14.1" x2="14.2" y2="45.6" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(-0.76 17.0 29.8)"/><rect x="43.1" y="11.8" width="13.5" height="37.2" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(0.14 49.8 28.9)"/><rect x="43.1" y="10.3" width="13.5" height="37.2" rx="2" fill="#5A4636" stroke="#2A1508" stroke-width="0.8" transform="rotate(0.14 49.8 28.9)"/><line x1="47.1" y1="13.3" x2="47.1" y2="44.5" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(0.14 49.8 28.9)"/><rect x="74.8" y="12.8" width="14.2" height="37.6" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(-0.13 81.9 30.1)"/><rect x="74.8" y="11.3" width="14.2" height="37.6" rx="2" fill="#451A03" stroke="#2A1508" stroke-width="0.8" transform="rotate(-0.13 81.9 30.1)"/><line x1="79.1" y1="14.3" x2="79.1" y2="45.9" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(-0.13 81.9 30.1)"/><rect x="105.0" y="12.0" width="13.7" height="38.9" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(-0.26 111.8 30.0)"/><rect x="105.0" y="10.5" width="13.7" height="38.9" rx="2" fill="#78513E" stroke="#2A1508" stroke-width="0.8" transform="rotate(-0.26 111.8 30.0)"/><line x1="109.1" y1="13.5" x2="109.1" y2="46.4" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(-0.26 111.8 30.0)"/><path d="M 121.1,46.0 Q 119.1,40.0 117.1,37.0 M 121.1,46.0 Q 122.1,39.0 124.1,36.0" stroke="#4F8F4F" stroke-width="1.2" fill="none" stroke-linecap="round"/><rect x="137.7" y="12.3" width="15.0" height="37.8" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(0.06 145.2 29.7)"/><rect x="137.7" y="10.8" width="15.0" height="37.8" rx="2" fill="#78513E" stroke="#2A1508" stroke-width="0.8" transform="rotate(0.06 145.2 29.7)"/><line x1="142.2" y1="13.8" x2="142.2" y2="45.6" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(0.06 145.2 29.7)"/><rect x="169.7" y="11.8" width="14.6" height="37.1" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(0.12 176.9 28.9)"/><rect x="169.7" y="10.3" width="14.6" height="37.1" rx="2" fill="#4E3828" stroke="#2A1508" stroke-width="0.8" transform="rotate(0.12 176.9 28.9)"/><line x1="174.0" y1="13.3" x2="174.0" y2="44.4" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(0.12 176.9 28.9)"/><rect x="199.5" y="12.8" width="14.1" height="37.9" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(0.59 206.5 30.2)"/><rect x="199.5" y="11.3" width="14.1" height="37.9" rx="2" fill="#6B4A3A" stroke="#2A1508" stroke-width="0.8" transform="rotate(0.59 206.5 30.2)"/><line x1="203.7" y1="14.3" x2="203.7" y2="46.2" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(0.59 206.5 30.2)"/><path d="M 217.0,46.5 Q 215.0,40.5 213.0,37.5 M 217.0,46.5 Q 218.0,39.5 220.0,36.5" stroke="#4F8F4F" stroke-width="1.2" fill="none" stroke-linecap="round"/><rect x="231.7" y="11.7" width="13.8" height="38.5" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(0.17 238.6 29.5)"/><rect x="231.7" y="10.2" width="13.8" height="38.5" rx="2" fill="#5A4636" stroke="#2A1508" stroke-width="0.8" transform="rotate(0.17 238.6 29.5)"/><line x1="235.8" y1="13.2" x2="235.8" y2="45.7" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(0.17 238.6 29.5)"/><rect x="265.2" y="11.6" width="14.0" height="38.5" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(-0.45 272.2 29.4)"/><rect x="265.2" y="10.1" width="14.0" height="38.5" rx="2" fill="#451A03" stroke="#2A1508" stroke-width="0.8" transform="rotate(-0.45 272.2 29.4)"/><line x1="269.4" y1="13.1" x2="269.4" y2="45.6" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(-0.45 272.2 29.4)"/><rect x="297.9" y="12.8" width="13.8" height="38.9" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(-0.37 304.8 30.8)"/><rect x="297.9" y="11.3" width="13.8" height="38.9" rx="2" fill="#78513E" stroke="#2A1508" stroke-width="0.8" transform="rotate(-0.37 304.8 30.8)"/><line x1="302.0" y1="14.3" x2="302.0" y2="47.2" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(-0.37 304.8 30.8)"/><rect x="330.0" y="11.7" width="14.5" height="37.3" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(0.62 337.2 28.9)"/><rect x="330.0" y="10.2" width="14.5" height="37.3" rx="2" fill="#78513E" stroke="#2A1508" stroke-width="0.8" transform="rotate(0.62 337.2 28.9)"/><line x1="334.3" y1="13.2" x2="334.3" y2="44.5" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(0.62 337.2 28.9)"/><rect x="361.7" y="13.0" width="14.4" height="37.7" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(-0.11 368.9 30.4)"/><rect x="361.7" y="11.5" width="14.4" height="37.7" rx="2" fill="#451A03" stroke="#2A1508" stroke-width="0.8" transform="rotate(-0.11 368.9 30.4)"/><line x1="366.0" y1="14.5" x2="366.0" y2="46.2" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(-0.11 368.9 30.4)"/><path d="M 380.0,46.2 Q 378.0,40.2 376.0,37.2 M 380.0,46.2 Q 381.0,39.2 383.0,36.2" stroke="#4F8F4F" stroke-width="1.2" fill="none" stroke-linecap="round"/><rect x="391.8" y="12.1" width="14.1" height="37.1" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(0.47 398.8 29.1)"/><rect x="391.8" y="10.6" width="14.1" height="37.1" rx="2" fill="#6B4A3A" stroke="#2A1508" stroke-width="0.8" transform="rotate(0.47 398.8 29.1)"/><line x1="396.0" y1="13.6" x2="396.0" y2="44.7" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(0.47 398.8 29.1)"/><rect x="423.4" y="12.5" width="13.5" height="38.4" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(0.58 430.2 30.2)"/><rect x="423.4" y="11.0" width="13.5" height="38.4" rx="2" fill="#451A03" stroke="#2A1508" stroke-width="0.8" transform="rotate(0.58 430.2 30.2)"/><line x1="427.4" y1="14.0" x2="427.4" y2="46.5" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(0.58 430.2 30.2)"/><rect x="454.0" y="12.9" width="14.2" height="37.9" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(-0.62 461.0 30.4)"/><rect x="454.0" y="11.4" width="14.2" height="37.9" rx="2" fill="#4E3828" stroke="#2A1508" stroke-width="0.8" transform="rotate(-0.62 461.0 30.4)"/><line x1="458.2" y1="14.4" x2="458.2" y2="46.3" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(-0.62 461.0 30.4)"/><rect x="484.5" y="12.4" width="14.3" height="37.2" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(0.42 491.6 29.5)"/><rect x="484.5" y="10.9" width="14.3" height="37.2" rx="2" fill="#451A03" stroke="#2A1508" stroke-width="0.8" transform="rotate(0.42 491.6 29.5)"/><line x1="488.8" y1="13.9" x2="488.8" y2="45.2" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(0.42 491.6 29.5)"/><rect x="516.0" y="12.7" width="14.6" height="38.1" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(-0.56 523.4 30.2)"/><rect x="516.0" y="11.2" width="14.6" height="38.1" rx="2" fill="#6B4A3A" stroke="#2A1508" stroke-width="0.8" transform="rotate(-0.56 523.4 30.2)"/><line x1="520.4" y1="14.2" x2="520.4" y2="46.2" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(-0.56 523.4 30.2)"/><rect x="545.5" y="13.0" width="13.7" height="37.7" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(-0.02 552.4 30.3)"/><rect x="545.5" y="11.5" width="13.7" height="37.7" rx="2" fill="#4E3828" stroke="#2A1508" stroke-width="0.8" transform="rotate(-0.02 552.4 30.3)"/><line x1="549.6" y1="14.5" x2="549.6" y2="46.2" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(-0.02 552.4 30.3)"/><rect x="576.0" y="12.2" width="14.9" height="37.2" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(0.60 583.5 29.3)"/><rect x="576.0" y="10.7" width="14.9" height="37.2" rx="2" fill="#6B4A3A" stroke="#2A1508" stroke-width="0.8" transform="rotate(0.60 583.5 29.3)"/><line x1="580.5" y1="13.7" x2="580.5" y2="44.9" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(0.60 583.5 29.3)"/><path d="M 596.0,44.8 Q 594.0,38.8 592.0,35.8 M 596.0,44.8 Q 597.0,37.8 599.0,34.8" stroke="#4F8F4F" stroke-width="1.2" fill="none" stroke-linecap="round"/><circle cx="599.0" cy="34.8" r="1.4" fill="#FDE047"/><rect x="607.4" y="12.9" width="14.3" height="38.2" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(-0.54 614.6 30.6)"/><rect x="607.4" y="11.4" width="14.3" height="38.2" rx="2" fill="#451A03" stroke="#2A1508" stroke-width="0.8" transform="rotate(-0.54 614.6 30.6)"/><line x1="611.7" y1="14.4" x2="611.7" y2="46.7" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(-0.54 614.6 30.6)"/><rect x="639.9" y="12.1" width="14.1" height="38.3" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(0.34 647.0 29.7)"/><rect x="639.9" y="10.6" width="14.1" height="38.3" rx="2" fill="#6B4A3A" stroke="#2A1508" stroke-width="0.8" transform="rotate(0.34 647.0 29.7)"/><line x1="644.2" y1="13.6" x2="644.2" y2="45.9" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(0.34 647.0 29.7)"/><rect x="671.2" y="11.8" width="14.0" height="38.2" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(-0.44 678.2 29.4)"/><rect x="671.2" y="10.3" width="14.0" height="38.2" rx="2" fill="#6B4A3A" stroke="#2A1508" stroke-width="0.8" transform="rotate(-0.44 678.2 29.4)"/><line x1="675.4" y1="13.3" x2="675.4" y2="45.5" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(-0.44 678.2 29.4)"/><path d="M 687.5,46.0 Q 685.5,40.0 683.5,37.0 M 687.5,46.0 Q 688.5,39.0 690.5,36.0" stroke="#4F8F4F" stroke-width="1.2" fill="none" stroke-linecap="round"/><circle cx="690.5" cy="36.0" r="1.4" fill="#FDE047"/><rect x="704.4" y="11.8" width="13.9" height="38.3" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(-0.69 711.3 29.5)"/><rect x="704.4" y="10.3" width="13.9" height="38.3" rx="2" fill="#4E3828" stroke="#2A1508" stroke-width="0.8" transform="rotate(-0.69 711.3 29.5)"/><line x1="708.5" y1="13.3" x2="708.5" y2="45.7" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(-0.69 711.3 29.5)"/><path d="M 724.0,46.4 Q 722.0,40.4 720.0,37.4 M 724.0,46.4 Q 725.0,39.4 727.0,36.4" stroke="#4F8F4F" stroke-width="1.2" fill="none" stroke-linecap="round"/><rect x="737.0" y="12.1" width="13.6" height="37.9" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(-0.50 743.8 29.6)"/><rect x="737.0" y="10.6" width="13.6" height="37.9" rx="2" fill="#78513E" stroke="#2A1508" stroke-width="0.8" transform="rotate(-0.50 743.8 29.6)"/><line x1="741.1" y1="13.6" x2="741.1" y2="45.5" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(-0.50 743.8 29.6)"/><rect x="769.4" y="11.7" width="14.6" height="38.6" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(-0.70 776.7 29.5)"/><rect x="769.4" y="10.2" width="14.6" height="38.6" rx="2" fill="#5A4636" stroke="#2A1508" stroke-width="0.8" transform="rotate(-0.70 776.7 29.5)"/><line x1="773.8" y1="13.2" x2="773.8" y2="45.8" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(-0.70 776.7 29.5)"/><path d="M 788.1,48.2 Q 786.1,42.2 784.1,39.2 M 788.1,48.2 Q 789.1,41.2 791.1,38.2" stroke="#4F8F4F" stroke-width="1.2" fill="none" stroke-linecap="round"/><circle cx="791.1" cy="38.2" r="1.4" fill="#FDE047"/><rect x="800.8" y="11.6" width="14.8" height="38.1" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(-0.09 808.2 29.1)"/><rect x="800.8" y="10.1" width="14.8" height="38.1" rx="2" fill="#5A4636" stroke="#2A1508" stroke-width="0.8" transform="rotate(-0.09 808.2 29.1)"/><line x1="805.2" y1="13.1" x2="805.2" y2="45.2" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(-0.09 808.2 29.1)"/><rect x="833.6" y="12.2" width="14.8" height="37.3" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(0.68 841.0 29.4)"/><rect x="833.6" y="10.7" width="14.8" height="37.3" rx="2" fill="#5A4636" stroke="#2A1508" stroke-width="0.8" transform="rotate(0.68 841.0 29.4)"/><line x1="838.0" y1="13.7" x2="838.0" y2="45.1" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(0.68 841.0 29.4)"/><path d="M 852.0,47.8 Q 850.0,41.8 848.0,38.8 M 852.0,47.8 Q 853.0,40.8 855.0,37.8" stroke="#4F8F4F" stroke-width="1.2" fill="none" stroke-linecap="round"/><rect x="867.0" y="12.5" width="14.7" height="37.6" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(0.68 874.4 29.8)"/><rect x="867.0" y="11.0" width="14.7" height="37.6" rx="2" fill="#4E3828" stroke="#2A1508" stroke-width="0.8" transform="rotate(0.68 874.4 29.8)"/><line x1="871.4" y1="14.0" x2="871.4" y2="45.6" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(0.68 874.4 29.8)"/><rect x="899.7" y="12.4" width="13.9" height="38.9" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(-0.55 906.7 30.3)"/><rect x="899.7" y="10.9" width="13.9" height="38.9" rx="2" fill="#78513E" stroke="#2A1508" stroke-width="0.8" transform="rotate(-0.55 906.7 30.3)"/><line x1="903.9" y1="13.9" x2="903.9" y2="46.8" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(-0.55 906.7 30.3)"/><rect x="932.2" y="12.3" width="14.2" height="38.8" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(-0.72 939.3 30.2)"/><rect x="932.2" y="10.8" width="14.2" height="38.8" rx="2" fill="#5A4636" stroke="#2A1508" stroke-width="0.8" transform="rotate(-0.72 939.3 30.2)"/><line x1="936.4" y1="13.8" x2="936.4" y2="46.6" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(-0.72 939.3 30.2)"/><path d="M 950.4,46.2 Q 948.4,40.2 946.4,37.2 M 950.4,46.2 Q 951.4,39.2 953.4,36.2" stroke="#4F8F4F" stroke-width="1.2" fill="none" stroke-linecap="round"/><circle cx="953.4" cy="36.2" r="1.4" fill="#FDE047"/><rect x="961.9" y="12.4" width="14.9" height="38.1" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(-0.15 969.4 29.9)"/><rect x="961.9" y="10.9" width="14.9" height="38.1" rx="2" fill="#6B4A3A" stroke="#2A1508" stroke-width="0.8" transform="rotate(-0.15 969.4 29.9)"/><line x1="966.4" y1="13.9" x2="966.4" y2="46.0" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(-0.15 969.4 29.9)"/><path d="M 979.2,46.4 Q 977.2,40.4 975.2,37.4 M 979.2,46.4 Q 980.2,39.4 982.2,36.4" stroke="#4F8F4F" stroke-width="1.2" fill="none" stroke-linecap="round"/><rect x="992.7" y="12.1" width="14.6" height="37.5" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(-0.47 1000.0 29.3)"/><rect x="992.7" y="10.6" width="14.6" height="37.5" rx="2" fill="#4E3828" stroke="#2A1508" stroke-width="0.8" transform="rotate(-0.47 1000.0 29.3)"/><line x1="997.1" y1="13.6" x2="997.1" y2="45.1" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(-0.47 1000.0 29.3)"/><rect x="1023.4" y="12.4" width="14.9" height="37.0" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(0.69 1030.9 29.4)"/><rect x="1023.4" y="10.9" width="14.9" height="37.0" rx="2" fill="#4E3828" stroke="#2A1508" stroke-width="0.8" transform="rotate(0.69 1030.9 29.4)"/><line x1="1027.9" y1="13.9" x2="1027.9" y2="45.0" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(0.69 1030.9 29.4)"/><rect x="1053.3" y="12.8" width="13.9" height="38.9" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(-0.46 1060.3 30.8)"/><rect x="1053.3" y="11.3" width="13.9" height="38.9" rx="2" fill="#451A03" stroke="#2A1508" stroke-width="0.8" transform="rotate(-0.46 1060.3 30.8)"/><line x1="1057.5" y1="14.3" x2="1057.5" y2="47.2" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(-0.46 1060.3 30.8)"/><rect x="1084.3" y="13.0" width="14.3" height="37.6" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(-0.10 1091.4 30.3)"/><rect x="1084.3" y="11.5" width="14.3" height="37.6" rx="2" fill="#6B4A3A" stroke="#2A1508" stroke-width="0.8" transform="rotate(-0.10 1091.4 30.3)"/><line x1="1088.6" y1="14.5" x2="1088.6" y2="46.1" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(-0.10 1091.4 30.3)"/><rect x="1115.9" y="11.7" width="14.5" height="38.9" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(-0.32 1123.1 29.6)"/><rect x="1115.9" y="10.2" width="14.5" height="38.9" rx="2" fill="#451A03" stroke="#2A1508" stroke-width="0.8" transform="rotate(-0.32 1123.1 29.6)"/><line x1="1120.2" y1="13.2" x2="1120.2" y2="46.1" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(-0.32 1123.1 29.6)"/><path d="M 1132.8,46.9 Q 1130.8,40.9 1128.8,37.9 M 1132.8,46.9 Q 1133.8,39.9 1135.8,36.9" stroke="#4F8F4F" stroke-width="1.2" fill="none" stroke-linecap="round"/><circle cx="1135.8" cy="36.9" r="1.4" fill="#FDE047"/><rect x="1147.8" y="12.2" width="14.5" height="37.5" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(-0.47 1155.0 29.5)"/><rect x="1147.8" y="10.7" width="14.5" height="37.5" rx="2" fill="#4E3828" stroke="#2A1508" stroke-width="0.8" transform="rotate(-0.47 1155.0 29.5)"/><line x1="1152.2" y1="13.7" x2="1152.2" y2="45.3" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(-0.47 1155.0 29.5)"/><rect x="1180.7" y="12.0" width="14.7" height="37.1" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(0.21 1188.1 29.0)"/><rect x="1180.7" y="10.5" width="14.7" height="37.1" rx="2" fill="#5A4636" stroke="#2A1508" stroke-width="0.8" transform="rotate(0.21 1188.1 29.0)"/><line x1="1185.1" y1="13.5" x2="1185.1" y2="44.6" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(0.21 1188.1 29.0)"/><path d="M 1201.4,46.9 Q 1199.4,40.9 1197.4,37.9 M 1201.4,46.9 Q 1202.4,39.9 1204.4,36.9" stroke="#4F8F4F" stroke-width="1.2" fill="none" stroke-linecap="round"/><rect x="1213.0" y="12.9" width="13.6" height="38.8" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(-0.78 1219.8 30.7)"/><rect x="1213.0" y="11.4" width="13.6" height="38.8" rx="2" fill="#451A03" stroke="#2A1508" stroke-width="0.8" transform="rotate(-0.78 1219.8 30.7)"/><line x1="1217.1" y1="14.4" x2="1217.1" y2="47.1" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(-0.78 1219.8 30.7)"/><rect x="1245.9" y="12.0" width="14.1" height="37.1" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(0.08 1252.9 29.1)"/><rect x="1245.9" y="10.5" width="14.1" height="37.1" rx="2" fill="#451A03" stroke="#2A1508" stroke-width="0.8" transform="rotate(0.08 1252.9 29.1)"/><line x1="1250.1" y1="13.5" x2="1250.1" y2="44.6" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(0.08 1252.9 29.1)"/><rect x="1279.3" y="11.7" width="13.8" height="37.5" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(0.64 1286.2 28.9)"/><rect x="1279.3" y="10.2" width="13.8" height="37.5" rx="2" fill="#5A4636" stroke="#2A1508" stroke-width="0.8" transform="rotate(0.64 1286.2 28.9)"/><line x1="1283.4" y1="13.2" x2="1283.4" y2="44.7" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(0.64 1286.2 28.9)"/><rect x="1312.3" y="11.9" width="14.6" height="38.9" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(0.76 1319.6 29.8)"/><rect x="1312.3" y="10.4" width="14.6" height="38.9" rx="2" fill="#78513E" stroke="#2A1508" stroke-width="0.8" transform="rotate(0.76 1319.6 29.8)"/><line x1="1316.7" y1="13.4" x2="1316.7" y2="46.2" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(0.76 1319.6 29.8)"/><path d="M 1332.1,48.5 Q 1330.1,42.5 1328.1,39.5 M 1332.1,48.5 Q 1333.1,41.5 1335.1,38.5" stroke="#4F8F4F" stroke-width="1.2" fill="none" stroke-linecap="round"/><rect x="1342.5" y="12.6" width="14.1" height="38.3" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(0.45 1349.6 30.3)"/><rect x="1342.5" y="11.1" width="14.1" height="38.3" rx="2" fill="#4E3828" stroke="#2A1508" stroke-width="0.8" transform="rotate(0.45 1349.6 30.3)"/><line x1="1346.7" y1="14.1" x2="1346.7" y2="46.4" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(0.45 1349.6 30.3)"/><path d="M 1359.3,46.6 Q 1357.3,40.6 1355.3,37.6 M 1359.3,46.6 Q 1360.3,39.6 1362.3,36.6" stroke="#4F8F4F" stroke-width="1.2" fill="none" stroke-linecap="round"/><rect x="1372.2" y="12.0" width="14.7" height="37.9" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(-0.44 1379.5 29.4)"/><rect x="1372.2" y="10.5" width="14.7" height="37.9" rx="2" fill="#78513E" stroke="#2A1508" stroke-width="0.8" transform="rotate(-0.44 1379.5 29.4)"/><line x1="1376.6" y1="13.5" x2="1376.6" y2="45.4" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(-0.44 1379.5 29.4)"/><rect x="1402.6" y="11.6" width="14.1" height="37.6" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(0.26 1409.6 28.9)"/><rect x="1402.6" y="10.1" width="14.1" height="37.6" rx="2" fill="#5A4636" stroke="#2A1508" stroke-width="0.8" transform="rotate(0.26 1409.6 28.9)"/><line x1="1406.8" y1="13.1" x2="1406.8" y2="44.7" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(0.26 1409.6 28.9)"/><rect x="1433.5" y="12.9" width="15.0" height="38.1" rx="2.5" fill="#000000" opacity="0.18" transform="rotate(-0.16 1441.0 30.4)"/><rect x="1433.5" y="11.4" width="15.0" height="38.1" rx="2" fill="#451A03" stroke="#2A1508" stroke-width="0.8" transform="rotate(-0.16 1441.0 30.4)"/><line x1="1438.0" y1="14.4" x2="1438.0" y2="46.5" stroke="#FFE4D6" stroke-width="0.6" opacity="0.25" transform="rotate(-0.16 1441.0 30.4)"/><path d="M 1454.3,48.8 Q 1452.3,42.8 1450.3,39.8 M 1454.3,48.8 Q 1455.3,41.8 1457.3,38.8" stroke="#4F8F4F" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  </g>

  <!-- Riel Superior de Acero Pulido (sobre el que ruedan las ruedas en y = 14) -->
  <g class="track-top-rail">
    <!-- Sombra del riel sobre los durmientes -->
    <rect x="0" y="16" width="1440" height="4" fill="#1E293B" opacity="0.45"/>
    <!-- Cuerpo del riel -->
    <rect x="0" y="13" width="1440" height="5" fill="#475569" stroke="#1E293B" stroke-width="0.8"/>
    <!-- Linea de acero pulido y brillo especular -->
    <line x1="0" y1="13.8" x2="1440" y2="13.8" stroke="#FFFFFF" stroke-width="1.3" opacity="0.9"/>
    <line x1="0" y1="15.2" x2="1440" y2="15.2" stroke="#CBD5E1" stroke-width="0.8" opacity="0.6"/>
  </g>

  <!-- Riel Inferior de Acero (y = 42) -->
  <g class="track-bottom-rail">
    <rect x="0" y="44" width="1440" height="3" fill="#1E293B" opacity="0.4"/>
    <rect x="0" y="41" width="1440" height="4.5" fill="#475569" stroke="#1E293B" stroke-width="0.8"/>
    <line x1="0" y1="41.8" x2="1440" y2="41.8" stroke="#CBD5E1" stroke-width="1.2" opacity="0.85"/>
  </g>
</svg>
            </div>

            <!-- [Capa de hitos inferiores de la vía retirada a solicitud (Imagen 2)] -->

            <!-- ===================================================================
                 [CAPA 7: NODOS DE LAS ESTACIONES REFINADOS PARA ADULTOS JÓVENES]
                 Elevados a top: 18% (más de 160px de despeje libre sobre el tren)
                 =================================================================== -->
            <div class="stations-nodes-layer" id="stations-nodes-layer">
              
              <!-- NODO 1: CONOCER EL TERRENO -->
              <div class="station-node-anchor ${this.s1Done ? 'is-completed' : 'is-active'}" id="station-node-1" data-station-id="1" style="left: 18%;">
                <div class="station-water-card">
                  
                  <!-- Waypoint badge refinado con brújula dorada de alta fidelidad -->
                  <button type="button" class="station-orb-btn" id="btn-station-1" aria-label="Estación: Conocer el terreno">
                    <div class="station-icon-wrap" id="icon-st1-main">
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" class="station-icon-svg" style="overflow: visible;">
                        <defs>
                          <linearGradient id="orbCompassGold" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stop-color="#FFD978"/>
                            <stop offset="50%" stop-color="#E9AC35"/>
                            <stop offset="100%" stop-color="#B87714"/>
                          </linearGradient>
                        </defs>
                        <!-- Bisel dorado de la brújula -->
                        <circle cx="18" cy="18" r="16" fill="url(#orbCompassGold)" stroke="#8A5A12" stroke-width="1.2"/>
                        <!-- Dial pergamino interior -->
                        <circle cx="18" cy="18" r="12.5" fill="#FFFFF4" stroke="#9C6D1C" stroke-width="0.8"/>
                        <!-- Marcas cardinales -->
                        <line x1="18" y1="6.5" x2="18" y2="9" stroke="#C9302C" stroke-width="1.5" stroke-linecap="round"/>
                        <line x1="18" y1="27" x2="18" y2="29.5" stroke="#2563EB" stroke-width="1.5" stroke-linecap="round"/>
                        <line x1="6.5" y1="18" x2="9" y2="18" stroke="#00843D" stroke-width="1.5" stroke-linecap="round"/>
                        <line x1="27" y1="18" x2="29.5" y2="18" stroke="#00843D" stroke-width="1.5" stroke-linecap="round"/>
                        <!-- Aguja magnética facetada -->
                        <polygon points="18,7.5 21,18 18,17 15,18" fill="#D32F2F"/>
                        <polygon points="18,28.5 21,18 18,19 15,18" fill="#2563EB"/>
                        <!-- Perno central -->
                        <circle cx="18" cy="18" r="3" fill="#E9AC35" stroke="#734707" stroke-width="0.9"/>
                        <circle cx="18" cy="18" r="1.2" fill="#FFFFFF"/>
                      </svg>
                    </div>
                    <span class="station-glow-ring" id="glow-st1"></span>
                  </button>

                  <!-- Letrero conceptual de la estación con tipografía moderna -->
                  <div class="station-tag-plate" id="tag-st1">
                    <span>Conocer el terreno</span>
                    ${this.s1Done ? '<span class="station-check-badge">✓</span>' : ''}
                  </div>

                  <div class="station-support-mast"></div>

                  <!-- Tooltip pedagógico -->
                  <div class="station-hover-card" id="hover-card-st1">
                    <div class="hover-card-title">🌱 Estación: Conocer el terreno</div>
                    <div class="hover-card-outcome">
                      <strong>Resultado de aprendizaje:</strong> Reconocer el estado actual del bienestar emocional.
                    </div>
                    <div class="hover-card-question">
                      “Antes de iniciar cualquier viaje, lo primero es saber, ¿dónde estamos?”
                    </div>
                  </div>

                  <!-- Llamado a la acción sutil -->
                  <div class="station-cta-bubble" id="cta-st1" style="${this.s1Done ? 'display: none;' : ''}">
                    <span>👆 Comenzar</span>
                  </div>
                </div>
              </div>

              <!-- NODO 2: CUANDO EL CAMINO CAMBIA -->
              <div class="station-node-anchor ${this.s2Done ? 'is-completed' : (this.s1Done ? 'is-active' : 'is-locked')}" id="station-node-2" data-station-id="2" style="left: 50%;">
                <div class="station-water-card">

                  <button type="button" class="station-orb-btn" id="btn-station-2" aria-label="Estación: Cuando el camino cambia" ${!this.s1Done ? 'disabled' : ''}>
                    <div class="station-icon-wrap" id="icon-st2-main">
                      ${!this.s1Done ? `
                        <!-- Candado minimalista -->
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="5" y="11" width="14" height="10" rx="3" stroke="#64748B" stroke-width="1.8"/>
                          <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#64748B" stroke-width="1.8"/>
                          <circle cx="12" cy="16" r="1.5" fill="#64748B"/>
                        </svg>
                      ` : `
                        <!-- Mochila y herramientas de afrontamiento -->
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#00843D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" stroke="#00843D" stroke-width="1.8"/>
                          <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="#00843D" stroke-width="1.8"/>
                          <path d="M8 14h8" stroke="#74D633" stroke-width="2"/>
                          <path d="M12 11v6" stroke="#74D633" stroke-width="2"/>
                        </svg>
                      `}
                    </div>
                    <span class="station-glow-ring" id="glow-st2"></span>
                  </button>

                  <div class="station-tag-plate" id="tag-st2">
                    <span>Cuando el camino cambia</span>
                    ${this.s2Done ? '<span class="station-check-badge">✓</span>' : ''}
                  </div>

                  <div class="station-support-mast"></div>

                  <div class="station-hover-card" id="hover-card-st2">
                    <div class="hover-card-title">🎒 Estación: Cuando el camino cambia</div>
                    <div class="hover-card-outcome">
                      <strong>Resultado de aprendizaje:</strong> Identificar estrategias de afrontamiento ante imprevistos académicos.
                    </div>
                    <div class="hover-card-question">
                      “Cuando el camino se pone empinado, ¿qué herramientas llevas en tu mochila?”
                    </div>
                  </div>

                  <div class="station-cta-bubble" id="cta-st2" style="${this.s1Done && !this.s2Done ? '' : 'display: none;'}">
                    <span>👆 Comenzar</span>
                  </div>
                </div>
              </div>

              <!-- NODO 3: VIAJAR ACOMPAÑADO -->
              <div class="station-node-anchor ${this.s3Done ? 'is-completed' : (this.s2Done ? 'is-active' : 'is-locked')}" id="station-node-3" data-station-id="3" style="left: 82%;">
                <div class="station-water-card">

                  <button type="button" class="station-orb-btn" id="btn-station-3" aria-label="Estación: Viajar acompañado" ${!this.s2Done ? 'disabled' : ''}>
                    <div class="station-icon-wrap" id="icon-st3-main">
                      ${!this.s2Done ? `
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="5" y="11" width="14" height="10" rx="3" stroke="#64748B" stroke-width="1.8"/>
                          <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#64748B" stroke-width="1.8"/>
                          <circle cx="12" cy="16" r="1.5" fill="#64748B"/>
                        </svg>
                      ` : `
                        <!-- Red de apoyo y constelación comunitaria -->
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#00843D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="12" cy="5" r="2.5" fill="#74D633" stroke="#00843D" stroke-width="1.5"/>
                          <circle cx="5" cy="18" r="2.5" fill="#74D633" stroke="#00843D" stroke-width="1.5"/>
                          <circle cx="19" cy="18" r="2.5" fill="#74D633" stroke="#00843D" stroke-width="1.5"/>
                          <line x1="12" y1="7.5" x2="5" y2="15.5" stroke="#00843D" stroke-width="1.8"/>
                          <line x1="12" y1="7.5" x2="19" y2="15.5" stroke="#00843D" stroke-width="1.8"/>
                          <line x1="7.5" y1="18" x2="16.5" y2="18" stroke="#00843D" stroke-width="1.8"/>
                        </svg>
                      `}
                    </div>
                    <span class="station-glow-ring" id="glow-st3"></span>
                  </button>

                  <div class="station-tag-plate" id="tag-st3">
                    <span>Viajar acompañado</span>
                    ${this.s3Done ? '<span class="station-check-badge">✓</span>' : ''}
                  </div>

                  <div class="station-support-mast"></div>

                  <div class="station-hover-card" id="hover-card-st3">
                    <div class="hover-card-title">🤝 Estación: Viajar acompañado</div>
                    <div class="hover-card-outcome">
                      <strong>Resultado de aprendizaje:</strong> Consolidar la red de apoyo y recursos institucionales TdeA.
                    </div>
                    <div class="hover-card-question">
                      “Ningún viaje se hace en soledad: ¿quiénes te acompañan en la ruta?”
                    </div>
                  </div>

                  <div class="station-cta-bubble" id="cta-st3" style="${this.s2Done && !this.s3Done ? '' : 'display: none;'}">
                    <span>👆 Comenzar</span>
                  </div>
                </div>
              </div>

            </div>

            <!-- ===================================================================
                 [CAPA 8: TREN MODERNO 2.5D AMPLIADO (RUEDAS EXACTAMENTE EN RIEL)]
                 Cabina panorámica amplia con Robot Mascota TdeA de alta visibilidad
                 =================================================================== -->
            <div class="train-actor-wrapper" id="train-actor-sprite">
              <div class="train-chassis-container">

                <!-- Chimenea con bocanadas de humo fluido saliendo hacia atrás (izquierda) -->
                <div class="train-steam-plume">
                  <span class="steam-plume-puff p1"></span>
                  <span class="steam-plume-puff p2"></span>
                  <span class="steam-plume-puff p3"></span>
                  <span class="steam-plume-puff p4"></span>
                </div>

                <!-- VECTOR 2.5D DE LA LOCOMOTORA Y MAQUINISTA ROBOT OFICIAL TdeA -->
                <svg class="train-vector-25d" viewBox="0 0 350 155" width="350" height="155" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Sombra de contacto suave en el riel -->
  <ellipse cx="175" cy="154" rx="162" ry="3.8" fill="#022B14" opacity="0.32"/>

  <!-- Enganche trasero de hierro forjado (Izquierda) -->
  <path d="M 6,112 Q 16,111 26,112 L 26,124 Q 16,125 6,124 Z" fill="#334155" stroke="#1E293B" stroke-width="1.6"/>
  <circle cx="12" cy="118" r="4.2" fill="#0F172A"/>

  <!-- Vagon de carbon / equipaje acoplado en cola (Izquierda) -->
  <path d="M 18,74 Q 28,72 38,74 L 38,126 Q 28,127 18,126 Z" fill="#005A29" stroke="#74D633" stroke-width="1.8"/>
  <path d="M 22,80 Q 28,79 34,80 L 34,116 Q 28,117 22,116 Z" fill="#022B14"/>
  <!-- Maletines universitarios sobresaliendo del vagon -->
  <rect x="22" y="70" width="14" height="8" rx="2" fill="#B45309" stroke="#78350F" stroke-width="1"/>

  <!-- =========================================================================
       CABINA DE CONDUCCION PANORAMICA (LINEAS ORGANICAS Y VOLUMEN)
       ========================================================================= -->
  <!-- Masa de la cabina -->
  <path d="M 28,26 Q 34,14 52,14 L 148,14 Q 164,14 166,26 L 166,126 L 28,126 Z" fill="url(#editorial-train-body)" stroke="#022B14" stroke-width="2.5"/>
  <!-- Sombra propia en la cabina (parte trasera e inferior mas oscuras) -->
  <path d="M 28,26 L 56,14 L 56,126 L 28,126 Z" fill="#000000" opacity="0.12"/>
  <path d="M 28,106 Q 97,104 166,106 L 166,126 L 28,126 Z" fill="#000000" opacity="0.10"/>

  <!-- Techo de la cabina con suave curvatura y alero protector -->
  <path d="M 22,14 Q 96,8 172,14 L 168,22 Q 96,16 26,22 Z" fill="#00843D" stroke="#74D633" stroke-width="2"/>
  <!-- Filete dorado en el alero -->
  <path d="M 24,20 Q 96,15 170,20" stroke="#F59E0B" stroke-width="1.4" stroke-linecap="round"/>

  <!-- Ventana Panorámica Amplia con Marco de Madera y Arco Suave (116x64px) -->
  <path d="M 38,24 Q 40,22 46,22 L 146,22 Q 152,22 154,24 L 154,84 Q 152,86 146,86 L 46,86 Q 40,86 38,84 Z" fill="#E0F2FE" stroke="#022B14" stroke-width="2.5"/>

  <!-- =========================================================================
       AVATAR DEL ROBOT ASISTENTE TdeA (GRANDE, TIERNO Y ALTAMENTE VISIBLE)
       ========================================================================= -->
  <g id="train-driver-robot" transform="translate(42, 22)">
    <!-- Fondo interior sombreado de la cabina -->
    <rect x="0" y="0" width="112" height="64" rx="8" fill="#031F10" opacity="0.35"/>

    <!-- Auricular Izquierdo -->
    <rect x="10" y="24" width="9" height="20" rx="4.5" fill="#74D633" stroke="#022B14" stroke-width="1.4"/>
    <rect x="12" y="28" width="5" height="12" rx="2.5" fill="#166534"/>

    <!-- Cabeza Blanca Robot con contorno organico y luz volumetrica -->
    <ellipse cx="54" cy="32" rx="30" ry="24" fill="#FFFFFF" stroke="#022B14" stroke-width="2.4"/>
    <!-- Sombra volumetrica en mejilla derecha -->
    <path d="M 54,8 C 70,8 84,18 84,32 C 84,45 70,56 54,56 C 68,52 76,42 76,32 C 76,22 68,12 54,8 Z" fill="#CBD5E1" opacity="0.45"/>

    <!-- Auricular Derecho (Frontal) -->
    <rect x="80" y="24" width="9" height="20" rx="4.5" fill="#74D633" stroke="#022B14" stroke-width="1.4"/>
    <rect x="82" y="28" width="5" height="12" rx="2.5" fill="#166534"/>

    <!-- Visor Facial Negro Brillante de Pantalla Curva -->
    <rect x="32" y="21" width="44" height="24" rx="8" fill="#021C0E" stroke="#022B14" stroke-width="1.6"/>
    <!-- Reflejo curvo del cristal del visor -->
    <path d="M 36,24 Q 54,21 72,24" stroke="#FFFFFF" stroke-width="1.4" opacity="0.5" fill="none" stroke-linecap="round"/>

    <!-- Ojos Curvados Sonrientes Glowing Green (#74D633) -->
    <path d="M 37,34 C 37,28 47,28 47,34" fill="none" stroke="#74D633" stroke-width="3.6" stroke-linecap="round"/>
    <path d="M 57,34 C 57,28 67,28 67,34" fill="none" stroke="#74D633" stroke-width="3.6" stroke-linecap="round"/>

    <!-- Diadema de Microfono del Asistente -->
    <path d="M 19,38 Q 28,49 40,46" fill="none" stroke="#0F172A" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="40" cy="46" r="3.2" fill="#74D633" stroke="#022B14" stroke-width="1.2"/>

    <!-- Birrete Academico Institucional Verde TdeA -->
    <polygon points="54,1 84,9 54,17 24,9" fill="#00602B" stroke="#022B14" stroke-width="2"/>
    <polygon points="54,1 84,9 54,11 24,9" fill="#00843D"/>
    <ellipse cx="54,17" rx="14" ry="4" fill="#022B14"/>
    <!-- Boton y Borla dorada que cuelga alegremente -->
    <circle cx="54,9" r="2.6" fill="#F59E0B"/>
    <path d="M 54,9 Q 72,12 74,27" fill="none" stroke="#F59E0B" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="74,28" r="2.6" fill="#F59E0B"/>

    <!-- Brazo y Guante Blanco Saludando en el Alfeizar de la Ventana -->
    <path d="M 56,48 Q 78,46 96,48 L 96,56 Q 78,58 56,56 Z" fill="#FFFFFF" stroke="#022B14" stroke-width="1.8"/>
    <!-- Palma verde TdeA -->
    <circle cx="90" cy="52" r="3.6" fill="#74D633"/>
  </g>

  <!-- Reflejo diagonal suave en el cristal de la cabina -->
  <polygon points="46,84 80,24 96,24 62,84" fill="#FFFFFF" opacity="0.28" pointer-events="none"/>
  <!-- Alfeizar de madera calida de la ventana -->
  <rect x="34" y="84" width="124" height="4.5" rx="1.5" fill="#78350F" stroke="#451A03" stroke-width="1"/>

  <!-- =========================================================================
       CALDERA METALICA VERDE TdeA CON CURVATURA ORGANICA Y VOLUMEN
       ========================================================================= -->
  <path d="M 160,48 Q 232,44 304,50 Q 308,82 304,116 Q 232,120 160,116 Z" fill="url(#editorial-train-body)" stroke="#022B14" stroke-width="2.5"/>

  <!-- Brillo especular longitudinal superior (curva de volumen) -->
  <path d="M 164,54 Q 232,50 300,56" stroke="#FFFFFF" stroke-width="3" opacity="0.32" stroke-linecap="round" fill="none"/>
  <!-- Sombra propia en la base de la caldera -->
  <path d="M 162,106 Q 232,110 304,106 L 304,116 Q 232,120 160,116 Z" fill="#000000" opacity="0.14"/>

  <!-- Abrazaderas de bronce dorado con trazo a mano -->
  <g class="boiler-gold-bands">
    <!-- Banda 1 -->
    <path d="M 194,48 Q 192,82 194,116" stroke="url(#editorial-gold-trim)" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M 194,54 Q 193,82 194,110" stroke="#FEF3C7" stroke-width="1.2" stroke-linecap="round"/>
    <!-- Banda 2 -->
    <path d="M 238,47 Q 236,82 238,117" stroke="url(#editorial-gold-trim)" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M 238,53 Q 237,82 238,111" stroke="#FEF3C7" stroke-width="1.2" stroke-linecap="round"/>
    <!-- Banda 3 -->
    <path d="M 280,48 Q 278,82 280,116" stroke="url(#editorial-gold-trim)" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M 280,54 Q 279,82 280,110" stroke="#FEF3C7" stroke-width="1.2" stroke-linecap="round"/>
  </g>

  <!-- Pasamanos de Bronce Pulido -->
  <path d="M 166,58 Q 232,56 298,58" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <circle cx="166" cy="58" r="3" fill="#D97706"/>
  <circle cx="232" cy="57" r="3" fill="#D97706"/>
  <circle cx="298" cy="58" r="3" fill="#D97706"/>

  <!-- Domo de Bronce Central (Curva de campana con brillo especular) -->
  <path d="M 206,48 C 206,30 230,30 230,48 Z" fill="url(#editorial-gold-trim)" stroke="#B45309" stroke-width="2"/>
  <path d="M 210,40 C 212,33 222,33 224,40" stroke="#FFFFFF" stroke-width="1.4" opacity="0.6" fill="none"/>
  <ellipse cx="218" cy="48" rx="12" ry="3.2" fill="#B45309"/>

  <!-- Chimenea Clasica Flared en el Frente (Derecha) -->
  <path d="M 264,48 L 261,20 L 252,14 L 288,14 L 279,20 L 276,48 Z" fill="#022B14" stroke="#005A29" stroke-width="2.2"/>
  <!-- Corona de bronce de la chimenea -->
  <ellipse cx="270" cy="14" rx="18" ry="4.5" fill="#F59E0B" stroke="#FEF3C7" stroke-width="1.6"/>
  <ellipse cx="270" cy="14" rx="12" ry="2.8" fill="#78350F"/>

  <!-- Morro Aerodinamico Redondeado (Derecha) -->
  <path d="M 302,52 Q 330,52 332,82 Q 330,112 302,112 Z" fill="#022B14" stroke="#004D25" stroke-width="2.5"/>
  <!-- Medallon Emblema Oficial TdeA en el morro -->
  <circle cx="320" cy="82" r="10.5" fill="#F59E0B" stroke="#FEF3C7" stroke-width="2.2"/>
  <circle cx="320" cy="82" r="6" fill="#00843D"/>
  <circle cx="320" cy="82" r="2.5" fill="#74D633"/>

  <!-- Faro Delantero de Bronce apuntando hacia la DERECHA -->
  <path d="M 324,72 L 340,70 L 340,94 L 324,92 Z" fill="#D97706" stroke="#92400E" stroke-width="2"/>
  <ellipse cx="334" cy="82" rx="7" ry="9" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1.5"/>
  <circle cx="334" cy="82" r="4" fill="#FFFFFF"/>

  <!-- Haz de Luz Volumetrico Calido Proyectado hacia Adelante -->
  <polygon points="340,76 460,42 460,122 340,88" fill="url(#editorial-headlight-cone)" opacity="0.6"/>

  <!-- Quitapiedras / Cuña Delantera (Cowcatcher) de Acero con Barras Curvadas -->
  <polygon points="304,106 336,136 336,148 304,142" fill="#1E293B" stroke="#475569" stroke-width="1.8"/>
  <polygon points="336,148 336,136 348,142 348,150" fill="#0F172A"/>
  <line x1="310" y1="114" x2="334" y2="142" stroke="#94A3B8" stroke-width="2.2" stroke-linecap="round"/>
  <line x1="316" y1="120" x2="338" y2="147" stroke="#94A3B8" stroke-width="2.2" stroke-linecap="round"/>
  <line x1="322" y1="126" x2="344" y2="149" stroke="#94A3B8" stroke-width="2.2" stroke-linecap="round"/>

  <!-- =========================================================================
       SISTEMA DE RUEDAS DE ACERO Y BIELAS APOYADAS EN EL RIEL (y = 155)
       ========================================================================= -->
  <!-- Rueda Motriz Grande 1 (cx: 88, cy: 127, r: 28 -> base en y = 155) -->
  <g class="train-wheel-rotate" style="transform-origin: 88px 127px;">
    <circle cx="88" cy="127" r="28" fill="#0F172A" stroke="#F59E0B" stroke-width="3.5"/>
    <path d="M 68,107 Q 88,114 108,107" stroke="#FEF3C7" stroke-width="1.2" fill="none"/>
    <circle cx="88" cy="127" r="11" fill="#74D633" stroke="#004D25" stroke-width="1.5"/>
    <line x1="88" y1="99" x2="88" y2="155" stroke="#E2E8F0" stroke-width="2.4"/>
    <line x1="60" y1="127" x2="116" y2="127" stroke="#E2E8F0" stroke-width="2.4"/>
    <line x1="68" y1="107" x2="108" y2="147" stroke="#CBD5E1" stroke-width="2"/>
    <line x1="68" y1="147" x2="108" y2="107" stroke="#CBD5E1" stroke-width="2"/>
    <!-- Contrapeso de fundicion -->
    <path d="M 64,127 A 24 24 0 0 1 112 127 Z" fill="#334155" opacity="0.65"/>
  </g>

  <!-- Rueda Motriz Grande 2 (cx: 160, cy: 127, r: 28 -> base en y = 155) -->
  <g class="train-wheel-rotate" style="transform-origin: 160px 127px;">
    <circle cx="160" cy="127" r="28" fill="#0F172A" stroke="#F59E0B" stroke-width="3.5"/>
    <path d="M 140,107 Q 160,114 180,107" stroke="#FEF3C7" stroke-width="1.2" fill="none"/>
    <circle cx="160" cy="127" r="11" fill="#74D633" stroke="#004D25" stroke-width="1.5"/>
    <line x1="160" y1="99" x2="160" y2="155" stroke="#E2E8F0" stroke-width="2.4"/>
    <line x1="132" y1="127" x2="188" y2="127" stroke="#E2E8F0" stroke-width="2.4"/>
    <line x1="140" y1="107" x2="180" y2="147" stroke="#CBD5E1" stroke-width="2"/>
    <line x1="140" y1="147" x2="180" y2="107" stroke="#CBD5E1" stroke-width="2"/>
    <path d="M 136,127 A 24 24 0 0 1 184 127 Z" fill="#334155" opacity="0.65"/>
  </g>

  <!-- Rueda Motriz Grande 3 (cx: 232, cy: 127, r: 28 -> base en y = 155) -->
  <g class="train-wheel-rotate" style="transform-origin: 232px 127px;">
    <circle cx="232" cy="127" r="28" fill="#0F172A" stroke="#F59E0B" stroke-width="3.5"/>
    <path d="M 212,107 Q 232,114 252,107" stroke="#FEF3C7" stroke-width="1.2" fill="none"/>
    <circle cx="232" cy="127" r="11" fill="#74D633" stroke="#004D25" stroke-width="1.5"/>
    <line x1="232" y1="99" x2="232" y2="155" stroke="#E2E8F0" stroke-width="2.4"/>
    <line x1="204" y1="127" x2="260" y2="127" stroke="#E2E8F0" stroke-width="2.4"/>
    <line x1="212" y1="107" x2="252" y2="147" stroke="#CBD5E1" stroke-width="2"/>
    <line x1="212" y1="147" x2="252" y2="107" stroke="#CBD5E1" stroke-width="2"/>
    <path d="M 208,127 A 24 24 0 0 1 256 127 Z" fill="#334155" opacity="0.65"/>
  </g>

  <!-- Biela de Conexión de Acero / Barra de Transmision (Une las 3 ruedas) -->
  <path d="M 88,124 L 232,124 Q 236,127 232,130 L 88,130 Q 84,127 88,124 Z" fill="#CBD5E1" stroke="#334155" stroke-width="1.8"/>
  <circle cx="88" cy="127" r="4.5" fill="#475569" stroke="#1E293B" stroke-width="1.2"/>
  <circle cx="160" cy="127" r="4.5" fill="#475569" stroke="#1E293B" stroke-width="1.2"/>
  <circle cx="232" cy="127" r="4.5" fill="#475569" stroke="#1E293B" stroke-width="1.2"/>

  <!-- Rueda Bogie Delantera 1 (cx: 288, cy: 138, r: 17 -> base en y = 155) -->
  <g class="train-wheel-rotate" style="transform-origin: 288px 138px;">
    <circle cx="288" cy="138" r="17" fill="#1E293B" stroke="#94A3B8" stroke-width="3"/>
    <circle cx="288" cy="138" r="6.5" fill="#F59E0B"/>
    <line x1="288" y1="121" x2="288" y2="155" stroke="#CBD5E1" stroke-width="2"/>
    <line x1="271" y1="138" x2="305" y2="138" stroke="#CBD5E1" stroke-width="2"/>
  </g>

  <!-- Rueda Bogie Delantera 2 (cx: 324, cy: 138, r: 17 -> base en y = 155) -->
  <g class="train-wheel-rotate" style="transform-origin: 324px 138px;">
    <circle cx="324" cy="138" r="17" fill="#1E293B" stroke="#94A3B8" stroke-width="3"/>
    <circle cx="324" cy="138" r="6.5" fill="#F59E0B"/>
    <line x1="324" y1="121" x2="324" y2="155" stroke="#CBD5E1" stroke-width="2"/>
    <line x1="307" y1="138" x2="341" y2="138" stroke="#CBD5E1" stroke-width="2"/>
  </g>
</svg>

              </div>
            </div>

            </div>
        </div>

        <!-- ===================================================================
             3. FOOTER CON LEYENDA Y PROGRESO DE LA RUTA (SIN E-# NI KM)
             =================================================================== -->
        <footer class="train-route-legend-footer">
          <div style="display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;">
            <div style="display: inline-flex; align-items: center; gap: 0.45rem;">
              <span class="legend-dot green"></span>
              <span><strong>Conocer el terreno:</strong> ${this.s1Done ? 'Completada ✓' : 'En curso'}</span>
            </div>
            <div style="display: inline-flex; align-items: center; gap: 0.45rem;">
              <span class="legend-dot ${this.s1Done ? 'green' : 'gray'}"></span>
              <span><strong>Cuando el camino cambia:</strong> ${this.s2Done ? 'Completada ✓' : (this.s1Done ? 'Habilitada' : 'Bloqueada 🔒')}</span>
            </div>
            <div style="display: inline-flex; align-items: center; gap: 0.45rem;">
              <span class="legend-dot ${this.s2Done ? 'green' : 'gray'}"></span>
              <span><strong>Viajar acompañado:</strong> ${this.s3Done ? 'Completada ✓' : (this.s2Done ? 'Habilitada' : 'Bloqueada 🔒')}</span>
            </div>
          </div>

          <div style="font-size: 0.78rem; color: #64748B;">
            Campus Vital TdeA 2026 · Dirección de Bienestar Institucional
          </div>
        </footer>

      </div>
    `;

    this.bindEvents();
    this.initAudioPlayback();
    this.initGSAPTimeline();
  }

  /* ---------------------------------------------------------------------------
   * CÁLCULO DINÁMICO DE POSICIONES EN LA VÍA
   * --------------------------------------------------------------------------- */
  getStationStopX(stationNum) {
    const node = this.container.querySelector(`#station-node-${stationNum}`);
    const stage = this.container.querySelector('#train-stage-viewport');
    const train = this.container.querySelector('#train-actor-sprite');
    if (!node || !stage || !train) {
      const fallbackPercents = { 1: 0.18, 2: 0.50, 3: 0.82 };
      const stageWidth = stage ? stage.offsetWidth : 960;
      return (stageWidth * (fallbackPercents[stationNum] || 0.18)) - 190;
    }

    const stageRect = stage.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    const trainWidth = train.offsetWidth || 380;

    // Alinear el centro del tren con el centro del waypoint
    const nodeCenterX = nodeRect.left + (nodeRect.width / 2) - stageRect.left;
    return nodeCenterX - (trainWidth * 0.52);
  }

  /* ---------------------------------------------------------------------------
   * INICIALIZACIÓN DE GSAP Y SECUENCIAS CINEMÁTICAS
   * --------------------------------------------------------------------------- */
  initGSAPTimeline() {
    const hasGsap = typeof window.gsap !== 'undefined';
    const trainEl = this.container.querySelector('#train-actor-sprite');
    const bgMid = this.container.querySelector('#parallax-bg-mid');
    const bgNear = this.container.querySelector('#parallax-bg-near');

    if (!trainEl) return;

    if (!hasGsap) {
      trainEl.style.left = this.s1Done ? (this.s2Done ? '80%' : '48%') : '14%';
      return;
    }

    // A) CINEMÁTICA DE ENTRADA INICIAL: El tren viaja hacia adelante (derecha) hacia Conocer el terreno
    if (this.showIntroArrival) {
      const targetX = this.getStationStopX(1);
      const startX = -420;

      window.gsap.set(trainEl, { x: startX, opacity: 1 });
      trainEl.classList.add('train-active');

      this.introTimeline = window.gsap.timeline({
        onComplete: () => {
          this.onTrainArrivedAtStation(1);
        }
      });

      const introDuration = 2.4;

      // Movimiento físico hacia la derecha
      this.introTimeline.to(trainEl, {
        x: targetX,
        duration: introDuration,
        ease: 'power2.out'
      }, 0);

      // Parallax de fondo hacia la izquierda
      if (bgMid) {
        this.introTimeline.to(bgMid, { x: -80, duration: introDuration, ease: 'power1.out' }, 0);
      }
      if (bgNear) {
        this.introTimeline.to(bgNear, { x: -160, duration: introDuration, ease: 'power1.out' }, 0);
      }
    } else {
      // B) Retorno tras completar estaciones o carga directa
      if (this.s1Done && !this.s2Done) {
        const s1X = this.getStationStopX(1);
        const s2X = this.getStationStopX(2);
        
        window.gsap.set(trainEl, { x: s1X });
        trainEl.classList.add('train-active');

        window.gsap.to(trainEl, {
          x: s2X,
          duration: 1.8,
          delay: 0.3,
          ease: 'power2.inOut',
          onComplete: () => {
            this.onTrainArrivedAtStation(2);
          }
        });

        if (bgMid) window.gsap.to(bgMid, { x: '-=60', duration: 1.8, delay: 0.3, ease: 'power1.inOut' });
        if (bgNear) window.gsap.to(bgNear, { x: '-=120', duration: 1.8, delay: 0.3, ease: 'power1.inOut' });

      } else if (this.s2Done && !this.s3Done) {
        const s2X = this.getStationStopX(2);
        const s3X = this.getStationStopX(3);

        window.gsap.set(trainEl, { x: s2X });
        trainEl.classList.add('train-active');

        window.gsap.to(trainEl, {
          x: s3X,
          duration: 1.8,
          delay: 0.3,
          ease: 'power2.inOut',
          onComplete: () => {
            this.onTrainArrivedAtStation(3);
          }
        });

        if (bgMid) window.gsap.to(bgMid, { x: '-=60', duration: 1.8, delay: 0.3, ease: 'power1.inOut' });
        if (bgNear) window.gsap.to(bgNear, { x: '-=120', duration: 1.8, delay: 0.3, ease: 'power1.inOut' });

      } else if (this.s3Done) {
        const s3X = this.getStationStopX(3);
        window.gsap.set(trainEl, { x: s3X });
        this.activateMilestonePost(10);
      } else {
        const s1X = this.getStationStopX(1);
        window.gsap.set(trainEl, { x: s1X });
        this.onTrainArrivedAtStation(1);
      }
    }
  }

  /**
   * Se ejecuta al frenar el tren en una estación
   */
  onTrainArrivedAtStation(stationNum) {
    const trainEl = this.container.querySelector('#train-actor-sprite');
    if (trainEl) {
      trainEl.classList.remove('train-active');
      trainEl.classList.add('is-braking');
      setTimeout(() => trainEl.classList.remove('is-braking'), 500);
    }

    const kmValues = { 1: 0, 2: 5, 3: 10 };
    this.activateMilestonePost(kmValues[stationNum]);

    if (stationNum === 1) {
      const cta1 = this.container.querySelector('#cta-st1');
      if (cta1) {
        cta1.style.display = 'flex';
        if (window.gsap) {
          window.gsap.fromTo(cta1, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)' });
        }
      }
      const skipBtn = this.container.querySelector('#btn-skip-cinematic');
      if (skipBtn) skipBtn.style.display = 'none';

      const status = this.container.querySelector('#train-global-status');
      if (status) status.textContent = '📍 Parada actual: Conocer el terreno';

    } else if (stationNum === 2) {
      this.unlockStationNodeUI(2);
    } else if (stationNum === 3) {
      this.unlockStationNodeUI(3);
    }
  }

  /**
   * Ilumina físicamente el hito kilométrico al llegar el tren
   */
  activateMilestonePost(km) {
    // Hitos inferiores retirados a solicitud del usuario (Imagen 2)
  }

  /**
   * Desbloquea la estación con animación moderna, retira candado y activa halo
   */
  unlockStationNodeUI(stationNum) {
    const node = this.container.querySelector(`#station-node-${stationNum}`);
    const btn = this.container.querySelector(`#btn-station-${stationNum}`);
    const iconWrap = this.container.querySelector(`#icon-st${stationNum}-main`);
    const cta = this.container.querySelector(`#cta-st${stationNum}`);
    const status = this.container.querySelector('#train-global-status');
    const building = this.container.querySelector(`#station-building-${stationNum}`);

    if (node) {
      node.classList.remove('is-locked');
      node.classList.add('is-active');
    }

    if (building) {
      building.classList.remove('is-locked');
      building.classList.add('is-active');
    }

    if (btn) {
      btn.removeAttribute('disabled');
      btn.classList.add('celebrate-unlock');
      setTimeout(() => btn.classList.remove('celebrate-unlock'), 800);
    }

    if (iconWrap) {
      if (stationNum === 2) {
        iconWrap.innerHTML = `
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#00843D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" stroke="#00843D" stroke-width="1.8"/>
            <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="#00843D" stroke-width="1.8"/>
            <path d="M8 14h8" stroke="#74D633" stroke-width="2"/>
            <path d="M12 11v6" stroke="#74D633" stroke-width="2"/>
          </svg>
        `;
      } else if (stationNum === 3) {
        iconWrap.innerHTML = `
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#00843D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="5" r="2.5" fill="#74D633" stroke="#00843D" stroke-width="1.5"/>
            <circle cx="5" cy="18" r="2.5" fill="#74D633" stroke="#00843D" stroke-width="1.5"/>
            <circle cx="19" cy="18" r="2.5" fill="#74D633" stroke="#00843D" stroke-width="1.5"/>
            <line x1="12" y1="7.5" x2="5" y2="15.5" stroke="#00843D" stroke-width="1.8"/>
            <line x1="12" y1="7.5" x2="19" y2="15.5" stroke="#00843D" stroke-width="1.8"/>
            <line x1="7.5" y1="18" x2="16.5" y2="18" stroke="#00843D" stroke-width="1.8"/>
          </svg>
        `;
      }
    }

    if (cta) {
      cta.style.display = 'flex';
      if (window.gsap) {
        window.gsap.fromTo(cta, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)' });
      }
    }

    if (status) {
      const titles = {
        1: '📍 Parada actual: Conocer el terreno',
        2: '📍 Parada actual: Cuando el camino cambia',
        3: '📍 Parada final: Viajar acompañado'
      };
      status.textContent = titles[stationNum] || '📍 Parada actual';
    }
  }

  /**
   * Transición de cámara (Zoom-In) al hacer clic en la estación activa
   */
  zoomInToStation(stationNum) {
    const stage = this.container.querySelector('#train-stage-viewport');
    const camera = this.container.querySelector('#camera-zoom-stage');
    const node = this.container.querySelector(`#station-node-${stationNum}`);
    const hasGsap = typeof window.gsap !== 'undefined';

    if (!camera || !node || !hasGsap) {
      if (this.onSelectStation) this.onSelectStation(stationNum);
      return;
    }

    const stageRect = stage.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    const originX = ((nodeRect.left + (nodeRect.width / 2) - stageRect.left) / stageRect.width) * 100;
    const originY = ((nodeRect.top + (nodeRect.height / 2) - stageRect.top) / stageRect.height) * 100;

    camera.style.transformOrigin = `${originX}% ${originY}%`;

    window.gsap.to(camera, {
      scale: 1.55,
      opacity: 0.15,
      duration: 0.85,
      ease: 'power2.in',
      onComplete: () => {
        if (this.onSelectStation) this.onSelectStation(stationNum);
      }
    });
  }

  /**
   * Vinculación de eventos de la interfaz
   */
  bindEvents() {
    const btn1 = this.container.querySelector('#btn-station-1');
    const btn2 = this.container.querySelector('#btn-station-2');
    const btn3 = this.container.querySelector('#btn-station-3');
    const skipBtn = this.container.querySelector('#btn-skip-cinematic');
    const transToggle = this.container.querySelector('#btn-train-transcript-toggle');
    const transBox = this.container.querySelector('#train-voiceover-transcript');
    const transCloseX = this.container.querySelector('#btn-close-transcript-x');
    const resetBtn = this.container.querySelector('#btn-train-reset-journey');

    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.introTimeline) {
          this.introTimeline.progress(1);
        }
        skipBtn.style.display = 'none';
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.onResetJourney) {
          this.onResetJourney();
        } else {
          this.resetInternalJourney();
        }
      });
    }

    if (btn1) {
      btn1.addEventListener('click', (e) => {
        e.preventDefault();
        this.pauseAudio();
        this.zoomInToStation(1);
      });
    }

    if (btn2) {
      btn2.addEventListener('click', (e) => {
        e.preventDefault();
        if (!this.s1Done) {
          this.shakeButton(btn2);
          return;
        }
        this.pauseAudio();
        this.zoomInToStation(2);
      });
    }

    if (btn3) {
      btn3.addEventListener('click', (e) => {
        e.preventDefault();
        if (!this.s2Done) {
          this.shakeButton(btn3);
          return;
        }
        this.pauseAudio();
        this.zoomInToStation(3);
      });
    }

    if (transToggle && transBox) {
      transToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const isHidden = transBox.style.display === 'none';
        transBox.style.display = isHidden ? 'block' : 'none';
        transToggle.classList.toggle('active', isHidden);
      });
    }

    if (transCloseX && transBox) {
      transCloseX.addEventListener('click', (e) => {
        e.preventDefault();
        transBox.style.display = 'none';
        if (transToggle) transToggle.classList.remove('active');
      });
    }
  }

  /**
   * Resetea el viaje internamente si no se pasó callback externo
   */
  resetInternalJourney() {
    this.s1Done = false;
    this.s2Done = false;
    this.s3Done = false;
    this.showIntroArrival = true;
    this.arrivalFinished = false;
    this.render();
  }

  /**
   * Inicializa la reproducción de audio con autoplay suave o sintetizador ambiental
   */
  initAudioPlayback() {
    this.audioEl = this.container.querySelector('#train-voiceover-audio');
    const audioBtn = this.container.querySelector('#btn-train-audio-toggle');
    const audioIcon = this.container.querySelector('#train-audio-icon');
    const audioText = this.container.querySelector('#train-audio-text');
    const soundwave = this.container.querySelector('#train-soundwave');

    if (!audioBtn) return;

    const setPlayingUI = () => {
      audioBtn.classList.add('is-playing');
      if (audioIcon) audioIcon.textContent = '⏸';
      if (audioText) audioText.textContent = 'Pausar voz en off';
      if (soundwave) soundwave.style.display = 'inline-flex';
    };

    const setPausedUI = () => {
      audioBtn.classList.remove('is-playing');
      if (audioIcon) audioIcon.textContent = '▶';
      if (audioText) audioText.textContent = 'Escuchar voz en off';
      if (soundwave) soundwave.style.display = 'none';
    };

    if (this.autoStart && this.audioEl && this.showIntroArrival) {
      this.audioEl.currentTime = 0;
      const playPromise = this.audioEl.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setPlayingUI();
          })
          .catch(() => {
            setPausedUI();
          });
      }
    }

    audioBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (this.audioEl) {
        if (this.audioEl.paused) {
          const p = this.audioEl.play();
          if (p !== undefined) {
            p.then(() => setPlayingUI())
             .catch(() => {
               this.playAmbientSynth();
               setPlayingUI();
             });
          }
        } else {
          this.audioEl.pause();
          this.stopAmbientSynth();
          setPausedUI();
        }
      } else {
        if (!this.synthIsPlaying) {
          this.playAmbientSynth();
          setPlayingUI();
        } else {
          this.stopAmbientSynth();
          setPausedUI();
        }
      }
    });

    if (this.audioEl) {
      this.audioEl.addEventListener('ended', () => {
        setPausedUI();
      });
    }
  }

  /**
   * Generador de sonido ambiente pedagógico si el MP3 no está disponible
   */
  playAmbientSynth() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.synthAudioContext) this.synthAudioContext = new AudioCtx();
      if (this.synthAudioContext.state === 'suspended') this.synthAudioContext.resume();

      this.synthIsPlaying = true;
      const osc = this.synthAudioContext.createOscillator();
      const gain = this.synthAudioContext.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, this.synthAudioContext.currentTime); // Frecuencia armónica de bienestar
      gain.gain.setValueAtTime(0.001, this.synthAudioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, this.synthAudioContext.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.synthAudioContext.destination);
      osc.start();

      this._ambientOsc = osc;
      this._ambientGain = gain;
    } catch (_) {}
  }

  stopAmbientSynth() {
    try {
      if (this._ambientGain && this.synthAudioContext) {
        this._ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.synthAudioContext.currentTime + 0.4);
        setTimeout(() => {
          if (this._ambientOsc) this._ambientOsc.stop();
          this.synthIsPlaying = false;
        }, 450);
      }
    } catch (_) {
      this.synthIsPlaying = false;
    }
  }

  pauseAudio() {
    if (this.audioEl && !this.audioEl.paused) {
      this.audioEl.pause();
    }
    this.stopAmbientSynth();
    const audioBtn = this.container.querySelector('#btn-train-audio-toggle');
    const audioIcon = this.container.querySelector('#train-audio-icon');
    const audioText = this.container.querySelector('#train-audio-text');
    const soundwave = this.container.querySelector('#train-soundwave');
    if (audioBtn) audioBtn.classList.remove('is-playing');
    if (audioIcon) audioIcon.textContent = '▶';
    if (audioText) audioText.textContent = 'Escuchar voz en off';
    if (soundwave) soundwave.style.display = 'none';
  }

  shakeButton(el) {
    if (!el) return;
    el.classList.add('is-shaking');
    setTimeout(() => el.classList.remove('is-shaking'), 420);
  }
}
