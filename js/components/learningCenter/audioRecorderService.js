/**
 * Servicio de Grabación de Audio con MediaRecorder y Web Audio API
 * Centro de Aprendizaje - Campus Vital TdeA
 *
 * Provee:
 * 1. Acceso seguro al micrófono del usuario.
 * 2. Temporizador preciso con formato MM:SS.
 * 3. Analizador de frecuencia de audio en tiempo real para visualización gráfica.
 * 4. Controles: Grabar, Pausar, Reanudar, Detener y Descartar.
 * 5. Generación de Blob de audio, URL local y descarga de archivo.
 * 6. Limpieza garantizada de tracks de micrófono y memoria.
 */

export class AudioRecorderService {
  constructor() {
    this.mediaStream = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.audioContext = null;
    this.analyser = null;
    this.sourceNode = null;
    this.animationFrameId = null;

    this.state = 'inactive'; // 'inactive' | 'recording' | 'paused' | 'stopped'
    this.startTime = 0;
    this.elapsedTime = 0;
    this.timerInterval = null;

    // Callbacks
    this.onStateChange = null;
    this.onTimeUpdate = null; // (seconds, formattedString)
    this.onVisualizerData = null; // (Uint8Array frequencyData)
    this.onError = null; // (errorMessage, errorObject)
  }

  /**
   * Verifica compatibilidad del navegador
   */
  static isSupported() {
    return Boolean(
      typeof window !== 'undefined' &&
      navigator?.mediaDevices?.getUserMedia &&
      window.MediaRecorder
    );
  }

