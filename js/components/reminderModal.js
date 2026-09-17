/**
 * Componente Modal de Recordatorios y Agendamiento
 * Territorio TdeA - Ciencias Básicas y Áreas Comunes
 */

import { modal } from './modal.js';
import { getGoogleCalendarUrl, getWhatsAppShareUrl } from '../services/calendarService.js';

export class ReminderModal {
  /**
   * Abre el modal para agendar una asesoría
   * @param {Object} advisory Objeto de asesoría de MOCK_ADVISORIES
   */
  open(advisory) {
    if (!advisory) return;

    const gcalUrl = getGoogleCalendarUrl(advisory);
    const waUrl = getWhatsAppShareUrl(advisory);

    const bodyHtml = `
      <div class="reminder-modal-content">
        <!-- Ficha de la Asesoría -->
        <div class="reminder-advisory-summary">
          <div class="reminder-badge-row">
            <span class="badge badge-institutional">${advisory.area || 'Ciencias Básicas'}</span>
            <span class="badge" style="background: rgba(12, 101, 51, 0.12); color: var(--tdea-green-primary); font-weight: 700;">
              Modalidad Virtual
            </span>
          </div>

          <h4 class="reminder-advisory-name">Asesoría de ${advisory.area || 'Ciencias Básicas'}</h4>

          <div class="reminder-advisory-meta">
            <div class="reminder-meta-item">
              <span class="meta-icon" aria-hidden="true">📅</span>
              <span class="meta-text"><strong>Día:</strong> ${advisory.days || 'Por programar'}</span>
            </div>
            <div class="reminder-meta-item">
              <span class="meta-icon" aria-hidden="true">⏰</span>
              <span class="meta-text"><strong>Horario:</strong> ${advisory.time || 'Consultar'}</span>
            </div>
            <div class="reminder-meta-item">
              <span class="meta-icon" aria-hidden="true">👨‍🏫</span>
              <span class="meta-text"><strong>Docente:</strong> ${advisory.advisor || 'Docente asignado'}</span>
            </div>
          </div>
        </div>

        <!-- Aviso Oficial del Correo Estudiantil -->
        <div class="reminder-student-email-notice" role="note">
          <div class="notice-icon" aria-hidden="true">💡</div>
          <div class="notice-body">
            <strong>Recuerda:</strong> Para ingresar a la sala en Microsoft Teams debes iniciar sesión con tu cuenta de correo institucional de estudiante que finaliza en <code>@correo.tdea.edu.co</code>.
          </div>
        </div>

        <div class="reminder-options-heading">
          Elige dónde deseas guardar o enviar tu recordatorio:
        </div>

        <!-- Opciones de Agendamiento -->
        <div class="reminder-options-grid">
          
          <!-- Opción 1: Google Calendar -->
          <a 
            href="${gcalUrl}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="reminder-action-card reminder-card-gcal"
            id="btn-gcal-reminder"
          >
            <div class="reminder-card-icon-wrapper gcal-icon-bg">
              <span>📅</span>
            </div>
            <div class="reminder-card-content">
              <span class="reminder-card-title">Añadir a Google Calendar</span>
              <span class="reminder-card-desc">Crea el evento con fecha, horario y enlace de Teams listo para guardar.</span>
            </div>
            <div class="reminder-card-arrow" aria-hidden="true">↗</div>
          </a>

          <!-- Opción 2: WhatsApp -->
          <a 
            href="${waUrl}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="reminder-action-card reminder-card-whatsapp"
            id="btn-whatsapp-reminder"
          >
            <div class="reminder-card-icon-wrapper wa-icon-bg">
              <span>💬</span>
            </div>
            <div class="reminder-card-content">
              <span class="reminder-card-title">Enviar a mi WhatsApp</span>
              <span class="reminder-card-desc">Abre WhatsApp con el mensaje y el enlace listos para tu chat personal o grupo.</span>
            </div>
            <div class="reminder-card-arrow" aria-hidden="true">↗</div>
          </a>

        </div>

        <!-- Enlace Directo a Teams como alternativa rápida -->
        <div class="reminder-teams-footer-box">
          <span style="font-size: 0.8rem; color: var(--color-text-secondary);">¿Prefieres entrar directamente a la sesión ahora?</span>
          <a 
            href="${advisory.link}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="reminder-teams-direct-link"
          >
            🚀 Ingresar a la sala Teams
          </a>
        </div>
      </div>
    `;

    modal.open({
      title: '🔔 Recordatorio / Agendar Asesoría',
      bodyHtml
    });
  }
}

export const reminderModal = new ReminderModal();
