/**
 * Centro de Aprendizaje - Campus Vital TdeA
 * Pantalla Principal Optimizada con la Estética Institucional Limpia (Referencia Imagen 1 y Boceto)
 *
 * Estructura:
 * 1. Barra de Navegación Superior:
 *    - Breadcrumb: Inicio / Campus Vital / Centro de Aprendizaje
 *    - Botón de retorno al Inicio / Menú Principal.
 * 2. Tarjeta Banner Institucional Campus Vital (Imagen 1):
 *    - Gradiente institucional verde profundo (#022B14 a #08632E)
 *    - Avatar circular con la mascota oficial abrazando el corazón
 *    - Tag institucional: 🌱 BIENESTAR INSTITUCIONAL · CIENCIAS BÁSICAS
 *    - Título: Campus Vital: Bienestar Emocional y Afrontamiento Universitario
 *    - Descripción psicoeducativa oficial
 * 3. Vitrina de Accesos Destacados y Serie de Podcasts DUA
 * 4. Título Destacado: Centro de Aprendizaje
 * 5. Tarjeta de Videojuego (Stage Card Verde):
 *    - Izquierda: Robot amigable 3D redondeado blanco (Referencia Imagen 2).
 *    - Derecha: Botones limpios, directos y sin textos excesivos:
 *      [ 🎙️ Módulo 1 ]
 *      [ 🧘 Módulo 2 ]
 */

import { getRobotFullBodySvg } from './robotFullBodySvg.js';
import { learningCenterState } from './learningCenterState.js';
import { Module1View } from './module1View.js?v=20261109_11';
import { Module2View } from './module2View.js?v=20261109_10';
import { Module3View } from './module3View.js?v=20261109_10';
import { RESOURCES_DATA, getResourceById } from '../../data/resourcesData.js';
import { ResourceCard } from '../resourceCard.js';

export class LearningCenterView {
  constructor(containerEl, onGoBackToHome) {
    this.containerEl = containerEl;
    this.onGoBackToHome = onGoBackToHome;
    this.currentView = 'menu'; // 'menu' | 'module1' | 'module2' | 'module3' | 'review_all'
    this.module1View = null;
    this.module2View = null;
    this.module3View = null;
    this.unsubscribeState = null;
    this.robotSpeechTimeout = null;
    this.robotAnimTimeout = null;
  }

  render(flowData = {}) {
    if (!this.containerEl) return;

    if (!this.unsubscribeState) {
      this.unsubscribeState = learningCenterState.subscribe(() => {
        if (this.currentView === 'menu') {
          this.updateMenuBadges();
        }
      });
    }

    if (this.currentView === 'module1') {
      this.renderModule1();
    } else if (this.currentView === 'module2') {
      this.renderModule2();
    } else if (this.currentView === 'module3') {
      this.renderModule3();
    } else if (this.currentView === 'review_all') {
      this.renderReviewAll();
    } else {
      this.renderMenu();
    }
  }

