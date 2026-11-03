/**
 * Escáner Biométrico Holográfico - Silueta de Videojuego
 * Centro de Aprendizaje - Campus Vital TdeA
 *
 * Silueta humana futurista, neutral, elegante y fluida con:
 * - Contornos holográficos cian y esmeralda con estética de videojuego.
 * - Línea láser de barrido animada (Scanline HUD).
 * - 10 nodos biométricos interactivos de alta precisión con halos de energía.
 * - Mallas de tensión que se iluminan al ser seleccionadas.
 * - Atributos accesibles (ARIA y teclado).
 */

export function getCyberBodyScannerSvg(selectedRegions = []) {
  const isSel = (id) => selectedRegions.includes(id) ? 'is-selected' : '';

  return `
    <div class="cyber-scanner-hud-viewport">
      <!-- Efecto de Cuadrícula Holográfica de Fondo -->
      <div class="cyber-grid-overlay" aria-hidden="true"></div>

      <!-- Línea Láser de Escaneo Continuo -->
      <div class="cyber-laser-scanner" aria-hidden="true"></div>

      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 420 680" 
        class="cyber-silhouette-svg" 
        id="cyber-silhouette-svg"
        role="region"
        aria-label="Escáner Biométrico Holográfico"
      >
        <defs>
          <!-- Filtros de Neón y Energía -->
          <filter id="neon-glow-green" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#00E676" flood-opacity="0.9" />
            <feDropShadow dx="0" dy="0" stdDeviation="14" flood-color="#00843D" flood-opacity="0.6" />
          </filter>

          <filter id="neon-glow-selected" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#FACC15" flood-opacity="0.95" />
            <feDropShadow dx="0" dy="0" stdDeviation="16" flood-color="#EA580C" flood-opacity="0.7" />
          </filter>

          <filter id="node-pulse-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#38BDF8" flood-opacity="0.8" />
          </filter>

          <!-- Gradiente del cuerpo holográfico -->
          <linearGradient id="cyber-body-base" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0F2D1F" stop-opacity="0.85" />
            <stop offset="50%" stop-color="#083820" stop-opacity="0.75" />
            <stop offset="100%" stop-color="#021E10" stop-opacity="0.9" />
          </linearGradient>

          <linearGradient id="cyber-selected-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FBBF24" stop-opacity="0.85" />
            <stop offset="100%" stop-color="#D97706" stop-opacity="0.95" />
          </linearGradient>
        </defs>

        <!-- AURA HOLOGRÁFICA EXTERIOR (RADAR DE FONDO) -->
        <g class="cyber-radar-elements" opacity="0.35">
          <circle cx="210" cy="340" r="195" fill="none" stroke="#74D633" stroke-width="1" stroke-dasharray="8,6" />
          <circle cx="210" cy="340" r="150" fill="none" stroke="#00E676" stroke-width="0.8" opacity="0.5" />
          <line x1="210" y1="20" x2="210" y2="660" stroke="#74D633" stroke-width="0.5" stroke-dasharray="4,8" />
          <line x1="20" y1="340" x2="400" y2="340" stroke="#74D633" stroke-width="0.5" stroke-dasharray="4,8" />
        </g>

        <!-- SILUETA ANATÓMICA ESTILIZADA FLUIDA (TRAZO CIBERNÉTICO) -->
        <g id="cyber-human-mesh">

          <!-- 1. CABEZA Y MANDÍBULA -->
          <g 
            id="node-cabeza-mandibula" 
            class="cyber-region ${isSel('cabeza-mandibula')}" 
            data-region="cabeza-mandibula" 
            tabindex="0" 
            role="button" 
            aria-label="Zona Cabeza y Mandíbula"
          >
            <!-- Contorno cabeza -->
            <path d="M 210 32 C 176 32, 162 56, 162 90 C 162 122, 180 144, 210 150 C 240 144, 258 122, 258 90 C 258 56, 244 32, 210 32 Z" 
                  class="cyber-zone-fill" />
            <!-- Nodo Central -->
            <circle cx="210" cy="85" r="11" class="cyber-node-target" />
            <circle cx="210" cy="85" r="4.5" class="cyber-node-dot" />
            <text x="210" y="112" class="cyber-label-text">Cabeza y mandíbula</text>
          </g>

          <!-- 2. CUELLO -->
          <g 
            id="node-cuello" 
            class="cyber-region ${isSel('cuello')}" 
            data-region="cuello" 
            tabindex="0" 
            role="button" 
            aria-label="Zona Cuello"
          >
            <path d="M 194 150 L 188 176 L 232 176 L 226 150 Z" class="cyber-zone-fill" />
            <circle cx="210" cy="164" r="8" class="cyber-node-target" />
            <circle cx="210" cy="164" r="3.5" class="cyber-node-dot" />
            <text x="248" y="168" class="cyber-label-text-side">Cuello</text>
          </g>

          <!-- 3. HOMBROS -->
          <g 
            id="node-hombros" 
            class="cyber-region ${isSel('hombros')}" 
            data-region="hombros" 
            tabindex="0" 
            role="button" 
            aria-label="Zona Hombros"
          >
            <!-- Hombro Izq -->
            <path d="M 188 176 L 132 192 C 118 198, 114 214, 122 226 L 154 228 L 174 190 Z" class="cyber-zone-fill" />
            <!-- Hombro Der -->
            <path d="M 232 176 L 288 192 C 302 198, 306 214, 298 226 L 266 228 L 246 190 Z" class="cyber-zone-fill" />
            <!-- Nodos en ambos hombros -->
            <circle cx="136" cy="210" r="9" class="cyber-node-target" />
            <circle cx="136" cy="210" r="4" class="cyber-node-dot" />
            <circle cx="284" cy="210" r="9" class="cyber-node-target" />
            <circle cx="284" cy="210" r="4" class="cyber-node-dot" />
            <text x="210" y="190" class="cyber-label-text">Hombros</text>
          </g>

          <!-- 4. PECHO -->
          <g 
            id="node-pecho" 
            class="cyber-region ${isSel('pecho')}" 
            data-region="pecho" 
            tabindex="0" 
            role="button" 
            aria-label="Zona Pecho"
          >
            <path d="M 154 228 L 174 190 L 246 190 L 266 228 L 258 280 L 162 280 Z" class="cyber-zone-fill" />
            <!-- Retícula torácica -->
            <path d="M 180 238 Q 210 248 240 238" fill="none" stroke="#74D633" stroke-width="1" opacity="0.6" />
            <circle cx="210" cy="245" r="10" class="cyber-node-target" />
            <circle cx="210" cy="245" r="4.5" class="cyber-node-dot" />
            <text x="210" y="268" class="cyber-label-text">Pecho</text>
          </g>

          <!-- 5. ABDOMEN -->
          <g 
            id="node-abdomen" 
            class="cyber-region ${isSel('abdomen')}" 
            data-region="abdomen" 
            tabindex="0" 
            role="button" 
            aria-label="Zona Abdomen"
          >
            <path d="M 162 280 L 258 280 L 250 350 L 170 350 Z" class="cyber-zone-fill" />
            <circle cx="210" cy="315" r="10" class="cyber-node-target" />
            <circle cx="210" cy="315" r="4.5" class="cyber-node-dot" />
            <text x="210" y="338" class="cyber-label-text">Abdomen</text>
          </g>

          <!-- 6. ESPALDA -->
          <g 
            id="node-espalda" 
            class="cyber-region ${isSel('espalda')}" 
            data-region="espalda" 
            tabindex="0" 
            role="button" 
            aria-label="Zona Espalda"
          >
            <!-- Flancos dorsales -->
            <path d="M 154 228 L 162 280 L 170 350 L 152 345 L 140 275 L 138 228 Z" class="cyber-zone-fill" />
            <path d="M 266 228 L 258 280 L 250 350 L 268 345 L 280 275 L 282 228 Z" class="cyber-zone-fill" />
            <circle cx="146" cy="290" r="7.5" class="cyber-node-target" />
            <circle cx="274" cy="290" r="7.5" class="cyber-node-target" />
            <text x="76" y="294" class="cyber-label-text-side">Espalda</text>
          </g>

          <!-- 7. BRAZOS Y MANOS -->
          <g 
            id="node-brazos-manos" 
            class="cyber-region ${isSel('brazos-manos')}" 
            data-region="brazos-manos" 
            tabindex="0" 
            role="button" 
            aria-label="Zona Brazos y Manos"
          >
            <!-- Brazo Izq -->
            <path d="M 122 226 L 100 300 L 86 375 C 82 392, 98 402, 108 395 L 118 365 L 138 295 L 154 228 Z" class="cyber-zone-fill" />
            <!-- Brazo Der -->
            <path d="M 298 226 L 320 300 L 334 375 C 338 392, 322 402, 312 395 L 302 365 L 282 295 L 266 228 Z" class="cyber-zone-fill" />
            <circle cx="98" cy="350" r="8" class="cyber-node-target" />
            <circle cx="98" cy="350" r="3.5" class="cyber-node-dot" />
            <circle cx="322" cy="350" r="8" class="cyber-node-target" />
            <circle cx="322" cy="350" r="3.5" class="cyber-node-dot" />
            <text x="52" y="354" class="cyber-label-text-side">Brazos/Manos</text>
          </g>

          <!-- 8. CADERAS -->
          <g 
            id="node-caderas" 
            class="cyber-region ${isSel('caderas')}" 
            data-region="caderas" 
            tabindex="0" 
            role="button" 
            aria-label="Zona Caderas"
          >
            <path d="M 170 350 L 250 350 L 258 402 L 210 424 L 162 402 Z" class="cyber-zone-fill" />
            <circle cx="210" cy="384" r="9" class="cyber-node-target" />
            <circle cx="210" cy="384" r="4" class="cyber-node-dot" />
            <text x="210" y="405" class="cyber-label-text">Caderas</text>
          </g>

          <!-- 9. PIERNAS -->
          <g 
            id="node-piernas" 
            class="cyber-region ${isSel('piernas')}" 
            data-region="piernas" 
            tabindex="0" 
            role="button" 
            aria-label="Zona Piernas"
          >
            <!-- Pierna Izq -->
            <path d="M 162 402 L 210 424 L 204 515 L 198 600 L 166 598 L 160 510 Z" class="cyber-zone-fill" />
            <!-- Pierna Der -->
            <path d="M 258 402 L 210 424 L 216 515 L 222 600 L 254 598 L 260 510 Z" class="cyber-zone-fill" />
            <circle cx="180" cy="505" r="9" class="cyber-node-target" />
            <circle cx="180" cy="505" r="4" class="cyber-node-dot" />
            <circle cx="240" cy="505" r="9" class="cyber-node-target" />
            <circle cx="240" cy="505" r="4" class="cyber-node-dot" />
            <text x="210" y="525" class="cyber-label-text">Piernas</text>
          </g>

          <!-- 10. PIES -->
          <g 
            id="node-pies" 
            class="cyber-region ${isSel('pies')}" 
            data-region="pies" 
            tabindex="0" 
            role="button" 
            aria-label="Zona Pies"
          >
            <path d="M 166 598 L 198 600 L 200 635 C 200 648, 150 652, 150 638 Z" class="cyber-zone-fill" />
            <path d="M 222 600 L 254 598 L 270 638 C 270 652, 220 648, 220 635 Z" class="cyber-zone-fill" />
            <circle cx="178" cy="626" r="7.5" class="cyber-node-target" />
            <circle cx="242" cy="626" r="7.5" class="cyber-node-target" />
            <text x="210" y="632" class="cyber-label-text">Pies</text>
          </g>

        </g>
      </svg>
    </div>
  `;
}
