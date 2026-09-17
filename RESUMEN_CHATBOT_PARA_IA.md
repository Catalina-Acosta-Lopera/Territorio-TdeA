# Documentación y Especificación Técnica del Chatbot / Widget FAQ
## Asistente Virtual Territorio TdeA · Ciencias Básicas (Tecnológico de Antioquia)

> **Destinatario:** Prompt de contexto para Inteligencias Artificiales (ChatGPT, Claude, Gemini, etc.)  
> **Propósito:** Brindar la arquitectura completa, funciones, enlaces, rutas, catálogo de preguntas institucionales y lógica interna del chatbot/widget para su análisis, extensión o entrenamiento.

---

## 1. Identificación y Enfoque del Proyecto

- **Nombre:** Asistente Virtual & Widget Flotante de Preguntas Frecuentes.
- **Institución:** Tecnológico de Antioquia (TdeA) – Proyecto Territorio TdeA – Área de Ciencias Básicas.
- **Filosofía del Chatbot:** 
  - **100% Determinista e Institucional:** No utiliza modelos generativos dentro del navegador del usuario; no inventa ni alucina respuestas. Todas las respuestas provienen de una base de datos institucional validada.
  - **Autónomo y Seguro:** El widget se implementa en JavaScript Vanilla bajo el patrón IIFE (*Immediately Invoked Function Expression*), funcionando bajo `http://`, `https://` y `file:///` sin bloqueos de CORS.
  - **Experiencia de Usuario (Estilo Corporación Gilberto Echeverri):** Botón flotante accesible (FAB) en la esquina inferior derecha que despliega un modal con interfaz moderna (glassmorphic, tipografía Inter/Outfit, transiciones suaves y tarjetas interactivas).
  - **Canal de Escalamiento Humano:** No promete atención en vivo falsa (se retiró cualquier etiqueta de "En línea"). Si una consulta no está catalogada o requiere trámite especial, canaliza hacia el correo oficial: `auxcienciasbasicas2@tdea.edu.co`.

---

## 2. Estructura de Archivos y Componentes

| Archivo | Rol y Responsabilidad |
| :--- | :--- |
| `index.html` | Estructura base de la Single Page Application (SPA), botón flotante del widget (`#faq-floating-btn`), contenedor modal (`#faq-widget-container`) y vínculos de estilos. |
| `js/faqWidget.js` | Motor interactivo autónomo del widget. Controla el renderizado de vistas (categorías, preguntas, respuestas, buscador en tiempo real, asistente de correo Outlook y redirección al catálogo). |
| `js/data/chatbotFaqData.js` | Base de datos declarativa de preguntas frecuentes (`CHATBOT_CATEGORIES`), datos de contacto (`ADVISOR_CONTACT`) y algoritmo de coincidencia determinista (`findMatchingFaq`). |
| `js/data/advisoryMockData.js` | Catálogo maestro de asesorías de Ciencias Básicas con docentes, horarios, correos institucionales, enlaces a Microsoft Teams y algoritmo de ordenamiento cronológico dinámico en tiempo real (`getSortedAdvisories`). |
| `js/components/assistantView.js` | Vista principal de inicio con los 4 canales institucionales (Canal Académico, Asesorías, Campus Virtual y Soporte) y acceso al catálogo. |
| `css/faqWidget.css` | Sistema de diseño del widget flotante: tarjetas, badges de estado, animaciones, buscador y modo responsivo para celulares y computadores. |
| `css/components.css` | Estilos para la plataforma principal, tarjetas de asesoría, badges cronológicos (`.badge-today-past`, `.badge-live`, etc.). |

---

## 3. Funciones Técnicas del Chatbot (`js/faqWidget.js` y `js/data/chatbotFaqData.js`)

### 3.1. Control del Ciclo de Vida de la Interfaz
- `init()`: Detecta la presencia de los contenedores DOM, inyecta el botón flotante si no existe y registra eventos de teclado (`Escape` para cerrar, `Enter` para buscar) y clics fuera del modal.
- `openFaqWidget()`: Abre el modal, añade clase `.is-open`, bloquea el scroll de fondo si es móvil y enfoca automáticamente la barra de búsqueda o primera categoría.
- `closeFaqWidget()`: Cierra el modal con animación de salida y regresa el foco al botón disparador flotante para accesibilidad (WCAG).

