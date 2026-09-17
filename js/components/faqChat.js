/**
 * Componente de Preguntas Frecuentes Flotante (Widget Interactivo)
 * Inspirado en la interfaz de usuario de corporaciongilbertoecheverri.gov.co
 * Asistente Virtual Territorio TdeA - Ciencias Básicas
 * 
 * Reglas deterministas, sin IA generativa ni dependencias de terceros.
 */

import {
  CHATBOT_CATEGORIES,
  ADVISOR_CONTACT,
  UNKNOWN_QUESTION_RESPONSE,
  findMatchingFaq
} from '../data/chatbotFaqData.js';

export class FaqChat {
  /**
   * @param {HTMLElement} [parentContainer=document.body] Contenedor padre
   * @param {Function} [onNavigate] Función para navegar en la SPA si se requiere
   */
  constructor(parentContainer = document.body, onNavigate = null) {
    this.parentContainer = parentContainer;
    this.onNavigate = onNavigate;
    this.isOpen = false;
    this.currentView = 'home'; // 'home' | 'category' | 'question' | 'search' | 'contact'
    this.activeCategory = null;
    this.activeQuestion = null;

    // Referencias al DOM
    this.rootEl = null;
    this.fabBtn = null;
    this.windowEl = null;
    this.dynamicContent = null;
    this.searchInput = null;
    this.searchForm = null;
    this.closeTopBtn = null;
    this.iconClosed = null;
    this.iconOpen = null;

    // Vincular métodos
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }

  /**
   * Inicializa el widget vinculándolo al DOM existente o creándolo
   */
  init() {
    this.rootEl = document.getElementById('tdea-faq-widget-root');
    
    // Si no está en el DOM por alguna razón, construirlo
    if (!this.rootEl) {
      this.renderFallbackDom();
    }

    // Vincular referencias
    this.fabBtn = document.getElementById('tdea-faq-widget-fab');
    this.windowEl = document.getElementById('tdea-faq-widget-window');
    this.dynamicContent = document.getElementById('faq-widget-dynamic-content');
    this.searchInput = document.getElementById('faq-widget-input');
    this.searchForm = document.getElementById('faq-widget-form');
    this.closeTopBtn = document.getElementById('faq-widget-close-top');
    this.iconClosed = document.getElementById('faq-fab-icon-closed');
    this.iconOpen = document.getElementById('faq-fab-icon-open');

    this.bindEvents();

    // Renderizar la vista inicial de temas (tarjetas estilo Gilberto Echeverri)
    this.renderHomeCategories();

    // Exportar instancia global para accesibilidad desde cualquier parte de la app
    window.__tdeaFaqChat = this;
    window.__openFaqWidget = () => this.open();
    window.__toggleFaqWidget = () => this.toggle();

    console.info('💡 Widget de Preguntas Frecuentes (Estilo Gilberto Echeverri) listo.');
  }

