/**
 * Silueta Anatómica Humana de Alta Fidelidad Proporcional con Difusión Térmica de Dolor
 * Integra la ilustración anatómica médica limpia y proporcional generada con
 * la capa interactiva SVG de gradientes radiales de calor/tensión somática difuminada.
 */

export const BODY_REGIONS_CONFIG = [
  {
    id: 'cabeza',
    label: 'Cabeza y Mandíbula',
    description: 'Dolor de cabeza, pesadez, tensión mandibular o bruxismo.',
    cx: 170,
    cy: 58,
    radius: 26,
    glowRadius: 38,
  },
  {
    id: 'cuello',
    label: 'Cuello y Garganta',
    description: 'Rigidez cervical, sensación de "nudo" en la garganta o tirantez.',
    cx: 170,
    cy: 98,
    radius: 20,
    glowRadius: 28,
  },
  {
    id: 'hombros',
    label: 'Hombros y Trapecios',
    description: 'Sensación de peso acumulado, contracción o nudos en los hombros.',
    cx: 170,
    cy: 126,
    radius: 30,
    glowRadius: 40,
    dual: [
      { cx: 128, cy: 126, radius: 18 },
      { cx: 212, cy: 126, radius: 18 }
    ]
  },
  {
    id: 'pecho',
    label: 'Pecho y Tórax',
    description: 'Opresión, respiración superficial o taquicardia acelerada.',
    cx: 170,
    cy: 154,
    radius: 26,
    glowRadius: 36,
  },
  {
    id: 'estomago',
    label: 'Abdomen y Estómago',
    description: 'Sensación de vacío, nudo, acidez o "mariposas" nerviosas.',
    cx: 170,
    cy: 208,
    radius: 24,
    glowRadius: 34,
  },
  {
    id: 'espalda',
    label: 'Espalda (Alta y Lumbar)',
    description: 'Sobrecarga postural, dolor lumbar y tensión en columna.',
    cx: 170,
    cy: 180,
    radius: 24,
    glowRadius: 32,
  },
  {
    id: 'brazos',
    label: 'Brazos y Manos',
    description: 'Puños apretados, manos frías, sudorosas o temblor en dedos.',
    cx: 170,
    cy: 210,
    radius: 30,
    glowRadius: 38,
    dual: [
      { cx: 98, cy: 210, radius: 18 },
      { cx: 242, cy: 210, radius: 18 }
    ]
  },
  {
    id: 'caderas',
    label: 'Caderas y Pelvis',
    description: 'Tensión pélvica, bloqueo de cadera al estar sentado horas.',
    cx: 170,
    cy: 250,
    radius: 26,
    glowRadius: 36,
  },
  {
    id: 'piernas',
    label: 'Piernas y Rodillas',
    description: 'Inquietud motora, piernas inquietas, pesadez o temblor.',
    cx: 170,
    cy: 350,
    radius: 28,
    glowRadius: 38,
    dual: [
      { cx: 148, cy: 350, radius: 18 },
      { cx: 192, cy: 350, radius: 18 }
    ]
  },
  {
    id: 'pies',
    label: 'Pies y Apoyos',
    description: 'Tensión en talones, pies fríos o inquietud continua al apoyar.',
    cx: 170,
    cy: 462,
    radius: 22,
    glowRadius: 30,
    dual: [
      { cx: 146, cy: 462, radius: 16 },
      { cx: 194, cy: 462, radius: 16 }
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
                style="cursor: pointer;"
              >
                ${region.dual.map(pt => `
                  <circle cx="${pt.cx}" cy="${pt.cy}" r="${pt.radius}" fill="transparent" class="node-hit-area" />
                  <circle cx="${pt.cx}" cy="${pt.cy}" r="14" fill="#FF4D61" opacity="${isSelected ? '0.4' : '0'}" class="node-ring-outer" />
                  <circle cx="${pt.cx}" cy="${pt.cy}" r="8" fill="#FF2E44" opacity="${isSelected ? '0.85' : '0'}" class="node-ring-inner" />
                  <circle cx="${pt.cx}" cy="${pt.cy}" r="4" fill="#FFFFFF" opacity="${isSelected ? '0.95' : '0'}" />
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
              style="cursor: pointer;"
            >
              <circle cx="${region.cx}" cy="${region.cy}" r="${region.radius}" fill="transparent" class="node-hit-area" />
              <circle cx="${region.cx}" cy="${region.cy}" r="16" fill="#FF4D61" opacity="${isSelected ? '0.4' : '0'}" class="node-ring-outer" />
              <circle cx="${region.cx}" cy="${region.cy}" r="9" fill="#FF2E44" opacity="${isSelected ? '0.85' : '0'}" class="node-ring-inner" />
              <circle cx="${region.cx}" cy="${region.cy}" r="4.5" fill="#FFFFFF" opacity="${isSelected ? '0.95' : '0'}" />
            </g>
          `;
        }).join('')}
      </g>
    </svg>
  `;
}
