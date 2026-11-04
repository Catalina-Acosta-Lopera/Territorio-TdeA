/**
 * Módulo 2 – Adaptación Universitaria y Proyecto de Vida ("Elegir el rumbo")
 * Centro de Aprendizaje - Campus Vital TdeA
 *
 * Estructura oficial según Guía Pedagógica TdeA:
 * - Introducción: Lectura inspiradora y presentación de 2 rutas.
 * - RUTA 1: Construyendo mi proyecto de vida
 *     1. Video introductorio "¿Hacia dónde quiero caminar?" (YouTube)
 *     2. Actividad: Mi punto de partida (Canva embed + 3 cajas interactivas)
 *     3. Ebook e Infografía interactiva: Cuatro claves del proyecto de vida (Canva embed)
 *     4. Actividad: El árbol de mi proyecto de vida (Descargable PDF + Lienzo Digital DUA)
 * - RUTA 2: Adaptación a la vida universitaria
 *     1. Audio Podcast: "¿Qué significa adaptarse a la vida universitaria?"
 *     2. Actividad: Mi termómetro de adaptación (Grabación de Audio / Texto DUA) y Caso Daniel (Animado)
 *     3. Producto: Mi plan de adaptación (Hoja de Ruta personal descargable + Formulario)
 *     4. Tarjeta y Mensaje Final de Reconocimiento (Culminación del Módulo 2)
 */

import { learningCenterState } from './learningCenterState.js';
import { AudioRecorderService } from './audioRecorderService.js';
import { getDanielAnimatedStoryHtml } from './danielStoryAnimation.js';
import { MountainTrailAnimation } from './mountainTrailAnimation.js?v=20261103_09';
import { RESOURCES_DATA, getResourceById } from '../../data/resourcesData.js';
import { ResourceCard } from '../resourceCard.js';

export class Module2View {
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
    this.onNavigate = onNavigate;

    // Vista actual: 'intro' | 'ruta1' | 'ruta2' | 'cierre'
    this.currentRoute = 'intro';
    this.ruta1Step = 1; // 1 a 4
    this.ruta2Step = 1; // 1 a 4

    // Estado persistido de progreso en learningCenterState

