/**
 * Silueta Anatómica Humana de Alta Fidelidad Proporcional con Difusión Térmica de Dolor
 * Integra la ilustración anatómica médica limpia y proporcional generada con
 * la capa interactiva SVG de gradientes radiales de calor/tensión somática difuminada.
 */

export const BODY_REGIONS_CONFIG = [
  {
    id: 'cabeza',
    label: 'Cabeza y Mandíbula',
    description: 'Dolores de cabeza tensionales, pesadez, tensión en mandíbula (bruxismo).',
    glowRadius: 38,
    dual: [
      { cx: 170, cy: 55, radius: 24, glowRadius: 36 }, // Cabeza / Frente
      { cx: 170, cy: 82, radius: 18, glowRadius: 28 }  // Mandíbula
    ]
  },
  {
    id: 'cuello',
    label: 'Cuello y Hombros',
    description: 'Rigidez cervical y acumulación de carga física en los trapecios.',
    glowRadius: 36,
    dual: [
      { cx: 170, cy: 104, radius: 18, glowRadius: 28 }, // Cuello / Garganta
      { cx: 126, cy: 124, radius: 20, glowRadius: 32 }, // Hombro izquierdo
      { cx: 214, cy: 124, radius: 20, glowRadius: 32 }  // Hombro derecho
    ]
  },
  {
    id: 'pecho',
    label: 'Pecho y Tórax',
    description: 'Respiración rápida o corta, taquicardia o sensación de opresión.',
    cx: 170,
    cy: 154,
    radius: 26,
    glowRadius: 38,
  },
  {
    id: 'estomago',
    label: 'Estómago y Abdomen',
    description: 'Molestias digestivas, sensación de vacío, nudo o "mariposas" nerviosas.',
    cx: 170,
    cy: 206,
    radius: 26,
    glowRadius: 38,
  },
  {
    id: 'brazos',
    label: 'Manos y Brazos',
    description: 'Sudoración palmar, manos frías, puños apretados o temblor leve.',
    glowRadius: 34,
    dual: [
      { cx: 98, cy: 210, radius: 20, glowRadius: 34 }, // Brazo / Mano izquierda
      { cx: 242, cy: 210, radius: 20, glowRadius: 34 }  // Brazo / Mano derecha
    ]
  },
  {
    id: 'piernas',
    label: 'Piernas y Pies',
    description: 'Inquietud motora, tensión muscular, temblor o ganas de caminar.',
    glowRadius: 38,
    dual: [
      { cx: 148, cy: 345, radius: 22, glowRadius: 36 }, // Pierna / Rodilla izquierda
      { cx: 192, cy: 345, radius: 22, glowRadius: 36 }  // Pierna / Rodilla derecha
    ]
  }
];

