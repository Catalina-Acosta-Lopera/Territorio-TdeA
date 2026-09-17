# Asistente Virtual de Asesorías Territorio TdeA (Versión 3)

Punto de orientación institucional para estudiantes del **Tecnológico de Antioquia (TdeA)**, enfocado **exclusivamente en las asesorías académicas** de Territorio TdeA, resolución de dificultades de acceso, biblioteca de recursos y participación en Microsoft Teams.

---

## 🎯 Alcance del Servicio

El asistente está orientado a:
1. **Consultar asesorías disponibles:** Horarios, asignaturas de Ciencias Básicas (Matemáticas, Álgebra, Cálculo, Física, Estadística), docentes y enlaces de acceso a Teams.
2. **Centro de Recursos para Estudiantes:** Biblioteca organizada en 3 categorías (*Microsoft Teams*, *Participación en asesorías* y *Técnicas de estudio*) con tarjetas reutilizables (`ResourceCard`).
3. **Videos Orientadores Integrados:** Espacios preparados con marcadores de posición (*"Video pendiente de carga"* / *"Tutorial disponible próximamente"*) en las opciones de Microsoft Teams y en las dificultades con asesorías.
4. **Resolver dudas frecuentes sobre asesorías:** Funcionamiento, dinámica y preparación previa para aprovechar las sesiones.
5. **Experiencia y Retroalimentación del Estudiante:** Sistema interactivo *"¿Te fue útil esta información?"* con escalamiento oportuno para quienes requieran atención adicional.
6. **Canalizar casos que requieran atención humana:** Contacto directo y escalamiento al correo institucional:
   **[auxcienciasbasicas2@tdea.edu.co](mailto:auxcienciasbasicas2@tdea.edu.co)**

---

## 📁 Estructura del Proyecto

```
Asistente territorio TdeA/
├── index.html                   # Contenedor HTML5 semántico y accesible
├── README.md                    # Documentación de la Versión 3
├── css/
│   ├── variables.css            # Tokens de diseño y paleta institucional TdeA
│   ├── base.css                 # Reset moderno, utilidades y animaciones
│   ├── layout.css               # Header institucional, layout responsive y footer
│   └── components.css           # Tarjetas, catálogo, ResourceCard, modal y feedback
└── js/
    ├── app.js                   # Bootstrap y orquestación de componentes
    ├── router.js                # Enrutador por URL hash e historial de navegación
    ├── data/
    │   ├── flowsConfig.js       # Flujos de asesorías, videos orientadores y recursos
    │   ├── advisoryMockData.js  # Catálogo de asesorías académicas en Ciencias Básicas
    │   └── resourcesData.js     # Fuente de datos independiente para la biblioteca de recursos
    ├── components/
    │   ├── assistantView.js     # Renderizador de opciones, videos, feedback y escalamiento
    │   ├── advisoryList.js      # Catálogo interactivo con buscador y filtros por área
    │   ├── resourceCard.js      # Componente reutilizable para tarjetas de recursos
    │   ├── resourcesView.js     # Vista completa de la biblioteca de recursos estudiantiles
    │   ├── breadcrumbs.js       # Barra de navegación e historial
    │   └── modal.js             # Modal accesible para tutoriales y acceso a Teams
    └── services/
        ├── aiService.js         # Arquitectura desacoplada para futura IA / LLM
        ├── trackingService.js   # Arquitectura para permanencia y seguimiento
        └── analyticsService.js  # Arquitectura para analítica y telemetría
```

---

## 🎓 Biblioteca de Recursos (`resourcesData.js`)

La biblioteca cuenta con 16 materiales de apoyo organizados en:
- **💻 Microsoft Teams (8 recursos):**
  1. Cómo ingresar a una asesoría (Video)
  2. Cómo acceder desde celular (Video)
  3. Cómo activar y desactivar el micrófono (Tutorial)
  4. Cómo activar la cámara (Tutorial)
  5. Cómo compartir pantalla (Tutorial)
  6. Cómo utilizar el chat (Guía)
  7. Cómo acceder a una grabación (Guía)
  8. Qué hacer si el enlace no funciona (Video)
- **📅 Participación en asesorías (5 recursos):**
  1. Cómo consultar horarios (Video)
  2. Cómo encontrar una asesoría (Guía)
  3. Recomendaciones antes de ingresar (Guía)
  4. Normas básicas de participación (Documento)
  5. Preguntas frecuentes sobre asesorías (Guía)
- **📚 Técnicas de estudio (3 recursos):**
  1. Cómo aprovechar al máximo tus asesorías (Guía)
  2. Organización del tiempo y hábitos de estudio (Tutorial)
  3. Registro de dudas y repaso posterior (Documento)

---

## 🚀 Cómo Ejecutar la Aplicación

Ejecuta un servidor local en la carpeta del proyecto:

```powershell
py -m http.server 8000
```

Luego abre tu navegador en:
```
http://localhost:8000
```

---

## ✉️ Canal de Atención Oficial

Para situaciones que requieran atención personalizada, el asistente escala directamente a:
- **Correo:** `auxcienciasbasicas2@tdea.edu.co`
- **Área:** Coordinación de Asesorías Académicas · Ciencias Básicas · Territorio TdeA
