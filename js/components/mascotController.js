/**
 * Controlador Interactivo de la Mascota Territorio TdeA
 * Asistente Virtual de Asesorías Territorio TdeA - Ciencias Básicas
 * 
 * Gestiona:
 * 1. Inyección de SVG vectorial editable por capas independientes (#birrete, #cabeza, #ojos, #microfono, #libro, #burbuja).
 * 2. Animaciones visuales: respiración continua, parpadeo periódico y animación de saludo.
 * 3. Control de sesión con sessionStorage (el saludo inicial se reproduce 1 sola vez por sesión).
 * 4. Re-saludo interactivo al hacer clic en la mascota.
 * 5. Módulo opcional de síntesis de voz (SpeechSynthesis API) preparado para activación cuando se requiera.
 */

// Bandera para activación de voz (opcional, deshabilitada por defecto según requerimiento)
export const MASCOT_VOICE_CONFIG = {
  enabled: false, // Cambiar a true cuando se desee activar el audio de bienvenida
  message: "¡Hola! Te damos la bienvenida a Territorio TdeA, tu portal de asesorías académicas en Ciencias Básicas. ¿En qué podemos orientarte hoy?",
  lang: 'es-CO',
  rate: 0.98,
  pitch: 1.08
};

const SESSION_STORAGE_KEY = 'tdea_mascot_welcomed_v1';

/**
 * Retorna el marcado HTML del SVG de la mascota con capas independientes
 * @param {Object} options
 * @param {string} [options.id='mascota-tdea-hero'] Identificador del elemento SVG
 * @param {string} [options.className='gov-hero-mascot-svg'] Clases CSS adicionales
 * @param {boolean} [options.isInteractive=true] Habilitar interactividad al hacer clic
 * @returns {string} Código SVG vectorial
 */
