/**
 * Componente Reutilizable PodcastCard y Reproductor Modal
 * Serie de Podcasts Oficiales Campus Vital - Tecnológico de Antioquia
 * 
 * Presenta las tarjetas de podcast en formato editorial blanco limpio,
 * idéntico al catálogo de Guías y Talleres Prácticos (Imagen 2), sin mascota,
 * con metadatos oficiales de Bienestar y reproductor accesible integrado.
 */

import { modal } from './modal.js';
import { getPodcastById } from '../data/podcastsData.js';

export class PodcastCard {
  /**
   * Genera el HTML de una tarjeta de podcast estilo editorial limpio (Imagen 2) sin robot
   * @param {Object} podcast Datos del podcast
   * @returns {string} Código HTML
   */
  static render(podcast) {
    return `
      <article class="resource-card podcast-card has-academic-content animate-fade-in" data-podcast-id="${podcast.id}">
        
        <!-- 1. Encabezado con Insignias Institucionales (Estilo Idéntico a Guías y Talleres - Imagen 2) -->
        <div class="resource-card-header">
          <div class="resource-card-badges">
            <span class="badge badge-resource-type">🎙️ Podcast</span>
            <span class="badge badge-status-available">${podcast.statusText || 'Disponible'}</span>
            <span class="badge badge-pedagogical">✔ Con Audio Oficial</span>
          </div>
          <span class="resource-category-tag">${podcast.tagCategory}</span>
        </div>

        <!-- 2. Contenido Textual Institucional -->
        <div class="resource-card-content podcast-content-body">
          <h4 class="resource-card-title podcast-title">
            ${podcast.title}
          </h4>

          <div class="podcast-meta-row">
            <div class="podcast-speaker-badge">
              <span class="podcast-speaker-icon" aria-hidden="true">🎙️</span>
              <span class="podcast-speaker-name">${podcast.speaker}</span>
            </div>
            <div class="podcast-duration-badge">
              <span aria-hidden="true">⏱️</span>
              <span>Duración: ${podcast.duration}</span>
            </div>
          </div>

          <p class="resource-card-desc podcast-desc">
            ${podcast.description}
          </p>
        </div>

        <!-- 3. Fila de Acciones Duales (Idéntica a Imagen 2) -->
        <div class="resource-card-footer podcast-footer">
          <div class="resource-actions-dual">
            <button 
              type="button" 
              class="btn-resource-read btn-podcast-play-action" 
              data-play-podcast="${podcast.id}"
              aria-label="Escuchar ${podcast.shortTitle}"
            >
              <span aria-hidden="true">▶</span>
              <span>Escuchar Podcast</span>
            </button>

            <a 
              href="${podcast.audioUrl}" 
              download="${podcast.downloadFilename}" 
              class="btn-resource-download btn-podcast-download-action"
              aria-label="Descargar audio MP3 de ${podcast.shortTitle}"
              title="Descargar este episodio en MP3 (${podcast.duration})"
            >
              <span aria-hidden="true">📥</span>
              <span>Descargar (MP3)</span>
            </a>
          </div>
        </div>

      </article>
    `;
  }

