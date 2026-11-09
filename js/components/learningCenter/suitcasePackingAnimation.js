/**
 * Animación Interactiva de Empaque de la Maleta de Bienestar
 * Módulo 1 - Estación 3: Bitácora del Viajero
 * Campus Vital TdeA 2026
 *
 * Permite al estudiante ver y activar el movimiento interactivo de las 3 herramientas
 * (Brújula Emocional, Rutas Alternativas y Red de Apoyo) volando y acomodándose
 * dentro de la maleta abierta con efectos de luz, partículas y celebración.
 */

export function getSuitcaseAnimationHtml() {
  return `
    <div class="suitcase-packing-container" id="suitcase-packing-container">
      <style>
        .suitcase-packing-container {
          background: linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%);
          border: 2px solid #86EFAC;
          border-radius: 20px;
          padding: 1.5rem;
          margin-bottom: 1.75rem;
          box-shadow: 0 6px 20px rgba(0, 132, 61, 0.08);
          position: relative;
          overflow: hidden;
        }

        .suitcase-packing-header {
          text-align: center;
          margin-bottom: 1.25rem;
        }

        .suitcase-packing-header h4 {
          margin: 0 0 0.35rem 0;
          font-size: 1.25rem;
          font-weight: 800;
          color: #005A29;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .suitcase-packing-header p {
          margin: 0;
          font-size: 0.95rem;
          color: #475569;
          line-height: 1.5;
        }

        /* Bandeja de herramientas flotantes */
        .suitcase-tools-tray {
          display: flex;
          justify-content: center;
          gap: 1.25rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }

        .packing-tool-card {
          background: #FFFFFF;
          border: 2px solid #CBD5E1;
          border-radius: 16px;
          padding: 0.85rem 1.15rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          user-select: none;
          position: relative;
        }

        .packing-tool-card:hover {
          transform: translateY(-4px) scale(1.02);
          border-color: #00843D;
          box-shadow: 0 8px 20px rgba(0, 132, 61, 0.18);
        }

        .packing-tool-card.is-packed {
          background: #F0FDF4;
          border-color: #86EFAC;
          opacity: 0.65;
          pointer-events: none;
        }

        .packing-tool-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          background: #F8FAFC;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.04);
        }

        .packing-tool-info {
          text-align: left;
        }

        .packing-tool-name {
          font-weight: 800;
          font-size: 0.95rem;
          color: #0F172A;
          display: block;
        }

        .packing-tool-station {
          font-size: 0.78rem;
          font-weight: 700;
          color: #00843D;
        }

        .packing-tool-status {
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
          background: #E2E8F0;
          color: #475569;
          margin-left: 0.4rem;
        }

        .packing-tool-card.is-packed .packing-tool-status {
          background: #DCFCE7;
          color: #00843D;
        }

        /* Escenario de la maleta abierta */
        .suitcase-stage-viewport {
          position: relative;
          max-width: 680px;
          margin: 0 auto;
          background: #FFFFFF;
          border-radius: 20px;
          border: 2px solid #E2E8F0;
          padding: 1.5rem 1rem 1rem 1rem;
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
          text-align: center;
        }

        .suitcase-svg-wrap {
          width: 100%;
          max-width: 520px;
          margin: 0 auto;
          position: relative;
        }

        .suitcase-slot-indicator {
          position: absolute;
          border: 2px dashed #94A3B8;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94A3B8;
          font-size: 0.8rem;
          font-weight: 700;
          pointer-events: none;
          transition: all 0.4s ease;
        }

        .suitcase-slot-indicator.active {
          border-color: #00843D;
          background: rgba(0, 132, 61, 0.08);
          color: #00843D;
        }

        /* Animación de entrada de cada objeto */
        .flying-tool-element {
          position: absolute;
          z-index: 20;
          pointer-events: none;
          transition: all 0.85s cubic-bezier(0.25, 1, 0.5, 1);
        }

        /* Controles de la animación */
        .suitcase-controls-bar {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 1.25rem;
          flex-wrap: wrap;
        }

        .btn-pack-all {
          background: linear-gradient(135deg, #00843D 0%, #00602C 100%);
          color: #FFFFFF;
          border: none;
          padding: 0.75rem 1.6rem;
          border-radius: 12px;
          font-weight: 800;
          font-size: 1rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 14px rgba(0, 132, 61, 0.35);
          transition: all 0.2s ease;
        }

        .btn-pack-all:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0, 132, 61, 0.45);
        }

        .btn-pack-reset {
          background: #F1F5F9;
          color: #475569;
          border: 1.5px solid #CBD5E1;
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-pack-reset:hover {
          background: #E2E8F0;
          color: #1E293B;
        }

        .packing-completion-banner {
          display: none;
          background: linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%);
          border: 2px solid #00843D;
          color: #005A29;
          padding: 0.85rem 1.25rem;
          border-radius: 14px;
          font-weight: 800;
          font-size: 1rem;
          margin-top: 1rem;
          animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes popIn {
          0% { transform: scale(0.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      </style>

      <div class="suitcase-packing-header">
        <h4><span>🎒</span> <span>Actividad Interactiva: Empacando tu Maleta de Bienestar</span></h4>
        <p>
          Al inicio del viaje la maleta estaba vacía. Haz clic en <strong>«Empacar herramientas»</strong> (o toca cada herramienta) para ver cómo se mueven y se guardan dentro de tu maleta:
        </p>
      </div>

      <!-- Bandeja de las 3 herramientas recolectadas en el viaje -->
      <div class="suitcase-tools-tray">
        <!-- 1. Red de Apoyo -->
        <div class="packing-tool-card" id="tool-card-red" data-tool="red" title="Haz clic para empacar la Red de Apoyo">
          <div class="packing-tool-icon">🤝</div>
          <div class="packing-tool-info">
            <span class="packing-tool-name">Red de Apoyo</span>
            <span class="packing-tool-station">Estación 3 · Viajar acompañado</span>
          </div>
          <span class="packing-tool-status" id="status-red">Empacar</span>
        </div>

        <!-- 2. Brújula Emocional -->
        <div class="packing-tool-card" id="tool-card-brujula" data-tool="brujula" title="Haz clic para empacar la Brújula Emocional">
          <div class="packing-tool-icon">🧭</div>
          <div class="packing-tool-info">
            <span class="packing-tool-name">Brújula Emocional</span>
            <span class="packing-tool-station">Estación 1 · El clima emocional</span>
          </div>
          <span class="packing-tool-status" id="status-brujula">Empacar</span>
        </div>

        <!-- 3. Rutas Alternativas -->
        <div class="packing-tool-card" id="tool-card-rutas" data-tool="rutas" title="Haz clic para empacar las Rutas Alternativas">
          <div class="packing-tool-icon">🛤️</div>
          <div class="packing-tool-info">
            <span class="packing-tool-name">Rutas Alternativas</span>
            <span class="packing-tool-station">Estación 2 · Del error al aprendizaje</span>
          </div>
          <span class="packing-tool-status" id="status-rutas">Empacar</span>
        </div>
      </div>

      <!-- Escenario de la Maleta Abierta en SVG Interactivo -->
      <div class="suitcase-stage-viewport">
        <div class="suitcase-svg-wrap">
          <svg viewBox="0 0 600 420" width="100%" height="auto" id="svg-suitcase-stage" style="display: block; overflow: visible;">
            <defs>
              <!-- Filtro de sombra suave -->
              <filter id="case-shadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="12" stdDeviation="10" flood-opacity="0.22" flood-color="#022B14"/>
              </filter>
              <!-- Brillo dorado al empacar -->
              <filter id="golden-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <!-- Gradiente cuero exterior -->
              <linearGradient id="leather-outer" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#8B4513"/>
                <stop offset="100%" stop-color="#5C2E0B"/>
              </linearGradient>
              <!-- Gradiente interior maleta -->
              <linearGradient id="leather-inner" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#4A2508"/>
                <stop offset="100%" stop-color="#2D1504"/>
              </linearGradient>
              <!-- Gradiente dorado brújula -->
              <radialGradient id="compass-gold" cx="45%" cy="40%" r="55%">
                <stop offset="0%" stop-color="#FDE047"/>
                <stop offset="60%" stop-color="#EAB308"/>
                <stop offset="100%" stop-color="#A16207"/>
              </radialGradient>
            </defs>

            <!-- Sombra de la maleta en el suelo -->
            <ellipse cx="300" cy="385" rx="240" ry="24" fill="#022B14" opacity="0.18" />

            <!-- CUERPO DE LA MALETA ABIERTA (Base inferior) -->
            <rect x="80" y="240" width="440" height="130" rx="24" fill="url(#leather-outer)" filter="url(#case-shadow)" stroke="#A0522D" stroke-width="4"/>
            <!-- Tapa de la maleta abierta (Atrás) -->
            <rect x="95" y="60" width="410" height="190" rx="20" fill="url(#leather-inner)" stroke="#6B3410" stroke-width="4"/>

            <!-- Forro acolchado interior -->
            <rect x="105" y="70" width="390" height="170" rx="14" fill="#3D1D05" opacity="0.85"/>
            <!-- Compartimento inferior abierto -->
            <rect x="92" y="245" width="416" height="116" rx="18" fill="#381B04"/>

            <!-- Manija de cuero negra con herrajes -->
            <path d="M 230 370 Q 230 405 300 405 Q 370 405 370 370" fill="none" stroke="#1E293B" stroke-width="14" stroke-linecap="round"/>
            <rect x="220" y="360" width="22" height="16" rx="4" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2"/>
            <rect x="358" y="360" width="22" height="16" rx="4" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2"/>

            <!-- Correas y remaches de refuerzo -->
            <rect x="160" y="60" width="16" height="300" fill="#2E1402" opacity="0.6"/>
            <rect x="424" y="60" width="16" height="300" fill="#2E1402" opacity="0.6"/>

            <!-- ============================================================== -->
            <!-- COMPARTIMENTOS Y HERRAMIENTAS INTERIORES                      -->
            <!-- ============================================================== -->

            <!-- 1. SLOT IZQUIERDO: RED DE APOYO -->
            <g id="slot-target-red" transform="translate(170, 230)">
              <!-- Círculo base receptor con halo punteado -->
              <circle cx="0" cy="0" r="54" fill="none" stroke="#FDE047" stroke-dasharray="6,4" stroke-width="2.5" opacity="0.4" id="halo-target-red"/>
              
              <!-- Gráfico de la Red de Apoyo (Inicia oculto o flotando) -->
              <g id="in-case-item-red" opacity="0" transform="scale(0.2)" style="transition: all 0.75s cubic-bezier(0.34, 1.56, 0.64, 1);">
                <!-- Círculo de fondo con aura cálida -->
                <circle cx="0" cy="0" r="48" fill="#F8FAFC" opacity="0.12"/>
                <!-- Tres figuras estilizadas abrazadas (Identidad visual oficial) -->
                <!-- Figura Central (Rosa coral) -->
                <circle cx="0" cy="-14" r="14" fill="#FF6B6B" />
                <path d="M -18 18 C -18 -4, 18 -4, 18 18 Z" fill="#FF6B6B" />
                <!-- Figura Derecha (Blanca / Crema) -->
                <circle cx="16" cy="-8" r="11" fill="#FFE3E3" />
                <path d="M 6 22 C 6 4, 30 4, 30 22 Z" fill="#FFE3E3" />
                <!-- Figura Izquierda (Turquesa / Abrazo) -->
                <circle cx="-16" cy="-8" r="11" fill="#00A896" />
                <path d="M -30 22 C -30 4, -6 4, -6 22 Z" fill="#00A896" />
                <path d="M -24 6 C -20 16, 2 16, 8 8" fill="none" stroke="#00A896" stroke-width="5" stroke-linecap="round"/>
                <!-- Etiqueta debajo -->
                <text x="0" y="38" text-anchor="middle" fill="#FFFFFF" font-size="11" font-weight="800" letter-spacing="0.5">Red de Apoyo</text>
              </g>
            </g>

            <!-- 2. SLOT CENTRAL: BRÚJULA EMOCIONAL -->
            <g id="slot-target-brujula" transform="translate(300, 205)">
              <!-- Círculo base receptor con halo punteado -->
              <circle cx="0" cy="0" r="68" fill="none" stroke="#FDE047" stroke-dasharray="6,4" stroke-width="2.5" opacity="0.4" id="halo-target-brujula"/>
              
              <!-- Gráfico de la Brújula Dorada (Inicia oculto o flotando) -->
              <g id="in-case-item-brujula" opacity="0" transform="scale(0.2)" style="transition: all 0.75s cubic-bezier(0.34, 1.56, 0.64, 1);">
                <!-- Aro superior de la brújula -->
                <circle cx="0" cy="-62" r="14" fill="none" stroke="#EAB308" stroke-width="5"/>
                <rect x="-6" y="-52" width="12" height="10" fill="#CA8A04" rx="2"/>
                <!-- Cuerpo exterior dorado -->
                <circle cx="0" cy="0" r="56" fill="url(#compass-gold)" filter="url(#case-shadow)"/>
                <!-- Borde biselado interior -->
                <circle cx="0" cy="0" r="48" fill="#FEF08A" stroke="#A16207" stroke-width="2"/>
                <circle cx="0" cy="0" r="44" fill="#FFFBEB"/>
                <!-- Puntos cardinales -->
                <text x="0" y="-30" text-anchor="middle" fill="#0F172A" font-size="12" font-weight="900">N</text>
                <text x="34" y="4" text-anchor="middle" fill="#0F172A" font-size="12" font-weight="900">E</text>
                <text x="0" y="38" text-anchor="middle" fill="#0F172A" font-size="12" font-weight="900">S</text>
                <text x="-34" y="4" text-anchor="middle" fill="#0F172A" font-size="12" font-weight="900">W</text>
                <!-- Aguja de la brújula -->
                <polygon points="0,-36 7,0 0,6" fill="#DC2626" />
                <polygon points="0,-36 -7,0 0,6" fill="#EF4444" />
                <polygon points="0,36 7,0 0,-6" fill="#1E293B" />
                <polygon points="0,36 -7,0 0,-6" fill="#475569" />
                <!-- Centro de aguja dorado -->
                <circle cx="0" cy="0" r="6" fill="#FDE047" stroke="#854D0E" stroke-width="2"/>
                <!-- Etiqueta debajo -->
                <text x="0" y="52" text-anchor="middle" fill="#FFFFFF" font-size="11" font-weight="800" letter-spacing="0.5">Brújula</text>
              </g>
            </g>

            <!-- 3. SLOT DERECHO: RUTAS ALTERNATIVAS -->
            <g id="slot-target-rutas" transform="translate(430, 230)">
              <!-- Círculo base receptor con halo punteado -->
              <circle cx="0" cy="0" r="54" fill="none" stroke="#FDE047" stroke-dasharray="6,4" stroke-width="2.5" opacity="0.4" id="halo-target-rutas"/>
              
              <!-- Gráfico de las Rutas Alternativas (Inicia oculto o flotando) -->
              <g id="in-case-item-rutas" opacity="0" transform="scale(0.2)" style="transition: all 0.75s cubic-bezier(0.34, 1.56, 0.64, 1);">
                <!-- Camino en S dorado -->
                <path d="M -30 26 C -30 -10, 0 35, 10 5 C 16 -12, 28 -8, 28 -20" fill="none" stroke="#F59E0B" stroke-width="16" stroke-linecap="round"/>
                <path d="M -30 26 C -30 -10, 0 35, 10 5 C 16 -12, 28 -8, 28 -20" fill="none" stroke="#FDE047" stroke-width="10" stroke-linecap="round"/>
                <!-- Línea discontinua central de la ruta -->
                <path d="M -30 26 C -30 -10, 0 35, 10 5 C 16 -12, 28 -8, 28 -20" fill="none" stroke="#92400E" stroke-width="2" stroke-dasharray="4,4" stroke-linecap="round"/>
                <!-- Pin morado de ubicación -->
                <g transform="translate(28, -24)">
                  <circle cx="0" cy="0" r="10" fill="#8B5CF6" filter="url(#case-shadow)"/>
                  <circle cx="0" cy="0" r="4" fill="#FFFFFF"/>
                </g>
                <!-- Etiqueta debajo -->
                <text x="0" y="38" text-anchor="middle" fill="#FFFFFF" font-size="11" font-weight="800" letter-spacing="0.5">Rutas</text>
              </g>
            </g>
          </svg>
        </div>

        <!-- Barra de Botones de Control de la Animación -->
        <div class="suitcase-controls-bar">
          <button type="button" class="btn-pack-all" id="btn-pack-all-tools">
            <span>✨ Empacar mis 3 herramientas en la maleta</span>
          </button>
          <button type="button" class="btn-pack-reset" id="btn-pack-reset" style="display: none;">
            <span>🔄 Desempacar y repetir</span>
          </button>
        </div>

        <!-- Banner de Felicitación al completar el empaque -->
        <div class="packing-completion-banner" id="packing-banner-success">
          🎉 ¡Excelente! Tus 3 herramientas han entrado a la maleta y están listas para acompañarte.
        </div>
      </div>
    </div>
  `;
}

