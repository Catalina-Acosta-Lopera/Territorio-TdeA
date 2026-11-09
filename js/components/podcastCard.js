/**
 * Componente Reutilizable PodcastCard y Reproductor Modal
 * Serie de Podcasts Oficiales Campus Vital - Tecnológico de Antioquia
 * 
 * Presenta las tarjetas de podcast grandes con portada temática de la mascota en diferentes poses,
 * diseño idéntico al catálogo de Guías y Talleres Prácticos (Imagen 2), y reproductor accesible integrado.
 */

import { modal } from './modal.js';
import { getPodcastById } from '../data/podcastsData.js';

export class PodcastCard {
  /**
   * Genera el HTML de una tarjeta de podcast grande con portada del robot en diferentes poses
   * @param {Object} podcast Datos del podcast
   * @returns {string} Código HTML
   */
  static render(podcast) {
    return `
      <article class="resource-card podcast-card has-academic-content animate-fade-in" data-podcast-id="${podcast.id}">
        
        <!-- 1. Encabezado con Insignias Institucionales (Estilo Idéntico a Guías y Talleres) -->
        <div class="resource-card-header">
          <div class="resource-card-badges">
            <span class="badge badge-resource-type">🎙️ Podcast</span>
            <span class="badge badge-status-available">${podcast.statusText || 'Disponible'}</span>
            <span class="badge badge-pedagogical">✔ Con Audio Oficial</span>
          </div>
          <span class="resource-category-tag">${podcast.tagCategory}</span>
        </div>

        <!-- 2. Portada Destacada con la Mascota en Diferentes Poses y Aura Temática -->
        <div class="podcast-cover-banner" style="background: ${podcast.coverGradient};" role="img" aria-label="Portada de ${podcast.title}">
          <div class="podcast-cover-ambient-glow" style="background: radial-gradient(circle, ${podcast.haloColor} 0%, transparent 70%);"></div>
          
          <!-- Elementos gráficos de ondas sonoras -->
          <div class="podcast-soundwave-bars" aria-hidden="true">
            <span class="p-bar b1"></span>
            <span class="p-bar b2"></span>
            <span class="p-bar b3"></span>
            <span class="p-bar b4"></span>
            <span class="p-bar b5"></span>
          </div>

          <!-- Imagen del Robot en la Pose Correspondiente -->
          <div class="podcast-robot-wrap">
            <img 
              src="${podcast.robotPoseSrc}" 
              alt="${podcast.robotPoseAlt}" 
              class="podcast-robot-img" 
              loading="lazy"
            />
          </div>

          <!-- Pastilla de Episodio y Duración sobre la Portada -->
          <div class="podcast-cover-badge-row">
            <span class="podcast-pill-tag">
              <span>🎧</span> <strong>${podcast.episodeTag}</strong> · ${podcast.duration}
            </span>
          </div>
        </div>

        <!-- 3. Contenido Textual Institucional -->
        <div class="resource-card-content podcast-content-body">
          <h4 class="resource-card-title podcast-title">
            ${podcast.title}
          </h4>

          <div class="podcast-speaker-line">
            <span class="podcast-speaker-icon" aria-hidden="true">🎙️</span>
            <span class="podcast-speaker-name">${podcast.speaker}</span>
          </div>

          <p class="resource-card-desc podcast-desc">
            ${podcast.description}
          </p>
        </div>

        <!-- 4. Fila de Acciones Duales (Idéntica a Imagen 2) -->
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
        
        <!-- Portada y Cabecera del Reproductor -->
        <div class="podcast-modal-header-hero" style="background: ${podcast.coverGradient};">
          <div class="podcast-modal-hero-left">
            <div class="podcast-modal-robot-frame">
              <img src="${podcast.robotPoseSrc}" alt="${podcast.robotPoseAlt}" class="podcast-modal-robot-img">
            </div>
            <div class="podcast-modal-hero-text">
              <div class="podcast-pill-tag" style="background: rgba(255,255,255,0.22); color: #FFFFFF; display: inline-flex; margin-bottom: 0.4rem;">
                <span>🎙️</span> <strong>${podcast.episodeTag}</strong> · ${podcast.duration}
              </div>
              <h3 class="podcast-modal-title" style="color: #FFFFFF; margin: 0 0 0.35rem 0; font-size: 1.25rem; font-weight: 800; line-height: 1.3;">
                ${podcast.title}
              </h3>
              <div style="font-size: 0.9rem; color: #E2E8F0; font-weight: 600;">
                <span>👤</span> <span>${podcast.speaker}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Reproductor de Audio Accesible DUA -->
        <div class="podcast-modal-player-card">
          <div class="podcast-player-main-controls">
            
            <button type="button" class="podcast-btn-play-large" id="pm-btn-play" aria-label="Reproducir episodio">
              <span id="pm-play-icon" style="font-size: 1.5rem; margin-left: 3px;">▶</span>
            </button>

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
                max="100" 
                value="0" 
                aria-label="Línea de tiempo del podcast"
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

          <audio id="pm-audio-element" src="${podcast.audioUrl}" preload="metadata"></audio>
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
    const scrubber = document.getElementById('pm-scrubber');
    const timeLabel = document.getElementById('pm-time-label');

    if (!audioEl || !playBtn) return;

    const formatSecs = (sec) => {
      if (isNaN(sec) || sec < 0) return '0:00';
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const togglePlay = () => {
      if (audioEl.paused) {
        audioEl.play().catch(() => {});
        if (playIcon) playIcon.textContent = '⏸';
        playBtn.setAttribute('aria-label', 'Pausar episodio');
      } else {
        audioEl.pause();
        if (playIcon) playIcon.textContent = '▶';
        playBtn.setAttribute('aria-label', 'Reproducir episodio');
      }
    };

    playBtn.addEventListener('click', togglePlay);

    audioEl.addEventListener('timeupdate', () => {
      if (!audioEl.duration) return;
      const pct = (audioEl.currentTime / audioEl.duration) * 100;
      if (scrubber) scrubber.value = pct;
      if (timeLabel) {
        timeLabel.textContent = `${formatSecs(audioEl.currentTime)} / ${formatSecs(audioEl.duration)}`;
      }
    });

    audioEl.addEventListener('ended', () => {
      if (playIcon) playIcon.textContent = '▶';
      if (scrubber) scrubber.value = 0;
    });

    if (scrubber) {
      scrubber.addEventListener('input', (e) => {
        if (!audioEl.duration) return;
        const targetSec = (e.target.value / 100) * audioEl.duration;
        audioEl.currentTime = targetSec;
      });
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
