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
import { Module1View } from './module1View.js?v=20261113_08';
import { Module2View } from './module2View.js?v=20261113_08';
import { Module3View } from './module3View.js?v=20261112_05';
import { RESOURCES_DATA, getResourceById } from '../../data/resourcesData.js';
import { ResourceCard } from '../resourceCard.js';

export class LearningCenterView {
  constructor(containerEl, onGoBackToHome, onSubViewChange) {
    this.containerEl = containerEl;
    this.onGoBackToHome = onGoBackToHome;
    this.onSubViewChange = onSubViewChange;
    this.currentView = 'menu'; // 'menu' | 'module1' | 'module2' | 'module3' | 'review_all'
    this.module1View = null;
    this.module2View = null;
    this.module3View = null;
    this.unsubscribeState = null;
    this.robotSpeechTimeout = null;
    this.robotAnimTimeout = null;
  }

  /**
   * Retorno jerárquico dentro del Centro de Aprendizaje
   * @returns {boolean} true si se gestionó el retorno internamente
   */
  handleBack() {
    if (this.currentView === 'module1' && this.module1View && typeof this.module1View.handleBack === 'function') {
      if (this.module1View.handleBack()) return true;
    }
    if (this.currentView === 'module2' && this.module2View && typeof this.module2View.handleBack === 'function') {
      if (this.module2View.handleBack()) return true;
    }
    if (this.currentView === 'module3' && this.module3View && typeof this.module3View.handleBack === 'function') {
      if (this.module3View.handleBack()) return true;
    }
    if (this.currentView && this.currentView !== 'menu') {
      this.renderMenu();
      return true;
    }
    return false;
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
    if (this.onSubViewChange) {
      this.onSubViewChange(null);
    }
    const m1 = learningCenterState.state.module1;
    const m2 = learningCenterState.state.module2;
    const m3 = learningCenterState.state.module3 || {};

    const m1Completed = m1.completed || Boolean(m1.equipaje?.closing?.completed) || (m1.audio?.hasAudio && Boolean(m1.caseDaniel?.answerText));
    const m2Completed = Boolean(m2.completed || (m2.ruta1?.completed && m2.ruta2?.completed));
    const m3Completed = Boolean(m3.completed || m3.cierre?.completed);
    const activeProfile = learningCenterState.getActiveProfile();
    const totalAnswers = learningCenterState.countStateAnswers(learningCenterState.state);

    this.containerEl.innerHTML = `
      <section class="game-ui-root animate-fade-in" aria-label="Campus Vital y Centro de Aprendizaje">

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

            </div>

          </div>
        </div>

      </section>
    `;

    this.bindMenuEvents();
  }