### 3.2. Navegación y Renderizado de Vistas
- `renderCategoriesView()`: Renderiza el menú principal del widget con:
  - Buscador predictivo en tiempo real con limpieza rápida (`#faq-widget-search-input`).
  - Chips temáticos directos (Asesorías, Virtuales, Asignaturas, Contacto).
  - Las 5 categorías principales en tarjetas interactivas con iconos y conteo de preguntas.
  - Tarjeta de acceso directo para redactar correo institucional a Ciencias Básicas.
- `renderCategoryDetail(categoryId)`: Despliega la lista de preguntas pertenecientes a una categoría específica con botón de retorno (`← Volver`).
- `renderQuestionDetail(categoryId, questionId)`: Muestra la respuesta institucional en texto claro, con botones de utilidad (ej. si la pregunta refiere a horarios, incluye botón directo hacia la sección de asesorías).
- `renderContactView()`: Formulario de asistencia que estructura automáticamente un mensaje para el estudiante y ofrece:
  - Apertura directa en **Outlook en la Web**.
  - Botón para copiar plantilla al portapapeles.

### 3.3. Algoritmo de Búsqueda Determinista (`findMatchingFaq` / `performSearch`)
- **Procesamiento de texto:** Convierte la consulta a minúsculas, elimina tildes y caracteres especiales (NFD normalizer: `replace(/[\u0300-\u036f]/g, "")`) y filtra palabras irrelevantes (*stop words* con menos de 3 caracteres).
- **Sistema de puntuación ponderada:**
  - `+5 puntos`: Coincidencia en la lista de palabras clave (`keywords`) de la pregunta.
  - `+3 puntos`: Coincidencia en el texto de la pregunta (`question`).
  - `+1 punto`: Coincidencia en el cuerpo de la respuesta (`answer`).
- **Respuesta ante no coincidencia:** Si el score es 0 o no hay resultados, muestra `UNKNOWN_QUESTION_RESPONSE` invitando a redactar un correo a `auxcienciasbasicas2@tdea.edu.co`.

### 3.4. Algoritmo de Ordenamiento Cronológico en Tiempo Real (`getSortedAdvisories`)
Ubicado en `js/data/advisoryMockData.js`, evalúa la hora y el día real de la máquina del usuario (`new Date()`):
1. **Prioridad 1 (En curso ahora):** Sesiones del día de hoy cuyo rango horario (`horaInicio` a `horaFin`) coincide con el minuto actual. (Badge: `🔴 En curso ahora`, score `0`).
2. **Prioridad 2 (Hoy más tarde):** Sesiones de hoy que aún no han comenzado. (Badge: `🔵 Hoy HH:MM`, score `1 + minutosRestantes`).
3. **Prioridad 3 (Próximos días de la semana):** Sesiones de los días siguientes (Lunes a Sábado). (Badge: `📅 Día HH:MM`, score `diasDiferencia * 1440 + minutosInicio`).
4. **Prioridad 4 (Finalizadas hoy):** Sesiones que tuvieron lugar hoy pero su hora de finalización ya pasó. Son desplazadas estrictamente al final del catálogo para evitar confusión. (Badge: `⚪ Finalizó hoy (HH:MM)`, clase CSS `.badge-today-past`, score `7 * 1440 + minutosInicio`).
- **Desempate:** En caso de empate de horario, se ordenan alfabéticamente por el nombre del Área y luego por el nombre del Docente.

### 3.5. Integración con Correo Institucional Web (Outlook Web)
- `getStructuredOutlookOfficeUrl()`: Genera un deep-link web directo hacia Microsoft 365 con el destinatario oficial sin mensaje predeterminado:
  ```text
  https://outlook.office.com/mail/deeplink/compose?to=auxcienciasbasicas2@tdea.edu.co
  ```
  Se abre mediante `window.open(url, '_blank', 'noopener,noreferrer')`, impidiendo que Windows intente abrir clientes de escritorio locales o desconfigurados.
- `getStructuredOutlookLiveUrl()`: Enlace alternativo para cuentas personales de Microsoft:
  ```text
  https://outlook.live.com/mail/0/deeplink/compose?to=auxcienciasbasicas2@tdea.edu.co
  ```