    // Servicio de Grabación de Audio
    this.recorderService = null;
    this.recordedAudioBlob = null;
    this.recordedAudioUrl = null;
  }

  // =========================================================================
  // ENRUTADOR PRINCIPAL
  // =========================================================================
  render(route = null, step = null) {
    if (route) {
      this.currentRoute = route;
    }
    if (!this.containerEl) return;

    if (this.currentRoute === 'intro') {
      this.renderIntro();
    } else if (this.currentRoute === 'mountain') {
      this.renderMountain();
    } else if (this.currentRoute === 'ruta1') {
      this.renderRuta1(step !== null ? step : this.ruta1Step);
    } else if (this.currentRoute === 'ruta2') {
      this.renderRuta2(step !== null ? step : this.ruta2Step);
    } else if (this.currentRoute === 'cierre') {
      this.renderCierre();
    } else {
      this.renderIntro();
    }
  }

  // =========================================================================
  // ENCABEZADO DUA Y BARRA DE NAVEGACIÓN SUPERIOR
  // =========================================================================
  renderHeaderHtml(activeRoute = 'intro') {
    if (activeRoute === 'intro') {
      return `
        <div class="lc-equipaje-stepper" role="navigation" aria-label="Navegación del Módulo 2">
          <button type="button" class="lc-btn-back-menu" id="btn-back-to-lc-menu-m2" aria-label="Volver al menú de Campus Vital">
            <span aria-hidden="true">←</span> <span>Menú Campus Vital</span>
          </button>
        </div>
      `;
    }
    if (activeRoute === 'mountain') {
      return `
        <div class="lc-equipaje-stepper" role="navigation" aria-label="Navegación del Módulo 2">
          <button type="button" class="lc-btn-back-menu" id="btn-back-to-lc-menu-m2" aria-label="Volver al menú de Campus Vital">
            <span aria-hidden="true">←</span> <span>Menú Campus Vital</span>
          </button>
        </div>
      `;
    }
    return `
      <div class="lc-equipaje-stepper" role="navigation" aria-label="Navegación de Rutas">
        <button type="button" class="lc-btn-back-menu" id="btn-back-to-mountain-m2" aria-label="Volver al Sendero de la Montaña">
          <span aria-hidden="true">←</span> <span>Volver al Sendero de la Montaña</span>
        </button>
      </div>
    `;
  }

  bindCommonHeaderEvents() {
    // Modal interactivo para tarjetas de microcursos asociados
    const openResBtns = this.containerEl.querySelectorAll('[data-open-resource]');
    openResBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-open-resource');
        const res = getResourceById(id);
        if (res) ResourceCard.openResourceModal(res);
      });
    });

    const btnBackMenu = this.containerEl.querySelector('#btn-back-to-lc-menu-m2');
    if (btnBackMenu) {
      btnBackMenu.addEventListener('click', () => {
        if (this.onNavigate) this.onNavigate('menu');
      });
    }

    const btnBackIntro = this.containerEl.querySelector('#btn-back-to-intro-m2');
    if (btnBackIntro) {
      btnBackIntro.addEventListener('click', () => this.render('intro'));
    }

    const btnBackMountain = this.containerEl.querySelector('#btn-back-to-mountain-m2');
    if (btnBackMountain) {
      btnBackMountain.addEventListener('click', () => this.render('mountain'));
    }
  }

  // =========================================================================
  // 1. INTRODUCCIÓN GENERAL DEL MÓDULO 2 (VISTA SOLA DEDICADA)
  // =========================================================================
  renderIntro() {
    this.scrollToTop();
    this.currentRoute = 'intro';

    this.containerEl.innerHTML = `
      <section class="lc-equipaje-root mod2-intro-page animate-fade-in" aria-labelledby="mod2-intro-heading">
        ${this.renderHeaderHtml('intro')}

        <!-- Tarjeta Hero de Introducción con Mascota Chibi 3D y Fondo Verde Institucional -->
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
                <span>MÓDULO 2 · ELEGIR EL RUMBO</span>
              </div>

              <h1 id="mod2-intro-heading" class="mod1-intro-title">
                Lectura de Introducción: Elegir el rumbo
              </h1>

              <!-- Texto solicitado por el usuario -->
              <div class="mod1-intro-text-body">
                <p>
                  “Llegar a la universidad representa iniciar un nuevo camino lleno de aprendizajes, desafíos y oportunidades. En este recorrido podemos preguntarnos: <em>¿hacia dónde quiero ir?, ¿qué quiero construir?, ¿qué recursos tengo para avanzar?</em>
                </p>
                <p>
                  La vida universitaria no solo implica aprender nuevos conocimientos, también es un espacio para conocernos, descubrir nuestros intereses, fortalecer nuestras capacidades y construir relaciones con otros desde el respeto por la diversidad.
                </p>
                <p style="font-weight: 700; color: #DCFCE7;">
                  En este módulo exploraremos la importancia de tener una brújula interna que nos ayude a elegir nuestro rumbo. Reconoceremos elementos que orientan nuestro proyecto de vida y tendremos dos rutas en este camino, ¡comencemos!”
                </p>
              </div>

              <!-- Botón Siguiente para ir a las rutas de la montaña -->
              <div class="mod1-intro-actions-row" style="margin-top: 1.75rem;">
                <button type="button" class="lc-btn-intro-next" id="btn-m2-intro-next-to-mountain" style="padding: 1rem 2.8rem; font-size: 1.1rem; font-weight: 800; background: #00843D; color: #FFFFFF; border-radius: 14px; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 0.75rem; box-shadow: 0 4px 18px rgba(0, 132, 61, 0.4); transition: transform 0.2s, background 0.2s;">
                  <span>Siguiente: Explorar el Sendero de las Rutas</span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>
    `;

    this.bindCommonHeaderEvents();

    const btnNext = this.containerEl.querySelector('#btn-m2-intro-next-to-mountain');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        this.render('mountain');
      });
    }
  }

  // =========================================================================
  // 1.1. SENDERO DE LA MONTAÑA · LAS DOS RUTAS (VISTA DEDICADA SIN TARJETAS)
  // =========================================================================

  /**
   * Renderiza los 2 microcursos asociados oficialmente al Módulo 2 (Adaptación a la Vida Universitaria)
   */
  renderModule2MicrocoursesHtml() {
    const mod2Microcourses = RESOURCES_DATA.filter(r => r.id === 'res-vital-03' || r.id === 'res-vital-04');
    return `
      <!-- ===================================================================
           MICROCURSOS ASOCIADOS AL MÓDULO 2: ADAPTACIÓN A LA VIDA UNIVERSITARIA
           =================================================================== -->
      <div class="lc-module-microcourses-container animate-fade-in" style="margin-top: 1.75rem;">
        <div class="lc-microcourses-header-box" style="background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%); border: 2px solid #BAE6FD; border-radius: 18px; padding: 1.25rem 1.6rem; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; box-shadow: 0 4px 18px rgba(2, 132, 199, 0.08);">
          <div style="display: flex; align-items: center; gap: 0.85rem;">
            <div style="background: #0284C7; color: #FFFFFF; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.35rem; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);" aria-hidden="true">
              🧭
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 0.45rem; margin-bottom: 0.2rem;">
                <span class="lc-station-num-badge" style="background: #0284C7; font-size: 0.72rem; padding: 0.2rem 0.6rem;">
                  MÓDULO 2 • FORMACIÓN ASOCIADA
                </span>
                <span class="badge-status-upcoming-pill" style="font-size: 0.75rem; padding: 0.2rem 0.65rem;">
                  🌱 En producción
                </span>
              </div>
              <h3 style="margin: 0; font-size: 1.22rem; font-weight: 800; color: #075985; letter-spacing: -0.01em;">
                Microcursos del Módulo 2 — Adaptación a la Vida Universitaria
              </h3>
              <p style="margin: 0.25rem 0 0 0; font-size: 0.88rem; color: #0369A1; line-height: 1.45;">
                Cápsula audiovisual introductoria y taller práctico para tu proceso de adaptación y fortalecimiento de tu proyecto de vida.
              </p>
            </div>
          </div>
        </div>

        <div class="campus-vital-microcourses-subgrid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
          ${mod2Microcourses.map(res => ResourceCard.render(res)).join('')}
        </div>
      </div>
    `;
  }

  renderMountain() {
    this.scrollToTop();
    this.currentRoute = 'mountain';
    const m2 = learningCenterState.state.module2;
    // Estado de culminación de rutas basado directamente en su completitud oficial
    const r1Done = Boolean(m2.ruta1?.completed);
    const r2Done = Boolean(m2.ruta2?.completed);
    const allDone = r1Done && r2Done;
    const completedCount = [r1Done, r2Done].filter(Boolean).length;

    this.containerEl.innerHTML = `
      <section class="lc-equipaje-root m2-mountain-page animate-fade-in" aria-labelledby="mod2-mountain-heading">
        ${this.renderHeaderHtml('mountain')}

        <!-- Banner de Encabezado Institucional Módulo 2 (Diseño compacto y armónico al 100%) -->
        <div class="lc-module-header" style="margin-bottom: 0.65rem; padding-bottom: 0.35rem;">
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.25rem; font-size: 0.74rem; padding: 0.2rem 0.65rem;">
            <span>🌱</span>
            <span>MÓDULO 2 · ELEGIR EL RUMBO</span>
          </div>
          <h1 id="mod2-mountain-heading" class="lc-module-heading" style="font-size: 1.35rem; margin: 0.15rem 0 0.15rem 0;">Adaptación Universitaria y Proyecto de Vida</h1>
          <p class="lc-module-intro" style="font-size: 0.88rem; line-height: 1.45; margin: 0;">
            <strong>Propósito:</strong> Fortalecer tu adaptación universitaria y trazar tu camino a través de la reflexión sobre tu proyecto de vida.
          </p>
        </div>



        <!-- Escenario Interactivo del Sendero de la Montaña (Montado dinámicamente) -->
        <div id="mountain-trail-interactive-mount"></div>

        ${this.renderModule2MicrocoursesHtml()}

        <!-- Botones de Navegación Inferior -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem; flex-wrap: wrap; gap: 0.75rem;">
          <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
            <button type="button" class="lc-btn lc-btn-secondary" id="btn-mountain-back-to-intro" style="padding: 0.5rem 1.1rem; font-size: 0.85rem;">
              <span aria-hidden="true">←</span>
              <span>Volver a la Introducción</span>
            </button>
            <button type="button" class="lc-btn lc-btn-secondary" id="btn-mountain-reset-progress" title="Reiniciar las rutas del módulo 2 desde el inicio" style="padding: 0.5rem 1.1rem; font-size: 0.85rem; color: #64748B;">
              <span aria-hidden="true">↺</span>
              <span>Reiniciar recorrido desde el inicio</span>
            </button>
          

          </div>

          ${allDone ? `
            <button type="button" class="lc-btn lc-btn-primary animate-pulse" id="btn-mountain-goto-cierre" title="¡Ambas rutas completadas! Ir al Cierre" style="padding: 0.9rem 2.2rem; font-weight: 800; background: #00843D; box-shadow: 0 4px 16px rgba(0, 132, 61, 0.4);">
              <span>🏆 Ir al Cierre y Reconocimiento</span>
              <span aria-hidden="true">→</span>
            </button>
          ` : `
            <button type="button" class="lc-btn lc-btn-secondary" disabled aria-disabled="true" title="Debes completar las 2 rutas para habilitar la tarjeta final" style="padding: 0.9rem 2rem; font-weight: 700; opacity: 0.6; cursor: not-allowed; background: #F1F5F9; color: #94A3B8; border: 1.5px solid #CBD5E1; box-shadow: none;">
              <span aria-hidden="true">🔒</span>
              <span>Cierre de Cumbre (${completedCount}/2 rutas completadas)</span>
            </button>
          `}
        </div>
      </section>
    `;

    this.bindCommonHeaderEvents();

    // Montar la animación interactiva del Sendero de la Montaña
    const mountEl = this.containerEl.querySelector('#mountain-trail-interactive-mount');
    if (mountEl) {
      const mountainScene = new MountainTrailAnimation({
        container: mountEl,
        r1Done,
        r2Done,
        onSelectRoute: (rNum) => {
          if (rNum === 1) this.render('ruta1', 1);
          else if (rNum === 2) this.render('ruta2', 1);
        },
        onSelectCierre: () => {
          this.render('cierre');
        }
      });
      mountainScene.render();

      // Mantener la vista en la parte superior sin desplazamientos forzados
      this.scrollToTop();
    }

    const btnBackIntro = this.containerEl.querySelector('#btn-mountain-back-to-intro');
    if (btnBackIntro) {
      btnBackIntro.addEventListener('click', () => this.render('intro'));
    }

    const btnResetMt = this.containerEl.querySelector('#btn-mountain-reset-progress');
    if (btnResetMt) {
      btnResetMt.addEventListener('click', () => {
        learningCenterState.resetModule2();
        this.render('mountain');
      });
    }



    const btnGoCierre = this.containerEl.querySelector('#btn-mountain-goto-cierre');
    if (btnGoCierre) {
      btnGoCierre.addEventListener('click', () => this.render('cierre'));
    }

    // Asegurar que la vista se posicione de forma óptima sin cortar la montaña
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  // =========================================================================
  // 2. RUTA 1: CONSTRUYENDO MI PROYECTO DE VIDA (PASO 1 A 4)
  // =========================================================================
  renderRuta1(stepIndex = 1) {
    this.scrollToTop();
    this.currentRoute = 'ruta1';
    this.ruta1Step = Number(stepIndex) || 1;
    if (this.ruta1Step < 1 || this.ruta1Step > 4) this.ruta1Step = 1;

    const current = this.ruta1Step;
    const r1State = learningCenterState.state.module2.ruta1;

    this.containerEl.innerHTML = `
      <section class="lc-equipaje-root animate-fade-in" aria-labelledby="r1-title">
        ${this.renderHeaderHtml('ruta1')}

        <div class="lc-module-header">
          <div class="lc-station-num-badge" style="margin-bottom: 0.5rem; background: #00843D;">
            MÓDULO 2 · RUTA 1
          </div>
          <h2 id="r1-title" class="lc-module-heading">Construyendo mi proyecto de vida</h2>

          <div style="background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%); border: 2px solid #00843D; border-left: 6px solid #00843D; padding: 1rem 1.25rem; border-radius: 14px; margin: 0.85rem 0 1.25rem 0;">
            <strong style="font-size: 0.85rem; color: #022B14; text-transform: uppercase;">Resultado de aprendizaje:</strong>
            <p style="margin: 0.2rem 0 0 0; font-size: 1.05rem; font-weight: 800; color: #005A29;">
              Reflexionar sobre el proyecto de vida como un proceso dinámico que se fortalece con las experiencias universitarias.
            </p>
          </div>
        </div>

        <!-- Flujo Horizontal Paso a Paso -->
        <div class="horizontal-station-viewport">
          
          <div class="horizontal-station-stepper" role="navigation" aria-label="Progreso en Ruta 1">
            <button type="button" class="h-step-item ${current === 1 ? 'is-current' : (r1State?.completed || current > 1 ? 'is-completed' : '')}" data-r1-jump="1" style="cursor: pointer;" title="Ir al Paso 1: Video">
              <span>${r1State?.completed || current > 1 ? '✓' : '1.'}</span>
              <span>🎬 Video: El camino</span>
            </button>
            <span class="h-step-sep">›</span>

            <button type="button" class="h-step-item ${current === 2 ? 'is-current' : (r1State?.completed || current > 2 ? 'is-completed' : '')}" data-r1-jump="2" style="cursor: pointer;" title="Ir al Paso 2: Mi punto de partida">
              <span>${r1State?.completed || current > 2 ? '✓' : '2.'}</span>
              <span>🎁 Mi punto de partida</span>
            </button>
            <span class="h-step-sep">›</span>

            <button type="button" class="h-step-item ${current === 3 ? 'is-current' : (r1State?.completed || current > 3 ? 'is-completed' : '')}" data-r1-jump="3" style="cursor: pointer;" title="Ir al Paso 3: Cuatro Claves">
              <span>${r1State?.completed || current > 3 ? '✓' : '3.'}</span>
              <span>📖 Cuatro Claves</span>
            </button>
            <span class="h-step-sep">›</span>

            <button type="button" class="h-step-item ${current === 4 ? 'is-current' : (r1State?.completed ? 'is-completed' : '')}" data-r1-jump="4" style="cursor: pointer;" title="Ir al Paso 4: El árbol de mi proyecto">
              <span>${r1State?.completed ? '✓' : '4.'}</span>
              <span>🌳 El árbol de mi proyecto</span>
            </button>
          </div>

          <div class="h-slide-content-card" id="r1-slide-container">
            ${this.renderRuta1SlideContent(current, r1State)}
          </div>

        </div>
      </section>
    `;

    this.bindCommonHeaderEvents();
    this.bindRuta1Events(current);
  }

  renderRuta1SlideContent(current, r1State) {
    const sp = r1State.startPoint || {};
    const tr = r1State.tree || {};

    switch (current) {
      case 1:
        return `
          <!-- PASO 1: VIDEO INTRODUCTORIO "¿HACIA DÓNDE QUIERO CAMINAR?" -->
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.85rem;">
            <span>PASO 1 DE 4</span> · <span>VIDEO INTRODUCTORIO</span>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <h3 style="font-size: 1.3rem; font-weight: 800; color: #005A29; margin: 0 0 0.35rem 0;">
              Video: "¿Hacia dónde quiero caminar?"
            </h3>
            <p style="margin: 0; color: #475569; font-size: 0.95rem; line-height: 1.6;">
              Observa el video reflexivo sobre cómo el ingreso a la universidad aporta a la construcción de tu proyecto de vida:
            </p>
          </div>

          <!-- Reproductor de Video YouTube Responsivo -->
          <div class="lc-embed-card" style="box-shadow: none; border: 1.5px solid #CBD5E1;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.3rem;">🎬</span>
                <strong style="color: #0F172A; font-size: 1.05rem;">Video Oficial Campus Vital · Módulo 2</strong>
              </div>
              <a href="https://youtu.be/cRtBdJcFVzc" target="_blank" rel="noopener noreferrer" class="lc-media-alt-btn">
                <span>↗ Ver en YouTube</span>
              </a>
            </div>

            <div class="lc-embed-frame-wrapper" style="margin-top: 0.85rem; aspect-ratio: 16/9; background: #000;">
              <iframe 
                src="https://www.youtube-nocookie.com/embed/cRtBdJcFVzc" 
                title="¿Hacia dónde quiero caminar? - Campus Vital TdeA" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
                style="width: 100%; height: 100%; border: none;"
              ></iframe>
            </div>

            <!-- Transcripción / Narración del Video -->
            <div style="margin-top: 1rem; background: #F8FAFC; border-radius: 10px; padding: 1rem; border: 1px solid #E2E8F0;">
              <strong style="color: #0F172A; font-size: 0.9rem;">📝 Narración del video:</strong>
              <p style="margin: 0.4rem 0 0 0; font-size: 0.92rem; color: #334155; line-height: 1.6; font-style: italic;">
                “Ingresar a la universidad no solo implica aprender una profesión. También significa descubrir nuevas capacidades, afrontar desafíos y tomar decisiones que aportan a la construcción de tu proyecto de vida. Tu proyecto de vida no está completamente escrito. Se transforma con cada experiencia, cada aprendizaje y cada decisión que tomas…”
              </p>
            </div>
          </div>

          <div class="h-slide-actions-bar">
            <button type="button" class="lc-btn lc-btn-secondary" id="btn-r1-back-to-menu">
              <span aria-hidden="true">←</span>
              <span>Volver a Selección de Rutas</span>
            </button>

            <button type="button" class="lc-btn lc-btn-primary" id="btn-r1-next" style="padding: 0.95rem 2.2rem; font-weight: 800;">
              <span>Continuar a: Mi punto de partida</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        `;

      case 2:
        return `
          <!-- PASO 2: ACTIVIDAD - MI PUNTO DE PARTIDA (CANVA + 3 CAJAS) -->
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.85rem;">
            <span>PASO 2 DE 4</span> · <span>ACTIVIDAD INTERACTIVA · MI PUNTO DE PARTIDA</span>
          </div>

          <div class="lc-instruction-banner" style="margin-bottom: 1.25rem;">
            <div class="lc-banner-icon" aria-hidden="true">🎁</div>
            <div class="lc-banner-text">
              <strong style="font-size: 1.15rem; color: #005A29;">Selecciona una caja y responde la pregunta</strong>
              <p style="margin: 0.35rem 0 0 0; line-height: 1.5; color: #334155;">
                Interactúa con la presentación interactiva de Canva y registra tus respuestas personales en las 3 cajas de reflexión para calibrar tu punto de partida:
              </p>
            </div>
          </div>

          <!-- Embed Canva de Cajas Interactivas -->
          <div class="lc-embed-card" style="box-shadow: none; border: 1.5px solid #CBD5E1; margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.3rem;">✨</span>
                <strong style="color: #0F172A; font-size: 1.05rem;">Presentación Interactiva de Cajas</strong>
              </div>
              <a href="https://canva.link/zo851wvhygwsmp4" target="_blank" rel="noopener noreferrer" class="lc-media-alt-btn">
                <span>↗ Abrir en Canva Pantalla Completa</span>
              </a>
            </div>

            <div class="lc-embed-frame-wrapper" style="margin-top: 0.85rem;">
              <iframe 
                loading="lazy" 
                src="https://www.canva.com/design/DAHXV-acz1E/reyP00w4z7-5PJjz0WwOgA/view?embed" 
                title="Presentación Interactiva - Selecciona una caja" 
                allowfullscreen="allowfullscreen" 
                allow="fullscreen"
              ></iframe>
            </div>
          </div>

          <!-- 3 Cajas Reflexivas Interactivas -->
          <h4 style="font-size: 1.15rem; font-weight: 800; color: #022B14; margin: 0 0 1rem 0;">
            Escribe tus respuestas a cada pregunta:
          </h4>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            
            <div class="lc-content-card" style="border: 2px solid #A7F3D0; background: #FFFFFF; padding: 1.25rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                <span style="font-size: 1.5rem;">🎁</span>
                <strong style="color: #005A29; font-size: 1rem;">Caja 1: Mi Motivación</strong>
              </div>
              <label for="input-r1-q1" style="font-size: 0.9rem; font-weight: 700; color: #1E293B; display: block; margin-bottom: 0.5rem;">
                ¿Qué te motivó a ingresar a la universidad?
              </label>
              <textarea 
                id="input-r1-q1" 
                class="lc-textarea-spacious" 
                rows="3" 
                placeholder="Comparte las motivaciones personales, familiares o profesionales que te impulsaron..."
              >${sp.question1 || ''}</textarea>
            </div>

            <div class="lc-content-card" style="border: 2px solid #BAE6FD; background: #FFFFFF; padding: 1.25rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                <span style="font-size: 1.5rem;">🎯</span>
                <strong style="color: #0369A1; font-size: 1rem;">Caja 2: Mis Expectativas</strong>
              </div>
              <label for="input-r1-q2" style="font-size: 0.9rem; font-weight: 700; color: #1E293B; display: block; margin-bottom: 0.5rem;">
                ¿Qué esperas lograr durante esta etapa?
              </label>
              <textarea 
                id="input-r1-q2" 
                class="lc-textarea-spacious" 
                rows="3" 
                placeholder="Logros académicos, nuevas amistades, crecimiento personal o profesional..."
              >${sp.question2 || ''}</textarea>
            </div>

            <div class="lc-content-card" style="border: 2px solid #DDD6FE; background: #FFFFFF; padding: 1.25rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                <span style="font-size: 1.5rem;">💪</span>
                <strong style="color: #6D28D9; font-size: 1rem;">Caja 3: Mis Fortalezas</strong>
              </div>
              <label for="input-r1-q3" style="font-size: 0.9rem; font-weight: 700; color: #1E293B; display: block; margin-bottom: 0.5rem;">
                ¿Qué fortalezas reconoces en ti?
              </label>
              <textarea 
                id="input-r1-q3" 
                class="lc-textarea-spacious" 
                rows="3" 
                placeholder="Perseverancia, curiosidad, empatía, organización, creatividad..."
              >${sp.question3 || ''}</textarea>
            </div>

          </div>

          <div class="h-slide-actions-bar">
            <button type="button" class="lc-btn lc-btn-secondary" id="btn-r1-prev">
              <span aria-hidden="true">←</span>
              <span>Anterior: Video</span>
            </button>

            <button type="button" class="lc-btn lc-btn-primary" id="btn-r1-next" style="padding: 0.95rem 2.2rem; font-weight: 800;">
              <span>Continuar a: Cuatro Claves</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        `;

      case 3:
        return `
          <!-- PASO 3: EBOOK E INFOGRAFÍA INTERACTIVA (4 CLAVES) -->
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.85rem;">
            <span>PASO 3 DE 4</span> · <span>EBOOK E INFOGRAFÍA INTERACTIVA</span>
          </div>

          <!-- Banner Oficial: Descargar Ebook / Infografía en PDF -->
          <div class="lc-content-card" style="border: 2px solid #93C5FD; background: linear-gradient(180deg, #FFFFFF 0%, #EFF6FF 100%); margin-bottom: 1.25rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
              <div style="display: flex; align-items: center; gap: 0.85rem;">
                <span style="font-size: 2.2rem;">📖</span>
                <div>
                  <h4 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #1E40AF;">
                    Ebook e Infografía interactiva (PDF descargable)
                  </h4>
                  <p style="margin: 0.2rem 0 0 0; font-size: 0.88rem; color: #334155;">
                    Documento oficial con las cuatro claves fundamentales para comprender tu proyecto de vida:
                  </p>
                </div>
              </div>

              <a 
                href="assets/campusVital/docs/infografia_cuatro_claves_proyecto_vida.pdf" 
                download="Infografia_Cuatro_Claves_Proyecto_de_Vida_TdeA.pdf" 
                class="lc-btn lc-btn-primary"
                style="padding: 0.75rem 1.4rem; font-weight: 800; display: inline-flex; align-items: center; gap: 0.45rem; background: #0284C7; border-color: #0284C7;"
              >
                <span>📥 Descargar Ebook / Infografía (PDF)</span>
              </a>
            </div>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <h3 style="font-size: 1.3rem; font-weight: 800; color: #005A29; margin: 0 0 0.35rem 0;">
              Cuatro claves para comprender tu proyecto de vida
            </h3>
            <p style="margin: 0; color: #475569; font-size: 0.95rem; line-height: 1.6;">
              Explora los 4 principios fundamentales que te permitirán concebir tu proyecto de vida como una construcción flexible y en constante enriquecimiento:
            </p>
          </div>

          <!-- Embed Canva de Infografía 4 Claves -->
          <div class="lc-embed-card" style="box-shadow: none; border: 1.5px solid #CBD5E1; margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.3rem;">📖</span>
                <strong style="color: #0F172A; font-size: 1.05rem;">Infografía: Cuatro Claves del Proyecto de Vida</strong>
              </div>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <a 
                  href="assets/campusVital/docs/infografia_cuatro_claves_proyecto_vida.pdf" 
                  download="Infografia_Cuatro_Claves_Proyecto_de_Vida_TdeA.pdf" 
                  class="lc-media-alt-btn"
                  style="background: #0284C7; color: #FFFFFF; font-weight: 700; border-color: #0284C7;"
                >
                  <span>📥 Descargar PDF</span>
                </a>
                <a href="https://canva.link/anchabllssdpfpc" target="_blank" rel="noopener noreferrer" class="lc-media-alt-btn">
                  <span>↗ Pantalla Completa Canva</span>
                </a>
              </div>
            </div>

            <div class="lc-embed-frame-wrapper" style="margin-top: 0.85rem;">
              <iframe 
                loading="lazy" 
                src="https://www.canva.com/design/DAHXWEpduLc/eiOzQb8Ul5MLsHHkzfjBNQ/view?embed" 
                title="Cuatro claves para comprender tu proyecto de vida" 
                allowfullscreen="allowfullscreen" 
                allow="fullscreen"
              ></iframe>
            </div>
          </div>

          <!-- Cuatro Claves Desglosadas Accesibles DUA -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            
            <div class="lc-content-card" style="border-left: 5px solid #00843D; background: #FFFFFF; padding: 1.15rem;">
              <strong style="color: #005A29; font-size: 1.05rem; display: block; margin-bottom: 0.35rem;">
                1. El proyecto de vida es dinámico
              </strong>
              <p style="margin: 0; font-size: 0.88rem; color: #475569; line-height: 1.5;">
                No es un plan fijo ni definitivo. Es un proceso que evoluciona a medida que conoces nuevas personas, desarrollas habilidades y descubres intereses.
              </p>
            </div>

            <div class="lc-content-card" style="border-left: 5px solid #0284C7; background: #FFFFFF; padding: 1.15rem;">
              <strong style="color: #0369A1; font-size: 1.05rem; display: block; margin-bottom: 0.35rem;">
                2. Cambia con las experiencias
              </strong>
              <p style="margin: 0; font-size: 0.88rem; color: #475569; line-height: 1.5;">
                Cada vivencia aporta aprendizajes que pueden transformar tus decisiones. Los logros, retos y hasta tropiezos hacen parte del camino y te ayudan a crecer.
              </p>
            </div>

            <div class="lc-content-card" style="border-left: 5px solid #7C3AED; background: #FFFFFF; padding: 1.15rem;">
              <strong style="color: #6D28D9; font-size: 1.05rem; display: block; margin-bottom: 0.35rem;">
                3. Integra múltiples dimensiones
              </strong>
              <p style="margin: 0; font-size: 0.88rem; color: #475569; line-height: 1.5;">
                Incluye metas personales, familiares, académicas y profesionales. No solo es un título; abarca tus afectos, tu salud y tu bienestar integral.
              </p>
            </div>

            <div class="lc-content-card" style="border-left: 5px solid #EA580C; background: #FFFFFF; padding: 1.15rem;">
              <strong style="color: #C2410C; font-size: 1.05rem; display: block; margin-bottom: 0.35rem;">
                4. Se construye paso a paso
              </strong>
              <p style="margin: 0; font-size: 0.88rem; color: #475569; line-height: 1.5;">
                Se teje con las decisiones y acciones del día a día. Cada semestre y cada experiencia representan una oportunidad para avanzar hacia tus metas.
              </p>
            </div>

          </div>

          <div class="h-slide-actions-bar">
            <button type="button" class="lc-btn lc-btn-secondary" id="btn-r1-prev">
              <span aria-hidden="true">←</span>
              <span>Anterior: Mi punto de partida</span>
            </button>

            <button type="button" class="lc-btn lc-btn-primary" id="btn-r1-next" style="padding: 0.95rem 2.2rem; font-weight: 800;">
              <span>Continuar a: El árbol de mi proyecto</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        `;

      case 4:
        return `
          <!-- PASO 4: ACTIVIDAD - EL ÁRBOL DE MI PROYECTO DE VIDA -->
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.85rem;">
            <span>PASO 4 DE 4</span> · <span>ACTIVIDAD CREATIVA · EL ÁRBOL DE MI PROYECTO</span>
          </div>

          <!-- GUÍA VISUAL ILUSTRADA: EL ÁRBOL COLOREADO CON CADA UNA DE SUS PARTES -->
          <div class="arbol-visual-card">
            <div class="arbol-visual-header">
              <div style="display: flex; align-items: center; gap: 0.85rem;">
                <span style="font-size: 2.2rem;">🌳</span>
                <div>
                  <h3 style="margin: 0; font-size: 1.35rem; font-weight: 800; color: #005A29;">
                    El Árbol de mi Proyecto de Vida · Guía Visual Ilustrada
                  </h3>
                  <p style="margin: 0.2rem 0 0 0; font-size: 0.95rem; color: #475569;">
                    Identifica qué representa cada parte del árbol en tu trayectoria universitaria y personal:
                  </p>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                <span style="background: #E8F5E9; color: #00843D; font-weight: 800; font-size: 0.85rem; padding: 0.35rem 0.9rem; border-radius: 9999px; border: 1.5px solid #A7F3D0;">
                  🌱 4 DIMENSIONES CLAVE
                </span>
                <a 
                  href="assets/campusVital/images/arbol_recortado_puro.png" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="lc-media-alt-btn"
                  style="background: #00843D; color: #FFFFFF; font-weight: 700; border-color: #00843D; padding: 0.4rem 0.9rem; font-size: 0.82rem;"
                >
                  <span>🔍 Ver ilustración en HD</span>
                </a>
              </div>
            </div>

            <div class="arbol-layout-grid">
              <!-- Columna Izquierda: Ramas y Raíces -->
              <div class="arbol-side-col">
                <div class="arbol-info-card arbol-card-branches">
                  <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
                    <span style="font-size: 1.4rem;">🍃</span>
                    <strong style="color: #15803D; font-size: 1.05rem;">En las Ramas: Metas</strong>
                  </div>
                  <p style="margin: 0; font-size: 0.9rem; color: #14532D; line-height: 1.5;">
                    Objetivos concretos a alcanzar a corto y mediano plazo durante tu formación universitaria.
                  </p>
                </div>

                <div class="arbol-info-card arbol-card-roots">
                  <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
                    <span style="font-size: 1.4rem;">🌿</span>
                    <strong style="color: #0F766E; font-size: 1.05rem;">En las Raíces: Valores</strong>
                  </div>
                  <p style="margin: 0; font-size: 0.9rem; color: #115E59; line-height: 1.5;">
                    Principios éticos, convicciones profundas y raíces familiares o personales que te dan firmeza.
                  </p>
                </div>
              </div>

              <!-- Centro: Árbol Ilustrado con Badges Flotantes Pinned -->
              <div class="arbol-stage-wrapper">
                <img 
                  src="assets/campusVital/images/arbol_recortado_puro.png" 
                  alt="Árbol ilustrado de mi proyecto de vida" 
                  class="arbol-img-main" 
                />
                
                <!-- Badge Flotante Frutos -->
                <div class="arbol-zone-pill pill-fruits" title="Zona superior: Frutos = Sueños">
                  <span style="font-size: 1.35rem;">🍎</span>
                  <div>
                    <strong style="display: block; font-size: 0.88rem; color: #BE123C; line-height: 1.1;">SUEÑOS</strong>
                    <span style="font-size: 0.75rem; color: #881337; font-weight: 600;">En los Frutos</span>
                  </div>
                </div>

                <!-- Badge Flotante Ramas -->
                <div class="arbol-zone-pill pill-branches" title="Zona media-alta: Ramas = Metas">
                  <span style="font-size: 1.35rem;">🍃</span>
                  <div>
                    <strong style="display: block; font-size: 0.88rem; color: #15803D; line-height: 1.1;">METAS</strong>
                    <span style="font-size: 0.75rem; color: #14532D; font-weight: 600;">En las Ramas</span>
                  </div>
                </div>

                <!-- Badge Flotante Tronco -->
                <div class="arbol-zone-pill pill-trunk" title="Zona media-baja: Tronco = Fortalezas">
                  <span style="font-size: 1.35rem;">🪵</span>
                  <div>
                    <strong style="display: block; font-size: 0.88rem; color: #B45309; line-height: 1.1;">FORTALEZAS</strong>
                    <span style="font-size: 0.75rem; color: #78350F; font-weight: 600;">En el Tronco</span>
                  </div>
                </div>

                <!-- Badge Flotante Raíces -->
                <div class="arbol-zone-pill pill-roots" title="Zona base: Raíces = Valores">
                  <span style="font-size: 1.35rem;">🌿</span>
                  <div>
                    <strong style="display: block; font-size: 0.88rem; color: #0F766E; line-height: 1.1;">VALORES</strong>
                    <span style="font-size: 0.75rem; color: #115E59; font-weight: 600;">En las Raíces</span>
                  </div>
                </div>
              </div>

              <!-- Columna Derecha: Frutos y Tronco -->
              <div class="arbol-side-col">
                <div class="arbol-info-card arbol-card-fruits">
                  <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
                    <span style="font-size: 1.4rem;">🍎</span>
                    <strong style="color: #BE123C; font-size: 1.05rem;">En los Frutos: Sueños</strong>
                  </div>
                  <p style="margin: 0; font-size: 0.9rem; color: #881337; line-height: 1.5;">
                    Aspiraciones, anhelos e ilusiones que deseas cosechar con tu esfuerzo y dedicación.
                  </p>
                </div>

                <div class="arbol-info-card arbol-card-trunk">
                  <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
                    <span style="font-size: 1.4rem;">🪵</span>
                    <strong style="color: #B45309; font-size: 1.05rem;">En el Tronco: Fortalezas</strong>
                  </div>
                  <p style="margin: 0; font-size: 0.9rem; color: #78350F; line-height: 1.5;">
                    Capacidades, habilidades, talentos y actitudes que te dan soporte en momentos de reto.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Banner para Descargar el PDF Ilustrado Oficial -->
          <div class="lc-content-card" style="border: 2px solid #A7F3D0; background: linear-gradient(180deg, #FFFFFF 0%, #F0FDF4 100%); margin-bottom: 1.25rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
              <div style="display: flex; align-items: center; gap: 0.85rem;">
                <span style="font-size: 2.2rem;">🌳</span>
                <div>
                  <h4 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #005A29;">
                    Diseño para Imprimir: El árbol de mi proyecto de vida
                  </h4>
                  <p style="margin: 0.2rem 0 0 0; font-size: 0.88rem; color: #334155;">
                    Gráfico oficial descargable en PDF para imprimir y rellenar a mano si lo prefieres:
                  </p>
                </div>
              </div>

              <a 
                href="assets/campusVital/docs/arbol_proyecto_vida.pdf" 
                download="Arbol_Proyecto_de_Vida_TdeA.pdf" 
                class="lc-btn lc-btn-primary"
                style="padding: 0.75rem 1.4rem; font-weight: 800; display: inline-flex; align-items: center; gap: 0.4rem;"
              >
                <span>📥 Descargar Árbol (PDF)</span>
              </a>
            </div>
          </div>

          <!-- Lienzo Digital DUA: El Árbol Interactivo -->
          <div class="lc-content-card" style="border: 2px solid #CBD5E1; padding: 1.5rem; margin-bottom: 1.5rem; background: #FFFFFF;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
              <span style="font-size: 1.4rem;">🎨</span>
              <strong style="font-size: 1.15rem; color: #022B14;">
                Dibuja y escribe tu árbol digitalmente:
              </strong>
            </div>
            <p style="margin: 0 0 1.25rem 0; font-size: 0.95rem; color: #475569; line-height: 1.5;">
              Completa cada parte de tu árbol con tus reflexiones. Tus respuestas se guardan automáticamente en tu bitácora de Campus Vital:
            </p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.15rem; margin-bottom: 1.5rem;">
              
              <!-- FRUTOS: SUEÑOS -->
              <div style="background: #FFF1F2; border: 1.5px solid #FECDD3; border-radius: 12px; padding: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.4rem;">
                  <span style="font-size: 1.3rem;">🍎</span>
                  <strong style="color: #BE123C; font-size: 0.98rem;">En los Frutos: Sueños</strong>
                </div>
                <p style="margin: 0 0 0.5rem 0; font-size: 0.8rem; color: #881337;">
                  Aspiraciones, anhelos e ilusiones que deseas cosechar.
                </p>
                <textarea 
                  id="tree-fruits" 
                  class="lc-textarea-spacious" 
                  rows="3" 
                  placeholder="Mis mayores sueños universitarios y personales..."
                >${tr.fruits || ''}</textarea>
              </div>

              <!-- RAMAS: METAS -->
              <div style="background: #F0FDF4; border: 1.5px solid #BBF7D0; border-radius: 12px; padding: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.4rem;">
                  <span style="font-size: 1.3rem;">🍃</span>
                  <strong style="color: #15803D; font-size: 0.98rem;">En las Ramas: Metas</strong>
                </div>
                <p style="margin: 0 0 0.5rem 0; font-size: 0.8rem; color: #14532D;">
                  Objetivos concretos a alcanzar a corto y mediano plazo.
                </p>
                <textarea 
                  id="tree-branches" 
                  class="lc-textarea-spacious" 
                  rows="3" 
                  placeholder="Aprobar mis asignaturas, integrarme, graduarme..."
                >${tr.branches || ''}</textarea>
              </div>

              <!-- TRONCO: FORTALEZAS -->
              <div style="background: #FEF3C7; border: 1.5px solid #FDE68A; border-radius: 12px; padding: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.4rem;">
                  <span style="font-size: 1.3rem;">🪵</span>
                  <strong style="color: #B45309; font-size: 0.98rem;">En el Tronco: Fortalezas</strong>
                </div>
                <p style="margin: 0 0 0.5rem 0; font-size: 0.8rem; color: #78350F;">
                  Capacidades, habilidades y actitudes que te dan soporte.
                </p>
                <textarea 
                  id="tree-trunk" 
                  class="lc-textarea-spacious" 
                  rows="3" 
                  placeholder="Disciplina, empatía, curiosidad, resiliencia..."
                >${tr.trunk || ''}</textarea>
              </div>

              <!-- RAÍCES: VALORES -->
              <div style="background: #EDE9FE; border: 1.5px solid #DDD6FE; border-radius: 12px; padding: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.4rem;">
                  <span style="font-size: 1.3rem;">🌿</span>
                  <strong style="color: #6D28D9; font-size: 0.98rem;">En las Raíces: Valores</strong>
                </div>
                <p style="margin: 0 0 0.5rem 0; font-size: 0.8rem; color: #4C1D95;">
                  Principios éticos y convicciones que te dan firmeza.
                </p>
                <textarea 
                  id="tree-roots" 
                  class="lc-textarea-spacious" 
                  rows="3" 
                  placeholder="Honestidad, solidaridad, respeto, compromiso..."
                >${tr.roots || ''}</textarea>
              </div>

            </div>

            <!-- Pregunta de Reflexión Semestral -->
            <div style="background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 12px; padding: 1.25rem;">
              <label for="tree-reflection" style="font-size: 1.05rem; font-weight: 800; color: #022B14; display: block; margin-bottom: 0.5rem;">
                🤔 Reflexión: ¿Qué aspecto de tu proyecto de vida quieres fortalecer durante este semestre?
              </label>
              <textarea 
                id="tree-reflection" 
                class="lc-textarea-spacious" 
                rows="3" 
                placeholder="Escribe aquí el compromiso contigo mismo para este semestre..."
              >${tr.reflection || ''}</textarea>
            </div>
          </div>

          <!-- Insignia de Logro de Ruta 1 -->
          <div class="lc-content-card" style="background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); border: 2px solid #00843D; text-align: center; padding: 1.75rem 1.5rem; margin-bottom: 1.5rem;">
            <div style="font-size: 2.5rem; margin-bottom: 0.35rem;">🎉</div>
            <h3 style="font-size: 1.35rem; font-weight: 800; color: #005A29; margin: 0 0 0.35rem 0;">
              ¡Has completado la Ruta 1!
            </h3>
            <p style="margin: 0 auto 1rem auto; max-width: 550px; font-size: 0.95rem; color: #065F46;">
              Has reflexionado sobre tus motivaciones, identificado las 4 claves del proyecto de vida y construido tu árbol personal.
            </p>
            <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: #ffffff; padding: 0.45rem 1.2rem; border-radius: 9999px; font-weight: 800; color: #00843D; box-shadow: 0 2px 8px rgba(0, 132, 61, 0.15);">
              <span>✓ Ruta 1 completada con éxito</span>
            </div>
          </div>

          <div class="h-slide-actions-bar">
            <button type="button" class="lc-btn lc-btn-secondary" id="btn-r1-prev">
              <span aria-hidden="true">←</span>
              <span>Anterior: Cuatro Claves</span>
            </button>

            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <button type="button" class="lc-btn lc-btn-primary animate-pulse" id="btn-r1-finish-to-mountain" style="padding: 0.95rem 2.4rem; font-weight: 800; background: #00843D; box-shadow: 0 4px 16px rgba(0, 132, 61, 0.35);">
                <span>🏔️ Volver a la Montaña para la Ruta 2</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        `;

      default:
        return '';
    }
  }

  bindRuta1Events(current) {
    // Saltos del stepper horizontal: libre navegación a cualquier actividad
    const jumps = this.containerEl.querySelectorAll('[data-r1-jump]');
    jumps.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = Number(btn.getAttribute('data-r1-jump'));
        this.renderRuta1(target);
      });
    });

    const btnBackMenu = this.containerEl.querySelector('#btn-r1-back-to-menu');
    if (btnBackMenu) {
      btnBackMenu.addEventListener('click', () => {
        if (current === 4) {
          learningCenterState.completeModule2Ruta1();
        }
        this.render('mountain');
      });
    }

    const btnPrev = this.containerEl.querySelector('#btn-r1-prev');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (this.ruta1Step > 1) {
          this.renderRuta1(this.ruta1Step - 1);
        }
      });
    }

    const btnNext = this.containerEl.querySelector('#btn-r1-next');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (this.ruta1Step < 4) {
          this.renderRuta1(this.ruta1Step + 1);
        }
      });
    }

    // Guardado de campos según el paso
    if (current === 2) {
      const q1 = this.containerEl.querySelector('#input-r1-q1');
      const q2 = this.containerEl.querySelector('#input-r1-q2');
      const q3 = this.containerEl.querySelector('#input-r1-q3');

      if (q1) q1.addEventListener('input', () => learningCenterState.setModule2StartPoint('question1', q1.value));
      if (q2) q2.addEventListener('input', () => learningCenterState.setModule2StartPoint('question2', q2.value));
      if (q3) q3.addEventListener('input', () => learningCenterState.setModule2StartPoint('question3', q3.value));
    } else if (current === 4) {
      const fRoots = this.containerEl.querySelector('#tree-roots');
      const fTrunk = this.containerEl.querySelector('#tree-trunk');
      const fBranches = this.containerEl.querySelector('#tree-branches');
      const fFruits = this.containerEl.querySelector('#tree-fruits');
      const fRef = this.containerEl.querySelector('#tree-reflection');

      if (fRoots) fRoots.addEventListener('input', () => learningCenterState.setModule2TreeField('roots', fRoots.value));
      if (fTrunk) fTrunk.addEventListener('input', () => learningCenterState.setModule2TreeField('trunk', fTrunk.value));
      if (fBranches) fBranches.addEventListener('input', () => learningCenterState.setModule2TreeField('branches', fBranches.value));
      if (fFruits) fFruits.addEventListener('input', () => learningCenterState.setModule2TreeField('fruits', fFruits.value));
      if (fRef) fRef.addEventListener('input', () => learningCenterState.setModule2TreeField('reflection', fRef.value));

      // Botón para completar Ruta 1 y volver a la montaña para continuar
      const btnFinishR1 = this.containerEl.querySelector('#btn-r1-finish-to-mountain') || this.containerEl.querySelector('#btn-r1-back-to-menu');
      if (btnFinishR1) {
        btnFinishR1.addEventListener('click', () => {
          // Guardar valores antes de completar
          const fRoots = this.containerEl.querySelector('#tree-roots');
          const fTrunk = this.containerEl.querySelector('#tree-trunk');
          const fBranches = this.containerEl.querySelector('#tree-branches');
          const fFruits = this.containerEl.querySelector('#tree-fruits');
          const fRef = this.containerEl.querySelector('#tree-reflection');
          if (fRoots) learningCenterState.setModule2TreeField('roots', fRoots.value);
          if (fTrunk) learningCenterState.setModule2TreeField('trunk', fTrunk.value);
          if (fBranches) learningCenterState.setModule2TreeField('branches', fBranches.value);
          if (fFruits) learningCenterState.setModule2TreeField('fruits', fFruits.value);
          if (fRef) learningCenterState.setModule2TreeField('reflection', fRef.value);

          learningCenterState.completeModule2Ruta1();
          this.render('mountain');
        });
      }
    }
  }

  // =========================================================================
  // 3. RUTA 2: ADAPTACIÓN A LA VIDA UNIVERSITARIA (PASO 1 A 4)
  // =========================================================================
  renderRuta2(stepIndex = 1) {
    this.scrollToTop();
    this.currentRoute = 'ruta2';
    this.ruta2Step = Number(stepIndex) || 1;
    if (this.ruta2Step < 1 || this.ruta2Step > 4) this.ruta2Step = 1;

    const current = this.ruta2Step;
    const r2State = learningCenterState.state.module2.ruta2;

    this.containerEl.innerHTML = `
      <section class="lc-equipaje-root animate-fade-in" aria-labelledby="r2-title">
        ${this.renderHeaderHtml('ruta2')}

        <div class="lc-module-header">
          <div class="lc-station-num-badge" style="margin-bottom: 0.5rem; background: #0284C7;">
            MÓDULO 2 · RUTA 2
          </div>
          <h2 id="r2-title" class="lc-module-heading">Adaptación a la vida universitaria</h2>

          <div style="background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%); border: 2px solid #0284C7; border-left: 6px solid #0284C7; padding: 1rem 1.25rem; border-radius: 14px; margin: 0.85rem 0 1.25rem 0;">
            <strong style="font-size: 0.85rem; color: #0369A1; text-transform: uppercase;">Resultado de aprendizaje:</strong>
            <p style="margin: 0.2rem 0 0 0; font-size: 1.05rem; font-weight: 800; color: #075985;">
              Reconocer los principales cambios, retos y oportunidades que implica el ingreso a la universidad, fortaleciendo estrategias para afrontar esta nueva etapa de manera saludable.
            </p>
          </div>
        </div>

        <!-- Flujo Horizontal Paso a Paso -->
        <div class="horizontal-station-viewport">
          
          <div class="horizontal-station-stepper" role="navigation" aria-label="Progreso en Ruta 2">
            <button type="button" class="h-step-item ${current === 1 ? 'is-current' : (r2State?.completed || current > 1 ? 'is-completed' : '')}" data-r2-jump="1" style="cursor: pointer;" title="Ir al Paso 1: Podcast">
              <span>${r2State?.completed || current > 1 ? '✓' : '1.'}</span>
              <span>🎧 Podcast</span>
            </button>
            <span class="h-step-sep">›</span>

            <button type="button" class="h-step-item ${current === 2 ? 'is-current' : (r2State?.completed || current > 2 ? 'is-completed' : '')}" data-r2-jump="2" style="cursor: pointer;" title="Ir al Paso 2: Termómetro & Daniel">
              <span>${r2State?.completed || current > 2 ? '✓' : '2.'}</span>
              <span>🌡️ Termómetro & Daniel</span>
            </button>
            <span class="h-step-sep">›</span>

            <button type="button" class="h-step-item ${current === 3 ? 'is-current' : (r2State?.completed || current > 3 ? 'is-completed' : '')}" data-r2-jump="3" style="cursor: pointer;" title="Ir al Paso 3: Plan de Adaptación">
              <span>${r2State?.completed || current > 3 ? '✓' : '3.'}</span>
              <span>📋 Plan de Adaptación</span>
            </button>
            <span class="h-step-sep">›</span>

            <button type="button" class="h-step-item ${current === 4 ? 'is-current' : (r2State?.completed ? 'is-completed' : '')}" data-r2-jump="4" style="cursor: pointer;" title="Ir al Paso 4: Infografía y Cierre">
              <span>${r2State?.completed ? '✓' : '4.'}</span>
              <span>🏆 Infografía y Cierre</span>
            </button>
          </div>

          <div class="h-slide-content-card" id="r2-slide-container">
            ${this.renderRuta2SlideContent(current, r2State)}
          </div>

        </div>
      </section>
    `;

    this.bindCommonHeaderEvents();
    this.bindRuta2Events(current);
  }

  renderRuta2SlideContent(current, r2State) {
    const th = r2State.thermometer || { textAnswers: {} };
    const dc = r2State.danielCase || {};
    const ap = r2State.adaptationPlan || {};

    switch (current) {
      case 1:
        return `
          <!-- PASO 1: AUDIO PODCAST "¿QUÉ SIGNIFICA ADAPTARSE A LA VIDA UNIVERSITARIA?" -->
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.85rem;">
            <span>PASO 1 DE 4</span> · <span>AUDIO PODCAST · ADAPTACIÓN UNIVERSITARIA</span>
          </div>

          <div class="lc-dua-audio-card" role="region" aria-label="Podcast de Adaptación a la Vida Universitaria">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.4rem;">🎧</span>
                <strong style="color: #0F172A; font-size: 1.05rem;">Podcast: ¿Qué significa adaptarse a la vida universitaria?</strong>
              </div>
              <span style="font-size: 0.78rem; font-weight: 800; background: #E0F2FE; padding: 0.2rem 0.55rem; border-radius: 6px; color: #0369A1;">
                PODCAST OFICIAL · MÓDULO 2
              </span>
            </div>

            <audio id="podcast-mod2-audio" preload="metadata" src="assets/campusVital/audio/podcast_modulo2.mp3"></audio>

            <div class="lc-audio-controls-row">
              <button type="button" class="lc-btn-audio-play" id="btn-podcast-m2-play" aria-label="Reproducir podcast">
                <span id="podcast-m2-play-icon">▶</span>
              </button>

              <div class="lc-audio-time-track">
                <input type="range" class="lc-audio-scrubber" id="podcast-m2-scrubber" min="0" max="100" value="0" aria-label="Progreso del podcast">
                <div class="lc-audio-times">
                  <span id="podcast-m2-current-time">00:00</span>
                  <span id="podcast-m2-total-time">--:--</span>
                </div>
              </div>

              <div class="lc-audio-tools-col">
                <button type="button" class="lc-audio-speed-btn" id="btn-podcast-m2-speed" title="Ajustar velocidad">1.0x</button>
                <button type="button" class="lc-media-alt-btn" id="btn-podcast-m2-transcript-toggle">
                  <span>📝 Transcripción</span>
                </button>
              </div>
            </div>

            <!-- Transcripción Oficial del Podcast -->
            <div id="podcast-m2-transcript-content" class="lc-transcript-box" style="display: none; margin-top: 1rem;">
              <strong style="color: #022B14; font-size: 1rem;">Transcripción Oficial del Podcast:</strong>
              
              <p style="margin: 0.5rem 0 0 0; line-height: 1.6; color: #334155;">
                <strong>¿Qué significa adaptarse a la vida universitaria?</strong><br>
                La adaptación universitaria es un proceso gradual que implica conocer un nuevo entorno, asumir responsabilidades, desarrollar hábitos de estudio y establecer nuevas relaciones. Cada estudiante vive este proceso de manera diferente y a su propio ritmo.
              </p>

              <p style="margin: 0.5rem 0 0 0; line-height: 1.6; color: #334155;">
                <strong>Cambios que puedes experimentar:</strong><br>
                Ingresar a la universidad puede traer cambios en diferentes aspectos de la vida: Organización del tiempo, Exigencias académicas, Relaciones sociales, Mayor autonomía, Responsabilidades personales y familiares, y Manejo de emociones frente a nuevos desafíos. Reconocer estos cambios es el primer paso para afrontarlos.
              </p>

              <p style="margin: 0.5rem 0 0 0; line-height: 1.6; color: #334155;">
                <strong>Los desafíos también hacen parte del aprendizaje:</strong><br>
                Es normal sentir incertidumbre, cometer errores o enfrentar dificultades durante los primeros semestres. Estas experiencias pueden convertirse en oportunidades para desarrollar nuevas habilidades y fortalecer la confianza en tus capacidades.
              </p>

              <p style="margin: 0.5rem 0 0 0; line-height: 1.6; color: #334155;">
                <strong>Estrategias para favorecer la adaptación:</strong><br>
                • Organizar el tiempo de estudio.<br>
                • Participar en actividades institucionales.<br>
                • Construir redes de apoyo.<br>
                • Solicitar orientación cuando sea necesario.<br>
                • Mantener hábitos de autocuidado.<br>
                • Aprovechar los servicios que ofrece la universidad.
              </p>
            </div>
          </div>

          <div class="h-slide-actions-bar">
            <button type="button" class="lc-btn lc-btn-secondary" id="btn-r2-back-to-menu">
              <span aria-hidden="true">←</span>
              <span>Volver a Selección de Rutas</span>
            </button>

            <button type="button" class="lc-btn lc-btn-primary" id="btn-r2-next" style="padding: 0.95rem 2.2rem; font-weight: 800;">
              <span>Continuar a: Mi Termómetro de Adaptación</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        `;

      case 2:
        return `
          <!-- PASO 2: ACTIVIDAD - MI TERMÓMETRO DE ADAPTACIÓN & CASO DANIEL (ELEMENTO EN VERDE) -->
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.85rem;">
            <span>PASO 2 DE 4</span> · <span>ACTIVIDAD VIRTUAL INTERACTIVA DUA</span>
          </div>

          <div class="lc-instruction-banner" style="margin-bottom: 1.5rem;">
            <div class="lc-banner-icon" aria-hidden="true">🌡️</div>
            <div class="lc-banner-text">
              <strong style="font-size: 1.15rem; color: #005A29;">Actividad: Mi termómetro de adaptación</strong>
              <p style="margin: 0.35rem 0 0 0; line-height: 1.5; color: #334155;">
                Esta actividad te permite evaluar tu estado actual en la universidad. Puedes responder las preguntas <strong>grabando una nota de voz</strong> con tu micrófono o <strong>escribiendo tus respuestas</strong> en las tarjetas de abajo.
              </p>
            </div>
          </div>

          <!-- SUB-ACTIVIDAD A: GRABADOR DE AUDIO DUA Y PREGUNTAS CLAVE -->
          <div class="lc-content-card" style="border: 2px solid #BAE6FD; background: #FFFFFF; padding: 1.5rem; margin-bottom: 1.75rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.4rem;">🎙️</span>
                <strong style="font-size: 1.1rem; color: #0284C7;">Opción 1: Responde mediante Audio Grabado</strong>
              </div>
              <span style="font-size: 0.8rem; background: #E0F2FE; color: #0369A1; padding: 0.25rem 0.65rem; border-radius: 9999px; font-weight: 800;">
                Grabación Interactiva DUA
              </span>
            </div>

            <!-- Interfaz de Grabación de Audio -->
            <div style="background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 14px; padding: 1.25rem; margin-bottom: 1.25rem;">
              
              <div class="lc-recorder-top">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <span class="lc-rec-indicator" id="rec-dot-indicator"></span>
                  <span id="rec-status-label" style="font-weight: 700; font-size: 0.95rem; color: #475569;">Micrófono listo</span>
                </div>
                <div class="lc-recorder-timer" id="rec-timer-display">00:00</div>
              </div>

              <!-- Visualizador de ondas de sonido -->
              <div class="lc-visualizer-container" style="background: #02190D; border: 1px solid #00E676; height: 75px; border-radius: 12px; margin-bottom: 1.25rem;">
                <canvas id="rec-audio-visualizer" class="lc-visualizer-canvas" width="600" height="75"></canvas>
              </div>

              <!-- Botones de Acción de Grabación -->
              <div class="lc-recorder-actions">
                <button type="button" class="lc-btn lc-btn-primary" id="btn-rec-start" style="padding: 0.75rem 1.6rem; font-weight: 800;">
                  <span id="rec-btn-icon">🎙️</span> <span id="rec-btn-text">Iniciar Grabación</span>
                </button>
                <button type="button" class="lc-btn lc-btn-secondary" id="btn-rec-stop" style="display: none; padding: 0.75rem 1.4rem;">
                  <span>⏹️ Detener</span>
                </button>
                <button type="button" class="lc-btn lc-btn-secondary" id="btn-rec-discard" style="display: none; padding: 0.75rem 1.2rem; color: #DC2626;">
                  <span>🗑️ Descartar</span>
                </button>
              </div>

              <!-- Reproductor del audio grabado -->
              <div id="rec-playback-container" style="display: none; margin-top: 1rem; border-top: 1.5px dashed #CBD5E1; padding-top: 1rem;">
                <strong style="font-size: 0.9rem; color: #00843D; display: block; margin-bottom: 0.4rem;">
                  ✓ Tu audio ha sido grabado con éxito:
                </strong>
                <audio id="rec-audio-element" controls style="width: 100%; margin-bottom: 0.5rem;"></audio>
                <button type="button" class="lc-media-alt-btn" id="btn-rec-download">
                  <span>📥 Descargar mi audio (WebM)</span>
                </button>
              </div>

            </div>

            <!-- Preguntas Orientadoras del Termómetro (o respuestas escritas) -->
            <h5 style="margin: 0 0 0.75rem 0; font-size: 1rem; font-weight: 800; color: #0F172A;">
              📝 Preguntas guía del termómetro (puedes grabarlas o escribirlas aquí):
            </h5>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 0.85rem;">
              
              <div>
                <label for="th-easy" style="font-size: 0.85rem; font-weight: 700; color: #1E293B; display: block; margin-bottom: 0.3rem;">
                  1. ¿Qué ha sido lo más fácil hasta ahora?
                </label>
                <input 
                  type="text" 
                  id="th-easy" 
                  class="lc-input-text" 
                  style="width: 100%; padding: 0.5rem 0.75rem; border: 1.5px solid #CBD5E1; border-radius: 8px; font-size: 0.9rem;"
                  placeholder="Ej: Conectar con compañeros, llegar al campus..."
                  value="${th.textAnswers?.easy || ''}"
                />
              </div>

              <div>
                <label for="th-challenge" style="font-size: 0.85rem; font-weight: 700; color: #1E293B; display: block; margin-bottom: 0.3rem;">
                  2. ¿Qué ha representado un mayor reto?
                </label>
                <input 
                  type="text" 
                  id="th-challenge" 
                  class="lc-input-text" 
                  style="width: 100%; padding: 0.5rem 0.75rem; border: 1.5px solid #CBD5E1; border-radius: 8px; font-size: 0.9rem;"
                  placeholder="Ej: Organización del tiempo, materias complejas..."
                  value="${th.textAnswers?.challenge || ''}"
                />
              </div>

              <div>
                <label for="th-resources" style="font-size: 0.85rem; font-weight: 700; color: #1E293B; display: block; margin-bottom: 0.3rem;">
                  3. ¿Qué recursos me han ayudado?
                </label>
                <input 
                  type="text" 
                  id="th-resources" 
                  class="lc-input-text" 
                  style="width: 100%; padding: 0.5rem 0.75rem; border: 1.5px solid #CBD5E1; border-radius: 8px; font-size: 0.9rem;"
                  placeholder="Ej: Amigos, docentes, biblioteca, mi familia..."
                  value="${th.textAnswers?.resources || ''}"
                />
              </div>

              <div>
                <label for="th-strengthen" style="font-size: 0.85rem; font-weight: 700; color: #1E293B; display: block; margin-bottom: 0.3rem;">
                  4. ¿Qué necesito fortalecer?
                </label>
                <input 
                  type="text" 
                  id="th-strengthen" 
                  class="lc-input-text" 
                  style="width: 100%; padding: 0.5rem 0.75rem; border: 1.5px solid #CBD5E1; border-radius: 8px; font-size: 0.9rem;"
                  placeholder="Ej: Hábitos de estudio, pedir ayuda a tiempo..."
                  value="${th.textAnswers?.strengthen || ''}"
                />
              </div>

            </div>
          </div>

          <!-- SUB-ACTIVIDAD B: CASO DANIEL (ILUSTRACIÓN ANIMADA Y PREGUNTA REFLEXIVA) -->
          <div class="lc-content-card" style="border: 2px solid #FED7AA; background: #FFFFFF; padding: 1.5rem; margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
              <span style="font-size: 1.4rem;">👥</span>
              <strong style="font-size: 1.1rem; color: #C2410C;">Estudio de Caso: La adaptación de Daniel</strong>
            </div>

            <!-- Escena animada generada con danielStoryAnimation -->
            ${getDanielAnimatedStoryHtml()}

            <!-- Caja de Texto para Responder la Pregunta Oficial de Daniel -->
            <div style="margin-top: 1.25rem; background: #FFF7ED; border: 1.5px solid #FDBA74; border-radius: 12px; padding: 1.25rem;">
              <label for="input-daniel-actions" style="font-size: 1.05rem; font-weight: 800; color: #9A3412; display: block; margin-bottom: 0.5rem;">
                🤔 Pregunta: ¿Qué acciones podrían ayudar a Daniel a adaptarse mejor a la vida universitaria?
              </label>
              <textarea 
                id="input-daniel-actions" 
                class="lc-textarea-spacious" 
                rows="3" 
                placeholder="Sugiere acciones concretas (servicios institucionales del TdeA, estrategias de tiempo, espacios de socialización, etc.)..."
              >${dc.actionSuggestions || ''}</textarea>
            </div>
          </div>

          <div class="h-slide-actions-bar">
            <button type="button" class="lc-btn lc-btn-secondary" id="btn-r2-prev">
              <span aria-hidden="true">←</span>
              <span>Anterior: Podcast</span>
            </button>

            <button type="button" class="lc-btn lc-btn-primary" id="btn-r2-next" style="padding: 0.95rem 2.2rem; font-weight: 800;">
              <span>Continuar a: Mi Plan de Adaptación</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        `;

      case 3:
        return `
          <!-- PASO 3: PRODUCTO - MI PLAN DE ADAPTACIÓN (HOJA DE RUTA PERSONAL) -->
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.85rem;">
            <span>PASO 3 DE 4</span> · <span>PRODUCTO · MI PLAN DE ADAPTACIÓN</span>
          </div>

          <!-- Banner de Descarga de Hoja de Ruta PDF Oficial -->
          <div class="lc-content-card" style="border: 2px solid #BAE6FD; background: linear-gradient(180deg, #FFFFFF 0%, #F0F9FF 100%); margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
              <div style="display: flex; align-items: center; gap: 0.85rem;">
                <span style="font-size: 2.2rem;">🗺️</span>
                <div>
                  <h4 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0369A1;">
                    Diseño para Imprimir: Hoja de Ruta Personal
                  </h4>
                  <p style="margin: 0.2rem 0 0 0; font-size: 0.88rem; color: #334155;">
                    Plantilla oficial ilustrada para imprimir y llevar contigo en tu maleta de bienestar:
                  </p>
                </div>
              </div>

              <a 
                href="assets/campusVital/docs/plan_adaptacion_hoja_ruta.pdf" 
                download="Plan_de_Adaptacion_Hoja_de_Ruta_TdeA.pdf" 
                class="lc-btn lc-btn-primary"
                style="padding: 0.75rem 1.4rem; font-weight: 800; display: inline-flex; align-items: center; gap: 0.4rem; background: #0284C7; border-color: #0284C7;"
              >
                <span>📥 Descargar Hoja de Ruta (PDF)</span>
              </a>
            </div>
          </div>

          <!-- Formulario Interactivo del Plan de Adaptación -->
          <div class="lc-content-card" style="border: 2px solid #CBD5E1; padding: 1.5rem; margin-bottom: 1.5rem; background: #FFFFFF;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
              <span style="font-size: 1.4rem;">📋</span>
              <strong style="font-size: 1.15rem; color: #022B14;">
                Registra tu Plan de Adaptación en la plataforma:
              </strong>
            </div>
            <p style="margin: 0 0 1.25rem 0; font-size: 0.95rem; color: #475569; line-height: 1.5;">
              Define tus compromisos personales para consolidar una transición académica sana y disfrutable:
            </p>

            <div style="display: flex; flex-direction: column; gap: 1.25rem;">
              
              <!-- 1. Principal fortaleza -->
              <div style="background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 12px; padding: 1.15rem;">
                <label for="plan-strength" style="font-size: 1rem; font-weight: 800; color: #0F172A; display: block; margin-bottom: 0.4rem;">
                  1. Mi principal fortaleza personal para este viaje universitario:
                </label>
                <input 
                  type="text" 
                  id="plan-strength" 
                  class="lc-input-text" 
                  style="width: 100%; padding: 0.65rem 0.85rem; border: 1.5px solid #CBD5E1; border-radius: 8px; font-size: 0.95rem;"
                  placeholder="Ej: Curiosidad intelectual, constancia, capacidad de escuchar..."
                  value="${ap.mainStrength || ''}"
                />
              </div>

              <!-- 2. Principal reto -->
              <div style="background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 12px; padding: 1.15rem;">
                <label for="plan-challenge" style="font-size: 1rem; font-weight: 800; color: #0F172A; display: block; margin-bottom: 0.4rem;">
                  2. Mi principal reto a gestionar durante este semestre:
                </label>
                <input 
                  type="text" 
                  id="plan-challenge" 
                  class="lc-input-text" 
                  style="width: 100%; padding: 0.65rem 0.85rem; border: 1.5px solid #CBD5E1; border-radius: 8px; font-size: 0.95rem;"
                  placeholder="Ej: Equilibrar los horarios de estudio con el descanso, perder el miedo a participar..."
                  value="${ap.mainChallenge || ''}"
                />
              </div>

              <!-- 3. Tres acciones para facilitar mi adaptación -->
              <div style="background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 12px; padding: 1.15rem;">
                <strong style="font-size: 1rem; font-weight: 800; color: #0F172A; display: block; margin-bottom: 0.6rem;">
                  3. Tres acciones concretas para facilitar mi adaptación:
                </strong>
                
                <div style="display: flex; flex-direction: column; gap: 0.6rem;">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-weight: 800; color: #00843D; font-size: 0.95rem;">• Acción 1:</span>
                    <input 
                      type="text" 
                      id="plan-act1" 
                      class="lc-input-text" 
                      style="flex: 1; padding: 0.5rem 0.75rem; border: 1.5px solid #CBD5E1; border-radius: 8px; font-size: 0.9rem;"
                      placeholder="Ej: Crear un horario semanal de repaso por bloques..."
                      value="${ap.action1 || ''}"
                    />
                  </div>

                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-weight: 800; color: #00843D; font-size: 0.95rem;">• Acción 2:</span>
                    <input 
                      type="text" 
                      id="plan-act2" 
                      class="lc-input-text" 
                      style="flex: 1; padding: 0.5rem 0.75rem; border: 1.5px solid #CBD5E1; border-radius: 8px; font-size: 0.9rem;"
                      placeholder="Ej: Asistir a un taller de Bienestar Universitario..."
                      value="${ap.action2 || ''}"
                    />
                  </div>

                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-weight: 800; color: #00843D; font-size: 0.95rem;">• Acción 3:</span>
                    <input 
                      type="text" 
                      id="plan-act3" 
                      class="lc-input-text" 
                      style="flex: 1; padding: 0.5rem 0.75rem; border: 1.5px solid #CBD5E1; border-radius: 8px; font-size: 0.9rem;"
                      placeholder="Ej: Formar un grupo de estudio con dos compañeros..."
                      value="${ap.action3 || ''}"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div class="h-slide-actions-bar">
            <button type="button" class="lc-btn lc-btn-secondary" id="btn-r2-prev">
              <span aria-hidden="true">←</span>
              <span>Anterior: Termómetro</span>
            </button>

            <button type="button" class="lc-btn lc-btn-primary" id="btn-r2-next" style="padding: 0.95rem 2.2rem; font-weight: 800;">
              <span>Continuar a: Mensaje Final y Cierre</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        `;

      case 4:
        return `
          <!-- PASO 4: MENSAJE FINAL - INFOGRAFÍA Y RECONOCIMIENTO (CULMINACIÓN MÓDULO 2) -->
          <div class="campus-vital-inst-tag-pill" style="margin-bottom: 0.85rem;">
            <span>PASO 4 DE 4</span> · <span>CULMINACIÓN · INFOGRAFÍA OFICIAL DEL MÓDULO 2</span>
          </div>

          <!-- 1. Infografía Oficial de Cierre Módulo 2 («El viaje de tu vida universitaria») -->
          <div class="lc-embed-card" style="border: 2px solid #86EFAC; border-radius: 18px; padding: 1.25rem 1.5rem; background: #FFFFFF; box-shadow: 0 4px 18px rgba(0, 132, 61, 0.08); margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem;">
              <div style="display: flex; align-items: center; gap: 0.65rem;">
                <div style="background: #00843D; color: #FFFFFF; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.35rem; box-shadow: 0 4px 12px rgba(0, 132, 61, 0.25);" aria-hidden="true">
                  🧭
                </div>
                <div>
                  <strong style="color: #0F172A; font-size: 1.15rem; display: block; font-weight: 800;">Infografía Oficial: «El viaje de tu vida universitaria»</strong>
                  <span style="font-size: 0.85rem; color: #64748B;">Módulo 2 · Elegir el rumbo</span>
                </div>
              </div>

              <!-- Botones de Acción / Descarga -->
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                <a 
                  href="assets/campusVital/docs/cierre_modulo2.pdf" 
                  download="Tarjeta_Final_Modulo_2_TdeA.pdf" 
                  class="lc-media-alt-btn"
                  style="background: #00843D; color: #FFFFFF; font-weight: 800; border: none; padding: 0.6rem 1.15rem; border-radius: 10px; display: inline-flex; align-items: center; gap: 0.45rem; box-shadow: 0 3px 10px rgba(0, 132, 61, 0.3); text-decoration: none;"
                  title="Descargar la infografía oficial en formato PDF para imprimir o guardar"
                >
                  <span>📥 Descargar Infografía (PDF)</span>
                </a>
                <a 
                  href="assets/campusVital/images/cierre_modulo2.jpg" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="lc-media-alt-btn"
                  style="background: #F1F5F9; color: #334155; font-weight: 700; border: 1.5px solid #CBD5E1; padding: 0.6rem 1rem; border-radius: 10px; text-decoration: none;"
                  title="Abrir imagen en alta resolución en una pestaña nueva"
                >
                  <span>🔍 Ver en tamaño completo</span>
                </a>
              </div>
            </div>

            <!-- Imagen Directa de la Infografía Oficial (Garantizada 100% visible) -->
            <div style="position: relative; width: 100%; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.12); background: #022B14; text-align: center; border: 2px solid #86EFAC;">
              <img 
                src="assets/campusVital/images/cierre_modulo2.jpg" 
                alt="Infografía de Cierre del Módulo 2: Has recorrido una nueva etapa de este viaje y has descubierto que construir tu camino universitario implica conocerte, reconocer tus capacidades y conectar con aquello que da sentido a tus decisiones." 
                style="width: 100%; height: auto; display: block; border-radius: 12px; max-height: 720px; object-fit: contain; margin: 0 auto;"
                loading="lazy"
              />
            </div>
          </div>

          <!-- 2. Tarjeta Ilustrada Oficial de Cierre del Módulo 2 -->
          <div class="lc-content-card" style="border: 2px solid #00843D; background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); padding: 2rem 1.75rem; margin-bottom: 1.75rem; text-align: center; border-radius: 20px; box-shadow: 0 8px 24px rgba(0, 132, 61, 0.12);">
            <div style="font-size: 3.5rem; margin-bottom: 0.5rem;" aria-hidden="true">🏆</div>
            <h3 style="font-size: 1.6rem; font-weight: 800; color: #005A29; margin: 0 0 0.75rem 0;">
              ¡Felicitaciones! Has completado las actividades del Módulo 2
            </h3>
            <p style="font-size: 1.05rem; color: #065F46; max-width: 650px; margin: 0 auto 1.25rem auto; line-height: 1.6;">
              Has recorrido tanto la <strong>Ruta 1 (Proyecto de Vida)</strong> como la <strong>Ruta 2 (Adaptación a la Vida Universitaria)</strong>. Tu brújula interna está lista para orientar tu camino en el Tecnológico de Antioquia.
            </p>

            <!-- Botones de Acción -->
            <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
              <a 
                href="assets/campusVital/docs/cierre_modulo2.pdf" 
                download="Tarjeta_Final_Modulo_2_TdeA.pdf" 
                class="lc-btn lc-btn-secondary"
                style="display: inline-flex; align-items: center; gap: 0.5rem; font-weight: 800; padding: 0.75rem 1.4rem;"
              >
                <span>📥 Descargar Tarjeta de Cierre (PDF)</span>
              </a>
            </div>
          </div>

          <div class="h-slide-actions-bar">
            <button type="button" class="lc-btn lc-btn-secondary" id="btn-r2-prev">
              <span aria-hidden="true">←</span>
              <span>Anterior: Caso Daniel y Valentina</span>
            </button>

            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <button type="button" class="lc-btn lc-btn-primary animate-pulse" id="btn-r2-finish-to-mountain" style="padding: 0.95rem 2.4rem; font-weight: 800; background: #00843D; box-shadow: 0 4px 16px rgba(0, 132, 61, 0.35);">
                <span>🏔️ Volver a la Montaña (Cumbre y Reconocimiento)</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        `;

      default:
        return '';
    }
  }

  bindRuta2Events(current) {
    // Saltos del stepper horizontal: libre navegación a cualquier actividad
    const jumps = this.containerEl.querySelectorAll('[data-r2-jump]');
    jumps.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = Number(btn.getAttribute('data-r2-jump'));
        this.renderRuta2(target);
      });
    });

    const btnBackMenu = this.containerEl.querySelector('#btn-r2-back-to-menu');
    if (btnBackMenu) {
      btnBackMenu.addEventListener('click', () => {
        if (current === 4) {
          learningCenterState.completeModule2Ruta2();
        }
        this.render('mountain');
      });
    }

    const btnPrev = this.containerEl.querySelector('#btn-r2-prev');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (this.ruta2Step > 1) {
          this.renderRuta2(this.ruta2Step - 1);
        }
      });
    }

    const btnNext = this.containerEl.querySelector('#btn-r2-next');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (this.ruta2Step < 4) {
          this.renderRuta2(this.ruta2Step + 1);
        }
      });
    }

    // Configuración específica según el paso
    if (current === 1) {
      this.setupDuaAudioPlayer(
        'podcast-mod2-audio',
        'btn-podcast-m2-play',
        'podcast-m2-play-icon',
        'podcast-m2-scrubber',
        'podcast-m2-current-time',
        'podcast-m2-total-time',
        'btn-podcast-m2-speed',
        'btn-podcast-m2-transcript-toggle',
        'podcast-m2-transcript-content'
      );
    } else if (current === 2) {
      // 1. Inicializar grabador de audio interactivo
      this.initAudioRecorder();

      // 2. Guardar inputs de texto alternativos del termómetro
      const tEasy = this.containerEl.querySelector('#th-easy');
      const tChal = this.containerEl.querySelector('#th-challenge');
      const tRes = this.containerEl.querySelector('#th-resources');
      const tStr = this.containerEl.querySelector('#th-strengthen');

      if (tEasy) tEasy.addEventListener('input', () => learningCenterState.setModule2ThermometerText('easy', tEasy.value));
      if (tChal) tChal.addEventListener('input', () => learningCenterState.setModule2ThermometerText('challenge', tChal.value));
      if (tRes) tRes.addEventListener('input', () => learningCenterState.setModule2ThermometerText('resources', tRes.value));
      if (tStr) tStr.addEventListener('input', () => learningCenterState.setModule2ThermometerText('strengthen', tStr.value));

      // 3. Guardar respuesta del Caso Daniel
      const danInput = this.containerEl.querySelector('#input-daniel-actions');
      if (danInput) {
        danInput.addEventListener('input', () => {
          learningCenterState.setModule2DanielAction(danInput.value);
        });
      }
    } else if (current === 3) {
      const pStrength = this.containerEl.querySelector('#plan-strength');
      const pChal = this.containerEl.querySelector('#plan-challenge');
      const pAct1 = this.containerEl.querySelector('#plan-act1');
      const pAct2 = this.containerEl.querySelector('#plan-act2');
      const pAct3 = this.containerEl.querySelector('#plan-act3');

      if (pStrength) pStrength.addEventListener('input', () => learningCenterState.setModule2AdaptationPlan('mainStrength', pStrength.value));
      if (pChal) pChal.addEventListener('input', () => learningCenterState.setModule2AdaptationPlan('mainChallenge', pChal.value));
      if (pAct1) pAct1.addEventListener('input', () => learningCenterState.setModule2AdaptationPlan('action1', pAct1.value));
      if (pAct2) pAct2.addEventListener('input', () => learningCenterState.setModule2AdaptationPlan('action2', pAct2.value));
      if (pAct3) pAct3.addEventListener('input', () => learningCenterState.setModule2AdaptationPlan('action3', pAct3.value));
    } else if (current === 4) {
      // Marcar módulo 2 completado
      learningCenterState.completeModule2Ruta2();

      const btnFinishR2 = this.containerEl.querySelector('#btn-r2-finish-to-mountain') || this.containerEl.querySelector('#btn-mod2-goto-mod3');
      if (btnFinishR2) {
        btnFinishR2.addEventListener('click', () => {
          learningCenterState.completeModule2Ruta2();
          this.render('mountain');
        });
      }
    }
  }

  // =========================================================================
  // 4. GRABADOR DE AUDIO DUA PARA EL TERMÓMETRO DE ADAPTACIÓN
  // =========================================================================
  initAudioRecorder() {
    const btnStart = this.containerEl.querySelector('#btn-rec-start');
    const btnStop = this.containerEl.querySelector('#btn-rec-stop');
    const btnDiscard = this.containerEl.querySelector('#btn-rec-discard');
    const timerDisplay = this.containerEl.querySelector('#rec-timer-display');
    const statusLabel = this.containerEl.querySelector('#rec-status-label');
    const dotIndicator = this.containerEl.querySelector('#rec-dot-indicator');
    const canvas = this.containerEl.querySelector('#rec-audio-visualizer');
    const playbackContainer = this.containerEl.querySelector('#rec-playback-container');
    const audioElement = this.containerEl.querySelector('#rec-audio-element');
    const btnDownload = this.containerEl.querySelector('#btn-rec-download');

    if (!btnStart || !btnStop || !canvas) return;

    if (!AudioRecorderService.isSupported()) {
      if (statusLabel) statusLabel.textContent = 'Grabación de audio no disponible en este navegador.';
      btnStart.disabled = true;
      return;
    }

    this.recorderService = new AudioRecorderService();

    // Callbacks del servicio
    this.recorderService.onTimeUpdate = (seconds) => {
      if (timerDisplay) timerDisplay.textContent = AudioRecorderService.formatTime(seconds);
    };

    this.recorderService.onStateChange = (state) => {
      if (state === 'recording') {
        if (statusLabel) statusLabel.textContent = 'Grabando nota de voz...';
        if (dotIndicator) dotIndicator.classList.add('is-recording');
        btnStart.style.display = 'none';
        btnStop.style.display = 'inline-flex';
        btnDiscard.style.display = 'inline-flex';
      } else if (state === 'stopped') {
        if (statusLabel) statusLabel.textContent = 'Grabación finalizada';
        if (dotIndicator) dotIndicator.classList.remove('is-recording');
        btnStart.style.display = 'inline-flex';
        btnStop.style.display = 'none';
        btnDiscard.style.display = 'none';
      } else if (state === 'inactive') {
        if (statusLabel) statusLabel.textContent = 'Micrófono listo';
        if (dotIndicator) dotIndicator.classList.remove('is-recording');
        btnStart.style.display = 'inline-flex';
        btnStop.style.display = 'none';
        btnDiscard.style.display = 'none';
        if (timerDisplay) timerDisplay.textContent = '00:00';
      }
    };

    // Botón Iniciar
    btnStart.addEventListener('click', async () => {
      try {
        await this.recorderService.start();
        this.recorderService.startVisualizerLoop(canvas);
      } catch (err) {
        alert(err.message || 'No se pudo acceder al micrófono.');
      }
    });

    // Botón Detener
    btnStop.addEventListener('click', async () => {
      try {
        const audioBlob = await this.recorderService.stop();
        this.recordedAudioBlob = audioBlob;
        if (this.recordedAudioUrl) URL.revokeObjectURL(this.recordedAudioUrl);
        this.recordedAudioUrl = URL.createObjectURL(audioBlob);

        if (playbackContainer) playbackContainer.style.display = 'block';
        if (audioElement) {
          audioElement.src = this.recordedAudioUrl;
        }
      } catch (err) {
        console.error('Error al detener grabación:', err);
      }
    });

    // Botón Descartar
    if (btnDiscard) {
      btnDiscard.addEventListener('click', () => {
        if (confirm('¿Deseas descartar la grabación actual?')) {
          this.recorderService.cancel();
          if (this.recordedAudioUrl) URL.revokeObjectURL(this.recordedAudioUrl);
          this.recordedAudioBlob = null;
          this.recordedAudioUrl = null;
          if (playbackContainer) playbackContainer.style.display = 'none';
        }
      });
    }

    // Botón Descargar audio
    if (btnDownload) {
      btnDownload.addEventListener('click', () => {
        if (this.recordedAudioBlob) {
          AudioRecorderService.downloadAudioFile(this.recordedAudioBlob, 'Mi_Termometro_de_Adaptacion_TdeA');
        }
      });
    }
  }

  // =========================================================================
  // 5. HELPER PARA REPRODUCTOR DE AUDIO ACCESIBLE DUA
  // =========================================================================
  setupDuaAudioPlayer(audioId, playBtnId, playIconId, scrubberId, currentTimeId, totalTimeId, speedBtnId, transcriptBtnId, transcriptContentId) {
    const audio = this.containerEl.querySelector(`#${audioId}`);
    const playBtn = this.containerEl.querySelector(`#${playBtnId}`);
    const playIcon = this.containerEl.querySelector(`#${playIconId}`);
    const scrubber = this.containerEl.querySelector(`#${scrubberId}`);
    const currentTimeEl = this.containerEl.querySelector(`#${currentTimeId}`);
    const totalTimeEl = this.containerEl.querySelector(`#${totalTimeId}`);
    const speedBtn = this.containerEl.querySelector(`#${speedBtnId}`);
    const transcriptBtn = this.containerEl.querySelector(`#${transcriptBtnId}`);
    const transcriptContent = this.containerEl.querySelector(`#${transcriptContentId}`);

    if (!audio || !playBtn) return;

    const formatSeconds = (sec) => {
      if (isNaN(sec) || sec < 0) return '00:00';
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    audio.addEventListener('loadedmetadata', () => {
      if (totalTimeEl) totalTimeEl.textContent = formatSeconds(audio.duration);
    });

    playBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().catch(() => {});
        if (playIcon) playIcon.textContent = '⏸';
      } else {
        audio.pause();
        if (playIcon) playIcon.textContent = '▶';
      }
    });

    audio.addEventListener('timeupdate', () => {
      if (currentTimeEl) currentTimeEl.textContent = formatSeconds(audio.currentTime);
      if (scrubber && audio.duration) {
        scrubber.value = (audio.currentTime / audio.duration) * 100;
      }
    });

    audio.addEventListener('ended', () => {
      if (playIcon) playIcon.textContent = '▶';
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
        audio.playbackRate = speeds[sIdx];
        speedBtn.textContent = `${speeds[sIdx]}x`;
      });
    }

    if (transcriptBtn && transcriptContent) {
      transcriptBtn.addEventListener('click', () => {
        const isHidden = transcriptContent.style.display === 'none';
        transcriptContent.style.display = isHidden ? 'block' : 'none';
        transcriptBtn.textContent = isHidden ? '✕ Cerrar Transcripción' : '📝 Transcripción';
      });
    }
  }

  // =========================================================================
  // 6. PANTALLA DE CIERRE GLOBAL DEL MÓDULO 2
  // =========================================================================
  renderCierre() {
    this.scrollToTop();
    this.currentRoute = 'cierre';
    learningCenterState.completeModule2();

    this.containerEl.innerHTML = `
      <section class="lc-module-container animate-fade-in" aria-labelledby="mod2-cierre-title">
        ${this.renderHeaderHtml('cierre')}

        <!-- 1. Infografía Oficial de Cierre Módulo 2 («El viaje de tu vida universitaria») -->
        <div class="lc-embed-card" style="border: 2px solid #86EFAC; border-radius: 18px; padding: 1.25rem 1.5rem; background: #FFFFFF; box-shadow: 0 4px 18px rgba(0, 132, 61, 0.08); margin-bottom: 1.5rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem;">
            <div style="display: flex; align-items: center; gap: 0.65rem;">
              <div style="background: #00843D; color: #FFFFFF; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.35rem; box-shadow: 0 4px 12px rgba(0, 132, 61, 0.25);" aria-hidden="true">
                🧭
              </div>
              <div>
                <strong style="color: #0F172A; font-size: 1.15rem; display: block; font-weight: 800;">Infografía Oficial de Cierre: «El viaje de tu vida universitaria»</strong>
                <span style="font-size: 0.85rem; color: #64748B;">Consolidación de tu proyecto de vida y adaptación universitaria</span>
              </div>
            </div>

            <!-- Botones de Acción / Descarga -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
              <a 
                href="assets/campusVital/docs/cierre_modulo2.pdf" 
                download="Tarjeta_Final_Modulo_2_TdeA.pdf" 
                class="lc-media-alt-btn"
                style="background: #00843D; color: #FFFFFF; font-weight: 800; border: none; padding: 0.6rem 1.15rem; border-radius: 10px; display: inline-flex; align-items: center; gap: 0.45rem; box-shadow: 0 3px 10px rgba(0, 132, 61, 0.3); text-decoration: none;"
                title="Descargar la infografía oficial en formato PDF para imprimir o guardar"
              >
                <span>📥 Descargar Infografía (PDF)</span>
              </a>
              <a 
                href="assets/campusVital/images/cierre_modulo2.jpg" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="lc-media-alt-btn"
                style="background: #F1F5F9; color: #334155; font-weight: 700; border: 1.5px solid #CBD5E1; padding: 0.6rem 1rem; border-radius: 10px; text-decoration: none;"
                title="Abrir imagen en alta resolución en una pestaña nueva"
              >
                <span>🔍 Ver en tamaño completo</span>
              </a>
            </div>
          </div>

          <!-- Imagen Directa de la Infografía Oficial (Garantizada 100% visible) -->
          <div style="position: relative; width: 100%; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.12); background: #022B14; text-align: center; border: 2px solid #86EFAC;">
            <img 
              src="assets/campusVital/images/cierre_modulo2.jpg" 
              alt="Infografía de Cierre del Módulo 2: Has recorrido una nueva etapa de este viaje y has descubierto que construir tu camino universitario implica conocerte, reconocer tus capacidades y conectar con aquello que da sentido a tus decisiones." 
              style="width: 100%; height: auto; display: block; border-radius: 12px; max-height: 720px; object-fit: contain; margin: 0 auto;"
              loading="lazy"
            />
          </div>
        </div>

        <!-- 2. Tarjeta de Reconocimiento Módulo 2 -->
        <div class="lc-content-card" style="border: 2px solid #00843D; background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); padding: 2.2rem 1.75rem; text-align: center; margin-bottom: 2rem; border-radius: 20px; box-shadow: 0 8px 24px rgba(0, 132, 61, 0.12);">
          <div style="font-size: 3.5rem; margin-bottom: 0.5rem;" aria-hidden="true">🎒</div>
          <h2 id="mod2-cierre-title" style="font-size: 1.75rem; font-weight: 800; color: #005A29; margin: 0 0 0.5rem 0;">
            Módulo 2 Completado: Elegir el rumbo
          </h2>
          <p style="font-size: 1.1rem; color: #065F46; max-width: 650px; margin: 0 auto 1.5rem auto; line-height: 1.6;">
            Has recorrido tanto la <strong>Ruta 1 (Proyecto de Vida)</strong> como la <strong>Ruta 2 (Adaptación a la Vida Universitaria)</strong>. Tu brújula interna está lista para orientar tu camino en el Tecnológico de Antioquia.
          </p>

          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a 
              href="assets/campusVital/docs/cierre_modulo2.pdf" 
              download="Tarjeta_Final_Modulo_2_TdeA.pdf" 
              class="lc-btn lc-btn-secondary"
              style="padding: 0.85rem 1.5rem; font-weight: 800;"
            >
              <span>📥 Descargar Tarjeta de Reconocimiento (PDF)</span>
            </a>

            <button type="button" class="lc-btn lc-btn-secondary" id="btn-cierre-back-to-mountain" style="padding: 0.85rem 1.6rem; font-weight: 800; border: 1.5px solid #00843D; color: #00843D; background: #FFFFFF; cursor: pointer;">
              <span>🏔️ Volver a la Montaña</span>
            </button>

            <button type="button" class="lc-btn lc-btn-primary" id="btn-cierre-return-home" style="padding: 0.85rem 1.8rem; font-weight: 800; background: #00843D;">
              <span>🏠 Volver al Menú de Campus Vital</span>
            </button>
          </div>
        </div>
      </section>
    `;

    this.bindCommonHeaderEvents();

    const btnBackMt = this.containerEl.querySelector('#btn-cierre-back-to-mountain');
    if (btnBackMt) {
      btnBackMt.addEventListener('click', () => this.render('mountain'));
    }

    const btnHome = this.containerEl.querySelector('#btn-cierre-return-home');
    if (btnHome) {
      btnHome.addEventListener('click', () => {
        learningCenterState.completeModule2();
        if (this.onNavigate) this.onNavigate('menu');
      });
    }
  }
}