  renderMenu() {
    this.currentView = 'menu';
    const m1 = learningCenterState.state.module1;
    const m2 = learningCenterState.state.module2;
    const m3 = learningCenterState.state.module3 || {};

    const m1Completed = m1.completed || Boolean(m1.equipaje?.closing?.completed) || (m1.audio?.hasAudio && Boolean(m1.caseDaniel?.answerText));
    const m2Completed = Boolean(m2.completed || (m2.ruta1?.completed && m2.ruta2?.completed));
    const m3Completed = Boolean(m3.completed || m3.cierre?.completed);


    this.containerEl.innerHTML = `
      <section class="game-ui-root animate-fade-in" aria-label="Campus Vital y Centro de Aprendizaje">

        <!-- ===================================================================
             1. BARRA SUPERIOR DE NAVEGACIÓN Y RETORNO
             =================================================================== -->
        <header class="game-top-nav-bar">
          <div class="game-nav-left">
            <button type="button" class="game-btn-icon-back" id="game-btn-return-vital" title="Volver a Campus Vital" aria-label="Volver a Campus Vital">
              <span aria-hidden="true">←</span>
            </button>
            <div class="game-nav-breadcrumbs">
              <span class="game-nav-home-icon" aria-hidden="true">🏠</span>
              <a href="#/home" class="game-nav-crumb" id="crumb-nav-home">Inicio</a>
              <span class="game-nav-sep">/</span>
              <a href="#/campus_vital" class="game-nav-crumb" id="crumb-nav-vital">Campus Vital</a>
              <span class="game-nav-sep">/</span>
              <span class="game-nav-current">Centro de Aprendizaje</span>
            </div>
            <button type="button" class="game-btn-pill-back" id="game-btn-return-vital-pill">
              <span>← Volver a Campus Vital</span>
            </button>
          </div>

          <div class="game-nav-right">
            <span class="game-nav-title-sub">Centro de Aprendizaje · Campus Vital</span>
            <button type="button" class="game-btn-pill-main-menu" id="game-btn-reset-global" style="background: rgba(239, 68, 68, 0.15); border: 1.5px solid #EF4444; color: #DC2626;" title="Borrar todo el progreso y comenzar de cero">
              <span>🔄 Empezar de cero</span>
            </button>
            <button type="button" class="game-btn-pill-main-menu" id="game-btn-main-menu">
              <span aria-hidden="true">🏠</span>
              <span>Menú Principal</span>
            </button>
          </div>
        </header>

        <!-- ===================================================================
             2. TÍTULO SECCIÓN: CENTRO DE APRENDIZAJE
             =================================================================== -->
        <div class="game-section-heading-wrap animate-fade-in">
          <div class="game-heading-line"></div>
          <div class="game-title-header-block">
            <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.4rem;">
              <span>🌱</span>
              <span>CAMPUS VITAL · ENTORNO VIRTUAL INTERACTIVO</span>
            </div>
            <h1 class="game-main-title">Centro de Aprendizaje</h1>
            <p class="game-main-subtitle">
              Espacio lúdico y formativo para reflexionar sobre tu adaptación a la vida universitaria y aprender a reconocer y gestionar tus emociones.
            </p>
          </div>
          <div class="game-heading-line"></div>
        </div>

        <!-- ===================================================================
             3. TARJETA PRINCIPAL VERDE DE VIDEOJUEGO (STAGE CARD)
             - Izquierda: Robot amigable 3D redondeado oficial TdeA
             - Derecha: Botones limpios de videojuego [ Módulo 1 ] y [ Módulo 2 ]
             =================================================================== -->
        <div class="game-stage-card">
          <div class="game-stage-card-inner">

            <!-- Lado Izquierdo: Mascota Oficial TdeA (Propuesta Nueva, Tierna y Amigable sin botones de acciones) -->
            <div class="game-robot-character-col" id="game-robot-col">
              
              <!-- Comentario amigable del robot posicionado ARRIBA de la cabeza -->
              <div class="game-robot-speech-bubble-top animate-fade-in" id="game-robot-speech-bubble">
                <span class="game-callout-pulse"></span>
                <span id="game-robot-speech-text">¡Hola! Soy tu guía de Campus Vital 🌱 Selecciona un módulo para comenzar</span>
                <div class="game-speech-tail"></div>
              </div>

              <!-- Escenario de la Mascota: Propuesta tierna, viva y adorable con efecto 3D y partículas mágicas -->
              <div class="tdea-mascot-friendly-stage" id="game-robot-avatar-frame" role="button" tabindex="0" title="¡Toca a tu amigable guía de Campus Vital!">
                
                <!-- Halo de luz cálida detrás del robot -->
                <div class="tdea-mascot-magic-halo" aria-hidden="true"></div>

                <!-- Partículas mágicas ambientales continuas (destellos, corazoncitos, hojitas) -->
                <div class="tdea-mascot-ambient-motes" aria-hidden="true">
                  <span class="mote mote-1">✨</span>
                  <span class="mote mote-2">💚</span>
                  <span class="mote mote-3">⭐</span>
                  <span class="mote mote-4">🌱</span>
                  <span class="mote mote-5">✨</span>
                </div>

                <!-- Aura de iluminación en el pedestal -->
                <div class="tdea-mascot-pedestal-glow" aria-hidden="true"></div>

                <!-- Contenedor 3D interactivo con inclinación hacia el cursor y balanceo tierno -->
                <div class="tdea-mascot-figure-wrap" id="tdea-mascot-figure-wrap">
                  <div class="tdea-mascot-inner-bobbing">
                    <img 
                      src="assets/images/learningCenter/tdea_mascot_chibi_3d.png?v=20261102_36" 
                      alt="Mascota Oficial Chibi Asistente Territorio TdeA" 
                      class="tdea-mascot-3d-img"
                      draggable="false"
                      width="350"
                      height="350"
                    />
                  </div>
                  <!-- Contenedor de partículas flotantes al interactuar -->
                  <div class="robot-particles-container" id="robot-particles-container" aria-hidden="true"></div>
                </div>

                <!-- Sombra proyectada en el suelo dinámica -->
                <div class="tdea-mascot-ground-shadow" aria-hidden="true"></div>
              </div>

            </div>

            <!-- Lado Derecho: Botones de Videojuego Completos y Estilizados (Sin emojis toscos) -->
            <div class="game-menu-buttons-col">
              
              <!-- Botón: Módulo 1 -->
              <button 
                type="button" 
                class="game-module-btn game-btn-mod1 ${m1Completed ? 'is-completed' : ''}" 
                id="game-launch-mod1"
                aria-label="Abrir Módulo 1: Preparar el equipaje"
              >
                <div class="game-btn-hud-corner tl"></div>
                <div class="game-btn-hud-corner tr"></div>
                <div class="game-btn-hud-corner bl"></div>
                <div class="game-btn-hud-corner br"></div>

                <div class="game-btn-content">
                  <div class="game-btn-header">
                    <span class="game-btn-level-tag">NIVEL 01 · RUTA DE ADAPTACIÓN</span>
                    <span class="game-btn-status-pill">${m1Completed ? '✓ COMPLETADO' : '● ACTIVO'}</span>
                  </div>
                  <div class="game-btn-label-row">
                    <div class="game-btn-icon-badge" aria-hidden="true">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00E676" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" y1="19" x2="12" y2="22"></line>
                      </svg>
                    </div>
                    <div class="game-btn-titles-col">
                      <strong class="game-btn-text">Módulo 1: Preparar el equipaje</strong>
                      <span class="game-btn-subtext">Bienestar emocional y afrontamiento universitario</span>
                    </div>
                    <span class="game-btn-arrow" aria-hidden="true">▶</span>
                  </div>
                </div>
              </button>

              <!-- Botón: Módulo 2 -->
              <button 
                type="button" 
                class="game-module-btn game-btn-mod2 ${m2Completed ? 'is-completed' : ''}" 
                id="game-launch-mod2"
                aria-label="Abrir Módulo 2: Elegir el rumbo - Adaptación Universitaria y Proyecto de Vida"
              >
                <div class="game-btn-hud-corner tl"></div>
                <div class="game-btn-hud-corner tr"></div>
                <div class="game-btn-hud-corner bl"></div>
                <div class="game-btn-hud-corner br"></div>

                <div class="game-btn-content">
                  <div class="game-btn-header">
                    <span class="game-btn-level-tag">NIVEL 02 · ADAPTACIÓN Y PROYECTO DE VIDA</span>
                    <span class="game-btn-status-pill">${m2Completed ? '✓ COMPLETADO' : '● ACTIVO'}</span>
                  </div>
                  <div class="game-btn-label-row">
                    <div class="game-btn-icon-badge" aria-hidden="true">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00E676" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="#00E676"></polygon>
                      </svg>
                    </div>
                    <div class="game-btn-titles-col">
                      <strong class="game-btn-text">Módulo 2: Elegir el rumbo</strong>
                      <span class="game-btn-subtext">Adaptación a la vida universitaria y proyecto de vida</span>
                    </div>
                    <span class="game-btn-arrow" aria-hidden="true">▶</span>
                  </div>
                </div>
              </button>

              <!-- Botón: Módulo 3 -->
              <button
                type="button"
                class="game-module-btn game-btn-mod3 ${m3Completed ? 'is-completed' : ''}"
                id="game-launch-mod3"
                aria-label="Abrir Módulo 3: Gestionando mis emociones - Aprender a navegar los cambios"
              >
                <div class="game-btn-hud-corner tl"></div>
                <div class="game-btn-hud-corner tr"></div>
                <div class="game-btn-hud-corner bl"></div>
                <div class="game-btn-hud-corner br"></div>

                <div class="game-btn-content">
                  <div class="game-btn-header">
                    <span class="game-btn-level-tag">NIVEL 03 · REGULACIÓN EMOCIONAL Y CALMA</span>
                    <span class="game-btn-status-pill">${m3Completed ? '✓ COMPLETADO' : '● ACTIVO'}</span>
                  </div>
                  <div class="game-btn-label-row">
                    <div class="game-btn-icon-badge" aria-hidden="true">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00E676" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    </div>
                    <div class="game-btn-titles-col">
                      <strong class="game-btn-text">Módulo 3: Gestionando mis emociones</strong>
                      <span class="game-btn-subtext">Aprender a navegar los cambios · Manejo de la ansiedad</span>
                    </div>
                    <span class="game-btn-arrow" aria-hidden="true">▶</span>
                  </div>
                </div>
              </button>

              <!-- Botones secundarios para revisar respuestas o reiniciar de cero -->
              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.6rem;">
                ${(m1Completed || m2Completed || m3Completed) ? `
                  <button type="button" class="game-btn-review-progress" id="game-btn-review-all">
                    <span>📊 Ver Bitácora y Respuestas</span>
                  </button>
                ` : ''}
                <button type="button" class="game-btn-review-progress" id="game-btn-reset-all" style="background: rgba(239, 68, 68, 0.12); border: 1.5px solid #EF4444; color: #DC2626;" title="Reiniciar todo el progreso guardado">
                  <span>🔄 Reiniciar Todo (Empezar de cero)</span>
                </button>
              </div>

            </div>

          </div>
        </div>

      </section>
    `;

    this.bindMenuEvents();
  }

