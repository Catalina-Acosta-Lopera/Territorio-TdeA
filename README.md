# Asistente Virtual Territorio TdeA & Campus Vital (Edición 2026)

Ecosistema digital e institucional del **Tecnológico de Antioquia (TdeA)** que articula el acompañamiento en **asesorías académicas en Ciencias Básicas**, el entorno psicoeducativo y socioemocional **Campus Vital**, la **Serie Oficial de Podcasts** y el **Centro de Aprendizaje 3D**.

---

## 📑 Guía Oficial de Navegación para Monitores (PDF)

Para capacitar a los monitores académicos, docentes y asesores pares en el funcionamiento integral del ecosistema, se encuentra disponible la guía oficial con capturas reales y sin hojas en blanco:

* 📄 **Documento Oficial en PDF:** [`docs/Guia_Navegacion_Campus_Vital_Monitores_TdeA.pdf`](docs/Guia_Navegacion_Campus_Vital_Monitores_TdeA.pdf)
* 🌐 **Versión Web Interactiva (HTML):** [`docs/guia_navegacion_campus_vital_monitores.html`](docs/guia_navegacion_campus_vital_monitores.html)
* 🖼️ **Banco de Capturas Reales:** [`docs/screenshots/`](docs/screenshots/)

---

## 🌟 Novedades y Módulos del Asistente

### 1. 🌿 Portal Campus Vital (`#/campus_vital`)
* **Vitrina de Puertas Gemelas:**
  * **Tarjeta 1: Centro de Aprendizaje 3D:** Acceso directo al entorno inmersivo guiado por la mascota institucional.
  * **Tarjeta 2: Serie de Podcasts:** Acceso a los 4 episodios con avatar de micrófono y ondas activas.
* **Serie Oficial de Podcasts (4 Episodios):**
  * Reproductor de audio accesible bajo principios DUA.
  * Control de velocidad (1x, 1.25x, 1.5x) y barra de desplazamiento scrubbing.
  * Botón de descarga directa de audio en MP3 para escuchar sin conexión.
  * Transcripción textual completa para accesibilidad auditiva.

### 2. 🤖 Centro de Aprendizaje 3D (`#/centro_aprendizaje`)
Entorno lúdico e interactivo guiado por la **Mascota Virtual 3D oficial del TdeA**:

* **Módulo 1: Preparar el Equipaje 🎒**
  * *Estación 1:* Clima emocional y rueda de bienestar multidimensional (Académica, Social, Física, Emocional y Familiar).
  * *Estación 3:* Lienzo digital interactivo de Red de Apoyo para estampar nodos (Familia, Amigos, Docentes, Compañeros, Psicología y Bienestar TdeA).
  * *Cierre:* Maleta de bienestar consolidada (brújula, red de apoyo y rutas alternativas) con la bitácora del viajero e infografía institucional.
* **Módulo 2: Elegir el Rumbo 🌳**
  * Metáfora interactiva del *Árbol de la Vida* (Raíces, Tronco, Ramas y Frutos).
  * Formulación guiada de metas académicas bajo la metodología SMART.
* **Módulo 3: Gimnasio Emocional 🧘**
  * *Pausa 1:* Escáner Somático Térmico con silueta interactiva y checklist de zonas de tensión somática (cabeza, mandíbula, cuello, pecho y estómago).
  * *Pausa 2:* Ejercicio de respiración consciente guiada 4-2-6 con esfera animada y contador visual de ciclos.
  * *Pausa 3:* Semáforo interactivo de autorregulación (*Rojo: Me detengo*, *Amarillo: Observo*, *Verde: Elijo*) con el caso aplicado de Valentina.
  * *Pausa 4:* Técnica sensorial de anclaje 5-4-3-2-1 y caja de herramientas personalizable para volver a la calma.

### 3. 📚 Asesorías Académicas en Ciencias Básicas (`#/home`)
* Catálogo dinámico de horarios de asesorías en Matemáticas, Álgebra, Cálculo, Física y Estadística.
* Enlaces directos a salas virtuales de Microsoft Teams.
* Biblioteca de recursos con guías y tutoriales en video y texto.
* Botón de accesibilidad institucional con modo contraste y controles de texto.