export function getMascotSvgHtml({ id = 'mascota-tdea-hero', className = 'gov-hero-mascot-svg', isInteractive = true } = {}) {
  const interactiveClass = isInteractive ? 'tdea-mascot-interactive' : '';

  return `
    <div class="mascot-svg-wrapper ${className}" id="${id}-wrapper" title="Mascota institucional Territorio TdeA · Haz clic para saludar">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%" id="${id}" class="tdea-mascot-svg ${interactiveClass}" role="img" aria-label="Mascota Asistente Virtual Territorio TdeA">
        <defs>
          <filter id="${id}-drop-shadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#022B14" flood-opacity="0.32" />
          </filter>
          <filter id="${id}-eyes-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#74D633" flood-opacity="0.85" />
          </filter>
          <filter id="${id}-bubble-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#022B14" flood-opacity="0.25" />
          </filter>

          <linearGradient id="${id}-badge-bg-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0C6533" />
            <stop offset="55%" stop-color="#074E26" />
            <stop offset="100%" stop-color="#022A14" />
          </linearGradient>

          <linearGradient id="${id}-robot-white-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="65%" stop-color="#F3F6F9" />
            <stop offset="100%" stop-color="#D9E2EC" />
          </linearGradient>

          <linearGradient id="${id}-screen-visor-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0F4A27" />
            <stop offset="60%" stop-color="#09381E" />
            <stop offset="100%" stop-color="#031F10" />
          </linearGradient>

          <linearGradient id="${id}-mortarboard-top-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#145A32" />
            <stop offset="100%" stop-color="#08371C" />
          </linearGradient>

          <linearGradient id="${id}-headphone-lime-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#88E638" />
            <stop offset="60%" stop-color="#6BC923" />
            <stop offset="100%" stop-color="#469218" />
          </linearGradient>

          <linearGradient id="${id}-book-cover-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#58A82C" />
            <stop offset="100%" stop-color="#246C18" />
          </linearGradient>

          <style>
            #${id} {
              overflow: visible;
              transform-origin: 250px 250px;
            }
            #${id} .mascota-anim-respiracion {
              transform-origin: 250px 320px;
              animation: mascotAnimBreathe 3.8s infinite ease-in-out;
            }
            @keyframes mascotAnimBreathe {
              0%, 100% { transform: translateY(0px) scale(1); }
              50% { transform: translateY(-5px) scale(1.014); }
            }
            #${id} .mascota-anim-ojos {
              transform-origin: 250px 245px;
              animation: mascotAnimBlink 4.2s infinite ease-in-out;
            }
            @keyframes mascotAnimBlink {
              0%, 91%, 100% { transform: scaleY(1); }
              95.5% { transform: scaleY(0.08); }
            }
            #${id} .mascota-anim-borla {
              transform-origin: 250px 96px;
              animation: mascotAnimTassel 3.8s infinite ease-in-out;
            }
            @keyframes mascotAnimTassel {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(3.8deg); }
            }
            #${id} .mascota-anim-burbuja {
              transform-origin: 370px 315px;
              animation: mascotAnimBubblePulse 3.2s infinite ease-in-out;
            }
            @keyframes mascotAnimBubblePulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.06); }
            }
            #${id}.is-greeting .mascota-anim-saludo {
              animation: mascotAnimGreetingWave 1.4s ease-out;
            }
            #${id}.is-greeting .mascota-anim-burbuja {
              animation: mascotAnimBubblePop 1.4s ease-out;
            }
            @keyframes mascotAnimGreetingWave {
              0% { transform: scale(0.95); }
              25% { transform: rotate(-5deg) scale(1.04); }
              55% { transform: rotate(4deg) scale(1.03); }
              80% { transform: rotate(-1.5deg) scale(1.01); }
              100% { transform: rotate(0deg) scale(1); }
            }
            @keyframes mascotAnimBubblePop {
              0% { transform: scale(0); opacity: 0; }
              40% { transform: scale(1.22); opacity: 1; }
              70% { transform: scale(0.95); opacity: 1; }
              100% { transform: scale(1); opacity: 1; }
            }
            #${id}.tdea-mascot-interactive {
              cursor: pointer;
              transition: filter 0.25s ease, transform 0.25s ease;
            }
            #${id}.tdea-mascot-interactive:hover {
              filter: drop-shadow(0 6px 14px rgba(116, 214, 51, 0.45));
              transform: scale(1.03);
            }
            #${id}.tdea-mascot-interactive:active {
              transform: scale(0.97);
            }
          </style>
        </defs>

        <!-- CAPA FONDO: Insignia circular institucional -->
        <circle id="${id}-fondo" cx="250" cy="250" r="236" fill="url(#${id}-badge-bg-grad)" />
        <circle id="${id}-fondo-aro" cx="250" cy="250" r="230" fill="none" stroke="#74D633" stroke-width="1.5" opacity="0.3" />

        <!-- CONTENEDOR ANIMADO CON RESPIRACIÓN Y SALUDO -->
        <g id="${id}-cuerpo-animado" class="mascota-anim-respiracion mascota-anim-saludo">

          <!-- CAPA 1: LIBRO (Base y pecho del robot) -->
          <g id="${id}-libro" class="mascota-capa-libro capa-libro" data-layer="libro" filter="url(#${id}-drop-shadow)">
            <path d="M 80 412 Q 168 382 250 446 Q 332 382 420 412 L 410 428 Q 328 396 250 460 Q 172 396 90 428 Z" fill="#1B5E14" />
            <path d="M 80 402 Q 168 372 250 436 Q 332 372 420 402 L 420 414 Q 332 384 250 450 Q 168 384 80 414 Z" fill="url(#${id}-book-cover-grad)" />
            <path d="M 96 396 Q 172 366 250 426 Q 328 366 404 396 L 398 386 Q 328 356 250 416 Q 172 356 102 386 Z" fill="#D9E2EC" />
            <path d="M 102 386 Q 176 356 250 414 Q 324 356 398 386 L 392 376 Q 324 346 250 406 Q 176 346 108 376 Z" fill="#EDF2F7" />
            <path d="M 108 376 Q 180 346 250 402 Q 320 346 392 376 L 388 366 Q 320 336 250 394 Q 180 336 114 366 Z" fill="#FFFFFF" />
            <path d="M 158 378 Q 250 338 342 378 L 314 402 Q 250 372 186 402 Z" fill="#EDF2F7" />
            <path d="M 172 364 Q 250 328 328 364 L 316 376 Q 250 348 184 376 Z" fill="#FFFFFF" />
          </g>

          <!-- CAPA 2: CABEZA (Casco blanco, auriculares y pantalla facial) -->
          <g id="${id}-cabeza" class="mascota-capa-cabeza capa-cabeza" data-layer="cabeza">
            <ellipse cx="250" cy="245" rx="142" ry="124" fill="url(#${id}-robot-white-grad)" filter="url(#${id}-drop-shadow)" />
            <path d="M 166 172 Q 250 144 334 172 Q 250 156 166 172 Z" fill="#FFFFFF" opacity="0.9" />

            <g id="${id}-auricular-izq" transform="rotate(-3 112 250)">
              <rect x="86" y="206" width="50" height="88" rx="25" ry="25" fill="url(#${id}-headphone-lime-grad)" filter="url(#${id}-drop-shadow)" />
              <rect x="94" y="218" width="17" height="64" rx="8.5" ry="8.5" fill="#2E6B12" opacity="0.55" />
            </g>

            <g id="${id}-auricular-der" transform="rotate(3 388 250)">
              <rect x="364" y="206" width="50" height="88" rx="25" ry="25" fill="url(#${id}-headphone-lime-grad)" filter="url(#${id}-drop-shadow)" />
              <rect x="389" y="218" width="17" height="64" rx="8.5" ry="8.5" fill="#2E6B12" opacity="0.55" />
            </g>

            <rect id="${id}-visor" x="144" y="172" width="212" height="138" rx="44" ry="44" fill="url(#${id}-screen-visor-grad)" />
            <path d="M 160 196 Q 250 174 332 186 Q 250 182 160 204 Z" fill="#FFFFFF" opacity="0.13" />
          </g>

          <!-- CAPA 3: OJOS (Capa independiente con parpadeo animado) -->
          <g id="${id}-ojos" class="mascota-capa-ojos capa-ojos mascota-anim-ojos" data-layer="ojos" filter="url(#${id}-eyes-glow)">
            <path d="M 180 248 C 180 221, 224 221, 224 248" fill="none" stroke="#FFFFFF" stroke-width="14" stroke-linecap="round" />
            <path d="M 276 248 C 276 221, 320 221, 320 248" fill="none" stroke="#FFFFFF" stroke-width="14" stroke-linecap="round" />
          </g>

          <!-- CAPA 4: MICRÓFONO (Diadema metálica y cápsula) -->
          <g id="${id}-microfono" class="mascota-capa-microfono capa-microfono" data-layer="microfono">
            <path d="M 126 288 Q 155 320 206 316" fill="none" stroke="#162E22" stroke-width="9.5" stroke-linecap="round" />
            <rect x="200" y="303" width="36" height="25" rx="12.5" ry="12.5" fill="#0C4524" stroke="#74D633" stroke-width="2.5" />
          </g>

          <!-- CAPA 5: BIRRETE (Graduation cap con logo TdeA y borla dorada oscilante) -->
          <g id="${id}-birrete" class="mascota-capa-birrete capa-birrete" data-layer="birrete" filter="url(#${id}-drop-shadow)">
            <path d="M 154 150 Q 250 178 346 150 L 332 116 Q 250 136 168 116 Z" fill="#09381E" />
            <g id="${id}-birrete-logo" transform="translate(210, 124) scale(0.48)">
              <circle cx="28" cy="28" r="23" fill="#FFFFFF" />
              <path d="M 18 28 Q 28 14 38 28 Q 28 22 18 28 Z" fill="#09381E" />
              <circle cx="28" cy="18" r="5.2" fill="#09381E" />
              <text x="56" y="36" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" letter-spacing="0.8">TdeA</text>
            </g>
            <polygon points="250,48 424,124 250,158 76,124" fill="#74D633" />
            <polygon points="250,40 420,118 250,150 80,118" fill="url(#${id}-mortarboard-top-grad)" />
            <polygon points="250,40 250,150 80,118" fill="#042011" opacity="0.3" />
            <circle cx="250" cy="95" r="9.5" fill="#FACC15" stroke="#CA8A04" stroke-width="2" />

            <g id="${id}-borla" class="mascota-anim-borla">
              <path d="M 250 95 Q 325 92 366 135" fill="none" stroke="#FACC15" stroke-width="5.5" stroke-linecap="round" />
              <circle cx="366" cy="140" r="7.5" fill="#FACC15" stroke="#B45309" stroke-width="1.8" />
              <path d="M 358 148 L 374 148 L 382 188 L 350 188 Z" fill="#EAB308" stroke="#CA8A04" stroke-width="1.2" />
              <line x1="358" y1="188" x2="358" y2="176" stroke="#A16207" stroke-width="1.8" />
              <line x1="366" y1="188" x2="366" y2="176" stroke="#A16207" stroke-width="1.8" />
              <line x1="374" y1="188" x2="374" y2="176" stroke="#A16207" stroke-width="1.8" />
            </g>
          </g>

          <!-- CAPA 6: BURBUJA DE CONVERSACIÓN (Diálogo flotante con puntos ...) -->
          <g id="${id}-burbuja" class="mascota-capa-burbuja capa-burbuja mascota-anim-burbuja" data-layer="burbuja" filter="url(#${id}-bubble-shadow)">
            <polygon points="340,320 340,375 370,320" fill="#74D633" />
            <polygon points="346,322 346,363 366,322" fill="#FFFFFF" />
            <rect x="318" y="268" width="138" height="88" rx="34" ry="34" fill="#FFFFFF" stroke="#74D633" stroke-width="8.5" />
            <circle cx="355" cy="312" r="8.5" fill="#4B8B27" />
            <circle cx="387" cy="312" r="8.5" fill="#4B8B27" />
            <circle cx="419" cy="312" r="8.5" fill="#4B8B27" />
          </g>

        </g>
      </svg>
    </div>
  `;
}

