/**
 * Módulo 3 — Gestionando mis emociones: «Aprender a navegar los cambios»
 * Centro de Aprendizaje "TdeA Contigo" - Campus Vital 2026
 * Tecnológico de Antioquia - Institución Universitaria
 *
 * Enfoque DUA (Diseño Universal para el Aprendizaje):
 * - Representación múltiple (Audio en off institucional, Videos explicativos y de locución, Transcripciones)
 * - Acción y Expresión (Escáner corporal interactivo con selección directa sobre la figura anatómica y tarjetas,
 *   Ejercicio de respiración 4-2-6 con repetición ilimitada, Semáforo emocional con cuadros de texto,
 *   Caso Valentina con retroalimentación inmediata, Técnica sensorial 5-4-3-2-1 con reflexión obligatoria
 *   y Ficha descargable "Mi Caja de Herramientas para Volver a la Calma")
 * - Compromiso y Motivación (Menú central de Pausas con progresión desbloqueable paso a paso estilo Estaciones/Rutas)
 */

import { learningCenterState } from './learningCenterState.js';
import { getBodySilhouetteSvg, BODY_REGIONS_CONFIG } from './bodySilhouetteSvg.js?v=20261108_05';
import { PausasJourneyAnimation } from './pausasJourneyAnimation.js?v=20261108_03';

export class Module3View {
  constructor(containerEl, onNavigate) {
    this.containerEl = containerEl;
    this.onNavigate = onNavigate; // callback para volver al menú principal ('menu'), o ir a mod1 / mod2
    this.currentStep = 'intro'; // 'intro' | 'intro_audio' | 'pausas_menu' | 'pausa1_video' | 'pausa1_scanner' | 'pausa2' | 'pausa3_semaforo' | 'pausa3_caso' | 'pausa4_presente' | 'pausa4_caja' | 'cierre'

    // Estado del reproductor de audio DUA activo
    this.activeAudioEl = null;
    this.activeAudioTimer = null;

    // Estado del ejercicio de respiración 4-2-6
    this.breathingTimer = null;
    this.breathingPhase = 'idle'; // 'idle' | 'inhala' | 'sosten' | 'exhala'
    this.breathingSecondsLeft = 0;
    this.isBreathingRunning = false;

    // Notificación tras completar una pausa
    this.lastCompletedPausa = null;
  }

