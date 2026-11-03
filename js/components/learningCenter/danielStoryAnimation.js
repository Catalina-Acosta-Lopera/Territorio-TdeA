/**
 * Escena Narrativa Ilustrada y Animada de Daniel - Módulo 1 Parte B
 * Ilustración digital artística estilo Headspace/Pixar combinada con microanimaciones interactivas
 */

export function getDanielAnimatedStoryHtml() {
  return `
    <div class="story-scene-container animate-fade-in" id="daniel-story-scene">
      
      <!-- Encabezado de la Narrativa Visual -->
      <div class="story-scene-header">
        <div class="story-character-badge">
          <span class="story-badge-dot"></span>
          <span>SITUACIÓN DE ESTUDIO · CASO DANIEL</span>
        </div>
        <span class="story-hint-text">Ilustración narrativa con microanimaciones interactivas</span>
      </div>

      <!-- Cuadro de Ilustración Digital con Microanimación -->
      <div class="story-illustration-frame-art">
        <div class="story-art-image-wrapper">
          <img 
            src="assets/images/learningCenter/daniel_story_case.jpg" 
            alt="Ilustración de Daniel llegando con su maleta al campus del Tecnológico de Antioquia, pensando en su familia y organizando su tiempo" 
            class="story-art-image"
            loading="lazy"
          />
          <div class="story-art-overlay-gradient"></div>

          <!-- Microindicadores flotantes interactivos -->
          <div class="story-floating-indicator ind-family" title="Nostalgia y familia">
            <span class="ind-icon">❤️</span>
            <span class="ind-label">Familia y Hogar</span>
          </div>

          <div class="story-floating-indicator ind-time" title="Organización del tiempo">
            <span class="ind-icon">⏱️</span>
            <span class="ind-label">Gestión del Tiempo</span>
          </div>

          <div class="story-floating-indicator ind-community" title="Adaptación universitaria">
            <span class="ind-icon">🎓</span>
            <span class="ind-label">Comunidad TdeA</span>
          </div>
        </div>
      </div>

      <!-- Tarjeta Narrativa Acompañante con Puntos Clave del Caso -->
      <div class="story-narrative-summary-card">
        <div class="story-summary-pill-row">
          <span class="story-point-pill">🏡 Llegó de otro municipio</span>
          <span class="story-point-pill">❤️ Extraña a su familia</span>
          <span class="story-point-pill">⏱️ Reto de organización del tiempo</span>
          <span class="story-point-pill">🤝 Integración social y servicios</span>
        </div>
        <p class="story-text-quote">
          <em>"Daniel llegó desde otro municipio para estudiar. Extraña a su familia, le cuesta organizar su tiempo y aún no conoce los servicios de la universidad. Además, no sabe cómo integrarse con otras personas."</em>
        </p>
      </div>

    </div>
  `;
}
