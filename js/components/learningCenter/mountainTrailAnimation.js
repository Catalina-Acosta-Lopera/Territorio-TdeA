/**
 * Animación del Sendero de la Montaña · Módulo 2: "Elegir el rumbo"
 * Centro de Aprendizaje - Campus Vital TdeA
 *
 * Basado en la nueva arquitectura interactiva de "Robot en la montaña.html".
 * Flujo narrativo gamificado en 3 fases:
 *  1. El robot escala hasta la entrada de la Ruta 1 (300, 384), pulsa la señal 1 y ofrece el botón para hacer las actividades.
 *  2. Al volver de la Ruta 1, el robot camina hasta la bandera (330, 296), la clava con confeti y camina a la entrada de la Ruta 2 (362, 296), pulsando la señal 2 y ofreciendo el botón para hacer las actividades de adaptación.
 *  3. Al volver de la Ruta 2, el robot escala por la montaña hasta coronar la cumbre (400, 118) con celebración y confeti, ofreciendo el botón para el Cierre y Reconocimiento.
 */

export class MountainTrailAnimation {
  constructor(options = {}) {
    this.container = options.container;
    this.r1Done = Boolean(options.r1Done);
    this.r2Done = Boolean(options.r2Done);
    this.onSelectRoute = options.onSelectRoute || (() => {});
    this.onSelectCierre = options.onSelectCierre || (() => {});

    this.busy = false;
    this.sx = 1;
    this.tok = 0;
    this.raf = null;
    this.EL = {};
    this.SEG = {
      C:  'M400 455C350 452 300 440 290 410C285 396 295 388 300 384',
      R1: 'M300 384C335 358 275 340 295 312C305 304 318 300 330 296',
      W:  'M330 296C340 301 350 301 362 296',
      R2: 'M362 296C395 298 435 292 448 268C464 246 425 232 412 212C404 198 402 160 400 118'
    };
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="mountain-experience-root animate-fade-in" role="region" aria-label="Sendero de la Montaña - Recorrido Interactivo Módulo 2">
        
        <!-- Barra de cabecera de la escena -->
        <div class="mountain-scene-header">
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <span class="mountain-scene-badge">🏔️ Sendero Universitario</span>
            <h3 class="mountain-scene-title">Elegir el rumbo · Ascenso a la Montaña</h3>
          </div>
          <div style="font-size: 0.82rem; font-weight: 700; color: #d3efd3;">
            ${this.r1Done && this.r2Done 
              ? '🏆 Cumbre Alcanzada (2/2 Rutas completadas)' 
              : (this.r1Done 
                  ? '🚩 Ruta 1 completada · Ruta 2 abierta' 
                  : '⏳ Tramo 1: Camino a la Ruta 1')}
          </div>
        </div>

        <!-- Lienzo Escénico SVG Proporcional (800x520 con margen superior para la cumbre) -->
        <div class="mountain-canvas-wrapper" id="m2-canvas-wrapper">
          <svg id="mountain-scene" viewBox="-80 -10 960 520" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Lienzo panorámico de montaña con el robot escalando senderos">
            <defs>
              <linearGradient id="m2-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#0b4a35"/>
                <stop offset="0.55" stop-color="#2a8f67"/>
                <stop offset="1" stop-color="#d3efd3"/>
              </linearGradient>
              <linearGradient id="m2-mt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#6aa690"/>
                <stop offset="1" stop-color="#3a6e5b"/>
              </linearGradient>
              <linearGradient id="m2-shell" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#ffffff"/>
                <stop offset="1" stop-color="#d3e2dc"/>
              </linearGradient>
              <linearGradient id="m2-mint" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#d6f4e4"/>
                <stop offset="1" stop-color="#7fc6a5"/>
              </linearGradient>
              <linearGradient id="m2-visor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#1b4034"/>
                <stop offset="1" stop-color="#04120c"/>
              </linearGradient>
              <linearGradient id="m2-cap" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#23925f"/>
                <stop offset="1" stop-color="#0b5136"/>
              </linearGradient>
              <filter id="m2-glow" x="-30%" y="-60%" width="160%" height="220%">
                <feGaussianBlur stdDeviation="1.6" result="b"/>
                <feMerge>
                  <feMergeNode in="b"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <radialGradient id="m2-gl">
                <stop offset="0" stop-color="#fff6c0" stop-opacity="0.8"/>
                <stop offset="1" stop-color="#fff6c0" stop-opacity="0"/>
              </radialGradient>
            </defs>

            <!-- Cielo y Atmósfera Panorámica -->
            <rect x="-300" y="-80" width="1400" height="650" fill="url(#m2-sky)"/>
            <g id="m2-stars"></g>
            <circle cx="400" cy="110" r="180" fill="url(#m2-gl)"/>

            <!-- Nubes sutiles con movimiento horizontal continuo -->
            <g opacity="0.85">
              <g class="m2-cl" style="--d:90s;--dl:-20s">
                <ellipse cx="0" cy="90" rx="70" ry="13" fill="#fff" opacity="0.45"/>
                <ellipse cx="28" cy="82" rx="40" ry="13" fill="#fff" opacity="0.5"/>
              </g>
              <g class="m2-cl" style="--d:130s;--dl:-90s">
                <ellipse cx="0" cy="150" rx="90" ry="14" fill="#fff" opacity="0.35"/>
                <ellipse cx="-25" cy="141" rx="45" ry="13" fill="#fff" opacity="0.4"/>
              </g>
            </g>

            <!-- Cordillera lejana panorámica -->
            <path d="M-300 420 L0 400 L90 300Q130 270 170 300L260 380L330 320Q360 300 390 330L470 400L560 310Q600 280 640 310L800 410 L1100 420 V520 H-300Z" fill="#7fb3a0" opacity="0.55"/>

            <!-- Montaña principal con sombreado y pico nevado -->
            <path d="M30 475L150 350Q190 320 235 355Q275 300 320 245Q362 180 400 96Q440 165 480 225Q520 285 560 315Q600 335 640 345L775 475Z" fill="url(#m2-mt)"/>
            <path d="M400 96Q440 165 480 225Q520 285 560 315Q600 335 640 345L775 475H440Q450 340 425 230Z" fill="#1c4a3b" opacity="0.4"/>
            <path d="M400 96L368 168Q380 160 389 175Q398 160 407 177Q418 161 428 175Q437 165 446 171Q426 134 400 96Z" fill="#f4fbf6"/>
            <path d="M400 96L446 171Q437 165 428 175Q418 161 407 177Q412 140 400 96Z" fill="#cfe4da"/>

            <!-- Red de senderos y caminos empedrados -->
            <g id="m2-net"></g>

            <!-- Checkpoint Intermedio: Bandera de la Ruta 1 (330, 296) -->
            <g id="m2-mid" transform="translate(330 296)">
              <ellipse rx="24" ry="6.5" fill="#cdbd8f" opacity="0.6"/>
              <circle id="m2-slot" r="9" fill="none" stroke="#ffe27a" stroke-width="2" stroke-dasharray="3 4"/>
              <g id="m2-mflag">
                <path d="M0 0V-36" stroke="#5a3a12" stroke-width="2.4" stroke-linecap="round"/>
                <path class="m2-flag" d="M0 -36Q10 -40 20 -35Q28 -31 35 -35V-21Q28 -17 20 -21Q10 -26 0 -21Z" fill="#ffb940"/>
              </g>
            </g>

            <!-- Señal interactiva 1: Entrada a la Ruta 1 (270 372) -->
            <g class="m2-sign" id="m2-s1" transform="translate(270 372)" role="button" tabindex="0" aria-label="Entrada Ruta 1" title="Haz clic para comenzar la Ruta 1">
              <title>Haz clic para comenzar la Ruta 1</title>
              <path d="M0 0V16" stroke="#6b4a2f" stroke-width="3"/>
              <circle cy="-2" r="11" fill="#ffd36b" stroke="#8a5a1f" stroke-width="2"/>
              <text y="3" text-anchor="middle" font-weight="800" font-size="12" fill="#5a3a12">1</text>
              <rect x="-30" y="-26" width="60" height="15" rx="5" fill="#0f3b2a" opacity="0.88"/>
              <text x="0" y="-15" text-anchor="middle" font-weight="800" font-size="8.5" fill="#d3efd3">RUTA 1</text>
              
              <!-- Llamado de atención visual explícito: ¡Haz clic aquí! -->
              <g class="m2-click-callout" id="m2-s1-callout" style="cursor: pointer;">
                <rect x="-42" y="-10" width="84" height="20" rx="10" fill="#ffd95a" stroke="#ffffff" stroke-width="1.8" filter="drop-shadow(0 2px 7px rgba(0,0,0,0.45))"/>
                <text x="0" y="3.5" text-anchor="middle" font-size="8.8" font-weight="900" fill="#382004">👆 ¡CLIC AQUÍ!</text>
                <!-- Triángulo apuntador hacia la señal 1 -->
                <polygon points="-5,10 5,10 0,16" fill="#ffd95a" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.3))"/>
              </g>
            </g>

            <!-- Señal interactiva 2: Entrada a la Ruta 2 (384 276) -->
            <g class="m2-sign ${!this.r1Done ? 'lock' : ''}" id="m2-s2" transform="translate(384 276)" role="button" tabindex="0" aria-label="Entrada Ruta 2" title="Haz clic para comenzar la Ruta 2">
              <title>Haz clic para comenzar la Ruta 2</title>
              <path d="M0 0V16" stroke="#6b4a2f" stroke-width="3"/>
              <circle cy="-2" r="11" fill="#ffd36b" stroke="#8a5a1f" stroke-width="2"/>
              <text y="3" text-anchor="middle" font-weight="800" font-size="12" fill="#5a3a12">2</text>
              <rect x="-30" y="-26" width="60" height="15" rx="5" fill="#0f3b2a" opacity="0.88"/>
              <text x="0" y="-15" text-anchor="middle" font-weight="800" font-size="8.5" fill="#d3efd3">RUTA 2</text>

              <!-- Llamado de atención visual explícito: ¡Haz clic aquí! -->
              <g class="m2-click-callout" id="m2-s2-callout" style="display: none; cursor: pointer;">
                <rect x="-42" y="-10" width="84" height="20" rx="10" fill="#ffd95a" stroke="#ffffff" stroke-width="1.8" filter="drop-shadow(0 2px 7px rgba(0,0,0,0.45))"/>
                <text x="0" y="4" text-anchor="middle" font-size="9.5" font-weight="900" fill="#022b14">👆 ¡CLIC AQUÍ!</text>
              </g>
            </g>

            <!-- Bandera de la Cumbre (Meta final) -->
            <g id="m2-summit-flag" transform="translate(414 120)" style="cursor: pointer;" role="button" tabindex="0" aria-label="Cumbre">
              <path d="M0 0V-38" stroke="#5a3a12" stroke-width="2.4" stroke-linecap="round"/>
              <path class="m2-flag" d="M0 -38Q10 -42 20 -37Q28 -33 36 -37V-22Q28 -18 20 -22Q10 -27 0 -22Z" fill="#2fbf7a"/>
              <rect x="-26" y="-55" width="52" height="15" rx="5" fill="#022b14" opacity="0.9"/>
              <text x="0" y="-44" text-anchor="middle" font-weight="800" font-size="8.5" fill="#ffd95a">CUMBRE</text>
            </g>

            <!-- Terreno base y vegetación panorámica -->
            <path d="M-300 520 V458 Q0 458 150 432 Q300 456 450 454 T800 442 Q950 446 1100 458 V520Z" fill="#1d6b49"/>
            <g id="m2-trees"></g>
            <path d="M-300 520 V478 Q0 478 200 462 Q400 480 600 470 T800 470 Q950 472 1100 478 V520Z" fill="#145238"/>

            <!-- Robot Mascota Oficial TdeA (Vector puro animado) -->
            <g id="m2-robot" transform="translate(400 455)" style="cursor: pointer;" role="button" tabindex="0" title="Haz clic para entrar a la Ruta 1">
              <ellipse cx="0" cy="2" rx="16" ry="3.6" fill="#000" opacity="0.3"/>
              <g id="m2-flip">
                <g transform="scale(0.64)" class="idle" id="m2-rb">
                  <g class="bodyb">
                    <!-- Pierna Izquierda -->
                    <g transform="translate(-8 -20)">
                      <g class="legL">
                        <rect x="-5" y="-2" width="10" height="16" rx="5" fill="url(#m2-mint)"/>
                        <path d="M-8 14Q-9 8 -3 7L5 7Q10 8 9 14Q9 18 4 18H-5Q-8 18 -8 14Z" fill="url(#m2-shell)"/>
                        <path d="M-8 15.5H9" stroke="#8fd1b2" stroke-width="2.4" stroke-linecap="round"/>
                      </g>
                    </g>
                    <!-- Pierna Derecha -->
                    <g transform="translate(8 -20)">
                      <g class="legR">
                        <rect x="-5" y="-2" width="10" height="16" rx="5" fill="url(#m2-mint)"/>
                        <path d="M-8 14Q-9 8 -3 7L5 7Q10 8 9 14Q9 18 4 18H-5Q-8 18 -8 14Z" fill="url(#m2-shell)"/>
                        <path d="M-8 15.5H9" stroke="#8fd1b2" stroke-width="2.4" stroke-linecap="round"/>
                      </g>
                    </g>
                    <!-- Brazo Izquierdo -->
                    <g transform="translate(-19 -46)">
                      <g class="armL">
                        <rect x="-4.5" y="-3" width="9" height="22" rx="4.5" fill="url(#m2-shell)"/>
                        <circle cy="19" r="5.6" fill="url(#m2-mint)"/>
                        <circle cy="-1" r="4.4" fill="url(#m2-mint)"/>
                      </g>
                    </g>
                    <!-- Torso y Pecho con Escudo TdeA -->
                    <path d="M-19 -52Q-22 -30 -12 -21Q0 -15 12 -21Q22 -30 19 -52Q0 -58 -19 -52Z" fill="url(#m2-mint)"/>
                    <ellipse cx="0" cy="-39" rx="11.5" ry="10" fill="url(#m2-shell)"/>
                    <path d="M0 -32C-7 -37 -6 -44 0 -41C6 -44 7 -37 0 -32Z" fill="#2c9a68"/>
                    <path d="M-3 -40Q-5 -41 -4.5 -38" stroke="#fff" stroke-width="1.2" fill="none" opacity="0.7"/>
                    <!-- Brazo Derecho -->
                    <g transform="translate(19 -46)">
                      <g class="armR">
                        <rect x="-4.5" y="-3" width="9" height="22" rx="4.5" fill="url(#m2-shell)"/>
                        <circle cy="19" r="5.6" fill="url(#m2-mint)"/>
                        <circle cy="-1" r="4.4" fill="url(#m2-mint)"/>
                      </g>
                    </g>
                    <!-- Cuello -->
                    <rect x="-7" y="-58" width="14" height="8" rx="3" fill="#0b2a20"/>
                    <!-- Cabeza y Visor -->
                    <g transform="translate(0 -78)">
                      <!-- Diadema / Auriculares -->
                      <path d="M-32 -12Q-32 -35 0 -35Q32 -35 32 -12" stroke="#a9dc52" stroke-width="4" fill="none"/>
                      <ellipse cx="-33" cy="-2" rx="6.5" ry="10.5" fill="#b9e85e"/>
                      <ellipse cx="-33" cy="-2" rx="3.6" ry="6.5" fill="#eaf8dc"/>
                      <ellipse cx="33" cy="-2" rx="6.5" ry="10.5" fill="#b9e85e"/>
                      <ellipse cx="33" cy="-2" rx="3.6" ry="6.5" fill="#eaf8dc"/>
                      <!-- Carcasa de cabeza -->
                      <rect x="-31" y="-28" width="62" height="54" rx="25" fill="url(#m2-shell)"/>
                      <!-- Pantalla visor -->
                      <rect x="-25" y="-21" width="50" height="38" rx="18" fill="url(#m2-visor)"/>
                      <path d="M-20 -14Q-6 -19 6 -17Q-10 -12 -20 -4Z" fill="#fff" opacity="0.13"/>
                      <!-- Ojos LED brillantes -->
                      <g filter="url(#m2-glow)">
                        <path d="M-17 4Q-11 -7 -5 4M5 4Q11 -7 17 4" stroke="#62ffa4" stroke-width="3.8" fill="none" stroke-linecap="round"/>
                      </g>
                      <!-- Micrófono -->
                      <path d="M-33 8Q-33 21 -17 22" stroke="#7bbf3c" stroke-width="2.4" fill="none" stroke-linecap="round"/>
                      <circle cx="-15" cy="22" r="3.2" fill="#52b043"/>
                      <!-- Birrete Universitario TdeA -->
                      <path d="M-41 -34L0 -50L41 -34L0 -21Z" fill="url(#m2-cap)"/>
                      <path d="M-41 -34L0 -21L41 -34V-31L0 -17L-41 -31Z" fill="#06402a"/>
                      <path d="M-22 -28V-20Q0 -11 22 -20V-28L0 -21Z" fill="#0a5a3a"/>
                      <circle cx="0" cy="-35" r="2.4" fill="#e8b53a"/>
                      <path d="M0 -35Q26 -44 37 -33L38 -22" stroke="#e8b53a" stroke-width="1.8" fill="none"/>
                      <g transform="translate(38 -22)">
                        <g class="tas">
                          <rect x="-2.6" y="0" width="5.2" height="11" rx="2.6" fill="#f2c94c"/>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </g>

            <!-- Contenedor para explosiones de Confeti -->
            <g id="m2-conf"></g>
          </svg>
        </div>

        <!-- Barra de Controles e Interacción Inferior -->
        <div class="mountain-ui-bar">
          <div id="m2-msg" class="mountain-msg-bubble" aria-live="polite">
            Preparando ascenso…
          </div>

          <div class="mountain-buttons-row">
            <!-- Botón Principal de Acción Dinámica -->
            <button type="button" id="m2-bAction" class="mountain-route-btn action-primary">
              <b>🌱 Iniciar Recorrido</b>
              <span>Ascendiendo hacia la Ruta 1…</span>
            </button>

            <!-- Botón Reiniciar animación visual -->
            <button type="button" id="m2-bR" class="mountain-route-btn ghost" title="Repetir animación del sendero">
              ↺ Repetir caminata
            </button>
          </div>
        </div>

        <!-- Barra de Progreso y Estado de Rutas -->
        <div class="mountain-status-bar">
          <div class="mountain-status-item" id="m2-status-r1" style="cursor: pointer;" title="Haz clic para entrar o repasar la Ruta 1">
            <span class="mountain-status-dot ${this.r1Done ? 'is-done' : 'is-active'}"></span>
            <span>Ruta 1 (Proyecto de Vida): <strong>${this.r1Done ? 'Completada ✓ (Clic para repasar)' : 'En curso'}</strong></span>
          </div>

          <div class="mountain-status-item" id="m2-status-r2" style="${this.r1Done ? 'cursor: pointer;' : 'opacity: 0.6;'}" title="${this.r1Done ? 'Haz clic para entrar o repasar la Ruta 2' : 'Bloqueada hasta completar Ruta 1'}">
            <span class="mountain-status-dot ${this.r2Done ? 'is-done' : (this.r1Done ? 'is-active' : 'is-locked')}"></span>
            <span>Ruta 2 (Adaptación Universitaria): <strong>${this.r2Done ? 'Completada ✓ (Clic para repasar)' : (this.r1Done ? 'Desbloqueada 🚀 (Clic para entrar)' : 'Bloqueada 🔒')}</strong></span>
          </div>

          <div class="mountain-status-item" id="m2-status-cierre" style="${this.r1Done && this.r2Done ? 'cursor: pointer;' : 'opacity: 0.6;'}" title="${this.r1Done && this.r2Done ? 'Haz clic para ver el Cierre' : 'Pendiente'}">
            <span class="mountain-status-dot ${this.r1Done && this.r2Done ? 'is-done' : 'is-locked'}"></span>
            <span>Cumbre del Rumbo: <strong>${this.r1Done && this.r2Done ? 'Alcanzada 🏆 (Clic para ver)' : 'Pendiente'}</strong></span>
          </div>
        </div>

      </div>
    `;

    this.initScene();
    this.startStorySequence();

    // Habilitar clics en la barra de estado de rutas
    const stR1 = this.container.querySelector('#m2-status-r1');
    if (stR1) {
      stR1.onclick = () => this.onSelectRoute(1);
    }
    const stR2 = this.container.querySelector('#m2-status-r2');
    if (stR2) {
      if (this.r1Done) {
        stR2.onclick = () => this.onSelectRoute(2);
      }
    }
    const stCierre = this.container.querySelector('#m2-status-cierre');
    if (stCierre) {
      if (this.r1Done && this.r2Done) {
        stCierre.onclick = () => this.onSelectCierre();
      }
    }
  }

  initScene() {
    const NS = 'http://www.w3.org/2000/svg';
    const $ = id => this.container.querySelector('#' + id);
    const mk = (t, a) => {
      const e = document.createElementNS(NS, t);
      for (const k in a) e.setAttribute(k, a[k]);
      return e;
    };

    // 1. Estrellas titilantes
    const starsGroup = $('m2-stars');
    if (starsGroup) {
      starsGroup.innerHTML = '';
      for (let i = 0; i < 34; i++) {
        const c = mk('circle', {
          cx: Math.random() * 1100 - 150,
          cy: Math.random() * 160 - 20,
          r: Math.random() * 1.2 + 0.4,
          fill: '#fff',
          class: 'm2-tw'
        });
        c.style.animationDelay = -Math.random() * 3 + 's';
        starsGroup.appendChild(c);
      }
    }

    // 2. Vegetación y pinos meciéndose
    const treesGroup = $('m2-trees');
    if (treesGroup) {
      treesGroup.innerHTML = '';
      const treeConfigs = [
        [-50, 0.9], [0, 1.1], [30, 1], [78, 0.8], [135, 1.1], [205, 0.85], [262, 0.7],
        [560, 0.75], [622, 1], [690, 0.85], [748, 1.1], [805, 0.9], [855, 1.05]
      ];
      treeConfigs.forEach(([x, s]) => {
        const o = mk('g', { transform: `translate(${x} ${462 + (s * 4)}) scale(${s})` });
        const g = mk('g', { class: 'm2-tree' });
        g.style.animationDelay = -Math.random() * 5 + 's';
        o.appendChild(g);
        g.innerHTML = `
          <rect x="-2" y="-6" width="4" height="10" fill="#5a4636"/>
          <path d="M0 -52Q14 -30 16 -14Q0 -18 -16 -14Q-14 -30 0 -52Z" fill="#2f7d58"/>
          <path d="M0 -40Q18 -20 20 -4Q0 -8-20 -4Q-18 -20 0 -40Z" fill="#256a49"/>
        `;
        treesGroup.appendChild(o);
      });
    }

    // 3. Senderos (bed y trail para C, R1, W, R2)
    const netGroup = $('m2-net');
    this.EL = {};
    if (netGroup) {
      netGroup.innerHTML = '';
      for (const k in this.SEG) {
        netGroup.appendChild(mk('path', { d: this.SEG[k], class: 'm2-bed' }));
        const t = mk('path', { d: this.SEG[k], class: 'm2-trail' });
        netGroup.appendChild(t);
        this.EL[k] = t;
      }
    }

    // Bindeo del botón reiniciar
    const bR = $('m2-bR');
    if (bR) {
      bR.onclick = () => {
        this.tok++;
        this.busy = false;
        this.startStorySequence(true);
      };
    }
  }

  put(x, y) {
    const robot = this.container.querySelector('#m2-robot');
    if (robot) {
      robot.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    }
  }

  setState(s) {
    const rb = this.container.querySelector('#m2-rb');
    if (rb) {
      rb.setAttribute('class', s);
    }
  }

  setMessage(html) {
    const msg = this.container.querySelector('#m2-msg');
    if (msg) {
      msg.innerHTML = html;
    }
  }

  updateActionButton(title, subtitle, onClick) {
    const btn = this.container.querySelector('#m2-bAction');
    if (btn) {
      btn.innerHTML = `<b>${title}</b><span>${subtitle}</span>`;
      btn.onclick = onClick;
      btn.disabled = false;
    }
  }

  confetti(x, y, n = 28) {
    const conf = this.container.querySelector('#m2-conf');
    if (!conf) return;
    const NS = 'http://www.w3.org/2000/svg';
    const cols = ['#ffd95a', '#7dffb0', '#ff8fa3', '#ffffff', '#8fd0ff'];
    for (let i = 0; i < n; i++) {
      const c = document.createElementNS(NS, 'rect');
      c.setAttribute('x', x);
      c.setAttribute('y', y);
      c.setAttribute('width', '5');
      c.setAttribute('height', '8');
      c.setAttribute('rx', '1.5');
      c.setAttribute('fill', cols[i % cols.length]);

      const a = Math.random() * Math.PI * 2;
      const sp = 45 + Math.random() * 95;
      c.style.cssText = `--x:${Math.cos(a) * sp}px;--y:${Math.sin(a) * sp * 0.8 + 25}px;--r:${Math.random() * 720}deg;--t:${1.3 + Math.random() * 0.8}s;transform-box:fill-box;transform-origin:center;`;
      c.setAttribute('class', 'cf');
      conf.appendChild(c);
    }

    setTimeout(() => {
      if (conf) conf.innerHTML = '';
    }, 2800);
  }

  move(k, animState, myTok) {
    return new Promise(resolve => {
      const e0 = this.EL[k];
      if (!e0) return resolve(false);

      this.setState(animState);
      e0.classList.add('on');

      const L = e0.getTotalLength();
      // Velocidad ajustada para animación placentera y visible
      const speed = (k === 'W') ? 45 : 62;
      const dur = (L / speed) * 1000;
      const t0 = performance.now();
      const flip = this.container.querySelector('#m2-flip');

      const step = (now) => {
        if (myTok !== this.tok) return resolve(false);

        const p = Math.min(1, (now - t0) / dur);
        const e = p * 0.85 + (0.5 - 0.5 * Math.cos(Math.PI * p)) * 0.15;
        const pt = e0.getPointAtLength(e * L);
        const nx = e0.getPointAtLength(Math.min(L, e * L + 4));
        const dx = nx.x - pt.x;

        if (Math.abs(dx) > 0.2) {
          this.sx += ((dx < 0 ? -1 : 1) - this.sx) * 0.12;
        }
        this.put(pt.x, pt.y);
        if (flip) {
          flip.setAttribute('transform', `scale(${this.sx.toFixed(2)} 1)`);
        }

        if (p < 1) {
          this.raf = requestAnimationFrame(step);
        } else {
          if (flip) flip.setAttribute('transform', 'scale(1 1)');
          resolve(true);
        }
      };

      this.raf = requestAnimationFrame(step);
    });
  }

  /**
   * Ejecuta la secuencia narrativa en base al progreso del estudiante
   */
  async startStorySequence(isReplay = false) {
    const $ = id => this.container.querySelector('#' + id);
    const mflag = $('m2-mflag');
    const slot = $('m2-slot');
    const s1 = $('m2-s1');
    const s2 = $('m2-s2');
    const summitFlag = $('m2-summit-flag');
    const flip = $('m2-flip');
    const conf = $('m2-conf');

    // Incrementar token de animación
    const myTok = ++this.tok;
    if (this.raf) cancelAnimationFrame(this.raf);
    if (flip) flip.setAttribute('transform', 'scale(1 1)');
    if (conf) conf.innerHTML = '';
    this.container.querySelectorAll('.m2-trail').forEach(t => t.classList.remove('on'));
    if (s1) s1.classList.remove('pulse');
    if (s2) s2.classList.remove('pulse');

    // FASE 1: Estudiante nuevo -> El robot escala a la entrada de la Ruta 1 (300, 384)
    if (!this.r1Done) {
      this.put(400, 455);
      this.setState('idle');
      if (mflag) mflag.classList.remove('plant');
      if (slot) slot.classList.remove('hide');
      if (s2) s2.classList.add('lock');

      this.setMessage('🧗 El robot empieza a escalar la ladera hacia la <strong>Ruta 1</strong>…');
      this.updateActionButton('🌱 Iniciar Actividades de la Ruta 1', 'Construyendo mi proyecto de vida →', () => {
        this.onSelectRoute(1);
      });

      // Breve pausa inicial y luego escalar
      await new Promise(r => setTimeout(r, 600));
      if (myTok !== this.tok) return;

      const ok = await this.move('C', 'climb', myTok);
      if (!ok || myTok !== this.tok) return;

      this.setState('idle');
      if (s1) s1.classList.add('pulse');
      this.setMessage('📍 ¡El robot llegó a la <strong>Ruta 1</strong>! Haz clic en la <strong>Ruta 1 (👆 ¡CLIC AQUÍ!)</strong> o en el botón de abajo para comenzar.');
      this.updateActionButton('🌱 Entrar a la Ruta 1', 'Comenzar las 4 actividades →', () => {
        this.onSelectRoute(1);
      });

      const onGoR1 = () => this.onSelectRoute(1);
      if (s1) {
        s1.onclick = onGoR1;
        s1.onmouseenter = () => {
          if (msg) msg.innerHTML = '👉 <strong>¡Haz clic en la Ruta 1!</strong> Comenzarás tus 4 actividades de Proyecto de Vida.';
        };
        s1.onmouseleave = () => {
          if (msg) msg.innerHTML = '📍 ¡El robot llegó a la <strong>Ruta 1</strong>! Haz clic en la <strong>bandera 1</strong> o en el botón de abajo para comenzar.';
        };
      }
      const rb = $('m2-robot');
      if (rb) {
        rb.onclick = onGoR1;
        rb.style.cursor = 'pointer';
        rb.onmouseenter = () => {
          if (msg) msg.innerHTML = '👉 <strong>¡Haz clic en el Robot o en la Ruta 1!</strong> Comenzarás tus 4 actividades.';
        };
        rb.onmouseleave = () => {
          if (msg) msg.innerHTML = '📍 ¡El robot llegó a la <strong>Ruta 1</strong>! Haz clic en la <strong>bandera 1</strong> o en el botón de abajo para comenzar.';
        };
      }
      return;
    }

    // FASE 2: Ruta 1 completada, pero Ruta 2 pendiente -> El robot camina a la bandera y luego a la entrada de la Ruta 2
    if (this.r1Done && !this.r2Done) {
      if (this.EL.C) this.EL.C.classList.add('on');
      this.put(300, 384);
      this.setState('idle');
      if (s2) s2.classList.remove('lock');

      // IMPORTANTE: Permitir que s1 (Ruta 1) sea clickeable para volver a repasarla
      if (s1) {
        s1.style.cursor = 'pointer';
        s1.onclick = () => this.onSelectRoute(1);
        s1.onmouseenter = () => {
          if (msg) msg.innerHTML = '🌱 <strong>Ruta 1 (Completada):</strong> Haz clic para repasar tus actividades de Proyecto de Vida.';
        };
        s1.onmouseleave = () => {
          if (msg) msg.innerHTML = '👉 ¡Listo para comenzar la <strong>Ruta 2</strong>! Haz clic en la <strong>Ruta 2 (👉 ¡CLIC AQUÍ!)</strong> o en el botón de abajo.';
        };
      }

      this.setMessage('🚶 El robot avanza por el sendero hacia la bandera de la <strong>Ruta 1</strong>…');
      this.updateActionButton('🚀 Iniciar Actividades de la Ruta 2', 'Adaptación a la vida universitaria →', () => {
        this.onSelectRoute(2);
      });

      await new Promise(r => setTimeout(r, 600));
      if (myTok !== this.tok) return;

      // 1. Caminar tramo R1 hasta la bandera
      const okR1 = await this.move('R1', 'walk', myTok);
      if (!okR1 || myTok !== this.tok) return;

      this.setState('win');
      if (slot) slot.classList.add('hide');
      if (mflag) mflag.classList.add('plant');
      this.confetti(330, 290, 24);
      this.setMessage('🏁 ¡Bandera ganada! Avanzando hacia el punto de partida de la <strong>Ruta 2</strong>…');

      await new Promise(r => setTimeout(r, 1200));
      if (myTok !== this.tok) return;

      // 2. Caminar tramo W hacia el inicio de la Ruta 2
      const okW = await this.move('W', 'walk', myTok);
      if (!okW || myTok !== this.tok) return;

      this.setState('idle');
      if (s2) s2.classList.add('pulse');
      const s2Callout = $('m2-s2-callout');
      if (s2Callout) s2Callout.style.display = 'block';
      const s1Callout = $('m2-s1-callout');
      if (s1Callout) s1Callout.style.display = 'none';

      this.setMessage('📍 ¡Listo para comenzar la <strong>Ruta 2</strong>! Haz clic en la <strong>Ruta 2 (👆 ¡CLIC AQUÍ!)</strong> o en el botón de abajo para comenzar tus actividades.');
      this.updateActionButton('🚀 Entrar a la Ruta 2', 'Comenzar las 4 actividades →', () => {
        this.onSelectRoute(2);
      });

      const onGoR2 = () => this.onSelectRoute(2);
      if (s2) {
        s2.onclick = onGoR2;
        s2.style.cursor = 'pointer';
        s2.onmouseenter = () => {
          if (msg) msg.innerHTML = '👉 <strong>¡Haz clic en la Ruta 2!</strong> Comenzarás tus actividades de Adaptación Universitaria.';
        };
        s2.onmouseleave = () => {
          if (msg) msg.innerHTML = '📍 ¡Listo para comenzar la <strong>Ruta 2</strong>! Haz clic en la <strong>Ruta 2 (👆 ¡CLIC AQUÍ!)</strong> o en el botón de abajo para comenzar tus actividades.';
        };
      }
      const rb = $('m2-robot');
      if (rb) {
        rb.onclick = onGoR2;
        rb.style.cursor = 'pointer';
        rb.onmouseenter = () => {
          if (msg) msg.innerHTML = '👉 <strong>¡Haz clic en el Robot o en la Ruta 2!</strong> Comenzarás tus 4 actividades.';
        };
        rb.onmouseleave = () => {
          if (msg) msg.innerHTML = '📍 ¡Listo para comenzar la <strong>Ruta 2</strong>! Haz clic en la <strong>Ruta 2 (👆 ¡CLIC AQUÍ!)</strong> o en el botón de abajo para comenzar tus actividades.';
        };
      }
      return;
    }

    // FASE 3: Ambas rutas completadas -> El robot escala hasta la cumbre nevada
    if (this.r1Done && this.r2Done) {
      if (this.EL.C) this.EL.C.classList.add('on');
      if (this.EL.R1) this.EL.R1.classList.add('on');
      if (this.EL.W) this.EL.W.classList.add('on');
      if (mflag) mflag.classList.add('plant');
      if (slot) slot.classList.add('hide');
      if (s2) s2.classList.remove('lock');

      this.put(362, 296);
      this.setState('idle');
      this.setMessage('🧗 El robot emprende el ascenso final hacia la <strong>cumbre de la montaña</strong>…');
      this.updateActionButton('🏆 Ver Cierre y Reconocimiento', 'Tarjeta final de culminación →', () => {
        this.onSelectCierre();
      });

      await new Promise(r => setTimeout(r, 700));
      if (myTok !== this.tok) return;

      // Escalar tramo R2 hasta la cima
      const okR2 = await this.move('R2', 'climb', myTok);
      if (!okR2 || myTok !== this.tok) return;

      this.setState('win');
      this.confetti(400, 112, 40);
      this.setMessage('🏆 ¡Coronaste la cima! Haz clic en la <strong>Cumbre</strong> o en el botón de abajo para ver tu reconocimiento.');
      this.updateActionButton('🏆 Ver Cierre y Reconocimiento', 'Ver mensaje final y descargar tarjeta →', () => {
        this.onSelectCierre();
      });

      if (summitFlag) {
        summitFlag.onclick = () => this.onSelectCierre();
      }

      // IMPORTANTE: Habilitar SIEMPRE el reingreso libre a las Rutas 1 y 2 cuando ambas están completadas
      if (s1) {
        s1.style.cursor = 'pointer';
        s1.onclick = () => this.onSelectRoute(1);
        s1.onmouseenter = () => {
          if (msg) msg.innerHTML = '🌱 <strong>Ruta 1 (Proyecto de Vida):</strong> Haz clic para ingresar y repasar las 4 actividades.';
        };
        s1.onmouseleave = () => {
          if (msg) msg.innerHTML = '🎉 ¡Coronaste la cima! Haz clic en la <strong>Cumbre</strong> o en las <strong>Rutas 1 y 2</strong> para repasarlas.';
        };
      }
      if (s2) {
        s2.style.cursor = 'pointer';
        s2.classList.remove('lock');
        s2.onclick = () => this.onSelectRoute(2);
        s2.onmouseenter = () => {
          if (msg) msg.innerHTML = '🧗 <strong>Ruta 2 (Adaptación Universitaria):</strong> Haz clic para ingresar y repasar las 4 actividades.';
        };
        s2.onmouseleave = () => {
          if (msg) msg.innerHTML = '🎉 ¡Coronaste la cima! Haz clic en la <strong>Cumbre</strong> o en las <strong>Rutas 1 y 2</strong> para repasarlas.';
        };
      }
      return;
    }
  }
}