  scrollToTop() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  }

  cleanupTimersAndAudio() {
    if (this.activeAudioTimer) {
      clearInterval(this.activeAudioTimer);
      this.activeAudioTimer = null;
    }
    if (this.activeAudioEl) {
      try {
        this.activeAudioEl.pause();
      } catch (e) {}
      this.activeAudioEl = null;
    }
    if (this.breathingTimer) {
      clearInterval(this.breathingTimer);
      this.breathingTimer = null;
    }
    this.isBreathingRunning = false;
  }

  /**
   * Renderiza el paso activo del Módulo 3
   * @param {string} stepKey Identificador del paso
   */
  render(stepKey = 'intro') {
    if (!this.containerEl) return;
    this.cleanupTimersAndAudio();

    // Normalización y mapeo de alias
    let target = stepKey || 'intro';
    if (target === 'module_intro') target = 'intro';
    if (target === 'menu' || target === 'pausas_menu') target = 'pausas_menu';
    if (target === 'pausa1') target = 'pausa1_video';
    if (target === 'pausa2') target = 'pausa2';
    if (target === 'pausa3') target = 'pausa3_semaforo';
    if (target === 'pausa4') target = 'pausa4_presente';

    const validSteps = [
      'intro',
      'intro_audio',
      'pausas_menu',
      'pausa1_video',
      'pausa1_scanner',
      'pausa2',
      'pausa3_semaforo',
      'pausa3_caso',
      'pausa4_presente',
      'pausa4_caja',
      'cierre'
    ];

    if (!validSteps.includes(target)) {
      target = 'intro';
    }

    if (this.currentStep !== 'pausa2' && this.isBreathingRunning) {
      this.stopBreathingExercise();
    }

    this.currentStep = target;
    learningCenterState.setModule3CurrentPausa(target);

    switch (this.currentStep) {
      case 'intro':
        this.renderIntro();
        break;
      case 'intro_audio':
        this.renderIntroAudio();
        break;
      case 'pausas_menu':
        this.renderPausasMenu();
        break;
      case 'pausa1_video':
        this.renderPausa1Video();
        break;
      case 'pausa1_scanner':
        this.renderPausa1Scanner();
        break;
      case 'pausa2':
        this.renderPausa2();
        break;
      case 'pausa3_semaforo':
        this.renderPausa3Semaforo();
        break;
      case 'pausa3_caso':
        this.renderPausa3Caso();
        break;
      case 'pausa4_presente':
        this.renderPausa4Presente();
        break;
      case 'pausa4_caja':
        this.renderPausa4Caja();
        break;
      case 'cierre':
        this.renderCierre();
        break;
      default:
        this.renderIntro();
    }
  }

  /**
   * Genera el botón superior según el paso:
   * En Intro y Menú de Pausas: regresa al menú general de Campus Vital.
   * En las actividades de cada Pausa: regresa al Menú de Pausas del Módulo 3.
   */
  renderHeaderHtml(stepKey = this.currentStep) {
    const isInsidePausa = [
      'pausa1_video',
      'pausa1_scanner',
      'pausa2',
      'pausa3_semaforo',
      'pausa3_caso',
      'pausa4_presente',
      'pausa4_caja'
    ].includes(stepKey);

    if (isInsidePausa) {
      return `
        <div class="lc-equipaje-stepper" role="navigation" aria-label="Navegación del Módulo 3">
          <button type="button" class="lc-btn-back-menu" id="mod3-btn-to-pausas-menu" aria-label="Volver al menú de pausas del módulo 3">
            <span aria-hidden="true">←</span> <span>Menú de Pausas</span>
          </button>
        </div>
      `;
    }

    return `
      <div class="lc-equipaje-stepper" role="navigation" aria-label="Navegación del Módulo 3">
        <button type="button" class="lc-btn-back-menu" id="mod3-btn-to-menu" aria-label="Volver al menú de Campus Vital">
          <span aria-hidden="true">←</span> <span>Menú Campus Vital</span>
        </button>
      </div>
    `;
  }

  bindCommonHeaderEvents() {
    const btnMenu = this.containerEl.querySelector('#mod3-btn-to-menu');
    if (btnMenu) {
      btnMenu.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('menu');
      });
    }

    const btnPausasMenu = this.containerEl.querySelector('#mod3-btn-to-pausas-menu');
    if (btnPausasMenu) {
      btnPausasMenu.addEventListener('click', () => {
        this.render('pausas_menu');
      });
    }
  }

  // =========================================================================
  // 0. INTRODUCCIÓN GENERAL DEL MÓDULO 3
  // Solo marco verde institucional, sin metadata ni audios/pausas incrustados
  // =========================================================================
  renderIntro() {
    this.scrollToTop();
    // Reiniciar las pausas al comenzar el módulo desde el inicio
    learningCenterState.resetModule3();
    this.lastCompletedPausa = null;

    this.containerEl.innerHTML = `
      <section class="lc-equipaje-root animate-fade-in" aria-labelledby="mod3-intro-heading">
        ${this.renderHeaderHtml('intro')}

        <!-- Tarjeta Hero de Introducción con Fondo Verde Institucional (Marco Verde) -->
        <div class="mod1-hero-intro-card animate-fade-in">
          <div class="mod1-hero-intro-top">
            
            <!-- Mascota: Robot de Campus Vital abrazando corazón rojo -->
            <div class="mod1-hero-mascot-wrapper">
              <div class="mod1-mascot-glow-halo"></div>
              <img 
                src="assets/icons/campus-vital-mascot-red-heart.svg" 
                alt="Robot del Asistente TdeA abrazando un corazón rojo" 
                class="mod1-hero-mascot-img" 
                width="230" 
                height="230" 
              />
            </div>

            <!-- Contenido textual institucional sin campos metadata -->
            <div class="mod1-hero-intro-content">
              <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.85rem; background: rgba(116, 214, 51, 0.2); color: #A3E635; border: 1px solid rgba(116, 214, 51, 0.4);">
                <span>🌱</span>
                <span>MÓDULO 3 · REGULACIÓN EMOCIONAL Y BIENESTAR</span>
              </div>

              <h1 id="mod3-intro-heading" class="mod1-intro-title">
                Aprender a navegar los cambios
              </h1>

              <div class="mod1-intro-text-body">
                <p>
                  Durante la vida universitaria vivimos momentos de entusiasmo, ilusión y aprendizaje. Pero también podemos experimentar preocupación, nervios, miedo o ansiedad frente a nuevos retos.
                </p>
                <p>
                  Estas emociones hacen parte de nuestra experiencia. <strong>Lo importante no es evitarlas, sino aprender a reconocerlas</strong> y contar con herramientas que nos ayuden a responder de una manera saludable.
                </p>
                <p>
                  En este módulo descubrirás algunas estrategias sencillas que podrás practicar cuando necesites volver a la calma. Vamos a tener <strong>4 cortas pausas</strong> que nos ayudarán con esto en el viaje.
                </p>
              </div>

              <!-- Botón Siguiente para pasar al audio de introducción -->
              <div class="mod1-intro-actions-row">
                <button type="button" class="lc-btn-intro-next" id="btn-intro-next-to-audio">
                  <span>Siguiente: Audio de Introducción</span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>
    `;

    this.bindCommonHeaderEvents();

    const btnNext = this.containerEl.querySelector('#btn-intro-next-to-audio');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        learningCenterState.resetModule3();
        this.lastCompletedPausa = null;
        this.render('intro_audio');
      });
    }
  }

  // =========================================================================
  // 1. PANTALLA DEDICADA: AUDIO DE INTRODUCCIÓN DUA
  // =========================================================================
  renderIntroAudio() {
    this.scrollToTop();
    this.containerEl.innerHTML = `
      <section class="lc-equipaje-root animate-fade-in" aria-labelledby="mod3-audio-main-heading">
        ${this.renderHeaderHtml('intro_audio')}

        <!-- Banner de Encabezado Institucional con Propósito y Tema -->
        <div class="lc-module-header">
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.5rem;">
            <span>🌱</span>
            <span>CENTRO DE APRENDIZAJE · TdeA CONTIGO · PROYECTO CAMPUS VITAL 2026</span>
          </div>
          <h1 id="mod3-audio-main-heading" class="lc-module-heading">Módulo 3: Gestionando mis emociones</h1>
          <h2 style="font-size: 1.25rem; color: #00843D; font-weight: 800; margin: 0.25rem 0 0.75rem 0;">«Aprender a navegar los cambios»</h2>
          <p class="lc-module-intro">
            <strong>Propósito:</strong> Fortalecer la capacidad de los estudiantes para reconocer sus emociones y aplicar estrategias prácticas de regulación emocional que les permitan afrontar situaciones de ansiedad, estrés y tensión propias de la vida universitaria, favoreciendo su bienestar y permanencia.
          </p>
          <p style="font-size: 0.95rem; color: #475569; margin: 0.4rem 0 0 0;">
            <strong>Tema:</strong> Manejo de la ansiedad mediante la regulación emocional.
          </p>
        </div>

        <!-- Tarjeta del Reproductor de Audio DUA -->
        <div class="lc-embed-card" style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 18px; padding: 1.75rem; box-shadow: 0 4px 18px rgba(0, 43, 20, 0.08);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span style="font-size: 1.6rem;" aria-hidden="true">🎧</span>
              <h3 style="margin: 0; font-size: 1.2rem; font-weight: 800; color: #022B14;">Audio de Introducción: Aprender a navegar los cambios</h3>
            </div>
            <span style="font-size: 0.85rem; font-weight: 700; color: #00843D; background: #E8F5E9; padding: 0.25rem 0.65rem; border-radius: 6px;">
              «Voz en off institucional Campus Vital TdeA»
            </span>
          </div>

          <!-- Reproductor de Audio Accesible DUA -->
          <div class="mod3-audio-controls-row">
            <button type="button" class="mod3-audio-play-btn" id="btn-play-intro-audio" aria-label="Reproducir audio de introducción">
              <span id="icon-play-intro">▶</span>
            </button>
            <input type="range" class="mod3-audio-scrubber" id="scrubber-intro-audio" min="0" max="100" value="0" aria-label="Progreso del audio">
            <span class="mod3-audio-time-label" id="time-intro-audio">0:00 / 0:38</span>
          </div>

          <div class="mod3-audio-actions-row">
            <a href="assets/campusVital/audio/modulo3_intro_voz.mp3" download="CampusVital_Modulo3_Introduccion.mp3" class="mod3-audio-download-btn">
              <span>📥</span> <span>Descargar audio MP3</span>
            </a>
            <button type="button" class="mod3-btn-transcript-toggle" id="btn-toggle-intro-audio-transcript" aria-expanded="false">
              <span>Ver transcripción DUA</span> <span>▼</span>
            </button>
          </div>

          <div class="mod3-transcript-box" id="transcript-intro-box" style="display: none; margin-top: 1rem;">
            <p style="margin: 0 0 0.4rem 0; font-weight: 800; color: #022B14;">Transcripción oficial de la locución:</p>
            <p style="margin: 0; font-style: italic; line-height: 1.6; color: #334155;">
              «Durante la vida universitaria vivimos momentos de entusiasmo, ilusión y aprendizaje. Pero también podemos experimentar preocupación, nervios, miedo o ansiedad frente a nuevos retos. Estas emociones hacen parte de nuestra experiencia. Lo importante no es evitarlas, sino aprender a reconocerlas y contar con herramientas que nos ayuden a responder de una manera saludable. En este módulo descubrirás algunas estrategias sencillas que podrás practicar cuando necesites volver a la calma. Vamos a tener 4 cortas paradas que nos ayudarán con esto en el viaje.»
            </p>
          </div>

          <audio id="audio-el-intro" src="assets/campusVital/audio/modulo3_intro_voz.mp3" preload="metadata"></audio>
        </div>

        <!-- Botones de Navegación Vertical -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-top: 1.5rem;">
          <button type="button" class="lc-btn lc-btn-secondary" id="btn-audio-prev">
            <span aria-hidden="true">←</span>
            <span>Anterior: Inicio del Módulo</span>
          </button>

          <button type="button" class="lc-btn lc-btn-primary" id="btn-audio-next" style="padding: 0.9rem 2.2rem; font-size: 1.05rem; font-weight: 800;">
            <span>Siguiente: Ir al Menú de Pausas</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    `;

    this.bindCommonHeaderEvents();
    this.bindAudioPlayer('intro');

    const btnPrev = this.containerEl.querySelector('#btn-audio-prev');
    if (btnPrev) btnPrev.addEventListener('click', () => this.render('intro'));

    const btnNext = this.containerEl.querySelector('#btn-audio-next');
    if (btnNext) btnNext.addEventListener('click', () => this.render('pausas_menu'));
  }

  // =========================================================================
  // 2. MENÚ CENTRAL DE LAS 4 PAUSAS CONSCIENTES (PROGRESIÓN DESBLOQUEABLE)
  // Al igual que las Estaciones (M1) o las Rutas (M2):
  // Pausa 1 está activa; Pausas 2, 3 y 4 se desbloquean en orden secuencial
  // =========================================================================
  renderPausasMenu() {
    this.scrollToTop();
    const m3 = learningCenterState.state.module3 || {};
    const p1Done = Boolean(m3.pausa1?.completed);
    const p2Done = Boolean(m3.pausa2?.completed);
    const p3Done = Boolean(m3.pausa3?.completed);
    const p4Done = Boolean(m3.pausa4?.completed);
    const allDone = p1Done && p2Done && p3Done && p4Done;

    // Conteo de pausas completadas
    const completedCount = [p1Done, p2Done, p3Done, p4Done].filter(Boolean).length;
    const progressPercent = Math.round((completedCount / 4) * 100);

    // Mensaje de felicitación contextual si acaba de finalizar una pausa
    let completionAlertHtml = '';
    if (this.lastCompletedPausa) {
      const titles = {
        1: 'Pausa 1 (Señales del cuerpo)',
        2: 'Pausa 2 (Respirar)',
        3: 'Pausa 3 (Pausa consciente)',
        4: 'Pausa 4 (Volviendo al presente)'
      };
      const nextNum = this.lastCompletedPausa < 4 ? this.lastCompletedPausa + 1 : null;
      completionAlertHtml = `
        <div style="background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); border: 2px solid #10B981; border-radius: 14px; padding: 1.1rem 1.4rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.85rem; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.15); animation: fadeIn 0.4s ease;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 1.8rem;">🎉</span>
            <div>
              <strong style="color: #065F46; font-size: 1.05rem; display: block;">¡Completaste satisfactoriamente la ${titles[this.lastCompletedPausa]}!</strong>
              <span style="color: #047857; font-size: 0.92rem;">
                ${nextNum ? `Ahora la <strong>Pausa ${nextNum}</strong> ha sido desbloqueada para continuar tu recorrido.` : '¡Has culminado las 4 pausas! Ya puedes acceder al <strong>Cierre General</strong>.'}
              </span>
            </div>
          </div>
          <button type="button" class="lc-btn lc-btn-secondary" id="btn-dismiss-alert" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">
            Entendido
          </button>
        </div>
      `;
    }

    this.containerEl.innerHTML = `
      <section class="lc-equipaje-root animate-fade-in" aria-labelledby="mod3-menu-title">
        ${this.renderHeaderHtml('pausas_menu')}

        <!-- Banner de Encabezado Institucional -->
        <div class="lc-module-header">
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.5rem;">
            <span>🌱</span>
            <span>MÓDULO 3 · REGULACIÓN EMOCIONAL Y BIENESTAR</span>
          </div>
          <h1 id="mod3-menu-title" class="lc-module-heading">Recorrido de Pausas Conscientes</h1>
          <h2 style="font-size: 1.25rem; color: #00843D; font-weight: 800; margin: 0.25rem 0 0.75rem 0;">«Aprender a navegar los cambios»</h2>
          <p class="lc-module-intro">
            Avanza paso a paso por las 4 pausas conscientes para aprender a reconocer las señales de tu cuerpo, respirar, hacer una pausa y conectar con el presente. Cada pausa completada desbloqueará la siguiente etapa.
          </p>

          <!-- Barra de Progreso de Pausas -->
          <div style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 1rem 1.4rem; margin-top: 1.25rem; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.6rem;">
              <span style="font-size: 0.95rem; font-weight: 800; color: #022B14; display: flex; align-items: center; gap: 0.45rem;">
                <span>🧭</span> <span>Progreso del Módulo:</span>
              </span>
              <span style="font-size: 0.95rem; font-weight: 800; color: #00843D;">
                ${completedCount} de 4 Pausas completadas (${progressPercent}%)
              </span>
            </div>
            <div style="width: 100%; height: 10px; background: #E2E8F0; border-radius: 9999px; overflow: hidden;">
              <div style="width: ${progressPercent}%; height: 100%; background: linear-gradient(90deg, #10B981 0%, #00843D 100%); border-radius: 9999px; transition: width 0.4s ease;"></div>
            </div>
          </div>
        </div>

        ${completionAlertHtml}

        <!-- Escenario de Animación Interactiva del Río de la Calma y las 4 Pausas (Estilo Módulo 1) -->
        <div id="m3-interactive-river-mount"></div>

        <!-- Botones de Acción Inferiores -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-top: 1.75rem;">
          <button type="button" class="lc-btn lc-btn-secondary" id="btn-menu-back-audio">
            <span aria-hidden="true">←</span>
            <span>Volver a Escuchar Audio de Introducción</span>
          </button>

          <button type="button" class="lc-btn lc-btn-secondary" id="btn-menu-reset-module3" style="color: #64748B;">
            <span aria-hidden="true">🔄</span>
            <span>Reiniciar recorrido desde el inicio</span>
          </button>

          <button type="button" class="lc-btn lc-btn-secondary" id="btn-menu-back-to-vital">
            <span>🏠 Menú Campus Vital</span>
          </button>
        </div>
      </section>
    `;

    this.bindCommonHeaderEvents();

    // Montar la animación interactiva del Río de la Calma y las 4 Pausas (Estilo Módulo 1)
    const riverMount = this.containerEl.querySelector('#m3-interactive-river-mount');
    if (riverMount) {
      const riverJourney = new PausasJourneyAnimation({
        container: riverMount,
        p1Done,
        p2Done,
        p3Done,
        p4Done,
        onSelectPausa: (num) => {
          if (num === 1) this.render('pausa1_video');
          else if (num === 2) this.render('pausa2');
          else if (num === 3) this.render('pausa3_semaforo');
          else if (num === 4) this.render('pausa4_presente');
        },
        onSelectCierre: () => this.render('cierre'),
        onResetJourney: () => {
          learningCenterState.resetModule3();
          this.lastCompletedPausa = null;
          this.render('pausas_menu');
        }
      });
      riverJourney.render();
    }

    const btnDismiss = this.containerEl.querySelector('#btn-dismiss-alert');
    if (btnDismiss) {
      btnDismiss.addEventListener('click', () => {
        this.lastCompletedPausa = null;
        btnDismiss.closest('div')?.remove();
      });
    }

    const btnBackAudio = this.containerEl.querySelector('#btn-menu-back-audio');
    if (btnBackAudio) btnBackAudio.addEventListener('click', () => this.render('intro_audio'));

    const btnResetM3 = this.containerEl.querySelector('#btn-menu-reset-module3');
    if (btnResetM3) {
      btnResetM3.addEventListener('click', () => {
        learningCenterState.resetModule3();
        this.lastCompletedPausa = null;
        this.render('pausas_menu');
      });
    }

    const btnBackVital = this.containerEl.querySelector('#btn-menu-back-to-vital');
    if (btnBackVital) {
      btnBackVital.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('menu');
      });
    }
  }

  // =========================================================================
  // 3. PAUSA 1 (PARTE 1): RESULTADO DE APRENDIZAJE Y VIDEO
  // =========================================================================
  renderPausa1Video() {
    this.scrollToTop();
    this.containerEl.innerHTML = `
      <section class="lc-equipaje-root animate-fade-in" aria-labelledby="p1-vid-title">
        ${this.renderHeaderHtml('pausa1_video')}

        <div class="lc-module-header">
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.5rem; background: #ECFDF5; color: #065F46; border: 1.5px solid #A7F3D0;">
            <span>🌱</span>
            <span>PAUSA 1 · RECONOCIENDO LAS SEÑALES DE MI CUERPO (PARTE 1 DE 2)</span>
          </div>
          <h2 id="p1-vid-title" class="lc-module-heading">Pausa 1: Reconociendo las señales de mi cuerpo</h2>

          <!-- Resultado de Aprendizaje Destacado -->
          <div style="background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%); border: 2px solid #00843D; border-left: 6px solid #00843D; padding: 1.15rem 1.4rem; border-radius: 14px; margin: 1rem 0 1.25rem 0; box-shadow: 0 4px 14px rgba(0, 132, 61, 0.08);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
              <span style="font-size: 1.25rem;">🎯</span>
              <strong style="font-size: 1.05rem; color: #022B14; text-transform: uppercase; letter-spacing: 0.5px;">Resultado de aprendizaje:</strong>
            </div>
            <p style="margin: 0; font-size: 1.05rem; font-weight: 700; color: #005A29; line-height: 1.5;">
              Al finalizar el módulo, el estudiante será capaz de identificar las señales de activación emocional y aplicar técnicas básicas de regulación emocional, respiración consciente y atención plena para afrontar situaciones de ansiedad o estrés en su vida universitaria.
            </p>
          </div>
        </div>

        <!-- Video Animado Explicativo -->
        <div class="mod3-video-embed-card">
          <div class="mod3-video-top-bar">
            <h3 class="mod3-video-title">
              <span>🎬</span> <span>Video: Reconociendo las señales de mi cuerpo</span>
            </h3>
            <button type="button" class="mod3-btn-transcript-toggle" id="btn-toggle-video1-transcript" aria-expanded="false">
              <span>Ver guion y transcripción</span> <span>▼</span>
            </button>
          </div>

          <div class="mod3-video-frame-wrap">
            <video controls playsinline preload="metadata" style="position: absolute; top:0; left:0; width:100%; height:100%; object-fit: contain; background: #000; border-radius: 12px;">
              <source src="assets/campusVital/Módulo 3/Producto 02 - Video Animado/2.Video Animado.mp4" type="video/mp4">
              Tu navegador no soporta reproducción de video local HTML5.
            </video>
          </div>

          <div class="mod3-transcript-box" id="transcript-video1-box" style="display: none; margin: 1rem 1.25rem;">
            <p style="margin: 0 0 0.5rem 0; font-weight: 800; color: #022B14;">Guion oficial del Video (Locución):</p>
            <p style="margin: 0; font-style: italic; line-height: 1.6; color: #334155;">
              «Cuando sentimos ansiedad nuestro cuerpo intenta prepararse para responder a una situación que interpreta como desafiante. Es posible sentir el corazón acelerado, respiración rápida, tensión muscular, molestias en el estómago o dificultad para concentrarse. Cada persona experimenta estas señales de manera diferente.»
            </p>
          </div>
        </div>

        <!-- Botones de Navegación Vertical -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-top: 1.5rem;">
          <button type="button" class="lc-btn lc-btn-secondary" id="btn-p1-vid-prev">
            <span aria-hidden="true">←</span>
            <span>Volver al Menú de Pausas</span>
          </button>

          <button type="button" class="lc-btn lc-btn-primary" id="btn-p1-vid-next" style="padding: 0.9rem 2.2rem; font-size: 1.05rem; font-weight: 800;">
            <span>Siguiente: Realizar Escáner Corporal</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    `;

    this.bindCommonHeaderEvents();

    const btnVidTrans = this.containerEl.querySelector('#btn-toggle-video1-transcript');
    const boxVidTrans = this.containerEl.querySelector('#transcript-video1-box');
    if (btnVidTrans && boxVidTrans) {
      btnVidTrans.addEventListener('click', () => {
        const isShown = boxVidTrans.style.display !== 'none';
        boxVidTrans.style.display = isShown ? 'none' : 'block';
        btnVidTrans.setAttribute('aria-expanded', String(!isShown));
        btnVidTrans.querySelector('span:last-child').textContent = isShown ? '▼' : '▲';
      });
    }

    const btnPrev = this.containerEl.querySelector('#btn-p1-vid-prev');
    if (btnPrev) btnPrev.addEventListener('click', () => this.render('pausas_menu'));

    const btnNext = this.containerEl.querySelector('#btn-p1-vid-next');
    if (btnNext) btnNext.addEventListener('click', () => this.render('pausa1_scanner'));
  }

  // =========================================================================
  // =========================================================================
  // 4. PAUSA 1 (PARTE 2): ACTIVIDAD ESCÁNER CORPORAL + MENSAJE REFLEXIVO
  // Silueta anatómica humana médica con difusión térmica de dolor y 10 zonas somáticas
  // =========================================================================
  renderPausa1Scanner() {
    this.scrollToTop();
    const p1State = learningCenterState.state.module3?.pausa1 || {};
    const selectedRegions = p1State.selectedRegions || [];
    const bodyNotes = p1State.bodyNotes || '';

    this.containerEl.innerHTML = `
      <section class="lc-equipaje-root animate-fade-in" aria-labelledby="p1-scan-title">
        ${this.renderHeaderHtml('pausa1_scanner')}

        <div class="lc-module-header">
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.5rem; background: #ECFDF5; color: #065F46; border: 1.5px solid #A7F3D0;">
            <span>🌱</span>
            <span>PAUSA 1 · RECONOCIENDO LAS SEÑALES DE MI CUERPO (PARTE 2 DE 2)</span>
          </div>
          <h2 id="p1-scan-title" class="lc-module-heading">Actividad: Escáner Corporal</h2>
          <p class="lc-module-intro">
            Observa la silueta anatómica. <strong>Haz clic directamente sobre cualquier parte del cuerpo</strong> o en la lista de la derecha para indicar dónde sueles experimentar tensión, dolor o señales somáticas ante la exigencia académica:
          </p>
        </div>

        <!-- Escáner Somático: Diseño Original Campus Vital con Silueta y Lista de 10 Zonas -->
        <div class="lc-body-pain-stage-grid" style="margin-top: 1.5rem;">
          <!-- Columna Izquierda: Silueta Anatómica Humana -->
          <div class="lc-human-silhouette-card">
            <div class="lc-silhouette-top-bar">
              <div class="lc-silhouette-legend">
                <span class="lc-legend-dot-diffuse"></span>
                <span>Mapa Somático de Tensión Térmica</span>
              </div>
              <span class="lc-silhouette-instruction-hint">Haz clic en cualquier punto del cuerpo para encender la señal</span>
            </div>

            <div class="lc-human-svg-wrapper" id="mod3-silhouette-wrapper" style="position: relative;">
              ${getBodySilhouetteSvg({ id: 'mod3-body-scanner-svg', selectedIds: selectedRegions })}
            </div>

            <div class="mod3-silhouette-hint" style="margin-top: 0.85rem; font-weight: 700; color: #00843D; text-align: center; font-size: 0.82rem;">
              💡 Toca directamente la figura o selecciona las zonas del panel lateral.
            </div>
          </div>

          <!-- Columna Derecha: Panel de 10 Regiones con Contador Institucional -->
          <div class="lc-body-pain-details-card">
            <div class="lc-pain-counter-header">
              <div class="lc-pain-counter-badge">
                <span class="lc-pain-counter-number" id="p1-counter-num">${selectedRegions.length}</span>
                <span class="lc-pain-counter-text">Zonas de tensión identificadas</span>
              </div>
              <p class="lc-pain-counter-hint">
                Selecciona las áreas del cuerpo donde sueles experimentar dolor, tensión, sobrecarga física o somatización del estrés académico:
              </p>
            </div>

            <div class="lc-body-regions-chips-list" id="mod3-regions-list">
              ${this.renderScannerRegionsHtml(selectedRegions)}
            </div>
          </div>
        </div>

        <!-- Campo de Reflexión Personal Escrita -->
        <div class="mod3-scanner-reflection-box" style="margin-top: 1.75rem;">
          <label for="p1-body-notes" style="display: block; font-size: 0.95rem; font-weight: 800; color: #022B14; margin-bottom: 0.4rem;">
            📝 ¿Qué otra señal o sensación notas en tu cuerpo ante el estrés?
          </label>
          <textarea
            id="p1-body-notes"
            class="mod3-tl-input"
            placeholder="Ejemplo: Suelo apretar la mandíbula o sentir los hombros tensos antes de una exposición..."
          >${bodyNotes}</textarea>
        </div>

        <!-- Mensaje Reflexivo Oficial Institucional Requerido -->
        <div style="background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%); border: 2px solid #00843D; border-left: 6px solid #00843D; padding: 1.15rem 1.4rem; border-radius: 14px; margin-top: 1.5rem; text-align: center;">
          <p style="margin: 0; font-size: 1.18rem; font-style: italic; color: #022B14; font-weight: 800;">
            «Reconocer cómo responde tu cuerpo es el primer paso para aprender a cuidarlo.»
          </p>
        </div>

        <!-- Botones de Navegación Vertical -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-top: 1.5rem;">
          <button type="button" class="lc-btn lc-btn-secondary" id="btn-p1-scan-prev">
            <span aria-hidden="true">←</span>
            <span>Anterior: Ver Video</span>
          </button>

          <button type="button" class="lc-btn lc-btn-primary" id="btn-p1-scan-next" style="padding: 0.95rem 2.4rem; font-size: 1.05rem; font-weight: 800; background: #00843D;">
            <span>Finalizar Pausa 1 y Volver al Menú</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    `;

    this.bindCommonHeaderEvents();
    this.bindScannerEvents();

    const notesInput = this.containerEl.querySelector('#p1-body-notes');
    if (notesInput) {
      notesInput.addEventListener('input', (e) => {
        learningCenterState.setModule3Pausa1BodyNotes(e.target.value);
      });
    }

    const btnPrev = this.containerEl.querySelector('#btn-p1-scan-prev');
    if (btnPrev) btnPrev.addEventListener('click', () => this.render('pausa1_video'));

    const btnNext = this.containerEl.querySelector('#btn-p1-scan-next');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        learningCenterState.completeModule3Pausa1();
        this.lastCompletedPausa = 1;
        this.render('pausas_menu');
      });
    }
  }

  bindScannerEvents() {
    const getClosestRegionFromCoords = (x, y) => {
      if (y < 15 || y > 495 || x < 25 || x > 315) return null;

      let closest = null;
      let minDist = Infinity;
      for (const reg of BODY_REGIONS_CONFIG) {
        if (reg.dual) {
          for (const pt of reg.dual) {
            const d = Math.hypot(x - pt.cx, y - pt.cy);
            if (d < minDist) {
              minDist = d;
              closest = reg.id;
            }
          }
        } else if (reg.cx !== undefined && reg.cy !== undefined) {
          const d = Math.hypot(x - reg.cx, y - reg.cy);
          if (d < minDist) {
            minDist = d;
            closest = reg.id;
          }
        }
      }
      return minDist <= 45 ? closest : null;
    };

    const toggleRegion = (regId) => {
      if (!regId) return;
      const p1 = learningCenterState.state.module3?.pausa1 || {};
      let cur = [...(p1.selectedRegions || [])];
      if (cur.includes(regId)) {
        cur = cur.filter(id => id !== regId);
      } else {
        cur.push(regId);
      }
      learningCenterState.setModule3Pausa1BodyRegions(cur);

      // Actualizar contador numérico
      const counterNum = this.containerEl.querySelector('#p1-counter-num');
      if (counterNum) counterNum.textContent = String(cur.length);

      // Actualizar silueta anatómica interactiva
      const silWrap = this.containerEl.querySelector('#mod3-silhouette-wrapper');
      if (silWrap) {
        silWrap.innerHTML = getBodySilhouetteSvg({ id: 'mod3-body-scanner-svg', selectedIds: cur });
        bindSvgInteractiveClicks();
      }

      // Actualizar listado de tarjetas en el panel lateral
      const listWrap = this.containerEl.querySelector('#mod3-regions-list');
      if (listWrap) {
        listWrap.innerHTML = this.renderScannerRegionsHtml(cur);
        bindCardClicks();
      }
    };

    const bindSvgInteractiveClicks = () => {
      const svg = this.containerEl.querySelector('#mod3-body-scanner-svg');
      if (!svg) return;

      // Clic directo sobre cualquier nodo interactivo
      const targets = svg.querySelectorAll('[data-region-id]');
      targets.forEach(target => {
        target.style.cursor = 'pointer';
        target.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const id = target.getAttribute('data-region-id');
          if (id) toggleRegion(id);
        });
      });

      // Clic general sobre el canvas del SVG para detectar la zona anatómica más cercana
      svg.addEventListener('click', (e) => {
        const closestTarget = e.target.closest('[data-region-id]');
        if (closestTarget) {
          e.preventDefault();
          e.stopPropagation();
          const id = closestTarget.getAttribute('data-region-id');
          if (id) {
            toggleRegion(id);
            return;
          }
        }

        // Si se hizo clic sobre la silueta/imagen de fondo, convertir a coordenadas SVG
        if (svg.createSVGPoint) {
          const pt = svg.createSVGPoint();
          pt.x = e.clientX;
          pt.y = e.clientY;
          const ctm = svg.getScreenCTM();
          if (ctm) {
            const svgP = pt.matrixTransform(ctm.inverse());
            const nearest = getClosestRegionFromCoords(svgP.x, svgP.y);
            if (nearest) {
              toggleRegion(nearest);
            }
          }
        }
      });
    };

    const bindCardClicks = () => {
      const cards = this.containerEl.querySelectorAll('.lc-region-chip-btn[data-region-id]');
      cards.forEach(card => {
        card.addEventListener('click', () => {
          const regId = card.getAttribute('data-region-id');
          if (regId) toggleRegion(regId);
        });
      });
    };

    bindSvgInteractiveClicks();
    bindCardClicks();
  }

  renderScannerRegionsHtml(selectedIds = []) {
    return BODY_REGIONS_CONFIG.map(r => {
      const isSel = selectedIds.includes(r.id);
      return `
        <button 
          type="button" 
          class="lc-region-chip-btn ${isSel ? 'is-selected' : ''}" 
          data-region-id="${r.id}" 
          role="checkbox" 
          aria-checked="${isSel}"
        >
          <span class="lc-chip-dot ${isSel ? 'is-lit' : ''}"></span>
          <div class="lc-chip-info">
            <span class="lc-chip-name">${r.label}</span>
            <span class="lc-chip-desc">${r.description}</span>
          </div>
          <span class="lc-chip-status-check">${isSel ? '✓' : '+'}</span>
        </button>
      `;
    }).join('');
  }

  // =========================================================================
  // 5. PAUSA 2: RESPIRAR PARA VOLVER A LA CALMA
  // Audio guiado descargable + animación círculo interactivo con repetición ilimitada
  // =========================================================================
  renderPausa2() {
    this.scrollToTop();
    const p2State = learningCenterState.state.module3?.pausa2 || {};
    const rounds = p2State.breathingRounds || 0;

    this.containerEl.innerHTML = `
      <section class="lc-equipaje-root animate-fade-in" aria-labelledby="p2-title">
        ${this.renderHeaderHtml('pausa2')}

        <div class="lc-module-header">
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.5rem; background: #ECFDF5; color: #065F46; border: 1.5px solid #A7F3D0;">
            <span>🌱</span>
            <span>PAUSA 2 DE 4 · RESPIRAR PARA VOLVER A LA CALMA</span>
          </div>
          <h2 id="p2-title" class="lc-module-heading">Pausa 2: Respirar para volver a la calma</h2>
          <p class="lc-module-intro">
            La respiración consciente envía una señal de calma al sistema nervioso. Practica este ejercicio con el audio guiado y el ritmo visual 4-2-6.
          </p>
        </div>

        <!-- Tarjeta 1: Audio Guiado Descargable -->
        <div class="lc-embed-card" style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 18px; padding: 1.75rem; box-shadow: 0 4px 18px rgba(0, 43, 20, 0.08); margin-bottom: 1.5rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span style="font-size: 1.5rem;">🎧</span>
              <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #022B14;">Audio guiado: Respirar para volver a la calma</h3>
            </div>
            <span style="font-size: 0.85rem; font-weight: 700; color: #00843D; background: #E8F5E9; padding: 0.25rem 0.65rem; border-radius: 6px;">
              «Ejercicio práctico descargable»
            </span>
          </div>

          <div class="mod3-audio-controls-row">
            <button type="button" class="mod3-audio-play-btn" id="btn-play-p2-audio" aria-label="Reproducir audio guiado">
              <span id="icon-play-p2">▶</span>
            </button>
            <input type="range" class="mod3-audio-scrubber" id="scrubber-p2-audio" min="0" max="100" value="0" aria-label="Progreso del audio">
            <span class="mod3-audio-time-label" id="time-p2-audio">0:00 / 0:35</span>
          </div>

          <div class="mod3-audio-actions-row">
            <a href="assets/campusVital/audio/modulo3_pausa2_respiracion.mp3" download="CampusVital_Modulo3_Pausa2_Respiracion.mp3" class="mod3-audio-download-btn">
              <span>📥</span> <span>Descargar audio MP3</span>
            </a>
            <button type="button" class="mod3-btn-transcript-toggle" id="btn-toggle-p2-audio-transcript" aria-expanded="false">
              <span>Ver transcripción DUA</span> <span>▼</span>
            </button>
          </div>

          <div class="mod3-transcript-box" id="transcript-p2-box" style="display: none; margin-top: 1rem;">
            <p style="margin: 0 0 0.4rem 0; font-weight: 800; color: #022B14;">Transcripción de la respiración guiada:</p>
            <p style="margin: 0; font-style: italic; line-height: 1.6; color: #334155;">
              «Adopta una postura cómoda. Si lo deseas, cierra los ojos o fija la mirada en un punto suave. Vamos a respirar juntos: inhala suavemente por la nariz contando cuatro tiempos... sostén el aire dos segundos... y exhala despacio por la boca durante seis tiempos. Siente cómo con cada exhalación tu cuerpo suelta tensión y regresa al presente.»
            </p>
          </div>

          <audio id="audio-el-p2" src="assets/campusVital/audio/modulo3_pausa2_respiracion.mp3" preload="metadata"></audio>
        </div>

        <!-- Tarjeta 2: Animación Interactiva Zen de Respiración 4-2-6 con Repetición Ilimitada -->
        <div class="mod3-breathing-stage">
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.75rem; background: #ECFDF5; color: #065F46; border: 1.5px solid #86EFAC;">
            <span>🌿</span> <span>TÉCNICA DE AUTORREGULACIÓN NEUROVEGETATIVA</span>
          </div>

          <h3 style="font-size: 1.4rem; font-weight: 800; color: #022B14; margin: 0 0 0.4rem 0;">
            Ritmo visual de Respiración Consciente (4 – 2 – 6)
          </h3>
          <p style="font-size: 0.95rem; color: #475569; max-width: 620px; margin: 0 auto 1.5rem auto; line-height: 1.5;">
            Inhala en 4 segundos, sostén 2 segundos y exhala suavemente en 6 segundos. Sincroniza tu respiración con la esfera luminosa. <strong>Puedes repetir el ejercicio todas las veces que desees</strong>.
          </p>

          <!-- Barra de Fases 4-2-6 (Timeline Pills) -->
          <div class="mod3-breath-timeline-bar" role="tablist" aria-label="Fases del ciclo respiratorio">
            <div class="mod3-breath-step-pill step-inhala is-active" id="pill-phase-inhala">
              <span>🌬️</span> <span>1. Inhala (4s)</span>
            </div>
            <div class="mod3-breath-step-pill step-sosten" id="pill-phase-sosten">
              <span>✨</span> <span>2. Sostén (2s)</span>
            </div>
            <div class="mod3-breath-step-pill step-exhala" id="pill-phase-exhala">
              <span>🍃</span> <span>3. Exhala (6s)</span>
            </div>
          </div>

          <!-- Escenario Visual: Halos + Track SVG + Esfera 3D -->
          <div class="mod3-breathing-visual-wrap" aria-live="polite">
            <div class="mod3-breath-halo mod3-breath-halo-1"></div>
            <div class="mod3-breath-halo mod3-breath-halo-2"></div>
            <div class="mod3-breath-halo mod3-breath-halo-3"></div>

            <svg class="mod3-breath-svg-track" viewBox="0 0 310 310" aria-hidden="true">
              <circle class="mod3-breath-svg-circle-bg" cx="155" cy="155" r="140"></circle>
              <circle class="mod3-breath-svg-circle-bar" id="mod3-breath-svg-bar" cx="155" cy="155" r="140"></circle>
            </svg>

            <div class="mod3-breath-orb" id="mod3-breathing-circle">
              <div class="mod3-breath-orb-icon" id="mod3-breath-icon">🌿</div>
              <div class="mod3-breath-phase-label" id="mod3-breath-label">Listo</div>
              <div class="mod3-breath-timer-count" id="mod3-breath-timer">4s</div>
            </div>
          </div>

          <!-- Subtítulo Guía Dinámico -->
          <div class="mod3-breath-helper-guide" id="mod3-breath-sub">
            Pulsa «Iniciar respiración guiada» para sincronizar tu ritmo con la esfera luminosa
          </div>

          <!-- Fila de Controles -->
          <div class="mod3-breath-controls-row">
            <button type="button" class="mod3-btn-breath-start" id="btn-start-breathing">
              <span id="btn-start-breath-icon">▶</span>
              <span id="btn-start-breath-text">Iniciar respiración guiada</span>
            </button>
            <button type="button" class="mod3-btn-breath-repeat" id="btn-repeat-breathing">
              <span>🔄</span> <span>Repetir ejercicio de respiración</span>
            </button>
          </div>

          <!-- Contador de Ciclos Completados con Animación Celebratoria -->
          <div class="mod3-breath-rounds-badge" id="mod3-breath-rounds-count">
            <span>🌿</span> <span>Has completado <strong id="mod3-rounds-num">${rounds}</strong> ciclo(s) de respiración consciente</span>
          </div>
        </div>

        <!-- Botones de Navegación Vertical -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-top: 1.5rem;">
          <button type="button" class="lc-btn lc-btn-secondary" id="btn-p2-prev">
            <span aria-hidden="true">←</span>
            <span>Volver al Menú de Pausas</span>
          </button>

          <button type="button" class="lc-btn lc-btn-primary" id="btn-p2-next" style="padding: 0.95rem 2.4rem; font-size: 1.05rem; font-weight: 800; background: #00843D;">
            <span>Finalizar Pausa 2 y Volver al Menú</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    `;

    this.bindCommonHeaderEvents();
    this.bindAudioPlayer('p2');
    this.bindPausa2Events();

    const btnPrev = this.containerEl.querySelector('#btn-p2-prev');
    if (btnPrev) btnPrev.addEventListener('click', () => this.render('pausas_menu'));

    const btnNext = this.containerEl.querySelector('#btn-p2-next');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        learningCenterState.completeModule3Pausa2();
        this.lastCompletedPausa = 2;
        this.render('pausas_menu');
      });
    }
  }

  bindPausa2Events() {
    const btnStart = this.containerEl.querySelector('#btn-start-breathing');
    const btnRepeat = this.containerEl.querySelector('#btn-repeat-breathing');

    if (btnStart) {
      btnStart.addEventListener('click', () => {
        if (this.isBreathingRunning) {
          this.stopBreathingExercise();
        } else {
          this.startBreathingExercise();
        }
      });
    }

    if (btnRepeat) {
      btnRepeat.addEventListener('click', () => {
        this.stopBreathingExercise();
        this.startBreathingExercise();
      });
    }
  }

  startBreathingExercise() {
    this.isBreathingRunning = true;
    const circle = this.containerEl.querySelector('#mod3-breathing-circle');
    const icon = this.containerEl.querySelector('#mod3-breath-icon');
    const label = this.containerEl.querySelector('#mod3-breath-label');
    const timer = this.containerEl.querySelector('#mod3-breath-timer');
    const sub = this.containerEl.querySelector('#mod3-breath-sub');
    const svgBar = this.containerEl.querySelector('#mod3-breath-svg-bar');
    const roundsEl = this.containerEl.querySelector('#mod3-breath-rounds-count');
    const roundsNum = this.containerEl.querySelector('#mod3-rounds-num');

    const pillInhala = this.containerEl.querySelector('#pill-phase-inhala');
    const pillSosten = this.containerEl.querySelector('#pill-phase-sosten');
    const pillExhala = this.containerEl.querySelector('#pill-phase-exhala');

    const btnText = this.containerEl.querySelector('#btn-start-breath-text');
    const btnIcon = this.containerEl.querySelector('#btn-start-breath-icon');
    if (btnText) btnText.textContent = 'Pausar ejercicio';
    if (btnIcon) btnIcon.textContent = '⏸';

    let currentPhase = 'inhala';
    let phaseSeconds = 4;

    const setPills = (activePhase) => {
      if (pillInhala) pillInhala.classList.toggle('is-active', activePhase === 'inhala');
      if (pillSosten) pillSosten.classList.toggle('is-active', activePhase === 'sosten');
      if (pillExhala) pillExhala.classList.toggle('is-active', activePhase === 'exhala');
    };

    const applyPhase = () => {
      if (!circle || !label || !timer || !sub) return;

      circle.classList.remove('phase-inhala', 'phase-sosten', 'phase-exhala');
      setPills(currentPhase);

      if (currentPhase === 'inhala') {
        circle.classList.add('phase-inhala');
        if (icon) icon.textContent = '🌬️';
        label.textContent = 'Inhala';
        timer.textContent = `${phaseSeconds}s`;
        sub.textContent = 'Inhala suavemente y siente cómo el aire expande tu pecho y abdomen...';
        if (svgBar) {
          svgBar.style.transition = 'none';
          svgBar.style.strokeDashoffset = '880';
          svgBar.style.stroke = '#10B981';
          void svgBar.offsetWidth;
          svgBar.style.transition = 'stroke-dashoffset 4s linear, stroke 0.5s ease';
          svgBar.style.strokeDashoffset = '0';
        }
      } else if (currentPhase === 'sosten') {
        circle.classList.add('phase-sosten');
        if (icon) icon.textContent = '✨';
        label.textContent = 'Sostén';
        timer.textContent = `${phaseSeconds}s`;
        sub.textContent = 'Mantén el aire con calma y serenidad, disfrutando la pausa interior...';
        if (svgBar) {
          svgBar.style.transition = 'stroke 0.4s ease';
          svgBar.style.stroke = '#0EA5E9';
          svgBar.style.strokeDashoffset = '0';
        }
      } else if (currentPhase === 'exhala') {
        circle.classList.add('phase-exhala');
        if (icon) icon.textContent = '🍃';
        label.textContent = 'Exhala';
        timer.textContent = `${phaseSeconds}s`;
        sub.textContent = 'Suelta el aire lentamente por la boca, liberando toda tensión acumulada...';
        if (svgBar) {
          svgBar.style.transition = 'none';
          svgBar.style.strokeDashoffset = '0';
          svgBar.style.stroke = '#059669';
          void svgBar.offsetWidth;
          svgBar.style.transition = 'stroke-dashoffset 6s linear, stroke 0.5s ease';
          svgBar.style.strokeDashoffset = '880';
        }
      }
    };

    applyPhase();

    if (this.breathingTimer) clearInterval(this.breathingTimer);
    this.breathingTimer = setInterval(() => {
      phaseSeconds -= 1;
      if (phaseSeconds > 0) {
        if (timer) timer.textContent = `${phaseSeconds}s`;
      } else {
        if (currentPhase === 'inhala') {
          currentPhase = 'sosten';
          phaseSeconds = 2;
        } else if (currentPhase === 'sosten') {
          currentPhase = 'exhala';
          phaseSeconds = 6;
        } else if (currentPhase === 'exhala') {
          learningCenterState.addModule3BreathingRound();
          const r = learningCenterState.state.module3?.pausa2?.breathingRounds || 1;
          if (roundsNum) {
            roundsNum.textContent = r;
          } else if (roundsEl) {
            roundsEl.innerHTML = `<span>🌿</span> <span>Has completado <strong>${r}</strong> ciclo(s) de respiración consciente</span>`;
          }
          if (roundsEl) {
            roundsEl.classList.remove('is-celebrating');
            void roundsEl.offsetWidth;
            roundsEl.classList.add('is-celebrating');
            setTimeout(() => roundsEl?.classList.remove('is-celebrating'), 800);
          }
          currentPhase = 'inhala';
          phaseSeconds = 4;
        }
        applyPhase();
      }
    }, 1000);
  }

  stopBreathingExercise() {
    this.isBreathingRunning = false;
    if (this.breathingTimer) {
      clearInterval(this.breathingTimer);
      this.breathingTimer = null;
    }
    const circle = this.containerEl.querySelector('#mod3-breathing-circle');
    const icon = this.containerEl.querySelector('#mod3-breath-icon');
    const label = this.containerEl.querySelector('#mod3-breath-label');
    const timer = this.containerEl.querySelector('#mod3-breath-timer');
    const sub = this.containerEl.querySelector('#mod3-breath-sub');
    const svgBar = this.containerEl.querySelector('#mod3-breath-svg-bar');
    const pillInhala = this.containerEl.querySelector('#pill-phase-inhala');
    const pillSosten = this.containerEl.querySelector('#pill-phase-sosten');
    const pillExhala = this.containerEl.querySelector('#pill-phase-exhala');

    const btnText = this.containerEl.querySelector('#btn-start-breath-text');
    const btnIcon = this.containerEl.querySelector('#btn-start-breath-icon');
    if (btnText) btnText.textContent = 'Iniciar respiración guiada';
    if (btnIcon) btnIcon.textContent = '▶';

    if (circle) circle.classList.remove('phase-inhala', 'phase-sosten', 'phase-exhala');
    if (icon) icon.textContent = '🌿';
    if (label) label.textContent = 'Listo';
    if (timer) timer.textContent = '4s';
    if (sub) sub.textContent = 'Pulsa «Iniciar respiración guiada» para sincronizar tu ritmo con la esfera luminosa';

    if (svgBar) {
      svgBar.style.transition = 'none';
      svgBar.style.strokeDashoffset = '880';
      svgBar.style.stroke = '#10B981';
    }

    if (pillInhala) pillInhala.classList.add('is-active');
    if (pillSosten) pillSosten.classList.remove('is-active');
    if (pillExhala) pillExhala.classList.remove('is-active');
  }

  // =========================================================================
  // 6. PAUSA 3 (PARTE 1): VIDEO Y SEMÁFORO EMOCIONAL CON CUADROS DE TEXTO
  // =========================================================================
  renderPausa3Semaforo() {
    this.scrollToTop();
    const p3State = learningCenterState.state.module3?.pausa3 || {};
    const tf = p3State.trafficLight || {};

    this.containerEl.innerHTML = `
      <section class="lc-equipaje-root animate-fade-in" aria-labelledby="p3-sem-title">
        ${this.renderHeaderHtml('pausa3_semaforo')}

        <div class="lc-module-header">
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.5rem; background: #ECFDF5; color: #065F46; border: 1.5px solid #A7F3D0;">
            <span>🌱</span>
            <span>PAUSA 3 · HACIENDO UNA PAUSA CONSCIENTE (PARTE 1 DE 2)</span>
          </div>
          <h2 id="p3-sem-title" class="lc-module-heading">Pausa 3: Haciendo una pausa consciente</h2>
          <h3 style="font-size: 1.15rem; color: #00843D; font-weight: 800; margin: 0.25rem 0 0.75rem 0;">Técnica del Semáforo Emocional</h3>
          <p class="lc-module-intro">
            Mira el video explicativo y reflexiona respondiendo las preguntas de cada color del semáforo en los cuadros de texto.
          </p>
        </div>

        <!-- Video de Locución Oficial: Haciendo una pausa consciente (Video 4 de la carpeta) -->
        <div class="mod3-video-embed-card">
          <div class="mod3-video-top-bar">
            <h3 class="mod3-video-title">
              <span>🎬</span> <span>Video: Haciendo una pausa consciente</span>
            </h3>
            <button type="button" class="mod3-btn-transcript-toggle" id="btn-toggle-video3-transcript" aria-expanded="false">
              <span>Ver guion y transcripción</span> <span>▼</span>
            </button>
          </div>

          <div class="mod3-video-frame-wrap">
            <video controls playsinline preload="metadata" style="position: absolute; top:0; left:0; width:100%; height:100%; object-fit: contain; background: #000; border-radius: 12px;">
              <source src="assets/campusVital/Módulo 3/Producto 04 - Video/4. Video Locución.mp4" type="video/mp4">
              Tu navegador no soporta reproducción de video local HTML5.
            </video>
          </div>

          <div class="mod3-transcript-box" id="transcript-video3-box" style="display: none; margin: 1rem 1.25rem;">
            <p style="margin: 0 0 0.5rem 0; font-weight: 800; color: #022B14;">Guion oficial del Video (Locución):</p>
            <p style="margin: 0; font-style: italic; line-height: 1.6; color: #334155;">
              «Muchas veces reaccionamos rápidamente cuando sentimos ansiedad. Una pausa consciente nos ayuda a responder con mayor claridad. Usamos la analogía del semáforo: Rojo: ¿Qué está ocurriendo?, Amarillo: ¿Qué estoy sintiendo? ¿Qué necesita mi cuerpo?, Verde: ¿Qué puedo hacer ahora?»
            </p>
          </div>
        </div>

        <!-- Actividad Semáforo Emocional con Cuadros de Texto (Estilo Oficial Original) -->
        <div style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 18px; padding: 1.75rem; box-shadow: 0 4px 18px rgba(0, 43, 20, 0.08); margin-top: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem;">
            <span style="font-size: 1.5rem;">🚦</span>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: #022B14; margin: 0;">
              Actividad Semáforo Emocional: Tus Respuestas Personales
            </h3>
          </div>
          <p style="font-size: 0.95rem; color: #475569; margin: 0 0 1.25rem 0; line-height: 1.5;">
            Muchas veces reaccionamos impulsivamente frente a la ansiedad. Escribe tus reflexiones en cada color para practicar la pausa consciente:
          </p>

          <div class="mod3-traffic-light-grid">
            <!-- ROJO: Me detengo -->
            <div class="mod3-tl-card is-red">
              <div class="mod3-tl-header">
                <div class="mod3-tl-light" style="background: #EF4444; color: #EF4444;"></div>
                <h4 class="mod3-tl-title" style="color: #991B1B;">🔴 ROJO: Me detengo</h4>
              </div>
              <p class="mod3-tl-question">¿Qué está ocurriendo?</p>
              <textarea
                id="tl-input-red"
                class="mod3-tl-input"
                placeholder="Describe la situación detonante o señal física/mental (ej. se acerca la entrega, dolor de cabeza, ganas de huir)..."
              >${tf.redText || ''}</textarea>
            </div>

            <!-- AMARILLO: Observo -->
            <div class="mod3-tl-card is-yellow">
              <div class="mod3-tl-header">
                <div class="mod3-tl-light" style="background: #F59E0B; color: #F59E0B;"></div>
                <h4 class="mod3-tl-title" style="color: #92400E;">🟡 AMARILLO: Observo</h4>
              </div>
              <p class="mod3-tl-question">¿Qué estoy sintiendo? ¿Qué necesita mi cuerpo?</p>
              <textarea
                id="tl-input-yellow"
                class="mod3-tl-input"
                placeholder="Observa sin juzgarte tus emociones y sensaciones físicas (ej. respiración rápida, nudo en el estómago, miedo)..."
              >${tf.yellowText || ''}</textarea>
            </div>

            <!-- VERDE: Elijo -->
            <div class="mod3-tl-card is-green">
              <div class="mod3-tl-header">
                <div class="mod3-tl-light" style="background: #10B981; color: #10B981;"></div>
                <h4 class="mod3-tl-title" style="color: #065F46;">🟢 VERDE: Elijo</h4>
              </div>
              <p class="mod3-tl-question">¿Qué puedo hacer ahora?</p>
              <textarea
                id="tl-input-green"
                class="mod3-tl-input"
                placeholder="Elige una acción consciente para regularte (ej. respirar en 4-2-6, beber agua, pedir ayuda, dividir la tarea)..."
              >${tf.greenText || ''}</textarea>
            </div>
          </div>
        </div>

        <!-- Botones de Navegación Vertical -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-top: 1.5rem;">
          <button type="button" class="lc-btn lc-btn-secondary" id="btn-p3-sem-prev">
            <span aria-hidden="true">←</span>
            <span>Volver al Menú de Pausas</span>
          </button>

          <button type="button" class="lc-btn lc-btn-primary" id="btn-p3-sem-next" style="padding: 0.9rem 2.2rem; font-size: 1.05rem; font-weight: 800;">
            <span>Siguiente: Analizar Caso de Valentina</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    `;

    this.bindCommonHeaderEvents();

    const btnVidTrans = this.containerEl.querySelector('#btn-toggle-video3-transcript');
    const boxVidTrans = this.containerEl.querySelector('#transcript-video3-box');
    if (btnVidTrans && boxVidTrans) {
      btnVidTrans.addEventListener('click', () => {
        const isShown = boxVidTrans.style.display !== 'none';
        boxVidTrans.style.display = isShown ? 'none' : 'block';
        btnVidTrans.setAttribute('aria-expanded', String(!isShown));
        btnVidTrans.querySelector('span:last-child').textContent = isShown ? '▼' : '▲';
      });
    }

    const inRed = this.containerEl.querySelector('#tl-input-red');
    const inYellow = this.containerEl.querySelector('#tl-input-yellow');
    const inGreen = this.containerEl.querySelector('#tl-input-green');

    if (inRed) inRed.addEventListener('input', (e) => learningCenterState.setModule3TrafficLightAnswer('redText', e.target.value));
    if (inYellow) inYellow.addEventListener('input', (e) => learningCenterState.setModule3TrafficLightAnswer('yellowText', e.target.value));
    if (inGreen) inGreen.addEventListener('input', (e) => learningCenterState.setModule3TrafficLightAnswer('greenText', e.target.value));

    const btnPrev = this.containerEl.querySelector('#btn-p3-sem-prev');
    if (btnPrev) btnPrev.addEventListener('click', () => this.render('pausas_menu'));

    const btnNext = this.containerEl.querySelector('#btn-p3-sem-next');
    if (btnNext) btnNext.addEventListener('click', () => this.render('pausa3_caso'));
  }

  // =========================================================================
  // 7. PAUSA 3 (PARTE 2): CASO DE VALENTINA (ANÁLISIS FORMATIVO ORIGINAL)
  // =========================================================================
  renderPausa3Caso() {
    this.scrollToTop();
    const p3State = learningCenterState.state.module3?.pausa3 || {};
    const cv = p3State.caseValentina || {};

    this.containerEl.innerHTML = `
      <section class="lc-equipaje-root animate-fade-in" aria-labelledby="p3-caso-title">
        ${this.renderHeaderHtml('pausa3_caso')}

        <div class="lc-module-header">
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.5rem; background: #ECFDF5; color: #065F46; border: 1.5px solid #A7F3D0;">
            <span>🌱</span>
            <span>PAUSA 3 · CASO DE VALENTINA (PARTE 2 DE 2)</span>
          </div>
          <h2 id="p3-caso-title" class="lc-module-heading">Caso de Estudio: Valentina frente a la entrega final</h2>
          <p class="lc-module-intro">
            Aplica el semáforo emocional a una situación real de la vida universitaria.
          </p>
        </div>

        <!-- Tarjeta Principal del Caso de Valentina (Diseño Original Oficial) -->
        <div class="mod3-case-card">
          <div class="mod3-case-banner">
            <span>📚</span>
            <span>CASO DE ESTUDIO · SITUACIÓN DE AFRONTAMIENTO UNIVERSITARIO</span>
          </div>

          <h3 style="font-size: 1.35rem; font-weight: 800; color: #022B14; margin: 0 0 1rem 0;">
            Valentina y su examen final
          </h3>

          <div class="mod3-case-story-content">
            <img
              src="assets/images/learningCenter/valentina_story_case.jpg"
              alt="Valentina esperando su examen final con taquicardia y pensamientos de ansiedad"
              class="mod3-case-image"
              loading="lazy"
            />
            <div class="mod3-case-text">
              <p style="margin: 0 0 0.75rem 0;">
                Valentina está a pocos minutos de presentar el <strong>examen final</strong> de una asignatura muy importante. Mientras espera que el docente entregue el examen, comienza a sentir que su corazón late más rápido de lo habitual. Sus manos están sudando y piensa:
              </p>
              <blockquote style="margin: 0 0 0.75rem 0; padding: 0.65rem 1rem; border-left: 4px solid #EF4444; background: #FEF2F2; font-style: italic; color: #7F1D1D; border-radius: 6px;">
                «Si me va mal en este examen, voy a perder la materia. Tal vez no soy lo suficientemente buena para estar en la universidad.»
              </blockquote>
              <p style="margin: 0;">
                Nota que le cuesta concentrarse y siente el impulso de <strong>salir del salón</strong> porque cree que no podrá responder el examen.
              </p>
            </div>
          </div>

          <div style="background: #F0FDF4; border: 1.5px solid #86EFAC; border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 1.5rem;">
            <strong style="color: #065F46; font-size: 1rem;">Instrucciones para el caso de Valentina:</strong>
            <p style="margin: 0.25rem 0 0 0; font-size: 0.94rem; color: #1E293B;">
              ¿Cómo podría Valentina utilizar el Semáforo Emocional para afrontar este momento? Completa cada color del semáforo con la opción que consideres más adecuada:
            </p>
          </div>

          <!-- Paso 1: ROJO -->
          <div class="mod3-quiz-step-card">
            <h4 style="font-size: 1.05rem; font-weight: 800; color: #991B1B; margin: 0 0 0.4rem 0;">
              🔴 ROJO: Me detengo
            </h4>
            <p style="font-size: 0.94rem; font-weight: 700; color: #1E293B; margin: 0 0 0.75rem 0;">
              ¿Qué podría hacer Valentina antes de reaccionar impulsivamente?
            </p>

            <label class="mod3-quiz-option-label">
              <input type="radio" name="val_red" value="salir" ${cv.redOption === 'salir' ? 'checked' : ''}>
              <span>Salir inmediatamente del salón sin hablar con nadie.</span>
            </label>

            <label class="mod3-quiz-option-label">
              <input type="radio" name="val_red" value="detenerse" ${cv.redOption === 'detenerse' ? 'checked' : ''}>
              <span>Detenerse por un momento y reconocer lo que está sintiendo.</span>
            </label>

            <label class="mod3-quiz-option-label">
              <input type="radio" name="val_red" value="ignorar" ${cv.redOption === 'ignorar' ? 'checked' : ''}>
              <span>Ignorar lo que está pasando y comenzar el examen rápidamente.</span>
            </label>

            <div class="mod3-quiz-feedback" id="feedback-val-red" style="${cv.redOption ? '' : 'display: none;'}">
              ✨ <strong>Retroalimentación:</strong> El primer paso consiste en detenerse y reconocer las emociones y sensaciones físicas antes de actuar. Esto ayuda a evitar respuestas impulsivas.
            </div>
          </div>

          <!-- Paso 2: AMARILLO -->
          <div class="mod3-quiz-step-card">
            <h4 style="font-size: 1.05rem; font-weight: 800; color: #92400E; margin: 0 0 0.4rem 0;">
              🟡 AMARILLO: Observo
            </h4>
            <p style="font-size: 0.94rem; font-weight: 700; color: #1E293B; margin: 0 0 0.75rem 0;">
              ¿Qué podría observar Valentina en este momento? (Puedes seleccionar varias opciones)
            </p>

            ${this.renderYellowCheckboxes(cv.yellowOptions || [])}

            <div class="mod3-quiz-feedback" id="feedback-val-yellow" style="${(cv.yellowOptions || []).length > 0 ? '' : 'display: none;'}">
              ✨ <strong>Retroalimentación:</strong> Observar significa tomar conciencia de lo que ocurre en el cuerpo, las emociones y los pensamientos, sin juzgarse.
            </div>
          </div>

          <!-- Paso 3: VERDE -->
          <div class="mod3-quiz-step-card">
            <h4 style="font-size: 1.05rem; font-weight: 800; color: #065F46; margin: 0 0 0.4rem 0;">
              🟢 VERDE: Elijo
            </h4>
            <p style="font-size: 0.94rem; font-weight: 700; color: #1E293B; margin: 0 0 0.75rem 0;">
              ¿Qué acciones podrían ayudar a Valentina a afrontar esta situación? (Selecciona las que consideres más útiles)
            </p>

            ${this.renderGreenCheckboxes(cv.greenOptions || [])}

            <div class="mod3-quiz-feedback" id="feedback-val-green" style="${(cv.greenOptions || []).length > 0 ? '' : 'display: none;'}">
              ✨ <strong>Retroalimentación:</strong> Elegir implica responder de manera consciente utilizando estrategias que favorezcan el bienestar y permitan afrontar la situación con mayor calma.
            </div>
          </div>
        </div>

        <!-- Botones de Navegación Vertical -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-top: 1.5rem;">
          <button type="button" class="lc-btn lc-btn-secondary" id="btn-p3-caso-prev">
            <span aria-hidden="true">←</span>
            <span>Anterior: Semáforo Emocional</span>
          </button>

          <button type="button" class="lc-btn lc-btn-primary" id="btn-p3-caso-next" style="padding: 0.95rem 2.4rem; font-size: 1.05rem; font-weight: 800; background: #00843D;">
            <span>Finalizar Pausa 3 y Volver al Menú</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    `;

    this.bindCommonHeaderEvents();
    this.bindPausa3CasoEvents();

    const btnPrev = this.containerEl.querySelector('#btn-p3-caso-prev');
    if (btnPrev) btnPrev.addEventListener('click', () => this.render('pausa3_semaforo'));

    const btnNext = this.containerEl.querySelector('#btn-p3-caso-next');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        learningCenterState.completeModule3Pausa3();
        this.lastCompletedPausa = 3;
        this.render('pausas_menu');
      });
    }
  }

  renderYellowCheckboxes(selected = []) {
    const opts = [
      { id: 'y1', label: 'Mi respiración está acelerada.' },
      { id: 'y2', label: 'Estoy pensando que un examen define todo mi futuro.' },
      { id: 'y3', label: 'Mis manos están tensas.' },
      { id: 'y4', label: 'Me siento nerviosa porque este examen es importante.' },
      { id: 'y5', label: 'Estoy experimentando una emoción intensa que probablemente disminuirá con el paso de los minutos.' }
    ];

    return opts.map(o => `
      <label class="mod3-quiz-option-label">
        <input type="checkbox" name="val_yellow" value="${o.id}" ${selected.includes(o.id) ? 'checked' : ''}>
        <span>${o.label}</span>
      </label>
    `).join('');
  }

  renderGreenCheckboxes(selected = []) {
    const opts = [
      { id: 'g1', label: 'Realizar tres respiraciones profundas antes de comenzar.' },
      { id: 'g2', label: 'Recordar que un examen no define todo su proceso académico.' },
      { id: 'g3', label: 'Leer cuidadosamente las preguntas antes de responder.' },
      { id: 'g4', label: 'Resolver primero las preguntas que le resulten más fáciles.' },
      { id: 'g5', label: 'Si después del examen continúa sintiéndose sobrepasada, buscar apoyo en una persona de confianza o en los servicios de acompañamiento de la universidad.' }
    ];

    return opts.map(o => `
      <label class="mod3-quiz-option-label">
        <input type="checkbox" name="val_green" value="${o.id}" ${selected.includes(o.id) ? 'checked' : ''}>
        <span>${o.label}</span>
      </label>
    `).join('');
  }

  bindPausa3CasoEvents() {
    // Radios Valentina Rojo
    const radiosRed = this.containerEl.querySelectorAll('input[name="val_red"]');
    const fbRed = this.containerEl.querySelector('#feedback-val-red');
    radiosRed.forEach(r => {
      r.addEventListener('change', (e) => {
        learningCenterState.setModule3CaseValentina('redOption', e.target.value);
        if (fbRed) fbRed.style.display = 'block';
      });
    });

    // Checkboxes Valentina Amarillo
    const checksYellow = this.containerEl.querySelectorAll('input[name="val_yellow"]');
    const fbYellow = this.containerEl.querySelector('#feedback-val-yellow');
    checksYellow.forEach(c => {
      c.addEventListener('change', () => {
        const sel = Array.from(checksYellow).filter(x => x.checked).map(x => x.value);
        learningCenterState.setModule3CaseValentina('yellowOptions', sel);
        if (fbYellow) fbYellow.style.display = sel.length > 0 ? 'block' : 'none';
      });
    });

    // Checkboxes Valentina Verde
    const checksGreen = this.containerEl.querySelectorAll('input[name="val_green"]');
    const fbGreen = this.containerEl.querySelector('#feedback-val-green');
    checksGreen.forEach(c => {
      c.addEventListener('change', () => {
        const sel = Array.from(checksGreen).filter(x => x.checked).map(x => x.value);
        learningCenterState.setModule3CaseValentina('greenOptions', sel);
        if (fbGreen) fbGreen.style.display = sel.length > 0 ? 'block' : 'none';
      });
    });
  }

  // =========================================================================
  // 8. PAUSA 4 (PARTE 1): VOLVIENDO AL PRESENTE (VIDEO, AUDIO Y REFLEXIÓN)
  // =========================================================================
  renderPausa4Presente() {
    this.scrollToTop();
    const p4State = learningCenterState.state.module3?.pausa4 || {};
    const postRef = p4State.postExerciseReflection || '';

    this.containerEl.innerHTML = `
      <section class="lc-equipaje-root animate-fade-in" aria-labelledby="p4-pres-title">
        ${this.renderHeaderHtml('pausa4_presente')}

        <div class="lc-module-header">
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.5rem; background: #ECFDF5; color: #065F46; border: 1.5px solid #A7F3D0;">
            <span>🌱</span>
            <span>PAUSA 4 · VOLVIENDO AL PRESENTE (PARTE 1 DE 2)</span>
          </div>
          <h2 id="p4-pres-title" class="lc-module-heading">Pausa 4: Volviendo al presente</h2>
          <h3 style="font-size: 1.15rem; color: #00843D; font-weight: 800; margin: 0.25rem 0 0.75rem 0;">Técnica Sensorial de Anclaje 5–4–3–2–1</h3>
          <p class="lc-module-intro">
            Cuando la mente se llena de preocupaciones futuras o pasadas, conectar con los cinco sentidos nos devuelve con suavidad al momento presente.
          </p>
        </div>

        <!-- Video Oficial: Volviendo al presente (5. Audio guiado en video) -->
        <div class="mod3-video-embed-card" style="margin-bottom: 1.5rem;">
          <div class="mod3-video-top-bar">
            <h3 class="mod3-video-title">
              <span>🎬</span> <span>Video: Volviendo al presente (Técnica Sensorial 5–4–3–2–1)</span>
            </h3>
            <button type="button" class="mod3-btn-transcript-toggle" id="btn-toggle-video4-transcript" aria-expanded="false">
              <span>Ver guion y locución</span> <span>▼</span>
            </button>
          </div>

          <div class="mod3-video-frame-wrap">
            <video controls playsinline preload="metadata" style="position: absolute; top:0; left:0; width:100%; height:100%; object-fit: contain; background: #000; border-radius: 12px;">
              <source src="assets/campusVital/Módulo 3/Producto 05 - Audio guiado/5. Audio guiado.mp4" type="video/mp4">
              Tu navegador no soporta reproducción de video local HTML5.
            </video>
          </div>

          <div class="mod3-transcript-box" id="transcript-video4-box" style="display: none; margin: 1rem 1.25rem;">
            <p style="margin: 0 0 0.5rem 0; font-weight: 800; color: #022B14;">Guion oficial del Video (Locución):</p>
            <p style="margin: 0; font-style: italic; line-height: 1.6; color: #334155;">
              «Cuando la ansiedad aparece es frecuente que nuestra mente viaje hacia preocupaciones sobre lo que podría pasar. Una manera de recuperar la calma consiste en volver al momento presente utilizando nuestros sentidos: observa cinco cosas que puedas ver, identifica cuatro cosas que puedas tocar, escucha tres sonidos, percibe dos aromas y finalmente identifica un sabor o una sensación agradable.»
            </p>
          </div>
        </div>

        <!-- Tarjeta de Audio Guiado Descargable -->
        <div class="lc-embed-card" style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 18px; padding: 1.75rem; box-shadow: 0 4px 18px rgba(0, 43, 20, 0.08); margin-bottom: 1.5rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span style="font-size: 1.5rem;">🎧</span>
              <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #022B14;">Audio: Volviendo al presente (5-4-3-2-1)</h3>
            </div>
            <span style="font-size: 0.85rem; font-weight: 700; color: #00843D; background: #E8F5E9; padding: 0.25rem 0.65rem; border-radius: 6px;">
              «Técnica de anclaje sensorial descargable»
            </span>
          </div>

          <div class="mod3-audio-controls-row">
            <button type="button" class="mod3-audio-play-btn" id="btn-play-p4-audio" aria-label="Reproducir audio de anclaje sensorial">
              <span id="icon-play-p4">▶</span>
            </button>
            <input type="range" class="mod3-audio-scrubber" id="scrubber-p4-audio" min="0" max="100" value="0" aria-label="Progreso del audio">
            <span class="mod3-audio-time-label" id="time-p4-audio">0:00 / 0:43</span>
          </div>

          <div class="mod3-audio-actions-row">
            <a href="assets/campusVital/audio/modulo3_pausa4_presente.mp3" download="CampusVital_Modulo3_Pausa4_VolviendoAlPresente.mp3" class="mod3-audio-download-btn">
              <span>📥</span> <span>Descargar audio MP3</span>
            </a>
            <button type="button" class="mod3-btn-transcript-toggle" id="btn-toggle-p4-audio-transcript" aria-expanded="false">
              <span>Ver transcripción DUA</span> <span>▼</span>
            </button>
          </div>

          <div class="mod3-transcript-box" id="transcript-p4-box" style="display: none; margin-top: 1rem;">
            <p style="margin: 0 0 0.4rem 0; font-weight: 800; color: #022B14;">Transcripción oficial de la locución:</p>
            <p style="margin: 0; font-style: italic; line-height: 1.6; color: #334155;">
              «Mira a tu alrededor. Identifica cinco cosas que puedas ver con atención. Ahora cuatro cosas que puedas tocar con tus manos. Tres cosas que puedas escuchar en el ambiente. Dos cosas que puedas oler. Y una cosa que puedas saborear. Nota cómo tus sentidos te anclan al aquí y al ahora.»
            </p>
          </div>

          <audio id="audio-el-p4" src="assets/campusVital/audio/modulo3_pausa4_presente.mp3" preload="metadata"></audio>
        </div>

        <!-- Tarjeta de Actividad Reflexiva: ¿Cómo te sientes después del ejercicio? -->
        <div style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 18px; padding: 2rem; box-shadow: 0 4px 18px rgba(0, 43, 20, 0.08);">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem;">
            <span style="font-size: 1.5rem;">✍️</span>
            <h3 style="font-size: 1.35rem; font-weight: 800; color: #022B14; margin: 0;">
              ¿Cómo te sientes después del ejercicio?
            </h3>
          </div>
          <p style="font-size: 0.95rem; color: #475569; margin: 0 0 1.25rem 0; line-height: 1.5;">
            Escribe en este cuadro tus reflexiones o sensaciones corporales y emocionales al finalizar la práctica:
          </p>
          <textarea
            id="post-reflection-input"
            class="mod3-tl-input"
            style="min-height: 130px; font-size: 1rem; line-height: 1.6; padding: 1rem; border-radius: 12px; border: 2px solid #CBD5E1;"
            placeholder="Escribe aquí tu respuesta sobre cómo te sientes ahora (ej. más tranquilo, con la respiración más calmada, con la mente más despejada)..."
          >${postRef}</textarea>
        </div>

        <!-- Botones de Navegación Vertical -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-top: 1.5rem;">
          <button type="button" class="lc-btn lc-btn-secondary" id="btn-p4-pres-prev">
            <span aria-hidden="true">←</span>
            <span>Volver al Menú de Pausas</span>
          </button>

          <button type="button" class="lc-btn lc-btn-primary" id="btn-p4-pres-next" style="padding: 0.9rem 2.2rem; font-size: 1.05rem; font-weight: 800;">
            <span>Siguiente: Ver Video y Caja de Herramientas</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    `;

    this.bindCommonHeaderEvents();
    this.bindAudioPlayer('p4');

    const btnVid4Trans = this.containerEl.querySelector('#btn-toggle-video4-transcript');
    const boxVid4Trans = this.containerEl.querySelector('#transcript-video4-box');
    if (btnVid4Trans && boxVid4Trans) {
      btnVid4Trans.addEventListener('click', () => {
        const isShown = boxVid4Trans.style.display !== 'none';
        boxVid4Trans.style.display = isShown ? 'none' : 'block';
        btnVid4Trans.setAttribute('aria-expanded', String(!isShown));
        btnVid4Trans.querySelector('span:last-child').textContent = isShown ? '▼' : '▲';
      });
    }

    const refInput = this.containerEl.querySelector('#post-reflection-input');
    if (refInput) {
      refInput.addEventListener('input', (e) => {
        learningCenterState.setModule3PostReflection(e.target.value);
      });
    }

    const btnPrev = this.containerEl.querySelector('#btn-p4-pres-prev');
    if (btnPrev) btnPrev.addEventListener('click', () => this.render('pausas_menu'));

    const btnNext = this.containerEl.querySelector('#btn-p4-pres-next');
    if (btnNext) btnNext.addEventListener('click', () => this.render('pausa4_caja'));
  }

  // =========================================================================
  // 9. PAUSA 4 (PARTE 2): VIDEO Y MI CAJA DE HERRAMIENTAS (PRODUCTO FORMATIVO)
  // =========================================================================
  renderPausa4Caja() {
    this.scrollToTop();
    const p4State = learningCenterState.state.module3?.pausa4 || {};
    const selectedTools = p4State.selectedTools || ['escaner', 'respiracion', 'semaforo', 'anclaje_54321'];
    const customToolNote = p4State.customToolNote || '';

    this.containerEl.innerHTML = `
      <section class="lc-equipaje-root animate-fade-in" aria-labelledby="p4-caja-title">
        ${this.renderHeaderHtml('pausa4_caja')}

        <div class="lc-module-header">
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.5rem; background: #ECFDF5; color: #065F46; border: 1.5px solid #A7F3D0;">
            <span>🌱</span>
            <span>PAUSA 4 · PRODUCTO FORMATIVO (PARTE 2 DE 2)</span>
          </div>
          <h2 id="p4-caja-title" class="lc-module-heading">Mi Caja de Herramientas para Volver a la Calma</h2>
          <p class="lc-module-intro">
            Selecciona las herramientas vistas a lo largo del módulo que deseas guardar en tu caja de bienestar personal y descarga tu ficha para consultarla cuando lo necesites.
          </p>
        </div>

        <!-- Video Complementario de Herramientas (Video 6 de la carpeta) -->
        <div class="mod3-video-embed-card">
          <div class="mod3-video-top-bar">
            <h3 class="mod3-video-title">
              <span>🎬</span> <span>Video: Herramientas de Regulación y Bienestar</span>
            </h3>
            <button type="button" class="mod3-btn-transcript-toggle" id="btn-toggle-video6-transcript" aria-expanded="false">
              <span>Ver guion y locución</span> <span>▼</span>
            </button>
          </div>

          <div class="mod3-video-frame-wrap">
            <video controls playsinline preload="metadata" style="position: absolute; top:0; left:0; width:100%; height:100%; object-fit: contain; background: #000; border-radius: 12px;">
              <source src="assets/campusVital/Módulo 3/Producto 06 - Video/6. Video.mp4" type="video/mp4">
              Tu navegador no soporta reproducción de video local HTML5.
            </video>
          </div>

          <div class="mod3-transcript-box" id="transcript-video6-box" style="display: none; margin: 1rem 1.25rem;">
            <p style="margin: 0 0 0.5rem 0; font-weight: 800; color: #022B14;">Guion oficial del Video (Locución):</p>
            <p style="margin: 0; font-style: italic; line-height: 1.6; color: #334155;">
              «Las emociones forman parte de nuestra vida y cambian constantemente. Aprender a regularlas no significa dejar de sentir, sino desarrollar recursos para afrontar los desafíos con mayor calma y bienestar. Recuerda que cada persona encuentra estrategias diferentes para cuidarse. Explora las herramientas que descubriste en este módulo y úsalas cuando las necesites. Si en algún momento sientes que las dificultades superan tus recursos, recuerda que no tienes que enfrentarlas solo(a): el TdeA cuenta con rutas y servicios de apoyo para acompañarte.»
            </p>
          </div>
        </div>

        <!-- Producto: Ficha Personalizada Descargable -->
        <div style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 18px; padding: 1.75rem; box-shadow: 0 4px 18px rgba(0, 43, 20, 0.08); margin-top: 1.5rem;">
          <div class="mod3-toolbox-card">
            <div class="mod3-toolbox-header">
              <div>
                <h3 class="mod3-toolbox-title">🧰 Producto: Mi Caja de Herramientas para Volver a la Calma</h3>
                <p style="margin: 0.35rem 0 0 0; font-size: 0.9rem; color: #475569;">
                  Haz clic sobre las estrategias que deseas llevar contigo en tu vida universitaria:
                </p>
              </div>
              <button type="button" class="mod3-btn-download-pdf" id="btn-download-toolbox-pdf">
                <span>📥 Descargar mi Ficha en PDF</span>
              </button>
            </div>

            <div class="mod3-tools-selection-grid">
              ${this.renderToolsGridHtml(selectedTools)}
            </div>

            <div style="margin-top: 1.25rem;">
              <label for="custom-tool-note" style="display: block; font-size: 0.95rem; font-weight: 800; color: #022B14; margin-bottom: 0.4rem;">
                🌱 Mi compromiso de calma o frase ancla:
              </label>
              <input
                type="text"
                id="custom-tool-note"
                class="mod3-sense-input"
                style="padding: 0.75rem 1rem; font-size: 0.95rem;"
                placeholder="Ejemplo: «Hago una pausa consciente, respiro en 4-2-6 y recuerdo que un examen no define todo mi valor»"
                value="${customToolNote}"
              />
            </div>
          </div>
        </div>

        <!-- Botones de Navegación Vertical -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-top: 1.5rem;">
          <button type="button" class="lc-btn lc-btn-secondary" id="btn-p4-caja-prev">
            <span aria-hidden="true">←</span>
            <span>Anterior: Audio Volviendo al Presente</span>
          </button>

          <button type="button" class="lc-btn lc-btn-primary" id="btn-p4-caja-next" style="padding: 0.95rem 2.4rem; font-size: 1.05rem; font-weight: 800; background: #00843D;">
            <span>Finalizar Pausa 4 y Volver al Menú</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    `;

    this.bindCommonHeaderEvents();

    const btnVid6Trans = this.containerEl.querySelector('#btn-toggle-video6-transcript');
    const boxVid6Trans = this.containerEl.querySelector('#transcript-video6-box');
    if (btnVid6Trans && boxVid6Trans) {
      btnVid6Trans.addEventListener('click', () => {
        const isShown = boxVid6Trans.style.display !== 'none';
        boxVid6Trans.style.display = isShown ? 'none' : 'block';
        btnVid6Trans.setAttribute('aria-expanded', String(!isShown));
        btnVid6Trans.querySelector('span:last-child').textContent = isShown ? '▼' : '▲';
      });
    }

    const toolCards = this.containerEl.querySelectorAll('.mod3-tool-item-card[data-tool-id]');
    toolCards.forEach(card => {
      card.addEventListener('click', () => {
        const tid = card.getAttribute('data-tool-id');
        const p4 = learningCenterState.state.module3?.pausa4 || {};
        let sel = [...(p4.selectedTools || [])];
        if (sel.includes(tid)) {
          sel = sel.filter(x => x !== tid);
        } else {
          sel.push(tid);
        }
        learningCenterState.setModule3SelectedTools(sel);

        const isChecked = sel.includes(tid);
        card.classList.toggle('is-checked', isChecked);
        const box = card.querySelector('.mod3-region-checkbox');
        if (box) box.textContent = isChecked ? '✓' : '';
      });
    });

    const customNoteInput = this.containerEl.querySelector('#custom-tool-note');
    if (customNoteInput) {
      customNoteInput.addEventListener('input', (e) => {
        learningCenterState.setModule3CustomToolNote(e.target.value);
      });
    }

    const btnDownloadToolbox = this.containerEl.querySelector('#btn-download-toolbox-pdf');
    if (btnDownloadToolbox) {
      btnDownloadToolbox.addEventListener('click', () => {
        this.downloadToolboxSheet();
      });
    }

    const btnPrev = this.containerEl.querySelector('#btn-p4-caja-prev');
    if (btnPrev) btnPrev.addEventListener('click', () => this.render('pausa4_presente'));

    const btnNext = this.containerEl.querySelector('#btn-p4-caja-next');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        learningCenterState.completeModule3Pausa4();
        this.lastCompletedPausa = 4;
        this.render('pausas_menu');
      });
    }
  }

  renderToolsGridHtml(selected = []) {
    const tools = [
      { id: 'escaner', icon: '🧘', name: 'Escáner Corporal', desc: 'Identificar tensiones físicas tempranas en cabeza, cuello o estómago antes de que aumenten.' },
      { id: 'respiracion', icon: '🌬️', name: 'Respiración Consciente 4-2-6', desc: 'Inhalar en 4s, retener 2s y exhalar en 6s para calmar el ritmo cardíaco y el sistema nervioso.' },
      { id: 'semaforo', icon: '🚦', name: 'Semáforo Emocional', desc: 'Me detengo en Rojo, Observo sin juzgar en Amarillo, y Elijo una respuesta constructiva en Verde.' },
      { id: 'anclaje_54321', icon: '👁️', name: 'Anclaje Sensorial 5-4-3-2-1', desc: 'Activar los 5 sentidos para regresar al momento presente y frenar la rumiación de preocupaciones.' },
      { id: 'reencuadre', icon: '💭', name: 'Reencuadre Cognitivo', desc: 'Recordar que un examen o desafío puntual no define todo mi futuro ni mi capacidad universitaria.' },
      { id: 'red_apoyo', icon: '🤝', name: 'Red de Apoyo y Campus Vital TdeA', desc: 'Acudir a compañeros, docentes y los canales de Permanencia y Bienestar del TdeA cuando lo necesite.' }
    ];

    return tools.map(t => {
      const isChecked = selected.includes(t.id);
      return `
        <div class="mod3-tool-item-card ${isChecked ? 'is-checked' : ''}" data-tool-id="${t.id}">
          <div class="mod3-region-checkbox">${isChecked ? '✓' : ''}</div>
          <span class="mod3-tool-icon">${t.icon}</span>
          <div class="mod3-tool-info">
            <h4 class="mod3-tool-name">${t.name}</h4>
            <p class="mod3-tool-desc">${t.desc}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  // =========================================================================
  // 10. CIERRE GENERAL DEL MÓDULO 3
  // =========================================================================
  renderCierre() {
    this.scrollToTop();
    learningCenterState.completeModule3();

    this.containerEl.innerHTML = `
      <section class="lc-equipaje-root animate-fade-in" aria-labelledby="cierre-title">
        ${this.renderHeaderHtml('cierre')}

        <div class="mod3-cierre-card">
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.85rem; background: rgba(116, 214, 51, 0.2); color: #A3E635; border: 1px solid rgba(116, 214, 51, 0.4); display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.4rem 1rem; border-radius: 9999px; font-weight: 800; font-size: 0.9rem;">
            <span>🏆</span>
            <span>NIVEL 03 COMPLETADO · CAMPUS VITAL TdeA</span>
          </div>

          <h1 id="cierre-title" style="font-size: 2.1rem; font-weight: 900; color: #FFFFFF; margin: 0.4rem 0 0.85rem 0;">
            ¡Felicitaciones! Has finalizado el Módulo 3
          </h1>
          <p style="font-size: 1.15rem; color: #A3E635; font-weight: 700; margin: 0 0 1.5rem 0;">
            Módulo 3: Gestionando mis emociones · Aprender a navegar los cambios
          </p>

          <!-- Video de Cierre Institucional General -->
          <div class="mod3-video-embed-card" style="max-width: 860px; margin: 0 auto 1.75rem auto; text-align: left;">
            <div class="mod3-video-top-bar">
              <h3 class="mod3-video-title">
                <span>🎬</span> <span>Video: Frase de Cierre Módulo 3</span>
              </h3>
            </div>
            <div class="mod3-video-frame-wrap">
              <video controls playsinline preload="metadata" style="position: absolute; top:0; left:0; width:100%; height:100%; object-fit: contain; background: #000; border-radius: 12px;">
                <source src="assets/campusVital/Módulo 3/Producto 07 - Mensaje de cierre/Frase de Cierre Módulo 3.mp4" type="video/mp4">
                Tu navegador no soporta reproducción de video local HTML5.
              </video>
            </div>
          </div>

          <!-- Frase de Cierre Oficial Institucional (Literal del Guion) -->
          <div class="mod3-cierre-quote">
            «Has finalizado tu recorrido por los tres módulos. Cada paso cuenta. Cada aprendizaje fortalece tu camino. En Campus Vital caminamos contigo para que vivas tu experiencia universitaria con bienestar, confianza y la certeza de que no estás solo(a).»
          </div>

          <!-- Resumen de Logros Alcanzados en las 4 Pausas -->
          <div style="background: rgba(255, 255, 255, 0.95); color: #022B14; border-radius: 16px; padding: 1.5rem; max-width: 820px; margin: 1.5rem auto; text-align: left; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);">
            <h3 style="font-size: 1.15rem; font-weight: 800; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem; color: #00843D;">
              <span>🌟</span> <span>Tus Logros en el Módulo 3:</span>
            </h3>
            <ul style="margin: 0; padding-left: 1.3rem; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.95rem; line-height: 1.45;">
              <li><strong>Pausa 1:</strong> Identificaste tus señales corporales de activación somática en el Escáner Corporal interactivo.</li>
              <li><strong>Pausa 2:</strong> Practicaste la técnica de Respiración Consciente (4-2-6) para regular tu sistema nervioso.</li>
              <li><strong>Pausa 3:</strong> Aplicaste el Semáforo Emocional (Me detengo, Observo, Elijo) al caso de Valentina.</li>
              <li><strong>Pausa 4:</strong> Conectaste con el presente (5-4-3-2-1) y consolidaste tu Caja de Herramientas personal descargable.</li>
            </ul>
          </div>

          <!-- Acciones de Descarga y Retorno -->
          <div class="mod3-cierre-actions-row">
            <button type="button" class="lc-btn lc-btn-secondary" id="btn-download-cert-m3" style="padding: 0.9rem 1.6rem; font-weight: 800; background: #FFFFFF; color: #00843D; border: 2px solid #00843D; cursor: pointer;">
              <span>📥 Descargar Tarjeta de Reconocimiento (PDF)</span>
            </button>

            <button type="button" class="lc-btn lc-btn-secondary" id="btn-download-toolbox-cierre" style="padding: 0.9rem 1.6rem; font-weight: 800; background: #FFFFFF; color: #00843D; border: 2px solid #00843D; cursor: pointer;">
              <span>🧰 Descargar Mi Caja de Herramientas (PDF)</span>
            </button>

            <button type="button" class="lc-btn lc-btn-primary" id="btn-cierre-to-vital-menu" style="padding: 0.9rem 2rem; font-weight: 800; background: #00843D; color: #FFFFFF; cursor: pointer;">
              <span>🏠 Volver al Menú de Campus Vital</span>
            </button>
          </div>
        </div>
      </section>
    `;

    this.bindCommonHeaderEvents();

    const btnCert = this.containerEl.querySelector('#btn-download-cert-m3');
    if (btnCert) {
      btnCert.addEventListener('click', () => this.downloadCertificateSheet());
    }

    const btnToolbox = this.containerEl.querySelector('#btn-download-toolbox-cierre');
    if (btnToolbox) {
      btnToolbox.addEventListener('click', () => this.downloadToolboxSheet());
    }

    const btnHome = this.containerEl.querySelector('#btn-cierre-to-vital-menu');
    if (btnHome) {
      btnHome.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('menu');
      });
    }
  }

  // =========================================================================
  // HELPER: REPRODUCTOR DE AUDIO DUA
  // =========================================================================
  bindAudioPlayer(prefix) {
    const audioEl = this.containerEl.querySelector(`#audio-el-${prefix}`);
    const playBtn = this.containerEl.querySelector(`#btn-play-${prefix}-audio`);
    const iconEl = this.containerEl.querySelector(`#icon-play-${prefix}`);
    const scrubber = this.containerEl.querySelector(`#scrubber-${prefix}-audio`);
    const timeLabel = this.containerEl.querySelector(`#time-${prefix}-audio`);
    const btnTrans = this.containerEl.querySelector(`#btn-toggle-${prefix}-audio-transcript`);
    const boxTrans = this.containerEl.querySelector(`#transcript-${prefix}-box`);

    if (!audioEl) return;
    this.activeAudioEl = audioEl;

    const formatTime = (secs) => {
      if (isNaN(secs)) return '0:00';
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (playBtn && iconEl) {
      playBtn.addEventListener('click', () => {
        if (audioEl.paused) {
          audioEl.play().then(() => {
            iconEl.textContent = '⏸';
          }).catch(() => {});
        } else {
          audioEl.pause();
          iconEl.textContent = '▶';
        }
      });
    }

    audioEl.addEventListener('timeupdate', () => {
      if (audioEl.duration && scrubber) {
        scrubber.value = String((audioEl.currentTime / audioEl.duration) * 100);
      }
      if (timeLabel) {
        timeLabel.textContent = `${formatTime(audioEl.currentTime)} / ${formatTime(audioEl.duration || 0)}`;
      }
    });

    audioEl.addEventListener('ended', () => {
      if (iconEl) iconEl.textContent = '▶';
      if (scrubber) scrubber.value = '0';
    });

    if (scrubber) {
      scrubber.addEventListener('input', () => {
        if (audioEl.duration) {
          audioEl.currentTime = (Number(scrubber.value) / 100) * audioEl.duration;
        }
      });
    }

    if (btnTrans && boxTrans) {
      btnTrans.addEventListener('click', () => {
        const isShown = boxTrans.style.display !== 'none';
        boxTrans.style.display = isShown ? 'none' : 'block';
        btnTrans.setAttribute('aria-expanded', String(!isShown));
        btnTrans.querySelector('span:last-child').textContent = isShown ? '▼' : '▲';
      });
    }
  }

  // =========================================================================
  // GENERADORES IMPRIMIBLES / DESCARGABLES (PDF)
  // =========================================================================
  downloadToolboxSheet() {
    const p4 = learningCenterState.state.module3?.pausa4 || {};
    const selected = p4.selectedTools || ['escaner', 'respiracion', 'semaforo'];
    const customNote = p4.customToolNote || 'Hago una pausa consciente, respiro con calma y confío en mis capacidades.';
    const postRef = p4.postExerciseReflection || 'Sensación de serenidad y mente despejada.';

    const toolNames = {
      escaner: '🧘 Escáner Corporal: Identificación oportuna de tensiones somáticas en cabeza, cuello o estómago.',
      respiracion: '🌬️ Respiración Consciente (4-2-6): Inhalar en 4s, retener 2s y exhalar en 6s para equilibrar el sistema nervioso.',
      semaforo: '🚦 Semáforo Emocional: Detenerme en Rojo, Observar sin juzgar en Amarillo y Elegir conscientemente en Verde.',
      anclaje_54321: '👁️ Anclaje Sensorial 5-4-3-2-1: Conexión inmediata al momento presente a través de los cinco sentidos.',
      reencuadre: '💭 Reencuadre Cognitivo Positivo: Recordar que un examen o calificación no define mi valor integral.',
      red_apoyo: '🤝 Red de Apoyo y Campus Vital TdeA: Apoyo en pares, docentes y los servicios de bienestar de Campus Vital.'
    };

    const toolsListHtml = selected.map(id => `
      <li style="margin-bottom: 0.6rem; color: #1E293B;">
        <strong>${toolNames[id] || id}</strong>
      </li>
    `).join('');

    const printHtml = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Mi Caja de Herramientas para Volver a la Calma - Campus Vital TdeA</title>
        <style>
          body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; margin: 40px; color: #0F172A; background: #FFFFFF; }
          .header { border-bottom: 3px solid #00843D; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }
          .title { font-size: 22px; font-weight: 800; color: #00843D; margin: 0; }
          .subtitle { font-size: 13px; color: #64748B; margin-top: 4px; }
          .card { background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
          .quote-box { background: #ECFDF5; border-left: 5px solid #00843D; padding: 15px; margin-bottom: 20px; font-style: italic; color: #065F46; }
          .btn-print { background: #00843D; color: #FFFFFF; border: none; padding: 10px 20px; font-size: 14px; font-weight: 700; border-radius: 8px; cursor: pointer; margin-bottom: 20px; }
          @media print { .btn-print { display: none; } body { margin: 20px; } }
        </style>
      </head>
      <body>
        <button class="btn-print" onclick="window.print()">🖨️ Imprimir o Guardar como PDF</button>
        <div class="header">
          <div>
            <h1 class="title">🧰 Mi Caja de Herramientas para Volver a la Calma</h1>
            <div class="subtitle">MÓDULO 3: GESTIONANDO MIS EMOCIONES · CAMPUS VITAL · TECNOLÓGICO DE ANTIOQUIA</div>
          </div>
          <div style="text-align: right; font-size: 12px; color: #64748B;">
            Fecha: ${new Date().toLocaleDateString('es-CO')}
          </div>
        </div>

        <div class="quote-box">
          «Las emociones forman parte de nuestra vida y cambian constantemente. Aprender a regularlas no significa dejar de sentir, sino desarrollar recursos para afrontar los desafíos con mayor calma y bienestar.»
        </div>

        <div class="card">
          <h2 style="font-size: 16px; color: #022B14; margin-top: 0;">Herramientas Seleccionadas para mi Autocuidado:</h2>
          <ul style="padding-left: 20px; line-height: 1.6;">
            ${toolsListHtml || '<li>Respiración consciente 4-2-6</li><li>Semáforo emocional</li>'}
          </ul>
        </div>

        <div class="card">
          <h2 style="font-size: 16px; color: #022B14; margin-top: 0;">Mi Compromiso de Calma o Frase Ancla:</h2>
          <p style="font-size: 15px; font-weight: 600; color: #00843D; margin: 0;">
            "${customNote}"
          </p>
        </div>

        <div class="card">
          <h2 style="font-size: 16px; color: #022B14; margin-top: 0;">Estado Emocional y Reflexión:</h2>
          <p style="font-size: 14px; color: #334155; margin: 0;">
            ${postRef}
          </p>
        </div>

        <div style="font-size: 11px; color: #94A3B8; text-align: center; margin-top: 40px; border-top: 1px dashed #CBD5E1; padding-top: 15px;">
          Tecnológico de Antioquia - Institución Universitaria · Centro de Aprendizaje "TdeA Contigo" · Campus Vital 2026
        </div>
      </body>
      </html>
    `;

    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(printHtml);
      printWin.document.close();
    }
  }

  downloadCertificateSheet() {
    const printHtml = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Certificado de Reconocimiento - Módulo 3 Campus Vital TdeA</title>
        <style>
          body { font-family: 'Segoe UI', system-ui, sans-serif; margin: 30px; background: #FFFFFF; color: #022B14; }
          .cert-border { border: 8px solid #00843D; border-radius: 20px; padding: 40px; text-align: center; position: relative; }
          .cert-inner { border: 2px dashed #86EFAC; border-radius: 12px; padding: 30px; }
          .badge { font-size: 48px; margin-bottom: 10px; }
          .inst { font-size: 13px; font-weight: 800; letter-spacing: 1.5px; color: #64748B; text-transform: uppercase; }
          .title { font-size: 26px; font-weight: 900; color: #00843D; margin: 15px 0 10px 0; }
          .sub { font-size: 16px; color: #1E293B; max-width: 650px; margin: 0 auto 25px auto; line-height: 1.6; }
          .quote { background: #F0FDF4; border: 1.5px solid #86EFAC; border-radius: 12px; padding: 18px 25px; font-size: 15px; font-style: italic; color: #065F46; max-width: 650px; margin: 0 auto 30px auto; }
          .btn-print { background: #00843D; color: #FFFFFF; border: none; padding: 12px 24px; font-size: 15px; font-weight: 800; border-radius: 9999px; cursor: pointer; margin-bottom: 25px; }
          @media print { .btn-print { display: none; } body { margin: 10px; } }
        </style>
      </head>
      <body>
        <div style="text-align: center;">
          <button class="btn-print" onclick="window.print()">🖨️ Guardar o Imprimir Certificado en PDF</button>
        </div>
        <div class="cert-border">
          <div class="cert-inner">
            <div class="badge">🌱</div>
            <div class="inst">TECNOLÓGICO DE ANTIOQUIA · INSTITUCIÓN UNIVERSITARIA</div>
            <div class="inst" style="color: #00843D; font-size: 14px; margin-top: 5px;">CAMPUS VITAL · CENTRO DE APRENDIZAJE "TdeA CONTIGO"</div>
            <h1 class="title">Tarjeta de Reconocimiento</h1>
            <p class="sub">
              Por haber culminado satisfactoriamente el <strong>MÓDULO 3: GESTIONANDO MIS EMOCIONES</strong> («Aprender a navegar los cambios»), fortaleciendo tus recursos de regulación emocional, respiración consciente y atención plena para la vida universitaria.
            </p>
            <div class="quote">
              «Has finalizado tu recorrido por los tres módulos. Cada paso cuenta. Cada aprendizaje fortalece tu camino. En Campus Vital caminamos contigo para que vivas tu experiencia universitaria con bienestar, confianza y la certeza de que no estás solo(a).»
            </div>
            <div style="font-size: 13px; color: #64748B;">
              Medellín, Antioquia · ${new Date().toLocaleDateString('es-CO')}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(printHtml);
      printWin.document.close();
    }
  }
}
