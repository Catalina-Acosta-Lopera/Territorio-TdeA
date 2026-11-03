/**
 * Gestor de Estado y Persistencia Local para el Centro de Aprendizaje
 * Campus Vital - Territorio TdeA (Ciencias Básicas)
 *
 * Mantiene la persistencia de las actividades durante la sesión del navegador
 * y en almacenamiento local (sessionStorage + localStorage como respaldo).
 * No simula envíos a servidores externos si no existe un endpoint institucional real.
 */

const STORAGE_KEY = 'campus_vital_learning_center_state_v2';

export const INSTITUTIONAL_CONFIG = {
  // URL para posterior integración institucional (dejar en null si no hay backend activo)
  audioUploadEndpoint: null,
  textUploadEndpoint: null,
  enabled: false,
  institutionName: 'Tecnológico de Antioquia - Institución Universitaria'
};

class LearningCenterState {
  constructor() {
    this.state = this.getDefaultState();
    this.listeners = [];
    if (typeof window !== 'undefined' && (window.location.search.includes('reset') || window.location.hash.includes('reset'))) {
      this.resetAll();
    } else {
      this.loadFromStorage();
    }
  }

  getDefaultState() {
    return {
      activeModule: null, // 'module1' | 'module2' | null (menú)
      currentStep: 'intro', // 'intro' | 'part_a' | 'part_b' | 'summary' | 'review'

      // MÓDULO 1: Preparar el equipaje (Campus Vital 2026 - Enfoque DUA)
      module1: {
        completed: false,
        equipaje: {
          step: 'module_intro', // 'module_intro' | 'welcome_video' | 'intro_infographic' | 'station_menu' | 'station_1' | 'station_2' | 'station_3' | 'closing'
          station1: {
            selectedWeather: null,
            weatherNotes: {
              soleado: '',
              nublado: '',
              lluvioso: '',
              tormenta: ''
            },
            selectedAreas: [], // ['sueno', 'relaciones', 'tiempo_libre', 'organizacion', 'alimentacion', 'emocional', 'economia', 'actividad_fisica']
            areasReflection: '',
            compass: {
              feeling: '',
              need: '',
              strengths: ''
            },
            completed: false
          },
          station2: {
            selectedJuanTools: [],
            podcastReflection: '',
            routeMapDownloaded: false,
            completed: false
          },
          station3: {
            supportNodes: [],
            supportDrawingDataUrl: null,
            talkCandidate: '',
            supportReadingRead: false,
            completed: false
          },
          closing: {
            firstToolText: '',
            completed: false
          }
        },
        // Compatibilidad con prototipo anterior
        audio: {
          hasAudio: false,
          audioBlob: null,
          audioUrl: null,
          durationSeconds: 0,
          recordedAt: null,
          filename: null,
          isDownloaded: false,
          institutionalDelivered: false
        },
        caseDaniel: {
          answerText: '',
          savedAt: null,
          orientationRead: false
        }
      },

      // MÓDULO 2: Adaptación Universitaria y Proyecto de Vida ("Elegir el rumbo")
      module2: {
        completed: false,
        currentRoute: 'intro', // 'intro' | 'ruta1' | 'ruta2' | 'cierre'
        ruta1: {
          completed: false,
          currentStep: 1,
          startPoint: {
            question1: '', // ¿Qué te motivó a ingresar a la universidad?
            question2: '', // ¿Qué esperas lograr durante esta etapa?
            question3: ''  // ¿Qué fortalezas reconoces en ti?
          },
          tree: {
            roots: '',      // Raíces: Valores
            trunk: '',      // Tronco: Fortalezas
            branches: '',   // Ramas: Metas
            fruits: '',     // Frutos: Sueños
            reflection: ''  // ¿Qué aspecto de tu proyecto de vida quieres fortalecer durante este semestre?
          }
        },
        ruta2: {
          completed: false,
          currentStep: 1,
          podcastListened: false,
          thermometer: {
            audioBlobUrl: null,
            audioDuration: 0,
            textAnswers: {
              easy: '',       // ¿Qué ha sido lo más fácil hasta ahora?
              challenge: '',  // ¿Qué ha representado un mayor reto?
              resources: '',  // ¿Qué recursos me han ayudado?
              strengthen: ''  // ¿Qué necesito fortalecer?
            }
          },
          danielCase: {
            actionSuggestions: '' // ¿Qué acciones podrían ayudar a Daniel a adaptarse mejor a la vida universitaria?
          },
          adaptationPlan: {
            mainStrength: '',  // Mi principal fortaleza
            mainChallenge: '', // Mi principal reto
            action1: '',        // Acción 1
            action2: '',        // Acción 2
            action3: '',        // Acción 3
            downloaded: false
          }
        },
        // Compatibilidad con escáner y semáforo previos
        bodyScanner: {
          selectedRegions: [],
          confirmed: false,
          confirmedAt: null
        },
        trafficLight: {
          red: { selectedOption: null, confirmed: false, confirmedAt: null },
          yellow: { selectedOptions: [], confirmed: false, confirmedAt: null },
          green: { selectedOptions: [], confirmed: false, confirmedAt: null }
        }
      }
    };
  }

