/**
 * Módulo 1 — Bienestar Emocional y Afrontamiento Universitario: «Preparar el equipaje»
 * Centro de Aprendizaje "TdeA Contigo" - Campus Vital 2026
 * Tecnológico de Antioquia - Institución Universitaria
 * 
 * Enfoque DUA (Diseño Universal para el Aprendizaje):
 * - Representación múltiple (Audio, Video, Infografías interactivas, Textos, PDF accesibles)
 * - Acción y Expresión (Lienzo interactivo descargable en PNG, 8 áreas seleccionables, brújula)
 * - Compromiso y Motivación (Gamificación, insignias, progresión visible)
 */

import { learningCenterState } from './learningCenterState.js';
import { TrainMapAnimation } from './trainMapAnimation.js';
import { RESOURCES_DATA, getResourceById } from '../../data/resourcesData.js';
import { ResourceCard } from '../resourceCard.js';

export class Module1View {
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

  constructor(containerEl, onNavigate) {
    this.containerEl = containerEl;
    this.onNavigate = onNavigate; // callback para volver al menú ('menu') o ir a ('module2')
    this.currentStep = 'module_intro'; // 'module_intro' | 'welcome_video' | 'intro_infographic' | 'station_menu' | 'station_1' | 'station_2' | 'station_3' | 'closing'
    
    // Estado del lienzo interactivo (Estación 3)
    this.canvas = null;
    this.ctx = null;
    this.isDrawing = false;
    this.currentColor = '#00843D'; // Verde institucional TdeA
    this.currentLineWidth = 3;
    
    // Estado del reproductor de audio DUA
    this.audioElement = null;
    this.audioPlayBtn = null;
    this.audioScrubber = null;
    this.audioCurrentTimeEl = null;
    this.audioTotalTimeEl = null;
    this.audioUpdateInterval = null;

    // Pasos activos dentro de las Estaciones 1, 2 y 3 (Flujo horizontal paso a paso DUA)
    this.st1Step = 1;
    this.st2Step = 1;
    this.st3Step = 1;
  }

