/**
 * Servicio de Accesibilidad Web TdeA (Singleton)
 * Asistente Virtual Territorio TdeA
 * 
 * Gestiona y persiste las preferencias de accesibilidad del estudiante:
 * - Escala de tamaño de texto (1 a 5)
 * - Widget Grande
 * - Subrayar Enlaces
 * - Espaciado de Texto
 * - Cursor Grande
 * - Altura de Línea
 * - Alinear Texto
 */

const STORAGE_KEY = 'tdea_accessibility_settings_v1';

export class AccessibilityService {
  constructor() {
    this.defaults = {
      textSize: 1, // Niveles del 1 al 5
      widgetLarge: false,
      underlineLinks: false,
      textSpacing: false,
      largeCursor: false,
      lineHeight: false,
      alignText: false
    };

    this.settings = { ...this.defaults };
    this.listeners = [];
  }

  /**
   * Inicializa el servicio cargando las preferencias guardadas
   */
  init() {
    this.loadSettings();
    this.applySettings();
  }

  /**
   * Carga la configuración desde localStorage
   */
  loadSettings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.settings = { ...this.defaults, ...parsed };
      }
    } catch (e) {
      console.warn('Error al cargar preferencias de accesibilidad:', e);
      this.settings = { ...this.defaults };
    }
  }

  /**
   * Guarda la configuración actual en localStorage
   */
  saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Error al guardar preferencias de accesibilidad:', e);
    }
  }

  /**
   * Aplica las clases CSS globales al elemento <html> según el estado activo
   */
  applySettings() {
    const root = document.documentElement;

    // 1. Escala de tamaño de texto
    for (let i = 1; i <= 5; i++) {
      root.classList.remove(`access-text-size-${i}`);
    }
    root.classList.add(`access-text-size-${this.settings.textSize}`);

    // 2. Widget Grande
    const widgetWindow = document.getElementById('tdea-accessibility-window');
    if (widgetWindow) {
      widgetWindow.classList.toggle('access-widget-large', !!this.settings.widgetLarge);
    }

    // 3. Subrayar Enlaces
    root.classList.toggle('access-underline-links', !!this.settings.underlineLinks);

    // 4. Espaciado de Texto
    root.classList.toggle('access-text-spacing', !!this.settings.textSpacing);

    // 5. Cursor Grande
    root.classList.toggle('access-large-cursor', !!this.settings.largeCursor);

    // 6. Altura de Línea
    root.classList.toggle('access-line-height', !!this.settings.lineHeight);

    // 7. Alinear Texto (modos: 'justify', 'center', 'left' o false)
    root.classList.remove('access-align-justify', 'access-align-center', 'access-align-left');
    if (this.settings.alignText) {
      root.classList.add(`access-align-${this.settings.alignText}`);
    }

    // Notificar a los observadores (UI)
    this.notifyListeners();
  }

  /**
   * Alterna un valor booleano o cicla alineación de texto
   * @param {string} optionName Nombre de la propiedad
   */
  toggleOption(optionName) {
    if (optionName === 'alignText') {
      const modes = [false, 'justify', 'center', 'left'];
      const currentIndex = modes.indexOf(this.settings.alignText);
      const nextIndex = (currentIndex + 1) % modes.length;
      this.settings.alignText = modes[nextIndex];
      this.saveSettings();
      this.applySettings();
      return;
    }

    if (typeof this.settings[optionName] === 'boolean') {
      this.settings[optionName] = !this.settings[optionName];
      this.saveSettings();
      this.applySettings();
    }
  }

  /**
   * Aumenta el tamaño de texto (máximo 5)
   */
  increaseTextSize() {
    if (this.settings.textSize < 5) {
      this.settings.textSize++;
      this.saveSettings();
      this.applySettings();
    }
  }

  /**
   * Disminuye el tamaño de texto (mínimo 1)
   */
  decreaseTextSize() {
    if (this.settings.textSize > 1) {
      this.settings.textSize--;
      this.saveSettings();
      this.applySettings();
    }
  }

  /**
   * Restablece todas las opciones de accesibilidad a los valores por defecto
   */
  resetAll() {
    this.settings = { ...this.defaults };
    this.saveSettings();
    this.applySettings();
  }

  /**
   * Retorna una copia de las configuraciones actuales
   */
  getSettings() {
    return { ...this.settings };
  }

  /**
   * Suscribe un callback para recibir cambios de configuración
   */
  subscribe(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
    }
  }

  notifyListeners() {
    this.listeners.forEach(cb => {
      try {
        cb(this.getSettings());
      } catch (e) {
        console.error('Error en listener de accesibilidad:', e);
      }
    });
  }
}

export const accessibilityService = new AccessibilityService();
