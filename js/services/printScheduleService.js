/**
 * Servicio de Generación e Impresión de Horarios en PDF
 * Asistente Virtual Territorio TdeA - Ciencias Básicas
 * 
 * Permite previsualizar e imprimir/guardar en PDF la programación semanal
 * completa con formato institucional homologado.
 */

import { MOCK_ADVISORIES } from '../data/advisoryMockData.js';

export class PrintScheduleService {
  /**
   * Abre la vista previa imprimible del horario semanal
   * @param {Array} customList Lista opcional de asesorías filtradas
   */
  static openPrintPreview(customList = null) {
    const advisories = customList && customList.length > 0 ? customList : MOCK_ADVISORIES;
    const daysOrder = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    // Agrupar por día
    const grouped = {};
    daysOrder.forEach(day => grouped[day] = []);
    
    advisories.forEach(item => {
      const day = item.days || 'Lunes';
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(item);
    });

    // Ordenar cada día por hora de inicio
    Object.keys(grouped).forEach(day => {
      grouped[day].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    });

    const now = new Date();
    const formattedDate = now.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const modalHtml = `
      <div id="print-schedule-container" class="print-schedule-wrapper">
        
        <!-- Barra de Herramientas de Vista Previa (no se imprime) -->
        <div class="print-actions-bar no-print">
          <div class="print-actions-info">
            <span class="print-info-badge">📄 Vista de Impresión / Guardar en PDF</span>
            <span class="print-info-text">${advisories.length} asesorías programadas</span>
          </div>
          <div class="print-actions-buttons">
            <button type="button" id="btn-execute-print" class="btn-print-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              <span>Imprimir / Guardar en PDF</span>
            </button>
            <button type="button" id="btn-close-print-preview" class="btn-print-secondary">
              ✕ Cerrar
            </button>
          </div>
        </div>

        <!-- Documento Oficial Imprimible -->
        <div class="printable-document" id="printable-schedule-doc">
          
          <!-- Encabezado Institucional TdeA -->
          <header class="print-doc-header">
            <div class="print-header-brand">
              <img src="assets/icons/tdea-mascot.svg" alt="TdeA" class="print-logo-img">
              <div class="print-header-titles">
                <h1 class="print-institution-name">Tecnológico de Antioquia</h1>
                <h2 class="print-faculty-name">Institución Universitaria · Departamento de Ciencias Básicas y Áreas Comunes</h2>
                <h3 class="print-program-title">Programación Oficial de Asesorías Académicas · Territorio TdeA</h3>
              </div>
            </div>
            <div class="print-meta-box">
              <div><strong>Fecha de emisión:</strong> ${formattedDate}</div>
              <div><strong>Acceso:</strong> Microsoft Teams</div>
              <div><strong>Estudiantes:</strong> @correo.tdea.edu.co</div>
            </div>
          </header>

          <div class="print-notice-box">
            <strong>Indicaciones para estudiantes:</strong> El ingreso a las salas virtuales de Teams es libre y gratuito. Se habilita 15 minutos antes de la hora fijada. Recuerda iniciar sesión con tu cuenta institucional de estudiante <code>@correo.tdea.edu.co</code>.
          </div>

          <!-- Tablas organizadas por Día -->
          ${daysOrder.map(day => {
            const list = grouped[day];
            if (!list || list.length === 0) return '';

            return `
              <section class="print-day-section">
                <h4 class="print-day-title">🗓️ ${day}</h4>
                <table class="print-table">
                  <thead>
                    <tr>
                      <th style="width: 18%;">Horario</th>
                      <th style="width: 25%;">Asignatura / Área</th>
                      <th style="width: 27%;">Docente</th>
                      <th style="width: 30%;">Correo de Contacto</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${list.map(item => `
                      <tr>
                        <td class="td-time"><strong>${item.time}</strong></td>
                        <td class="td-area"><span class="print-area-tag">${item.area}</span></td>
                        <td class="td-advisor">${item.advisor}</td>
                        <td class="td-email">${item.correo || 'auxcienciasbasicas2@tdea.edu.co'}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </section>
            `;
          }).join('')}

          <!-- Pie de Página Institucional Imprimible -->
          <footer class="print-doc-footer">
            <div class="print-footer-inner">
              <span>Tecnológico de Antioquia · Sede Robledo · Calle 73 No. 73A - 226 · Medellín, Colombia</span>
              <span>Mesa de ayuda: auxcienciasbasicas2@tdea.edu.co · www.tdea.edu.co</span>
            </div>
          </footer>

        </div>

      </div>
    `;

    // Renderizar en un modal especial de impresión a pantalla completa
    let overlay = document.getElementById('tdea-print-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'tdea-print-overlay';
      overlay.className = 'tdea-print-overlay';
      document.body.appendChild(overlay);
    }

    overlay.innerHTML = modalHtml;
    overlay.classList.add('is-active');
    document.body.classList.add('modal-open');

    // Registrar eventos
    const btnPrint = document.getElementById('btn-execute-print');
    const btnClose = document.getElementById('btn-close-print-preview');

    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        window.print();
      });
    }

    if (btnClose) {
      btnClose.addEventListener('click', () => {
        overlay.classList.remove('is-active');
        document.body.classList.remove('modal-open');
      });
    }

    // Cerrar con Escape
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-active')) {
        overlay.classList.remove('is-active');
        document.body.classList.remove('modal-open');
        document.removeEventListener('keydown', onKeyDown);
      }
    };
    document.addEventListener('keydown', onKeyDown);
  }
}