  /**
   * Renderiza el paso actual del módulo
   * @param {string} [step] Paso a renderizar
   */
  render(step) {
    if (!this.containerEl) return;
    
    const validSteps = ['module_intro', 'welcome_video', 'intro_infographic', 'station_menu', 'station_1', 'station_2', 'station_3', 'closing'];
    const state = learningCenterState.state.module1.equipaje;

    if (step && validSteps.includes(step)) {
      this.currentStep = step;
      learningCenterState.setEquipajeStep(step);
    } else if (state?.step && validSteps.includes(state.step)) {
      this.currentStep = state.step;
    } else {
      this.currentStep = 'module_intro';
    }

    // Limpiar intervalos previos de audio
    if (this.audioUpdateInterval) {
      clearInterval(this.audioUpdateInterval);
      this.audioUpdateInterval = null;
    }

    switch (this.currentStep) {
      case 'module_intro':
        this.renderModuleIntro();
        break;
      case 'intro_infographic':
        this.renderIntroInfographic();
        break;
      case 'station_menu':
        this.renderStationMenu();
        break;
      case 'station_1':
        this.renderStation1();
        break;
      case 'station_2':
        this.renderStation2();
        break;
      case 'station_3':
        this.renderStation3();
        break;
      case 'closing':
        this.renderClosing();
        break;
      case 'welcome_video':
      default:
        this.renderWelcomeVideo();
        break;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Manejador de retorno jerárquico dentro del Módulo 1
   * @returns {boolean} true si se gestionó internamente
   */
  handleBack() {
    if (this.currentStep && this.currentStep !== 'module_intro') {
      if (this.currentStep.startsWith('station_')) {
        this.render('station_menu');
        return true;
      }
      this.render('module_intro');
      return true;
    }
    return false;
  }

  /**
   * Genera el encabezado con barra de navegación institucional y pasos DUA
   */
  renderHeaderHtml(activeStepKey) {
    return '';
  }

  // =========================================================================
  // 0. INTRODUCCIÓN DEDICADA DEL MÓDULO 1 (CAMPUS VITAL TdeA)
  // =========================================================================
  renderModuleIntro() {
    this.scrollToTop();
    this.containerEl.innerHTML = `
      <section class="lc-equipaje-root animate-fade-in" aria-labelledby="mod1-intro-heading">
        ${this.renderHeaderHtml('module_intro')}

        <!-- Tarjeta Hero de Introducción con Fondo Verde Institucional y Robot abrazando corazón rojo -->
        <div class="mod1-hero-intro-card animate-fade-in">
          <div class="mod1-hero-intro-top">
            
            <!-- Mascota: Robot abrazando corazón rojo -->
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

            <!-- Contenido textual institucional -->
            <div class="mod1-hero-intro-content">
              <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.85rem; background: rgba(116, 214, 51, 0.2); color: #A3E635; border: 1px solid rgba(116, 214, 51, 0.4);">
                <span>🌱</span>
                <span>MÓDULO 1 · BIENESTAR EMOCIONAL Y AFRONTAMIENTO UNIVERSITARIO</span>
              </div>

              <h1 id="mod1-intro-heading" class="mod1-intro-title">
                Toda aventura comienza con un primer paso.
              </h1>

              <div class="mod1-intro-text-body">
                <p>
                  Ingresar a la universidad también es emprender un viaje. Habrá caminos fáciles y otros más desafiantes; momentos de entusiasmo, dudas, aprendizajes y cambios. En este recorrido no necesitas tener todas las respuestas, pero sí contar con recursos que te ayuden a avanzar cuando el camino se vuelva difícil.
                </p>
                <p>
                  En este módulo comenzarás a preparar tu <strong>maleta de bienestar</strong>, un espacio donde guardarás herramientas que podrás utilizar durante toda tu vida universitaria.
                </p>
              </div>

              <!-- Botón Siguiente para pasar al video -->
              <div class="mod1-intro-actions-row">
                <button type="button" class="lc-btn-intro-next" id="btn-intro-next-to-video">
                  <span>Siguiente: Ver Video de Bienvenida</span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>
    `;

    this.bindCommonEvents();

    const btnNext = this.containerEl.querySelector('#btn-intro-next-to-video');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        this.render('welcome_video');
      });
    }
  }

  // =========================================================================
  // 1. VIDEO DE BIENVENIDA CAMPUS VITAL
  // =========================================================================
  renderWelcomeVideo() {
    this.scrollToTop();
    this.containerEl.innerHTML = `
      <section class="lc-equipaje-root animate-fade-in" aria-labelledby="mod1-main-heading">
        ${this.renderHeaderHtml('welcome_video')}

        <!-- Banner de Encabezado Institucional -->
        <div class="lc-module-header">
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.5rem;">
            <span>🌱</span>
            <span>CENTRO DE APRENDIZAJE · TdeA CONTIGO · PROYECTO CAMPUS VITAL 2026</span>
          </div>
          <h1 id="mod1-main-heading" class="lc-module-heading">Módulo 1: Bienestar Emocional y Afrontamiento Universitario</h1>
          <h2 style="font-size: 1.25rem; color: #00843D; font-weight: 800; margin: 0.25rem 0 0.75rem 0;">«Preparar el equipaje»</h2>
          <p class="lc-module-intro">
            <strong>Propósito:</strong> Fortalecer las habilidades de afrontamiento emocional, autocuidado y bienestar durante tu experiencia universitaria.
          </p>
        </div>

        <!-- Video de Bienvenida Campus Vital (Producto 01) -->
        <div class="lc-embed-card">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 1.5rem;" aria-hidden="true">🎬</span>
              <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0F172A;">Video de Bienvenida Campus Vital</h3>
            </div>
            <span style="font-size: 0.85rem; font-weight: 700; color: #00843D; background: #E8F5E9; padding: 0.25rem 0.65rem; border-radius: 6px;">
              «Conocerte es el primer paso para acompañarte»
            </span>
          </div>

          <div class="lc-embed-frame-wrapper" id="video-welcome-wrapper">
            <iframe 
              id="iframe-welcome-video"
              src="https://www.youtube-nocookie.com/embed/GT06KknXdBs?rel=0&modestbranding=1" 
              title="Video de bienvenida Campus Vital TdeA" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowfullscreen
            ></iframe>
          </div>

          <!-- Opciones de Accesibilidad DUA para el Video -->
          <div class="lc-media-alt-row">
            <span style="font-size: 0.82rem; color: #64748B;">¿Prefieres reproducir el archivo local descargado?</span>
            <button type="button" class="lc-media-alt-btn" id="btn-toggle-local-video-1">
              <span>📁 Cambiar a reproductor local (.mp4)</span>
            </button>
          </div>
        </div>

        <!-- Botones de Navegación del Video (Anterior a Introducción, Siguiente a Infografía) -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-top: 1.25rem;">
          <button type="button" class="lc-btn lc-btn-secondary" id="btn-welcome-prev">
            <span aria-hidden="true">←</span>
            <span>Anterior: Introducción</span>
          </button>

          <button type="button" class="lc-btn lc-btn-primary" id="btn-welcome-next" style="padding: 0.9rem 2.2rem; font-size: 1.05rem; font-weight: 800;">
            <span>Siguiente: Pantalla Inicial</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    `;

    this.bindCommonEvents();

    const btnPrev = this.containerEl.querySelector('#btn-welcome-prev');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => this.render('module_intro'));
    }

    const btnNext = this.containerEl.querySelector('#btn-welcome-next');
    if (btnNext) {
      btnNext.addEventListener('click', () => this.render('intro_infographic'));
    }

    const btnLocal = this.containerEl.querySelector('#btn-toggle-local-video-1');
    if (btnLocal) {
      let isLocal = false;
      btnLocal.addEventListener('click', () => {
        const wrap = this.containerEl.querySelector('#video-welcome-wrapper');
        if (!wrap) return;
        isLocal = !isLocal;
        if (isLocal) {
          wrap.innerHTML = `
            <video controls autoplay style="position: absolute; top:0; left:0; width:100%; height:100%;">
              <source src="assets/campusVital/Módulo 1/Producto 01 - Video de bienvenida Campus Vital/1. Video de bienvenida Campus Vital.mp4" type="video/mp4">
              Tu navegador no soporta reproducción de video HTML5.
            </video>
          `;
          btnLocal.innerHTML = `<span>🌐 Cambiar a YouTube</span>`;
        } else {
          wrap.innerHTML = `
            <iframe 
              src="https://www.youtube-nocookie.com/embed/GT06KknXdBs?rel=0&modestbranding=1&autoplay=1" 
              title="Video de bienvenida Campus Vital TdeA" 
              allowfullscreen
            ></iframe>
          `;
          btnLocal.innerHTML = `<span>📁 Cambiar a reproductor local (.mp4)</span>`;
        }
      });
    }
  }

  // =========================================================================
  // 2. PANTALLA INICIAL: INFOGRAFÍA INTERACTIVA #1
  // =========================================================================
  renderIntroInfographic() {
    this.containerEl.innerHTML = `
      <section class="lc-equipaje-root animate-fade-in" aria-labelledby="intro-info-title">
        ${this.renderHeaderHtml('intro_infographic')}

        <div class="lc-module-header">
          <span class="lc-module-tag">Pantalla Inicial · Preparar el equipaje</span>
          <h2 id="intro-info-title" class="lc-module-heading">Infografía Interactiva de Bienvenida</h2>
          <p class="lc-module-intro">
            Explora la infografía institucional y pulsa en «Comenzar viaje» en la maleta para abordar el tren e iniciar tu recorrido.
          </p>
        </div>

        <!-- Canva Embed: Producto 02 con Hotspot interactivo sobre 'Comenzar Viaje' -->
        <div class="lc-embed-card">
          <div class="lc-embed-frame-wrapper" id="infographic-embed-wrapper">
            <iframe 
              loading="lazy" 
              src="https://www.canva.com/design/DAHXVnFOetI/e0sNiyNbt8lPSPft052w2A/view?embed" 
              title="Infografía Interactiva 1 Campus Vital"
              allowfullscreen="allowfullscreen" 
              allow="fullscreen"
            ></iframe>

            <!-- Hotspot interactivo 100% invisible sobre el botón 'Comenzar Viaje +' y la maleta -->
            <button 
              type="button" 
              id="btn-hotspot-start-journey" 
              class="lc-canva-hotspot-btn"
              title="Comenzar Viaje"
              aria-label="Comenzar viaje: ir a las estaciones del tren"
            ></button>
          </div>

          <!-- Opciones de Accesibilidad DUA para la Infografía -->
          <div class="lc-media-alt-row">
            <span style="font-size: 0.82rem; color: #64748B;">Recurso interactivo oficial en Canva</span>
            <button type="button" class="lc-media-alt-btn" id="btn-toggle-local-infographic-1">
              <span>🖼️ Cambiar a imagen local (HD)</span>
            </button>
            <a href="https://canva.link/lh218q9q1i3uyjq" target="_blank" rel="noopener noreferrer" class="lc-media-alt-btn">
              <span>↗ Abrir en Canva (ventana completa)</span>
            </a>
          </div>
        </div>

        <!-- Botones de Navegación inferior -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.25rem; flex-wrap: wrap; gap: 1rem;">
          <button type="button" class="lc-btn lc-btn-secondary" id="btn-back-to-video">
            <span aria-hidden="true">←</span>
            <span>Volver al Video</span>
          </button>

          <button type="button" class="lc-btn-start-journey-cta" id="btn-start-journey">
            <span>🚂 Comenzar Viaje: Ir a las Estaciones</span>
            <span class="lc-hotspot-plus-badge" style="width: 24px; height: 24px; font-size: 1rem;">➕</span>
          </button>
        </div>
      </section>
    `;

    this.bindCommonEvents();

    const goToStations = () => {
      this.render('station_menu');
    };

    // 1. Hotspot sobre el botón "Comenzar Viaje +"
    const btnHotspot = this.containerEl.querySelector('#btn-hotspot-start-journey');
    if (btnHotspot) {
      btnHotspot.addEventListener('click', (e) => {
        e.preventDefault();
        goToStations();
      });
    }

    // 2. Botón CTA inferior "Comenzar Viaje: Ir a las Estaciones"
    const btnStart = this.containerEl.querySelector('#btn-start-journey');
    if (btnStart) {
      btnStart.addEventListener('click', (e) => {
        e.preventDefault();
        goToStations();
      });
    }

    // 3. Botón para volver al video
    const btnBack = this.containerEl.querySelector('#btn-back-to-video');
    if (btnBack) {
      btnBack.addEventListener('click', () => this.render('welcome_video'));
    }

    // 4. Alternador de Canva a Imagen Local HD
    const btnToggleLocal = this.containerEl.querySelector('#btn-toggle-local-infographic-1');
    if (btnToggleLocal) {
      let isLocal = false;
      btnToggleLocal.addEventListener('click', () => {
        const wrap = this.containerEl.querySelector('#infographic-embed-wrapper');
        if (!wrap) return;
        isLocal = !isLocal;
        if (isLocal) {
          const oldIframe = wrap.querySelector('iframe');
          if (oldIframe) oldIframe.remove();
          const img = document.createElement('img');
          img.id = 'img-local-infographic-1';
          img.src = 'assets/campusVital/images/mapa_rutas_infografia1.jpg';
          img.alt = 'Infografía Interactiva 1: Mapa de rutas y maleta de equipaje';
          img.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; border: none; cursor: pointer;';
          img.title = 'Haz clic para comenzar el viaje a las estaciones';
          img.addEventListener('click', () => goToStations());
          wrap.prepend(img);
          btnToggleLocal.innerHTML = `<span>🌐 Cambiar a Canva interactivo</span>`;
        } else {
          wrap.querySelector('#img-local-infographic-1')?.remove();
          const iframe = document.createElement('iframe');
          iframe.loading = 'lazy';
          iframe.src = 'https://www.canva.com/design/DAHXVnFOetI/e0sNiyNbt8lPSPft052w2A/view?embed';
          iframe.title = 'Infografía Interactiva 1 Campus Vital';
          iframe.allowFullscreen = true;
          iframe.setAttribute('allow', 'fullscreen');
          iframe.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;';
          wrap.prepend(iframe);
          btnToggleLocal.innerHTML = `<span>🖼️ Cambiar a imagen local (HD)</span>`;
        }
      });
    }

    // 5. Escucha de postMessage por si Canva emite navegación
    const canvaMsgHandler = (event) => {
      if (event.origin && event.origin.includes('canva.com')) {
        try {
          const d = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          if (d && (d.action === 'navigate' || d.type === 'click')) {
            goToStations();
          }
        } catch (e) {}
      }
    };
    window.addEventListener('message', canvaMsgHandler, { once: true });
  }

  // =========================================================================
  // 3. MENÚ INTERACTIVO: ANIMACIÓN DEL TREN Y MAPA DE LAS 3 ESTACIONES
  // =========================================================================

  renderStationMenu() {
    this.scrollToTop();
    const eq = learningCenterState.state.module1.equipaje;
    const s1Done = Boolean(eq?.station1?.completed);
    const s2Done = Boolean(eq?.station2?.completed);
    const s3Done = Boolean(eq?.station3?.completed);
    const allVisited = s1Done && s2Done && s3Done;
    const completedCount = [s1Done, s2Done, s3Done].filter(Boolean).length;

    this.containerEl.innerHTML = `
      <section class="lc-equipaje-root animate-fade-in" aria-labelledby="stations-menu-title">
        ${this.renderHeaderHtml('station_menu')}

        <div class="lc-module-header">
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.35rem;">
            <span>🚂</span>
            <span>RUTA EN TREN · CENTRO DE APRENDIZAJE TdeA</span>
          </div>
          <h2 id="stations-menu-title" class="lc-module-heading">Mapa Panorámico del Viaje en Tren</h2>
          <p class="lc-module-intro">
            Acompaña el viaje en tren por las tres estaciones y selecciona la estación activa para comenzar tus actividades.
          </p>
        </div>

        <!-- Escenario de Animación del Tren y las 3 Estaciones (Montado dinámicamente) -->
        <div id="train-interactive-scene-mount"></div>

        <!-- Botones de navegación inferior -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; flex-wrap: wrap; gap: 1rem;">
          <button type="button" class="lc-btn lc-btn-secondary" id="btn-back-to-intro-infographic">
            <span aria-hidden="true">←</span>
            <span>Volver a la Infografía Inicial</span>
          </button>

          ${allVisited ? `
            <button type="button" class="lc-btn lc-btn-primary animate-pulse" id="btn-goto-closing-direct" title="¡Todas las estaciones completadas! Ir al Cierre de Maleta" style="padding: 0.9rem 2.2rem; font-weight: 800; background: #00843D; box-shadow: 0 4px 16px rgba(0, 132, 61, 0.4);">
              <span>🎒 Ir al Cierre de Maleta</span>
              <span aria-hidden="true">→</span>
            </button>
          ` : `
            <button type="button" class="lc-btn lc-btn-secondary" id="btn-goto-closing-direct" disabled aria-disabled="true" title="Debes completar las 3 estaciones para habilitar el cierre de maleta" style="padding: 0.9rem 2rem; font-weight: 700; opacity: 0.6; cursor: not-allowed; background: #F1F5F9; color: #94A3B8; border: 1.5px solid #CBD5E1; box-shadow: none;">
              <span aria-hidden="true">🔒</span>
              <span>Cierre de Maleta (${completedCount}/3 completadas)</span>
            </button>
          `}
        </div>
      </section>
    `;

    this.bindCommonEvents();

    // Montar la animación interactiva del tren y el mapa de estaciones
    const mountEl = this.containerEl.querySelector('#train-interactive-scene-mount');
    if (mountEl) {
      const trainMap = new TrainMapAnimation({
        container: mountEl,
        currentStation: 1,
        autoStart: true,
        s1Done,
        s2Done,
        s3Done,
        isPlayingIntro: true,
        onSelectStation: (stNum) => {
          if (stNum === 1) this.render('station_1');
          else if (stNum === 2) this.render('station_2');
          else if (stNum === 3) this.render('station_3');
        },
        onResetJourney: () => {
          if (learningCenterState.state.module1?.equipaje) {
            learningCenterState.state.module1.equipaje.station1.completed = false;
            learningCenterState.state.module1.equipaje.station2.completed = false;
            learningCenterState.state.module1.equipaje.station3.completed = false;
            learningCenterState.saveToStorage();
          }
          this.render('station_menu');
        }
      });
      trainMap.render();
    }

    const btnBackIntro = this.containerEl.querySelector('#btn-back-to-intro-infographic');
    if (btnBackIntro) {
      btnBackIntro.addEventListener('click', () => this.render('intro_infographic'));
    }

    const btnClose = this.containerEl.querySelector('#btn-goto-closing-direct');
    if (btnClose) {
      if (allVisited) {
        btnClose.addEventListener('click', () => this.render('closing'));
      }
    }
  }

  // =========================================================================
  // 4. ESTACIÓN 1: CONOCER EL TERRENO (FLUJO HORIZONTAL PASO A PASO - DUA)
  // =========================================================================
  renderStation1(stepIndex) {
    this.scrollToTop();
    if (stepIndex !== undefined && stepIndex !== null) {
      this.st1Step = Number(stepIndex);
    }
    if (!this.st1Step || this.st1Step < 1 || this.st1Step > 6) {
      this.st1Step = 1;
    }

    const s1 = learningCenterState.state.module1.equipaje.station1;
    const areas = s1.selectedAreas || [];
    const weatherNotes = s1.weatherNotes || {};
    const compass = s1.compass || {};
    const current = this.st1Step;

    this.containerEl.innerHTML = `
      <section class="lc-equipaje-root animate-fade-in" aria-labelledby="st1-title">
        ${this.renderHeaderHtml('station_1')}

        <!-- Encabezado Estación 1 con Resultado de Aprendizaje y Pregunta Prominente -->
        <div class="lc-module-header">
          <div class="lc-station-num-badge" style="margin-bottom: 0.5rem;">ESTACIÓN 1</div>
          <h2 id="st1-title" class="lc-module-heading">Conocer el terreno</h2>

          <!-- Cuadro Destacado con Resultado de Aprendizaje y Pregunta Clave Requerida -->
          <div style="background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%); border: 2px solid #00843D; border-left: 6px solid #00843D; padding: 1.15rem 1.4rem; border-radius: 14px; margin: 1rem 0 1.25rem 0; box-shadow: 0 4px 14px rgba(0, 132, 61, 0.08);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
              <span style="font-size: 1.25rem;">🎯</span>
              <strong style="font-size: 1.05rem; color: #022B14; text-transform: uppercase; letter-spacing: 0.5px;">Resultado de aprendizaje:</strong>
            </div>
            <p style="margin: 0 0 0.85rem 0; font-size: 1.12rem; font-weight: 800; color: #005A29; line-height: 1.4;">
              Reconocer el estado actual del bienestar emocional.
            </p>
            <div style="border-top: 1.5px dashed #86EFAC; padding-top: 0.75rem;">
              <p style="margin: 0; font-size: 1.25rem; font-style: italic; color: #022B14; font-weight: 800; line-height: 1.4;">
                Pregunta: “Antes de iniciar cualquier viaje, lo primero es saber, ¿dónde estamos?”
              </p>
            </div>
          </div>
        </div>

        <!-- Contenedor del Flujo Horizontal Paso a Paso (Solo una actividad visible a la vez) -->
        <div class="horizontal-station-viewport">
          
          <!-- Indicador pedagógico de fase en Estación 1 -->
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.65rem; padding: 0 0.25rem;">
            <div style="font-size: 0.86rem; font-weight: 700; color: #475569; display: flex; align-items: center; gap: 0.4rem;">
              ${current <= 2 
                ? '<span>📍 <strong>Etapa 1:</strong> Diagnóstico inicial (Terreno & Clima)</span>' 
                : '<span>📘 <strong>Etapa 2:</strong> Microcurso 1: Autogestión del Aprendizaje (Video y Actividades de aplicación)</span>'}
            </div>
            <div style="font-size: 0.78rem; font-weight: 800; color: #005A29; background: #DCFCE7; border: 1px solid #86EFAC; padding: 0.2rem 0.65rem; border-radius: 999px;">
              ${current <= 2 ? 'Fase Preparatoria' : 'Microcurso 1 Activo'}
            </div>
          </div>

          <!-- Barra de navegación por pasos horizontales -->
          <div class="horizontal-station-stepper" role="navigation" aria-label="Progreso de actividades en Estación 1">
            <button type="button" class="h-step-item ${current === 1 ? 'is-current' : (current > 1 ? 'is-completed' : '')}" data-step-jump="1" title="Paso 1: Conocer el terreno y estados del bienestar">
              <span>${current > 1 ? '✓' : '1.'}</span>
              <span>🗺️ El Terreno</span>
            </button>
            <span class="h-step-sep">›</span>

            <button type="button" class="h-step-item ${current === 2 ? 'is-current' : (current > 2 ? 'is-completed' : '')}" data-step-jump="2" title="Paso 2: Actividad interactiva del clima emocional">
              <span>${current > 2 ? '✓' : '2.'}</span>
              <span>🌦️ Clima Emocional</span>
            </button>
            <span class="h-step-sep" style="font-weight: 800; color: #00843D;" title="Comienzo del Microcurso 1">┃</span>

            <button type="button" class="h-step-item ${current === 3 ? 'is-current' : (current > 3 ? 'is-completed' : '')}" data-step-jump="3" title="Microcurso 1: Cápsula introductoria">
              <span>${current > 3 ? '✓' : '3.'}</span>
              <span>🎬 Cápsula Intro</span>
            </button>
            <span class="h-step-sep">›</span>

            <button type="button" class="h-step-item ${current === 4 ? 'is-current' : (current > 4 ? 'is-completed' : '')}" data-step-jump="4" title="Microcurso 1: Actividad 8 Áreas de Cuidado">
              <span>${current > 4 ? '✓' : '4.'}</span>
              <span>🌿 8 Áreas</span>
            </button>
            <span class="h-step-sep">›</span>

            <button type="button" class="h-step-item ${current === 5 ? 'is-current' : (current > 5 ? 'is-completed' : '')}" data-step-jump="5" title="Microcurso 1: Actividad Brújula Emocional">
              <span>${current > 5 ? '✓' : '5.'}</span>
              <span>🧭 Brújula</span>
            </button>
            <span class="h-step-sep">›</span>

            <button type="button" class="h-step-item ${current === 6 ? 'is-current' : ''}" data-step-jump="6" title="Microcurso 1 & Estación 1: Logro y Maleta">
              <span>${current === 6 ? '🏆' : '6.'}</span>
              <span>🎒 Logro y Maleta</span>
            </button>
          </div>

          <!-- Slide Activo de la Actividad (La siguiente actividad aún no se ve) -->
          <div class="h-slide-content-card" id="st1-slide-container">
            ${this.renderStation1SlideContent(current, s1, areas, weatherNotes, compass)}
          </div>

        </div>

      </section>
    `;

    this.bindCommonEvents();
    this.bindStation1SlideEvents(current);
  }

  /**
   * Genera el contenido HTML exclusivo del paso horizontal activo en Estación 1
   */
  renderStation1SlideContent(current, s1, areas, weatherNotes, compass) {
    switch (current) {
      case 1:
        return `
          <!-- PASO 1: INFOGRAFÍA INTERACTIVA #2 - ESTADOS DEL BIENESTAR -->
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.85rem;">
            <span>PASO 1 DE 6</span> · <span>CONOCER EL TERRENO & ESTADOS DEL BIENESTAR</span>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <h3 style="font-size: 1.3rem; font-weight: 800; color: #005A29; margin: 0 0 0.35rem 0;">1. Punto de Partida: Estados del Bienestar</h3>
            <p style="margin: 0; color: #475569; font-size: 0.95rem; line-height: 1.6;">
              Explora la infografía a continuación para descubrir cómo se manifiestan los diferentes estados en tu recorrido universitario:
            </p>
          </div>

          <div class="lc-embed-card" style="box-shadow: none; border: 1.5px solid #CBD5E1;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.3rem;">📊</span>
                <strong style="color: #0F172A; font-size: 1.05rem;">Infografía Interactiva: Estados del Bienestar</strong>
              </div>
              <a href="https://canva.link/lt81pqp97922gff" target="_blank" rel="noopener noreferrer" class="lc-media-alt-btn">
                <span>↗ Pantalla completa Canva</span>
              </a>
            </div>

            <div class="lc-embed-frame-wrapper" style="margin-top: 0.85rem;">
              <iframe 
                loading="lazy" 
                src="https://www.canva.com/design/DAHXPsvwbyM/XHzx1CzRrJMqndVrbbjXFA/view?embed" 
                title="Infografía Interactiva 2 Campus Vital" 
                allowfullscreen="allowfullscreen" 
                allow="fullscreen"
              ></iframe>
            </div>
          </div>

          <!-- Barra de navegación del paso -->
          <div class="h-slide-actions-bar">
            <button type="button" class="lc-btn lc-btn-secondary" id="btn-st1-back-to-map">
              <span aria-hidden="true">←</span>
              <span>Volver al Mapa de Estaciones</span>
            </button>

            <button type="button" class="lc-btn lc-btn-primary" id="btn-st1-next" style="padding: 0.95rem 2.2rem; font-weight: 800;">
              <span>Continuar a: Tu Clima Emocional</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        `;

      case 2:
        return `
          <!-- PASO 2: ACTIVIDAD INTERACTIVA DEL CLIMA EMOCIONAL -->
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.85rem;">
            <span>PASO 2 DE 6</span> · <span>ACTIVIDAD: TU CLIMA EMOCIONAL</span>
          </div>

          <div class="lc-instruction-banner" style="margin-bottom: 1.25rem;">
            <div class="lc-banner-icon" aria-hidden="true">🌦️</div>
            <div class="lc-banner-text">
              <strong style="font-size: 1.05rem;">Actividad interactiva: Tu Clima Emocional</strong>
              <p style="margin: 0.25rem 0 0 0; line-height: 1.5;">
                Pon el cursor sobre cada estado climático o escribe en el cuadro de texto cómo se manifiesta en tu día a día:
              </p>
            </div>
          </div>

          <div class="lc-weather-grid">
            <!-- Soleado -->
            <div class="lc-weather-card" id="weather-card-soleado" tabindex="0">
              <div class="lc-weather-top">
                <span class="lc-weather-emoji">☀️</span>
                <div>
                  <h4 class="lc-weather-name">Soleado</h4>
                  <p class="lc-weather-desc">Calma, energía, claridad y motivación alta.</p>
                </div>
              </div>
              <textarea 
                class="lc-weather-input" 
                data-weather-key="soleado" 
                placeholder="¿Qué te hace sentir en día soleado hoy?"
                aria-label="Reflexión sobre estado Soleado"
              >${weatherNotes.soleado || ''}</textarea>
            </div>

            <!-- Nublado -->
            <div class="lc-weather-card" id="weather-card-nublado" tabindex="0">
              <div class="lc-weather-top">
                <span class="lc-weather-emoji">⛅</span>
                <div>
                  <h4 class="lc-weather-name">Nublado</h4>
                  <p class="lc-weather-desc">Dudas, cansancio leve, baja energía temporal.</p>
                </div>
              </div>
              <textarea 
                class="lc-weather-input" 
                data-weather-key="nublado" 
                placeholder="¿Qué situaciones te nublan el ánimo a veces?"
                aria-label="Reflexión sobre estado Nublado"
              >${weatherNotes.nublado || ''}</textarea>
            </div>

            <!-- Lluvioso -->
            <div class="lc-weather-card" id="weather-card-lluvioso" tabindex="0">
              <div class="lc-weather-top">
                <span class="lc-weather-emoji">🌧️</span>
                <div>
                  <h4 class="lc-weather-name">Lluvioso</h4>
                  <p class="lc-weather-desc">Tristeza, desánimo, necesidad de pausa y abrigo.</p>
                </div>
              </div>
              <textarea 
                class="lc-weather-input" 
                data-weather-key="lluvioso" 
                placeholder="¿Qué necesitas cuando llega un día lluvioso?"
                aria-label="Reflexión sobre estado Lluvioso"
              >${weatherNotes.lluvioso || ''}</textarea>
            </div>

            <!-- Tormenta -->
            <div class="lc-weather-card" id="weather-card-tormenta" tabindex="0">
              <div class="lc-weather-top">
                <span class="lc-weather-emoji">⛈️</span>
                <div>
                  <h4 class="lc-weather-name">Tormenta</h4>
                  <p class="lc-weather-desc">Sobrecarga, crisis, estrés agudo. Requiere parar y pedir ayuda.</p>
                </div>
              </div>
              <textarea 
                class="lc-weather-input" 
                data-weather-key="tormenta" 
                placeholder="¿Cómo reconoces cuando se avecina una tormenta?"
                aria-label="Reflexión sobre estado Tormenta"
              >${weatherNotes.tormenta || ''}</textarea>
            </div>
          </div>

          <!-- Barra de navegación del paso -->
          <div class="h-slide-actions-bar">
            <button type="button" class="lc-btn lc-btn-secondary" id="btn-st1-prev">
              <span aria-hidden="true">←</span>
              <span>Anterior: El Terreno</span>
            </button>

            <button type="button" class="lc-btn lc-btn-primary" id="btn-st1-next" style="padding: 0.95rem 2.2rem; font-weight: 800;">
              <span>Microcurso</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        `;

      case 3:
        return `
          <!-- PASO 3: MICROCURSO 1 - AUTOGESTIÓN DEL APRENDIZAJE · CÁPSULA INTRODUCTORIA -->
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.85rem;">
            <span>PASO 3 DE 6</span> · <span>MICROCURSO 1: AUTOGESTIÓN DEL APRENDIZAJE · CÁPSULA INTRODUCTORIA</span>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <h3 style="font-size: 1.3rem; font-weight: 800; color: #005A29; margin: 0 0 0.35rem 0;">Microcurso 1: Autogestión del Aprendizaje - Cápsula introductoria</h3>
            <p style="margin: 0; color: #475569; font-size: 0.95rem; line-height: 1.6;">
              Observa este video para dar inicio al microcurso y comprender cómo las distintas dimensiones de tu vida se entrelazan y apoyan tu bienestar y rendimiento académico.
            </p>
          </div>

          <div class="lc-embed-card" style="box-shadow: none; border: 1.5px solid #CBD5E1;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.85rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.3rem;">🎬</span>
                <strong style="color: #0F172A; font-size: 1.05rem;">Cápsula Introductoria: Las 8 Áreas de la Vida Universitaria</strong>
              </div>
              <button type="button" class="lc-media-alt-btn" id="btn-toggle-local-video-2">
                <span>📁 Cambiar a reproductor local (.mp4)</span>
              </button>
            </div>

            <div class="lc-embed-frame-wrapper" id="video-2-wrapper">
              <iframe 
                src="https://www.youtube-nocookie.com/embed/CiB8J2B2dUg?rel=0&modestbranding=1" 
                title="Microcurso 1: Cápsula introductoria" 
                allowfullscreen
              ></iframe>
            </div>
          </div>

          <!-- Barra de navegación del paso -->
          <div class="h-slide-actions-bar">
            <button type="button" class="lc-btn lc-btn-secondary" id="btn-st1-prev">
              <span aria-hidden="true">←</span>
              <span>Anterior: Clima Emocional</span>
            </button>

            <button type="button" class="lc-btn lc-btn-primary" id="btn-st1-next" style="padding: 0.95rem 2.2rem; font-weight: 800;">
              <span>Continuar Microcurso: 8 Áreas de Cuidado</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        `;

      case 4:
        return `
          <!-- PASO 4: ACTIVIDAD INTERACTIVA - 8 ÁREAS DE CUIDADO (MICROCURSO 1) -->
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.85rem;">
            <span>PASO 4 DE 6</span> · <span>MICROCURSO 1: AUTOGESTIÓN DEL APRENDIZAJE · ACTIVIDAD INTERACTIVA</span>
          </div>

          <div class="lc-instruction-banner" style="margin-bottom: 1.25rem;">
            <div class="lc-banner-icon" aria-hidden="true">🌿</div>
            <div class="lc-banner-text">
              <strong style="font-size: 1.05rem;">Microcurso 1 · Actividad interactiva: 8 Áreas de Cuidado</strong>
              <p style="margin: 0.25rem 0 0 0; line-height: 1.5;">
                Haz clic en las áreas que consideras prioritarias o que deseas fortalecer en tu vida universitaria:
              </p>
            </div>
          </div>

          <div class="lc-areas-grid">
            <button type="button" class="lc-area-btn ${areas.includes('sueno') ? 'is-selected' : ''}" data-area-id="sueno" aria-pressed="${areas.includes('sueno')}">
              <span class="lc-area-check-badge">${areas.includes('sueno') ? '✓' : ''}</span>
              <span class="lc-area-icon">🌙</span>
              <span class="lc-area-label">Sueño</span>
            </button>

            <button type="button" class="lc-area-btn ${areas.includes('relaciones') ? 'is-selected' : ''}" data-area-id="relaciones" aria-pressed="${areas.includes('relaciones')}">
              <span class="lc-area-check-badge">${areas.includes('relaciones') ? '✓' : ''}</span>
              <span class="lc-area-icon">👥</span>
              <span class="lc-area-label">Relaciones</span>
            </button>

            <button type="button" class="lc-area-btn ${areas.includes('tiempo_libre') ? 'is-selected' : ''}" data-area-id="tiempo_libre" aria-pressed="${areas.includes('tiempo_libre')}">
              <span class="lc-area-check-badge">${areas.includes('tiempo_libre') ? '✓' : ''}</span>
              <span class="lc-area-icon">🎨</span>
              <span class="lc-area-label">Tiempo libre</span>
            </button>

            <button type="button" class="lc-area-btn ${areas.includes('organizacion') ? 'is-selected' : ''}" data-area-id="organizacion" aria-pressed="${areas.includes('organizacion')}">
              <span class="lc-area-check-badge">${areas.includes('organizacion') ? '✓' : ''}</span>
              <span class="lc-area-icon">📅</span>
              <span class="lc-area-label">Organización</span>
            </button>

            <button type="button" class="lc-area-btn ${areas.includes('alimentacion') ? 'is-selected' : ''}" data-area-id="alimentacion" aria-pressed="${areas.includes('alimentacion')}">
              <span class="lc-area-check-badge">${areas.includes('alimentacion') ? '✓' : ''}</span>
              <span class="lc-area-icon">🥗</span>
              <span class="lc-area-label">Alimentación</span>
            </button>

            <button type="button" class="lc-area-btn ${areas.includes('emocional') ? 'is-selected' : ''}" data-area-id="emocional" aria-pressed="${areas.includes('emocional')}">
              <span class="lc-area-check-badge">${areas.includes('emocional') ? '✓' : ''}</span>
              <span class="lc-area-icon">💚</span>
              <span class="lc-area-label">Estado emocional</span>
            </button>

            <button type="button" class="lc-area-btn ${areas.includes('economia') ? 'is-selected' : ''}" data-area-id="economia" aria-pressed="${areas.includes('economia')}">
              <span class="lc-area-check-badge">${areas.includes('economia') ? '✓' : ''}</span>
              <span class="lc-area-icon">💰</span>
              <span class="lc-area-label">Economía</span>
            </button>

            <button type="button" class="lc-area-btn ${areas.includes('actividad_fisica') ? 'is-selected' : ''}" data-area-id="actividad_fisica" aria-pressed="${areas.includes('actividad_fisica')}">
              <span class="lc-area-check-badge">${areas.includes('actividad_fisica') ? '✓' : ''}</span>
              <span class="lc-area-icon">🏃</span>
              <span class="lc-area-label">Actividad física</span>
            </button>
          </div>

          <!-- Espacio para escribir reflexión requerido por el guion -->
          <div class="lc-textarea-container-full" style="margin-top: 1.5rem;">
            <label for="input-areas-reflection" style="font-weight: 800; color: #0F172A; font-size: 1.05rem; display: block; margin-bottom: 0.5rem;">
              ¿Qué me ha ayudado en el camino para darle atención y cuidado a estas áreas de mi vida?
            </label>
            <textarea 
              id="input-areas-reflection" 
              class="lc-textarea-spacious" 
              placeholder="Escribe aquí tu experiencia, estrategias o lo que desees fortalecer..."
              rows="4"
            >${s1.areasReflection || ''}</textarea>
          </div>

          <!-- Barra de navegación del paso -->
          <div class="h-slide-actions-bar">
            <button type="button" class="lc-btn lc-btn-secondary" id="btn-st1-prev">
              <span aria-hidden="true">←</span>
              <span>Anterior: Cápsula del Microcurso</span>
            </button>

            <button type="button" class="lc-btn lc-btn-primary" id="btn-st1-next" style="padding: 0.95rem 2.2rem; font-weight: 800;">
              <span>Continuar Microcurso: Brújula Emocional</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        `;

      case 5:
        return `
          <!-- PASO 5: BRÚJULA EMOCIONAL (MICROCURSO 1) -->
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.85rem;">
            <span>PASO 5 DE 6</span> · <span>MICROCURSO 1: AUTOGESTIÓN DEL APRENDIZAJE · BRÚJULA EMOCIONAL</span>
          </div>

          <div class="lc-instruction-banner" style="margin-bottom: 1.25rem;">
            <div class="lc-banner-icon" aria-hidden="true">🧭</div>
            <div class="lc-banner-text">
              <strong style="font-size: 1.05rem;">Microcurso 1 · Brújula Emocional: Orientación para tu viaje</strong>
              <p style="margin: 0.25rem 0 0 0; line-height: 1.5;">
                Responde a estas tres preguntas clave para calibrar tu orientación y recursos internos:
              </p>
            </div>
          </div>

          <div class="lc-compass-body">
            <div class="lc-compass-visual-col">
              <div class="lc-compass-interactive-frame-wrap" id="compass-interactive-wrapper">
                <iframe
                  id="compass-interactive-iframe"
                  src="brujula.html?v=20261101_13"
                  class="lc-compass-iframe"
                  
                  loading="eager"
                  scrolling="no"
                  frameborder="0"
                  allowtransparency="true"
                  style="background: transparent;"
                ></iframe>
              </div>
            </div>
            <div class="lc-compass-form">
              <div class="lc-compass-form-header">
                <span class="lc-compass-form-kicker">Bitácora de Orientación Interior</span>
                <p class="lc-compass-form-desc">
                  Al completar cada pregunta, tu brújula se calibra para guiarte en el semestre:
                </p>
              </div>

              <div class="lc-compass-field-row ${compass.feeling ? 'is-completed' : ''}" id="row-compass-feeling">
                <label for="input-compass-feeling" class="lc-compass-field-label">
                  <span class="lc-compass-label-left">
                    <span>💭</span>
                    <span>1. ¿Cómo me siento hoy?</span>
                  </span>
                  <span class="lc-compass-status-dot" id="dot-compass-feeling">${compass.feeling ? '✓ Reconocido' : ''}</span>
                </label>
                <textarea id="input-compass-feeling" class="lc-weather-input" rows="2" placeholder="Reconoce tu emoción principal en este momento...">${compass.feeling || ''}</textarea>
              </div>

              <div class="lc-compass-field-row ${compass.need ? 'is-completed' : ''}" id="row-compass-need">
                <label for="input-compass-need" class="lc-compass-field-label">
                  <span class="lc-compass-label-left">
                    <span>🌱</span>
                    <span>2. ¿Qué necesito?</span>
                  </span>
                  <span class="lc-compass-status-dot" id="dot-compass-need">${compass.need ? '✓ Definido' : ''}</span>
                </label>
                <textarea id="input-compass-need" class="lc-weather-input" rows="2" placeholder="¿Pausa, organización, apoyo, descanso, hablar con alguien?...">${compass.need || ''}</textarea>
              </div>

              <div class="lc-compass-field-row ${compass.strengths ? 'is-completed' : ''}" id="row-compass-strengths">
                <label for="input-compass-strengths" class="lc-compass-field-label">
                  <span class="lc-compass-label-left">
                    <span>💪</span>
                    <span>3. ¿Qué fortalezas tengo?</span>
                  </span>
                  <span class="lc-compass-status-dot" id="dot-compass-strengths">${compass.strengths ? '✓ Activado' : ''}</span>
                </label>
                <textarea id="input-compass-strengths" class="lc-weather-input" rows="2" placeholder="Mis recursos personales, constancia, curiosidad, resiliencia...">${compass.strengths || ''}</textarea>
              </div>
            </div>
          </div>

          <!-- Barra de navegación del paso -->
          <div class="h-slide-actions-bar">
            <button type="button" class="lc-btn lc-btn-secondary" id="btn-st1-prev">
              <span aria-hidden="true">←</span>
              <span>Anterior: 8 Áreas de Cuidado</span>
            </button>

            <button type="button" class="lc-btn lc-btn-primary" id="btn-st1-next" style="padding: 0.95rem 2.2rem; font-weight: 800;">
              <span>Completar Microcurso y Guardar Logro</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        `;

      case 6:
      default:
        return `
          <!-- PASO 6: HERRAMIENTA OBTENIDA - BRÚJULA EN LA MALETA (ANIMACIÓN CANVA) -->
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.85rem;">
            <span>PASO 6 DE 6</span> · <span>MICROCURSO 1 & ESTACIÓN 1 · HERRAMIENTA OBTENIDA & LOGRO</span>
          </div>

          <div style="background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%); border: 2px solid #00843D; border-radius: 18px; padding: 1.25rem 1.6rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 1rem; box-shadow: 0 4px 14px rgba(0, 132, 61, 0.08);">
            <span style="font-size: 2.75rem;">🎒</span>
            <div>
              <h3 style="margin: 0; font-size: 1.3rem; color: #022B14; font-weight: 800;">¡Has completado el Microcurso 1 y obtenido la Brújula Emocional!</h3>
              <p style="margin: 0.35rem 0 0 0; color: #005A29; font-size: 0.98rem; line-height: 1.5;">
                Esta herramienta queda guardada en tu maleta universitaria para orientarte, reconocer tu clima interno y cuidar tu bienestar durante toda la carrera.
              </p>
            </div>
          </div>

          <!-- Animación Oficial de Canva (Producto 06) -->
          <div class="lc-embed-card" style="box-shadow: none; border: 2px solid #86EFAC; margin-top: 1rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.4rem;">✨</span>
                <strong style="color: #022B14; font-size: 1.05rem;">Animación: La brújula queda guardada en la maleta</strong>
              </div>
              <a href="https://canva.link/0jj1kg1topw2j4t" target="_blank" rel="noopener noreferrer" class="lc-media-alt-btn">
                <span>↗ Pantalla completa Canva</span>
              </a>
            </div>

            <div class="lc-embed-frame-wrapper" style="margin-top: 0.85rem;">
              <iframe 
                loading="lazy" 
                src="https://www.canva.com/design/DAHXVxX-AEc/fqKBdqAooQAuPYKA4AWZ7A/view?embed" 
                title="Herramienta obtenida: Brújula emocional"
                allowfullscreen="allowfullscreen" 
                allow="fullscreen"
              ></iframe>
            </div>
          </div>

          <!-- Botón de Cierre de Estación 1: Vuelve a la animación del mapa con las 3 estaciones -->
          <div class="h-slide-actions-bar" style="justify-content: space-between;">
            <button type="button" class="lc-btn lc-btn-secondary" id="btn-st1-prev">
              <span aria-hidden="true">←</span>
              <span>Anterior: Brújula</span>
            </button>

            <button type="button" class="lc-btn lc-btn-primary" id="btn-st1-finish-and-return" style="padding: 1.15rem 2.6rem; font-size: 1.15rem; font-weight: 800; box-shadow: 0 8px 24px rgba(0, 132, 61, 0.35);">
              <span>🎒 Guardar en la Maleta y Volver al Mapa de Estaciones</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        `;
    }
  }

  /**
   * Conecta los eventos interactivos específicos del paso horizontal activo en Estación 1
   */
  bindStation1SlideEvents(current) {
    // 1. Navegación directa en el stepper horizontal
    const jumpBtns = this.containerEl.querySelectorAll('[data-step-jump]');
    jumpBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetStep = Number(btn.getAttribute('data-step-jump'));
        // Permitir saltar a pasos ya alcanzados o al siguiente paso inmediato
        if (targetStep <= this.st1Step || targetStep === current + 1) {
          this.renderStation1(targetStep);
        }
      });
    });

    // 2. Botón Volver al mapa desde el paso 1
    const btnBackMap = this.containerEl.querySelector('#btn-st1-back-to-map');
    if (btnBackMap) {
      btnBackMap.addEventListener('click', () => {
        this.render('station_menu');
      });
    }

    // 3. Botón Anterior genérico
    const btnPrev = this.containerEl.querySelector('#btn-st1-prev');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (this.st1Step > 1) {
          this.renderStation1(this.st1Step - 1);
        }
      });
    }

    // 4. Botón Siguiente genérico
    const btnNext = this.containerEl.querySelector('#btn-st1-next');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (this.st1Step < 6) {
          this.renderStation1(this.st1Step + 1);
        }
      });
    }

    // 5. Botón Final del Paso 6: Guardar y Volver a la animación de las 3 estaciones
    const btnFinish = this.containerEl.querySelector('#btn-st1-finish-and-return');
    if (btnFinish) {
      btnFinish.addEventListener('click', () => {
        learningCenterState.completeStation1();
        this.st1Step = 1;
        this.render('station_menu');
      });
    }

    // 6. Eventos específicos de cada paso
    if (current === 2) {
      // Notas del Clima Emocional
      const weatherInputs = this.containerEl.querySelectorAll('.lc-weather-input[data-weather-key]');
      weatherInputs.forEach(input => {
        input.addEventListener('input', () => {
          const key = input.getAttribute('data-weather-key');
          learningCenterState.setStation1WeatherNote(key, input.value);
        });
      });
    } else if (current === 3) {
      // Toggle local video 2
      const btnLocalVid2 = this.containerEl.querySelector('#btn-toggle-local-video-2');
      if (btnLocalVid2) {
        let isLocal = false;
        btnLocalVid2.addEventListener('click', () => {
          const wrap = this.containerEl.querySelector('#video-2-wrapper');
          if (!wrap) return;
          isLocal = !isLocal;
          if (isLocal) {
            wrap.innerHTML = `
              <video controls autoplay style="position: absolute; top:0; left:0; width:100%; height:100%;">
                <source src="assets/campusVital/Módulo 1/Producto 05 - Video #2/5. Video #2.mp4" type="video/mp4">
                Tu navegador no soporta video local HTML5.
              </video>
            `;
            btnLocalVid2.innerHTML = `<span>🌐 Cambiar a YouTube</span>`;
          } else {
            wrap.innerHTML = `
              <iframe 
                src="https://www.youtube-nocookie.com/embed/CiB8J2B2dUg?rel=0&modestbranding=1&autoplay=1" 
                title="Video 2 Campus Vital TdeA" 
                allowfullscreen
              ></iframe>
            `;
            btnLocalVid2.innerHTML = `<span>📁 Cambiar a reproductor local (.mp4)</span>`;
          }
        });
      }
    } else if (current === 4) {
      // Selección de 8 Áreas
      const areaBtns = this.containerEl.querySelectorAll('.lc-area-btn');
      areaBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const areaId = btn.getAttribute('data-area-id');
          learningCenterState.toggleStation1Area(areaId);
          
          const isSelected = btn.classList.toggle('is-selected');
          btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
          const badge = btn.querySelector('.lc-area-check-badge');
          if (badge) badge.textContent = isSelected ? '✓' : '';
        });
      });

      const inputAreasRef = this.containerEl.querySelector('#input-areas-reflection');
      if (inputAreasRef) {
        inputAreasRef.addEventListener('input', () => {
          learningCenterState.setStation1AreasReflection(inputAreasRef.value);
        });
      }
    } else if (current === 5) {
      // Preguntas de la Brújula Emocional con Calibración Interactiva
      const inputFeel = this.containerEl.querySelector('#input-compass-feeling');
      const inputNeed = this.containerEl.querySelector('#input-compass-need');
      const inputStrength = this.containerEl.querySelector('#input-compass-strengths');
      const compassIframe = this.containerEl.querySelector('#compass-interactive-iframe');
      const btnCalibrate = this.containerEl.querySelector('#btn-compass-calibrate-trigger');

      const triggerCalibrate = () => {
        try {
          if (compassIframe && compassIframe.contentWindow) {
            compassIframe.contentWindow.postMessage('calibrate', '*');
          }
        } catch (e) {
          // ignore
        }
      };

      const triggerPulse = () => {
        try {
          if (compassIframe && compassIframe.contentWindow) {
            compassIframe.contentWindow.postMessage('pulse', '*');
          }
        } catch (e) {
          // ignore
        }
      };

      if (btnCalibrate) {
        btnCalibrate.addEventListener('click', triggerCalibrate);
      }

      if (inputFeel) {
        inputFeel.addEventListener('input', () => {
          learningCenterState.setStation1Compass('feeling', inputFeel.value);
          const row = this.containerEl.querySelector('#row-compass-feeling');
          const dot = this.containerEl.querySelector('#dot-compass-feeling');
          if (row && dot) {
            const hasVal = inputFeel.value.trim().length > 0;
            row.classList.toggle('is-completed', hasVal);
            dot.textContent = hasVal ? '✓ Reconocido' : '';
          }
          triggerPulse();
        });
      }

      if (inputNeed) {
        inputNeed.addEventListener('input', () => {
          learningCenterState.setStation1Compass('need', inputNeed.value);
          const row = this.containerEl.querySelector('#row-compass-need');
          const dot = this.containerEl.querySelector('#dot-compass-need');
          if (row && dot) {
            const hasVal = inputNeed.value.trim().length > 0;
            row.classList.toggle('is-completed', hasVal);
            dot.textContent = hasVal ? '✓ Definido' : '';
          }
          triggerPulse();
        });
      }

      if (inputStrength) {
        inputStrength.addEventListener('input', () => {
          learningCenterState.setStation1Compass('strengths', inputStrength.value);
          const row = this.containerEl.querySelector('#row-compass-strengths');
          const dot = this.containerEl.querySelector('#dot-compass-strengths');
          if (row && dot) {
            const hasVal = inputStrength.value.trim().length > 0;
            row.classList.toggle('is-completed', hasVal);
            dot.textContent = hasVal ? '✓ Activado' : '';
          }
          triggerPulse();
        });
      }
    }
  }

  // =========================================================================
  // 5. ESTACIÓN 2: CUANDO EL CAMINO CAMBIA (FLUJO HORIZONTAL PASO A PASO DUA)
  // =========================================================================
  // 5. ESTACIÓN 2: CUANDO EL CAMINO CAMBIA (FLUJO HORIZONTAL PASO A PASO DUA)
  // =========================================================================
  renderStation2(stepIndex) {
    this.scrollToTop();
    if (stepIndex !== undefined && stepIndex !== null) {
      this.st2Step = Number(stepIndex);
    }
    if (!this.st2Step || this.st2Step < 1 || this.st2Step > 4) {
      this.st2Step = 1;
    }

    const s2 = learningCenterState.state.module1.equipaje.station2;
    const selectedTools = s2.selectedJuanTools || [];
    const current = this.st2Step;

    this.containerEl.innerHTML = `
      <section class="lc-equipaje-root animate-fade-in" aria-labelledby="st2-title">
        ${this.renderHeaderHtml('station_2')}

        <!-- Encabezado Estación 2 con Resultado de Aprendizaje y Frase Clave -->
        <div class="lc-module-header">
          <div class="lc-station-num-badge" style="margin-bottom: 0.5rem;">ESTACIÓN 2</div>
          <h2 id="st2-title" class="lc-module-heading">Cuando el camino cambia</h2>

          <div style="background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%); border: 2px solid #00843D; border-left: 6px solid #00843D; padding: 1.15rem 1.4rem; border-radius: 14px; margin: 1rem 0 1.25rem 0; box-shadow: 0 4px 14px rgba(0, 132, 61, 0.08);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
              <span style="font-size: 1.25rem;">🎯</span>
              <strong style="font-size: 1.05rem; color: #022B14; text-transform: uppercase; letter-spacing: 0.5px;">Resultado de aprendizaje:</strong>
            </div>
            <p style="margin: 0 0 0.85rem 0; font-size: 1.12rem; font-weight: 800; color: #005A29; line-height: 1.4;">
              Comprender que equivocarse hace parte del aprendizaje universitario.
            </p>
            <div style="border-top: 1.5px dashed #86EFAC; padding-top: 0.75rem;">
              <p style="margin: 0; font-size: 1.25rem; font-style: italic; color: #022B14; font-weight: 800; line-height: 1.4;">
                “En todos los viajes aparecen desvíos. Un desvío no significa que el viaje terminó”.
              </p>
            </div>
          </div>
        </div>

        <!-- Contenedor del Flujo Horizontal Paso a Paso (Solo una actividad visible a la vez) -->
        <div class="horizontal-station-viewport">
          
          <!-- Barra de navegación por pasos horizontales -->
          <div class="horizontal-station-stepper" role="navigation" aria-label="Progreso de actividades en Estación 2">
            <button type="button" class="h-step-item ${current === 1 ? 'is-current' : (current > 1 ? 'is-completed' : '')}" data-step-jump="1">
              <span>${current > 1 ? '✓' : '1.'}</span>
              <span>📖 El caso de Juan</span>
            </button>
            <span class="h-step-sep">›</span>

            <button type="button" class="h-step-item ${current === 2 ? 'is-current' : (current > 2 ? 'is-completed' : '')}" data-step-jump="2">
              <span>${current > 2 ? '✓' : '2.'}</span>
              <span>🧰 Herramientas</span>
            </button>
            <span class="h-step-sep">›</span>

            <button type="button" class="h-step-item ${current === 3 ? 'is-current' : (current > 3 ? 'is-completed' : '')}" data-step-jump="3">
              <span>${current > 3 ? '✓' : '3.'}</span>
              <span>🎧 Microcurso 2</span>
            </button>
            <span class="h-step-sep">›</span>

            <button type="button" class="h-step-item ${current === 4 ? 'is-current' : ''}" data-step-jump="4">
              <span>${current === 4 ? '🏆' : '4.'}</span>
              <span>🗺️ Mapa de Rutas y Logro</span>
            </button>
          </div>

          <!-- Slide Activo de la Actividad -->
          <div class="h-slide-content-card" id="st2-slide-container">
            ${this.renderStation2SlideContent(current, s2, selectedTools)}
          </div>

        </div>

      </section>
    `;

    this.bindCommonEvents();
    this.bindStation2SlideEvents(current);
  }

  /**
   * Genera el contenido HTML exclusivo del paso horizontal activo en Estación 2
   */
  renderStation2SlideContent(current, s2, selectedTools) {
    switch (current) {
      case 1:
        return `
          <!-- PASO 1: HISTORIA ILUSTRATIVA - EL CASO DE JUAN (CANVA EMBED) -->
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.85rem;">
            <span>PASO 1 DE 4</span> · <span>HISTORIA ILUSTRATIVA · EL CASO DE JUAN</span>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <h3 style="font-size: 1.3rem; font-weight: 800; color: #005A29; margin: 0 0 0.35rem 0;">1. Caso de Estudio: El desvío de Juan</h3>
            <p style="margin: 0; color: #475569; font-size: 0.95rem; line-height: 1.6;">
              Lee con atención la situación que atraviesa Juan al recibir los primeros resultados de su semestre. Observa cómo un desvío académico puede generar frustración, pero también convertirse en una oportunidad para activar nuevos recursos:
            </p>
          </div>

          <div class="lc-embed-card" style="box-shadow: none; border: 1.5px solid #CBD5E1;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.3rem;">📖</span>
                <strong style="color: #0F172A; font-size: 1.05rem;">Historia Ilustrativa: El caso de Juan</strong>
              </div>
              <a href="https://canva.link/s0wscnmyo9arz5c" target="_blank" rel="noopener noreferrer" class="lc-media-alt-btn">
                <span>↗ Pantalla completa Canva</span>
              </a>
            </div>

            <div class="lc-embed-frame-wrapper" style="margin-top: 0.85rem;">
              <iframe 
                loading="lazy" 
                src="https://www.canva.com/design/DAHXQm8mmwg/Q-aNn7-VcEGVNmh2cgF1HQ/view?embed" 
                title="Historia de Juan Infografía 3" 
                allowfullscreen="allowfullscreen" 
                allow="fullscreen"
              ></iframe>
            </div>
          </div>

          <div class="h-slide-actions-bar">
            <button type="button" class="lc-btn lc-btn-secondary" id="btn-st2-back-to-map">
              <span aria-hidden="true">←</span>
              <span>Volver al Mapa de Estaciones</span>
            </button>

            <button type="button" class="lc-btn lc-btn-primary" id="btn-st2-next" style="padding: 0.95rem 2.2rem; font-weight: 800;">
              <span>Continuar a: Herramientas para Juan</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        `;

      case 2:
        return `
          <!-- PASO 2: DINÁMICA INTERACTIVA - HERRAMIENTAS PARA JUAN -->
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.85rem;">
            <span>PASO 2 DE 4</span> · <span>DINÁMICA INTERACTIVA · HERRAMIENTAS DE AFRONTAMIENTO</span>
          </div>

          <div class="lc-instruction-banner" style="margin-bottom: 1.25rem;">
            <div class="lc-banner-icon" aria-hidden="true">🧰</div>
            <div class="lc-banner-text">
              <strong style="font-size: 1.1rem; color: #005A29;">Elige las herramientas para ayudar a Juan</strong>
              <p style="margin: 0.25rem 0 0 0; line-height: 1.5;">
                Haz clic en el botón <strong>«+»</strong> de cada herramienta para sumarla a la maleta de Juan frente a este reto. Puedes seleccionar todas las que consideres pertinentes:
              </p>
            </div>
          </div>

          <div class="lc-juan-tools-grid">
            <div class="lc-juan-tool-card ${selectedTools.includes('respirar') ? 'is-active' : ''}" id="tool-card-respirar">
              <div class="lc-juan-tool-top">
                <span style="font-size: 1.6rem;">🫁</span>
                <button type="button" class="lc-btn-tool-plus ${selectedTools.includes('respirar') ? 'is-added' : ''}" data-tool-key="respirar" aria-label="Agregar: Pausar y respirar">
                  ${selectedTools.includes('respirar') ? '✓' : '+'}
                </button>
              </div>
              <strong style="font-size: 1rem; color: #0F172A;">Pausar y respirar conscientemente</strong>
              <p style="font-size: 0.88rem; color: #64748B; margin: 0; line-height: 1.4;">
                Permite calmar la reactividad biológica del estrés y aclarar la mente antes de tomar decisiones precipitadas.
              </p>
            </div>

            <div class="lc-juan-tool-card ${selectedTools.includes('analizar_error') ? 'is-active' : ''}" id="tool-card-analizar_error">
              <div class="lc-juan-tool-top">
                <span style="font-size: 1.6rem;">🔍</span>
                <button type="button" class="lc-btn-tool-plus ${selectedTools.includes('analizar_error') ? 'is-added' : ''}" data-tool-key="analizar_error" aria-label="Agregar: Analizar el error sin juzgar">
                  ${selectedTools.includes('analizar_error') ? '✓' : '+'}
                </button>
              </div>
              <strong style="font-size: 1rem; color: #0F172A;">Revisar el error sin juzgarse</strong>
              <p style="font-size: 0.88rem; color: #64748B; margin: 0; line-height: 1.4;">
                Ver una mala nota como información valiosa sobre qué temas repasar, no como una etiqueta de capacidad.
              </p>
            </div>

            <div class="lc-juan-tool-card ${selectedTools.includes('asesoria_tdea') ? 'is-active' : ''}" id="tool-card-asesoria_tdea">
              <div class="lc-juan-tool-top">
                <span style="font-size: 1.6rem;">👨‍🏫</span>
                <button type="button" class="lc-btn-tool-plus ${selectedTools.includes('asesoria_tdea') ? 'is-added' : ''}" data-tool-key="asesoria_tdea" aria-label="Agregar: Asesoría docente Ciencias Básicas">
                  ${selectedTools.includes('asesoria_tdea') ? '✓' : '+'}
                </button>
              </div>
              <strong style="font-size: 1rem; color: #0F172A;">Agendar Asesoría en Ciencias Básicas</strong>
              <p style="font-size: 0.88rem; color: #64748B; margin: 0; line-height: 1.4;">
                Aprovechar las salas de Teams del portal institucional para resolver dudas con docentes y monitores.
              </p>
            </div>

            <div class="lc-juan-tool-card ${selectedTools.includes('red_amigos') ? 'is-active' : ''}" id="tool-card-red_amigos">
              <div class="lc-juan-tool-top">
                <span style="font-size: 1.6rem;">👥</span>
                <button type="button" class="lc-btn-tool-plus ${selectedTools.includes('red_amigos') ? 'is-added' : ''}" data-tool-key="red_amigos" aria-label="Agregar: Estudiar con compañeros">
                  ${selectedTools.includes('red_amigos') ? '✓' : '+'}
                </button>
              </div>
              <strong style="font-size: 1rem; color: #0F172A;">Estudiar con compañeros</strong>
              <p style="font-size: 0.88rem; color: #64748B; margin: 0; line-height: 1.4;">
                Compartir dudas y explicar conceptos en grupo aligera la carga y fomenta el aprendizaje colaborativo.
              </p>
            </div>

            <div class="lc-juan-tool-card ${selectedTools.includes('metas_cortas') ? 'is-active' : ''}" id="tool-card-metas_cortas">
              <div class="lc-juan-tool-top">
                <span style="font-size: 1.6rem;">🎯</span>
                <button type="button" class="lc-btn-tool-plus ${selectedTools.includes('metas_cortas') ? 'is-added' : ''}" data-tool-key="metas_cortas" aria-label="Agregar: Metas pequeñas">
                  ${selectedTools.includes('metas_cortas') ? '✓' : '+'}
                </button>
              </div>
              <strong style="font-size: 1rem; color: #0F172A;">Dividir en metas pequeñas</strong>
              <p style="font-size: 0.88rem; color: #64748B; margin: 0; line-height: 1.4;">
                Evitar el agobio organizando el estudio en bloques de 25 minutos con descansos planificados.
              </p>
            </div>

            <div class="lc-juan-tool-card ${selectedTools.includes('autocompasion') ? 'is-active' : ''}" id="tool-card-autocompasion">
              <div class="lc-juan-tool-top">
                <span style="font-size: 1.6rem;">💚</span>
                <button type="button" class="lc-btn-tool-plus ${selectedTools.includes('autocompasion') ? 'is-added' : ''}" data-tool-key="autocompasion" aria-label="Agregar: Autocompasión">
                  ${selectedTools.includes('autocompasion') ? '✓' : '+'}
                </button>
              </div>
              <strong style="font-size: 1rem; color: #0F172A;">Practicar la autocompasión</strong>
              <p style="font-size: 0.88rem; color: #64748B; margin: 0; line-height: 1.4;">
                Tratarte con la misma amabilidad y comprensión con la que tratarías a tu mejor amigo.
              </p>
            </div>
          </div>

          <div class="h-slide-actions-bar">
            <button type="button" class="lc-btn lc-btn-secondary" id="btn-st2-prev">
              <span aria-hidden="true">←</span>
              <span>Anterior: Caso de Juan</span>
            </button>

            <button type="button" class="lc-btn lc-btn-primary" id="btn-st2-next" style="padding: 0.95rem 2.2rem; font-weight: 800;">
              <span>Microcurso 2</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        `;

      case 3:
        return `
          <!-- PASO 3: MICROCURSO 2: AUTOGESTIÓN DEL APRENDIZAJE - PODCAST -->
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.85rem;">
            <span>PASO 3 DE 4</span> · <span>MICROCURSO 2: AUTOGESTIÓN DEL APRENDIZAJE · PODCAST</span>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <h3 style="font-size: 1.35rem; font-weight: 800; color: #005A29; margin: 0 0 0.35rem 0;">
              Microcurso 2: Autogestión del Aprendizaje - Podcast
            </h3>
            <p style="margin: 0; color: #475569; font-size: 0.95rem; line-height: 1.6;">
              Escucha este podcast reflexivo sobre la resignificación de dificultades, el afrontamiento de retos académicos y las estrategias de autogestión:
            </p>
          </div>

          <div class="lc-dua-audio-card" role="region" aria-label="Microcurso 2: Podcast de superación de dificultades">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.4rem;">🎧</span>
                <strong style="color: #0F172A; font-size: 1.05rem;">🎧 Microcurso 2 · Podcast: Superar desvíos en la universidad</strong>
              </div>
              <span style="font-size: 0.78rem; font-weight: 800; background: #E8F5E9; padding: 0.2rem 0.55rem; border-radius: 6px; color: #005A29;">
                PODCAST CAMPUS VITAL
              </span>
            </div>

            <audio id="podcast-st2-audio" preload="metadata" src="assets/campusVital/audio/podcast_estacion2.mp3"></audio>

            <div class="lc-audio-controls-row">
              <button type="button" class="lc-btn-audio-play" id="btn-podcast-play" aria-label="Reproducir podcast">
                <span id="podcast-play-icon">▶</span>
              </button>

              <div class="lc-audio-time-track">
                <input type="range" class="lc-audio-scrubber" id="podcast-scrubber" min="0" max="100" value="0" aria-label="Progreso del podcast">
                <div class="lc-audio-times">
                  <span id="podcast-current-time">00:00</span>
                  <span id="podcast-total-time">--:--</span>
                </div>
              </div>

              <div class="lc-audio-tools-col">
                <button type="button" class="lc-audio-speed-btn" id="btn-podcast-speed" title="Ajustar velocidad">1.0x</button>
                <button type="button" class="lc-media-alt-btn" id="btn-podcast-transcript-toggle">
                  <span>📝 Transcripción</span>
                </button>
              </div>
            </div>

            <div id="podcast-transcript-content" class="lc-transcript-box" style="display: none;">
              <strong>Transcripción del Podcast:</strong>
              <p style="margin: 0.4rem 0 0 0;">
                En este episodio dialogamos sobre cómo resignificar los tropiezos académicos. Cuando nos enfrentamos a un examen difícil o sentimos que el ritmo es abrumador, la clave no está en abandonar, sino en aprender a activar apoyos tempranos, recalibrar metas y recordar que el aprendizaje es un proceso no lineal.
              </p>
            </div>

            <!-- Pregunta interactiva debajo del podcast -->
            <div class="lc-textarea-container-full" style="margin-top: 1rem; border-top: 1.5px solid #E2E8F0; padding-top: 1.25rem;">
              <label for="input-podcast-reflection" style="font-weight: 800; color: #0F172A; font-size: 1.05rem;">
                ¿Qué aprendizaje te ha dejado una dificultad que has superado hasta ahora?
              </label>
              <textarea 
                id="input-podcast-reflection" 
                class="lc-textarea-spacious" 
                rows="3" 
                placeholder="Reflexiona sobre un reto del pasado que lograste sortear y qué fortaleza descubriste en ti..."
              >${s2.podcastReflection || ''}</textarea>
            </div>
          </div>

          <div class="h-slide-actions-bar">
            <button type="button" class="lc-btn lc-btn-secondary" id="btn-st2-prev">
              <span aria-hidden="true">←</span>
              <span>Anterior: Herramientas de Juan</span>
            </button>

            <button type="button" class="lc-btn lc-btn-primary" id="btn-st2-next" style="padding: 0.95rem 2.2rem; font-weight: 800;">
              <span>Continuar Microcurso: Mapa de Rutas y Logro</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        `;

      case 4:
        return `
          <!-- PASO 4: MAPA DE RUTAS TdeA & LOGRO ESTACIÓN 2 -->
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.85rem;">
            <span>PASO 4 DE 4</span> · <span>MAPA DE RUTAS Y LOGRO DE ESTACIÓN 2</span>
          </div>

          <!-- Infografía Visual Oficial: Recalculando la Ruta / Mapa de Rutas (Visualización y Descarga) -->
          <div class="lc-content-card" style="border: 2px solid #86EFAC; background: #FFFFFF; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 4px 18px rgba(0, 90, 41, 0.08);">
            
            <!-- Encabezado con Título, Subtítulo y Botones de Acción -->
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem;">
              <div style="display: flex; align-items: center; gap: 0.9rem;">
                <span style="font-size: 2.2rem;">🗺️</span>
                <div>
                  <h4 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #005A29;">
                    Mapa de Rutas de Acompañamiento TdeA
                  </h4>
                  <p style="margin: 0.25rem 0 0 0; font-size: 0.95rem; color: #334155; font-weight: 600;">
                    Infografía completa en alta resolución: Recalculando la ruta
                  </p>
                </div>
              </div>

              <div style="display: flex; gap: 0.6rem; flex-wrap: wrap; align-items: center;">
                <a 
                  href="assets/campusVital/docs/mapa_rutas_infografia1.pdf" 
                  download="Mapa_de_Rutas_TdeA.pdf" 
                  class="lc-btn lc-btn-primary" 
                  id="btn-download-route-map"
                  style="padding: 0.75rem 1.4rem; font-weight: 800; display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; background: #00843D;"
                  title="Descargar la infografía oficial en formato PDF de alta resolución"
                >
                  <span>📥 Descarga tu mapa de rutas (PDF)</span>
                </a>

                <a 
                  href="assets/campusVital/images/mapa_rutas_infografia1.jpg" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="lc-btn lc-btn-secondary" 
                  style="padding: 0.75rem 1.2rem; font-weight: 700; display: inline-flex; align-items: center; gap: 0.45rem; text-decoration: none;"
                  title="Abrir imagen en pestaña nueva para ver en tamaño completo"
                >
                  <span>🔍 Ver en tamaño completo</span>
                </a>
              </div>
            </div>

            <!-- Visualizador Amplio de la Infografía Oficial en Alta Resolución -->
            <div style="position: relative; width: 100%; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12); background: #022B14; text-align: center; border: 2px solid #86EFAC;">
              <a href="assets/campusVital/images/mapa_rutas_infografia1.jpg" target="_blank" rel="noopener noreferrer" title="Haz clic para ver en tamaño completo (1920x1080)">
                <img 
                  src="assets/campusVital/images/mapa_rutas_infografia1.jpg" 
                  alt="Infografía completa en alta resolución: Recalculando la ruta - Mapa de rutas de acompañamiento TdeA" 
                  style="width: 100%; height: auto; display: block; border-radius: 12px; max-height: 800px; object-fit: contain; margin: 0 auto; background: #FFFFFF; cursor: zoom-in;"
                  loading="lazy"
                />
              </a>
            </div>

            <div style="margin-top: 0.75rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
              <span style="font-size: 0.85rem; color: #475569; font-weight: 600;">
                🧭 Infografía Oficial Campus Vital · Recalculando la ruta
              </span>
              <span style="font-size: 0.82rem; color: #64748B;">
                💡 Haz clic sobre la imagen o en "Ver en tamaño completo" para ampliarla, o descárgala en PDF.
              </span>
            </div>
          </div>

          <!-- Insignia de logro de Estación 2 completada -->
          <div class="lc-content-card" style="background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); border: 2px solid #00843D; text-align: center; padding: 2rem 1.5rem;">
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">🧭</div>
            <h3 style="font-size: 1.4rem; font-weight: 800; color: #005A29; margin: 0 0 0.5rem 0;">¡Estación 2 Completada!</h3>
            <p style="max-width: 600px; margin: 0 auto 1.25rem auto; color: #065F46; font-size: 1rem; line-height: 1.6;">
              Has comprendido que los desvíos son oportunidades de aprendizaje y cuentas con nuevas herramientas de afrontamiento en tu equipaje.
            </p>
            <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: #ffffff; padding: 0.5rem 1.2rem; border-radius: 9999px; font-weight: 800; color: #00843D; box-shadow: 0 2px 8px rgba(0, 132, 61, 0.15);">
              <span>✓ Estación 2 completada con éxito</span>
            </div>
          </div>

          <!-- En el paso final de la Estación 2, ÚNICAMENTE sale el botón de volver a las estaciones -->
          <div class="h-slide-actions-bar">
            <button type="button" class="lc-btn lc-btn-secondary" id="btn-st2-prev">
              <span aria-hidden="true">←</span>
              <span>Anterior: Microcurso 2</span>
            </button>

            <button type="button" class="lc-btn lc-btn-primary animate-pulse" id="btn-st2-return-menu" style="padding: 0.95rem 2.4rem; font-weight: 800; background: #00843D; box-shadow: 0 4px 14px rgba(0, 132, 61, 0.35);">
              <span>🚂 Volver al Mapa de Estaciones</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        `;

      default:
        return '';
    }
  }

  /**
   * Conecta los eventos del paso activo en Estación 2
   */
  bindStation2SlideEvents(current) {
    // 1. Navegación directa en el stepper horizontal
    const jumpBtns = this.containerEl.querySelectorAll('[data-step-jump]');
    jumpBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetStep = Number(btn.getAttribute('data-step-jump'));
        if (targetStep <= this.st2Step || targetStep === current + 1) {
          this.renderStation2(targetStep);
        }
      });
    });

    // 2. Botón Volver al mapa desde el paso 1
    const btnBackMap = this.containerEl.querySelector('#btn-st2-back-to-map');
    if (btnBackMap) {
      btnBackMap.addEventListener('click', () => {
        this.render('station_menu');
      });
    }

    // 3. Botón Anterior genérico
    const btnPrev = this.containerEl.querySelector('#btn-st2-prev');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (this.st2Step > 1) {
          this.renderStation2(this.st2Step - 1);
        }
      });
    }

    // 4. Botón Siguiente genérico
    const btnNext = this.containerEl.querySelector('#btn-st2-next');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (this.st2Step < 4) {
          this.renderStation2(this.st2Step + 1);
        }
      });
    }

    // 5. Eventos específicos de cada paso
    if (current === 2) {
      const plusBtns = this.containerEl.querySelectorAll('.lc-btn-tool-plus');
      plusBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const key = btn.getAttribute('data-tool-key');
          learningCenterState.toggleJuanTool(key);
          
          const card = this.containerEl.querySelector(`#tool-card-${key}`);
          const isAdded = btn.classList.toggle('is-added');
          if (card) card.classList.toggle('is-active', isAdded);
          btn.textContent = isAdded ? '✓' : '+';
        });
      });
    } else if (current === 3) {
      this.setupDuaAudioPlayer('podcast-st2-audio', 'btn-podcast-play', 'podcast-play-icon', 'podcast-scrubber', 'podcast-current-time', 'podcast-total-time', 'btn-podcast-speed', 'btn-podcast-transcript-toggle', 'podcast-transcript-content');

      const inputRef = this.containerEl.querySelector('#input-podcast-reflection');
      if (inputRef) {
        inputRef.addEventListener('input', () => {
          learningCenterState.setStation2PodcastReflection(inputRef.value);
        });
      }
    } else if (current === 4) {
      const btnMap = this.containerEl.querySelector('#btn-download-route-map');
      if (btnMap) {
        btnMap.addEventListener('click', () => {
          learningCenterState.markRouteMapDownloaded();
        });
      }

      // Único botón de salida: completa la estación 2 y regresa al mapa del tren
      const btnRet = this.containerEl.querySelector('#btn-st2-return-menu');
      if (btnRet) {
        btnRet.addEventListener('click', () => {
          learningCenterState.completeStation2();
          this.st2Step = 1;
          this.render('station_menu');
        });
      }
    }
  }

  // =========================================================================
  // 6. ESTACIÓN 3: VIAJAR ACOMPAÑADO (FLUJO HORIZONTAL PASO A PASO DUA)
  // =========================================================================
  renderStation3(stepIndex) {
    this.scrollToTop();
    if (stepIndex !== undefined && stepIndex !== null) {
      this.st3Step = Number(stepIndex);
    }
    if (!this.st3Step || this.st3Step < 1 || this.st3Step > 5) {
      this.st3Step = 1;
    }

    const s3 = learningCenterState.state.module1.equipaje.station3;
    const current = this.st3Step;

    this.containerEl.innerHTML = `
      <section class="lc-equipaje-root animate-fade-in" aria-labelledby="st3-title">
        ${this.renderHeaderHtml('station_3')}

        <!-- Encabezado Estación 3 con Resultado de Aprendizaje y Frase Clave -->
        <div class="lc-module-header">
          <div class="lc-station-num-badge" style="margin-bottom: 0.5rem;">ESTACIÓN 3</div>
          <h2 id="st3-title" class="lc-module-heading">Viajar acompañado</h2>

          <div style="background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%); border: 2px solid #00843D; border-left: 6px solid #00843D; padding: 1.15rem 1.4rem; border-radius: 14px; margin: 1rem 0 1.25rem 0; box-shadow: 0 4px 14px rgba(0, 132, 61, 0.08);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
              <span style="font-size: 1.25rem;">🎯</span>
              <strong style="font-size: 1.05rem; color: #022B14; text-transform: uppercase; letter-spacing: 0.5px;">Resultado de aprendizaje:</strong>
            </div>
            <p style="margin: 0 0 0.85rem 0; font-size: 1.12rem; font-weight: 800; color: #005A29; line-height: 1.4;">
              Reconocer la importancia de las redes de apoyo y conocer las rutas institucionales.
            </p>
            <div style="border-top: 1.5px dashed #86EFAC; padding-top: 0.75rem;">
              <p style="margin: 0; font-size: 1.25rem; font-style: italic; color: #022B14; font-weight: 800; line-height: 1.4;">
                “Ningún viaje importante se hace completamente solo”.
              </p>
            </div>
          </div>
        </div>

        <!-- Contenedor del Flujo Horizontal Paso a Paso (5 pasos) -->
        <div class="horizontal-station-viewport">
          
          <!-- Barra de navegación por pasos horizontales -->
          <div class="horizontal-station-stepper" role="navigation" aria-label="Progreso de actividades en Estación 3">
            <button type="button" class="h-step-item ${current === 1 ? 'is-current' : (current > 1 ? 'is-completed' : '')}" data-step-jump="1">
              <span>${current > 1 ? '✓' : '1.'}</span>
              <span>🎨 Lienzo de Red</span>
            </button>
            <span class="h-step-sep">›</span>

            <button type="button" class="h-step-item ${current === 2 ? 'is-current' : (current > 2 ? 'is-completed' : '')}" data-step-jump="2">
              <span>${current > 2 ? '✓' : '2.'}</span>
              <span>🏛️ Bienestar TdeA</span>
            </button>
            <span class="h-step-sep">›</span>

            <button type="button" class="h-step-item ${current === 3 ? 'is-current' : (current > 3 ? 'is-completed' : '')}" data-step-jump="3">
              <span>${current > 3 ? '✓' : '3.'}</span>
              <span>📖 Lectura</span>
            </button>
            <span class="h-step-sep">›</span>

            <button type="button" class="h-step-item ${current === 4 ? 'is-current' : (current > 4 ? 'is-completed' : '')}" data-step-jump="4">
              <span>${current > 4 ? '✓' : '4.'}</span>
              <span>🎒 Tu Maleta</span>
            </button>
            <span class="h-step-sep">›</span>

            <button type="button" class="h-step-item ${current === 5 ? 'is-current' : ''}" data-step-jump="5">
              <span>${current === 5 ? '🧭' : '5.'}</span>
              <span>🧭 Bitácora</span>
            </button>
          </div>

          <!-- Slide Activo de la Actividad -->
          <div class="h-slide-content-card" id="st3-slide-container">
            ${this.renderStation3SlideContent(current, s3)}
          </div>

        </div>

      </section>
    `;

    this.bindCommonEvents();
    this.bindStation3SlideEvents(current);
  }

  /**
   * Genera el contenido HTML exclusivo del paso activo en Estación 3
   */
  renderStation3SlideContent(current, s3) {
    switch (current) {
      case 1:
        return `
          <!-- PASO 1: LIENZO INTERACTIVO DIGITAL -->
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.85rem;">
            <span>PASO 1 DE 5</span> · <span>ACTIVIDAD INTERACTIVA · LIENZO DIGITAL DE APOYO</span>
          </div>

          <div class="lc-support-network-box">
            <div class="lc-instruction-banner">
              <div class="lc-banner-icon" aria-hidden="true">🎨</div>
              <div class="lc-banner-text">
                <strong style="font-size: 1.15rem; color: #005A29;">Construye tu red de apoyo</strong>
                <p style="margin: 0.35rem 0 0 0; line-height: 1.5;">
                  Identifica las personas, instancias y servicios que conforman tu red de respaldo. Selecciona un rol y haz clic en el lienzo para estamparlo, o escribe nombres personalizados para trazar tus conexiones:
                </p>
              </div>
            </div>

            <!-- Barra de herramientas para agregar nodos a la red -->
            <div class="lc-net-toolbar" style="margin: 1rem 0; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; justify-content: space-between;">
              <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; align-items: center;">
                <span style="font-weight: 800; font-size: 0.9rem; color: #022B14; margin-right: 0.25rem;">Estampar nodo:</span>
                <button type="button" class="lc-net-stamp-pill is-active" data-stamp="👨‍👩‍👧 Familia"><span>👨‍👩‍👧</span> <span>Familia</span></button>
                <button type="button" class="lc-net-stamp-pill" data-stamp="🤝 Amigos"><span>🤝</span> <span>Amigos</span></button>
                <button type="button" class="lc-net-stamp-pill" data-stamp="🎓 Docentes"><span>🎓</span> <span>Docentes</span></button>
                <button type="button" class="lc-net-stamp-pill" data-stamp="👥 Compañeros"><span>👥</span> <span>Compañeros</span></button>
                <button type="button" class="lc-net-stamp-pill" data-stamp="🌱 Bienestar TdeA"><span>🌱</span> <span>Bienestar TdeA</span></button>
                <button type="button" class="lc-net-stamp-pill" data-stamp="🧠 Apoyo Psicológico"><span>🧠</span> <span>Psicología</span></button>
                <button type="button" class="lc-net-stamp-pill" data-stamp="📚 Asesoría Académica"><span>📚</span> <span>Académico</span></button>
              </div>

              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <button type="button" class="lc-btn lc-btn-secondary" id="btn-net-clear" style="padding: 0.45rem 0.9rem; font-size: 0.85rem;" title="Limpiar todos los nodos del lienzo">
                  <span>🗑️ Limpiar</span>
                </button>
                <button type="button" class="lc-btn lc-btn-secondary" id="btn-net-undo" style="padding: 0.45rem 0.9rem; font-size: 0.85rem;" title="Deshacer último nodo">
                  <span>↩️ Deshacer</span>
                </button>
              </div>
            </div>

            <!-- Escenario de Lienzo Digital HTML5 Canvas -->
            <div style="position: relative; width: 100%; border-radius: 16px; overflow: hidden; border: 2px solid #86EFAC; background: #FFFFFF; box-shadow: inset 0 2px 8px rgba(0,0,0,0.04); display: flex; align-items: center; justify-content: center;">
              <canvas id="support-network-canvas" width="1000" height="562" aria-label="Lienzo interactivo de mi red de apoyo" style="display: block; width: 100%; max-width: 100%; height: auto; cursor: crosshair; margin: 0 auto;"></canvas>
              
              <div id="net-canvas-hint" style="position: absolute; bottom: 12px; left: 16px; background: rgba(2, 43, 20, 0.75); color: #FFFFFF; font-size: 0.82rem; padding: 0.35rem 0.75rem; border-radius: 9999px; pointer-events: none; backdrop-filter: blur(4px);">
                💡 Haz clic sobre el lienzo para estampar el rol seleccionado. Arrastra para mover nodos.
              </div>
            </div>

            <!-- Lista de Nodos Guardados -->
            <div id="net-nodes-summary" style="margin-top: 1rem; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
              <span style="font-size: 0.88rem; font-weight: 700; color: #475569;">Nodos en tu red:</span>
              <div id="net-chips-wrap" style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
                <span style="font-size: 0.85rem; color: #94A3B8; font-style: italic;">Haz clic en el lienzo para comenzar a tejer tu red...</span>
              </div>
            </div>
          </div>

          <div class="h-slide-actions-bar">
            <button type="button" class="lc-btn lc-btn-secondary" id="btn-st3-back-to-map">
              <span aria-hidden="true">←</span>
              <span>Volver al Mapa de Estaciones</span>
            </button>

            <button type="button" class="lc-btn lc-btn-primary" id="btn-st3-next" style="padding: 0.95rem 2.2rem; font-weight: 800;">
              <span>Continuar a: Bienestar Universitario</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        `;

      case 2:
        return `
          <!-- PASO 2: MICROSITIO DE BIENESTAR UNIVERSITARIO -->
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.85rem;">
            <span>PASO 2 DE 5</span> · <span>RUTAS Y SERVICIOS INSTITUCIONALES TdeA</span>
          </div>

          <div class="lc-content-card" style="border: 2px solid #BAE6FD; background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%);">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
              <div style="display: flex; align-items: center; gap: 1rem;">
                <span style="font-size: 2.2rem;">🏛️</span>
                <div>
                  <h4 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0369A1;">Micrositio de Bienestar Universitario TdeA</h4>
                  <p style="margin: 0.25rem 0 0 0; font-size: 0.88rem; color: #334155;">
                    Conoce las rutas vigentes de salud, psicología, deporte, cultura y permanencia del Tecnológico de Antioquia.
                  </p>
                </div>
              </div>

              <a 
                href="https://tdea.edu.co/micrositios/bienestar-universitario/" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="lc-btn lc-btn-primary"
                style="background: #0284C7; text-decoration: none; padding: 0.65rem 1.4rem; font-weight: 800; font-size: 0.9rem;"
              >
                <span>🌐 Visitar Micrositio de Bienestar</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <div class="h-slide-actions-bar">
            <button type="button" class="lc-btn lc-btn-secondary" id="btn-st3-prev">
              <span aria-hidden="true">←</span>
              <span>Anterior: Lienzo de Red</span>
            </button>

            <button type="button" class="lc-btn lc-btn-primary" id="btn-st3-next" style="padding: 0.95rem 2.2rem; font-weight: 800;">
              <span>Continuar a: Lectura y Reflexión</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        `;

      case 3:
        return `
          <!-- PASO 3: LECTURA BREVE Y REFLEXIÓN PERSONAL -->
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.85rem;">
            <span>PASO 3 DE 5</span> · <span>LECTURA BREVE Y REFLEXIÓN PERSONAL</span>
          </div>

          <div class="lc-content-card">
            <div class="lc-instruction-banner">
              <div class="lc-banner-icon" aria-hidden="true">📖</div>
              <div class="lc-banner-text">
                <strong style="font-size: 1.15rem; color: #005A29;">Lectura breve: ¿Por qué pedir ayuda es una fortaleza?</strong>
                <p style="margin: 0.5rem 0 0 0; line-height: 1.6; color: #334155;">
                  Pedir ayuda no es señal de debilidad; es reconocer que no tenemos que enfrentar todos los desafíos solos. En la vida universitaria es normal encontrarse con situaciones que generan dudas, estrés o dificultad, y buscar apoyo es una forma de cuidar nuestro bienestar y continuar avanzando.
                </p>
                <p style="margin: 0.5rem 0 0 0; line-height: 1.6; color: #334155;">
                  Aceptar el acompañamiento de otras personas nos permite aprender nuevas estrategias, fortalecer nuestras capacidades y encontrar soluciones que, en ocasiones, no vemos por nuestra cuenta.
                </p>
                <blockquote style="margin: 0.6rem 0 0 0; font-weight: 800; color: #00843D; font-size: 1.05rem;">
                  Recuerda: pedir ayuda no significa que no puedas; significa que eliges apoyarte para seguir creciendo.
                </blockquote>
              </div>
            </div>

            <!-- Pregunta reflexiva -->
            <div class="lc-textarea-container-full" style="margin-top: 1.25rem;">
              <label for="input-talk-candidate" style="font-weight: 800; color: #0F172A; font-size: 1.05rem;">
                Reflexión: ¿Hay alguien con quien podrías hablar esta semana si lo necesitaras?
              </label>
              <textarea 
                id="input-talk-candidate" 
                class="lc-textarea-spacious" 
                rows="3" 
                placeholder="Escribe el nombre o la instancia de tu red con quien te gustaría conectar..."
              >${s3.talkCandidate || ''}</textarea>
            </div>
          </div>

          <div class="h-slide-actions-bar">
            <button type="button" class="lc-btn lc-btn-secondary" id="btn-st3-prev">
              <span aria-hidden="true">←</span>
              <span>Anterior: Bienestar TdeA</span>
            </button>

            <button type="button" class="lc-btn lc-btn-primary" id="btn-st3-next" style="padding: 0.95rem 2.2rem; font-weight: 800;">
              <span>Continuar a: Tu Maleta de Herramientas</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        `;

      case 4:
        return `
          <!-- PASO 4: INFOGRAFÍA INTERACTIVA DE CANVA - TU MALETA COMPLETA -->
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.85rem;">
            <span>PASO 4 DE 5</span> · <span>INFOGRAFÍA INTERACTIVA · MI EQUIPAJE DE BIENESTAR</span>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <h3 style="font-size: 1.35rem; font-weight: 800; color: #005A29; margin: 0 0 0.35rem 0;">4. Infografía: Tu Maleta de Herramientas</h3>
            <p style="margin: 0; color: #475569; font-size: 0.95rem; line-height: 1.6;">
              Has recorrido las tres estaciones del viaje. Tu maleta se abre nuevamente y ahora está lista con la <strong>Brújula Emocional</strong>, las <strong>Rutas Alternativas</strong> y tu <strong>Red de Apoyo</strong>:
            </p>
          </div>

          <!-- Embed de Canva oficial de la maleta abierta con las herramientas -->
          <div class="lc-embed-card" style="box-shadow: none; border: 1.5px solid #CBD5E1; margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.85rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.3rem;">🎒</span>
                <strong style="color: #0F172A; font-size: 1.05rem;">Infografía: Tu Maleta Completa</strong>
              </div>
              <a href="https://canva.link/lauqfc8rfqp291d" target="_blank" rel="noopener noreferrer" class="lc-media-alt-btn" style="background: #F0FDF4; color: #00843D; font-weight: 700; border: 1.5px solid #86EFAC; padding: 0.55rem 1rem; border-radius: 10px; text-decoration: none;">
                <span>↗ Pantalla completa Canva</span>
              </a>
            </div>

            <div class="lc-embed-frame-wrapper">
              <iframe 
                loading="lazy" 
                src="https://www.canva.com/design/DAHXWMG3rLI/Z-jHpNPa45McE7JkQEFbpQ/view?embed" 
                title="Infografía Interactiva Tu Maleta de Herramientas" 
                allowfullscreen="allowfullscreen" 
                allow="fullscreen"
              ></iframe>
            </div>
          </div>

          <div class="h-slide-actions-bar">
            <button type="button" class="lc-btn lc-btn-secondary" id="btn-st3-prev">
              <span aria-hidden="true">←</span>
              <span>Anterior: Lectura y Reflexión</span>
            </button>

            <button type="button" class="lc-btn lc-btn-primary" id="btn-st3-next" style="padding: 0.95rem 2.2rem; font-weight: 800;">
              <span>Continuar a: Bitácora del Viajero</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        `;

      case 5:
        const eq = learningCenterState.state.module1.equipaje;
        const firstTool = eq?.closing?.firstToolText || '';
        return `
          <!-- PASO 5: BITÁCORA DEL VIAJERO Y PREGUNTA REFLEXIVA FINAL (AÚN HACE PARTE DE ESTACIÓN 3) -->
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.85rem;">
            <span>PASO 5 DE 5</span> · <span>BITÁCORA DEL VIAJERO · COMPROMISO DE AUTOCUIDADO</span>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <h3 style="font-size: 1.35rem; font-weight: 800; color: #005A29; margin: 0 0 0.35rem 0;">5. Bitácora del Viajero: Tu primera herramienta</h3>
            <p style="margin: 0; color: #475569; font-size: 0.95rem; line-height: 1.6;">
              Reflexiona sobre los recursos adquiridos a lo largo del viaje antes de cerrar el módulo:
            </p>
          </div>

          <!-- 1. Infografía oficial Bitácora del Viajero (Maleta y flechas explicativas) -->
          <div class="lc-embed-card" style="border: 2px solid #86EFAC; border-radius: 18px; padding: 1.25rem 1.5rem; background: #FFFFFF; box-shadow: 0 4px 18px rgba(0, 132, 61, 0.08); margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.85rem;">
              <div style="display: flex; align-items: center; gap: 0.65rem;">
                <span style="font-size: 1.4rem;">🧭</span>
                <div>
                  <strong style="color: #0F172A; font-size: 1.15rem; display: block; font-weight: 800;">Bitácora del viajero: Tu primera herramienta</strong>
                  <span style="font-size: 0.85rem; color: #64748B;">¿Qué herramienta de mi maleta creo que utilizaré primero y por qué?</span>
                </div>
              </div>
              <a href="https://canva.link/x6nh6404xql6qlz" target="_blank" rel="noopener noreferrer" class="lc-media-alt-btn" style="background: #F0FDF4; color: #00843D; font-weight: 700; border: 1.5px solid #86EFAC; padding: 0.55rem 1rem; border-radius: 10px; text-decoration: none;">
                <span>↗ Pantalla completa Canva</span>
              </a>
            </div>

            <div class="lc-embed-frame-wrapper" style="margin-top: 0.85rem;">
              <iframe 
                loading="lazy" 
                src="https://www.canva.com/design/DAHXRdouA38/rAJLAStrsp9wmdV7ZeUCbg/view?embed" 
                title="Bitácora del viajero: ¿Qué herramienta de mi maleta creo que utilizaré primero y por qué?" 
                allowfullscreen="allowfullscreen" 
                allow="fullscreen"
              ></iframe>
            </div>
          </div>

          <!-- 2. Verticalmente debajo: Pregunta Interactiva Obligatoria -->
          <div class="lc-content-card" style="margin-bottom: 1.75rem;">
            <div class="lc-instruction-banner">
              <div class="lc-banner-icon" aria-hidden="true">✍️</div>
              <div class="lc-banner-text">
                <strong style="font-size: 1.15rem; color: #005A29;">Compromiso personal de autocuidado</strong>
                <p style="margin: 0.25rem 0 0 0; color: #334155;">Reflexiona sobre lo descubierto en las tres estaciones y define tu próximo paso:</p>
              </div>
            </div>

            <div class="lc-textarea-container-full" style="margin-top: 1rem;">
              <label for="input-first-tool" style="font-weight: 800; color: #0F172A; font-size: 1.05rem; display: block; margin-bottom: 0.5rem;">
                Escribe: ¿Qué herramienta de mi maleta creo que utilizaré primero y por qué?
              </label>
              <textarea 
                id="input-first-tool" 
                class="lc-textarea-spacious" 
                rows="4" 
                placeholder="Por ejemplo: regular mis horas de sueño, buscar una asesoría docente en ciencias básicas antes del parcial, o pedir ayuda cuando me sienta sobrecargado..."
              >${firstTool}</textarea>
            </div>
          </div>

          <!-- Acciones de pie del Paso 5 de la Estación 3 -->
          <div class="h-slide-actions-bar">
            <button type="button" class="lc-btn lc-btn-secondary" id="btn-st3-prev">
              <span aria-hidden="true">←</span>
              <span>Anterior: Tu Maleta</span>
            </button>

            <button type="button" class="lc-btn lc-btn-primary animate-pulse" id="btn-st3-goto-closing" style="padding: 0.95rem 2.4rem; font-weight: 800; background: #00843D; box-shadow: 0 4px 16px rgba(0, 132, 61, 0.4);">
              <span>🎒 Finalizar Estación 3 y Continuar al Cierre del Módulo 1</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        `;

      default:
        return '';
    }
  }

  bindStation3SlideEvents(current) {
    // 1. Navegación directa en el stepper horizontal
    const jumpBtns = this.containerEl.querySelectorAll('[data-step-jump]');
    jumpBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetStep = Number(btn.getAttribute('data-step-jump'));
        if (targetStep <= this.st3Step || targetStep === current + 1) {
          this.renderStation3(targetStep);
        }
      });
    });

    // 2. Botón Volver al mapa desde el paso 1
    const btnBackMap = this.containerEl.querySelector('#btn-st3-back-to-map');
    if (btnBackMap) {
      btnBackMap.addEventListener('click', () => {
        this.render('station_menu');
      });
    }

    // 3. Botón Anterior genérico
    const btnPrev = this.containerEl.querySelector('#btn-st3-prev');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (this.st3Step > 1) {
          this.renderStation3(this.st3Step - 1);
        }
      });
    }

    // 4. Botón Siguiente genérico
    const btnNext = this.containerEl.querySelector('#btn-st3-next');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (this.st3Step < 5) {
          this.renderStation3(this.st3Step + 1);
        }
      });
    }

    // 5. Eventos específicos de cada paso
    if (current === 1) {
      // Inicializar lienzo digital HTML5
      this.initSupportNetworkCanvas();
    } else if (current === 3) {
      // Guardar reflexión del textarea de lectura
      const inputCand = this.containerEl.querySelector('#input-talk-candidate');
      if (inputCand) {
        inputCand.addEventListener('input', () => {
          learningCenterState.setStation3TalkCandidate(inputCand.value);
        });
      }
    } else if (current === 5) {
      // Guardar compromiso personal de autocuidado
      const inputFirstTool = this.containerEl.querySelector('#input-first-tool');
      if (inputFirstTool) {
        inputFirstTool.addEventListener('input', () => {
          learningCenterState.setClosingFirstTool(inputFirstTool.value);
        });
      }

      // Finalizar Estación 3 e ir al Cierre
      const btnClose = this.containerEl.querySelector('#btn-st3-goto-closing');
      if (btnClose) {
        btnClose.addEventListener('click', () => {
          learningCenterState.completeStation3();
          this.st3Step = 1;
          this.render('closing');
        });
      }
    }
  }
  initSupportNetworkCanvas() {
    this.canvas = this.containerEl.querySelector('#support-network-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    const s3 = learningCenterState.state.module1.equipaje.station3;

    // Pila de historial para la función Deshacer (Undo)
    this.canvasHistory = [];

    const saveHistory = () => {
      try {
        if (this.canvasHistory.length >= 15) {
          this.canvasHistory.shift();
        }
        this.canvasHistory.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
      } catch (e) {}
    };

    this.canvas.width = 1000;
    this.canvas.height = 562;

    // Restaurar si ya existía dibujo guardado centrado
    if (s3.supportDrawingDataUrl) {
      const img = new Image();
      img.onload = () => {
        // Verificar que la imagen previa corresponda a la resolución exacta del lienzo (1000x562)
        if (img.width === 1000 && img.height === 562) {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.ctx.drawImage(img, 0, 0);
          saveHistory();
        } else {
          // Si el dibujo guardado provenía de una resolución anterior distorsionada/descentrada, regenerar centrado perfecto
          this.drawCanvasDefaultBackground();
          saveHistory();
          learningCenterState.saveSupportDrawing(null);
        }
      };
      img.onerror = () => {
        this.drawCanvasDefaultBackground();
        saveHistory();
        learningCenterState.saveSupportDrawing(null);
      };
      img.src = s3.supportDrawingDataUrl;
    } else {
      this.drawCanvasDefaultBackground();
      saveHistory();
    }

    // Configurar herramientas de dibujo
    let drawing = false;

    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;

      if (e.touches && e.touches.length > 0) {
        return {
          x: (e.touches[0].clientX - rect.left) * scaleX,
          y: (e.touches[0].clientY - rect.top) * scaleY
        };
      }
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    };

    const startDraw = (e) => {
      saveHistory();
      drawing = true;
      const pos = getPos(e);
      this.ctx.beginPath();
      this.ctx.moveTo(pos.x, pos.y);
    };

    const moveDraw = (e) => {
      if (!drawing) return;
      if (e.cancelable) e.preventDefault();
      const pos = getPos(e);
      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.lineWidth = this.currentLineWidth;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.stroke();
    };

    const endDraw = () => {
      if (drawing) {
        drawing = false;
        learningCenterState.saveSupportDrawing(this.canvas.toDataURL('image/png'));
      }
    };

    // Eventos Mouse
    this.canvas.addEventListener('mousedown', startDraw);
    this.canvas.addEventListener('mousemove', moveDraw);
    this.canvas.addEventListener('mouseup', endDraw);
    this.canvas.addEventListener('mouseleave', endDraw);

    // Eventos Touch para móviles y tabletas
    this.canvas.addEventListener('touchstart', startDraw, { passive: false });
    this.canvas.addEventListener('touchmove', moveDraw, { passive: false });
    this.canvas.addEventListener('touchend', endDraw);

    // Selector de colores
    const colorSwatches = this.containerEl.querySelectorAll('.lc-color-swatch');
    colorSwatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        colorSwatches.forEach(s => s.classList.remove('is-selected'));
        swatch.classList.add('is-selected');
        this.currentColor = swatch.getAttribute('data-color');
        
        const drawBtn = this.containerEl.querySelector('#tool-btn-draw');
        const eraseBtn = this.containerEl.querySelector('#tool-btn-erase');
        if (drawBtn) drawBtn.classList.add('is-active');
        if (eraseBtn) eraseBtn.classList.remove('is-active');
      });
    });

    // Selector de grosor de trazo
    const widthBtns = this.containerEl.querySelectorAll('.lc-width-btn');
    widthBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        widthBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        this.currentLineWidth = Number(btn.getAttribute('data-width')) || 4;
      });
    });

    // Herramienta Borrador
    const eraseBtn = this.containerEl.querySelector('#tool-btn-erase');
    const drawBtn = this.containerEl.querySelector('#tool-btn-draw');
    if (eraseBtn) {
      eraseBtn.addEventListener('click', () => {
        this.currentColor = '#FFFFFF';
        this.currentLineWidth = 24;
        eraseBtn.classList.add('is-active');
        if (drawBtn) drawBtn.classList.remove('is-active');
      });
    }

    if (drawBtn) {
      drawBtn.addEventListener('click', () => {
        const selSwatch = this.containerEl.querySelector('.lc-color-swatch.is-selected');
        this.currentColor = selSwatch ? selSwatch.getAttribute('data-color') : '#00843D';
        const activeWidthBtn = this.containerEl.querySelector('.lc-width-btn.is-active');
        this.currentLineWidth = activeWidthBtn ? Number(activeWidthBtn.getAttribute('data-width')) : 4;
        drawBtn.classList.add('is-active');
        if (eraseBtn) eraseBtn.classList.remove('is-active');
      });
    }

    // Herramienta Deshacer (Undo) - Compatible con ambos selectores
    const undoBtn = this.containerEl.querySelector('#btn-net-undo, #tool-btn-undo');
    if (undoBtn) {
      undoBtn.addEventListener('click', () => {
        if (this.canvasHistory.length > 1) {
          this.canvasHistory.pop(); // Remove current
          const prevState = this.canvasHistory[this.canvasHistory.length - 1];
          this.ctx.putImageData(prevState, 0, 0);
          learningCenterState.saveSupportDrawing(this.canvas.toDataURL('image/png'));
        } else {
          this.drawCanvasDefaultBackground();
          learningCenterState.saveSupportDrawing(null);
        }
      });
    }

    // Limpiar Lienzo - Compatible con ambos selectores
    const clearBtn = this.containerEl.querySelector('#btn-net-clear, #tool-btn-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.drawCanvasDefaultBackground();
        this.canvasHistory = [];
        saveHistory();
        learningCenterState.saveSupportDrawing(null);
        const chipsWrap = this.containerEl.querySelector('#net-chips-wrap');
        if (chipsWrap) {
          chipsWrap.innerHTML = '<span style="font-size: 0.85rem; color: #94A3B8; font-style: italic;">Haz clic en el lienzo para comenzar a tejer tu red...</span>';
        }
      });
    }

    // Estampado rápido de categorías
    const stampPills = this.containerEl.querySelectorAll('.lc-net-stamp-pill');
    let stampIndex = 0;
    const radiusX = 280;
    const radiusY = 175;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    const stampLabel = (text) => {
      saveHistory();
      const angle = (stampIndex * (Math.PI / 4)) - (Math.PI / 2);
      const px = centerX + Math.cos(angle) * radiusX;
      const py = centerY + Math.sin(angle) * radiusY;
      stampIndex = (stampIndex + 1) % 8;

      this.stampNetworkNode(px, py, text);
      learningCenterState.saveSupportDrawing(this.canvas.toDataURL('image/png'));
    };

    stampPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const text = pill.getAttribute('data-stamp');
        stampLabel(text);
      });
    });

    // Agregar nombre de persona o instancia personalizada
    const btnCustomStamp = this.containerEl.querySelector('#btn-add-custom-stamp');
    const inputCustomStamp = this.containerEl.querySelector('#input-custom-stamp-name');
    if (btnCustomStamp && inputCustomStamp) {
      const addCustom = () => {
        const val = inputCustomStamp.value.trim();
        if (val) {
          stampLabel(`👤 ${val}`);
          inputCustomStamp.value = '';
        }
      };
      btnCustomStamp.addEventListener('click', addCustom);
      inputCustomStamp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          addCustom();
        }
      });
    }

    // Descargar imagen en formato PNG (Alta definición)
    const downloadBtn = this.containerEl.querySelector('#btn-download-network-drawing');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const dataUrl = this.canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'Mi_Red_de_Apoyo_TdeA.png';
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  }

  drawCanvasDefaultBackground() {
    if (!this.ctx || !this.canvas) return;
    this.canvas.width = 1000;
    this.canvas.height = 562;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Fondo blanco puro
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, w, h);

    // Cuadrícula sutil y limpia
    this.ctx.strokeStyle = '#F8FAFC';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 32) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }
    for (let y = 0; y < h; y += 32) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(w, y);
      this.ctx.stroke();
    }

    const cx = w / 2;
    const cy = h / 2;

    // Anillo exterior guía punteado
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 210, 0, Math.PI * 2);
    this.ctx.strokeStyle = '#E2E8F0';
    this.ctx.lineWidth = 1.5;
    this.ctx.setLineDash([6, 6]);
    this.ctx.stroke();
    this.ctx.restore();

    // Halo suave del nodo central
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 58, 0, Math.PI * 2);
    this.ctx.fillStyle = '#DCFCE7';
    this.ctx.fill();

    // Círculo principal del nodo central
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 48, 0, Math.PI * 2);
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fill();
    this.ctx.strokeStyle = '#00843D';
    this.ctx.lineWidth = 3.5;
    this.ctx.stroke();

    // Texto Central con tipografía destacada
    this.ctx.fillStyle = '#022B14';
    this.ctx.font = 'bold 16px Plus Jakarta Sans, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('👤 YO', cx, cy - 8);
    this.ctx.font = '700 11px Plus Jakarta Sans, sans-serif';
    this.ctx.fillStyle = '#00843D';
    this.ctx.fillText('Estudiante TdeA', cx, cy + 13);
  }

  stampNetworkNode(x, y, label) {
    if (!this.ctx) return;
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;

    // Línea conectora hacia el centro con estilo punteado elegante
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.setLineDash([5, 5]);
    this.ctx.moveTo(cx, cy);
    this.ctx.lineTo(x, y);
    this.ctx.strokeStyle = '#94A3B8';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.restore();

    // Medir ancho de la pastilla
    const paddingX = 16;
    const height = 36;
    this.ctx.font = 'bold 13px Plus Jakarta Sans, sans-serif';
    const textWidth = this.ctx.measureText(label).width;
    const width = Math.max(textWidth + paddingX * 2, 110);

    // Sombra suave de la pastilla
    this.ctx.save();
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
    this.ctx.shadowBlur = 10;
    this.ctx.shadowOffsetY = 3;

    // Fondo y borde del nodo
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.strokeStyle = '#00843D';
    this.ctx.lineWidth = 2;

    const rx = x - width / 2;
    const ry = y - height / 2;
    const r = 18;
    this.ctx.beginPath();
    this.ctx.moveTo(rx + r, ry);
    this.ctx.lineTo(rx + width - r, ry);
    this.ctx.quadraticCurveTo(rx + width, ry, rx + width, ry + r);
    this.ctx.lineTo(rx + width, ry + height - r);
    this.ctx.quadraticCurveTo(rx + width, ry + height, rx + width - r, ry + height);
    this.ctx.lineTo(rx + r, ry + height);
    this.ctx.quadraticCurveTo(rx, ry + height, rx, ry + height - r);
    this.ctx.lineTo(rx, ry + r);
    this.ctx.quadraticCurveTo(rx, ry, rx + r, ry);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.restore();

    // Texto de la estampa
    this.ctx.fillStyle = '#0F172A';
    this.ctx.font = 'bold 12.5px Plus Jakarta Sans, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(label, x, y);
  }


  renderClosing() {
    this.scrollToTop();
    learningCenterState.completeEquipajeModule();

    this.containerEl.innerHTML = `
      <section class="lc-equipaje-root animate-fade-in" aria-labelledby="closing-title">
        ${this.renderHeaderHtml('closing')}

        <!-- Encabezado de Cierre del Módulo 1 -->
        <div class="lc-module-header">
          <span class="lc-module-tag">Consolidación del Viaje · Campus Vital 2026</span>
          <h2 id="closing-title" class="lc-module-heading">Cierre del Módulo 1: Tu Maleta de Bienestar</h2>
          <p class="lc-module-intro">
            Has completado satisfactoriamente las tres estaciones del recorrido universitario. Tu equipaje de bienestar está consolidado para acompañarte en tu vida en el TdeA.
          </p>
        </div>

        <!-- Tarjeta Oficial de Cierre del Módulo 1 (Imagen Oficial) -->
        <div class="lc-embed-card" style="border: 2.5px solid #00843D; border-radius: 20px; padding: 1.5rem; background: #FFFFFF; box-shadow: 0 8px 30px rgba(0, 132, 61, 0.15); margin-bottom: 2rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div style="background: #00843D; color: #FFFFFF; width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; box-shadow: 0 4px 12px rgba(0, 132, 61, 0.3);" aria-hidden="true">
                🎒
              </div>
              <div>
                <strong style="color: #0F172A; font-size: 1.2rem; display: block; font-weight: 800;">Infografía de Cierre: «Has recorrido la primera parte de este viaje»</strong>
                <span style="font-size: 0.9rem; color: #64748B;">Consolidación de tu equipaje de bienestar para el camino universitario</span>
              </div>
            </div>

            <!-- Botones de Acción / Descarga -->
            <div style="display: flex; gap: 0.6rem; flex-wrap: wrap; align-items: center;">
              <a 
                href="assets/campusVital/docs/cierre_infografia3.pdf" 
                download="Infografia_Cierre_Modulo1_TdeA.pdf" 
                class="lc-media-alt-btn"
                style="background: #00843D; color: #FFFFFF; font-weight: 800; border: none; padding: 0.65rem 1.25rem; border-radius: 10px; display: inline-flex; align-items: center; gap: 0.45rem; box-shadow: 0 3px 10px rgba(0, 132, 61, 0.3); text-decoration: none;"
                title="Descargar la infografía oficial en formato PDF para imprimir o guardar"
              >
                <span>📥 Descargar Infografía (PDF)</span>
              </a>
              <a 
                href="assets/campusVital/images/cierre_infografia3.jpg" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="lc-media-alt-btn"
                style="background: #F1F5F9; color: #334155; font-weight: 700; border: 1.5px solid #CBD5E1; padding: 0.65rem 1.1rem; border-radius: 10px; text-decoration: none;"
                title="Abrir imagen en alta resolución en una pestaña nueva"
              >
                <span>🔍 Ver en tamaño completo</span>
              </a>
              <a 
                href="https://canva.link/x6nh6404xql6qlz" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="lc-media-alt-btn"
                style="background: #F0FDF4; color: #00843D; font-weight: 700; border: 1.5px solid #86EFAC; padding: 0.65rem 1.1rem; border-radius: 10px; text-decoration: none;"
                title="Ver versión interactiva en Canva"
              >
                <span>🌐 Versión Canva</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <!-- Imagen Directa de la Infografía Oficial (Garantizada 100% visible) -->
          <div style="position: relative; width: 100%; border-radius: 16px; overflow: hidden; box-shadow: 0 6px 24px rgba(0,0,0,0.14); background: #022B14; text-align: center; border: 2px solid #86EFAC;">
            <img 
              src="assets/campusVital/images/cierre_infografia3.jpg" 
              alt="Infografía de Cierre del Módulo 1: Has recorrido la primera parte de este viaje y has reunido herramientas para acompañarte en tu vida universitaria." 
              style="width: 100%; height: auto; display: block; border-radius: 14px; max-height: 760px; object-fit: contain; margin: 0 auto;"
              loading="lazy"
            />
          </div>

          <!-- Botones de Navegación al pie de la Tarjeta de Cierre -->
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 1.75rem; padding-top: 1.25rem; border-top: 1.5px dashed #CBD5E1;">
            <button type="button" class="lc-btn lc-btn-primary animate-pulse" id="btn-goto-module-2" style="padding: 0.95rem 2.2rem; font-size: 1.05rem; font-weight: 800; background: #00843D; box-shadow: 0 4px 16px rgba(0, 132, 61, 0.35);">
              <span>🚀 Continuar en el Módulo 2: Elegir el rumbo →</span>
            </button>

            <button type="button" class="lc-btn lc-btn-secondary" id="btn-return-vital-menu" style="padding: 0.95rem 1.6rem; font-weight: 800;">
              <span>🏠 Volver al Menú de Campus Vital</span>
            </button>

            <button type="button" class="lc-btn lc-btn-secondary" id="btn-return-train-menu" style="padding: 0.95rem 1.6rem; font-weight: 800;">
              <span>🗺️ Volver al Mapa del Tren</span>
            </button>
          </div>
        </div>
      </section>
    `;

    this.bindCommonEvents();

    const btnMod2 = this.containerEl.querySelector('#btn-goto-module-2');
    if (btnMod2) {
      btnMod2.addEventListener('click', () => {
        learningCenterState.completeEquipajeModule();
        if (this.onNavigate) this.onNavigate('module2');
      });
    }

    const btnMenu = this.containerEl.querySelector('#btn-return-vital-menu');
    if (btnMenu) {
      btnMenu.addEventListener('click', () => {
        learningCenterState.completeEquipajeModule();
        if (this.onNavigate) this.onNavigate('menu');
      });
    }

    const btnTrain = this.containerEl.querySelector('#btn-return-train-menu');
    if (btnTrain) {
      btnTrain.addEventListener('click', () => {
        learningCenterState.completeEquipajeModule();
        this.render('station_menu');
      });
    }
  }
  bindCommonEvents() {
    // Retorno al menú principal del Centro de Aprendizaje
    const btnBack = this.containerEl.querySelector('#btn-back-to-lc-menu');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('menu');
      });
    }

    // Botón de reinicio de progreso del Módulo 1
    const btnResetMod1 = this.containerEl.querySelector('#btn-reset-module1-header');
    if (btnResetMod1) {
      btnResetMod1.addEventListener('click', () => {
        if (confirm('¿Deseas reiniciar el Módulo 1 y empezar el viaje desde el principio?')) {
          learningCenterState.resetEquipajeJourney();
          this.render('welcome_video');
        }
      });
    }

    // Modal interactivo para recursos asociados
    const openResBtns = this.containerEl.querySelectorAll('[data-open-resource]');
    openResBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-open-resource');
        const res = getResourceById(id);
        if (res) ResourceCard.openResourceModal(res);
      });
    });

    // Navegación por píldoras del stepper superior
    const pills = this.containerEl.querySelectorAll('[data-goto-step]');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const step = pill.getAttribute('data-goto-step');
        this.render(step);
      });
    });
  }

  /**
   * Configura un reproductor de audio accesible con controles DUA
   */
  setupDuaAudioPlayer(audioId, playBtnId, iconId, scrubberId, curTimeId, totTimeId, speedBtnId, transToggleId, transBoxId) {
    const audio = this.containerEl.querySelector(`#${audioId}`);
    const playBtn = this.containerEl.querySelector(`#${playBtnId}`);
    const icon = this.containerEl.querySelector(`#${iconId}`);
    const scrubber = this.containerEl.querySelector(`#${scrubberId}`);
    const curTime = this.containerEl.querySelector(`#${curTimeId}`);
    const totTime = this.containerEl.querySelector(`#${totTimeId}`);
    const speedBtn = this.containerEl.querySelector(`#${speedBtnId}`);
    const transToggle = this.containerEl.querySelector(`#${transToggleId}`);
    const transBox = this.containerEl.querySelector(`#${transBoxId}`);

    if (!audio) return;

    const formatTime = (secs) => {
      if (isNaN(secs) || secs < 0) return '00:00';
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    audio.addEventListener('loadedmetadata', () => {
      if (totTime) totTime.textContent = formatTime(audio.duration);
    });

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (audio.paused) {
          audio.play().then(() => {
            if (icon) icon.textContent = '⏸';
            playBtn.setAttribute('aria-label', 'Pausar audio');
          }).catch(err => console.warn('Error al reproducir audio:', err));
        } else {
          audio.pause();
          if (icon) icon.textContent = '▶';
          playBtn.setAttribute('aria-label', 'Reproducir audio');
        }
      });
    }

    audio.addEventListener('timeupdate', () => {
      if (curTime) curTime.textContent = formatTime(audio.currentTime);
      if (scrubber && audio.duration) {
        scrubber.value = (audio.currentTime / audio.duration) * 100;
      }
    });

    audio.addEventListener('ended', () => {
      if (icon) icon.textContent = '▶';
      if (playBtn) playBtn.setAttribute('aria-label', 'Reproducir audio');
      if (scrubber) scrubber.value = 0;
    });

    if (scrubber) {
      scrubber.addEventListener('input', () => {
        if (audio.duration) {
          audio.currentTime = (scrubber.value / 100) * audio.duration;
        }
      });
    }

    if (speedBtn) {
      const speeds = [1.0, 1.25, 1.5];
      let sIdx = 0;
      speedBtn.addEventListener('click', () => {
        sIdx = (sIdx + 1) % speeds.length;
        const sp = speeds[sIdx];
        audio.playbackRate = sp;
        speedBtn.textContent = `${sp}x`;
      });
    }

    if (transToggle && transBox) {
      transToggle.addEventListener('click', () => {
        const isShown = transBox.style.display !== 'none';
        transBox.style.display = isShown ? 'none' : 'block';
      });
    }
  }
}