  /**
   * Carga el estado guardado desde sessionStorage o localStorage
   */
  loadFromStorage() {
    try {
      // Intentar cargar v2 primero, o migrar desde v1 garantizando inicio limpio para el Módulo 2
      let raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
      let isLegacyV1 = false;
      if (!raw) {
        const v1Raw = sessionStorage.getItem('campus_vital_learning_center_state_v1') || localStorage.getItem('campus_vital_learning_center_state_v1');
        if (v1Raw) {
          raw = v1Raw;
          isLegacyV1 = true;
        }
      }
      if (raw) {
        const parsed = JSON.parse(raw);
        // Merge seguro sin perder defaults
        if (parsed?.module1?.equipaje) {
          this.state.module1.equipaje = {
            ...this.state.module1.equipaje,
            ...parsed.module1.equipaje,
            station1: {
              ...this.state.module1.equipaje.station1,
              ...(parsed.module1.equipaje.station1 || {}),
              weatherNotes: {
                ...this.state.module1.equipaje.station1.weatherNotes,
                ...(parsed.module1.equipaje.station1?.weatherNotes || {})
              },
              compass: {
                ...this.state.module1.equipaje.station1.compass,
                ...(parsed.module1.equipaje.station1?.compass || {})
              }
            },
            station2: {
              ...this.state.module1.equipaje.station2,
              ...(parsed.module1.equipaje.station2 || {})
            },
            station3: {
              ...this.state.module1.equipaje.station3,
              ...(parsed.module1.equipaje.station3 || {})
            },
            closing: {
              ...this.state.module1.equipaje.closing,
              ...(parsed.module1.equipaje.closing || {})
            }
          };
        }
        this.state.module1.completed = Boolean(parsed?.module1?.completed);
        this.state.module1.caseDaniel = {
          ...this.state.module1.caseDaniel,
          ...(parsed?.module1?.caseDaniel || {})
        };
        if (parsed?.module1?.audio) {
          this.state.module1.audio.hasAudio = Boolean(parsed.module1.audio.hasAudio);
          this.state.module1.audio.durationSeconds = parsed.module1.audio.durationSeconds || 0;
          this.state.module1.audio.recordedAt = parsed.module1.audio.recordedAt || null;
          this.state.module1.audio.filename = parsed.module1.audio.filename || null;
          this.state.module1.audio.isDownloaded = Boolean(parsed.module1.audio.isDownloaded);
          this.state.module1.audio.institutionalDelivered = false; // Sin servidor institucional
        }

        if (parsed?.module2 && !isLegacyV1) {
          // Respetar fielmente la culminación de rutas sin condicionar a campos de texto obligatorios
          const r1Done = Boolean(parsed.module2.ruta1?.completed);
          const r2Done = Boolean(parsed.module2.ruta2?.completed);

          this.state.module2.completed = Boolean(parsed.module2.completed || (r1Done && r2Done));
          this.state.module2.currentRoute = (r1Done && r2Done) ? (parsed.module2.currentRoute || 'mountain') : (parsed.module2.currentRoute || 'intro');

          if (parsed.module2.ruta1) {
            this.state.module2.ruta1 = {
              ...this.state.module2.ruta1,
              ...parsed.module2.ruta1,
              completed: r1Done,
              startPoint: {
                ...this.state.module2.ruta1.startPoint,
                ...(parsed.module2.ruta1.startPoint || {})
              },
              tree: {
                ...this.state.module2.ruta1.tree,
                ...(parsed.module2.ruta1.tree || {})
              }
            };
          }
          if (parsed.module2.ruta2) {
            this.state.module2.ruta2 = {
              ...this.state.module2.ruta2,
              ...parsed.module2.ruta2,
              completed: r2Done,
              thermometer: {
                ...this.state.module2.ruta2.thermometer,
                ...(parsed.module2.ruta2.thermometer || {}),
                textAnswers: {
                  ...this.state.module2.ruta2.thermometer.textAnswers,
                  ...(parsed.module2.ruta2.thermometer?.textAnswers || {})
                }
              },
              danielCase: {
                ...this.state.module2.ruta2.danielCase,
                ...(parsed.module2.ruta2.danielCase || {})
              },
              adaptationPlan: {
                ...this.state.module2.ruta2.adaptationPlan,
                ...(parsed.module2.ruta2.adaptationPlan || {})
              }
            };
          }
          if (parsed.module2.bodyScanner) {
            this.state.module2.bodyScanner.selectedRegions = Array.isArray(parsed.module2.bodyScanner.selectedRegions)
              ? parsed.module2.bodyScanner.selectedRegions
              : [];
            this.state.module2.bodyScanner.confirmed = Boolean(parsed.module2.bodyScanner.confirmed);
          }
          if (parsed.module2.trafficLight) {
            this.state.module2.trafficLight.red = {
              ...this.state.module2.trafficLight.red,
              ...(parsed.module2.trafficLight.red || {})
            };
            this.state.module2.trafficLight.yellow = {
              ...this.state.module2.trafficLight.yellow,
              ...(parsed.module2.trafficLight.yellow || {})
            };
            this.state.module2.trafficLight.green = {
              ...this.state.module2.trafficLight.green,
              ...(parsed.module2.trafficLight.green || {})
            };
          }
        }
      }
    } catch (err) {
      console.warn('No se pudo restaurar el estado del Centro de Aprendizaje desde almacenamiento:', err);
    }
  }

