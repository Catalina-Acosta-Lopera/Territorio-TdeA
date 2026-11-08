/**
 * Módulo 3 — Gestionando mis emociones: «Aprender a navegar los cambios»
 * Centro de Aprendizaje "TdeA Contigo" - Campus Vital 2026
 * Tecnológico de Antioquia - Institución Universitaria
 *
 * Enfoque DUA (Diseño Universal para el Aprendizaje):
 * - Representación múltiple (Audio en off institucional, Videos explicativos y de locución, Transcripciones)
 * - Acción y Expresión (Escáner corporal interactivo, Ejercicio interactivo de respiración 4-2-6 con repetición ilimitada,
 *   Semáforo emocional con cuadros de texto, Caso Valentina con retroalimentación inmediata,
 *   Técnica de anclaje sensorial 5-4-3-2-1, reflexión guiada y Ficha descargable "Mi Caja de Herramientas para Volver a la Calma")
 * - Compromiso y Motivación (Navegación horizontal por Pausas y sub-pasos estilo Módulo 1, certificación de logros y reconocimiento institucional)
 */

import { learningCenterState } from './learningCenterState.js';
import { getBodySilhouetteSvg } from './bodySilhouetteSvg.js';

export class Module3View {
  constructor(containerEl, onNavigate) {
    this.containerEl = containerEl;
    this.onNavigate = onNavigate; // callback para volver al menú ('menu'), o ir a mod1 / mod2
    this.currentPausa = 'intro'; // 'intro' | 'pausa1' | 'pausa2' | 'pausa3' | 'pausa4' | 'cierre'

    // Sub-pasos horizontales estilo Módulo 1
    this.p1Step = 1; // 1: Video explicativo, 2: Escáner Corporal + Mensaje
    this.p3Step = 1; // 1: Video y Semáforo emocional, 2: Caso de Valentina
    this.p4Step = 1; // 1: Conexión al presente 5-4-3-2-1 + Reflexión, 2: Video y Caja de Herramientas

    // Estado del reproductor de audio DUA
    this.activeAudioEl = null;
    this.activeAudioTimer = null;

    // Estado del ejercicio de respiración 4-2-6
    this.breathingTimer = null;
    this.breathingPhase = 'idle'; // 'idle' | 'inhala' | 'sosten' | 'exhala'
    this.breathingSecondsLeft = 0;
    this.isBreathingRunning = false;
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

  render(pausaKey = 'intro', subStep = null) {
    if (!this.containerEl) return;
    this.cleanupTimersAndAudio();
    this.currentPausa = pausaKey;
    learningCenterState.setModule3CurrentPausa(pausaKey);

    switch (this.currentPausa) {
      case 'intro':
        this.renderIntro();
        break;
      case 'pausa1':
        this.renderPausa1(subStep);
        break;
      case 'pausa2':
        this.renderPausa2();
        break;
      case 'pausa3':
        this.renderPausa3(subStep);
        break;
      case 'pausa4':
        this.renderPausa4(subStep);
        break;
      case 'cierre':
        this.renderCierre();
        break;
      default:
        this.renderIntro();
    }
  }

  /**
   * Renderiza la barra superior institucional con stepper de Pausas
   */
  renderHeaderHtml(activeKey) {
    const m3 = learningCenterState.state.module3 || {};
    const p1Done = Boolean(m3.pausa1?.completed);
    const p2Done = Boolean(m3.pausa2?.completed);
    const p3Done = Boolean(m3.pausa3?.completed);
    const p4Done = Boolean(m3.pausa4?.completed);
    const cierreDone = Boolean(m3.completed || m3.cierre?.completed);

    return `
      <div class="mod3-top-stepper-bar" role="navigation" aria-label="Navegación de Pausas Módulo 3">
        <button type="button" class="mod3-btn-back-menu" id="mod3-btn-to-menu" aria-label="Volver al menú de Campus Vital">
          <span aria-hidden="true">←</span>
          <span>Menú Campus Vital</span>
        </button>

        <nav class="mod3-pausas-nav" aria-label="Pausas del Módulo 3">
          <button type="button" class="mod3-pausa-tab ${activeKey === 'intro' ? 'is-active' : ''}" data-goto="intro">
            <span>🌿 Inicio</span>
          </button>
          <span class="mod3-pausa-tab-sep">›</span>

          <button type="button" class="mod3-pausa-tab ${activeKey === 'pausa1' ? 'is-active' : ''} ${p1Done ? 'is-completed' : ''}" data-goto="pausa1">
            <span>${p1Done ? '✓' : '1.'} Pausa 1: Señales del cuerpo</span>
          </button>
          <span class="mod3-pausa-tab-sep">›</span>

          <button type="button" class="mod3-pausa-tab ${activeKey === 'pausa2' ? 'is-active' : ''} ${p2Done ? 'is-completed' : ''}" data-goto="pausa2">
            <span>${p2Done ? '✓' : '2.'} Pausa 2: Respirar</span>
          </button>
          <span class="mod3-pausa-tab-sep">›</span>

          <button type="button" class="mod3-pausa-tab ${activeKey === 'pausa3' ? 'is-active' : ''} ${p3Done ? 'is-completed' : ''}" data-goto="pausa3">
            <span>${p3Done ? '✓' : '3.'} Pausa 3: Pausa consciente</span>
          </button>
          <span class="mod3-pausa-tab-sep">›</span>

          <button type="button" class="mod3-pausa-tab ${activeKey === 'pausa4' ? 'is-active' : ''} ${p4Done ? 'is-completed' : ''}" data-goto="pausa4">
            <span>${p4Done ? '✓' : '4.'} Pausa 4: Volviendo al presente</span>
          </button>
          <span class="mod3-pausa-tab-sep">›</span>

          <button type="button" class="mod3-pausa-tab ${activeKey === 'cierre' ? 'is-active' : ''} ${cierreDone ? 'is-completed' : ''}" data-goto="cierre">
            <span>${cierreDone ? '🏆' : '⭐'} Cierre</span>
          </button>
        </nav>
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

    const tabs = this.containerEl.querySelectorAll('.mod3-pausa-tab[data-goto]');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-goto');
        if (target) this.render(target);
      });
    });
  }

  // =========================================================================
  // 0. INTRODUCCIÓN GENERAL DEL MÓDULO 3
  // =========================================================================
  renderIntro() {
    this.scrollToTop();
    this.containerEl.innerHTML = `
      <section class="mod3-root-container animate-fade-in" aria-labelledby="mod3-intro-title">
        ${this.renderHeaderHtml('intro')}

        <!-- Hero Card Institucional Verde -->
        <div class="mod3-hero-card">
          <div class="mod3-hero-grid">
            <div class="mod3-hero-mascot-box">
              <div class="mod3-mascot-glow"></div>
              <img
                src="assets/icons/campus-vital-mascot-red-heart.svg"
                alt="Robot guía de Campus Vital TdeA abrazando corazón"
                class="mod3-hero-mascot-img"
                width="160"
                height="160"
              />
            </div>

            <div class="mod3-hero-content">
              <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.75rem; background: rgba(116, 214, 51, 0.2); color: #A3E635; border: 1px solid rgba(116, 214, 51, 0.4); display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.35rem 0.85rem; border-radius: 9999px; font-weight: 800; font-size: 0.85rem;">
                <span>🌱</span>
                <span>NIVEL 03 · REGULACIÓN EMOCIONAL Y BIENESTAR</span>
              </div>

              <h1 id="mod3-intro-title" class="mod3-hero-title">
                Módulo 3: Gestionando mis emociones
              </h1>
              <div class="mod3-hero-subtitle">
                Nombre: Aprender a navegar los cambios · Tema: Manejo de la ansiedad mediante la regulación emocional
              </div>

              <div class="mod3-hero-body">
                <p>
                  <strong>Propósito:</strong> Fortalecer la capacidad de los estudiantes para reconocer sus emociones y aplicar estrategias prácticas de regulación emocional que les permitan afrontar situaciones de ansiedad, estrés y tensión propias de la vida universitaria, favoreciendo su bienestar y permanencia.
                </p>
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

              <!-- Reproductor DUA de Voz en Off Introductoria -->
              <div class="mod3-dua-audio-card" style="background: rgba(255, 255, 255, 0.95); color: #0F172A; border-color: rgba(255, 255, 255, 0.3);">
                <div class="mod3-audio-header">
                  <div class="mod3-audio-title-wrap">
                    <span class="mod3-audio-icon">🎧</span>
                    <h3 class="mod3-audio-title">Audio_Introducción (Voz en off)</h3>
                  </div>
                  <button type="button" class="mod3-btn-transcript-toggle" id="btn-toggle-intro-transcript" aria-expanded="false">
                    <span>Transcripción DUA</span> <span>▼</span>
                  </button>
                </div>

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
                  <span style="font-size: 0.8rem; color: #64748B;">Voz oficial Campus Vital TdeA</span>
                </div>

                <div class="mod3-transcript-box" id="transcript-intro-box" style="display: none;">
                  <p style="margin: 0; font-style: italic;">
                    «Durante la vida universitaria vivimos momentos de entusiasmo, ilusión y aprendizaje. Pero también podemos experimentar preocupación, nervios, miedo o ansiedad frente a nuevos retos. Estas emociones hacen parte de nuestra experiencia. Lo importante no es evitarlas, sino aprender a reconocerlas y contar con herramientas que nos ayuden a responder de una manera saludable. En este módulo descubrirás algunas estrategias sencillas que podrás practicar cuando necesites volver a la calma. Vamos a tener 4 cortas paradas que nos ayudarán con esto en el viaje.»
                  </p>
                </div>
                <audio id="audio-el-intro" src="assets/campusVital/audio/modulo3_intro_voz.mp3" preload="metadata"></audio>
              </div>

            </div>
          </div>
        </div>

        <!-- Vista Previa de las 4 Pausas Formativas -->
        <div style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 18px; padding: 1.75rem; margin-top: 0.5rem; box-shadow: var(--m3-shadow-card);">
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #022B14; margin: 0 0 1.25rem 0; display: flex; align-items: center; gap: 0.5rem;">
            <span>🧭</span>
            <span>Las 4 Pausas Conscientes de tu Recorrido</span>
          </h2>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
            <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 1.1rem; display: flex; flex-direction: column; gap: 0.4rem;">
              <span style="font-size: 0.8rem; font-weight: 800; color: #059669; text-transform: uppercase;">Pausa 1</span>
              <strong style="font-size: 1rem; color: #0F172A;">Reconociendo las señales de mi cuerpo</strong>
              <p style="font-size: 0.86rem; color: #64748B; margin: 0;">Video animado y Escáner Corporal interactivo para identificar cómo responde tu organismo a la tensión.</p>
            </div>

            <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 1.1rem; display: flex; flex-direction: column; gap: 0.4rem;">
              <span style="font-size: 0.8rem; font-weight: 800; color: #0284C7; text-transform: uppercase;">Pausa 2</span>
              <strong style="font-size: 1rem; color: #0F172A;">Respirar para volver a la calma</strong>
              <p style="font-size: 0.86rem; color: #64748B; margin: 0;">Audio guiado y animación de respiración consciente (4-2-6) con ritmo visual repetible y descargable.</p>
            </div>

            <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 1.1rem; display: flex; flex-direction: column; gap: 0.4rem;">
              <span style="font-size: 0.8rem; font-weight: 800; color: #D97706; text-transform: uppercase;">Pausa 3</span>
              <strong style="font-size: 1rem; color: #0F172A;">Haciendo una pausa consciente</strong>
              <p style="font-size: 0.86rem; color: #64748B; margin: 0;">Video, Semáforo Emocional con cuadros de texto y análisis formativo del Caso de Valentina.</p>
            </div>

            <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 1.1rem; display: flex; flex-direction: column; gap: 0.4rem;">
              <span style="font-size: 0.8rem; font-weight: 800; color: #7C3AED; text-transform: uppercase;">Pausa 4</span>
              <strong style="font-size: 1rem; color: #0F172A;">Volviendo al presente y Caja de Herramientas</strong>
              <p style="font-size: 0.86rem; color: #64748B; margin: 0;">Técnica sensorial 5-4-3-2-1, reflexión guiada y generación de tu Ficha de Bienestar personalizada en PDF.</p>
            </div>
          </div>

          <div style="margin-top: 1.75rem; display: flex; justify-content: flex-end;">
            <button type="button" class="mod3-btn-next" id="btn-start-m3-journey" style="padding: 0.95rem 2rem; font-size: 1.05rem;">
              <span>Botón Siguiente: Iniciar Pausa 1</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>
    `;

    this.bindCommonHeaderEvents();
    this.bindAudioPlayer('intro');

    const btnStart = this.containerEl.querySelector('#btn-start-m3-journey');
    if (btnStart) {
      btnStart.addEventListener('click', () => this.render('pausa1', 1));
    }
  }

  // =========================================================================
  // 1. PAUSA 1: RECONOCIENDO LAS SEÑALES DE MI CUERPO
  // Sub-paso 1: Resultado de aprendizaje y Video Animado
  // Sub-paso 2: Actividad Escáner Corporal + Mensaje Reflexivo
  // =========================================================================
  renderPausa1(subStep) {
    this.scrollToTop();
    if (subStep !== undefined && subStep !== null) {
      this.p1Step = Number(subStep);
    }
    if (!this.p1Step || this.p1Step < 1 || this.p1Step > 2) {
      this.p1Step = 1;
    }

    const current = this.p1Step;
    const p1State = learningCenterState.state.module3?.pausa1 || {};
    const selectedRegions = p1State.selectedRegions || [];
    const bodyNotes = p1State.bodyNotes || '';

    this.containerEl.innerHTML = `
      <section class="mod3-root-container animate-fade-in" aria-labelledby="p1-title">
        ${this.renderHeaderHtml('pausa1')}

        <div style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 18px; padding: 1.75rem; box-shadow: var(--m3-shadow-card);">
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.5rem; background: #ECFDF5; color: #065F46; border: 1.5px solid #A7F3D0; display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.35rem 0.85rem; border-radius: 9999px; font-weight: 800; font-size: 0.82rem;">
            <span>PAUSA 1</span>
            <span>· RECONOCIENDO LAS SEÑALES DE MI CUERPO</span>
          </div>

          <h1 id="p1-title" style="font-size: 1.75rem; font-weight: 800; color: #022B14; margin: 0.25rem 0 0.85rem 0;">
            Pausa 1: Reconociendo las señales de mi cuerpo
          </h1>

          <!-- Stepper horizontal de sub-pasos estilo Módulo 1 -->
          <div class="horizontal-station-stepper" style="margin-bottom: 1.25rem;">
            <button type="button" class="h-step-item ${current === 1 ? 'is-current' : 'is-completed'}" id="btn-p1-substep-1">
              <span>${current > 1 ? '✓' : '1.'}</span>
              <span>🎬 Video: Reconociendo las señales</span>
            </button>
            <span class="h-step-sep">›</span>
            <button type="button" class="h-step-item ${current === 2 ? 'is-current' : ''}" id="btn-p1-substep-2">
              <span>2.</span>
              <span>🧍 Actividad: Escáner Corporal</span>
            </button>
          </div>

          ${current === 1 ? `
            <!-- SUB-PASO 1: RESULTADO DE APRENDIZAJE Y VIDEO -->
            <div class="animate-fade-in">
              <div class="mod3-learning-outcome-card">
                <div class="mod3-outcome-label">
                  <span>🎯</span> <strong>Resultado de aprendizaje:</strong>
                </div>
                <p class="mod3-outcome-text">
                  Al finalizar el módulo, el estudiante será capaz de identificar las señales de activación emocional y aplicar técnicas básicas de regulación emocional, respiración consciente y atención plena para afrontar situaciones de ansiedad o estrés en su vida universitaria.
                </p>
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
                  <iframe
                    src="https://www.youtube-nocookie.com/embed/RGDg89d05uU?rel=0"
                    title="Video Animado: Reconociendo las señales de mi cuerpo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>

                <div class="mod3-transcript-box" id="transcript-video1-box" style="display: none; margin: 1rem 1.25rem;">
                  <p style="margin: 0 0 0.5rem 0; font-weight: 800; color: #022B14;">Guion oficial del Video (Locución):</p>
                  <p style="margin: 0; font-style: italic;">
                    «Cuando sentimos ansiedad nuestro cuerpo intenta prepararse para responder a una situación que interpreta como desafiante. Es posible sentir el corazón acelerado, respiración rápida, tensión muscular, molestias en el estómago o dificultad para concentrarse. Cada persona experimenta estas señales de manera diferente.»
                  </p>
                </div>
              </div>
            </div>
          ` : `
            <!-- SUB-PASO 2: ESCÁNER CORPORAL INTERACTIVO + MENSAJE -->
            <div class="animate-fade-in">
              <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.6rem;">
                <span style="font-size: 1.5rem;">🧍</span>
                <h2 style="font-size: 1.35rem; font-weight: 800; color: #022B14; margin: 0;">
                  Actividad: Escáner Corporal
                </h2>
              </div>
              <p style="font-size: 0.96rem; color: #475569; margin: 0 0 1.25rem 0; line-height: 1.5;">
                Observa la silueta corporal. <strong>Haz clic sobre las partes del cuerpo</strong> donde normalmente sientes tensión, ansiedad o estrés (la figura está en blanco y a medida que vas seleccionando cada zona, se ilumina con su color y te explica la respuesta fisiológica):
              </p>

              <div class="mod3-scanner-container">
                <div class="mod3-silhouette-col">
                  <div id="mod3-silhouette-wrapper" style="width: 100%; max-width: 320px; display: flex; justify-content: center;">
                    ${getBodySilhouetteSvg({ id: 'mod3-body-scanner-svg', selectedIds: selectedRegions })}
                  </div>
                  <div class="mod3-silhouette-hint">
                    💡 Haz clic en la silueta anatómica o en las tarjetas de la derecha.
                  </div>
                </div>

                <div class="mod3-regions-grid" id="mod3-regions-list">
                  ${this.renderScannerRegionsHtml(selectedRegions)}
                </div>
              </div>

              <div class="mod3-scanner-reflection-box">
                <label for="p1-body-notes" style="display: block; font-size: 0.95rem; font-weight: 800; color: #022B14; margin-bottom: 0.4rem;">
                  📝 ¿Qué otra señal o sensación notas en tu cuerpo ante el estrés?
                </label>
                <textarea
                  id="p1-body-notes"
                  class="mod3-tl-input"
                  placeholder="Ejemplo: Suelo apretar la mandíbula o sentir los hombros tensos antes de una exposición..."
                >${bodyNotes}</textarea>
              </div>

              <!-- Mensaje Reflexivo Oficial -->
              <div class="mod3-quote-card">
                «Reconocer cómo responde tu cuerpo es el primer paso para aprender a cuidarlo.»
              </div>
            </div>
          `}
        </div>

        <!-- Footer de Navegación según el sub-paso actual -->
        <div class="mod3-actions-footer">
          ${current === 1 ? `
            <button type="button" class="mod3-btn-prev" id="btn-p1-back-intro">
              <span aria-hidden="true">←</span> <span>Volver a la Introducción</span>
            </button>
            <button type="button" class="mod3-btn-next" id="btn-p1-to-substep-2">
              <span>Botón Siguiente: Realizar Escáner Corporal</span> <span aria-hidden="true">→</span>
            </button>
          ` : `
            <button type="button" class="mod3-btn-prev" id="btn-p1-to-substep-1">
              <span aria-hidden="true">←</span> <span>Anterior: Ver Video</span>
            </button>
            <button type="button" class="mod3-btn-next" id="btn-p1-next-p2">
              <span>Botón Siguiente: Avanzar a Pausa 2</span> <span aria-hidden="true">→</span>
            </button>
          `}
        </div>
      </section>
    `;

    this.bindCommonHeaderEvents();
    this.bindPausa1Events(current);
  }

  renderScannerRegionsHtml(selectedIds = []) {
    const regions = [
      { id: 'cabeza', name: 'Cabeza y Mandíbula', desc: 'Dolores de cabeza tensionales, pesadez, tensión en mandíbula (bruxismo).' },
      { id: 'cuello', name: 'Cuello y Hombros', desc: 'Rigidez cervical y acumulación de carga física en los trapecios.' },
      { id: 'pecho', name: 'Pecho y Tórax', desc: 'Respiración rápida o corta, taquicardia o sensación de opresión.' },
      { id: 'estomago', name: 'Estómago y Abdomen', desc: 'Molestias digestivas, sensación de vacío, nudo o "mariposas" nerviosas.' },
      { id: 'brazos', name: 'Manos y Brazos', desc: 'Sudoración palmar, manos frías, puños apretados o temblor leve.' },
      { id: 'piernas', name: 'Piernas y Pies', desc: 'Inquietud motora, tensión muscular, temblor o ganas de caminar.' }
    ];

    return regions.map(r => {
      const isSel = selectedIds.includes(r.id);
      return `
        <div class="mod3-region-card ${isSel ? 'is-selected' : ''}" data-region-id="${r.id}" role="checkbox" aria-checked="${isSel}">
          <div class="mod3-region-checkbox">${isSel ? '✓' : ''}</div>
          <div style="flex: 1;">
            <h4 class="mod3-region-title">${r.name}</h4>
            <p class="mod3-region-desc">${r.desc}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  bindPausa1Events(current) {
    const tab1 = this.containerEl.querySelector('#btn-p1-substep-1');
    const tab2 = this.containerEl.querySelector('#btn-p1-substep-2');
    if (tab1) tab1.addEventListener('click', () => this.renderPausa1(1));
    if (tab2) tab2.addEventListener('click', () => this.renderPausa1(2));

    if (current === 1) {
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

      const btnBack = this.containerEl.querySelector('#btn-p1-back-intro');
      if (btnBack) btnBack.addEventListener('click', () => this.render('intro'));

      const btnTo2 = this.containerEl.querySelector('#btn-p1-to-substep-2');
      if (btnTo2) btnTo2.addEventListener('click', () => this.renderPausa1(2));
    } else {
      const toggleRegion = (regId) => {
        const p1 = learningCenterState.state.module3?.pausa1 || {};
        let cur = [...(p1.selectedRegions || [])];
        if (cur.includes(regId)) {
          cur = cur.filter(id => id !== regId);
        } else {
          cur.push(regId);
        }
        learningCenterState.setModule3Pausa1BodyRegions(cur);

        const silWrap = this.containerEl.querySelector('#mod3-silhouette-wrapper');
        if (silWrap) {
          silWrap.innerHTML = getBodySilhouetteSvg({ id: 'mod3-body-scanner-svg', selectedIds: cur });
          bindSvgClicks();
        }

        const listWrap = this.containerEl.querySelector('#mod3-regions-list');
        if (listWrap) {
          listWrap.innerHTML = this.renderScannerRegionsHtml(cur);
          bindListClicks();
        }
      };

      const bindSvgClicks = () => {
        const hotspots = this.containerEl.querySelectorAll('#mod3-body-scanner-svg [data-region]');
        hotspots.forEach(hs => {
          hs.style.cursor = 'pointer';
          hs.addEventListener('click', (e) => {
            e.stopPropagation();
            const regId = hs.getAttribute('data-region');
            if (regId) toggleRegion(regId);
          });
        });
      };

      const bindListClicks = () => {
        const cards = this.containerEl.querySelectorAll('.mod3-region-card[data-region-id]');
        cards.forEach(card => {
          card.addEventListener('click', () => {
            const regId = card.getAttribute('data-region-id');
            if (regId) toggleRegion(regId);
          });
        });
      };

      bindSvgClicks();
      bindListClicks();

      const notesInput = this.containerEl.querySelector('#p1-body-notes');
      if (notesInput) {
        notesInput.addEventListener('input', (e) => {
          learningCenterState.setModule3Pausa1BodyNotes(e.target.value);
        });
      }

      const btnTo1 = this.containerEl.querySelector('#btn-p1-to-substep-1');
      if (btnTo1) btnTo1.addEventListener('click', () => this.renderPausa1(1));

      const btnNext = this.containerEl.querySelector('#btn-p1-next-p2');
      if (btnNext) {
        btnNext.addEventListener('click', () => {
          learningCenterState.completeModule3Pausa1();
          this.render('pausa2');
        });
      }
    }
  }

  // =========================================================================
  // 2. PAUSA 2: RESPIRAR PARA VOLVER A LA CALMA
  // Audio guiado descargable + animación círculo interactivo con repetición ilimitada
  // =========================================================================
  renderPausa2() {
    this.scrollToTop();
    const p2State = learningCenterState.state.module3?.pausa2 || {};
    const rounds = p2State.breathingRounds || 0;

    this.containerEl.innerHTML = `
      <section class="mod3-root-container animate-fade-in" aria-labelledby="p2-title">
        ${this.renderHeaderHtml('pausa2')}

        <div style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 18px; padding: 1.75rem; box-shadow: var(--m3-shadow-card);">
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.5rem; background: #ECFDF5; color: #065F46; border: 1.5px solid #A7F3D0; display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.35rem 0.85rem; border-radius: 9999px; font-weight: 800; font-size: 0.82rem;">
            <span>PAUSA 2</span>
            <span>· RESPIRAR PARA VOLVER A LA CALMA</span>
          </div>

          <h1 id="p2-title" style="font-size: 1.75rem; font-weight: 800; color: #022B14; margin: 0.25rem 0 1rem 0;">
            Pausa 2: Respirar para volver a la calma
          </h1>

          <div class="mod3-learning-outcome-card">
            <div class="mod3-outcome-label">
              <span>🎯</span> <strong>Resultado de aprendizaje:</strong>
            </div>
            <p class="mod3-outcome-text">
              Aplicar la técnica de respiración consciente (4-2-6) como recurso fisiológico inmediato para regular el sistema nervioso y recuperar el equilibrio emocional ante situaciones de tensión.
            </p>
          </div>

          <!-- Reproductor de Audio Guiado Institucional (Descargable y con transcripción DUA) -->
          <div class="mod3-dua-audio-card">
            <div class="mod3-audio-header">
              <div class="mod3-audio-title-wrap">
                <span class="mod3-audio-icon">🧘</span>
                <h3 class="mod3-audio-title">Audio guiado: Respirar para volver a la calma</h3>
              </div>
              <button type="button" class="mod3-btn-transcript-toggle" id="btn-toggle-p2-audio-transcript" aria-expanded="false">
                <span>Ver transcripción DUA</span> <span>▼</span>
              </button>
            </div>

            <div class="mod3-audio-controls-row">
              <button type="button" class="mod3-audio-play-btn" id="btn-play-p2-audio" aria-label="Reproducir audio guiado de respiración">
                <span id="icon-play-p2">▶</span>
              </button>
              <input type="range" class="mod3-audio-scrubber" id="scrubber-p2-audio" min="0" max="100" value="0" aria-label="Progreso del audio">
              <span class="mod3-audio-time-label" id="time-p2-audio">0:00 / 0:54</span>
            </div>

            <div class="mod3-audio-actions-row">
              <a href="assets/campusVital/audio/modulo3_pausa2_respiracion.mp3" download="CampusVital_Modulo3_RespiracionGuiada.mp3" class="mod3-audio-download-btn">
                <span>📥</span> <span>Descargar audio MP3 (Respirar para volver a la calma)</span>
              </a>
              <span style="font-size: 0.82rem; color: #065F46; font-weight: 700;">El estudiante puede descargar este audio y repetir el ejercicio todas las veces que quiera.</span>
            </div>

            <div class="mod3-transcript-box" id="transcript-p2-box" style="display: none;">
              <p style="margin: 0 0 0.4rem 0; font-weight: 800; color: #022B14;">Guion oficial del Audio Guiado (Locución voz en off):</p>
              <p style="margin: 0; font-style: italic;">
                «Busca una postura cómoda. Si lo deseas, puedes cerrar los ojos. Lleva tu atención a la respiración. Inhala lentamente por la nariz durante cuatro segundos. Uno... Dos... Tres... Cuatro... Mantén el aire dos segundos. Exhala lentamente por la boca durante seis segundos. Repite este ejercicio siguiendo el ritmo de la animación.»
              </p>
            </div>
            <audio id="audio-el-p2" src="assets/campusVital/audio/modulo3_pausa2_respiracion.mp3" preload="metadata"></audio>
          </div>

          <!-- Escenario Interactivo de Respiración con Círculo Guiado 4-2-6 -->
          <div class="mod3-breathing-stage">
            <h2 style="font-size: 1.35rem; font-weight: 800; color: #022B14; margin: 0 0 0.4rem 0;">
              Animación Visual: Círculo de Respiración Consciente (4 - 2 - 6)
            </h2>
            <p style="font-size: 0.95rem; color: #475569; margin: 0; text-align: center; max-width: 620px;">
              Sigue el ritmo del círculo: <strong>Inhala en 4 segundos</strong> (el círculo crece lentamente), <strong>mantén el aire en 2 segundos</strong> y <strong>exhala en 6 segundos</strong> (el círculo disminuye).
            </p>

            <div class="mod3-breathing-visual-wrap">
              <div class="mod3-breath-ring-outer"></div>
              <div class="mod3-breath-bubble" id="mod3-breathing-bubble">
                <span class="mod3-breath-phase-label" id="mod3-breath-phase-text">LISTO</span>
                <span class="mod3-breath-timer-count" id="mod3-breath-timer-text">4</span>
              </div>
            </div>

            <div class="mod3-breath-controls-row">
              <button type="button" class="mod3-btn-breath-start" id="btn-toggle-breath-run">
                <span id="breath-run-icon">▶</span>
                <span id="breath-run-text">Iniciar ejercicio guiado</span>
              </button>

              <button type="button" class="mod3-btn-breath-repeat" id="btn-repeat-breath-exercise" title="El estudiante puede repetir el ejercicio todas las veces que quiera">
                <span>🔄</span>
                <span>Repetir el ejercicio (todas las veces que quieras)</span>
              </button>
            </div>

            <div class="mod3-breath-rounds-badge" id="mod3-rounds-counter">
              🌿 Ciclos completados en esta sesión: <strong>${rounds}</strong>
            </div>
          </div>

          <!-- Video Fallback institucional -->
          <div class="mod3-video-embed-card" style="margin-top: 1.75rem;">
            <div class="mod3-video-top-bar">
              <h3 class="mod3-video-title">
                <span>🎬</span> <span>Video: Animación y Locución de Respiración Guiada</span>
              </h3>
            </div>
            <div class="mod3-video-frame-wrap">
              <iframe
                src="https://www.youtube-nocookie.com/embed/Gf0tXJ_A4HE?rel=0"
                title="Video Animado: Respirar para volver a la calma"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>

        <!-- Footer de Navegación -->
        <div class="mod3-actions-footer">
          <button type="button" class="mod3-btn-prev" id="btn-p2-back-p1">
            <span aria-hidden="true">←</span> <span>Anterior: Pausa 1</span>
          </button>
          <button type="button" class="mod3-btn-next" id="btn-p2-next-p3">
            <span>Botón Siguiente: Avanzar a Pausa 3</span> <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    `;

    this.bindCommonHeaderEvents();
    this.bindAudioPlayer('p2');
    this.bindPausa2BreathingEvents();
  }

  bindPausa2BreathingEvents() {
    const bubble = this.containerEl.querySelector('#mod3-breathing-bubble');
    const phaseText = this.containerEl.querySelector('#mod3-breath-phase-text');
    const timerText = this.containerEl.querySelector('#mod3-breath-timer-text');
    const btnToggle = this.containerEl.querySelector('#btn-toggle-breath-run');
    const btnRepeat = this.containerEl.querySelector('#btn-repeat-breath-exercise');
    const counterBadge = this.containerEl.querySelector('#mod3-rounds-counter');

    let phase = 'idle';
    let count = 4;

    const setPhase = (newPhase, newCount) => {
      phase = newPhase;
      count = newCount;
      if (phaseText) {
        if (phase === 'inhala') phaseText.textContent = 'INHALA';
        else if (phase === 'sosten') phaseText.textContent = 'SOSTÉN';
        else if (phase === 'exhala') phaseText.textContent = 'EXHALA';
        else phaseText.textContent = 'LISTO';
      }
      if (timerText) timerText.textContent = count;

      if (bubble) {
        if (phase === 'inhala') {
          bubble.style.transition = 'transform 4s cubic-bezier(0.4, 0, 0.2, 1)';
          bubble.style.transform = 'scale(1.75)';
          bubble.style.background = 'radial-gradient(circle at 35% 35%, #34D399 0%, #059669 60%, #065F46 100%)';
        } else if (phase === 'sosten') {
          bubble.style.transition = 'transform 2s ease';
          bubble.style.transform = 'scale(1.75)';
          bubble.style.background = 'radial-gradient(circle at 35% 35%, #38BDF8 0%, #0284C7 60%, #0369A1 100%)';
        } else if (phase === 'exhala') {
          bubble.style.transition = 'transform 6s cubic-bezier(0.4, 0, 0.2, 1)';
          bubble.style.transform = 'scale(1)';
          bubble.style.background = 'radial-gradient(circle at 35% 35%, #A7F3D0 0%, #10B981 60%, #047857 100%)';
        } else {
          bubble.style.transform = 'scale(1)';
        }
      }
    };

    const tick = () => {
      count--;
      if (count > 0) {
        if (timerText) timerText.textContent = count;
      } else {
        if (phase === 'inhala') {
          setPhase('sosten', 2);
        } else if (phase === 'sosten') {
          setPhase('exhala', 6);
        } else if (phase === 'exhala') {
          learningCenterState.addModule3BreathingRound();
          const r = learningCenterState.state.module3?.pausa2?.breathingRounds || 1;
          if (counterBadge) counterBadge.innerHTML = `🌿 Ciclos completados en esta sesión: <strong>${r}</strong>`;
          setPhase('inhala', 4);
        }
      }
    };

    const startBreathing = () => {
      this.isBreathingRunning = true;
      if (btnToggle) {
        btnToggle.querySelector('#breath-run-icon').textContent = '⏸';
        btnToggle.querySelector('#breath-run-text').textContent = 'Pausar ejercicio';
      }
      setPhase('inhala', 4);
      if (this.breathingTimer) clearInterval(this.breathingTimer);
      this.breathingTimer = setInterval(tick, 1000);
    };

    const pauseBreathing = () => {
      this.isBreathingRunning = false;
      if (this.breathingTimer) {
        clearInterval(this.breathingTimer);
        this.breathingTimer = null;
      }
      if (btnToggle) {
        btnToggle.querySelector('#breath-run-icon').textContent = '▶';
        btnToggle.querySelector('#breath-run-text').textContent = 'Continuar ejercicio';
      }
    };

    if (btnToggle) {
      btnToggle.addEventListener('click', () => {
        if (this.isBreathingRunning) {
          pauseBreathing();
        } else {
          startBreathing();
        }
      });
    }

    if (btnRepeat) {
      btnRepeat.addEventListener('click', () => {
        pauseBreathing();
        startBreathing();
      });
    }

    const btnBack = this.containerEl.querySelector('#btn-p2-back-p1');
    if (btnBack) btnBack.addEventListener('click', () => this.render('pausa1', 2));

    const btnNext = this.containerEl.querySelector('#btn-p2-next-p3');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        learningCenterState.completeModule3Pausa2();
        this.render('pausa3', 1);
      });
    }
  }

  // =========================================================================
  // 3. PAUSA 3: HACIENDO UNA PAUSA CONSCIENTE
  // Sub-paso 1: Video + Semáforo Emocional con preguntas en cuadros de texto
  // Sub-paso 2: Caso de Valentina y su examen final (con retroalimentación)
  // =========================================================================
  renderPausa3(subStep) {
    this.scrollToTop();
    if (subStep !== undefined && subStep !== null) {
      this.p3Step = Number(subStep);
    }
    if (!this.p3Step || this.p3Step < 1 || this.p3Step > 2) {
      this.p3Step = 1;
    }

    const current = this.p3Step;
    const p3State = learningCenterState.state.module3?.pausa3 || {};
    const tl = p3State.trafficLight || {};
    const valCase = p3State.caseValentina || {};

    this.containerEl.innerHTML = `
      <section class="mod3-root-container animate-fade-in" aria-labelledby="p3-title">
        ${this.renderHeaderHtml('pausa3')}

        <div style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 18px; padding: 1.75rem; box-shadow: var(--m3-shadow-card);">
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.5rem; background: #ECFDF5; color: #065F46; border: 1.5px solid #A7F3D0; display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.35rem 0.85rem; border-radius: 9999px; font-weight: 800; font-size: 0.82rem;">
            <span>PAUSA 3</span>
            <span>· HACIENDO UNA PAUSA CONSCIENTE</span>
          </div>

          <h1 id="p3-title" style="font-size: 1.75rem; font-weight: 800; color: #022B14; margin: 0.25rem 0 0.85rem 0;">
            Pausa 3: Haciendo una pausa consciente
          </h1>

          <!-- Stepper horizontal de sub-pasos estilo Módulo 1 -->
          <div class="horizontal-station-stepper" style="margin-bottom: 1.25rem;">
            <button type="button" class="h-step-item ${current === 1 ? 'is-current' : 'is-completed'}" id="btn-p3-substep-1">
              <span>${current > 1 ? '✓' : '1.'}</span>
              <span>🚦 Video y Semáforo Emocional</span>
            </button>
            <span class="h-step-sep">›</span>
            <button type="button" class="h-step-item ${current === 2 ? 'is-current' : ''}" id="btn-p3-substep-2">
              <span>2.</span>
              <span>📚 Caso de Valentina</span>
            </button>
          </div>

          ${current === 1 ? `
            <!-- SUB-PASO 1: VIDEO Y SEMÁFORO EMOCIONAL -->
            <div class="animate-fade-in">
              <div class="mod3-video-embed-card">
                <div class="mod3-video-top-bar">
                  <h3 class="mod3-video-title">
                    <span>🎬</span> <span>Video: Haciendo una pausa consciente</span>
                  </h3>
                </div>
                <div class="mod3-video-frame-wrap">
                  <iframe
                    src="https://www.youtube-nocookie.com/embed/v_vr2lXKa8E?rel=0"
                    title="Video: Haciendo una pausa consciente"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
                <div style="padding: 0.85rem 1.25rem; background: #F8FAFC; border-top: 1px solid #E2E8F0; font-size: 0.92rem; font-style: italic; color: #334155;">
                  «Muchas veces reaccionamos rápidamente cuando sentimos ansiedad. Una pausa consciente nos ayuda a responder con mayor claridad.»
                </div>
              </div>

              <div style="margin-top: 1.75rem;">
                <h2 style="font-size: 1.3rem; font-weight: 800; color: #022B14; margin: 0 0 0.5rem 0;">
                  Actividad: Semáforo Emocional (Pantalla Interactiva)
                </h2>
                <p style="font-size: 0.95rem; color: #475569; margin: 0 0 1.25rem 0;">
                  Responde las preguntas en cada cuadro de texto para aprender a pausar tu respuesta:
                </p>

                <div class="mod3-traffic-light-grid">
                  <!-- ROJO -->
                  <div class="mod3-tl-card is-red">
                    <div class="mod3-tl-header">
                      <div class="mod3-tl-light" style="background: #EF4444; color: #EF4444;"></div>
                      <h4 class="mod3-tl-title" style="color: #991B1B;">🔴 ROJO: Me detengo</h4>
                    </div>
                    <label for="tl-input-red" class="mod3-tl-question">¿Qué está ocurriendo?</label>
                    <textarea
                      class="mod3-tl-input"
                      id="tl-input-red"
                      placeholder="Escribe qué está ocurriendo a tu alrededor o en la situación..."
                    >${tl.redText || ''}</textarea>
                  </div>

                  <!-- AMARILLO -->
                  <div class="mod3-tl-card is-yellow">
                    <div class="mod3-tl-header">
                      <div class="mod3-tl-light" style="background: #F59E0B; color: #F59E0B;"></div>
                      <h4 class="mod3-tl-title" style="color: #92400E;">🟡 AMARILLO: Observo</h4>
                    </div>
                    <label for="tl-input-yellow" class="mod3-tl-question">¿Qué estoy sintiendo? ¿Qué necesita mi cuerpo?</label>
                    <textarea
                      class="mod3-tl-input"
                      id="tl-input-yellow"
                      placeholder="Escribe qué sensaciones y emociones notas en este instante..."
                    >${tl.yellowText || ''}</textarea>
                  </div>

                  <!-- VERDE -->
                  <div class="mod3-tl-card is-green">
                    <div class="mod3-tl-header">
                      <div class="mod3-tl-light" style="background: #10B981; color: #10B981;"></div>
                      <h4 class="mod3-tl-title" style="color: #065F46;">🟢 VERDE: Elijo</h4>
                    </div>
                    <label for="tl-input-green" class="mod3-tl-question">¿Qué puedo hacer ahora?</label>
                    <textarea
                      class="mod3-tl-input"
                      id="tl-input-green"
                      placeholder="Escribe qué respuesta o acción consciente puedes elegir..."
                    >${tl.greenText || ''}</textarea>
                  </div>
                </div>
              </div>
            </div>
          ` : `
            <!-- SUB-PASO 2: CASO DE VALENTINA -->
            <div class="animate-fade-in">
              <div class="mod3-case-card">
                <div class="mod3-case-banner">
                  <span>📚</span>
                  <span>SITUACIÓN DE ESTUDIO · CASO VALENTINA Y SU EXAMEN FINAL</span>
                </div>

                <div class="mod3-case-story-content">
                  <img
                    src="assets/images/learningCenter/valentina_story_case.jpg"
                    alt="Valentina esperando el examen con palpitaciones"
                    class="mod3-case-image"
                    loading="lazy"
                  />
                  <div class="mod3-case-text">
                    <p style="margin: 0 0 0.75rem 0;">
                      Valentina está a pocos minutos de presentar el <strong>examen final</strong> de una asignatura muy importante. Mientras espera que el docente entregue el examen, comienza a sentir que su corazón late más rápido de lo habitual. Sus manos están sudando y piensa:
                    </p>
                    <blockquote style="margin: 0 0 0.75rem 0; padding-left: 1rem; border-left: 3px solid #EF4444; font-style: italic; color: #7F1D1D;">
                      «Si me va mal en este examen, voy a perder la materia. Tal vez no soy lo suficientemente buena para estar en la universidad.»
                    </blockquote>
                    <p style="margin: 0;">
                      Nota que le cuesta concentrarse y siente el impulso de <strong>salir del salón</strong> porque cree que no podrá responder el examen.
                    </p>
                  </div>
                </div>

                <div style="background: #F0FDF4; border: 1.5px solid #86EFAC; border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 1.25rem;">
                  <strong style="color: #065F46; font-size: 1rem;">Instrucciones:</strong>
                  <p style="margin: 0.25rem 0 0 0; font-size: 0.94rem; color: #1E293B;">
                    ¿Cómo podría Valentina utilizar el Semáforo Emocional para afrontar este momento? Completa cada color del semáforo con la opción que consideres más adecuada.
                  </p>
                </div>

                <!-- ROJO -->
                <div class="mod3-quiz-step-card">
                  <h4 style="font-size: 1rem; font-weight: 800; color: #991B1B; margin: 0 0 0.4rem 0;">
                    🔴 ROJO: Me detengo
                  </h4>
                  <p style="font-size: 0.94rem; font-weight: 700; color: #1E293B; margin: 0 0 0.75rem 0;">
                    ¿Qué podría hacer Valentina antes de reaccionar impulsivamente?
                  </p>

                  <label class="mod3-quiz-option-label">
                    <input type="radio" name="val_red" value="salir" ${valCase.redOption === 'salir' ? 'checked' : ''}>
                    <span>Salir inmediatamente del salón sin hablar con nadie.</span>
                  </label>

                  <label class="mod3-quiz-option-label">
                    <input type="radio" name="val_red" value="detenerse" ${valCase.redOption === 'detenerse' ? 'checked' : ''}>
                    <span>Detenerse por un momento y reconocer lo que está sintiendo.</span>
                  </label>

                  <label class="mod3-quiz-option-label">
                    <input type="radio" name="val_red" value="ignorar" ${valCase.redOption === 'ignorar' ? 'checked' : ''}>
                    <span>Ignorar lo que está pasando y comenzar el examen rápidamente.</span>
                  </label>

                  <div class="mod3-quiz-feedback" id="feedback-val-red" style="${valCase.redOption ? '' : 'display: none;'}">
                    ✨ <strong>Retroalimentación esperada:</strong> El primer paso consiste en detenerse y reconocer las emociones y sensaciones físicas antes de actuar. Esto ayuda a evitar respuestas impulsivas.
                  </div>
                </div>

                <!-- AMARILLO -->
                <div class="mod3-quiz-step-card">
                  <h4 style="font-size: 1rem; font-weight: 800; color: #92400E; margin: 0 0 0.4rem 0;">
                    🟡 AMARILLO: Observo
                  </h4>
                  <p style="font-size: 0.94rem; font-weight: 700; color: #1E293B; margin: 0 0 0.75rem 0;">
                    ¿Qué podría observar Valentina en este momento? (El estudiante puede seleccionar varias opciones)
                  </p>

                  ${this.renderYellowCheckboxes(valCase.yellowOptions || [])}

                  <div class="mod3-quiz-feedback" id="feedback-val-yellow" style="${(valCase.yellowOptions || []).length > 0 ? '' : 'display: none;'}">
                    ✨ <strong>Retroalimentación:</strong> Observar significa tomar conciencia de lo que ocurre en el cuerpo, las emociones y los pensamientos, sin juzgarse.
                  </div>
                </div>

                <!-- VERDE -->
                <div class="mod3-quiz-step-card">
                  <h4 style="font-size: 1rem; font-weight: 800; color: #065F46; margin: 0 0 0.4rem 0;">
                    🟢 VERDE: Elijo
                  </h4>
                  <p style="font-size: 0.94rem; font-weight: 700; color: #1E293B; margin: 0 0 0.75rem 0;">
                    ¿Qué acciones podrían ayudar a Valentina a afrontar esta situación? (Selecciona las que consideres más útiles)
                  </p>

                  ${this.renderGreenCheckboxes(valCase.greenOptions || [])}

                  <div class="mod3-quiz-feedback" id="feedback-val-green" style="${(valCase.greenOptions || []).length > 0 ? '' : 'display: none;'}">
                    ✨ <strong>Retroalimentación:</strong> Elegir implica responder de manera consciente utilizando estrategias que favorezcan el bienestar y permitan afrontar la situación con mayor calma.
                  </div>
                </div>
              </div>
            </div>
          `}
        </div>

        <!-- Footer de Navegación -->
        <div class="mod3-actions-footer">
          ${current === 1 ? `
            <button type="button" class="mod3-btn-prev" id="btn-p3-back-p2">
              <span aria-hidden="true">←</span> <span>Anterior: Pausa 2</span>
            </button>
            <button type="button" class="mod3-btn-next" id="btn-p3-to-substep-2">
              <span>Botón Siguiente: Caso de Valentina</span> <span aria-hidden="true">→</span>
            </button>
          ` : `
            <button type="button" class="mod3-btn-prev" id="btn-p3-to-substep-1">
              <span aria-hidden="true">←</span> <span>Anterior: Semáforo Emocional</span>
            </button>
            <button type="button" class="mod3-btn-next" id="btn-p3-next-p4">
              <span>Botón Siguiente: Avanzar a Pausa 4</span> <span aria-hidden="true">→</span>
            </button>
          `}
        </div>
      </section>
    `;

    this.bindCommonHeaderEvents();
    this.bindPausa3Events(current);
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

  bindPausa3Events(current) {
    const tab1 = this.containerEl.querySelector('#btn-p3-substep-1');
    const tab2 = this.containerEl.querySelector('#btn-p3-substep-2');
    if (tab1) tab1.addEventListener('click', () => this.renderPausa3(1));
    if (tab2) tab2.addEventListener('click', () => this.renderPausa3(2));

    if (current === 1) {
      const inRed = this.containerEl.querySelector('#tl-input-red');
      const inYellow = this.containerEl.querySelector('#tl-input-yellow');
      const inGreen = this.containerEl.querySelector('#tl-input-green');

      if (inRed) inRed.addEventListener('input', (e) => learningCenterState.setModule3TrafficLightAnswer('redText', e.target.value));
      if (inYellow) inYellow.addEventListener('input', (e) => learningCenterState.setModule3TrafficLightAnswer('yellowText', e.target.value));
      if (inGreen) inGreen.addEventListener('input', (e) => learningCenterState.setModule3TrafficLightAnswer('greenText', e.target.value));

      const btnBack = this.containerEl.querySelector('#btn-p3-back-p2');
      if (btnBack) btnBack.addEventListener('click', () => this.render('pausa2'));

      const btnTo2 = this.containerEl.querySelector('#btn-p3-to-substep-2');
      if (btnTo2) btnTo2.addEventListener('click', () => this.renderPausa3(2));
    } else {
      const radiosRed = this.containerEl.querySelectorAll('input[name="val_red"]');
      const fbRed = this.containerEl.querySelector('#feedback-val-red');
      radiosRed.forEach(r => {
        r.addEventListener('change', (e) => {
          learningCenterState.setModule3CaseValentina('redOption', e.target.value);
          if (fbRed) fbRed.style.display = 'block';
        });
      });

      const checksYellow = this.containerEl.querySelectorAll('input[name="val_yellow"]');
      const fbYellow = this.containerEl.querySelector('#feedback-val-yellow');
      checksYellow.forEach(c => {
        c.addEventListener('change', () => {
          const sel = Array.from(checksYellow).filter(x => x.checked).map(x => x.value);
          learningCenterState.setModule3CaseValentina('yellowOptions', sel);
          if (fbYellow) fbYellow.style.display = sel.length > 0 ? 'block' : 'none';
        });
      });

      const checksGreen = this.containerEl.querySelectorAll('input[name="val_green"]');
      const fbGreen = this.containerEl.querySelector('#feedback-val-green');
      checksGreen.forEach(c => {
        c.addEventListener('change', () => {
          const sel = Array.from(checksGreen).filter(x => x.checked).map(x => x.value);
          learningCenterState.setModule3CaseValentina('greenOptions', sel);
          if (fbGreen) fbGreen.style.display = sel.length > 0 ? 'block' : 'none';
        });
      });

      const btnTo1 = this.containerEl.querySelector('#btn-p3-to-substep-1');
      if (btnTo1) btnTo1.addEventListener('click', () => this.renderPausa3(1));

      const btnNext = this.containerEl.querySelector('#btn-p3-next-p4');
      if (btnNext) {
        btnNext.addEventListener('click', () => {
          learningCenterState.completeModule3Pausa3();
          this.render('pausa4', 1);
        });
      }
    }
  }

  // =========================================================================
  // 4. PAUSA 4: VOLVIENDO AL PRESENTE Y MI CAJA DE HERRAMIENTAS
  // Sub-paso 1: Audio Volviendo al presente + Cuadro "¿Cómo te sientes después del ejercicio?"
  // Sub-paso 2: Video + Producto: Mi Caja de Herramientas para Volver a la Calma
  // =========================================================================
  renderPausa4(subStep) {
    this.scrollToTop();
    if (subStep !== undefined && subStep !== null) {
      this.p4Step = Number(subStep);
    }
    if (!this.p4Step || this.p4Step < 1 || this.p4Step > 2) {
      this.p4Step = 1;
    }

    const current = this.p4Step;
    const p4State = learningCenterState.state.module3?.pausa4 || {};
    const senses = p4State.sensoryAnswers || {};
    const postReflection = p4State.postExerciseReflection || '';
    const selectedTools = p4State.selectedTools || ['escaner', 'respiracion', 'semaforo'];
    const customToolNote = p4State.customToolNote || '';

    this.containerEl.innerHTML = `
      <section class="mod3-root-container animate-fade-in" aria-labelledby="p4-title">
        ${this.renderHeaderHtml('pausa4')}

        <div style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 18px; padding: 1.75rem; box-shadow: var(--m3-shadow-card);">
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.5rem; background: #ECFDF5; color: #065F46; border: 1.5px solid #A7F3D0; display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.35rem 0.85rem; border-radius: 9999px; font-weight: 800; font-size: 0.82rem;">
            <span>PAUSA 4</span>
            <span>· VOLVIENDO AL PRESENTE</span>
          </div>

          <h1 id="p4-title" style="font-size: 1.75rem; font-weight: 800; color: #022B14; margin: 0.25rem 0 0.85rem 0;">
            Pausa 4: Volviendo al presente
          </h1>

          <!-- Stepper horizontal de sub-pasos estilo Módulo 1 -->
          <div class="horizontal-station-stepper" style="margin-bottom: 1.25rem;">
            <button type="button" class="h-step-item ${current === 1 ? 'is-current' : 'is-completed'}" id="btn-p4-substep-1">
              <span>${current > 1 ? '✓' : '1.'}</span>
              <span>🌿 Audio y Conexión al Presente</span>
            </button>
            <span class="h-step-sep">›</span>
            <button type="button" class="h-step-item ${current === 2 ? 'is-current' : ''}" id="btn-p4-substep-2">
              <span>2.</span>
              <span>🧰 Video y Caja de Herramientas</span>
            </button>
          </div>

          ${current === 1 ? `
            <!-- SUB-PASO 1: AUDIO Y EJERCICIO DE REFLEXIÓN -->
            <div class="animate-fade-in">
              <div class="mod3-dua-audio-card">
                <div class="mod3-audio-header">
                  <div class="mod3-audio-title-wrap">
                    <span class="mod3-audio-icon">🎧</span>
                    <h3 class="mod3-audio-title">Audio: Volviendo al presente (Técnica 5 - 4 - 3 - 2 - 1)</h3>
                  </div>
                  <button type="button" class="mod3-btn-transcript-toggle" id="btn-toggle-p4-audio-transcript" aria-expanded="false">
                    <span>Ver transcripción DUA</span> <span>▼</span>
                  </button>
                </div>

                <div class="mod3-audio-controls-row">
                  <button type="button" class="mod3-audio-play-btn" id="btn-play-p4-audio" aria-label="Reproducir audio de anclaje sensorial">
                    <span id="icon-play-p4">▶</span>
                  </button>
                  <input type="range" class="mod3-audio-scrubber" id="scrubber-p4-audio" min="0" max="100" value="0" aria-label="Progreso del audio">
                  <span class="mod3-audio-time-label" id="time-p4-audio">0:00 / 1:07</span>
                </div>

                <div class="mod3-audio-actions-row">
                  <a href="assets/campusVital/audio/modulo3_pausa4_presente.mp3" download="CampusVital_Modulo3_VolviendoAlPresente.mp3" class="mod3-audio-download-btn">
                    <span>📥</span> <span>Descargar audio MP3</span>
                  </a>
                  <span style="font-size: 0.8rem; color: #64748B;">Recurso guiado sensorial Campus Vital</span>
                </div>

                <div class="mod3-transcript-box" id="transcript-p4-box" style="display: none;">
                  <p style="margin: 0 0 0.4rem 0; font-weight: 800; color: #022B14;">Guion oficial del Audio Guiado (Locución):</p>
                  <p style="margin: 0; font-style: italic;">
                    «Cuando la ansiedad aparece es frecuente que nuestra mente viaje hacia preocupaciones sobre lo que podría pasar. Una manera de recuperar la calma consiste en volver al momento presente utilizando nuestros sentidos. Audio guiado: Técnica 5-4-3-2-1: Observa cinco cosas que puedas ver. Ahora identifica cuatro cosas que puedas tocar. Escucha tres sonidos. Percibe dos aromas. Finalmente identifica un sabor o una sensación agradable.»
                  </p>
                </div>
                <audio id="audio-el-p4" src="assets/campusVital/audio/modulo3_pausa4_presente.mp3" preload="metadata"></audio>
              </div>

              <!-- Tablero Sensorial Interactivo 5-4-3-2-1 -->
              <div style="margin-top: 1.5rem;">
                <h3 style="font-size: 1.15rem; font-weight: 800; color: #022B14; margin: 0 0 0.5rem 0;">
                  🖐️ Técnica 5-4-3-2-1: Identifica lo que te rodea
                </h3>
                <div class="mod3-senses-grid">
                  <div class="mod3-sense-card">
                    <span class="mod3-sense-badge"><span>👁️</span> 5 Cosas que puedes ver</span>
                    <input type="text" class="mod3-sense-input" id="sense-5" placeholder="Ej. La mesa, una ventana, la pantalla..." value="${senses.senses5 || ''}">
                  </div>
                  <div class="mod3-sense-card">
                    <span class="mod3-sense-badge"><span>✋</span> 4 Cosas que puedes tocar</span>
                    <input type="text" class="mod3-sense-input" id="sense-4" placeholder="Ej. Mi ropa, el bolígrafo, la silla..." value="${senses.senses4 || ''}">
                  </div>
                  <div class="mod3-sense-card">
                    <span class="mod3-sense-badge"><span>👂</span> 3 Sonidos que escuchas</span>
                    <input type="text" class="mod3-sense-input" id="sense-3" placeholder="Ej. Voces distantes, viento, el teclado..." value="${senses.senses3 || ''}">
                  </div>
                  <div class="mod3-sense-card">
                    <span class="mod3-sense-badge"><span>👃</span> 2 Aromas que percibes</span>
                    <input type="text" class="mod3-sense-input" id="sense-2" placeholder="Ej. Café, aire fresco, libreta..." value="${senses.senses2 || ''}">
                  </div>
                  <div class="mod3-sense-card">
                    <span class="mod3-sense-badge"><span>👅</span> 1 Sabor o sensación grata</span>
                    <input type="text" class="mod3-sense-input" id="sense-1" placeholder="Ej. Agua fresca, respirar con calma..." value="${senses.senses1 || ''}">
                  </div>
                </div>
              </div>

              <!-- Actividad requerida: El estudiante escribe ¿Cómo te sientes después del ejercicio? -->
              <div style="background: #F0FDF4; border: 1.5px solid #86EFAC; border-radius: 14px; padding: 1.35rem; margin-top: 1.5rem;">
                <label for="post-reflection-input" style="display: block; font-size: 1.05rem; font-weight: 800; color: #022B14; margin-bottom: 0.4rem;">
                  ✍️ Actividad: ¿Cómo te sientes después del ejercicio?
                </label>
                <p style="font-size: 0.9rem; color: #065F46; margin: 0 0 0.75rem 0;">
                  Escribe en este cuadro tus sensaciones o reflexiones luego de conectar con tus sentidos:
                </p>
                <textarea
                  id="post-reflection-input"
                  class="mod3-tl-input"
                  style="min-height: 90px;"
                  placeholder="Escribe aquí tu respuesta (ejemplo: Me siento con más tranquilidad, mi mente se calmó y siento el cuerpo menos tensionado)..."
                >${postReflection}</textarea>
              </div>
            </div>
          ` : `
            <!-- SUB-PASO 2: VIDEO Y PRODUCTO CAJA DE HERRAMIENTAS -->
            <div class="animate-fade-in">
              <div class="mod3-video-embed-card">
                <div class="mod3-video-top-bar">
                  <h3 class="mod3-video-title">
                    <span>🎬</span> <span>Video: Mensaje Final de Regulación Emocional</span>
                  </h3>
                </div>
                <div class="mod3-video-frame-wrap">
                  <iframe
                    src="https://www.youtube-nocookie.com/embed/BeevtYYREJI?rel=0"
                    title="Video: Mensaje Final"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
                <div style="padding: 0.85rem 1.25rem; background: #F8FAFC; border-top: 1px solid #E2E8F0; font-size: 0.92rem; font-style: italic; color: #334155;">
                  «Las emociones forman parte de nuestra vida y cambian constantemente. Aprender a regularlas no significa dejar de sentir, sino desarrollar recursos para afrontar los desafíos con mayor calma y bienestar. Recuerda que cada persona encuentra estrategias diferentes para cuidarse. Explora las herramientas que descubriste en este módulo y úsalas cuando las necesites...»
                </div>
              </div>

              <!-- PRODUCTO: MI CAJA DE HERRAMIENTAS PARA VOLVER A LA CALMA -->
              <div class="mod3-toolbox-card" id="toolbox-section">
                <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.75rem;">
                  <div style="display: flex; align-items: center; gap: 0.6rem;">
                    <span style="font-size: 2rem;">🧰</span>
                    <div>
                      <h3 style="font-size: 1.35rem; font-weight: 900; color: #022B14; margin: 0;">
                        Producto: Mi Caja de Herramientas para Volver a la Calma
                      </h3>
                      <span style="font-size: 0.86rem; color: #065F46; font-weight: 700;">
                        Selecciona las herramientas que deseas guardar para generar tu ficha descargable
                      </span>
                    </div>
                  </div>

                  <button type="button" class="lc-btn lc-btn-secondary" id="btn-download-toolbox-pdf" style="font-weight: 800; padding: 0.75rem 1.4rem; background: #ECFDF5; border-color: #00843D; color: #00843D; cursor: pointer;">
                    <span>📥 Descargar Ficha (PDF)</span>
                  </button>
                </div>

                <p style="font-size: 0.95rem; color: #334155; line-height: 1.5; margin: 0 0 1.25rem 0;">
                  Al finalizar, el sistema genera una <strong>ficha personalizada con las herramientas vistas que selecciones</strong> y que podrás descargar o consultar cuando lo necesites:
                </p>

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
          `}
        </div>

        <!-- Footer de Navegación -->
        <div class="mod3-actions-footer">
          ${current === 1 ? `
            <button type="button" class="mod3-btn-prev" id="btn-p4-back-p3">
              <span aria-hidden="true">←</span> <span>Anterior: Pausa 3</span>
            </button>
            <button type="button" class="mod3-btn-next" id="btn-p4-to-substep-2">
              <span>Botón Siguiente: Mi Caja de Herramientas</span> <span aria-hidden="true">→</span>
            </button>
          ` : `
            <button type="button" class="mod3-btn-prev" id="btn-p4-to-substep-1">
              <span aria-hidden="true">←</span> <span>Anterior: Audio y Reflexión</span>
            </button>
            <button type="button" class="mod3-btn-next" id="btn-p4-next-cierre">
              <span>Botón Siguiente: CIERRE general</span> <span aria-hidden="true">→</span>
            </button>
          `}
        </div>
      </section>
    `;

    this.bindCommonHeaderEvents();
    if (current === 1) this.bindAudioPlayer('p4');
    this.bindPausa4Events(current);
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

  bindPausa4Events(current) {
    const tab1 = this.containerEl.querySelector('#btn-p4-substep-1');
    const tab2 = this.containerEl.querySelector('#btn-p4-substep-2');
    if (tab1) tab1.addEventListener('click', () => this.renderPausa4(1));
    if (tab2) tab2.addEventListener('click', () => this.renderPausa4(2));

    if (current === 1) {
      ['5', '4', '3', '2', '1'].forEach(num => {
        const input = this.containerEl.querySelector(`#sense-${num}`);
        if (input) {
          input.addEventListener('input', (e) => {
            learningCenterState.setModule3SensoryAnswer(`senses${num}`, e.target.value);
          });
        }
      });

      const refInput = this.containerEl.querySelector('#post-reflection-input');
      if (refInput) {
        refInput.addEventListener('input', (e) => {
          learningCenterState.setModule3PostReflection(e.target.value);
        });
      }

      const btnBack = this.containerEl.querySelector('#btn-p4-back-p3');
      if (btnBack) btnBack.addEventListener('click', () => this.render('pausa3', 2));

      const btnTo2 = this.containerEl.querySelector('#btn-p4-to-substep-2');
      if (btnTo2) btnTo2.addEventListener('click', () => this.renderPausa4(2));
    } else {
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

      const btnTo1 = this.containerEl.querySelector('#btn-p4-to-substep-1');
      if (btnTo1) btnTo1.addEventListener('click', () => this.renderPausa4(1));

      const btnNext = this.containerEl.querySelector('#btn-p4-next-cierre');
      if (btnNext) {
        btnNext.addEventListener('click', () => {
          learningCenterState.completeModule3Pausa4();
          this.render('cierre');
        });
      }
    }
  }

  // =========================================================================
  // 5. CIERRE GENERAL DEL MÓDULO 3
  // =========================================================================
  renderCierre() {
    this.scrollToTop();
    learningCenterState.completeModule3();

    this.containerEl.innerHTML = `
      <section class="mod3-root-container animate-fade-in" aria-labelledby="cierre-title">
        ${this.renderHeaderHtml('cierre')}

        <div class="mod3-cierre-card">
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.85rem; background: rgba(116, 214, 51, 0.2); color: #A3E635; border: 1px solid rgba(116, 214, 51, 0.4); display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.4rem 1rem; border-radius: 9999px; font-weight: 800; font-size: 0.9rem;">
            <span>🏆</span>
            <span>CIERRE GENERAL · CAMPUS VITAL TdeA</span>
          </div>

          <h1 id="cierre-title" style="font-size: 2.1rem; font-weight: 900; color: #FFFFFF; margin: 0.4rem 0 1rem 0;">
            ¡Felicitaciones! Has finalizado el Módulo 3
          </h1>
          <p style="font-size: 1.15rem; color: #A3E635; font-weight: 700; margin: 0 0 1.5rem 0;">
            Módulo 3: Gestionando mis emociones · Aprender a navegar los cambios
          </p>

          <!-- Video de Cierre Institucional -->
          <div class="mod3-video-embed-card" style="max-width: 860px; margin: 0 auto 1.75rem auto; text-align: left;">
            <div class="mod3-video-top-bar">
              <h3 class="mod3-video-title">
                <span>🎬</span> <span>Video: Frase de Cierre Módulo 3</span>
              </h3>
            </div>
            <div class="mod3-video-frame-wrap">
              <iframe
                src="https://www.youtube-nocookie.com/embed/YHFAuxFJJXQ?rel=0"
                title="Video: Frase de Cierre Módulo 3"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </div>

          <!-- Frase de Cierre Oficial Institucional (Literal del Guion) -->
          <div class="mod3-cierre-quote">
            «Has finalizado tu recorrido por los tres módulos. Cada paso cuenta. Cada aprendizaje fortalece tu camino. En Campus Vital caminamos contigo para que vivas tu experiencia universitaria con bienestar, confianza y la certeza de que no estás solo(a).»
          </div>

          <!-- Resumen de Logros Alcanzados -->
          <div style="background: rgba(255, 255, 255, 0.95); color: #022B14; border-radius: 16px; padding: 1.5rem; max-width: 820px; margin: 1.5rem auto; text-align: left; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);">
            <h3 style="font-size: 1.15rem; font-weight: 800; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem; color: #00843D;">
              <span>🌟</span> <span>Tus Logros en el Módulo 3:</span>
            </h3>
            <ul style="margin: 0; padding-left: 1.3rem; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.95rem; line-height: 1.45;">
              <li><strong>Pausa 1:</strong> Identificaste tus señales corporales de activación somática en el Escáner Corporal.</li>
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