  /**
   * Obtiene el mejor MIME type soportado por el navegador
   */
  static getSupportedMimeType() {
    if (typeof MediaRecorder === 'undefined') return '';
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/mp4',
      'audio/aac'
    ];
    for (const t of types) {
      if (MediaRecorder.isTypeSupported(t)) {
        return t;
      }
    }
    return '';
  }

  /**
   * Solicita permisos de micrófono e inicia la grabación
   */
  async start() {
    if (!AudioRecorderService.isSupported()) {
      const err = new Error('Tu navegador no soporta la API de grabación de audio (MediaRecorder).');
      if (this.onError) this.onError(err.message, err);
      throw err;
    }

    try {
      this.cleanup(); // Limpiar instancias previas

      // 1. Obtener stream de audio
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // 2. Configurar Web Audio API para visualizador en tiempo real
      this.setupAudioAnalyser(this.mediaStream);

      // 3. Configurar MediaRecorder
      const mimeType = AudioRecorderService.getSupportedMimeType();
      const options = mimeType ? { mimeType } : {};
      this.mediaRecorder = new MediaRecorder(this.mediaStream, options);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.audioChunks.push(e.data);
        }
      };

      this.mediaRecorder.onerror = (e) => {
        console.error('Error en MediaRecorder:', e);
        if (this.onError) this.onError('Ocurrió un error durante la grabación.', e);
      };

      // Iniciar grabación recopilando trozos cada 250ms
      this.mediaRecorder.start(250);
      this.state = 'recording';
      this.startTime = Date.now();
      this.elapsedTime = 0;
      this.startTimer();
      this.startVisualizerLoop();

      if (this.onStateChange) this.onStateChange(this.state);
      return true;

    } catch (err) {
      this.cleanup();
      let userFriendlyMessage = 'No fue posible acceder al micrófono.';

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        userFriendlyMessage = 'Permiso denegado: Por favor habilita el acceso al micrófono en los permisos de tu navegador para realizar la grabación.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        userFriendlyMessage = 'No se encontró ningún micrófono conectado en tu dispositivo.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        userFriendlyMessage = 'El micrófono está siendo utilizado por otra aplicación o pestaña del navegador.';
      } else if (err.name === 'SecurityError') {
        userFriendlyMessage = 'El acceso al micrófono requiere una conexión segura (HTTPS o localhost).';
      }

      if (this.onError) this.onError(userFriendlyMessage, err);
      throw new Error(userFriendlyMessage);
    }
  }

  /**
   * Pausa la grabación activa
   */
  pause() {
    if (this.mediaRecorder && this.state === 'recording') {
      try {
        this.mediaRecorder.pause();
        this.state = 'paused';
        this.stopTimer();
        if (this.onStateChange) this.onStateChange(this.state);
      } catch (err) {
        console.warn('Error pausando grabación:', err);
      }
    }
  }

  /**
   * Reanuda la grabación pausada
   */
  resume() {
    if (this.mediaRecorder && this.state === 'paused') {
      try {
        this.mediaRecorder.resume();
        this.state = 'recording';
        this.startTime = Date.now() - (this.elapsedTime * 1000);
        this.startTimer();
        if (this.onStateChange) this.onStateChange(this.state);
      } catch (err) {
        console.warn('Error reanudando grabación:', err);
      }
    }
  }

  /**
   * Detiene la grabación y retorna el Blob y su duración
   * @returns {Promise<{ blob: Blob, url: string, durationSeconds: number, mimeType: string }>}
   */
  stop() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || this.state === 'inactive') {
        return reject(new Error('No hay ninguna grabación en curso.'));
      }

      this.stopTimer();
      const finalDuration = this.elapsedTime;

      this.mediaRecorder.onstop = () => {
        try {
          const mimeType = this.mediaRecorder.mimeType || 'audio/webm';
          const audioBlob = new Blob(this.audioChunks, { type: mimeType });
          const audioUrl = URL.createObjectURL(audioBlob);

          this.state = 'stopped';
          if (this.onStateChange) this.onStateChange(this.state);

          this.cleanupMediaStream();

          resolve({
            blob: audioBlob,
            url: audioUrl,
            durationSeconds: finalDuration,
            mimeType: mimeType
          });
        } catch (err) {
          reject(err);
        }
      };

      try {
        this.mediaRecorder.stop();
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Cancela y descarta la grabación sin guardar
   */
  cancel() {
    this.stopTimer();
    if (this.mediaRecorder && (this.state === 'recording' || this.state === 'paused')) {
      try {
        this.mediaRecorder.ondataavailable = null;
        this.mediaRecorder.onstop = null;
        this.mediaRecorder.stop();
      } catch (e) {}
    }
    this.cleanup();
    this.state = 'inactive';
    if (this.onStateChange) this.onStateChange(this.state);
  }

  /**
   * Inicia el temporizador de tiempo transcurrido
   */
  startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      const now = Date.now();
      this.elapsedTime = (now - this.startTime) / 1000;
      if (this.onTimeUpdate) {
        this.onTimeUpdate(this.elapsedTime, AudioRecorderService.formatTime(this.elapsedTime));
      }
    }, 200);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Formatea segundos a MM:SS
   */
  static formatTime(seconds) {
    const s = Math.max(0, Math.floor(seconds || 0));
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  /**
   * Configura el analizador de audio Web Audio API
   */
  setupAudioAnalyser(stream) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      this.audioContext = new AudioCtx();
      this.sourceNode = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64; // Bajo costo computacional
      this.analyser.smoothingTimeConstant = 0.8;
      this.sourceNode.connect(this.analyser);
    } catch (e) {
      console.warn('Web Audio API Analyser no disponible:', e);
    }
  }

  startVisualizerLoop() {
    if (!this.analyser) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const tick = () => {
      if (this.state === 'recording') {
        this.analyser.getByteFrequencyData(dataArray);
        if (this.onVisualizerData) {
          this.onVisualizerData(dataArray);
        }
      }
      if (this.state === 'recording' || this.state === 'paused') {
        this.animationFrameId = requestAnimationFrame(tick);
      }
    };

    this.animationFrameId = requestAnimationFrame(tick);
  }

  /**
   * Libera el micrófono para apagar el indicador de hardware del dispositivo
   */
  cleanupMediaStream() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {}
      });
      this.mediaStream = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  cleanup() {
    this.stopTimer();
    this.cleanupMediaStream();
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.state = 'inactive';
  }

  /**
   * Genera la descarga local del archivo de audio en el navegador
   * Cumple con el formato de nombre solicitado: Modulo1_TermometroAdaptacion_YYYY-MM-DD
   */
  static downloadAudioFile(blobOrUrl, customFilename) {
    if (!blobOrUrl) return false;

    const todayStr = new Date().toISOString().slice(0, 10);
    const filename = customFilename || `Modulo1_TermometroAdaptacion_${todayStr}.webm`;

    const url = typeof blobOrUrl === 'string' ? blobOrUrl : URL.createObjectURL(blobOrUrl);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      if (typeof blobOrUrl !== 'string') {
        URL.revokeObjectURL(url);
      }
    }, 150);
    return true;
  }
}