  /**
   * Guarda el estado serializable en sessionStorage y localStorage
   */
  saveState() {
    this.saveToStorage();
  }

  saveToStorage() {
    try {
      const serializable = {
        module1: {
          completed: this.state.module1.completed,
          equipaje: this.state.module1.equipaje,
          audio: {
            hasAudio: this.state.module1.audio.hasAudio,
            durationSeconds: this.state.module1.audio.durationSeconds,
            recordedAt: this.state.module1.audio.recordedAt,
            filename: this.state.module1.audio.filename,
            isDownloaded: this.state.module1.audio.isDownloaded
          },
          caseDaniel: this.state.module1.caseDaniel
        },
        module2: {
          completed: this.state.module2.completed,
          currentRoute: this.state.module2.currentRoute,
          ruta1: this.state.module2.ruta1,
          ruta2: this.state.module2.ruta2,
          bodyScanner: {
            selectedRegions: this.state.module2.bodyScanner.selectedRegions,
            confirmed: this.state.module2.bodyScanner.confirmed,
            confirmedAt: this.state.module2.bodyScanner.confirmedAt
          },
          trafficLight: this.state.module2.trafficLight
        }
      };

      const payload = JSON.stringify(serializable);
      sessionStorage.setItem(STORAGE_KEY, payload);
      localStorage.setItem(STORAGE_KEY, payload);
    } catch (err) {
      console.warn('Error guardando en almacenamiento local:', err);
    }
  }

