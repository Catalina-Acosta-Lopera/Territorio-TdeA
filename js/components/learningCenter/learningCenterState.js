/**
 * Gestor de Estado y Persistencia Local para el Centro de Aprendizaje
 * Campus Vital - Territorio TdeA (Ciencias Básicas)
 *
 * Mantiene la persistencia de las actividades durante la sesión del navegador
 * y en almacenamiento local (sessionStorage + localStorage como respaldo).
 * No simula envíos a servidores externos si no existe un endpoint institucional real.
 */

const STORAGE_KEY = 'campus_vital_learning_center_state_v3';
const PROFILES_STORAGE_KEY = 'campus_vital_student_profiles_v3';
const ACTIVE_PROFILE_KEY = 'campus_vital_active_student_profile_id_v3';

export const INSTITUTIONAL_CONFIG = {
  // URL para posterior integración institucional (dejar en null si no hay backend activo)
  audioUploadEndpoint: null,
  textUploadEndpoint: null,
  enabled: false,
  institutionName: 'Tecnológico de Antioquia - Institución Universitaria'
};

class LearningCenterState {
  constructor() {
    this.listeners = [];
    this.profiles = this.loadProfilesFromStorage();
    this.activeProfileId = this.loadActiveProfileId();

    if (!this.profiles || this.profiles.length === 0) {
      const legacyState = this.readLegacyState();
      const firstProfile = {
        id: 'estudiante_' + Date.now(),
        name: 'Estudiante 1 (Principal)',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        state: legacyState ? this.normalizeState(legacyState) : this.getDefaultState()
      };
      this.profiles = [firstProfile];
      this.activeProfileId = firstProfile.id;
      this.saveProfilesToStorage();
    }

    if (!this.activeProfileId || !this.profiles.some(p => p.id === this.activeProfileId)) {
      this.activeProfileId = this.profiles[0].id;
      this.saveProfilesToStorage();
    }

    const active = this.profiles.find(p => p.id === this.activeProfileId);
    this.state = this.normalizeState(active ? active.state : this.getDefaultState());

    if (typeof window !== 'undefined' && (window.location.search.includes('reset') || window.location.hash.includes('reset'))) {
      this.resetActiveProfile();
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
      },

      // MÓDULO 3: Gestionando mis emociones ("Aprender a navegar los cambios")
      module3: {
        completed: false,
        currentPausa: 'intro', // 'intro' | 'pausa1' | 'pausa2' | 'pausa3' | 'pausa4' | 'cierre'
        pausa1: {
          completed: false,
          selectedRegions: [], // ['cabeza', 'cuello', 'pecho', 'estomago', 'manos', 'piernas']
          bodyNotes: '',
          confirmed: false
        },
        pausa2: {
          completed: false,
          breathingRounds: 0,
          audioDownloaded: false
        },
        pausa3: {
          completed: false,
          trafficLight: {
            redText: '',
            yellowText: '',
            greenText: ''
          },
          caseValentina: {
            redOption: null,
            yellowOptions: [],
            greenOptions: [],
            feedbackSeen: false,
            completed: false
          }
        },
        pausa4: {
          completed: false,
          sensoryAnswers: {
            senses5: '', // 5 cosas que veo
            senses4: '', // 4 cosas que toco
            senses3: '', // 3 sonidos que escucho
            senses2: '', // 2 aromas que percibo
            senses1: ''  // 1 sensación o sabor agradable
          },
          postExerciseReflection: '', // ¿Cómo te sientes después del ejercicio?
          selectedTools: [], // ['escaner', 'respiracion', 'semaforo', 'anclaje_54321', 'reencuadre', 'red_apoyo']
          customToolNote: '', // Compromiso personal o frase ancla
          toolsCardDownloaded: false
        },
        cierre: {
          completed: false,
          recognitionDownloaded: false
        }
      }
    };
  }

  /**
   * Carga los perfiles guardados en localStorage
   */
  loadProfilesFromStorage() {
    try {
      const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error leyendo perfiles:', e);
    }
    return [];
  }

  loadActiveProfileId() {
    try {
      return localStorage.getItem(ACTIVE_PROFILE_KEY) || null;
    } catch (e) {
      return null;
    }
  }

  saveProfilesToStorage() {
    try {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(this.profiles));
      if (this.activeProfileId) {
        localStorage.setItem(ACTIVE_PROFILE_KEY, this.activeProfileId);
      }
    } catch (e) {
      console.warn('Error guardando perfiles en localStorage:', e);
    }
  }

  readLegacyState() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
      const v1 = sessionStorage.getItem('campus_vital_learning_center_state_v1') || localStorage.getItem('campus_vital_learning_center_state_v1');
      if (v1) return JSON.parse(v1);
    } catch (e) {}
    return null;
  }

  /**
   * Normaliza cualquier estado guardado asegurando que todas las propiedades
   * y claves de actividades estén presentes y sean seguras.
   */
  normalizeState(raw) {
    const defaults = this.getDefaultState();
    if (!raw) return defaults;

    try {
      // 1. MÓDULO 1
      if (raw.module1?.equipaje) {
        const rawS1 = raw.module1.equipaje.station1 || {};
        const hasRealS1Data = Boolean(
          rawS1.selectedWeather || 
          (Array.isArray(rawS1.selectedAreas) && rawS1.selectedAreas.length > 0) || 
          (rawS1.compass?.feeling && String(rawS1.compass.feeling).trim().length > 0)
        );
        defaults.module1.equipaje = {
          ...defaults.module1.equipaje,
          ...raw.module1.equipaje,
          station1: {
            ...defaults.module1.equipaje.station1,
            ...rawS1,
            completed: Boolean(rawS1.completed && hasRealS1Data),
            weatherNotes: {
              ...defaults.module1.equipaje.station1.weatherNotes,
              ...(rawS1.weatherNotes || {})
            },
            compass: {
              ...defaults.module1.equipaje.station1.compass,
              ...(rawS1.compass || {})
            }
          },
          station2: {
            ...defaults.module1.equipaje.station2,
            ...(raw.module1.equipaje.station2 || {})
          },
          station3: {
            ...defaults.module1.equipaje.station3,
            ...(raw.module1.equipaje.station3 || {})
          },
          closing: {
            ...defaults.module1.equipaje.closing,
            ...(raw.module1.equipaje.closing || {})
          }
        };
      }
      defaults.module1.completed = Boolean(raw.module1?.completed);
      defaults.module1.caseDaniel = {
        ...defaults.module1.caseDaniel,
        ...(raw.module1?.caseDaniel || {})
      };
      if (raw.module1?.audio) {
        defaults.module1.audio = {
          ...defaults.module1.audio,
          hasAudio: Boolean(raw.module1.audio.hasAudio),
          durationSeconds: raw.module1.audio.durationSeconds || 0,
          recordedAt: raw.module1.audio.recordedAt || null,
          filename: raw.module1.audio.filename || null,
          isDownloaded: Boolean(raw.module1.audio.isDownloaded)
        };
      }

      // 2. MÓDULO 2
      if (raw.module2) {
        const r1Done = Boolean(raw.module2.ruta1?.completed);
        const r2Done = Boolean(raw.module2.ruta2?.completed);
        defaults.module2.completed = Boolean(raw.module2.completed || (r1Done && r2Done));
        defaults.module2.currentRoute = raw.module2.currentRoute || 'intro';

        if (raw.module2.ruta1) {
          defaults.module2.ruta1 = {
            ...defaults.module2.ruta1,
            ...raw.module2.ruta1,
            completed: r1Done,
            startPoint: {
              ...defaults.module2.ruta1.startPoint,
              ...(raw.module2.ruta1.startPoint || {})
            },
            tree: {
              ...defaults.module2.ruta1.tree,
              ...(raw.module2.ruta1.tree || {})
            }
          };
        }

        if (raw.module2.ruta2) {
          defaults.module2.ruta2 = {
            ...defaults.module2.ruta2,
            ...raw.module2.ruta2,
            completed: r2Done,
            thermometer: {
              ...defaults.module2.ruta2.thermometer,
              ...(raw.module2.ruta2.thermometer || {}),
              textAnswers: {
                ...defaults.module2.ruta2.thermometer.textAnswers,
                ...(raw.module2.ruta2.thermometer?.textAnswers || {})
              }
            },
            danielCase: {
              ...defaults.module2.ruta2.danielCase,
              ...(raw.module2.ruta2.danielCase || {})
            },
            adaptationPlan: {
              ...defaults.module2.ruta2.adaptationPlan,
              ...(raw.module2.ruta2.adaptationPlan || {})
            }
          };
        }

        if (raw.module2.bodyScanner) {
          defaults.module2.bodyScanner = {
            selectedRegions: Array.isArray(raw.module2.bodyScanner.selectedRegions) ? raw.module2.bodyScanner.selectedRegions : [],
            confirmed: Boolean(raw.module2.bodyScanner.confirmed),
            confirmedAt: raw.module2.bodyScanner.confirmedAt || null
          };
        }
      }

      // 3. MÓDULO 3
      if (raw.module3) {
        defaults.module3 = {
          ...defaults.module3,
          ...raw.module3,
          pausa1: {
            ...defaults.module3.pausa1,
            ...(raw.module3.pausa1 || {}),
            selectedRegions: Array.isArray(raw.module3.pausa1?.selectedRegions) ? raw.module3.pausa1.selectedRegions : []
          },
          pausa2: {
            ...defaults.module3.pausa2,
            ...(raw.module3.pausa2 || {})
          },
          pausa3: {
            ...defaults.module3.pausa3,
            ...(raw.module3.pausa3 || {}),
            trafficLight: {
              ...defaults.module3.pausa3.trafficLight,
              ...(raw.module3.pausa3?.trafficLight || {})
            },
            caseValentina: {
              ...defaults.module3.pausa3.caseValentina,
              ...(raw.module3.pausa3?.caseValentina || {}),
              yellowOptions: Array.isArray(raw.module3.pausa3?.caseValentina?.yellowOptions) ? raw.module3.pausa3.caseValentina.yellowOptions : [],
              greenOptions: Array.isArray(raw.module3.pausa3?.caseValentina?.greenOptions) ? raw.module3.pausa3.caseValentina.greenOptions : []
            }
          },
          pausa4: {
            ...defaults.module3.pausa4,
            ...(raw.module3.pausa4 || {}),
            sensoryAnswers: {
              ...defaults.module3.pausa4.sensoryAnswers,
              ...(raw.module3.pausa4?.sensoryAnswers || {})
            },
            selectedTools: Array.isArray(raw.module3.pausa4?.selectedTools) ? raw.module3.pausa4.selectedTools : []
          },
          cierre: {
            ...defaults.module3.cierre,
            ...(raw.module3.cierre || {})
          }
        };
      }

      return defaults;
    } catch (e) {
      console.warn('Error normalizando estado:', e);
      return defaults;
    }
  }

  loadFromStorage() {
    const active = this.profiles.find(p => p.id === this.activeProfileId);
    this.state = this.normalizeState(active ? active.state : this.getDefaultState());
  }

  getSerializableState() {
    return {
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
      },
      module3: {
        completed: this.state.module3.completed,
        currentPausa: this.state.module3.currentPausa,
        pausa1: this.state.module3.pausa1,
        pausa2: this.state.module3.pausa2,
        pausa3: this.state.module3.pausa3,
        pausa4: this.state.module3.pausa4,
        cierre: this.state.module3.cierre
      }
    };
  }

  saveState() {
    this.saveToStorage();
  }

  saveToStorage() {
    try {
      const serializable = this.getSerializableState();
      const payload = JSON.stringify(serializable);
      sessionStorage.setItem(STORAGE_KEY, payload);
      localStorage.setItem(STORAGE_KEY, payload);

      const activeIdx = this.profiles.findIndex(p => p.id === this.activeProfileId);
      if (activeIdx !== -1) {
        this.profiles[activeIdx].state = serializable;
        this.profiles[activeIdx].updatedAt = new Date().toISOString();
        this.saveProfilesToStorage();
      }
    } catch (err) {
      console.warn('Error guardando en almacenamiento local:', err);
    }
  }

  // --- MÉTODOS DE GESTIÓN DE PERFILES DE ESTUDIANTE ---

  getProfiles() {
    return this.profiles.map(p => ({
      id: p.id,
      name: p.name,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      m1Completed: Boolean(p.state?.module1?.completed || p.state?.module1?.equipaje?.closing?.completed),
      m2Completed: Boolean(p.state?.module2?.completed || (p.state?.module2?.ruta1?.completed && p.state?.module2?.ruta2?.completed)),
      m3Completed: Boolean(p.state?.module3?.completed || p.state?.module3?.cierre?.completed),
      answersCount: this.countStateAnswers(p.state)
    }));
  }

  getActiveProfile() {
    const active = this.profiles.find(p => p.id === this.activeProfileId);
    return active || this.profiles[0];
  }

  setActiveProfileName(name) {
    if (!name || !name.trim()) return;
    const active = this.profiles.find(p => p.id === this.activeProfileId);
    if (active) {
      active.name = name.trim();
      active.updatedAt = new Date().toISOString();
      this.saveProfilesToStorage();
      this.notify();
    }
  }

  switchProfile(profileId) {
    const target = this.profiles.find(p => p.id === profileId);
    if (!target) return false;
    this.activeProfileId = profileId;
    this.state = this.normalizeState(target.state);
    this.saveToStorage();
    this.notify();
    return true;
  }

  createProfile(name) {
    const count = this.profiles.length + 1;
    const newProfile = {
      id: 'estudiante_' + Date.now(),
      name: name && name.trim() ? name.trim() : `Estudiante ${count}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      state: this.getDefaultState()
    };
    this.profiles.push(newProfile);
    this.activeProfileId = newProfile.id;
    this.state = this.normalizeState(newProfile.state);
    this.saveToStorage();
    this.notify();
    return newProfile;
  }

  deleteProfile(profileId) {
    if (this.profiles.length <= 1) return false;
    this.profiles = this.profiles.filter(p => p.id !== profileId);
    if (this.activeProfileId === profileId) {
      this.activeProfileId = this.profiles[0].id;
      this.state = this.normalizeState(this.profiles[0].state);
      this.saveToStorage();
    } else {
      this.saveProfilesToStorage();
    }
    this.notify();
    return true;
  }

  resetActiveProfile() {
    this.clearModule1Audio();
    this.state = this.getDefaultState();
    this.saveToStorage();
    this.notify();
  }

  countStateAnswers(state) {
    if (!state) return 0;
    let count = 0;
    const m1 = state.module1?.equipaje;
    if (m1?.station1?.selectedWeather) count++;
    if (m1?.station1?.weatherNotes?.soleado?.trim()) count++;
    if (m1?.station1?.weatherNotes?.nublado?.trim()) count++;
    if (m1?.station1?.weatherNotes?.lluvioso?.trim()) count++;
    if (m1?.station1?.weatherNotes?.tormenta?.trim()) count++;
    if (m1?.station1?.selectedAreas?.length) count++;
    if (m1?.station1?.areasReflection?.trim()) count++;
    if (m1?.station1?.compass?.feeling?.trim()) count++;
    if (m1?.station1?.compass?.need?.trim()) count++;
    if (m1?.station1?.compass?.strengths?.trim()) count++;
    if (m1?.station2?.selectedJuanTools?.length) count++;
    if (m1?.station2?.podcastReflection?.trim()) count++;
    if (m1?.station3?.supportNodes?.length) count++;
    if (m1?.station3?.talkCandidate?.trim()) count++;
    if (m1?.closing?.firstToolText?.trim()) count++;

    const m2 = state.module2;
    if (m2?.ruta1?.startPoint?.question1?.trim()) count++;
    if (m2?.ruta1?.startPoint?.question2?.trim()) count++;
    if (m2?.ruta1?.startPoint?.question3?.trim()) count++;
    if (m2?.ruta1?.tree?.roots?.trim()) count++;
    if (m2?.ruta1?.tree?.trunk?.trim()) count++;
    if (m2?.ruta1?.tree?.branches?.trim()) count++;
    if (m2?.ruta1?.tree?.fruits?.trim()) count++;
    if (m2?.ruta1?.tree?.reflection?.trim()) count++;
    if (m2?.ruta2?.thermometer?.textAnswers?.easy?.trim()) count++;
    if (m2?.ruta2?.thermometer?.textAnswers?.challenge?.trim()) count++;
    if (m2?.ruta2?.thermometer?.textAnswers?.resources?.trim()) count++;
    if (m2?.ruta2?.thermometer?.textAnswers?.strengthen?.trim()) count++;
    if (m2?.ruta2?.danielCase?.actionSuggestions?.trim()) count++;
    if (m2?.ruta2?.adaptationPlan?.mainStrength?.trim()) count++;
    if (m2?.ruta2?.adaptationPlan?.mainChallenge?.trim()) count++;
    if (m2?.ruta2?.adaptationPlan?.action1?.trim()) count++;
    if (m2?.ruta2?.adaptationPlan?.action2?.trim()) count++;
    if (m2?.ruta2?.adaptationPlan?.action3?.trim()) count++;

    const m3 = state.module3;
    if (m3?.pausa1?.selectedRegions?.length) count++;
    if (m3?.pausa1?.bodyNotes?.trim()) count++;
    if (m3?.pausa2?.breathingRounds > 0) count++;
    if (m3?.pausa3?.trafficLight?.redText?.trim()) count++;
    if (m3?.pausa3?.trafficLight?.yellowText?.trim()) count++;
    if (m3?.pausa3?.trafficLight?.greenText?.trim()) count++;
    if (m3?.pausa3?.caseValentina?.redOption) count++;
    if (m3?.pausa3?.caseValentina?.yellowOptions?.length) count++;
    if (m3?.pausa3?.caseValentina?.greenOptions?.length) count++;
    if (m3?.pausa4?.postExerciseReflection?.trim()) count++;
    if (m3?.pausa4?.selectedTools?.length) count++;
    if (m3?.pausa4?.customToolNote?.trim()) count++;

    return count;
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

  setActiveModule(mod) {
    this.state.activeModule = mod;
    this.saveToStorage();
    this.notify();
  }

  // --- MÓDULO 3 ("GESTIONANDO MIS EMOCIONES"): MUTACIONES ---

  setModule3CurrentPausa(pausaKey) {
    if (this.state.module3) {
      this.state.module3.currentPausa = pausaKey;
      this.saveToStorage();
      this.notify();
    }
  }

  setModule3Pausa1BodyRegions(regions) {
    if (!this.state.module3.pausa1) this.state.module3.pausa1 = {};
    this.state.module3.pausa1.selectedRegions = Array.isArray(regions) ? regions : [];
    this.saveToStorage();
    this.notify();
  }

  setModule3Pausa1BodyNotes(notes) {
    if (!this.state.module3.pausa1) this.state.module3.pausa1 = {};
    this.state.module3.pausa1.bodyNotes = notes;
    this.saveToStorage();
    this.notify();
  }

  completeModule3Pausa1() {
    if (!this.state.module3.pausa1) this.state.module3.pausa1 = {};
    this.state.module3.pausa1.completed = true;
    this.state.module3.pausa1.confirmed = true;
    this.saveToStorage();
    this.notify();
  }

  addModule3BreathingRound() {
    if (!this.state.module3.pausa2) this.state.module3.pausa2 = {};
    this.state.module3.pausa2.breathingRounds = (this.state.module3.pausa2.breathingRounds || 0) + 1;
    this.saveToStorage();
    this.notify();
  }

  completeModule3Pausa2() {
    if (!this.state.module3.pausa2) this.state.module3.pausa2 = {};
    this.state.module3.pausa2.completed = true;
    this.saveToStorage();
    this.notify();
  }

  setModule3TrafficLightAnswer(field, value) {
    if (!this.state.module3.pausa3) this.state.module3.pausa3 = {};
    if (!this.state.module3.pausa3.trafficLight) this.state.module3.pausa3.trafficLight = {};
    this.state.module3.pausa3.trafficLight[field] = value;
    this.saveToStorage();
    this.notify();
  }

  setModule3CaseValentina(key, value) {
    if (!this.state.module3.pausa3) this.state.module3.pausa3 = {};
    if (!this.state.module3.pausa3.caseValentina) this.state.module3.pausa3.caseValentina = {};
    this.state.module3.pausa3.caseValentina[key] = value;
    this.saveToStorage();
    this.notify();
  }

  completeModule3Pausa3() {
    if (!this.state.module3.pausa3) this.state.module3.pausa3 = {};
    this.state.module3.pausa3.completed = true;
    if (this.state.module3.caseValentina) {
      this.state.module3.caseValentina.completed = true;
    }
    this.saveToStorage();
    this.notify();
  }

  setModule3SensoryAnswer(field, value) {
    if (!this.state.module3.pausa4) this.state.module3.pausa4 = {};
    if (!this.state.module3.pausa4.sensoryAnswers) this.state.module3.pausa4.sensoryAnswers = {};
    this.state.module3.pausa4.sensoryAnswers[field] = value;
    this.saveToStorage();
    this.notify();
  }

  setModule3PostReflection(value) {
    if (!this.state.module3.pausa4) this.state.module3.pausa4 = {};
    this.state.module3.pausa4.postExerciseReflection = value;
    this.saveToStorage();
    this.notify();
  }

  setModule3SelectedTools(tools) {
    if (!this.state.module3.pausa4) this.state.module3.pausa4 = {};
    this.state.module3.pausa4.selectedTools = Array.isArray(tools) ? tools : [];
    this.saveToStorage();
    this.notify();
  }

  setModule3CustomToolNote(note) {
    if (!this.state.module3.pausa4) this.state.module3.pausa4 = {};
    this.state.module3.pausa4.customToolNote = note;
    this.saveToStorage();
    this.notify();
  }

  completeModule3Pausa4() {
    if (!this.state.module3.pausa4) this.state.module3.pausa4 = {};
    this.state.module3.pausa4.completed = true;
    this.saveToStorage();
    this.notify();
  }

  completeModule3() {
    if (!this.state.module3) this.state.module3 = {};
    this.state.module3.completed = true;
    if (this.state.module3.cierre) this.state.module3.cierre.completed = true;
    this.saveToStorage();
    this.notify();
  }

  resetModule3() {
    const defaults = this.getDefaultState();
    this.state.module3 = defaults.module3;
    try {
      this.saveToStorage();
    } catch (e) {}
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