/**
 * Inicializa la lógica de interacción de la mascota dentro de un contenedor
 * @param {HTMLElement} containerElement Contenedor donde está el SVG
 * @param {string} [svgId='mascota-tdea-hero'] Identificador del SVG
 */
export function initMascotController(containerElement, svgId = 'mascota-tdea-hero') {
  if (!containerElement) return;

  const svgEl = containerElement.querySelector(`#${svgId}`);
  if (!svgEl) return;

  // 1. Control de saludo de bienvenida por sesión
  const hasWelcomed = sessionStorage.getItem(SESSION_STORAGE_KEY) === 'true';

  if (!hasWelcomed) {
    // Activar saludo visual de bienvenida
    triggerGreetingAnimation(svgEl);
    sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');

    // Reproducción opcional de voz de bienvenida
    if (MASCOT_VOICE_CONFIG.enabled) {
      playMascotWelcomeVoice();
    }
  }

  // 2. Interacción al hacer clic / pulsar sobre la mascota
  svgEl.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerGreetingAnimation(svgEl);

    // Si la voz está habilitada o se solicita voluntariamente al hacer clic
    if (MASCOT_VOICE_CONFIG.enabled) {
      playMascotWelcomeVoice({ force: true });
    }
  });
}

/**
 * Dispara la animación de saludo en la mascota
 * @param {SVGElement} svgEl Elemento SVG de la mascota
 */
