/**
 * Componente Reutilizable ResourceCard
 * Asistente Virtual de Asesorías Territorio TdeA - Ciencias Básicas
 * 
 * Permite mostrar materiales de apoyo con acceso directo a:
 * 1. Lector pedagógico en pantalla (teoría, fórmulas, ejercicios resueltos paso a paso y taller).
 * 2. Descarga / Impresión en PDF con formato institucional TdeA.
 */

import { modal } from './modal.js';
import { StudyGuideService } from '../services/studyGuideService.js?v=20260908_10';

export class ResourceCard {
  /**
   * Genera el HTML de una tarjeta de recurso
   * @param {Object} resource Datos del recurso
   * @returns {string} Código HTML
   */
  static render(resource) {
    const typeIcons = {
      video: '🎥 Video',
      tutorial: '💡 Tutorial',
      guia: '📄 Guía',
      documento: '📑 Taller y Guía'
    };

    const statusClasses = {
      'Disponible': 'badge-status-available',
      'Próximamente': 'badge-status-upcoming',
      'En actualización': 'badge-status-updating'
    };

    const typeLabel = typeIcons[resource.type] || '📄 Recurso';
    const statusClass = statusClasses[resource.status] || 'badge-status-upcoming';
    const hasAcademic = !!resource.academicContent;
    const isCampusVital = resource.category === 'campus_vital';
    const showType = !isCampusVital && !resource.hideType;
    const showDesc = !isCampusVital && !!resource.description;

    return `
      <article class="resource-card ${hasAcademic ? 'has-academic-content' : ''} ${isCampusVital ? 'resource-card-campus-vital' : ''}" data-resource-id="${resource.id}">
        <div class="resource-card-header">
          <div class="resource-card-badges">
            ${showType ? `<span class="badge badge-resource-type">${typeLabel}</span>` : ''}
            <span class="badge ${statusClass}">${resource.status}</span>
            ${hasAcademic ? '<span class="badge badge-pedagogical">✔ Con Ejercicios</span>' : ''}
          </div>
          <span class="resource-category-tag">${resource.categoryLabel}</span>
        </div>

        <div class="resource-card-content">
          <h4 class="resource-card-title">${this.escapeHtml(resource.title)}</h4>
          ${showDesc ? `<p class="resource-card-desc">${this.escapeHtml(resource.description)}</p>` : ''}
        </div>

        <div class="resource-card-footer">
          ${hasAcademic ? `
            <div class="resource-actions-dual">
              <button 
                type="button" 
                class="btn-resource-read" 
                data-read-resource="${resource.id}"
                aria-label="Leer en pantalla: ${this.escapeHtml(resource.title)}"
              >
                <span>📖 Leer Guía</span>
              </button>
              <button 
                type="button" 
                class="btn-resource-download" 
                data-download-resource="${resource.id}"
                aria-label="Descargar PDF: ${this.escapeHtml(resource.title)}"
                title="Descargar o imprimir esta guía en PDF"
              >
                <span>📥 Descargar (PDF)</span>
              </button>
            </div>
          ` : `
            <div class="resource-actions-single ${isCampusVital ? 'vital-single-action' : ''}">
              ${resource.placeholderNotice && !isCampusVital ? `
                <span class="resource-placeholder-text">
                  ${this.escapeHtml(resource.placeholderNotice || '')}
                </span>
              ` : ''}
              <button 
                type="button" 
                class="btn-resource-action" 
                data-open-resource="${resource.id}"
                aria-label="Abrir recurso: ${this.escapeHtml(resource.title)}"
              >
                <span>${resource.status === 'Disponible' ? '▶ Ver detalle' : '⏱️ Próximamente'}</span>
              </button>
            </div>
          `}
        </div>
      </article>
    `;
  }

  /**
   * Abre el modal informativo de un recurso sin contenido interactivo completo (ej. videos futuros)
   * @param {Object} resource Datos del recurso
   */
  static openResourceModal(resource) {
    if (!resource) return;

    if (resource.academicContent) {
      StudyGuideService.openReader(resource);
      return;
    }

    let mediaBadge = resource.type === 'video' ? '🎥 Video Orientador' : '💡 Tutorial Interactivo';

    modal.open({
      title: resource.title,
      bodyHtml: `
        <div style="text-align: center; padding: 0.5rem 0;">
          <div class="tutorial-preview-card" style="margin-top: 0;">
            <div class="tutorial-thumbnail-placeholder" style="height: 200px;">
              <div class="tutorial-play-btn" style="cursor: default;">
                <span>${resource.type === 'video' ? '🎥' : '📖'}</span>
              </div>
              <div style="font-size: var(--font-size-sm); font-weight: 600; color: #E2E8F0;">
                ${mediaBadge} · ${resource.categoryLabel}
              </div>
              <div style="font-size: var(--font-size-xs); color: #94A3B8; margin-top: 0.35rem;">
                ${resource.placeholderNotice || 'Material en preparación pedagógica'}
              </div>
            </div>
            <div class="tutorial-info-bar">
              <span class="tutorial-title-text">${resource.videoTitle || resource.title}</span>
              <span class="badge ${resource.status === 'Disponible' ? 'badge-status-available' : 'badge-status-upcoming'}">
                ${resource.status}
              </span>
            </div>
          </div>

          <div style="text-align: left; background: var(--color-surface-hover); padding: 1.25rem; border-radius: var(--radius-lg); margin-bottom: 1rem; line-height: 1.65;">
            <h4 style="font-size: var(--font-size-sm); font-weight: 700; color: var(--color-text-main); margin-bottom: 0.5rem;">
              Descripción del material de apoyo:
            </h4>
            <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: 0.75rem;">
              ${resource.description}
            </p>
            
            <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); border-top: 1px solid var(--color-border); padding-top: 0.75rem;">
              <strong>Estado en plataforma:</strong> ${resource.placeholderNotice || 'Material en preparación'}.<br>
              Este recurso estará enlazado al canal oficial de Microsoft Teams y OneDrive del Departamento de Ciencias Básicas.
            </div>
          </div>

          <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
            ¿Tienes dudas con este tema? Contáctanos a: 
            <a href="mailto:auxcienciasbasicas2@tdea.edu.co" style="font-weight: 600; color: var(--tdea-green-primary);">auxcienciasbasicas2@tdea.edu.co</a>
          </div>
        </div>
      `
    });
  }

  /**
   * Asocia los eventos de clic a los botones de recursos dentro de un contenedor
   * @param {HTMLElement} container Contenedor que contiene las tarjetas
   * @param {Function} getResourceFn Función para buscar recurso por ID
   */
  static attachEvents(container, getResourceFn) {
    if (!container) return;

    // Botones de lectura interactiva en pantalla
    const readBtns = container.querySelectorAll('[data-read-resource]');
    readBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-read-resource');
        const res = getResourceFn(id);
        if (res) {
          StudyGuideService.openReader(res);
        }
      });
    });

    // Botones de descarga / impresión directa en PDF
    const downloadBtns = container.querySelectorAll('[data-download-resource]');
    downloadBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-download-resource');
        const res = getResourceFn(id);
        if (res) {
          StudyGuideService.printGuide(res);
        }
      });
    });

    // Botones genéricos de acción (para recursos sin contenido interactivo completo)
    const actionBtns = container.querySelectorAll('[data-open-resource]');
    actionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-open-resource');
        const res = getResourceFn(id);
        if (res) {
          ResourceCard.openResourceModal(res);
        }
      });
    });
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