export function getBodySilhouetteSvg({ id = 'body-pain-silhouette', selectedIds = [] } = {}) {
  const selectedSet = new Set(selectedIds);

  return `
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 340 500" 
      width="100%" 
      height="100%" 
      id="${id}" 
      class="body-pain-silhouette-svg"
      role="img" 
      aria-label="Silueta anatómica proporcional de alta fidelidad para mapeo de tensión somática"
    >
      <defs>
        <!-- Filtro para difuminar el dolor con el cuerpo de forma orgánica -->
        <filter id="${id}-diffuse-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" opacity="0.85" />
          </feMerge>
        </filter>

        <!-- Gradiente radial de dolor térmico difuminado (Rojo coral cálido) -->
        <radialGradient id="${id}-pain-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FF2E44" stop-opacity="0.95" />
          <stop offset="35%" stop-color="#FF4D61" stop-opacity="0.75" />
          <stop offset="65%" stop-color="#FF7582" stop-opacity="0.4" />
          <stop offset="88%" stop-color="#FFA4AD" stop-opacity="0.15" />
          <stop offset="100%" stop-color="#FFA4AD" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- 1. BASE: ILUSTRACIÓN ANATÓMICA MÉDICA PROPORCIONADA DE ALTA CALIDAD -->
      <image 
        href="assets/images/learningCenter/human_body_contour.jpg" 
        x="15" 
        y="0" 
        width="310" 
        height="490" 
        preserveAspectRatio="xMidYMid meet" 
        class="body-contour-art-image"
      />

      <!-- 2. CAPA DE DOLOR DIFUMINADO QUE SE FUNDE ORGÁNICAMENTE CON EL CUERPO -->
      <g id="${id}-pain-layer" class="body-pain-diffuse-layer" filter="url(#${id}-diffuse-blur)">
        ${BODY_REGIONS_CONFIG.map(region => {
          const isSelected = selectedSet.has(region.id);
          const opacity = isSelected ? '1' : '0';
          
          if (region.dual) {
            return `
              <g id="${id}-glow-${region.id}" class="pain-glow-group ${isSelected ? 'active' : ''}" style="transition: opacity 0.3s ease; opacity: ${opacity};">
                ${region.dual.map(pt => `
                  <circle cx="${pt.cx}" cy="${pt.cy}" r="${region.glowRadius || 36}" fill="url(#${id}-pain-glow)" />
                `).join('')}
              </g>
            `;
          }

          return `
            <g id="${id}-glow-${region.id}" class="pain-glow-group ${isSelected ? 'active' : ''}" style="transition: opacity 0.3s ease; opacity: ${opacity};">
              <circle cx="${region.cx}" cy="${region.cy}" r="${region.glowRadius || 36}" fill="url(#${id}-pain-glow)" />
            </g>
          `;
        }).join('')}
      </g>

      <!-- 3. PUNTOS INTERACTIVOS CON ANILLOS TÁCTILES Y PULSO -->
      <g id="${id}-interactive-nodes" class="body-nodes-interactive-layer">
        ${BODY_REGIONS_CONFIG.map(region => {
          const isSelected = selectedSet.has(region.id);
          
          if (region.dual) {
            return `
              <g 
                class="body-region-click-target ${isSelected ? 'is-selected' : ''}" 
                data-region-id="${region.id}" 
                tabindex="0" 
                role="button" 
                aria-pressed="${isSelected}"
                aria-label="${region.label}: ${region.description}"
                style="cursor: pointer; pointer-events: all;"
              >
                ${region.dual.map(pt => `
                  <circle cx="${pt.cx}" cy="${pt.cy}" r="32" fill="rgba(255, 46, 68, 0.001)" style="pointer-events: all; cursor: pointer;" class="node-hit-area" />
                  <circle cx="${pt.cx}" cy="${pt.cy}" r="16" fill="#FF4D61" opacity="${isSelected ? '0.5' : '0.15'}" class="node-ring-outer" style="pointer-events: none;" />
                  <circle cx="${pt.cx}" cy="${pt.cy}" r="9" fill="#FF2E44" opacity="${isSelected ? '0.9' : '0.3'}" class="node-ring-inner" style="pointer-events: none;" />
                  <circle cx="${pt.cx}" cy="${pt.cy}" r="4" fill="#FFFFFF" opacity="${isSelected ? '1' : '0.6'}" style="pointer-events: none;" />
                `).join('')}
              </g>
            `;
          }

          return `
            <g 
              class="body-region-click-target ${isSelected ? 'is-selected' : ''}" 
              data-region-id="${region.id}" 
              tabindex="0" 
              role="button" 
              aria-pressed="${isSelected}"
              aria-label="${region.label}: ${region.description}"
              style="cursor: pointer; pointer-events: all;"
            >
              <circle cx="${region.cx}" cy="${region.cy}" r="36" fill="rgba(255, 46, 68, 0.001)" style="pointer-events: all; cursor: pointer;" class="node-hit-area" />
              <circle cx="${region.cx}" cy="${region.cy}" r="18" fill="#FF4D61" opacity="${isSelected ? '0.5' : '0.15'}" class="node-ring-outer" style="pointer-events: none;" />
              <circle cx="${region.cx}" cy="${region.cy}" r="10" fill="#FF2E44" opacity="${isSelected ? '0.9' : '0.3'}" class="node-ring-inner" style="pointer-events: none;" />
              <circle cx="${region.cx}" cy="${region.cy}" r="4.5" fill="#FFFFFF" opacity="${isSelected ? '1' : '0.6'}" style="pointer-events: none;" />
            </g>
          `;
        }).join('')}
      </g>
    </svg>
  `;
}