export function triggerGreetingAnimation(svgEl) {
  if (!svgEl) return;
  svgEl.classList.remove('is-greeting');
  // Forzar reflujo para reiniciar la animación CSS
  void svgEl.offsetWidth;
  svgEl.classList.add('is-greeting');

  setTimeout(() => {
    svgEl.classList.remove('is-greeting');
  }, 1600);
}

/**
 * Reproducción de voz institucional mediante Web SpeechSynthesis API (Funcionalidad Opcional)
 * @param {Object} options
 * @param {boolean} [options.force=false] Forzar reproducción aunque esté pausada
 */
export function playMascotWelcomeVoice({ force = false } = {}) {
  if (!('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis API no está soportada en este navegador.');
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Detener cualquier síntesis previa

    const utterance = new SpeechSynthesisUtterance(MASCOT_VOICE_CONFIG.message);
    utterance.lang = MASCOT_VOICE_CONFIG.lang;
    utterance.rate = MASCOT_VOICE_CONFIG.rate;
    utterance.pitch = MASCOT_VOICE_CONFIG.pitch;

    // Buscar voz en español disponible
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(v => v.lang.startsWith('es-CO') || v.lang.startsWith('es') || v.name.toLowerCase().includes('spanish'));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.info('Reproducción de voz omitida por restricciones del navegador:', err);
  }
}

// Exportar helper global para que pueda probarse o activarse en cualquier momento desde la consola o UI
if (typeof window !== 'undefined') {
  window.__tdeaMascotController = {
    triggerGreeting: (id) => {
      const el = document.getElementById(id || 'mascota-tdea-hero');
      if (el) triggerGreetingAnimation(el);
    },
    playVoice: () => playMascotWelcomeVoice({ force: true }),
    setVoiceEnabled: (state) => {
      MASCOT_VOICE_CONFIG.enabled = !!state;
      console.info(`🎙️ Síntesis de voz de la mascota: ${MASCOT_VOICE_CONFIG.enabled ? 'ACTIVADA' : 'DESACTIVADA'}`);
    }
  };
}
