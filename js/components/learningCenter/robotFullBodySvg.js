/**
 * Mascota Oficial Institucional Territorio TdeA / Campus Vital - CUERPO ENTERO
 * Diseño Vectorial Totalmente Animado en Cada una de sus Partes (Tierno, Amigable e Interactivo)
 * 
 * Partes animadas individualmente:
 * - Birrete académico TdeA con borla dorada oscilante (Péndulo suave).
 * - Cabeza blanca redondeada con inclinación curiosa y tierna (Head tilt).
 * - Pantalla visor esmeralda con ojos grandes sonrientes (^ ^) que parpadean.
 * - Mejillas sonrosadas (Blush) que le dan una expresión súper tierna y dulce.
 * - Sonrisa sutil y amigable en el visor.
 * - Brazo derecho saludando alegremente con oscilación continua en alto.
 * - Brazo izquierdo con balanceo suave de respiración / articulado para abrazos.
 * - Torso robótico con núcleo esmeralda pulsante en forma de corazón.
 * - Corazón emergente para la animación de abrazo cálido.
 * - Piernas y botas propulsoras con luces antigravedad flotantes.
 * - Sombra y pedestal de luz interactivo sobre fondo totalmente transparente.
 */

export function getRobotFullBodySvg({ id = 'robot-official-full', width = '100%', height = '100%' } = {}) {
  return `
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 380 500" 
      width="${width}" 
      height="${height}" 
      id="${id}" 
      class="robot-official-full-svg"
      role="img" 
      aria-label="Mascota Oficial Asistente Territorio TdeA - Totalmente animada"
    >
      <defs>
        <!-- Filtros de resplandor e iluminación suave -->
        <filter id="${id}-drop-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#01240F" flood-opacity="0.5" />
        </filter>
        
        <filter id="${id}-eyes-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#00E676" flood-opacity="0.95" />
          <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="#74D633" flood-opacity="0.75" />
        </filter>
        
        <filter id="${id}-core-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#00E676" flood-opacity="0.95" />
          <feDropShadow dx="0" dy="0" stdDeviation="16" flood-color="#74D633" flood-opacity="0.6" />
        </filter>

        <filter id="${id}-heart-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#F472B6" flood-opacity="0.9" />
          <feDropShadow dx="0" dy="0" stdDeviation="18" flood-color="#EC4899" flood-opacity="0.7" />
        </filter>

        <!-- Gradientes de volumen 3D ultra suaves -->
        <linearGradient id="${id}-white-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="50%" stop-color="#F1F5F9" />
          <stop offset="100%" stop-color="#D8E2EC" />
        </linearGradient>

        <linearGradient id="${id}-screen-visor-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0C3B1E" />
          <stop offset="50%" stop-color="#072814" />
          <stop offset="100%" stop-color="#02140A" />
        </linearGradient>

        <linearGradient id="${id}-mortarboard-top-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#166534" />
          <stop offset="50%" stop-color="#0E4623" />
          <stop offset="100%" stop-color="#052712" />
        </linearGradient>

        <linearGradient id="${id}-lime-accents" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#86EFAC" />
          <stop offset="40%" stop-color="#22C55E" />
          <stop offset="100%" stop-color="#15803D" />
        </linearGradient>

        <linearGradient id="${id}-emerald-core-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4ADE80" />
          <stop offset="50%" stop-color="#00E676" />
          <stop offset="100%" stop-color="#047857" />
        </linearGradient>

        <radialGradient id="${id}-pedestal-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(0, 230, 118, 0.75)" />
          <stop offset="45%" stop-color="rgba(0, 132, 61, 0.35)" />
          <stop offset="100%" stop-color="rgba(0, 132, 61, 0)" />
        </radialGradient>
      </defs>

      <!-- 1. PODIO Y RESPLANDOR ANTIGRAVEDAD EN EL SUELO -->
      <g class="robot-official-ground-shadow">
        <ellipse cx="190" cy="475" rx="90" ry="18" fill="url(#${id}-pedestal-glow)" />
        <ellipse cx="190" cy="475" rx="55" ry="9" fill="#011F0D" opacity="0.45" />
      </g>

      <!-- 2. CUERPO ENTERO FLOTANTE DE LA MASCOTA -->
      <g class="robot-official-float-anim" filter="url(#${id}-drop-shadow)">

        <!-- ===================================================================
             PIERNAS Y BOTAS PROPULSORAS (ANIMADAS EN FLOTACIÓN)
             =================================================================== -->
        <g id="${id}-piernas" class="robot-official-legs">
          <!-- Pierna Izquierda -->
          <g transform="translate(138, 340)">
            <!-- Muslo robótico blanco redondeado -->
            <rect x="2" y="0" width="30" height="64" rx="14" fill="url(#${id}-white-grad)" stroke="#CBD5E1" stroke-width="1.2" />
            <!-- Anillo articular verde lima -->
            <rect x="4" y="44" width="26" height="12" rx="6" fill="url(#${id}-lime-accents)" />
            <!-- Bota de alta tecnología -->
            <path d="M 0 60 L 34 60 L 38 92 Q 17 100 -4 92 Z" fill="url(#${id}-white-grad)" stroke="#CBD5E1" stroke-width="1.2" />
            <ellipse cx="17" cy="94" rx="20" ry="7" fill="#062B15" />
            <!-- Propulsor de luz esmeralda -->
            <ellipse cx="17" cy="95" rx="14" ry="4" fill="#00E676" filter="url(#${id}-core-glow)" />
          </g>

          <!-- Pierna Derecha -->
          <g transform="translate(208, 340)">
            <!-- Muslo robótico blanco redondeado -->
            <rect x="2" y="0" width="30" height="64" rx="14" fill="url(#${id}-white-grad)" stroke="#CBD5E1" stroke-width="1.2" />
            <!-- Anillo articular verde lima -->
            <rect x="4" y="44" width="26" height="12" rx="6" fill="url(#${id}-lime-accents)" />
            <!-- Bota de alta tecnología -->
            <path d="M 0 60 L 34 60 L 38 92 Q 17 100 -4 92 Z" fill="url(#${id}-white-grad)" stroke="#CBD5E1" stroke-width="1.2" />
            <ellipse cx="17" cy="94" rx="20" ry="7" fill="#062B15" />
            <!-- Propulsor de luz esmeralda -->
            <ellipse cx="17" cy="95" rx="14" ry="4" fill="#00E676" filter="url(#${id}-core-glow)" />
          </g>
        </g>

        <!-- ===================================================================
             TORSO ROBÓTICO BLANCO CON NÚCLEO ESMERALDA PULSANTE
             =================================================================== -->
        <g id="${id}-torso" class="robot-official-torso">
          <!-- Torso blanco pulido y tierno -->
          <path 
            d="M 118 215 
               C 96 238, 96 322, 124 348 
               C 146 362, 234 362, 256 348 
               C 284 322, 284 238, 262 215 
               C 230 205, 150 205, 118 215 Z" 
            fill="url(#${id}-white-grad)" 
            stroke="#CBD5E1" 
            stroke-width="1.6"
          />

          <!-- Cinturón Técnico Verde Bosque -->
          <path d="M 122 330 Q 190 344 258 330 L 255 344 Q 190 358 125 344 Z" fill="#08381D" />
          <rect x="172" y="328" width="36" height="18" rx="6" fill="url(#${id}-lime-accents)" stroke="#062B15" stroke-width="1.5" />
          <circle cx="190" cy="337" r="4.5" fill="#FFFFFF" />

          <!-- Pechera Robótica con Placa y Núcleo de Bienestar -->
          <path d="M 144 235 Q 190 225 236 235 L 226 308 Q 190 324 154 308 Z" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.2" />
          
          <!-- Núcleo de Energía Esmeralda Pulsante (Corazón robótico Campus Vital) -->
          <g class="robot-official-core-glow">
            <circle cx="190" cy="272" r="18" fill="url(#${id}-emerald-core-grad)" filter="url(#${id}-core-glow)" />
            <circle cx="190" cy="272" r="10" fill="#FFFFFF" opacity="0.9" />
            <!-- Emblema sutil de hoja/corazón de bienestar -->
            <path d="M 190 266 C 186 261 178 263 178 270 C 178 277 190 283 190 283 C 190 283 202 277 202 270 C 202 263 194 261 190 266 Z" fill="#00E676" />
          </g>

          <!-- Corazón para la animación del abrazo (se activa en estado de abrazo) -->
          <g class="robot-official-hug-heart" id="${id}-hug-heart">
            <path 
              d="M 190 252 
                 C 176 234, 146 242, 146 268 
                 C 146 292, 190 320, 190 320 
                 C 190 320, 234 292, 234 268 
                 C 234 242, 204 234, 190 252 Z" 
              fill="#F472B6" 
              filter="url(#${id}-heart-glow)" 
            />
            <path 
              d="M 190 258 
                 C 180 244, 156 250, 156 270 
                 C 156 288, 190 310, 190 310 
                 C 190 310, 224 288, 224 270 
                 C 224 250, 200 244, 190 258 Z" 
              fill="#FDF2F8" 
              opacity="0.6"
            />
          </g>
        </g>

        <!-- ===================================================================
             BRAZOS ROBÓTICOS ARTICULADOS Y ANIMADOS
             =================================================================== -->
        <!-- Brazo Izquierdo: Movimiento de respiración suave y articulación de abrazo -->
        <g id="${id}-brazo-izq" class="robot-official-arm-left">
          <!-- Hombro esférico -->
          <circle cx="110" cy="244" r="16" fill="url(#${id}-white-grad)" stroke="#CBD5E1" stroke-width="1.2" />
          <!-- Brazo y antebrazo -->
          <path d="M 100 248 L 94 305 Q 108 325 118 305 L 122 248 Z" fill="url(#${id}-white-grad)" stroke="#CBD5E1" stroke-width="1.2" />
          <!-- Pulsera verde lima -->
          <rect x="96" y="298" width="22" height="10" rx="5" fill="url(#${id}-lime-accents)" />
          <!-- Mano/guante robótico redondeado -->
          <circle cx="106" cy="316" r="14" fill="url(#${id}-white-grad)" stroke="#CBD5E1" stroke-width="1.2" />
        </g>

        <!-- Brazo Derecho: Saludando en alto alegremente (Animado) -->
        <g id="${id}-brazo-der" class="robot-official-wave-arm">
          <!-- Hombro esférico -->
          <circle cx="270" cy="242" r="16" fill="url(#${id}-white-grad)" stroke="#CBD5E1" stroke-width="1.2" />
          <!-- Brazo alzado hacia arriba saludando -->
          <path 
            d="M 276 236 
               C 295 208, 318 162, 334 130 
               C 342 115, 324 104, 312 122 
               C 292 150, 272 195, 260 215 Z" 
            fill="url(#${id}-white-grad)" 
            stroke="#CBD5E1" 
            stroke-width="1.2"
          />
          <!-- Pulsera verde lima del guantelete -->
          <rect x="314" y="128" width="20" height="9" rx="4.5" fill="url(#${id}-lime-accents)" transform="rotate(-30 314 128)" />
          <!-- Mano y dedos saludando amigablemente -->
          <ellipse cx="332" cy="116" rx="13" ry="16" fill="url(#${id}-white-grad)" stroke="#CBD5E1" stroke-width="1.2" transform="rotate(-20 332 116)" />
          <circle cx="343" cy="110" r="5" fill="url(#${id}-white-grad)" />
          <circle cx="334" cy="104" r="4.5" fill="url(#${id}-white-grad)" />
          <circle cx="324" cy="106" r="4.5" fill="url(#${id}-white-grad)" />
        </g>

        <!-- ===================================================================
             CABEZA TIERNA DE LA MASCOTA TdeA (INCLINACIÓN Y EXPRESIONES)
             =================================================================== -->
        <g id="${id}-cabeza" class="robot-official-head">
          <!-- Casco blanco redondeado y suave -->
          <ellipse cx="190" cy="148" rx="104" ry="90" fill="url(#${id}-white-grad)" />
          <!-- Brillo superior del cristal del casco -->
          <path d="M 128 92 Q 190 70 252 92 Q 190 82 128 92 Z" fill="#FFFFFF" opacity="0.95" />

          <!-- Auricular Izquierdo (Acolchado verde lima redondeado) -->
          <g transform="translate(70, 115)">
            <rect x="0" y="0" width="38" height="66" rx="19" ry="19" fill="url(#${id}-lime-accents)" />
            <rect x="6" y="8" width="12" height="50" rx="6" ry="6" fill="#0C4524" opacity="0.45" />
          </g>

          <!-- Auricular Derecho (Acolchado verde lima redondeado) -->
          <g transform="translate(272, 115)">
            <rect x="0" y="0" width="38" height="66" rx="19" ry="19" fill="url(#${id}-lime-accents)" />
            <rect x="20" y="8" width="12" height="50" rx="6" ry="6" fill="#0C4524" opacity="0.45" />
          </g>

          <!-- Pantalla Visor Facial (Negro esmeralda profundo y brillante) -->
          <rect x="112" y="94" width="156" height="104" rx="36" ry="36" fill="url(#${id}-screen-visor-grad)" />
          <!-- Reflejo curvo del cristal del visor -->
          <path d="M 124 112 Q 190 95 256 104 Q 190 102 124 118 Z" fill="#FFFFFF" opacity="0.22" />

          <!-- MEJILLAS SONROSADAS TIERNAS (BLUSH KAWAII) -->
          <g class="robot-official-blush">
            <ellipse cx="138" cy="164" rx="14" ry="7" fill="#F472B6" opacity="0.75" />
            <ellipse cx="242" cy="164" rx="14" ry="7" fill="#F472B6" opacity="0.75" />
          </g>

          <!-- OJOS OFICIALES: Grandes arcos blancos sonrientes (^ ^) con resplandor verde lima -->
          <g class="robot-official-eyes" filter="url(#${id}-eyes-glow)">
            <!-- Ojo Izquierdo (^ tierno) -->
            <path d="M 138 148 C 138 126, 172 126, 172 148" fill="none" stroke="#FFFFFF" stroke-width="10.5" stroke-linecap="round" />
            <!-- Ojo Derecho (^ tierno) -->
            <path d="M 208 148 C 208 126, 242 126, 242 148" fill="none" stroke="#FFFFFF" stroke-width="10.5" stroke-linecap="round" />
            <!-- Destellos en los ojos -->
            <circle cx="155" cy="132" r="3" fill="#FFFFFF" />
            <circle cx="225" cy="132" r="3" fill="#FFFFFF" />
          </g>

          <!-- Sonrisa simpática en la pantalla -->
          <path d="M 178 168 Q 190 178 202 168" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" opacity="0.95" />

          <!-- Micrófono de Diadema Institucional con LED esmeralda -->
          <path d="M 98 176 Q 120 202 158 198" fill="none" stroke="#162E22" stroke-width="7" stroke-linecap="round" />
          <rect x="154" y="188" width="26" height="18" rx="9" fill="#0C4524" stroke="#74D633" stroke-width="2.2" />
          <circle cx="167" cy="197" r="3.5" fill="#00E676" filter="url(#${id}-core-glow)" />
        </g>

        <!-- ===================================================================
             BIRRETE OFICIAL TdeA (CON LOGO OFICIAL Y BORLA DORADA OSCILANTE)
             =================================================================== -->
        <g id="${id}-birrete" class="robot-official-mortarboard">
          <!-- Casquete base cilíndrico del birrete -->
          <path d="M 120 80 Q 190 100 260 80 L 250 54 Q 190 70 130 54 Z" fill="#073019" />
          
          <!-- Logo oficial TdeA en la banda del birrete -->
          <g transform="translate(160, 58) scale(0.38)">
            <circle cx="28" cy="28" r="22" fill="#FFFFFF" />
            <path d="M 18 28 Q 28 14 38 28 Q 28 22 18 28 Z" fill="#09381E" />
            <circle cx="28" cy="18" r="5" fill="#09381E" />
            <text x="56" y="36" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" letter-spacing="0.8">TdeA</text>
          </g>

          <!-- Placa de diamante superior del birrete (Mortarboard) -->
          <!-- Borde verde lima institucional -->
          <polygon points="190,6 316,62 190,88 64,62" fill="#74D633" />
          <!-- Superficie superior verde bosque oscuro institucional -->
          <polygon points="190,0 312,58 190,82 68,58" fill="url(#${id}-mortarboard-top-grad)" />
          <polygon points="190,0 190,82 68,58" fill="#031A0D" opacity="0.32" />

          <!-- Botón dorado central -->
          <circle cx="190" cy="42" r="8" fill="#FACC15" stroke="#CA8A04" stroke-width="2" />

          <!-- Borla dorada oscilante (Péndulo animado) -->
          <g class="robot-official-tassel">
            <path d="M 190 42 Q 136 60 122 96" fill="none" stroke="#CA8A04" stroke-width="2.8" />
            <rect x="116" y="94" width="14" height="22" rx="5" fill="#FACC15" stroke="#CA8A04" stroke-width="1.5" />
          </g>
        </g>

      </g> <!-- Fin Grupo Animado Flotante -->
    </svg>
  `;
}