  bindMenuEvents() {
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
    if (this.onSubViewChange) {
      this.onSubViewChange({ id: 'module1', label: 'Módulo 1: Preparar el equipaje' });
    }
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
    if (this.onSubViewChange) {
      this.onSubViewChange({ id: 'module2', label: 'Módulo 2: Elegir el rumbo' });
    }
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
    if (this.onSubViewChange) {
      this.onSubViewChange({ id: 'module3', label: 'Módulo 3: Gestionando mis emociones' });
    }
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
    if (this.onSubViewChange) {
      this.onSubViewChange({ id: 'review_all', label: 'Cuaderno de Respuestas' });
    }
    const state = learningCenterState.state;
    const m1 = state.module1 || {};
    const m2 = state.module2 || {};
    const m3 = state.module3 || {};

    const activeProfile = learningCenterState.getActiveProfile();
    const profiles = learningCenterState.getProfiles();
    const totalAnswers = learningCenterState.countStateAnswers(state);

    const m1Completed = Boolean(m1.completed || m1.equipaje?.closing?.completed);
    const m2Completed = Boolean(m2.completed || (m2.ruta1?.completed && m2.ruta2?.completed));
    const m3Completed = Boolean(m3.completed || m3.cierre?.completed);

    // Helpers de formateo para respuestas
    const fmtText = (txt) => txt && txt.trim() ? `<div class="lc-answer-bubble">"${txt.trim()}"</div>` : `<span class="lc-answer-empty">Sin respuesta aún</span>`;
    const fmtList = (arr) => arr && arr.length ? arr.map(item => `<span class="badge badge-pedagogical" style="margin-right: 0.35rem; margin-bottom: 0.35rem;">✓ ${item}</span>`).join('') : `<span class="lc-answer-empty">Ninguno seleccionado</span>`;

    // Metadatos Módulo 1
    const s1 = m1.equipaje?.station1 || {};
    const s2 = m1.equipaje?.station2 || {};
    const s3 = m1.equipaje?.station3 || {};
    const closing1 = m1.equipaje?.closing || {};
    const compass = s1.compass || {};
    const weatherNotes = s1.weatherNotes || {};

    // Metadatos Módulo 2
    const r1 = m2.ruta1 || {};
    const r2 = m2.ruta2 || {};
    const sp = r1.startPoint || {};
    const tree = r1.tree || {};
    const thermo = r2.thermometer?.textAnswers || {};
    const plan = r2.adaptationPlan || {};

    // Metadatos Módulo 3
    const p1 = m3.pausa1 || {};
    const p2 = m3.pausa2 || {};
    const p3 = m3.pausa3 || {};
    const p4 = m3.pausa4 || {};
    const tf = p3.trafficLight || {};

    this.containerEl.innerHTML = `
      <section class="lc-module-container animate-fade-in" aria-labelledby="review-all-title" style="max-width: 1040px; margin: 0 auto; padding-bottom: 4rem;">
        
        <!-- Badges DUA de Guardado -->
        <div style="display: flex; justify-content: flex-end; gap: 0.5rem; align-items: center; margin-bottom: 1.25rem;">
          <span class="badge badge-primary">Bitácora Integral DUA</span>
          <span class="badge badge-status-available">💾 Guardado Local Seguro</span>
        </div>

        <!-- 2. Header Principal -->
        <div class="lc-module-header" style="margin-bottom: 1.5rem;">
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.65rem;">
            <span>🌱 BIENESTAR INSTITUCIONAL · CIENCIAS BÁSICAS</span> · <span>REGISTRO DE RESPUESTAS</span>
          </div>
          <h2 id="review-all-title" class="lc-module-heading" style="font-size: 1.85rem; color: #005A29; margin-bottom: 0.5rem;">
            Bitácora de Respuestas y Avances por Usuario
          </h2>
          <p class="lc-module-intro" style="color: #475569; font-size: 1rem; line-height: 1.6; margin: 0;">
            Cada respuesta, reflexión y ejercicio realizado en esta computadora queda guardado de manera permanente e individual por estudiante. Puedes cambiar de usuario, crear nuevos perfiles para otros estudiantes o imprimir la bitácora completa en cualquier momento.
          </p>
        </div>

        <!-- 3. PANEL DE GESTIÓN DE USUARIOS / ESTUDIANTES (MULTI-PERFIL) -->
        <div class="lc-student-management-card" style="background: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 16px; padding: 1.25rem 1.5rem; margin-bottom: 2rem; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem; border-bottom: 1.5px solid #E2E8F0; padding-bottom: 0.85rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="font-size: 1.8rem;" aria-hidden="true">👤</span>
              <div>
                <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B; font-weight: 700; display: block;">Estudiante Activo:</span>
                <strong style="font-size: 1.25rem; color: #0F172A;" id="display-profile-name">${activeProfile.name}</strong>
              </div>
            </div>
            
            <!-- Acciones rápidas de exportación -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button type="button" class="lc-btn lc-btn-secondary lc-btn-sm" id="btn-print-responses" style="background: #FFFFFF; border: 1.5px solid #CBD5E1; color: #0F172A; font-weight: 700;">
                <span>🖨️ Imprimir / Guardar en PDF</span>
              </button>
              <button type="button" class="lc-btn lc-btn-secondary lc-btn-sm" id="btn-download-responses-txt" style="background: #FFFFFF; border: 1.5px solid #CBD5E1; color: #0F172A; font-weight: 700;">
                <span>📥 Descargar Resumen (.txt)</span>
              </button>
            </div>
          </div>

          <!-- Selector de estudiante y botones de gestión -->
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; flex: 1;">
              <label for="select-student-profile" style="font-size: 0.9rem; font-weight: 700; color: #334155;">
                Ver respuestas de:
              </label>
              <select id="select-student-profile" class="lc-weather-input" style="padding: 0.5rem 0.85rem; border-radius: 8px; font-weight: 600; min-width: 240px; border: 1.5px solid #94A3B8;">
                ${profiles.map(p => `
                  <option value="${p.id}" ${p.id === activeProfile.id ? 'selected' : ''}>
                    ${p.name} (${p.answersCount} respuestas)
                  </option>
                `).join('')}
              </select>
              <button type="button" class="lc-btn lc-btn-sm lc-btn-secondary" id="btn-rename-profile" title="Cambiar el nombre del estudiante activo">
                <span>✏️ Renombrar</span>
              </button>
            </div>

            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button type="button" class="lc-btn lc-btn-sm lc-btn-primary" id="btn-create-profile" style="background: #005A29; color: #FFFFFF;">
                <span>+ Nuevo Estudiante</span>
              </button>
              ${profiles.length > 1 ? `
                <button type="button" class="lc-btn lc-btn-sm lc-btn-secondary" id="btn-delete-profile" style="color: #DC2626; border-color: #FCA5A5;">
                  <span>🗑️ Eliminar Usuario</span>
                </button>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- 4. TARJETAS DE PROGRESO DE LOS 3 MÓDULOS -->
        <div class="lc-summary-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
          
          <!-- Módulo 1 -->
          <div class="lc-summary-item-card" style="background: #FFFFFF; border: 1.5px solid ${m1Completed ? '#86EFAC' : '#E2E8F0'}; border-radius: 14px; padding: 1.25rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.4rem;">🎒</span>
                <strong style="color: #0F172A; font-size: 1.05rem;">Módulo 1: Equipaje</strong>
              </div>
              <span class="badge ${m1Completed ? 'badge-status-available' : 'badge-pedagogical'}">
                ${m1Completed ? '✓ Completado' : 'En progreso'}
              </span>
            </div>
            <p style="font-size: 0.88rem; color: #475569; margin: 0 0 0.75rem 0;">
              Autoconocimiento, Clima Emocional, Desvíos y Red de Apoyo.
            </p>
            <button type="button" class="lc-btn lc-btn-sm lc-btn-secondary" id="btn-goto-mod1-edit" style="width: 100%;">
              <span>Ir a Módulo 1 →</span>
            </button>
          </div>

          <!-- Módulo 2 -->
          <div class="lc-summary-item-card" style="background: #FFFFFF; border: 1.5px solid ${m2Completed ? '#86EFAC' : '#E2E8F0'}; border-radius: 14px; padding: 1.25rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.4rem;">🧭</span>
                <strong style="color: #0F172A; font-size: 1.05rem;">Módulo 2: El Rumbo</strong>
              </div>
              <span class="badge ${m2Completed ? 'badge-status-available' : 'badge-pedagogical'}">
                ${m2Completed ? '✓ Completado' : 'En progreso'}
              </span>
            </div>
            <p style="font-size: 0.88rem; color: #475569; margin: 0 0 0.75rem 0;">
              Proyecto de Vida (Árbol) y Plan de Adaptación Universitaria.
            </p>
            <button type="button" class="lc-btn lc-btn-sm lc-btn-secondary" id="btn-goto-mod2-edit" style="width: 100%;">
              <span>Ir a Módulo 2 →</span>
            </button>
          </div>

          <!-- Módulo 3 -->
          <div class="lc-summary-item-card" style="background: #FFFFFF; border: 1.5px solid ${m3Completed ? '#86EFAC' : '#E2E8F0'}; border-radius: 14px; padding: 1.25rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.4rem;">🌱</span>
                <strong style="color: #0F172A; font-size: 1.05rem;">Módulo 3: Emociones</strong>
              </div>
              <span class="badge ${m3Completed ? 'badge-status-available' : 'badge-pedagogical'}">
                ${m3Completed ? '✓ Completado' : 'En progreso'}
              </span>
            </div>
            <p style="font-size: 0.88rem; color: #475569; margin: 0 0 0.75rem 0;">
              Escáner Corporal, Respiración, Semáforo y Caja de Herramientas.
            </p>
            <button type="button" class="lc-btn lc-btn-sm lc-btn-secondary" id="btn-goto-mod3-edit" style="width: 100%;">
              <span>Ir a Módulo 3 →</span>
            </button>
          </div>

        </div>

        <!-- 5. DETALLE COMPLETO DE RESPUESTAS POR CADA MÓDULO -->

        <!-- SECCIÓN MÓDULO 1 -->
        <div class="lc-responses-module-block" style="background: #FFFFFF; border: 1.5px solid #CBD5E1; border-radius: 16px; padding: 1.5rem; margin-bottom: 2rem;">
          <div style="display: flex; align-items: center; gap: 0.65rem; border-bottom: 2px solid #E2E8F0; padding-bottom: 0.85rem; margin-bottom: 1.25rem;">
            <span style="font-size: 1.5rem;">🎒</span>
            <h3 style="margin: 0; color: #005A29; font-size: 1.3rem; font-weight: 800;">
              Módulo 1: Preparar el Equipaje — Respuestas Registradas
            </h3>
          </div>

          <!-- Estación 1 -->
          <div style="margin-bottom: 1.5rem;">
            <h4 style="color: #0F172A; font-size: 1.1rem; margin: 0 0 0.75rem 0;">
              📍 Estación 1: Conocer el terreno
            </h4>
            
            <div style="display: grid; gap: 1rem; margin-left: 0.5rem;">
              <div>
                <strong style="color: #334155; font-size: 0.92rem;">🌤️ Clima Emocional Seleccionado:</strong>
                <span class="badge badge-pedagogical" style="margin-left: 0.5rem;">
                  ${s1.selectedWeather ? s1.selectedWeather.toUpperCase() : 'Pendiente'}
                </span>
              </div>

              <!-- Notas del Clima -->
              <div style="background: #F8FAFC; border-radius: 10px; padding: 0.85rem 1rem;">
                <strong style="color: #334155; font-size: 0.88rem; display: block; margin-bottom: 0.35rem;">Reflexiones sobre el clima emocional:</strong>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>☀️ Soleado:</strong> ${fmtText(weatherNotes.soleado)}</p>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>⛅ Nublado:</strong> ${fmtText(weatherNotes.nublado)}</p>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>🌧️ Lluvioso:</strong> ${fmtText(weatherNotes.lluvioso)}</p>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>⛈️ Tormenta:</strong> ${fmtText(weatherNotes.tormenta)}</p>
              </div>

              <!-- Áreas de vida -->
              <div>
                <strong style="color: #334155; font-size: 0.92rem; display: block; margin-bottom: 0.35rem;">
                  🎯 Áreas de vida priorizadas para cuidado:
                </strong>
                <div>${fmtList(s1.selectedAreas)}</div>
                <div style="margin-top: 0.5rem;">
                  <span style="font-size: 0.88rem; color: #64748B;">¿Qué me ha ayudado y qué necesito para brindar mayor atención a estas áreas?:</span>
                  ${fmtText(s1.areasReflection)}
                </div>
              </div>

              <!-- Brújula Emocional -->
              <div style="background: #F8FAFC; border-radius: 10px; padding: 0.85rem 1rem;">
                <strong style="color: #334155; font-size: 0.88rem; display: block; margin-bottom: 0.35rem;">🧭 Brújula Emocional:</strong>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>💭 Lo que siento (Emoción):</strong> ${fmtText(compass.feeling)}</p>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>🌱 Lo que necesito:</strong> ${fmtText(compass.need)}</p>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>💪 Mis recursos y fortalezas:</strong> ${fmtText(compass.strengths)}</p>
              </div>
            </div>
          </div>

          <!-- Estación 2 -->
          <div style="margin-bottom: 1.5rem; border-top: 1px dashed #E2E8F0; padding-top: 1.25rem;">
            <h4 style="color: #0F172A; font-size: 1.1rem; margin: 0 0 0.75rem 0;">
              📍 Estación 2: Reconocer los desvíos
            </h4>
            <div style="display: grid; gap: 0.75rem; margin-left: 0.5rem;">
              <div>
                <strong style="color: #334155; font-size: 0.92rem; display: block; margin-bottom: 0.35rem;">
                  🛠️ Herramientas pedagógicas sugeridas para el caso Juan:
                </strong>
                <div>${fmtList(s2.selectedJuanTools)}</div>
              </div>
              <div>
                <strong style="color: #334155; font-size: 0.92rem; display: block; margin-bottom: 0.35rem;">
                  🎙️ Reflexión de superación de dificultades:
                </strong>
                ${fmtText(s2.podcastReflection)}
              </div>
            </div>
          </div>

          <!-- Estación 3 y Cierre -->
          <div style="border-top: 1px dashed #E2E8F0; padding-top: 1.25rem;">
            <h4 style="color: #0F172A; font-size: 1.1rem; margin: 0 0 0.75rem 0;">
              📍 Estación 3: Viajar acompañado & Maleta de Cierre
            </h4>
            <div style="display: grid; gap: 0.75rem; margin-left: 0.5rem;">
              <div>
                <strong style="color: #334155; font-size: 0.92rem; display: block; margin-bottom: 0.35rem;">
                  👥 Red de Apoyo identificada:
                </strong>
                <div>${fmtList(s3.supportNodes)}</div>
              </div>
              <div>
                <strong style="color: #334155; font-size: 0.92rem; display: block; margin-bottom: 0.35rem;">
                  💬 Persona o institución con quien hablaría esta semana si lo necesitara:
                </strong>
                ${fmtText(s3.talkCandidate)}
              </div>
              <div>
                <strong style="color: #334155; font-size: 0.92rem; display: block; margin-bottom: 0.35rem;">
                  🎒 Compromiso en la Maleta: ¿Qué herramienta utilizaré primero y por qué?:
                </strong>
                ${fmtText(closing1.firstToolText)}
              </div>
            </div>
          </div>

        </div>

        <!-- SECCIÓN MÓDULO 2 -->
        <div class="lc-responses-module-block" style="background: #FFFFFF; border: 1.5px solid #CBD5E1; border-radius: 16px; padding: 1.5rem; margin-bottom: 2rem;">
          <div style="display: flex; align-items: center; gap: 0.65rem; border-bottom: 2px solid #E2E8F0; padding-bottom: 0.85rem; margin-bottom: 1.25rem;">
            <span style="font-size: 1.5rem;">🧭</span>
            <h3 style="margin: 0; color: #005A29; font-size: 1.3rem; font-weight: 800;">
              Módulo 2: Elegir el Rumbo — Respuestas Registradas
            </h3>
          </div>

          <!-- Ruta 1: Proyecto de Vida -->
          <div style="margin-bottom: 1.5rem;">
            <h4 style="color: #0F172A; font-size: 1.1rem; margin: 0 0 0.75rem 0;">
              🌿 Ruta 1: Mi Proyecto de Vida
            </h4>
            <div style="display: grid; gap: 0.85rem; margin-left: 0.5rem;">
              <div>
                <strong style="color: #334155; font-size: 0.92rem; display: block;">1. ¿Qué te motivó a ingresar a la universidad?:</strong>
                ${fmtText(sp.question1)}
              </div>
              <div>
                <strong style="color: #334155; font-size: 0.92rem; display: block;">2. ¿Qué esperas lograr durante esta etapa?:</strong>
                ${fmtText(sp.question2)}
              </div>
              <div>
                <strong style="color: #334155; font-size: 0.92rem; display: block;">3. ¿Qué fortalezas reconoces en ti?:</strong>
                ${fmtText(sp.question3)}
              </div>

              <!-- Árbol del Proyecto de Vida -->
              <div style="background: #F8FAFC; border-radius: 10px; padding: 0.85rem 1rem; margin-top: 0.5rem;">
                <strong style="color: #334155; font-size: 0.92rem; display: block; margin-bottom: 0.5rem;">🌳 Árbol del Proyecto de Vida:</strong>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>🌱 Raíces (Valores):</strong> ${fmtText(tree.roots)}</p>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>🪵 Tronco (Fortalezas):</strong> ${fmtText(tree.trunk)}</p>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>🌿 Ramas (Metas académicas y personales):</strong> ${fmtText(tree.branches)}</p>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>🍎 Frutos (Sueños y aspiraciones):</strong> ${fmtText(tree.fruits)}</p>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>💡 Aspecto a fortalecer este semestre:</strong> ${fmtText(tree.reflection)}</p>
              </div>
            </div>
          </div>

          <!-- Ruta 2: Adaptación Universitaria -->
          <div style="border-top: 1px dashed #E2E8F0; padding-top: 1.25rem;">
            <h4 style="color: #0F172A; font-size: 1.1rem; margin: 0 0 0.75rem 0;">
              🏔️ Ruta 2: Adaptación Universitaria
            </h4>
            <div style="display: grid; gap: 0.85rem; margin-left: 0.5rem;">
              <div style="background: #F8FAFC; border-radius: 10px; padding: 0.85rem 1rem;">
                <strong style="color: #334155; font-size: 0.92rem; display: block; margin-bottom: 0.5rem;">🌡️ Termómetro de Adaptación:</strong>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>✨ Lo más fácil hasta ahora:</strong> ${fmtText(thermo.easy)}</p>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>⛰️ Mayor reto experimentado:</strong> ${fmtText(thermo.challenge)}</p>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>🤝 Recursos institucionales y personales que han ayudado:</strong> ${fmtText(thermo.resources)}</p>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>🎯 Qué necesito fortalecer:</strong> ${fmtText(thermo.strengthen)}</p>
              </div>

              <div>
                <strong style="color: #334155; font-size: 0.92rem; display: block;">🧑‍🎓 Sugerencias para el Caso Daniel:</strong>
                ${fmtText(r2.danielCase?.actionSuggestions)}
              </div>

              <div style="background: #F8FAFC; border-radius: 10px; padding: 0.85rem 1rem;">
                <strong style="color: #334155; font-size: 0.92rem; display: block; margin-bottom: 0.5rem;">📋 Plan Personal de Adaptación:</strong>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>💪 Mi principal fortaleza:</strong> ${fmtText(plan.mainStrength)}</p>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>🧗 Mi principal reto:</strong> ${fmtText(plan.mainChallenge)}</p>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>1️⃣ Acción Concreta 1:</strong> ${fmtText(plan.action1)}</p>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>2️⃣ Acción Concreta 2:</strong> ${fmtText(plan.action2)}</p>
                <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>3️⃣ Acción Concreta 3:</strong> ${fmtText(plan.action3)}</p>
              </div>
            </div>
          </div>

        </div>

        <!-- SECCIÓN MÓDULO 3 -->
        <div class="lc-responses-module-block" style="background: #FFFFFF; border: 1.5px solid #CBD5E1; border-radius: 16px; padding: 1.5rem; margin-bottom: 2rem;">
          <div style="display: flex; align-items: center; gap: 0.65rem; border-bottom: 2px solid #E2E8F0; padding-bottom: 0.85rem; margin-bottom: 1.25rem;">
            <span style="font-size: 1.5rem;">🌱</span>
            <h3 style="margin: 0; color: #005A29; font-size: 1.3rem; font-weight: 800;">
              Módulo 3: Gestionando mis Emociones — Respuestas Registradas
            </h3>
          </div>

          <div style="display: grid; gap: 1rem; margin-left: 0.5rem;">
            <div>
              <strong style="color: #334155; font-size: 0.92rem; display: block; margin-bottom: 0.35rem;">
                🧘 Pausa 1: Zonas corporales donde acumulo tensión:
              </strong>
              <div>${fmtList(p1.selectedRegions)}</div>
              <div style="margin-top: 0.4rem;">
                <span style="font-size: 0.88rem; color: #64748B;">Notas personales del escáner corporal:</span>
                ${fmtText(p1.bodyNotes)}
              </div>
            </div>

            <div style="border-top: 1px dashed #E2E8F0; padding-top: 0.85rem;">
              <strong style="color: #334155; font-size: 0.92rem; display: block; margin-bottom: 0.35rem;">
                🌬️ Pausa 2: Respiración Consciente:
              </strong>
              <p style="margin: 0; font-size: 0.9rem;">Rondas completadas: <strong>${p2.breathingRounds || 0} rondas</strong></p>
            </div>

            <div style="background: #F8FAFC; border-radius: 10px; padding: 0.85rem 1rem; border-top: 1px dashed #E2E8F0;">
              <strong style="color: #334155; font-size: 0.92rem; display: block; margin-bottom: 0.5rem;">🚦 Pausa 3: Semáforo Emocional:</strong>
              <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>🔴 Luz Roja (Detenerse / Reconocer):</strong> ${fmtText(tf.redText)}</p>
              <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>🟡 Luz Amarilla (Explorar opciones y calmar):</strong> ${fmtText(tf.yellowText)}</p>
              <p style="margin: 0.25rem 0; font-size: 0.9rem;"><strong>🟢 Luz Verde (Actuar saludablemente):</strong> ${fmtText(tf.greenText)}</p>
            </div>

            <div style="border-top: 1px dashed #E2E8F0; padding-top: 0.85rem;">
              <strong style="color: #334155; font-size: 0.92rem; display: block; margin-bottom: 0.35rem;">
                🧰 Pausa 4: Caja de Herramientas & Frase Ancla:
              </strong>
              <div>
                <span style="font-size: 0.88rem; color: #64748B;">Reflexión tras ejercicio sensorial 5-4-3-2-1:</span>
                ${fmtText(p4.postExerciseReflection)}
              </div>
              <div style="margin-top: 0.5rem;">
                <span style="font-size: 0.88rem; color: #64748B;">Herramientas seleccionadas para mi kit personal:</span>
                <div>${fmtList(p4.selectedTools)}</div>
              </div>
              <div style="margin-top: 0.5rem;">
                <span style="font-size: 0.88rem; color: #64748B;">Frase ancla o compromiso de regulación emocional:</span>
                ${fmtText(p4.customToolNote)}
              </div>
            </div>
          </div>
        </div>

        <!-- 6. BOTONES DE SALIDA -->
        <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 2rem;">
          <button type="button" class="lc-btn lc-btn-primary" id="btn-exit-full-review" style="padding: 0.95rem 2.5rem; font-weight: 800;">
            <span>Volver a la Pantalla Principal</span>
          </button>
        </div>

      </section>
    `;

    // Eventos
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

    // Selector de estudiante
    const selectProfile = this.containerEl.querySelector('#select-student-profile');
    if (selectProfile) {
      selectProfile.addEventListener('change', (e) => {
        learningCenterState.switchProfile(e.target.value);
        this.renderReviewAll();
      });
    }

    // Crear nuevo estudiante
    const btnCreate = this.containerEl.querySelector('#btn-create-profile');
    if (btnCreate) {
      btnCreate.addEventListener('click', () => {
        const name = prompt('Ingrese el nombre o código del nuevo estudiante:', `Estudiante ${profiles.length + 1}`);
        if (name && name.trim()) {
          learningCenterState.createProfile(name.trim());
          this.renderReviewAll();
        }
      });
    }

    // Renombrar estudiante activo
    const btnRename = this.containerEl.querySelector('#btn-rename-profile');
    if (btnRename) {
      btnRename.addEventListener('click', () => {
        const newName = prompt('Editar nombre de este estudiante:', activeProfile.name);
        if (newName && newName.trim()) {
          learningCenterState.setActiveProfileName(newName.trim());
          this.renderReviewAll();
        }
      });
    }

    // Eliminar estudiante
    const btnDel = this.containerEl.querySelector('#btn-delete-profile');
    if (btnDel) {
      btnDel.addEventListener('click', () => {
        if (confirm(`¿Estás seguro de eliminar el perfil y respuestas de "${activeProfile.name}"?`)) {
          learningCenterState.deleteProfile(activeProfile.id);
          this.renderReviewAll();
        }
      });
    }

    // Imprimir
    const btnPrint = this.containerEl.querySelector('#btn-print-responses');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        window.print();
      });
    }

    // Descargar en texto
    const btnDownload = this.containerEl.querySelector('#btn-download-responses-txt');
    if (btnDownload) {
      btnDownload.addEventListener('click', () => {
        this.downloadResponsesText(activeProfile.name, state);
      });
    }
  }

  downloadResponsesText(studentName, state) {
    const s1 = state.module1?.equipaje?.station1 || {};
    const s2 = state.module1?.equipaje?.station2 || {};
    const s3 = state.module1?.equipaje?.station3 || {};
    const closing1 = state.module1?.equipaje?.closing || {};

    const r1 = state.module2?.ruta1 || {};
    const r2 = state.module2?.ruta2 || {};
    const tree = r1.tree || {};
    const thermo = r2.thermometer?.textAnswers || {};
    const plan = r2.adaptationPlan || {};

    const p1 = state.module3?.pausa1 || {};
    const p3 = state.module3?.pausa3 || {};
    const p4 = state.module3?.pausa4 || {};

    const content = `=====================================================
TECNOLÓGICO DE ANTIOQUIA - CAMPUS VITAL (CIENCIAS BÁSICAS)
BITÁCORA INTEGRAL DE RESPUESTAS DEL ESTUDIANTE
=====================================================
Estudiante: ${studentName}
Fecha de generación: ${new Date().toLocaleString()}

-----------------------------------------------------
MÓDULO 1: PREPARAR EL EQUIPAJE
-----------------------------------------------------
* Estación 1: Conocer el terreno
  - Clima Emocional Seleccionado: ${s1.selectedWeather || 'N/A'}
  - Notas Soleado: ${s1.weatherNotes?.soleado || 'Sin notas'}
  - Notas Nublado: ${s1.weatherNotes?.nublado || 'Sin notas'}
  - Notas Lluvioso: ${s1.weatherNotes?.lluvioso || 'Sin notas'}
  - Notas Tormenta: ${s1.weatherNotes?.tormenta || 'Sin notas'}
  - Áreas de cuidado: ${(s1.selectedAreas || []).join(', ') || 'Ninguna'}
  - Reflexión áreas: ${s1.areasReflection || 'Sin respuesta'}
  - Brújula Emocional (Sentir): ${s1.compass?.feeling || 'Sin respuesta'}
  - Brújula Emocional (Necesidad): ${s1.compass?.need || 'Sin respuesta'}
  - Brújula Emocional (Fortalezas): ${s1.compass?.strengths || 'Sin respuesta'}

* Estación 2: Reconocer los desvíos
  - Herramientas caso Juan: ${(s2.selectedJuanTools || []).join(', ') || 'Ninguna'}
  - Reflexión Podcast: ${s2.podcastReflection || 'Sin respuesta'}

* Estación 3: Viajar acompañado
  - Red de apoyo: ${(s3.supportNodes || []).join(', ') || 'Ninguna'}
  - Persona de apoyo esta semana: ${s3.talkCandidate || 'Sin respuesta'}

* Maleta y Cierre Módulo 1
  - Primera herramienta a usar y por qué: ${closing1.firstToolText || 'Sin respuesta'}

-----------------------------------------------------
MÓDULO 2: ELEGIR EL RUMBO
-----------------------------------------------------
* Ruta 1: Mi Proyecto de Vida
  - Motivación para ingresar: ${r1.startPoint?.question1 || 'Sin respuesta'}
  - Qué espera lograr: ${r1.startPoint?.question2 || 'Sin respuesta'}
  - Fortalezas reconocidas: ${r1.startPoint?.question3 || 'Sin respuesta'}
  - Árbol - Raíces (Valores): ${tree.roots || 'Sin respuesta'}
  - Árbol - Tronco (Fortalezas): ${tree.trunk || 'Sin respuesta'}
  - Árbol - Ramas (Metas): ${tree.branches || 'Sin respuesta'}
  - Árbol - Frutos (Sueños): ${tree.fruits || 'Sin respuesta'}
  - Aspecto a fortalecer este semestre: ${tree.reflection || 'Sin respuesta'}

* Ruta 2: Adaptación Universitaria
  - Termómetro - Más fácil: ${thermo.easy || 'Sin respuesta'}
  - Termómetro - Mayor reto: ${thermo.challenge || 'Sin respuesta'}
  - Termómetro - Recursos de ayuda: ${thermo.resources || 'Sin respuesta'}
  - Termómetro - Qué fortalecer: ${thermo.strengthen || 'Sin respuesta'}
  - Caso Daniel: ${r2.danielCase?.actionSuggestions || 'Sin respuesta'}
  - Plan - Fortaleza principal: ${plan.mainStrength || 'Sin respuesta'}
  - Plan - Reto principal: ${plan.mainChallenge || 'Sin respuesta'}
  - Plan - Acción 1: ${plan.action1 || 'Sin respuesta'}
  - Plan - Acción 2: ${plan.action2 || 'Sin respuesta'}
  - Plan - Acción 3: ${plan.action3 || 'Sin respuesta'}

-----------------------------------------------------
MÓDULO 3: GESTIONANDO MIS EMOCIONES
-----------------------------------------------------
* Pausa 1: Escáner Corporal
  - Zonas de tensión: ${(p1.selectedRegions || []).join(', ') || 'Ninguna'}
  - Notas corporales: ${p1.bodyNotes || 'Sin notas'}

* Pausa 2: Respiración Consciente
  - Rondas completadas: ${state.module3?.pausa2?.breathingRounds || 0}

* Pausa 3: Semáforo Emocional
  - Luz Roja: ${p3.trafficLight?.redText || 'Sin respuesta'}
  - Luz Amarilla: ${p3.trafficLight?.yellowText || 'Sin respuesta'}
  - Luz Verde: ${p3.trafficLight?.greenText || 'Sin respuesta'}

* Pausa 4: Caja de Herramientas
  - Reflexión sensorial 5-4-3-2-1: ${p4.postExerciseReflection || 'Sin respuesta'}
  - Herramientas seleccionadas: ${(p4.selectedTools || []).join(', ') || 'Ninguna'}
  - Frase ancla / compromiso: ${p4.customToolNote || 'Sin respuesta'}

=====================================================
Fin de la Bitácora de Respuestas · Territorio TdeA
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bitacora_Respuestas_${studentName.replace(/[^a-zA-Z0-9]/g, '_')}_CampusVital.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

    updateMenuBadges() {
    const m1 = learningCenterState.state.module1;
    const m2 = learningCenterState.state.module2;
    const m3 = learningCenterState.state.module3 || {};
    const m1Completed = m1.completed || Boolean(m1.equipaje?.closing?.completed) || (m1.audio?.hasAudio && Boolean(m1.caseDaniel?.answerText));
    const m2Completed = Boolean(m2.completed || (m2.ruta1?.completed && m2.ruta2?.completed));
    const m3Completed = Boolean(m3.completed || m3.cierre?.completed);
    const activeProfile = learningCenterState.getActiveProfile();
    const totalAnswers = learningCenterState.countStateAnswers(learningCenterState.state);

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
