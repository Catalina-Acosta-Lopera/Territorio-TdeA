/**
 * Componente Modal Reutilizable y Accesible
 * Asistente Virtual Territorio TdeA
 */

export class Modal {
  constructor() {
    this.overlay = null;
    this.titleEl = null;
    this.bodyEl = null;
    this.closeBtn = null;
    this.footerEl = null;
    this.init();
  }

  init() {
    // Crear el elemento modal si no existe en el DOM
    let existing = document.getElementById('app-modal');
    if (existing) {
      this.overlay = existing;
    } else {
      this.overlay = document.createElement('div');
      this.overlay.id = 'app-modal';
      this.overlay.className = 'modal-overlay';
      this.overlay.setAttribute('role', 'dialog');
      this.overlay.setAttribute('aria-modal', 'true');
      this.overlay.setAttribute('aria-hidden', 'true');

      this.overlay.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title" id="modal-title">Título Modal</h3>
            <button type="button" class="modal-close-btn" id="modal-close-btn" aria-label="Cerrar modal">&times;</button>
          </div>
          <div class="modal-body" id="modal-body">
            <!-- Contenido dinámico -->
          </div>
          <div class="modal-footer" id="modal-footer">
            <button type="button" class="btn-secondary" id="modal-btn-close">Cerrar</button>
          </div>
        </div>
      `;

      document.body.appendChild(this.overlay);
    }

    this.titleEl = this.overlay.querySelector('#modal-title');
    this.bodyEl = this.overlay.querySelector('#modal-body');
    this.closeBtn = this.overlay.querySelector('#modal-close-btn');
    this.footerCloseBtn = this.overlay.querySelector('#modal-btn-close');

    // Manejadores de eventos de cierre
    this.closeBtn.addEventListener('click', () => this.close());
    this.footerCloseBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  open({ title, bodyHtml, customFooterHtml = null }) {
    this.titleEl.textContent = title;
    this.bodyEl.innerHTML = bodyHtml;

    if (customFooterHtml) {
      this.overlay.querySelector('#modal-footer').innerHTML = customFooterHtml;
    } else {
      this.overlay.querySelector('#modal-footer').innerHTML = `
        <button type="button" class="btn-secondary" id="modal-btn-close-action">Cerrar</button>
      `;
      this.overlay.querySelector('#modal-btn-close-action').addEventListener('click', () => this.close());
    }

    this.overlay.classList.add('open');
    this.overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.overlay.classList.remove('open');
    this.overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  isOpen() {
    return this.overlay.classList.contains('open');
  }
}

export const modal = new Modal();