- Copia directa de correo al portapapeles: Utiliza `navigator.clipboard.writeText()` con *fallback* a `document.execCommand('copy')` y muestra una notificación flotante (Toast: "¡Correo copiado!").

---

## 4. Banco Oficial de Preguntas y Respuestas Institucionales

El chatbot está estructurado en **5 categorías temáticas**, **13 preguntas institucionales frecuentes**, **1 tarjeta de escalamiento a correo** y **1 respuesta de excepción**:

### Categoría 1: Asesorías académicas (📚 `asesorias`)
1. **¿Qué son las asesorías académicas?**
   - *Respuesta:* Espacios de acompañamiento diseñados para apoyar a los estudiantes en la comprensión de los temas de sus asignaturas, resolver dudas y fortalecer su proceso de aprendizaje.
2. **¿Cómo puedo solicitar una asesoría?**
   - *Respuesta:* Puedes acceder de acuerdo con la programación establecida para Territorio TdeA. No requieres cita previa ni inscripción previa para ingresar a las salas virtuales de Microsoft Teams.
3. **¿Las asesorías académicas tienen algún costo?**
   - *Respuesta:* No, las asesorías académicas de Territorio TdeA son un servicio institucional 100% gratuito para todos los estudiantes del Tecnológico de Antioquia.
4. **¿Puedo asistir con un docente que no sea mi profesor de clase?**
   - *Respuesta:* ¡Sí, totalmente! Todos los docentes y monitores del área de Ciencias Básicas atienden y orientan a cualquier estudiante del TdeA, sin importar el grupo o docente con quien tengas matriculada la materia.
5. **¿Cuántas veces puedo asistir a las asesorías durante el semestre?**
   - *Respuesta:* Puedes ingresar tantas veces como lo necesites en cualquier semana del periodo académico. No hay límite.

### Categoría 2: Horarios de asesorías (🗓️ `horarios`)
1. **¿Dónde puedo consultar los horarios?**
   - *Respuesta:* Los horarios se encuentran disponibles en la sección "Asesorías disponibles" de la plataforma. Puedes consultar los días y horas programadas por área con enlace directo a Microsoft Teams para cada sesión.

### Categoría 3: Asesorías virtuales (💻 `virtuales`)
1. **¿Cómo ingreso a una asesoría virtual?**
   - *Respuesta:* Ingresa al enlace de Microsoft Teams correspondiente a la asesoría programada en la sección "Asesorías disponibles". Se recomienda ingresar unos minutos antes e iniciar sesión con el correo institucional `@tdea.edu.co`.
2. **¿Qué debo tener preparado antes de ingresar a la asesoría?**
   - *Respuesta:* Tener a mano apuntes de clase, enunciados de los talleres o ejercicios específicos en los que requieras orientación, y sesión iniciada en Teams.
3. **¿Qué hago si el docente no se encuentra en la sala de Teams?**
   - *Respuesta:* Verificar el día y horario exacto según la programación. Si persiste la ausencia tras unos minutos, reportarlo a `auxcienciasbasicas2@tdea.edu.co`.

### Categoría 4: Asignaturas con asesoría (📖 `asignaturas`)
1. **¿Qué asignaturas tienen asesorías?**
   - *Respuesta:* Cubren las áreas de Ciencias Básicas: Matemáticas (Cálculo, Álgebra, Trigonometría), Física (Mecánica, Electricidad), Biología, Estadística, Química (General y Orgánica), y Habilidades comunicativas / Lengua Materna / Humanidades.

### Categoría 5: Estudiantes de Territorio (👨‍🎓 `estudiantes`)
1. **¿Quiénes pueden acceder a las asesorías?**
   - *Respuesta:* Abiertas a todos los estudiantes que hacen parte de los procesos académicos de Territorio TdeA y comunidad institucional que requiera acompañamiento.
2. **¿Qué hago si no puedo asistir a una asesoría?**
   - *Respuesta:* Consultar la programación para identificar otros horarios en diferentes días de la semana para la misma área, o escribir a `auxcienciasbasicas2@tdea.edu.co` para buscar alternativas.