export function initSuitcasePackingEvents({ onComplete } = {}) {
  const container = document.getElementById('suitcase-packing-container');
  if (!container) return;

  const toolCards = {
    red: container.querySelector('#tool-card-red'),
    brujula: container.querySelector('#tool-card-brujula'),
    rutas: container.querySelector('#tool-card-rutas')
  };

  const inCaseItems = {
    red: container.querySelector('#in-case-item-red'),
    brujula: container.querySelector('#in-case-item-brujula'),
    rutas: container.querySelector('#in-case-item-rutas')
  };

  const statusTags = {
    red: container.querySelector('#status-red'),
    brujula: container.querySelector('#status-brujula'),
    rutas: container.querySelector('#status-rutas')
  };

  const btnPackAll = container.querySelector('#btn-pack-all-tools');
  const btnReset = container.querySelector('#btn-pack-reset');
  const bannerSuccess = container.querySelector('#packing-banner-success');

  const packedState = { red: false, brujula: false, rutas: false };

  function packTool(toolKey) {
    if (packedState[toolKey]) return;
    packedState[toolKey] = true;

    // Actualizar tarjeta exterior
    if (toolCards[toolKey]) {
      toolCards[toolKey].classList.add('is-packed');
    }
    if (statusTags[toolKey]) {
      statusTags[toolKey].innerText = '✓ Guardada';
    }

    // Animar entrada hacia el interior de la maleta
    const itemInCase = inCaseItems[toolKey];
    if (itemInCase) {
      itemInCase.style.opacity = '1';
      itemInCase.style.transform = 'scale(1)';
    }

    checkAllPacked();
  }

  function checkAllPacked() {
    if (packedState.red && packedState.brujula && packedState.rutas) {
      if (btnPackAll) btnPackAll.style.display = 'none';
      if (btnReset) btnReset.style.display = 'inline-flex';
      if (bannerSuccess) bannerSuccess.style.display = 'block';
      if (typeof onComplete === 'function') onComplete();
    }
  }

  function resetPacking() {
    ['red', 'brujula', 'rutas'].forEach(k => {
      packedState[k] = false;
      if (toolCards[k]) toolCards[k].classList.remove('is-packed');
      if (statusTags[k]) statusTags[k].innerText = 'Empacar';
      if (inCaseItems[k]) {
        inCaseItems[k].style.opacity = '0';
        inCaseItems[k].style.transform = 'scale(0.2)';
      }
    });
    if (btnPackAll) btnPackAll.style.display = 'inline-flex';
    if (btnReset) btnReset.style.display = 'none';
    if (bannerSuccess) bannerSuccess.style.display = 'none';
  }

  // Clic en tarjetas individuales
  Object.keys(toolCards).forEach(k => {
    if (toolCards[k]) {
      toolCards[k].addEventListener('click', () => packTool(k));
    }
  });

  // Clic en botón "Empacar todas"
  if (btnPackAll) {
    btnPackAll.addEventListener('click', () => {
      packTool('red');
      setTimeout(() => packTool('brujula'), 300);
      setTimeout(() => packTool('rutas'), 600);
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', resetPacking);
  }
}
