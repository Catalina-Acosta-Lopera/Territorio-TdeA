/**
 * Vista de la Biblioteca de Recursos para Estudiantes
 * Asistente Virtual de Asesorías Territorio TdeA - Versión 3
 */

import { RESOURCE_CATEGORIES, RESOURCES_DATA, getResourceById } from '../data/resourcesData.js';
import { ResourceCard } from './resourceCard.js';

export class ResourcesView {
  constructor(containerEl, onNavigate) {
    this.containerEl = containerEl;
    this.onNavigate = onNavigate;
    this.selectedCategory = 'all';
    this.searchQuery = '';
  }

  render() {
    if (!this.containerEl) return;

    this.containerEl.innerHTML = `
      <div class="resources-wrapper">
        <div class="assistant-message-card" style="margin-bottom: 1.5rem;">
          <div class="assistant-avatar" aria-hidden="true">🎓</div>
          <div class="assistant-text-block">
            <h2 class="assistant-greeting">Recursos para Estudiantes</h2>
            <p class="assistant-prompt">
              Biblioteca académica y pedagógica de Ciencias Básicas: guías de estudio por asignaturas, talleres prácticos descargables, técnicas de repaso y repositorio de grabaciones de clase.
            </p>
          </div>
        </div>

        <!-- Buscador y Filtros por Categoría -->
        <div style="margin-bottom: 1.5rem;">
          <input 
            type="text" 
            id="resource-search-input" 
            placeholder="🔍 Buscar guías, talleres, técnicas de estudio o grabaciones..." 
            value="${this.escapeHtml(this.searchQuery)}"
            style="width: 100%; padding: 0.85rem 1.15rem; border-radius: var(--radius-md); border: 1.5px solid var(--color-border); font-size: var(--font-size-sm); margin-bottom: 1rem; outline: none; background: #ffffff; transition: border-color var(--transition-fast);"
          />

          <div class="advisory-filter-bar" id="resource-category-chips">
            ${RESOURCE_CATEGORIES.map(cat => `
              <button 
                type="button" 
                class="filter-chip ${cat.id === this.selectedCategory ? 'active' : ''}" 
                data-category-id="${cat.id}"
              >
                ${cat.label}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Grid de Recursos -->
        <div class="resources-grid" id="resources-cards-container">
          ${this.renderCardsHtml()}
        </div>

        <!-- Recomendación TutorIA con IA para Estudiantes -->
        <div class="tutoria-spotlight-card" style="margin-top: 2rem; padding: 1.5rem 1.8rem; border-radius: 18px;">
          <div class="tutoria-spotlight-left" style="gap: 1.25rem;">
            <div class="tutoria-ai-badge-icon" style="width: 58px; height: 58px; border-radius: 16px;">
              <img src="assets/icons/tutoria-avatar.png" alt="Logo TutorIA TdeA" width="50" height="50" style="object-fit: contain;">
            </div>
            <div class="tutoria-spotlight-content">
              <h4 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 0.35rem; color: #FFFFFF;">
                ¿Tienes dudas con un ejercicio o tema de estudio?
              </h4>
              <p style="font-size: 0.88rem; color: rgba(255, 255, 255, 0.9); margin-bottom: 0; line-height: 1.5;">
                Conéctate con <strong>TutorIA</strong>, el asistente de Inteligencia Artificial del TdeA para recibir explicaciones paso a paso y resolver preguntas al instante.
              </p>
            </div>
          </div>
          <div class="tutoria-spotlight-actions" style="margin-top: 0;">
            <a 
              href="https://tutoria-tdea.ai.studio/" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="tutoria-launch-btn" 
              style="padding: 0.75rem 1.4rem; font-size: 0.9rem;"
              aria-label="Acceder a TutorIA TdeA (abre en nueva pestaña)"
            >
              <span>💬 Preguntar a TutorIA</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        <!-- Pie institucional de recursos -->
        <div class="escalation-box" style="margin-top: 1.5rem;">
          <div class="escalation-header">
            <span style="font-size: 1.35rem;">💡</span>
            <div>
              <div class="escalation-title">¿Necesitas una guía académica o material de estudio específico?</div>
              <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: 0.5rem;">
                Si requieres orientación académica adicional o tienes sugerencias de material pedagógico para Ciencias Básicas, comunícate con la Coordinación:
              </p>
              <a href="mailto:auxcienciasbasicas2@tdea.edu.co" class="escalation-email">auxcienciasbasicas2@tdea.edu.co</a>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  renderCardsHtml() {
    const filtered = RESOURCES_DATA.filter(item => {
      const matchCategory = this.selectedCategory === 'all' || item.category === this.selectedCategory;
      const q = this.searchQuery.toLowerCase().trim();
      const matchQuery = !q || 
        item.title.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q) || 
        item.categoryLabel.toLowerCase().includes(q) || 
        item.type.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });

    if (filtered.length === 0) {
      return `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem 1rem; background: var(--color-surface-hover); border-radius: var(--radius-lg); border: 1px dashed var(--color-border);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔍</div>
          <h4 style="font-size: var(--font-size-base); color: var(--color-text-main); margin-bottom: 0.25rem;">No se encontraron recursos</h4>
          <p style="font-size: var(--font-size-sm); color: var(--color-text-muted);">
            Intenta con otro término o selecciona una categoría diferente.
          </p>
        </div>
      `;
    }

    return filtered.map(res => ResourceCard.render(res)).join('');
  }

  attachEvents() {
    const searchInput = this.containerEl.querySelector('#resource-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        const container = this.containerEl.querySelector('#resources-cards-container');
        if (container) {
          container.innerHTML = this.renderCardsHtml();
          ResourceCard.attachEvents(container, getResourceById);
        }
      });
    }

    const chips = this.containerEl.querySelectorAll('.filter-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.selectedCategory = chip.getAttribute('data-category-id');
        const container = this.containerEl.querySelector('#resources-cards-container');
        if (container) {
          container.innerHTML = this.renderCardsHtml();
          ResourceCard.attachEvents(container, getResourceById);
        }
      });
    });

    const cardsContainer = this.containerEl.querySelector('#resources-cards-container');
    ResourceCard.attachEvents(cardsContainer, getResourceById);
  }

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
  }
}
