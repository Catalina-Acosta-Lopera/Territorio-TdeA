/**
 * Servicio Pedagógico de Guías y Materiales de Estudio (Lectura y Descarga PDF)
 * Asistente Virtual Territorio TdeA - Ciencias Básicas
 * 
 * Permite a los estudiantes:
 * 1. Leer en pantalla el material teórico, fórmulas y problemas resueltos paso a paso.
 * 2. Imprimir / Guardar en PDF la guía de estudio con formato institucional homologado.
 */

export class StudyGuideService {
  /**
   * Abre el lector pedagógico interactivo del material de estudio
   * @param {Object} resource Objeto con datos y contenido pedagógico
   */
  static openReader(resource) {
    if (!resource) return;

    const content = resource.academicContent || this.getDefaultAcademicContent(resource);

    const modalHtml = `
      <div class="study-guide-modal-wrapper" id="study-guide-modal-wrapper">
        <!-- Barra de herramientas superior -->
        <div class="study-guide-toolbar no-print">
          <div class="study-guide-meta-tag">
            <span class="study-guide-badge-type">${resource.type.toUpperCase()}</span>
            <span class="study-guide-badge-category">${resource.categoryLabel}</span>
          </div>
          <div class="study-guide-actions">
            <button type="button" id="btn-guide-print-action" class="btn-guide-print" title="Descargar o imprimir esta guía en PDF">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              <span>Descargar / Imprimir Guía (PDF)</span>
            </button>
            <button type="button" id="btn-guide-close-modal" class="btn-guide-close" aria-label="Cerrar lectura">✕</button>
          </div>
        </div>

        <!-- Encabezado de la Guía -->
        <header class="study-guide-hero-header">
          <div class="study-guide-hero-icon">${this.getSubjectIcon(resource.id)}</div>
          <div class="study-guide-hero-text">
            <div class="study-guide-inst-sub">Tecnológico de Antioquia · Ciencias Básicas</div>
            <h2 class="study-guide-hero-title">${this.escapeHtml(resource.title)}</h2>
            <p class="study-guide-hero-desc">${this.escapeHtml(resource.description)}</p>
          </div>
        </header>

        <!-- Pestañas de Navegación del Lector -->
        <nav class="study-guide-tabs" role="tablist">
          <button type="button" class="guide-tab-btn is-active" data-tab="resumen" role="tab">📌 Resumen y Objetivos</button>
          <button type="button" class="guide-tab-btn" data-tab="formulas" role="tab">📐 Fórmulas Clave</button>
          <button type="button" class="guide-tab-btn" data-tab="resueltos" role="tab">✍️ Ejercicios Resueltos (${(content.solvedExercises || []).length})</button>
          <button type="button" class="guide-tab-btn" data-tab="taller" role="tab">📝 Taller de Práctica (${(content.practiceExercises || []).length})</button>
        </nav>

        <!-- Contenido de las Pestañas -->
        <div class="study-guide-tab-contents">
          
          <!-- Pestaña 1: Resumen y Objetivos -->
          <div class="guide-tab-panel is-active" id="tab-panel-resumen">
            <div class="guide-card-panel">
              <h3 class="guide-panel-title">🎯 Objetivo de Aprendizaje</h3>
              <p class="guide-panel-text">${content.objective}</p>
            </div>

            <div class="guide-card-panel" style="margin-top: 1.25rem;">
              <h3 class="guide-panel-title">📚 Temas Desarrollados en esta Guía</h3>
              <ul class="guide-topics-list">
                ${(content.topics || []).map(topic => `
                  <li>
                    <span class="topic-check">✔</span>
                    <span>${this.escapeHtml(topic)}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <div class="guide-tip-banner" style="margin-top: 1.25rem;">
              <div class="guide-tip-icon">💡</div>
              <div class="guide-tip-body">
                <strong>Consejo para tu Asesoría en Teams:</strong>
                <p>${content.advisoryTip || 'Llega a la asesoría habiendo intentado al menos dos ejercicios del taller. Así el docente podrá enfocarse exactamente en tu duda puntual.'}</p>
              </div>
            </div>
          </div>

          <!-- Pestaña 2: Fórmulas Clave -->
          <div class="guide-tab-panel" id="tab-panel-formulas" style="display: none;">
            <div class="guide-card-panel">
              <h3 class="guide-panel-title">📐 Formulario Esencial y Propiedades</h3>
              <p class="guide-panel-desc-small">Fórmulas y teoremas aplicables en este módulo temático:</p>
              
              <div class="formulas-grid">
                ${(content.formulas || []).map((f, i) => `
                  <div class="formula-item-card">
                    <div class="formula-name">${this.escapeHtml(f.name)}</div>
                    <div class="formula-expression">${this.escapeHtml(f.formula)}</div>
                    ${f.note ? `<div class="formula-note">${this.escapeHtml(f.note)}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Pestaña 3: Ejercicios Resueltos Paso a Paso -->
          <div class="guide-tab-panel" id="tab-panel-resueltos" style="display: none;">
            <div class="guide-card-panel">
              <h3 class="guide-panel-title">✍️ Problemas Modelo Resueltos Paso a Paso</h3>
              <p class="guide-panel-desc-small">Observa el procedimiento metodológico recomendado por los docentes del TdeA:</p>

              <div class="solved-list">
                ${(content.solvedExercises || []).map((ex, idx) => `
                  <article class="solved-exercise-card">
                    <header class="solved-header">
                      <span class="solved-number">Ejercicio #${idx + 1}</span>
                      <h4 class="solved-title">${this.escapeHtml(ex.title)}</h4>
                    </header>
                    
                    <div class="solved-problem-statement">
                      <strong>Enunciado:</strong> ${this.escapeHtml(ex.problem)}
                    </div>

                    <div class="solved-steps-container">
                      <div class="solved-steps-title">Desarrollo paso a paso:</div>
                      <ol class="solved-steps-list">
                        ${(ex.steps || []).map(step => `
                          <li>
                            <strong>${this.escapeHtml(step.stepTitle)}:</strong>
                            <div>${this.escapeHtml(step.stepDetail)}</div>
                          </li>
                        `).join('')}
                      </ol>
                    </div>

                    <div class="solved-answer-box">
                      <span class="answer-badge">✅ Respuesta Final:</span>
                      <span class="answer-text">${this.escapeHtml(ex.answer)}</span>
                    </div>

                    ${ex.pedagogicalTip ? `
                      <div class="solved-pedagogical-tip">
                        <span class="tip-icon">⚠️</span>
                        <span><strong>Cuidado con:</strong> ${this.escapeHtml(ex.pedagogicalTip)}</span>
                      </div>
                    ` : ''}
                  </article>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Pestaña 4: Taller de Práctica Propuesto -->
          <div class="guide-tab-panel" id="tab-panel-taller" style="display: none;">
            <div class="guide-card-panel">
              <h3 class="guide-panel-title">📝 Taller de Práctica para el Estudiante</h3>
              <p class="guide-panel-desc-small">Intenta resolver estos ejercicios antes de conectarte a la asesoría virtual. Podrás validar tus resultados con el docente:</p>

              <div class="practice-list">
                ${(content.practiceExercises || []).map((pex, pidx) => `
                  <div class="practice-exercise-card">
                    <div class="practice-num-badge">Pregunta ${pidx + 1}</div>
                    <div class="practice-question">${this.escapeHtml(pex.problem)}</div>
                    
                    <div class="practice-actions-row">
                      <button type="button" class="btn-toggle-hint" data-hint-id="hint-${pidx}">
                        💡 Ver Pista
                      </button>
                      <button type="button" class="btn-toggle-answer" data-answer-id="ans-${pidx}">
                        🔍 Ver Solución de Verificación
                      </button>
                    </div>

                    <div class="practice-hint-box" id="hint-${pidx}" style="display: none;">
                      <strong>Pista metodológica:</strong> ${this.escapeHtml(pex.hint)}
                    </div>

                    <div class="practice-answer-box" id="ans-${pidx}" style="display: none;">
                      <strong>Respuesta esperada:</strong> ${this.escapeHtml(pex.answer)}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

        </div>

        <!-- Pie institucional de la guía -->
        <footer class="study-guide-footer no-print">
          <div class="study-guide-footer-info">
            <span>Tecnológico de Antioquia · Institución Universitaria</span>
            <span>¿Dudas con este tema? Lleva tus preguntas a la sala Teams de asesorías.</span>
          </div>
          <button type="button" id="btn-guide-bottom-print" class="btn-guide-print-footer">
            📥 Imprimir / Guardar en PDF
          </button>
        </footer>
      </div>
    `;

    // Renderizar en un modal especial a pantalla completa
    let overlay = document.getElementById('tdea-guide-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'tdea-guide-overlay';
      overlay.className = 'tdea-guide-overlay';
      document.body.appendChild(overlay);
    }

    overlay.innerHTML = modalHtml;
    overlay.classList.add('is-active');
    document.body.classList.add('modal-open');

    // Registrar cambio de pestañas
    const tabBtns = overlay.querySelectorAll('.guide-tab-btn');
    const tabPanels = overlay.querySelectorAll('.guide-tab-panel');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        tabBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        tabPanels.forEach(panel => {
          if (panel.id === `tab-panel-${targetTab}`) {
            panel.style.display = 'block';
            panel.classList.add('is-active');
          } else {
            panel.style.display = 'none';
            panel.classList.remove('is-active');
          }
        });
      });
    });

    // Pistas y soluciones del taller
    const hintBtns = overlay.querySelectorAll('.btn-toggle-hint');
    hintBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const hintId = btn.getAttribute('data-hint-id');
        const box = overlay.querySelector(`#${hintId}`);
        if (box) {
          const isVisible = box.style.display === 'block';
          box.style.display = isVisible ? 'none' : 'block';
          btn.textContent = isVisible ? '💡 Ver Pista' : '🙈 Ocultar Pista';
        }
      });
    });

    const ansBtns = overlay.querySelectorAll('.btn-toggle-answer');
    ansBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const ansId = btn.getAttribute('data-answer-id');
        const box = overlay.querySelector(`#${ansId}`);
        if (box) {
          const isVisible = box.style.display === 'block';
          box.style.display = isVisible ? 'none' : 'block';
          btn.textContent = isVisible ? '🔍 Ver Solución' : '🙈 Ocultar Solución';
        }
      });
    });

    // Cerrar modal
    const closeBtn = overlay.querySelector('#btn-guide-close-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        overlay.classList.remove('is-active');
        document.body.classList.remove('modal-open');
      });
    }

    // Botones de impresión / PDF
    const printBtnTop = overlay.querySelector('#btn-guide-print-action');
    const printBtnBottom = overlay.querySelector('#btn-guide-bottom-print');

    const handlePrint = () => {
      this.printGuide(resource);
    };

    if (printBtnTop) printBtnTop.addEventListener('click', handlePrint);
    if (printBtnBottom) printBtnBottom.addEventListener('click', handlePrint);

    // Escape para cerrar
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-active')) {
        overlay.classList.remove('is-active');
        document.body.classList.remove('modal-open');
        document.removeEventListener('keydown', onKeyDown);
      }
    };
    document.addEventListener('keydown', onKeyDown);
  }

  /**
   * Imprime / Genera PDF de la guía con formato institucional formal
   * @param {Object} resource Datos del recurso
   */
  static printGuide(resource) {
    if (!resource) return;
    const content = resource.academicContent || this.getDefaultAcademicContent(resource);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const printableHtml = `
      <div id="print-guide-container" class="print-schedule-wrapper">
        <!-- Barra superior previa (no se imprime) -->
        <div class="print-actions-bar no-print">
          <div class="print-actions-info">
            <span class="print-info-badge">📑 Guía Académica Oficial TdeA</span>
            <span class="print-info-text">${this.escapeHtml(resource.title)}</span>
          </div>
          <div class="print-actions-buttons">
            <button type="button" id="btn-guide-do-print" class="btn-print-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              <span>Imprimir / Guardar en PDF</span>
            </button>
            <button type="button" id="btn-guide-cancel-print" class="btn-print-secondary">
              ✕ Volver
            </button>
          </div>
        </div>

        <!-- Hoja Imprimible Oficial -->
        <div class="printable-document printable-guide-document">
          <!-- Cabecera Institucional TdeA -->
          <header class="print-doc-header">
            <div class="print-header-brand">
              <img src="assets/icons/tdea-mascot.svg" alt="TdeA" class="print-logo-img">
              <div class="print-header-titles">
                <h1 class="print-institution-name">Tecnológico de Antioquia</h1>
                <h2 class="print-faculty-name">Institución Universitaria · Departamento de Ciencias Básicas y Áreas Comunes</h2>
                <h3 class="print-program-title">${this.escapeHtml(resource.title)}</h3>
              </div>
            </div>
            <div class="print-meta-box">
              <div><strong>Fecha de emisión:</strong> ${formattedDate}</div>
              <div><strong>Tipo de material:</strong> ${resource.type.toUpperCase()}</div>
              <div><strong>Soporte:</strong> auxcienciasbasicas2@tdea.edu.co</div>
            </div>
          </header>

          <div class="print-notice-box">
            <strong>Objetivo de Aprendizaje:</strong> ${this.escapeHtml(content.objective)}
          </div>

          <!-- Sección 1: Fórmulas y Reglas -->
          ${content.formulas && content.formulas.length > 0 ? `
            <section class="print-guide-section">
              <h4 class="print-guide-section-title">📐 1. Formulario y Teoremas Fundamentales</h4>
              <table class="print-table">
                <thead>
                  <tr>
                    <th style="width: 35%;">Propiedad / Nombre</th>
                    <th style="width: 40%;">Expresión Matemática</th>
                    <th style="width: 25%;">Condición / Nota</th>
                  </tr>
                </thead>
                <tbody>
                  ${content.formulas.map(f => `
                    <tr>
                      <td><strong>${this.escapeHtml(f.name)}</strong></td>
                      <td style="font-family: monospace; font-size: 0.95rem; font-weight: 700; color: #006030;">${this.escapeHtml(f.formula)}</td>
                      <td>${this.escapeHtml(f.note || 'General')}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </section>
          ` : ''}

          <!-- Sección 2: Ejercicios Resueltos Paso a Paso -->
          ${content.solvedExercises && content.solvedExercises.length > 0 ? `
            <section class="print-guide-section" style="margin-top: 1.5rem;">
              <h4 class="print-guide-section-title">✍️ 2. Ejercicios Resueltos Paso a Paso</h4>
              ${content.solvedExercises.map((ex, i) => `
                <div class="print-exercise-box">
                  <div class="print-exercise-header">
                    <strong>Ejercicio ${i + 1}: ${this.escapeHtml(ex.title)}</strong>
                  </div>
                  <div style="margin: 0.4rem 0 0.6rem; font-size: 0.88rem;">
                    <strong>Enunciado:</strong> ${this.escapeHtml(ex.problem)}
                  </div>
                  <div class="print-steps-box">
                    ${(ex.steps || []).map((st, si) => `
                      <div style="margin-bottom: 0.35rem; font-size: 0.84rem;">
                        <strong>Paso ${si + 1} (${this.escapeHtml(st.stepTitle)}):</strong> ${this.escapeHtml(st.stepDetail)}
                      </div>
                    `).join('')}
                  </div>
                  <div style="margin-top: 0.5rem; background: #E8F5E9; border: 1px solid #A5D6A7; padding: 0.4rem 0.6rem; border-radius: 4px; font-size: 0.85rem; font-weight: 700; color: #1B5E20;">
                    ✔ Respuesta: ${this.escapeHtml(ex.answer)}
                  </div>
                </div>
              `).join('')}
            </section>
          ` : ''}

          <!-- Sección 3: Taller Propuesto -->
          ${content.practiceExercises && content.practiceExercises.length > 0 ? `
            <section class="print-guide-section" style="margin-top: 1.5rem;">
              <h4 class="print-guide-section-title">📝 3. Taller Práctico para Asesoría Académica</h4>
              <p style="font-size: 0.84rem; color: #475569; margin-bottom: 0.6rem;">
                Resuelve los siguientes ejercicios de forma individual y consulta con el docente asesor cualquier inquietud:
              </p>
              <table class="print-table">
                <thead>
                  <tr>
                    <th style="width: 10%;">Ítem</th>
                    <th style="width: 65%;">Problema Propuesto</th>
                    <th style="width: 25%;">Respuesta de Control</th>
                  </tr>
                </thead>
                <tbody>
                  ${content.practiceExercises.map((pex, pi) => `
                    <tr>
                      <td style="text-align: center; font-weight: 700;">#${pi + 1}</td>
                      <td>${this.escapeHtml(pex.problem)}</td>
                      <td style="font-family: monospace; font-size: 0.85rem; color: #006030; font-weight: 600;">${this.escapeHtml(pex.answer)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </section>
          ` : ''}

          <!-- Pie Institucional -->
          <footer class="print-doc-footer" style="margin-top: 2rem;">
            <div class="print-footer-inner">
              <span>Tecnológico de Antioquia · Sede Robledo · Calle 73 No. 73A - 226 · Medellín, Colombia</span>
              <span>Asesorías virtuales Teams · auxcienciasbasicas2@tdea.edu.co · www.tdea.edu.co</span>
            </div>
          </footer>
        </div>
      </div>
    `;

    const guideOverlay = document.getElementById('tdea-guide-overlay');
    const wasGuideOpen = guideOverlay && guideOverlay.classList.contains('is-active');
    if (wasGuideOpen) {
      guideOverlay.classList.remove('is-active');
    }

    let overlay = document.getElementById('tdea-print-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'tdea-print-overlay';
      overlay.className = 'tdea-print-overlay';
      document.body.appendChild(overlay);
    }

    overlay.innerHTML = printableHtml;
    overlay.classList.add('is-active');
    document.body.classList.add('modal-open');

    const btnDoPrint = document.getElementById('btn-guide-do-print');
    const btnCancelPrint = document.getElementById('btn-guide-cancel-print');

    if (btnDoPrint) {
      btnDoPrint.addEventListener('click', () => {
        window.print();
      });
    }

    if (btnCancelPrint) {
      btnCancelPrint.addEventListener('click', () => {
        overlay.classList.remove('is-active');
        if (wasGuideOpen) {
          guideOverlay.classList.add('is-active');
        } else {
          document.body.classList.remove('modal-open');
        }
      });
    }
  }

  static getSubjectIcon(id) {
    if (id.includes('mat')) return '📐';
    if (id.includes('calc')) return '📈';
    if (id.includes('fis')) return '⚡';
    if (id.includes('est')) return '📊';
    if (id.includes('leng')) return '✍️';
    if (id.includes('tec')) return '🧠';
    return '📖';
  }

  static getDefaultAcademicContent(resource) {
    return {
      objective: `Fortalecer las competencias analíticas y conceptuales del estudiante en los temas de ${resource.title}.`,
      topics: [
        'Identificación y diagnóstico de conceptos fundamentales',
        'Modelamiento y desarrollo de ejercicios prácticos',
        'Interpretación de resultados y preparación para evaluaciones'
      ],
      formulas: [
        { name: 'Método General de Solución', formula: 'Planteamiento -> Análisis -> Resolución -> Verificación', note: 'Metodología TdeA' }
      ],
      solvedExercises: [
        {
          title: 'Ejercicio de Refuerzo Conceptual',
          problem: 'Aplicación de conceptos fundamentales para la resolución de dudas típicas.',
          steps: [
            { stepTitle: 'Identificación de variables', stepDetail: 'Reconocer los datos conocidos y las incógnitas planteadas en el problema.' },
            { stepTitle: 'Aplicación de propiedades', stepDetail: 'Utilizar las reglas y teoremas analizados en clase.' },
            { stepTitle: 'Simplificación analítica', stepDetail: 'Realizar operaciones paso a paso evitando errores de signos o despejes.' }
          ],
          answer: 'Resultado verificado por el docente asesor',
          pedagogicalTip: 'Ten claros los pasos antes de consultar con el asesor para aprovechar al máximo tu sesión.'
        }
      ],
      practiceExercises: [
        {
          problem: 'Desarrolla de forma autónoma el planteamiento inicial de tu duda antes de ingresar a la sala de Teams.',
          hint: 'Revisa tus apuntes de clase y el material de apoyo de la asignatura.',
          answer: 'Consultar en asesoría'
        }
      ],
      advisoryTip: 'Lleva tus intentos de solución anotados en tu libreta o en Teams para recibir una retroalimentación precisa.'
    };
  }

  static escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