  /**
   * Suscribe un callback a cambios de estado
   */
  subscribe(fn) {
    if (typeof fn === 'function') {
      this.listeners.push(fn);
    }
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  notify() {
    this.saveToStorage();
    this.listeners.forEach(fn => fn(this.state));
  }

  // --- MÓDULO 1: MUTACIONES ---

  setModule1Audio({ blob, url, durationSeconds, filename }) {
    if (this.state.module1.audio.audioUrl && this.state.module1.audio.audioUrl !== url) {
      try {
        URL.revokeObjectURL(this.state.module1.audio.audioUrl);
      } catch (e) {
        // Ignorar
      }
    }
    this.state.module1.audio = {
      hasAudio: true,
      audioBlob: blob,
      audioUrl: url,
      durationSeconds: Math.round(durationSeconds),
      recordedAt: new Date().toISOString(),
      filename: filename || `Modulo1_TermometroAdaptacion_${new Date().toISOString().slice(0, 10)}`,
      isDownloaded: false,
      institutionalDelivered: false
    };
    this.notify();
  }

  markAudioDownloaded() {
    this.state.module1.audio.isDownloaded = true;
    this.notify();
  }

  clearModule1Audio() {
    if (this.state.module1.audio.audioUrl) {
      try {
        URL.revokeObjectURL(this.state.module1.audio.audioUrl);
      } catch (e) {}
    }
    this.state.module1.audio = {
      hasAudio: false,
      audioBlob: null,
      audioUrl: null,
      durationSeconds: 0,
      recordedAt: null,
      filename: null,
      isDownloaded: false,
      institutionalDelivered: false
    };
    this.notify();
  }

  saveDanielResponse(text) {
    this.state.module1.caseDaniel.answerText = text.trim();
    this.state.module1.caseDaniel.savedAt = new Date().toISOString();
    this.notify();
  }

  markDanielOrientationRead() {
    this.state.module1.caseDaniel.orientationRead = true;
    this.notify();
  }

  completeModule1() {
    this.state.module1.completed = true;
    this.notify();
  }

  // --- MÓDULO 1: PREPARAR EL EQUIPAJE (Campus Vital 2026 - DUA) ---

  setEquipajeStep(step) {
    if (this.state.module1.equipaje) {
      this.state.module1.equipaje.step = step;
      this.notify();
    }
  }

  setStation1Weather(weatherKey, note = '') {
    if (this.state.module1.equipaje) {
      this.state.module1.equipaje.station1.selectedWeather = weatherKey;
      if (note) {
        this.state.module1.equipaje.station1.weatherNotes[weatherKey] = note;
      }
      this.notify();
    }
  }

  setStation1WeatherNote(weatherKey, note) {
    if (this.state.module1.equipaje) {
      this.state.module1.equipaje.station1.weatherNotes[weatherKey] = note;
      this.notify();
    }
  }

  toggleStation1Area(areaKey) {
    if (this.state.module1.equipaje) {
      const list = this.state.module1.equipaje.station1.selectedAreas;
      const index = list.indexOf(areaKey);
      if (index === -1) {
        list.push(areaKey);
      } else {
        list.splice(index, 1);
      }
      this.notify();
    }
  }

  setStation1AreasReflection(text) {
    if (this.state.module1.equipaje) {
      this.state.module1.equipaje.station1.areasReflection = text;
      this.notify();
    }
  }

  setStation1Compass(field, value) {
    if (this.state.module1.equipaje) {
      this.state.module1.equipaje.station1.compass[field] = value;
      this.notify();
    }
  }

  completeStation1() {
    if (this.state.module1.equipaje) {
      this.state.module1.equipaje.station1.completed = true;
      this.notify();
    }
  }

  toggleJuanTool(toolKey) {
    if (this.state.module1.equipaje) {
      const list = this.state.module1.equipaje.station2.selectedJuanTools;
      const index = list.indexOf(toolKey);
      if (index === -1) {
        list.push(toolKey);
      } else {
        list.splice(index, 1);
      }
      this.notify();
    }
  }

  setStation2PodcastReflection(text) {
    if (this.state.module1.equipaje) {
      this.state.module1.equipaje.station2.podcastReflection = text;
      this.notify();
    }
  }

  markRouteMapDownloaded() {
    if (this.state.module1.equipaje) {
      this.state.module1.equipaje.station2.routeMapDownloaded = true;
      this.notify();
    }
  }

  completeStation2() {
    if (this.state.module1.equipaje) {
      this.state.module1.equipaje.station2.completed = true;
      this.notify();
    }
  }

  saveSupportDrawing(dataUrl) {
    if (this.state.module1.equipaje) {
      this.state.module1.equipaje.station3.supportDrawingDataUrl = dataUrl;
      this.notify();
    }
  }

  addSupportNode(node) {
    if (this.state.module1.equipaje) {
      this.state.module1.equipaje.station3.supportNodes.push(node);
      this.notify();
    }
  }

  removeSupportNode(index) {
    if (this.state.module1.equipaje) {
      this.state.module1.equipaje.station3.supportNodes.splice(index, 1);
      this.notify();
    }
  }

  setStation3TalkCandidate(text) {
    if (this.state.module1.equipaje) {
      this.state.module1.equipaje.station3.talkCandidate = text;
      this.notify();
    }
  }

  markSupportReadingRead() {
    if (this.state.module1.equipaje) {
      this.state.module1.equipaje.station3.supportReadingRead = true;
      this.notify();
    }
  }

  completeStation3() {
    if (this.state.module1.equipaje) {
      this.state.module1.equipaje.station3.completed = true;
      this.notify();
    }
  }

  setClosingFirstTool(text) {
    if (this.state.module1.equipaje) {
      this.state.module1.equipaje.closing.firstToolText = text;
      this.notify();
    }
  }

  completeEquipajeModule() {
    if (this.state.module1.equipaje) {
      this.state.module1.equipaje.closing.completed = true;
    }
    this.state.module1.completed = true;
    this.notify();
  }

  // --- MÓDULO 2: MUTACIONES ---

  toggleBodyRegion(regionId) {
    const list = this.state.module2.bodyScanner.selectedRegions;
    const index = list.indexOf(regionId);
    if (index === -1) {
      list.push(regionId);
    } else {
      list.splice(index, 1);
    }
    this.notify();
  }

  clearBodyRegions() {
    this.state.module2.bodyScanner.selectedRegions = [];
    this.state.module2.bodyScanner.confirmed = false;
    this.notify();
  }

  confirmBodyScanner() {
    this.state.module2.bodyScanner.confirmed = true;
    this.state.module2.bodyScanner.confirmedAt = new Date().toISOString();
    this.notify();
  }

  setTrafficLightRed(optionId) {
    this.state.module2.trafficLight.red.selectedOption = optionId;
    this.notify();
  }

  confirmTrafficLightRed() {
    this.state.module2.trafficLight.red.confirmed = true;
    this.state.module2.trafficLight.red.confirmedAt = new Date().toISOString();
    this.notify();
  }

  toggleTrafficLightYellow(optionId) {
    const list = this.state.module2.trafficLight.yellow.selectedOptions;
    const index = list.indexOf(optionId);
    if (index === -1) {
      list.push(optionId);
    } else {
      list.splice(index, 1);
    }
    this.notify();
  }

  confirmTrafficLightYellow() {
    this.state.module2.trafficLight.yellow.confirmed = true;
    this.state.module2.trafficLight.yellow.confirmedAt = new Date().toISOString();
    this.notify();
  }

  toggleTrafficLightGreen(optionId) {
    const list = this.state.module2.trafficLight.green.selectedOptions;
    const index = list.indexOf(optionId);
    if (index === -1) {
      list.push(optionId);
    } else {
      list.splice(index, 1);
    }
    this.notify();
  }

  confirmTrafficLightGreen() {
    this.state.module2.trafficLight.green.confirmed = true;
    this.state.module2.trafficLight.green.confirmedAt = new Date().toISOString();
    this.notify();
  }

  completeModule2() {
    this.state.module2.completed = true;
    if (this.state.module2.ruta1) this.state.module2.ruta1.completed = true;
    if (this.state.module2.ruta2) this.state.module2.ruta2.completed = true;
    this.saveToStorage();
    this.notify();
  }

  // --- MÓDULO 2 ("ELEGIR EL RUMBO"): MUTACIONES ---

  setModule2CurrentRoute(route) {
    if (this.state.module2) {
      this.state.module2.currentRoute = route;
      this.notify();
    }
  }

  setModule2StartPoint(qKey, value) {
    if (!this.state.module2.ruta1.startPoint) {
      this.state.module2.ruta1.startPoint = {};
    }
    this.state.module2.ruta1.startPoint[qKey] = value;
    this.notify();
  }

  setModule2TreeField(field, value) {
    if (!this.state.module2.ruta1.tree) {
      this.state.module2.ruta1.tree = {};
    }
    this.state.module2.ruta1.tree[field] = value;
    this.notify();
  }

  completeModule2Ruta1() {
    this.state.module2.ruta1.completed = true;
    this.saveToStorage();
    this.notify();
  }

  setModule2ThermometerText(field, value) {
    if (!this.state.module2.ruta2.thermometer.textAnswers) {
      this.state.module2.ruta2.thermometer.textAnswers = {};
    }
    this.state.module2.ruta2.thermometer.textAnswers[field] = value;
    this.notify();
  }

  setModule2DanielAction(value) {
    if (!this.state.module2.ruta2.danielCase) {
      this.state.module2.ruta2.danielCase = {};
    }
    this.state.module2.ruta2.danielCase.actionSuggestions = value;
    this.notify();
  }

  setModule2AdaptationPlan(field, value) {
    if (!this.state.module2.ruta2.adaptationPlan) {
      this.state.module2.ruta2.adaptationPlan = {};
    }
    this.state.module2.ruta2.adaptationPlan[field] = value;
    this.notify();
  }

  completeModule2Ruta2() {
    this.state.module2.ruta2.completed = true;
    this.state.module2.completed = true;
    this.saveToStorage();
    this.notify();
  }

  // --- REINICIAR ACTIVIDADES ---

  resetModule1() {
    this.clearModule1Audio();
    const defaults = this.getDefaultState();
    this.state.module1 = defaults.module1;
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    this.notify();
  }

  resetEquipajeJourney() {
    const defaults = this.getDefaultState();
    this.state.module1.equipaje = defaults.module1.equipaje;
    this.state.module1.completed = false;
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    this.notify();
  }

  resetModule2() {
    const defaults = this.getDefaultState();
    this.state.module2 = defaults.module2;
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    this.notify();
  }

  resetAll() {
    this.clearModule1Audio();
    this.state = this.getDefaultState();
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    this.notify();
  }
}

export const learningCenterState = new LearningCenterState();