  /**
   * Abre el modal del reproductor de podcast con controles interactivos, resumen y temas clave
   * @param {Object} podcast Datos del podcast
   */
  static openPlayerModal(podcast) {
    if (!podcast) return;

    const modalBodyHtml = `
      <div class="podcast-modal-layout" id="podcast-modal-root">
        
        <!-- Cabecera Institucional del Reproductor Sin Robot -->
        <div class="podcast-modal-header-hero" style="background: linear-gradient(135deg, #022B14 0%, #064E3B 55%, #008744 100%);">
          <div class="podcast-modal-hero-left">
            <div class="podcast-modal-icon-badge" aria-hidden="true">
              <span style="font-size: 2.2rem;">🎙️</span>
            </div>
            <div class="podcast-modal-hero-text">
              <div class="podcast-pill-tag" style="background: rgba(255,255,255,0.2); color: #FFFFFF; display: inline-flex; margin-bottom: 0.4rem;">
                <span>🎧</span> <strong>${podcast.episodeTag}</strong> · ${podcast.duration}
              </div>
              <h3 class="podcast-modal-title" style="color: #FFFFFF; margin: 0 0 0.35rem 0; font-size: 1.25rem; font-weight: 800; line-height: 1.3;">
                ${podcast.title}
              </h3>
              <div style="font-size: 0.88rem; color: #E2E8F0; font-weight: 600;">
                <span>👤</span> <span>${podcast.speaker}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Reproductor de Audio Accesible DUA -->
        <div class="podcast-modal-player-card">
          <div class="podcast-player-main-controls">
            
            <!-- Botón Retroceder 15s -->
            <button 
              type="button" 
              class="podcast-btn-skip" 
              id="pm-btn-rewind" 
              aria-label="Retroceder 15 segundos"
              title="Retroceder 15 segundos (Atrasar)"
            >
              <span class="skip-icon" aria-hidden="true">↺</span>
              <span class="skip-num">15s</span>
            </button>

            <!-- Botón Central Play / Pause -->
            <button type="button" class="podcast-btn-play-large" id="pm-btn-play" aria-label="Reproducir episodio">
              <span id="pm-play-icon" style="font-size: 1.5rem; margin-left: 3px;">▶</span>
            </button>

            <!-- Botón Adelantar 15s -->
            <button 
              type="button" 
              class="podcast-btn-skip" 
              id="pm-btn-forward" 
              aria-label="Adelantar 15 segundos"
              title="Adelantar 15 segundos (Avanzar)"
            >
              <span class="skip-icon" aria-hidden="true">↻</span>
              <span class="skip-num">15s</span>
            </button>

            <!-- Columna de la Línea de Tiempo / Scrubber -->
            <div class="podcast-scrubber-col">
              <div class="podcast-scrubber-top">
                <span class="podcast-track-label">Audio Oficial Campus Vital TdeA</span>
                <span class="podcast-time-indicator" id="pm-time-label">0:00 / ${podcast.duration}</span>
              </div>
              <input 
                type="range" 
                class="podcast-scrubber-input" 
                id="pm-scrubber" 
                min="0" 
                max="${podcast.durationSec || 1720}" 
                step="1"
                value="0" 
                aria-label="Línea de tiempo del podcast (Arrastra o haz clic para adelantar o atrasar)"
              />
            </div>

          </div>

          <!-- Fila de opciones de reproducción: Velocidad y Descarga -->
          <div class="podcast-player-sub-row">
            <div class="podcast-speed-controls" role="group" aria-label="Velocidad de reproducción">
              <span style="font-size: 0.8rem; font-weight: 700; color: #64748B;">Velocidad:</span>
              <button type="button" class="btn-speed-pill is-active" data-speed="1">1x</button>
              <button type="button" class="btn-speed-pill" data-speed="1.25">1.25x</button>
              <button type="button" class="btn-speed-pill" data-speed="1.5">1.5x</button>
            </div>

            <a 
              href="${podcast.audioUrl}" 
              download="${podcast.downloadFilename}" 
              class="podcast-download-chip"
              title="Descargar archivo de audio MP3"
            >
              <span>📥</span> <span>Descargar MP3 (${podcast.duration})</span>
            </a>
          </div>

          <audio id="pm-audio-element" src="${podcast.audioUrl}" preload="auto"></audio>
        </div>

        <!-- Resumen Pedagógico y Temas Clave -->
        <div class="podcast-modal-info-section">
          <h4 style="font-size: 1rem; font-weight: 800; color: #022B14; margin: 0 0 0.5rem 0;">
            Sobre este episodio:
          </h4>
          <p style="font-size: 0.92rem; color: #334155; line-height: 1.55; margin: 0 0 1rem 0;">
            ${podcast.description}
          </p>

          <h4 style="font-size: 0.95rem; font-weight: 800; color: #00843D; margin: 0 0 0.5rem 0; display: flex; align-items: center; gap: 0.4rem;">
            <span>💡</span> <span>Temas clave abordados en la conversación:</span>
          </h4>
          <ul class="podcast-topics-list">
            ${podcast.topics.map(t => `<li><strong>•</strong> <span>${t}</span></li>`).join('')}
          </ul>
        </div>

      </div>
    `;

    modal.open({
      title: `🎙️ Campus Vital TdeA · ${podcast.episodeTag}`,
      bodyHtml: modalBodyHtml
    });

    // Vincular lógica de reproducción del modal
    const audioEl = document.getElementById('pm-audio-element');
    const playBtn = document.getElementById('pm-btn-play');
    const playIcon = document.getElementById('pm-play-icon');
    const rewindBtn = document.getElementById('pm-btn-rewind');
    const forwardBtn = document.getElementById('pm-btn-forward');
    const scrubber = document.getElementById('pm-scrubber');
    const timeLabel = document.getElementById('pm-time-label');

    if (!audioEl || !playBtn) return;

    let isSeeking = false;

    const getDuration = () => {
      const dur = audioEl.duration;
      if (dur && !isNaN(dur) && isFinite(dur) && dur > 0) {
        return dur;
      }
      return podcast.durationSec || 1720;
    };

    const formatSecs = (sec) => {
      if (isNaN(sec) || sec < 0) return '0:00';
      const totalSec = Math.floor(sec);
      const m = Math.floor(totalSec / 60);
      const s = totalSec % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const updateTimeLabel = (curTime) => {
      if (timeLabel) {
        timeLabel.textContent = `${formatSecs(curTime)} / ${podcast.duration}`;
      }
    };

    const updateTrackFill = (curTime, dur) => {
      if (!scrubber) return;
      const pct = Math.max(0, Math.min(100, (curTime / (dur || 1)) * 100));
      scrubber.style.background = `linear-gradient(to right, #00843D ${pct}%, #E2E8F0 ${pct}%)`;
    };

    const syncDuration = () => {
      const dur = getDuration();
      if (scrubber) {
        scrubber.max = Math.floor(dur);
      }
      updateTrackFill(audioEl.currentTime, dur);
    };

    audioEl.addEventListener('loadedmetadata', syncDuration);
    audioEl.addEventListener('durationchange', syncDuration);
    audioEl.addEventListener('canplay', syncDuration);

    // Sincronizar estado visual del botón según eventos del elemento de audio
    audioEl.addEventListener('play', () => {
      if (playIcon) playIcon.textContent = '⏸';
      playBtn.setAttribute('aria-label', 'Pausar episodio');
    });

    audioEl.addEventListener('pause', () => {
      if (playIcon) playIcon.textContent = '▶';
      playBtn.setAttribute('aria-label', 'Reproducir episodio');
    });

    // En caso de error de red o 404 en el archivo local, intentar con CDN oficial remoto
    let hasTriedFallback = false;
    const tryRemoteFallback = () => {
      if (!hasTriedFallback && podcast.remoteAudioUrl && audioEl.src !== podcast.remoteAudioUrl) {
        hasTriedFallback = true;
        console.warn(`[PodcastCard] Intentando fallback remoto para ${podcast.id}: ${podcast.remoteAudioUrl}`);
        const curTime = audioEl.currentTime || 0;
        audioEl.src = podcast.remoteAudioUrl;
        audioEl.load();
        if (curTime > 0) {
          audioEl.currentTime = curTime;
        }
        audioEl.play().catch(err => console.warn('[PodcastCard] Fallback play error:', err));
      }
    };

    audioEl.addEventListener('error', (e) => {
      console.warn('[PodcastCard] Error cargando fuente de audio principal:', e);
      tryRemoteFallback();
    });

    const togglePlay = () => {
      if (audioEl.paused) {
        const playPromise = audioEl.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('[PodcastCard] Play interrumpido o fallido, intentando fallback:', err);
            tryRemoteFallback();
          });
        }
      } else {
        audioEl.pause();
      }
    };

    playBtn.addEventListener('click', togglePlay);

    // Botones de salto: Retroceder y Adelantar 15 segundos
    if (rewindBtn) {
      rewindBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetTime = Math.max(0, audioEl.currentTime - 15);
        audioEl.currentTime = targetTime;
        if (scrubber) scrubber.value = targetTime;
        updateTimeLabel(targetTime);
        updateTrackFill(targetTime, getDuration());
      });
    }

    if (forwardBtn) {
      forwardBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const dur = getDuration();
        const targetTime = Math.min(dur - 0.5, audioEl.currentTime + 15);
        audioEl.currentTime = targetTime;
        if (scrubber) scrubber.value = targetTime;
        updateTimeLabel(targetTime);
        updateTrackFill(targetTime, dur);
      });
    }

    // Actualización continua de la barra mientras reproduce
    audioEl.addEventListener('timeupdate', () => {
      if (isSeeking) return; // No interferir mientras el usuario arrastra la barra
      const curTime = audioEl.currentTime;
      const dur = getDuration();
      if (scrubber) {
        scrubber.value = curTime;
        updateTrackFill(curTime, dur);
      }
      updateTimeLabel(curTime);
    });

    audioEl.addEventListener('ended', () => {
      if (playIcon) playIcon.textContent = '▶';
      if (scrubber) {
        scrubber.value = 0;
        updateTrackFill(0, getDuration());
      }
      updateTimeLabel(0);
    });

    // Control del scrubber con arrastre fluido y salto inmediato
    if (scrubber) {
      // 1. Arrastre activo ('input')
      scrubber.addEventListener('input', (e) => {
        isSeeking = true;
        const targetVal = parseFloat(e.target.value) || 0;
        updateTimeLabel(targetVal);
        updateTrackFill(targetVal, getDuration());
      });

      // 2. Soltar o hacer clic ('change')
      const commitSeek = (e) => {
        const targetVal = parseFloat(e.target.value) || 0;
        try {
          audioEl.currentTime = targetVal;
        } catch (err) {
          console.warn('Seek error:', err);
        }
        isSeeking = false;
        updateTimeLabel(targetVal);
        updateTrackFill(targetVal, getDuration());
      };

      scrubber.addEventListener('change', commitSeek);
    }

    // Controles de velocidad
    const speedBtns = document.querySelectorAll('.btn-speed-pill[data-speed]');
    speedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const speed = parseFloat(btn.getAttribute('data-speed')) || 1;
        audioEl.playbackRate = speed;
        speedBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
      });
    });

    // Detener audio al cerrar el modal
    const closeBtns = [
      document.getElementById('modal-close-btn'),
      document.getElementById('modal-btn-close'),
      document.getElementById('app-modal')
    ];
    closeBtns.forEach(el => {
      if (el) {
        el.addEventListener('click', (e) => {
          if (el.id === 'app-modal' && e.target !== el) return;
          if (audioEl) audioEl.pause();
        });
      }
    });
  }
}