3. **¿Puedo ingresar si solo quiero escuchar o repasar un tema?**
   - *Respuesta:* ¡Sí! Las salas virtuales están abiertas para escuchar explicaciones clave, observar las dudas de compañeros y afianzar conocimientos sin obligación de llevar ejercicios resueltos.

### Tarjeta de Contacto Escalamiento (✉️ `contacto`)
- *Destinatario:* `auxcienciasbasicas2@tdea.edu.co`
- *Mensaje:* ¿Necesitas resolver una situación específica o no encontraste la respuesta que buscabas? Puedes comunicarte directamente con el equipo de Ciencias Básicas.

### Respuesta a Consultas Desconocidas (`UNKNOWN_QUESTION_RESPONSE`)
- *Mensaje:* "No tengo información disponible sobre esa consulta. Para recibir orientación personalizada, puedes comunicarte con un asesor: auxcienciasbasicas2@tdea.edu.co"

---

## 5. Mapeo de Enlaces, Redirecciones y Destinos Externos

### 5.1. Redirecciones Internas en la SPA (Vía Hash URL)
- `#/asesorias_disponibles`: Carga la vista del catálogo dinámico de asesorías de Ciencias Básicas con buscador de docentes, filtros por área (Matemáticas, Física, Biología, etc.) y tarjetas ordenadas en tiempo real.
- `#/`: Carga la página principal del Asistente Virtual Territorio TdeA.

### 5.2. Enlaces a Herramientas de Correo Web
- **Outlook en la Web (Institucional M365):**
  `https://outlook.office.com/mail/deeplink/compose?to=auxcienciasbasicas2@tdea.edu.co`
  - Atributos: `target="_blank"`, `rel="noopener noreferrer"`.
- **Outlook Live Web (Cuentas personales de respaldo):**
  `https://outlook.live.com/mail/0/deeplink/compose?...`

### 5.3. Enlaces a Salas Virtuales de Microsoft Teams
Cada sesión en el catálogo y referenciada en las asesorías conecta a un enlace oficial de reunión en Teams:
- **Biología (Gina Alejandra Gil):** `https://teams.microsoft.com/meet/219408212231892?p=elVZ3RUe8KllDONT9E`
- **Estadística (Sara Lucía Castillo):** `https://teams.microsoft.com/meet/240218539347423?p=wIyVECKGSN53VbJhCD`
- **Física (Gustavo Suárez Guerrero):** `https://teams.microsoft.com/meet/222434429436805?p=33dgQ8qOuGI8ENurI4`
- **Habilidades comunicativas (Yina Paola Moreno):** `https://teams.microsoft.com/meet/298802026215676?p=fHVITSWOdXtB1Vdvft`
- **Matemáticas (Andrés Villabón):** `https://teams.microsoft.com/meet/242645774130079?p=HR3l4yWvTJQ4o41xsI`
- **Química Orgánica:** `https://teams.microsoft.com/l/meetup-join/asesoria-quimica-organica-tdea`
- **Biología (Claudia Patricia Rendón):** `https://teams.microsoft.com/meet/21175659837920?p=u0TffR0rYg3zYIvi8C`
- **Estadística (Yolanda Múnera):** `https://teams.microsoft.com/meet/228186178783457?p=yQ3a6K9U1mE6HkWG7J`
- *(Y demás enlaces de la programación semanal completa)*.

---

## 6. Resumen de Decisiones de Diseño y Limpieza Reciente

1. **Eliminación del indicador falso "En línea":** Se retiró la píldora verde del widget para reflejar honestidad institucional, ya que es un sistema automatizado de FAQs y no un operador humano en vivo.
2. **Eliminación de accesos redundantes:**
   - Se removió el botón "Horarios y Enlaces Teams" de adentro del widget, reemplazándolo por una derivación inteligente a la vista `#/asesorias_disponibles` solo cuando el usuario busca información sobre horarios.
   - Se retiró la barra "Inicia una consulta rápida" de la cabecera principal de inicio para evitar confusión con el buscador del widget flotante.
3. **Orden cronológico inteligente:** Las asesorías que ya finalizaron en el día actual muestran el badge gris institucional `Finalizó hoy (HH:MM)` y se envían al final del listado, garantizando que el estudiante siempre vea primero las asesorías activas o próximas.
