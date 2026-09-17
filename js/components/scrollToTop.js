/**
 * Botón Flotante "Volver Arriba" (Scroll to Top)
 * Asistente Virtual Territorio TdeA
 * 
 * Desplaza suavemente la pantalla a la cabecera cuando el usuario
 * navega por listados extensos de asesorías o recursos.
 */

export class ScrollToTop {
  constructor() {
    this.buttonEl = null;
    this.threshold = 280;
    this.isMounted = false;
  }

  init() {
    if (this.isMounted) return;

    this.render();
    this.attachEvents();
    this.isMounted = true;
  }

  render() {
    let existing = document.getElementById('tdea-scroll-to-top');
    if (existing) {
      this.buttonEl = existing;
      return;
    }

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'tdea-scroll-to-top';
    btn.className = 'tdea-scroll-to-top';
    btn.setAttribute('aria-label', 'Volver arriba de la página');
    btn.setAttribute('title', 'Volver arriba');
    btn.innerHTML = `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="12" y1="19" x2="12" y2="5"/>
        <polyline points="5 12 12 5 19 12"/>
      </svg>
      <span class="scroll-top-tooltip">Volver arriba</span>
    `;

    document.body.appendChild(btn);
    this.buttonEl = btn;
  }

  attachEvents() {
    if (!this.buttonEl) return;

    // Scroll suave al hacer clic
    this.buttonEl.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Monitoreo pasivo del scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > this.threshold) {
        this.buttonEl.classList.add('is-visible');
      } else {
        this.buttonEl.classList.remove('is-visible');
      }
    }, { passive: true });
  }
}

export const scrollToTop = new ScrollToTop();