  /**
   * Vincula eventos de clic, teclado y búsqueda
   */
  bindEvents() {
    // 1. Clic en el botón flotante (FAB)
    if (this.fabBtn) {
      this.fabBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });
    }

    // 2. Clic en el botón cerrar (X superior)
    if (this.closeTopBtn) {
      this.closeTopBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.close();
      });
    }

    // 3. Formulario de búsqueda rápida
    if (this.searchForm) {
      this.searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = (this.searchInput?.value || '').trim();
        if (query) {
          this.renderSearchResults(query);
        } else {
          this.renderHomeCategories();
        }
      });
    }

    // 4. Búsqueda en tiempo real mientras el usuario escribe
    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => {
        const query = (this.searchInput.value || '').trim();
        if (!query) {
          this.renderHomeCategories();
        } else if (query.length >= 2) {
          this.renderSearchResults(query);
        }
      });
    }

    // 5. Cierre con tecla ESC
    document.addEventListener('keydown', this.handleKeyDown);

    // 6. Cierre al hacer clic fuera del widget (opcional pero muy cómodo)
    document.addEventListener('click', this.handleDocumentClick);
  }

  /**
   * Abre la ventana flotante
   */
  open() {
    if (!this.windowEl || !this.fabBtn) return;

    this.isOpen = true;
    this.windowEl.style.display = 'flex';
    this.windowEl.classList.add('is-open');
    this.windowEl.setAttribute('aria-hidden', 'false');

    this.fabBtn.classList.add('is-active');
    this.fabBtn.setAttribute('aria-expanded', 'true');

    if (this.iconClosed) this.iconClosed.style.display = 'none';
    if (this.iconOpen) this.iconOpen.style.display = 'inline-flex';

    // Si estaba vacía, cargar temas
    if (!this.dynamicContent || !this.dynamicContent.hasChildNodes()) {
      this.renderHomeCategories();
    }

    // Enfocar el campo de búsqueda
    setTimeout(() => {
      if (this.searchInput) {
        this.searchInput.focus();
      }
    }, 150);
  }

  /**
   * Cierra la ventana flotante
   */
  close() {
    if (!this.windowEl || !this.fabBtn) return;

    this.isOpen = false;
    this.windowEl.style.display = 'none';
    this.windowEl.classList.remove('is-open');
    this.windowEl.setAttribute('aria-hidden', 'true');

    this.fabBtn.classList.remove('is-active');
    this.fabBtn.setAttribute('aria-expanded', 'false');

    if (this.iconClosed) this.iconClosed.style.display = 'inline-flex';
    if (this.iconOpen) this.iconOpen.style.display = 'none';
  }

  /**
   * Alterna apertura y cierre
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Manejador de teclado para tecla Escape
   */
  handleKeyDown(e) {
    if (e.key === 'Escape' && this.isOpen) {
      this.close();
    }
  }

  /**
   * Cierra el widget si se hace clic fuera de él
   */
  handleDocumentClick(e) {
    if (!this.isOpen || !this.rootEl) return;
    if (!this.rootEl.contains(e.target)) {
      this.close();
    }
  }

  /**
   * Vista 1: Menú Principal de Temas (Tarjetas estilo Gilberto Echeverri)
   */
  renderHomeCategories() {
    if (!this.dynamicContent) return;
    this.currentView = 'home';
    this.activeCategory = null;
    this.activeQuestion = null;

    let html = `
      <div class="faq-widget-section-header">
        <h4 class="faq-widget-section-title">Consulta por tema de asesoría</h4>
        <p class="faq-widget-section-subtitle">Selecciona una categoría o escribe tu duda arriba:</p>
      </div>

      <div class="faq-widget-cards-stack" role="list">
        ${CHATBOT_CATEGORIES.map(cat => `
          <button 
            type="button" 
            class="faq-widget-card-btn" 
            data-cat-id="${cat.id}"
            role="listitem"
            aria-label="${cat.title}"
          >
            <span class="faq-widget-card-icon" aria-hidden="true">${cat.icon}</span>
            <div class="faq-widget-card-info">
              <span class="faq-widget-card-title">${cat.title}</span>
              <span class="faq-widget-card-badge">${cat.questions.length} preguntas</span>
            </div>
            <span class="faq-widget-card-chevron" aria-hidden="true">›</span>
          </button>
        `).join('')}

        <!-- Opción Permanente: Hablar con un Asesor -->
        <button 
          type="button" 
          class="faq-widget-card-btn faq-widget-card-contact" 
          data-action="open-contact"
          role="listitem"
          aria-label="Hablar con un asesor institucional"
        >
          <span class="faq-widget-card-icon" aria-hidden="true">${ADVISOR_CONTACT.icon}</span>
          <div class="faq-widget-card-info">
            <span class="faq-widget-card-title">${ADVISOR_CONTACT.title}</span>
            <span class="faq-widget-card-badge" style="color: var(--tdea-green-dark);">${ADVISOR_CONTACT.email}</span>
          </div>
          <span class="faq-widget-card-chevron" aria-hidden="true">›</span>
        </button>
      </div>
    `;

    this.dynamicContent.innerHTML = html;

    // Listeners para clics en cada tarjeta de categoría
    this.dynamicContent.querySelectorAll('.faq-widget-card-btn[data-cat-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const catId = btn.getAttribute('data-cat-id');
        this.renderCategoryQuestions(catId);
      });
    });

    // Listener para tarjeta de contacto
    const contactBtn = this.dynamicContent.querySelector('[data-action="open-contact"]');
    if (contactBtn) {
      contactBtn.addEventListener('click', () => {
        this.renderAdvisorContact();
      });
    }
  }

  /**
   * Vista 2: Lista de Preguntas dentro de una Categoría
   * @param {string} categoryId 
   */
  renderCategoryQuestions(categoryId) {
    const category = CHATBOT_CATEGORIES.find(c => c.id === categoryId);
    if (!category || !this.dynamicContent) return;

    this.currentView = 'category';
    this.activeCategory = category;

    let html = `
      <div class="faq-widget-navigation-bar">
        <button type="button" class="faq-widget-back-btn" id="faq-back-to-home" title="Regresar a todos los temas">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Volver a temas</span>
        </button>
      </div>

      <div class="faq-widget-category-banner">
        <span class="faq-widget-category-icon">${category.icon}</span>
        <div>
          <h4 class="faq-widget-category-title">${category.title}</h4>
          <span class="faq-widget-category-count">${category.questions.length} preguntas frecuentes disponibles</span>
        </div>
      </div>

      <div class="faq-widget-cards-stack" role="list">
        ${category.questions.map(q => `
          <button 
            type="button" 
            class="faq-widget-card-btn faq-widget-question-btn" 
            data-question-id="${q.id}"
            role="listitem"
            aria-label="${q.question}"
          >
            <span class="faq-widget-question-bullet" aria-hidden="true">•</span>
            <div class="faq-widget-card-info">
              <span class="faq-widget-question-title">${q.question}</span>
            </div>
            <span class="faq-widget-card-chevron" aria-hidden="true">›</span>
          </button>
        `).join('')}
      </div>

      <div class="faq-widget-inline-help">
        <span>¿No encuentras lo que buscas?</span>
        <button type="button" class="faq-widget-link-btn" id="faq-link-to-contact">
          Escribir a un asesor (${ADVISOR_CONTACT.email})
        </button>
      </div>
    `;

    this.dynamicContent.innerHTML = html;

    // Volver a home
    const backBtn = this.dynamicContent.querySelector('#faq-back-to-home');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.renderHomeCategories());
    }

    // Ir a contacto
    const linkContact = this.dynamicContent.querySelector('#faq-link-to-contact');
    if (linkContact) {
      linkContact.addEventListener('click', () => this.renderAdvisorContact());
    }

    // Clic en pregunta
    this.dynamicContent.querySelectorAll('.faq-widget-question-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const qId = btn.getAttribute('data-question-id');
        this.renderQuestionDetail(qId, categoryId);
      });
    });
  }

  /**
   * Vista 3: Detalle de una Pregunta con Respuesta Oficial Institucional
   * @param {string} questionId 
   * @param {string} fromCategoryId 
   */
  renderQuestionDetail(questionId, fromCategoryId = null) {
    if (!this.dynamicContent) return;

    let foundQuestion = null;
    let parentCategory = null;

    for (const cat of CHATBOT_CATEGORIES) {
      const q = cat.questions.find(item => item.id === questionId);
      if (q) {
        foundQuestion = q;
        parentCategory = cat;
        break;
      }
    }

    if (!foundQuestion) return;

    this.currentView = 'question';
    this.activeQuestion = foundQuestion;

    // Formatear saltos de línea de la respuesta en párrafos limpios
    const formattedAnswer = foundQuestion.answer
      .split('\n\n')
      .map(p => `<p class="faq-widget-answer-paragraph">${this.formatTextWithLinks(p)}</p>`)
      .join('');

    const mailtoUrl = `mailto:${ADVISOR_CONTACT.email}`;

    let html = `
      <div class="faq-widget-navigation-bar">
        <button type="button" class="faq-widget-back-btn" id="faq-back-from-detail">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>${parentCategory ? `Volver a ${parentCategory.title}` : 'Volver'}</span>
        </button>
      </div>

      <div class="faq-widget-answer-card">
        <div class="faq-widget-verified-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Respuesta Oficial Institucional</span>
        </div>

        <h4 class="faq-widget-answer-title">${foundQuestion.question}</h4>

        <div class="faq-widget-answer-body">
          ${formattedAnswer}
        </div>

        <div class="faq-widget-actions-box">
          <a href="${mailtoUrl}" class="faq-widget-action-pill" title="Redactar correo a soporte">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>Escribir a <strong>${ADVISOR_CONTACT.email}</strong></span>
          </a>

          <button type="button" class="faq-widget-action-pill faq-pill-catalog" id="faq-action-go-advisories">
            <span>🗓️ Ver Horarios de Asesorías</span>
          </button>
        </div>
      </div>

      <div class="faq-widget-followup-box">
        <span class="faq-widget-followup-label">¿Deseas consultar otra información?</span>
        <button type="button" class="faq-widget-secondary-btn" id="faq-action-go-topics">
          Ver todas las preguntas frecuentes
        </button>
      </div>
    `;

    this.dynamicContent.innerHTML = html;

    // Listener para volver atrás
    const backBtn = this.dynamicContent.querySelector('#faq-back-from-detail');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (fromCategoryId) {
          this.renderCategoryQuestions(fromCategoryId);
        } else {
          this.renderHomeCategories();
        }
      });
    }

    // Ir a asesorías en el SPA
    const goAdvisoriesBtn = this.dynamicContent.querySelector('#faq-action-go-advisories');
    if (goAdvisoriesBtn) {
      goAdvisoriesBtn.addEventListener('click', () => {
        this.close();
        if (typeof this.onNavigate === 'function') {
          this.onNavigate('asesorias');
        } else {
          window.location.hash = '#/asesorias';
        }
      });
    }

    // Volver a todos los temas
    const goTopicsBtn = this.dynamicContent.querySelector('#faq-action-go-topics');
    if (goTopicsBtn) {
      goTopicsBtn.addEventListener('click', () => {
        if (this.searchInput) this.searchInput.value = '';
        this.renderHomeCategories();
      });
    }
  }

  /**
   * Vista 4: Pantalla de Contacto con un Asesor
   */
  renderAdvisorContact() {
    if (!this.dynamicContent) return;

    this.currentView = 'contact';

    const mailtoUrl = `mailto:${ADVISOR_CONTACT.email}`;

    let html = `
      <div class="faq-widget-navigation-bar">
        <button type="button" class="faq-widget-back-btn" id="faq-back-to-home">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Volver a temas</span>
        </button>
      </div>

      <div class="faq-widget-contact-panel">
        <div class="faq-widget-contact-icon-bubble">👨‍🏫</div>
        <h4 class="faq-widget-contact-title">Hablar con un asesor</h4>
        <p class="faq-widget-contact-desc">
          ¿Necesitas resolver una situación académica específica o no encontraste la respuesta que buscabas?
        </p>
        <p class="faq-widget-contact-note">
          Puedes comunicarte directamente con el equipo docente y de coordinación de Ciencias Básicas:
        </p>

        <div class="faq-widget-contact-email-card">
          <span class="faq-widget-email-label">Correo institucional oficial:</span>
          <a href="${mailtoUrl}" class="faq-widget-email-link" title="Hacer clic para redactar correo">
            ${ADVISOR_CONTACT.email}
          </a>
        </div>

        <div class="faq-widget-contact-actions">
          <a href="${mailtoUrl}" class="faq-widget-primary-btn" style="text-decoration: none; justify-content: center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>Redactar correo prellenado</span>
          </a>

          <button type="button" class="faq-widget-secondary-btn" id="faq-contact-view-topics">
            Volver al listado de preguntas frecuentes
          </button>
        </div>
      </div>
    `;

    this.dynamicContent.innerHTML = html;

    const backBtn = this.dynamicContent.querySelector('#faq-back-to-home');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.renderHomeCategories());
    }

    const viewTopicsBtn = this.dynamicContent.querySelector('#faq-contact-view-topics');
    if (viewTopicsBtn) {
      viewTopicsBtn.addEventListener('click', () => this.renderHomeCategories());
    }
  }

  /**
   * Vista 5: Resultados de Búsqueda por Texto
   * @param {string} query 
   */
  renderSearchResults(query) {
    if (!this.dynamicContent) return;

    this.currentView = 'search';
    const matches = findMatchingFaq(query);

    if (matches.length === 0) {
      const mailtoUrl = `mailto:${ADVISOR_CONTACT.email}?subject=${encodeURIComponent(`Consulta sobre: ${query}`)}`;

      this.dynamicContent.innerHTML = `
        <div class="faq-widget-navigation-bar">
          <button type="button" class="faq-widget-back-btn" id="faq-search-clear">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Ver todos los temas</span>
          </button>
        </div>

        <div class="faq-widget-no-results">
          <span style="font-size: 2rem; display: block; margin-bottom: 0.5rem;">🔍</span>
          <h4 style="font-size: 0.95rem; font-weight: 700; color: #1E293B; margin-bottom: 0.35rem;">
            No encontramos respuestas para "${this.escapeHtml(query)}"
          </h4>
          <p style="font-size: 0.825rem; color: #64748B; margin-bottom: 1.25rem; line-height: 1.45;">
            No tengo información disponible sobre esa consulta específica. Para recibir orientación personalizada, puedes comunicarte directamente con el equipo de Ciencias Básicas:
          </p>
          <a href="${mailtoUrl}" class="faq-widget-primary-btn" style="text-decoration: none; justify-content: center; width: 100%;">
            ✉️ Escribir a ${ADVISOR_CONTACT.email}
          </a>
        </div>
      `;

      const clearBtn = this.dynamicContent.querySelector('#faq-search-clear');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (this.searchInput) this.searchInput.value = '';
          this.renderHomeCategories();
        });
      }
      return;
    }

    let html = `
      <div class="faq-widget-navigation-bar">
        <button type="button" class="faq-widget-back-btn" id="faq-search-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Volver a todos los temas</span>
        </button>
      </div>

      <div class="faq-widget-search-results-meta">
        <span>Coincidencias para <strong>"${this.escapeHtml(query)}"</strong> (${matches.length})</span>
      </div>

      <div class="faq-widget-cards-stack" role="list">
        ${matches.map(item => `
          <button 
            type="button" 
            class="faq-widget-card-btn faq-widget-result-item" 
            data-question-id="${item.questionId}"
            role="listitem"
            aria-label="${item.question}"
          >
            <span class="faq-widget-card-icon" aria-hidden="true">💡</span>
            <div class="faq-widget-card-info">
              <span class="faq-widget-result-badge">${item.categoryTitle}</span>
              <span class="faq-widget-card-title">${item.question}</span>
            </div>
            <span class="faq-widget-card-chevron" aria-hidden="true">›</span>
          </button>
        `).join('')}
      </div>
    `;

    this.dynamicContent.innerHTML = html;

    const backBtn = this.dynamicContent.querySelector('#faq-search-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (this.searchInput) this.searchInput.value = '';
        this.renderHomeCategories();
      });
    }

    this.dynamicContent.querySelectorAll('.faq-widget-result-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const qId = btn.getAttribute('data-question-id');
        this.renderQuestionDetail(qId, null);
      });
    });
  }

  /**
   * Convierte direcciones de correo electrónico dentro de un texto en enlaces interactivos mailto
   */
  formatTextWithLinks(text) {
    if (!text) return '';
    const safeText = this.escapeHtml(text);
    return safeText.replace(
      /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi,
      '<a href="mailto:$1" class="faq-widget-text-link">$1</a>'
    );
  }

  /**
   * Sanitización básica de strings HTML
   */
  escapeHtml(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Renderiza el DOM de respaldo si por algún motivo no estaba en index.html
   */
  renderFallbackDom() {
    const root = document.createElement('div');
    root.id = 'tdea-faq-widget-root';
    root.className = 'faq-widget-root';
    root.innerHTML = `
      <div id="tdea-faq-widget-window" class="faq-widget-window" role="dialog" aria-label="Preguntas Frecuentes sobre Asesorías" aria-hidden="true" style="display: none;">
        <div class="faq-widget-header">
          <div class="faq-widget-branding">
            <img src="assets/icons/tdea-mascot.svg" alt="Mascota TdeA" class="faq-widget-avatar">
            <div class="faq-widget-titles">
              <h3 class="faq-widget-title">Territorio TdeA</h3>
              <span class="faq-widget-subtitle">Preguntas Frecuentes sobre Asesorías</span>
            </div>
          </div>
          <button type="button" id="faq-widget-close-top" class="faq-widget-close-icon" aria-label="Cerrar preguntas frecuentes" title="Cerrar">✕</button>
        </div>
        <div id="faq-widget-body" class="faq-widget-body">
          <div class="faq-widget-search-section">
            <label for="faq-widget-input" class="faq-widget-section-label">Inicia una consulta</label>
            <form id="faq-widget-form" class="faq-widget-input-wrapper">
              <input type="text" id="faq-widget-input" class="faq-widget-input" placeholder="Hola, me gustaría consultar..." autocomplete="off">
              <button type="submit" id="faq-widget-send-btn" class="faq-widget-send-btn" title="Buscar respuesta" aria-label="Buscar respuesta">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </div>
          <div id="faq-widget-dynamic-content" class="faq-widget-dynamic-content"></div>
        </div>
        <div class="faq-widget-footer">
          <span>Orientación oficial · Ciencias Básicas TdeA</span>
        </div>
      </div>
      <button type="button" id="tdea-faq-widget-fab" class="faq-widget-fab" aria-label="Preguntas frecuentes sobre asesorías" aria-expanded="false" title="Preguntas frecuentes sobre asesorías">
        <span id="faq-fab-icon-closed" class="faq-fab-icon-state" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </span>
        <span id="faq-fab-icon-open" class="faq-fab-icon-state" aria-hidden="true" style="display: none;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </span>
        <span class="faq-fab-pill-label">💡 Preguntas frecuentes</span>
      </button>
    `;
    this.parentContainer.appendChild(root);
    this.rootEl = root;
  }
}
