/**
 * Escena Narrativa Ilustrada y Animada de Valentina - Módulo 2 Parte B
 * Ilustración digital artística estilo Headspace/Pixar combinada con microanimaciones interactivas
 */

export function getValentinaAnimatedStoryHtml() {
  return `
    <div class="story-scene-container animate-fade-in" id="valentina-story-scene">
      
      <!-- Encabezado de la Narrativa Visual -->
      <div class="story-scene-header">
        <div class="story-character-badge">
          <span class="story-badge-dot" style="background: #EF4444;"></span>
          <span>SITUACIÓN DE ESTUDIO · CASO VALENTINA</span>
        </div>
        <span class="story-hint-text">Ilustración narrativa con microanimaciones de respuesta somática</span>
      </div>

      <!-- Cuadro de Ilustración Digital con Microanimación -->
      <div class="story-illustration-frame-art">
        <div class="story-art-image-wrapper">
          <img 
            src="assets/images/learningCenter/valentina_story_case.jpg" 
            alt="Ilustración de Valentina esperando el examen final en el aula, con taquicardia y pensamiento catastrófico" 
            class="story-art-image"
            loading="lazy"
          />
          <div class="story-art-overlay-gradient"></div>

          <!-- Microindicadores flotantes interactivos de estrés -->
          <div class="story-floating-indicator ind-heartbeat" title="Taquicardia y respuesta fisiológica">
            <span class="ind-icon anim-heart-beat-pulse">💓</span>
            <span class="ind-label">Latidos Acelerados</span>
          </div>

          <div class="story-floating-indicator ind-exam-time" title="Presión del tiempo inminente">
            <span class="ind-icon">⏳</span>
            <span class="ind-label">Minutos Previos</span>
          </div>

          <div class="story-floating-indicator ind-catastrophic-thought" title="Pensamiento catastrófico">
            <span class="ind-icon">💭</span>
            <span class="ind-label">"¿Y si me va mal?"</span>
          </div>
        </div>
      </div>

      <!-- Tarjeta Narrativa Acompañante con Puntos Clave del Caso -->
      <div class="story-narrative-summary-card">
        <div class="story-summary-pill-row">
          <span class="story-point-pill">📝 Examen final inminente</span>
          <span class="story-point-pill">💓 Taquicardia y manos sudorosas</span>
          <span class="story-point-pill">🧠 Pensamiento absolutista ("voy a perder")</span>
          <span class="story-point-pill">🚪 Impulso de huida / escape</span>
        </div>
        <p class="story-text-quote">
          <em>"Valentina está a pocos minutos de presentar el examen final de una asignatura muy importante. Mientras espera que el docente entregue el examen, comienza a sentir que su corazón late más rápido de lo habitual. Sus manos están sudando y piensa: 'Si me va mal en este examen, voy a perder la materia. Tal vez no soy lo suficientemente buena para estar en la universidad.' Nota que le cuesta concentrarse y siente el impulso de salir del salón porque cree que no podrá responder el examen."</em>
        </p>
      </div>

    </div>
  `;
}