  bindMenuEvents() {
    // Retorno al inicio y retorno a Campus Vital
    const crumbHome = this.containerEl.querySelector('#crumb-nav-home');
    const crumbVital = this.containerEl.querySelector('#crumb-nav-vital');
    const btnMainMenu = this.containerEl.querySelector('#game-btn-main-menu');

    const handleResetAction = () => {
      if (confirm('¿Deseas reiniciar todo el progreso de los módulos y empezar de cero?')) {
        learningCenterState.resetAll();
        this.renderMenu();
      }
    };

    const btnResetGlobal = this.containerEl.querySelector('#game-btn-reset-global');
    if (btnResetGlobal) btnResetGlobal.addEventListener('click', handleResetAction);

    const btnResetAll = this.containerEl.querySelector('#game-btn-reset-all');
    if (btnResetAll) btnResetAll.addEventListener('click', handleResetAction);
    const btnReturnVital = this.containerEl.querySelector('#game-btn-return-vital');
    const btnReturnVitalPill = this.containerEl.querySelector('#game-btn-return-vital-pill');

    const goHome = (e) => {
      if (e) e.preventDefault();
      if (this.onGoBackToHome) this.onGoBackToHome();
      else window.location.hash = '#/home';
    };

    const goVital = (e) => {
      if (e) e.preventDefault();
      window.location.hash = '#/campus_vital';
    };

    if (crumbHome) crumbHome.addEventListener('click', goHome);
    if (crumbVital) crumbVital.addEventListener('click', goVital);
    if (btnMainMenu) btnMainMenu.addEventListener('click', goHome);
    if (btnReturnVital) btnReturnVital.addEventListener('click', goVital);
    if (btnReturnVitalPill) btnReturnVitalPill.addEventListener('click', goVital);

    // Lanzar Módulo 1
    const btnMod1 = this.containerEl.querySelector('#game-launch-mod1');
    if (btnMod1) {
      btnMod1.addEventListener('click', () => {
        this.renderModule1();
      });
    }

    // Lanzar Módulo 2
    const btnMod2 = this.containerEl.querySelector('#game-launch-mod2');
    if (btnMod2) {
      btnMod2.addEventListener('click', () => {
        this.renderModule2();
      });
    }

    // Lanzar Módulo 3
    const btnMod3 = this.containerEl.querySelector('#game-launch-mod3');
    if (btnMod3) {
      btnMod3.addEventListener('click', () => {
        this.renderModule3();
      });
    }

    // Revisar todo
    const btnReviewAll = this.containerEl.querySelector('#game-btn-review-all');
    if (btnReviewAll) {
      btnReviewAll.addEventListener('click', () => {
        this.renderReviewAll();
      });
    }

    // ===================================================================
    // INTERACCIONES Y ANIMACIONES DINÁMICAS CON EL ROBOT (Propuesta Linda y Viva)
    // ===================================================================
    const avatarFrame = this.containerEl.querySelector('#game-robot-avatar-frame');
    const figureWrap = this.containerEl.querySelector('#tdea-mascot-figure-wrap');

    if (avatarFrame) {
      // 1. Mirada curiosa en 3D: el robot se inclina sutilmente siguiendo el cursor
      if (figureWrap) {
        avatarFrame.addEventListener('mousemove', (e) => {
          if (avatarFrame.classList.contains('is-happy-greeting')) return;
          const rect = avatarFrame.getBoundingClientRect();
          const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 a 1
          const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 a 1
          figureWrap.style.transform = `perspective(700px) rotateY(${normX * 9}deg) rotateX(${-normY * 7}deg) translate3d(${normX * 5}px, ${normY * 3}px, 8px)`;
        });

        avatarFrame.addEventListener('mouseleave', () => {
          figureWrap.style.transform = '';
        });
      }

      // 2. Interacción al hacer clic o presionar Enter / Espacio
      avatarFrame.addEventListener('click', () => {
        this.triggerMascotFriendlyGreeting();
      });
      avatarFrame.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.triggerMascotFriendlyGreeting();
        }
      });
    }
  }

  /* Interacción tierna y amigable de la mascota al tocarla */
  triggerMascotFriendlyGreeting() {
    const avatarFrame = this.containerEl ? this.containerEl.querySelector('#game-robot-avatar-frame') : null;
    const figureWrap = this.containerEl ? this.containerEl.querySelector('#tdea-mascot-figure-wrap') : null;
    const speechBubble = this.containerEl ? this.containerEl.querySelector('#game-robot-speech-bubble') : null;
    const speechText = this.containerEl ? this.containerEl.querySelector('#game-robot-speech-text') : null;
    if (!avatarFrame) return;

    if (figureWrap) figureWrap.style.transform = ''; // Resetear tilt temporalmente para el giro

    this.playFriendlyGreetingSound();
    this.spawnRobotParticles(['💚', '✨', '🌸', '⭐', '🌱'], 8);

    avatarFrame.classList.remove('is-happy-greeting');
    void avatarFrame.offsetWidth; // Forzar reflow para reiniciar animación
    avatarFrame.classList.add('is-happy-greeting');

    const friendlyMessages = [
      '¡Hola! Recuerda que en Campus Vital cuidamos de ti con mucho cariño. 💚',
      '¡Paso a pasito! Eres capaz de lograr todo lo que te propongas en el TdeA. 🌱',
      '¡Mucho ánimo y alegría! Cada día universitario es una nueva oportunidad. ✨',
      '¡Respira hondo! Tómate una pausa y confía en tu proceso. 🌿'
    ];

    if (!this.mascotMsgIndex) this.mascotMsgIndex = 0;
    const nextMsg = friendlyMessages[this.mascotMsgIndex % friendlyMessages.length];
    this.mascotMsgIndex++;

    if (speechBubble && speechText) {
      speechBubble.classList.add('is-highlighted');
      speechText.textContent = nextMsg;
    }

    if (this.robotSpeechTimeout) clearTimeout(this.robotSpeechTimeout);
    if (this.robotAnimTimeout) clearTimeout(this.robotAnimTimeout);

    this.robotAnimTimeout = setTimeout(() => {
      avatarFrame.classList.remove('is-happy-greeting');
    }, 1150);

    this.robotSpeechTimeout = setTimeout(() => {
      if (speechBubble && speechText) {
        speechBubble.classList.remove('is-highlighted');
        speechText.textContent = '¡Hola! Soy tu guía de Campus Vital 🌱 Selecciona un módulo para comenzar';
      }
    }, 4500);
  }

  playFriendlyGreetingSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      // Melodía tierna de campanitas tipo caja musical: Do, Mi, Sol, Do agudo
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const startTime = ctx.currentTime + idx * 0.07;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.045, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch (e) {}
  }

  /* Audio y efectos sonoros amigables Web Audio API */
  playSpinJingle() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.045, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.22);
      });
    } catch (e) {}
  }

  playHugHarmony() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const chord = [392.00, 493.88, 587.33, 783.99]; // G4, B4, D5, G5 acorde cálido y tierno
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.035, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 1.4);
      });
    } catch (e) {}
  }

  playCheerSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [587.33, 880.00, 1174.66]; // D5, A5, D6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.04, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.2);
      });
    } catch (e) {}
  }

  /* Emisión de partículas flotantes (Corazones, brillos, etc.) */
  spawnRobotParticles(emojis = ['💚', '✨', '🌱', '💖'], count = 8) {
    const container = this.containerEl ? this.containerEl.querySelector('#robot-particles-container') : null;
    if (!container) return;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('span');
      particle.className = 'robot-floating-particle';
      particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      
      const randomX = (Math.random() - 0.5) * 160;
      const randomRot = (Math.random() - 0.5) * 50;
      const delay = Math.random() * 0.25;

      particle.style.setProperty('--tx', `${randomX}px`);
      particle.style.setProperty('--rot', `${randomRot}deg`);
      particle.style.animationDelay = `${delay}s`;

      container.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode === container) {
          container.removeChild(particle);
        }
      }, 2100);
    }
  }

  /* Interacción 1: Tocar robot / Dar vuelta 360° */
  triggerRobotSpin() {
    const avatarFrame = this.containerEl ? this.containerEl.querySelector('#game-robot-avatar-frame') : null;
    const speechBubble = this.containerEl ? this.containerEl.querySelector('#game-robot-speech-bubble') : null;
    const speechText = this.containerEl ? this.containerEl.querySelector('#game-robot-speech-text') : null;
    if (!avatarFrame) return;

    this.playSpinJingle();
    this.spawnRobotParticles(['🌀', '✨', '⭐', '⚡', '🌱'], 6);

    avatarFrame.classList.remove('is-spinning', 'is-hugging', 'is-cheering', 'robot-anim-spin', 'robot-anim-hug', 'robot-anim-cheer');
    void avatarFrame.offsetWidth; // Forzar reflow para reiniciar animación
    avatarFrame.classList.add('is-spinning');

    if (speechBubble && speechText) {
      speechBubble.classList.remove('is-highlighted');
      speechBubble.classList.add('is-spinning');
      speechText.textContent = '¡Wuuu! 🌀 ¡Dando una vueltita con toda la energía!';
    }

    if (this.robotSpeechTimeout) clearTimeout(this.robotSpeechTimeout);
    if (this.robotAnimTimeout) clearTimeout(this.robotAnimTimeout);

    this.robotAnimTimeout = setTimeout(() => {
      avatarFrame.classList.remove('is-spinning');
    }, 1300);

    this.robotSpeechTimeout = setTimeout(() => {
      if (speechBubble && speechText) {
        speechBubble.classList.remove('is-spinning', 'is-highlighted');
        speechText.textContent = '¡Hola! Selecciona un módulo para comenzar';
      }
    }, 4000);
  }

  /* Interacción 2: Enviar abrazo cálido y tierno con corazones */
  triggerRobotHug() {
    const avatarFrame = this.containerEl ? this.containerEl.querySelector('#game-robot-avatar-frame') : null;
    const speechBubble = this.containerEl ? this.containerEl.querySelector('#game-robot-speech-bubble') : null;
    const speechText = this.containerEl ? this.containerEl.querySelector('#game-robot-speech-text') : null;
    if (!avatarFrame) return;

    this.playHugHarmony();
    this.spawnRobotParticles(['💚', '🫂', '💖', '✨', '🌱', '🤍'], 10);

    avatarFrame.classList.remove('is-spinning', 'is-hugging', 'is-cheering', 'robot-anim-spin', 'robot-anim-hug', 'robot-anim-cheer');
    void avatarFrame.offsetWidth;
    avatarFrame.classList.add('is-hugging');

    if (speechBubble && speechText) {
      speechBubble.classList.remove('is-spinning');
      speechBubble.classList.add('is-highlighted');
      speechText.textContent = '¡Te envío un abrazo gigante! 🫂💚 ¡Estamos contigo en cada paso!';
    }

    if (this.robotSpeechTimeout) clearTimeout(this.robotSpeechTimeout);
    if (this.robotAnimTimeout) clearTimeout(this.robotAnimTimeout);

    this.robotAnimTimeout = setTimeout(() => {
      avatarFrame.classList.remove('is-hugging');
    }, 2000);

    this.robotSpeechTimeout = setTimeout(() => {
      if (speechBubble && speechText) {
        speechBubble.classList.remove('is-highlighted', 'is-spinning');
        speechText.textContent = '¡Hola! Selecciona un módulo para comenzar';
      }
    }, 4500);
  }

  /* Interacción 3: Saludo con brincos y motivación */
  triggerRobotCheer() {
    const avatarFrame = this.containerEl ? this.containerEl.querySelector('#game-robot-avatar-frame') : null;
    const speechBubble = this.containerEl ? this.containerEl.querySelector('#game-robot-speech-bubble') : null;
    const speechText = this.containerEl ? this.containerEl.querySelector('#game-robot-speech-text') : null;
    if (!avatarFrame) return;

    this.playCheerSound();
    this.spawnRobotParticles(['⭐', '✨', '🎉', '🌱', '🚀'], 8);

    avatarFrame.classList.remove('is-spinning', 'is-hugging', 'is-cheering', 'robot-anim-spin', 'robot-anim-hug', 'robot-anim-cheer');
    void avatarFrame.offsetWidth;
    avatarFrame.classList.add('is-cheering');

    if (speechBubble && speechText) {
      speechBubble.classList.remove('is-highlighted', 'is-spinning');
      speechText.textContent = '¡Mucho ánimo! 🌟 ¡Aprender es tu superpoder en el TdeA!';
    }

    if (this.robotSpeechTimeout) clearTimeout(this.robotSpeechTimeout);
    if (this.robotAnimTimeout) clearTimeout(this.robotAnimTimeout);

    this.robotAnimTimeout = setTimeout(() => {
      avatarFrame.classList.remove('is-cheering');
    }, 1300);

    this.robotSpeechTimeout = setTimeout(() => {
      if (speechBubble && speechText) {
        speechBubble.classList.remove('is-highlighted', 'is-spinning');
        speechText.textContent = '¡Hola! Selecciona un módulo para comenzar';
      }
    }, 4000);
  }

  renderModule1(subpart = 'module_intro') {
    this.currentView = 'module1';
    if (!this.module1View) {
      this.module1View = new Module1View(this.containerEl, (targetView) => {
        if (targetView === 'menu') {
          this.renderMenu();
        } else if (targetView === 'module2') {
          this.renderModule2();
        }
      });
    }
    this.module1View.render(subpart);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderModule2(route = null, step = 1) {
    this.currentView = 'module2';
    const m2 = learningCenterState.state.module2;
    const defaultRoute = (m2?.completed || (m2?.ruta1?.completed && m2?.ruta2?.completed)) ? 'mountain' : 'intro';
    const targetRoute = route || defaultRoute;
    if (!this.module2View) {
      this.module2View = new Module2View(this.containerEl, (targetView) => {
        if (targetView === 'menu') {
          this.renderMenu();
        } else if (targetView === 'module1') {
          this.renderModule1();
        }
      });
    }
    this.module2View.render(targetRoute, step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderModule3(pausa = 'intro') {
    this.currentView = 'module3';
    learningCenterState.setActiveModule('module3');
    if (!this.module3View) {
      this.module3View = new Module3View(this.containerEl, (targetView) => {
        if (targetView === 'menu') {
          this.renderMenu();
        } else if (targetView === 'module1') {
          this.renderModule1();
        } else if (targetView === 'module2') {
          this.renderModule2();
        }
      });
    }
    this.module3View.render(pausa);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderReviewAll() {
    this.currentView = 'review_all';
    const m1 = learningCenterState.state.module1;
    const m2 = learningCenterState.state.module2;
    const m3 = learningCenterState.state.module3 || {};
    const m2Completed = Boolean(m2.completed || (m2.ruta1?.completed && m2.ruta2?.completed));
    const m3Completed = Boolean(m3.completed || m3.cierre?.completed);

    this.containerEl.innerHTML = `
      <section class="lc-module-container animate-fade-in" aria-labelledby="review-all-title">
        <div class="lc-stepper-header">
          <button type="button" class="lc-btn-back-menu" id="btn-back-from-full-review">
            <span aria-hidden="true">←</span> <span>Volver al Centro de Aprendizaje</span>
          </button>
          <span class="badge badge-primary">Bitácora Integral</span>
        </div>

        <div class="lc-module-header">
          <span class="lc-module-tag">Campus Vital · Territorio TdeA</span>
          <h2 id="review-all-title" class="lc-module-heading">Bitácora y Respuestas Registradas</h2>
          <p class="lc-module-intro">
            Aquí puedes consultar el estado de tus avances pedagógicos en los módulos del Centro de Aprendizaje.
          </p>
        </div>

        <div class="lc-summary-grid">
          
          <!-- Módulo 1 -->
          <div class="lc-summary-item-card">
            <div class="lc-summary-card-header">
              <span class="lc-summary-icon">🎒</span>
              <h3 class="lc-summary-card-title">Módulo 1: Preparar el equipaje</h3>
            </div>
            <p><strong>Estación 1 (Terreno):</strong> ${m1.equipaje?.station1?.completed ? '✓ Completada' : 'Pendiente'}</p>
            <p><strong>Estación 2 (Desvíos):</strong> ${m1.equipaje?.station2?.completed ? '✓ Completada' : 'Pendiente'}</p>
            <p><strong>Estación 3 (Red de Apoyo):</strong> ${m1.equipaje?.station3?.completed ? '✓ Completada' : 'Pendiente'}</p>
            <p><strong>Maleta y Cierre:</strong> ${m1.equipaje?.closing?.completed ? '✓ Insignia obtenida' : 'En progreso'}</p>
            <button type="button" class="lc-btn lc-btn-sm lc-btn-secondary" id="btn-goto-mod1-edit">
              <span>Abrir Módulo 1</span>
            </button>
          </div>

          <!-- Módulo 2 -->
          <div class="lc-summary-item-card">
            <div class="lc-summary-card-header">
              <span class="lc-summary-icon">🧭</span>
              <h3 class="lc-summary-card-title">Módulo 2: Elegir el rumbo</h3>
            </div>
            <p><strong>Ruta 1 (Proyecto de Vida):</strong> ${m2.ruta1?.completed ? '✓ Completada' : 'Pendiente'}</p>
            <p><strong>Ruta 2 (Adaptación Universitaria):</strong> ${m2.ruta2?.completed ? '✓ Completada' : 'Pendiente'}</p>
            <p><strong>Estado General:</strong> ${m2Completed ? '✓ Módulo culminado' : 'En progreso'}</p>
            <button type="button" class="lc-btn lc-btn-sm lc-btn-secondary" id="btn-goto-mod2-edit">
              <span>Abrir Módulo 2</span>
            </button>
          </div>

          <!-- Módulo 3 -->
          <div class="lc-summary-item-card">
            <div class="lc-summary-card-header">
              <span class="lc-summary-icon">🌱</span>
              <h3 class="lc-summary-card-title">Módulo 3: Gestionando mis emociones</h3>
            </div>
            <p><strong>Pausa 1 (Cuerpo):</strong> ${m3.pausa1?.completed ? '✓ Completada' : 'Pendiente'}</p>
            <p><strong>Pausa 2 (Respirar):</strong> ${m3.pausa2?.completed ? '✓ Completada' : 'Pendiente'}</p>
            <p><strong>Pausa 3 (Pausa Consciente):</strong> ${m3.pausa3?.completed ? '✓ Completada' : 'Pendiente'}</p>
            <p><strong>Pausa 4 y Caja de Herramientas:</strong> ${m3.pausa4?.completed ? '✓ Completada' : 'Pendiente'}</p>
            <p><strong>Estado General:</strong> ${m3Completed ? '✓ Módulo culminado' : 'En progreso'}</p>
            <button type="button" class="lc-btn lc-btn-sm lc-btn-secondary" id="btn-goto-mod3-edit">
              <span>Abrir Módulo 3</span>
            </button>
          </div>

        </div>

        <div class="lc-summary-actions-row" style="margin-top: 2rem;">
          <button type="button" class="lc-btn lc-btn-primary" id="btn-exit-full-review">
            <span>Volver a la Pantalla Principal</span>
          </button>
        </div>
      </section>
    `;

    const back = () => this.renderMenu();
    const btnBack = this.containerEl.querySelector('#btn-back-from-full-review');
    const btnExit = this.containerEl.querySelector('#btn-exit-full-review');
    if (btnBack) btnBack.addEventListener('click', back);
    if (btnExit) btnExit.addEventListener('click', back);

    const btnGo1 = this.containerEl.querySelector('#btn-goto-mod1-edit');
    if (btnGo1) btnGo1.addEventListener('click', () => this.renderModule1());

    const btnGo2 = this.containerEl.querySelector('#btn-goto-mod2-edit');
    if (btnGo2) btnGo2.addEventListener('click', () => this.renderModule2());

    const btnGo3 = this.containerEl.querySelector('#btn-goto-mod3-edit');
    if (btnGo3) btnGo3.addEventListener('click', () => this.renderModule3());
  }

  updateMenuBadges() {
    const m1 = learningCenterState.state.module1;
    const m2 = learningCenterState.state.module2;
    const m3 = learningCenterState.state.module3 || {};
    const m1Completed = m1.completed || Boolean(m1.equipaje?.closing?.completed) || (m1.audio?.hasAudio && Boolean(m1.caseDaniel?.answerText));
    const m2Completed = Boolean(m2.completed || (m2.ruta1?.completed && m2.ruta2?.completed));
    const m3Completed = Boolean(m3.completed || m3.cierre?.completed);

    const btn1 = this.containerEl.querySelector('#game-launch-mod1');
    if (btn1) {
      if (m1Completed) btn1.classList.add('is-completed');
      else btn1.classList.remove('is-completed');
      const pill = btn1.querySelector('.game-btn-status-pill');
      if (pill) pill.textContent = m1Completed ? '✓ COMPLETADO' : '● ACTIVO';
    }

    const btn2 = this.containerEl.querySelector('#game-launch-mod2');
    if (btn2) {
      if (m2Completed) btn2.classList.add('is-completed');
      else btn2.classList.remove('is-completed');
      const pill = btn2.querySelector('.game-btn-status-pill');
      if (pill) pill.textContent = m2Completed ? '✓ COMPLETADO' : '● ACTIVO';
    }

    const btn3 = this.containerEl.querySelector('#game-launch-mod3');
    if (btn3) {
      if (m3Completed) btn3.classList.add('is-completed');
      else btn3.classList.remove('is-completed');
      const pill = btn3.querySelector('.game-btn-status-pill');
      if (pill) pill.textContent = m3Completed ? '✓ COMPLETADO' : '● ACTIVO';
    }
  }
}