---

## 🔒 Privacidad y Almacenamiento Local

* Todas las respuestas de los estudiantes (clima emocional, nodos de la red, metas SMART, bitácora y herramientas elegidas) se guardan **exclusivamente en el almacenamiento local del navegador (`localStorage`)** bajo la clave `tdea_learning_center_state`.
* No se envían datos confidenciales ni reflexiones íntimas a servidores externos, garantizando la privacidad absoluta del estudiante.
* Es posible reiniciar el progreso o exportar la bitácora de viaje en cualquier momento.

---

## 📁 Estructura del Repositorio

```
Asistente territorio TdeA/
├── index.html                   # Punto de entrada HTML5 accesible y responsive
├── README.md                    # Documentación oficial del proyecto
├── docs/                        # Documentación institucional y guías
│   ├── Guia_Navegacion_Campus_Vital_Monitores_TdeA.pdf  # Guía oficial para monitores (15 pág)
│   ├── guia_navegacion_campus_vital_monitores.html     # Versión web de la guía
│   └── screenshots/             # 12 capturas reales en alta resolución
├── assets/
│   ├── icons/                   # Favicons y mascotas SVG institucionales
│   ├── images/                  # Infografías y recursos gráficos oficiales
│   └── campusVital/audio/       # Audios oficiales MP3 de los 4 podcasts
├── css/
│   ├── variables.css            # Paleta de color y tokens TdeA
│   ├── base.css                 # Reset y utilidades
│   ├── layout.css               # Estructura general responsive
│   ├── components.css           # Tarjetas, modales y botones
│   ├── learningCenter.css       # Estilos del Centro de Aprendizaje 3D
│   ├── trainJourney.css         # Estilos del Módulo 1 (El Viaje del Tren)
│   ├── mountainJourney.css      # Estilos del Módulo 2 (Montaña y Árbol)
│   └── module3Journey.css       # Estilos del Módulo 3 (Gimnasio Emocional)
└── js/
    ├── app.js                   # Orquestador principal de la aplicación
    ├── router.js                # Enrutador por URL Hash
    ├── data/
    │   ├── advisoryMockData.js  # Horarios de asesorías de Ciencias Básicas
    │   ├── podcastsData.js      # Datos y rutas de los 4 podcasts oficiales
    │   └── resourcesData.js     # Biblioteca de recursos estudiantiles
    └── components/
        ├── assistantView.js     # Vistas del portal y vitrinas institucionales
        ├── podcastCard.js       # Reproductor de podcast accesible DUA
        └── learningCenter/
            ├── learningCenterView.js  # Menú 3D y orquestador modular
            ├── learningCenterState.js # Gestor de estado local con persistencia
            ├── module1View.js         # Módulo 1 (Equipaje y Red)
            ├── module2View.js         # Módulo 2 (Árbol y Metas SMART)
            └── module3View.js         # Módulo 3 (4 Pausas Somáticas)
```

---

## 🚀 Despliegue y Ejecución Local

Para ejecutar la aplicación en un servidor local:

```powershell
py range_server.py 8000
```
O con el servidor básico de Python:
```powershell
py -m http.server 8000
```

Luego abre en tu navegador:
```
http://localhost:8000/
```

Y para ingresar directamente a Campus Vital o al Centro de Aprendizaje:
* `http://localhost:8000/#/campus_vital`
* `http://localhost:8000/#/centro_aprendizaje`

---

## ✉️ Canales de Acompañamiento Institucional

* **Bienestar Institucional TdeA:** Bloque 2 · `bienestar@tdea.edu.co`
* **Coordinación de Ciencias Básicas:** Bloque 1 · `cienciasbasicas@tdea.edu.co`
* **Soporte de Asesorías Académicas:** `auxcienciasbasicas2@tdea.edu.co`
* **Línea de Escucha 106 / Línea Amiga Medellín:** Marcando gratis al 106 (Atención psicológica 24/7).
