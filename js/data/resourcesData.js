/**
 * Estructura Declarativa y Pedagógica de Recursos para Estudiantes
 * Asistente Virtual de Asesorías Territorio TdeA - Ciencias Básicas
 * 
 * Contiene biblioteca académica con guías interactivas, formularios,
 * ejercicios resueltos paso a paso y talleres prácticos listos para lectura y descarga en PDF.
 */

export const RESOURCE_CATEGORIES = [
  { id: 'all', label: '📂 Todos los recursos', icon: '📂' },
  { id: 'guias_talleres', label: '📖 Guías y talleres prácticos', icon: '📖' },
  { id: 'tecnicas', label: '🧠 Técnicas y métodos de estudio', icon: '🧠' },
  { id: 'grabaciones', label: '🎥 Grabaciones y clases', icon: '🎥' },
  { id: 'campus_vital', label: '🌱 Campus Vital · Bienestar', icon: '🌱' }
];

export const RESOURCES_DATA = [
  // =========================================================================
  // Categoría: Guías y talleres prácticos (Ciencias Básicas TdeA)
  // =========================================================================
  {
    id: 'res-acad-mat-01',
    title: 'Taller y Guía Práctica de Matemáticas Básicas',
    description: 'Ejercicios guiados de factorización, fracciones algebraicas, productos notables y ecuaciones lineales con soluciones paso a paso.',
    type: 'documento',
    category: 'guias_talleres',
    categoryLabel: 'Guías y talleres prácticos',
    status: 'Disponible',
    placeholderNotice: 'Guía oficial descargable e interactiva',
    videoTitle: 'Taller de refuerzo: Matemáticas Básicas',
    academicContent: {
      objective: 'Dominar los métodos algebraicos fundamentales: factorización sistemática, simplificación de fracciones algebraicas complejas y resolución de ecuaciones lineales para afianzar el rendimiento en asignaturas cuantitativas.',
      topics: [
        'Factorización: Factor Común, Trinomio x² + bx + c y ax² + bx + c, Diferencia de Cuadrados',
        'Operaciones con fracciones algebraicas y racionalización de denominadores',
        'Ecuaciones lineales con una incógnita y problemas de aplicación en contexto real'
      ],
      formulas: [
        { name: 'Diferencia de Cuadrados', formula: 'a² - b² = (a - b)(a + b)', note: 'Aplica a binomios con coeficientes cuadrados perfectos' },
        { name: 'Trinomio Cuadrado Perfecto', formula: 'a² ± 2ab + b² = (a ± b)²', note: 'El término central es el doble producto de las raíces' },
        { name: 'Suma y Diferencia de Cubos', formula: 'a³ ± b³ = (a ± b)(a² ∓ ab + b²)', note: 'El segundo factor es un trinomio irreducible' },
        { name: 'Ecuación Lineal Canónica', formula: 'ax + b = 0  ⟹  x = -b / a', note: 'Válido para todo coeficiente real a ≠ 0' }
      ],
      solvedExercises: [
        {
          title: 'Factorización de Trinomio de la forma ax² + bx + c',
          problem: 'Factorizar completamente la expresión algebraica: 6x² - 7x - 3',
          steps: [
            { stepTitle: 'Multiplicar y dividir por el coeficiente principal (6)', stepDetail: 'Reescribimos la expresión manteniendo la equivalencia: [ (6x)² - 7(6x) - 18 ] / 6' },
            { stepTitle: 'Buscar dos números con producto -18 y suma -7', stepDetail: 'Los factores correspondientes son (-9) y (+2), puesto que (-9)(2) = -18 y (-9) + 2 = -7.' },
            { stepTitle: 'Formar los factores binómicos', stepDetail: 'Obtenemos: [ (6x - 9)(6x + 2) ] / 6' },
            { stepTitle: 'Extraer factores comunes y simplificar', stepDetail: 'Extraemos 3 del primer paréntesis y 2 del segundo: [ 3(2x - 3) · 2(3x + 1) ] / 6 = (2x - 3)(3x + 1)' }
          ],
          answer: '(2x - 3)(3x + 1)',
          pedagogicalTip: 'Multiplica los binomios resultantes mediante propiedad distributiva para corroborar que retornas exactamente a 6x² - 7x - 3.'
        },
        {
          title: 'Simplificación de Fracción Algebraica',
          problem: 'Simplificar a su mínima expresión: (x² - 9) / (x² + 5x + 6)',
          steps: [
            { stepTitle: 'Factorizar el numerador', stepDetail: 'x² - 9 es una diferencia de cuadrados perfecta: (x - 3)(x + 3)' },
            { stepTitle: 'Factorizar el denominador', stepDetail: 'x² + 5x + 6 es un trinomio simple: dos números que multiplicados den 6 y sumados 5 -> (x + 2)(x + 3)' },
            { stepTitle: 'Cancelar factores idénticos', stepDetail: 'Cancelamos el factor común (x + 3) presente tanto en el numerador como en el denominador, con la restricción x ≠ -3.' }
          ],
          answer: '(x - 3) / (x + 2), con x ≠ -3, x ≠ -2',
          pedagogicalTip: 'Recuerda que nunca debes cancelar términos individuales que estén sumando o restando, únicamente factores que multipliquen a toda la fracción.'
        },
        {
          title: 'Resolución de Ecuación Lineal con Paréntesis',
          problem: 'Resolver para x la igualdad: 3(2x - 1) - 2(x + 4) = 5(x - 2) + 1',
          steps: [
            { stepTitle: 'Aplicar propiedad distributiva', stepDetail: 'Eliminamos paréntesis: 6x - 3 - 2x - 8 = 5x - 10 + 1' },
            { stepTitle: 'Reducir términos semejantes en cada miembro', stepDetail: 'Miembro izquierdo: 4x - 11. Miembro derecho: 5x - 9. Queda: 4x - 11 = 5x - 9' },
            { stepTitle: 'Transponer variables y constantes', stepDetail: '4x - 5x = -9 + 11 ⟹ -x = 2' },
            { stepTitle: 'Despejar la incógnita x', stepDetail: 'Multiplicamos por -1 ambos lados: x = -2' }
          ],
          answer: 'x = -2',
          pedagogicalTip: 'Reemplaza x = -2 en la ecuación original para corroborar que ambos lados den el mismo valor numérico (-15 = -15).'
        }
      ],
      practiceExercises: [
        {
          problem: 'Factorizar completamente la diferencia: 4x² - 25y²',
          hint: 'Reconoce las raíces cuadradas de cada monomio: √(4x²) = 2x y √(25y²) = 5y.',
          answer: '(2x - 5y)(2x + 5y)'
        },
        {
          problem: 'Simplificar la fracción racional: (2x² + 4x) / (x² - 4)',
          hint: 'Extrae factor común 2x arriba y aplica diferencia de cuadrados en el denominador.',
          answer: '2x / (x - 2)'
        },
        {
          problem: 'Resolver la ecuación de primer grado: 5x - (2x - 3) = 12',
          hint: 'Atención con el signo menos antes del paréntesis: cambia los signos interiores a -2x + 3.',
          answer: 'x = 3'
        },
        {
          problem: 'Racionalizar el denominador: 4 / (√5 - 1)',
          hint: 'Multiplica numerador y denominador por el conjugado (√5 + 1).',
          answer: '√5 + 1'
        }
      ],
      advisoryTip: 'Anota en una hoja los pasos donde se te genera la duda al resolver el taller propuesto y muéstraselos directamente al docente asesor en la sala de Teams.'
    }
  },

  {
    id: 'res-acad-calc-02',
    title: 'Guía de Fundamentos de Cálculo Diferencial',
    description: 'Conceptos esenciales de funciones, límites, continuidad y cálculo de derivadas con aplicaciones prácticas para ciencias e ingenierías.',
    type: 'guia',
    category: 'guias_talleres',
    categoryLabel: 'Guías y talleres prácticos',
    status: 'Disponible',
    placeholderNotice: 'Guía pedagógica completa con formulario oficial',
    videoTitle: 'Fundamentos de Cálculo Diferencial',
    academicContent: {
      objective: 'Comprender la definición y el cálculo algebraico de límites indeterminados (0/0), y dominar la aplicación metódica de los teoremas de derivación (producto, cociente y regla de la cadena).',
      topics: [
        'Límites algebraicos e indeterminaciones de la forma 0/0 (factorización y racionalización)',
        'Definición geométrica de la derivada y tasa de cambio instantánea',
        'Reglas de derivación: potencia, suma, producto, cociente y regla de la cadena',
        'Cálculo de rectas tangentes y puntos críticos'
      ],
      formulas: [
        { name: 'Derivada de una Potencia', formula: 'd/dx [ xⁿ ] = n · xⁿ⁻¹', note: 'Válido para todo exponente real n' },
        { name: 'Regla del Producto', formula: 'd/dx [ u · v ] = u\'v + uv\'', note: 'Derivada del primero por el segundo más el primero por la derivada del segundo' },
        { name: 'Regla del Cociente', formula: 'd/dx [ u / v ] = (u\'v - uv\') / v²', note: 'Válido con v(x) ≠ 0' },
        { name: 'Regla de la Cadena', formula: 'd/dx [ f(g(x)) ] = f\'(g(x)) · g\'(x)', note: 'Derivada exterior evaluada en la interior por la derivada interior' },
        { name: 'Ecuación Recta Tangente', formula: 'y - y₀ = f\'(x₀)(x - x₀)', note: 'La pendiente m corresponde al valor de la derivada en x₀' }
      ],
      solvedExercises: [
        {
          title: 'Cálculo de Límite Indeterminado 0/0',
          problem: 'Evaluar el límite algebraico: lim (x ➔ 2) [ (x² - 4) / (x² - 3x + 2) ]',
          steps: [
            { stepTitle: 'Evaluación directa para detectar el tipo de forma', stepDetail: 'Sustituyendo x = 2: (4 - 4) / (4 - 6 + 2) = 0 / 0 (Forma indeterminada).' },
            { stepTitle: 'Factorizar numerador y denominador', stepDetail: 'Numerador: (x - 2)(x + 2). Denominador: (x - 2)(x - 1).' },
            { stepTitle: 'Cancelar el factor que genera la indeterminación', stepDetail: 'Simplificamos (x - 2) para todo x ≠ 2: lim (x ➔ 2) [ (x + 2) / (x - 1) ]' },
            { stepTitle: 'Evaluar el límite resultante', stepDetail: 'Sustituyendo x = 2: (2 + 2) / (2 - 1) = 4 / 1 = 4' }
          ],
          answer: '4',
          pedagogicalTip: 'Nunca finalices tu procedimiento diciendo "el límite da 0/0". La indeterminación sólo señala que hay factores comunes por simplificar.'
        },
        {
          title: 'Derivada usando Regla de la Cadena',
          problem: 'Hallar la derivada de la función compuesta: f(x) = (3x² - 5x)⁴',
          steps: [
            { stepTitle: 'Identificar funciones exterior e interior', stepDetail: 'Exterior: u⁴ con derivada 4u³. Interior: u = 3x² - 5x.' },
            { stepTitle: 'Calcular la derivada de la función interior', stepDetail: 'u\' = d/dx [ 3x² - 5x ] = 6x - 5' },
            { stepTitle: 'Aplicar el teorema de la cadena', stepDetail: 'f\'(x) = 4(u)³ · u\' = 4(3x² - 5x)³ · (6x - 5)' }
          ],
          answer: 'f\'(x) = 4(6x - 5)(3x² - 5x)³',
          pedagogicalTip: 'No expandas el binomio a la cuarta potencia antes de derivar. La regla de la cadena permite derivar de forma compacta y elegante.'
        },
        {
          title: 'Ecuación de la Recta Tangente a una Curva',
          problem: 'Hallar la recta tangente a y = x³ - 2x + 1 en el punto de abscisa x = 1.',
          steps: [
            { stepTitle: 'Calcular la ordenada del punto de tangencia y₀', stepDetail: 'y(1) = (1)³ - 2(1) + 1 = 0. El punto es P(1, 0).' },
            { stepTitle: 'Calcular la función derivada f\'(x)', stepDetail: 'y\' = d/dx [ x³ - 2x + 1 ] = 3x² - 2' },
            { stepTitle: 'Evaluar la pendiente m = f\'(1)', stepDetail: 'm = 3(1)² - 2 = 1' },
            { stepTitle: 'Construir la ecuación punto-pendiente', stepDetail: 'y - 0 = 1(x - 1) ⟹ y = x - 1' }
          ],
          answer: 'y = x - 1',
          pedagogicalTip: 'El valor numérico de la derivada en un punto siempre equivale a la pendiente de la recta tangente en ese punto exacto.'
        }
      ],
      practiceExercises: [
        {
          problem: 'Evaluar el límite: lim (x ➔ 3) [ (√(x + 1) - 2) / (x - 3) ]',
          hint: 'Racionaliza multiplicando numerador y denominador por la conjugada (√(x + 1) + 2).',
          answer: '1 / 4'
        },
        {
          problem: 'Derivar por regla del cociente: g(x) = (2x + 1) / (3x - 2)',
          hint: 'Aplica [ u\'v - uv\' ] / v² con u = 2x + 1 y v = 3x - 2.',
          answer: '-7 / (3x - 2)²'
        },
        {
          problem: 'Derivar por regla del producto: h(x) = x² · sen(x)',
          hint: 'Usa u\'v + uv\' sabiendo que la derivada de sen(x) es cos(x).',
          answer: '2x·sen(x) + x²·cos(x)'
        },
        {
          problem: 'Hallar los puntos críticos de: f(x) = x³ - 3x²',
          hint: 'Deriva e iguala a cero: f\'(x) = 3x² - 6x = 0.',
          answer: 'x = 0  y  x = 2'
        }
      ],
      advisoryTip: 'Lleva tu desarrollo en borrador a la asesoría de Cálculo en Teams para que el docente te indique si aplicaste correctamente las reglas de derivación.'
    }
  },

  {
    id: 'res-acad-fis-03',
    title: 'Taller de Física Mecánica y Análisis Vectorial',
    description: 'Cinemática en una y dos dimensiones, leyes del movimiento de Newton, trabajo, energía y diagramas de cuerpo libre.',
    type: 'documento',
    category: 'guias_talleres',
    categoryLabel: 'Guías y talleres prácticos',
    status: 'Disponible',
    placeholderNotice: 'Taller práctico con problemas tipo examen',
    videoTitle: 'Taller aplicado de Física Mecánica',
    academicContent: {
      objective: 'Modelar situaciones físicas reales mediante cinemática escalar/vectorial, aplicar la segunda ley de Newton con diagramas de cuerpo libre y utilizar el principio de conservación de la energía mecánica.',
      topics: [
        'Cinemática en 1D: Movimiento Rectilíneo Uniforme (MRU) y Uniformemente Acelerado (MRUA)',
        'Dinámica newtoniana: Diagramas de Cuerpo Libre (DCL), fuerzas de fricción y planos inclinados',
        'Trabajo, potencia y Teorema del Trabajo y la Energía Cinética (Wneto = ΔK)',
        'Conservación de la energía mecánica en sistemas conservativos y no conservativos'
      ],
      formulas: [
        { name: 'Posición MRUA', formula: 'x(t) = x₀ + v₀·t + ½·a·t²', note: 'Aceleración constante en línea recta' },
        { name: 'Velocidad en función de la posición', formula: 'v² = v₀² + 2·a·Δx', note: 'Permite resolver cinemática sin conocer el tiempo' },
        { name: 'Segunda Ley de Newton', formula: 'Σ F = m · a', note: 'Ecuación vectorial descompuesta en ejes x e y' },
        { name: 'Fuerza de Fricción Cinética', formula: 'f_k = μ_k · N', note: 'Donde N es la fuerza normal perpendicular a la superficie' },
        { name: 'Energía Mecánica Total', formula: 'E_mec = K + U = ½·m·v² + m·g·h', note: 'Se conserva si no actúan fuerzas disipativas' }
      ],
      solvedExercises: [
        {
          title: 'Problema de Frenado y Distancia de Detención (MRUA)',
          problem: 'Un vehículo que se desplaza a 72 km/h frena de manera uniforme hasta detenerse por completo en 4 segundos. Hallar su desaceleración y la distancia recorrida durante el frenado.',
          steps: [
            { stepTitle: 'Convertir unidades al Sistema Internacional (SI)', stepDetail: 'v₀ = 72 km/h · (1000 m / 1 km) · (1 h / 3600 s) = 20 m/s. Velocidad final v = 0 m/s.' },
            { stepTitle: 'Calcular la aceleración con la ecuación de velocidad', stepDetail: 'v = v₀ + a·t ⟹ 0 = 20 + a·(4) ⟹ a = -20 / 4 = -5 m/s².' },
            { stepTitle: 'Calcular la distancia recorrida con la ecuación de posición', stepDetail: 'Δx = v₀·t + ½·a·t² = (20)(4) + ½(-5)(4)² = 80 - 40 = 40 m.' }
          ],
          answer: 'a = -5 m/s² (desaceleración) y distancia recorrida Δx = 40 metros',
          pedagogicalTip: 'Siempre transforma las velocidades a metros por segundo (m/s) antes de operar con el tiempo en segundos para evitar incongruencias dimensionales.'
        },
        {
          title: 'Bloque en Plano Inclinado con Segunda Ley de Newton',
          problem: 'Un bloque de masa m = 5 kg desciende por un plano inclinado a 30° sin fricción. Determinar la aceleración del bloque (tomar g = 9.8 m/s²).',
          steps: [
            { stepTitle: 'Establecer el sistema de coordenadas alineado al plano', stepDetail: 'Eje x paralelo a la pendiente (hacia abajo). Eje y perpendicular a la superficie.' },
            { stepTitle: 'Descomponer la fuerza de gravedad (peso W = mg)', stepDetail: 'W_x = m·g·sen(30°), W_y = m·g·cos(30°).' },
            { stepTitle: 'Aplicar la segunda ley de Newton en el eje x', stepDetail: 'Σ F_x = m·a_x ⟹ m·g·sen(30°) = m·a_x.' },
            { stepTitle: 'Simplificar la masa m y calcular la aceleración', stepDetail: 'a_x = g·sen(30°) = (9.8 m/s²)(0.5) = 4.9 m/s².' }
          ],
          answer: 'a = 4.9 m/s²',
          pedagogicalTip: 'Observa que en ausencia de fricción, la aceleración no depende de la masa del objeto, únicamente del ángulo del plano y de la gravedad.'
        }
      ],
      practiceExercises: [
        {
          problem: 'Un cuerpo cae libremente desde el reposo desde una altura de 45 m. ¿Cuánto tarda en tocar el suelo? (g = 9.8 m/s²)',
          hint: 'Usa h = ½·g·t² con v₀ = 0.',
          answer: 't ≈ 3.03 s'
        },
        {
          problem: '¿Qué fuerza neta horizontal se requiere para acelerar una caja de 12 kg a razón de 2.5 m/s²?',
          hint: 'Aplica directamente F = m · a.',
          answer: 'F = 30 N'
        },
        {
          problem: 'Calcular el trabajo realizado por una fuerza de 50 N que arrastra un trineo 10 m en la dirección del movimiento.',
          hint: 'W = F · d · cos(0°).',
          answer: 'W = 500 Joules (J)'
        }
      ],
      advisoryTip: 'Lleva tu diagrama de cuerpo libre (DCL) dibujado a mano a la asesoría de Física. Es la mejor herramienta visual para que el asesor detecte cualquier fuerza faltante.'
    }
  },

  {
    id: 'res-acad-est-04',
    title: 'Guía Práctica de Estadística Descriptiva y Probabilidad',
    description: 'Construcción e interpretación de tablas de frecuencias, diagramas de dispersión, medidas de tendencia central y probabilidad básica.',
    type: 'guia',
    category: 'guias_talleres',
    categoryLabel: 'Guías y talleres prácticos',
    status: 'Disponible',
    placeholderNotice: 'Guía práctica para análisis de datos',
    videoTitle: 'Estadística Descriptiva y Análisis de Datos',
    academicContent: {
      objective: 'Organizar e interpretar conjuntos de datos muestrales y poblacionales mediante tablas de frecuencias, gráficos estadísticos y el cálculo riguroso de medidas de tendencia central y dispersión.',
      topics: [
        'Tipos de variables: cuantitativas (discretas, continuas) y cualitativas (nominales, ordinales)',
        'Medidas de tendencia central: Media aritmética (x̄), Mediana (Me) y Moda (Mo)',
        'Medidas de dispersión: Varianza muestral (s²), Desviación estándar (s) y Coeficiente de Variación (CV)',
        'Conceptos elementales de probabilidad: regla de Laplace y eventos mutuamente excluyentes'
      ],
      formulas: [
        { name: 'Media Muestral', formula: 'x̄ = ( Σ x_i ) / n', note: 'Suma de todos los datos dividida entre el tamaño de la muestra n' },
        { name: 'Varianza Muestral', formula: 's² = Σ (x_i - x̄)² / (n - 1)', note: 'Se divide entre n - 1 (grados de libertad) para corregir el sesgo muestral' },
        { name: 'Desviación Estándar', formula: 's = √( s² )', note: 'Mide la dispersión media en las mismas unidades de la variable' },
        { name: 'Coeficiente de Variación', formula: 'CV = (s / x̄) · 100%', note: 'Mide la dispersión relativa y homogeneidad del conjunto de datos' },
        { name: 'Regla Clásica de Laplace', formula: 'P(A) = Casos Favorables / Casos Posibles', note: 'Aplica en espacios muestrales equiprobables' }
      ],
      solvedExercises: [
        {
          title: 'Cálculo Completo de Medidas de Resumen Estadístico',
          problem: 'Se registra el tiempo en minutos que 6 estudiantes tardaron en completar una prueba virtual de Territorio TdeA: 12, 15, 18, 15, 20, 16. Calcular la media, la mediana y la varianza muestral.',
          steps: [
            { stepTitle: 'Calcular la Media Aritmética (x̄)', stepDetail: 'x̄ = (12 + 15 + 18 + 15 + 20 + 16) / 6 = 96 / 6 = 16.0 minutos.' },
            { stepTitle: 'Ordenar los datos para hallar la Mediana (Me)', stepDetail: 'Datos ordenados: 12, 15, [15, 16], 18, 20. Al ser n = 6 (par), promediamos los dos datos centrales: Me = (15 + 16) / 2 = 15.5 minutos.' },
            { stepTitle: 'Calcular las desviaciones al cuadrado (x_i - x̄)²', stepDetail: '(12-16)² = 16; (15-16)² = 1; (18-16)² = 4; (15-16)² = 1; (20-16)² = 16; (16-16)² = 0. Suma = 16 + 1 + 4 + 1 + 16 + 0 = 38.' },
            { stepTitle: 'Calcular la Varianza muestral s²', stepDetail: 's² = 38 / (6 - 1) = 38 / 5 = 7.6 minutos².' }
          ],
          answer: 'Media = 16.0 min | Mediana = 15.5 min | Moda = 15 min | Varianza muestral = 7.6 min² (s ≈ 2.76 min)',
          pedagogicalTip: 'Para datos muestrales siempre debes dividir entre (n - 1) y no entre n, garantizando el estimador insesgado de la varianza.'
        }
      ],
      practiceExercises: [
        {
          problem: 'En un grupo de datos: 4, 8, 6, 5, 3, 8, 9, ¿cuál es el valor de la mediana?',
          hint: 'Ordena primero los 7 datos de menor a mayor y toma el dato central en la posición 4.',
          answer: 'Me = 6'
        },
        {
          problem: 'Si un conjunto tiene media x̄ = 40 y desviación estándar s = 8, calcular su coeficiente de variación (CV).',
          hint: 'Aplica CV = (s / x̄) · 100%.',
          answer: 'CV = 20%'
        },
        {
          problem: 'Al lanzar un dado legal de 6 caras, ¿cuál es la probabilidad de obtener un número primo?',
          hint: 'Los números primos entre 1 y 6 son: 2, 3 y 5 (3 casos favorables de 6 posibles).',
          answer: 'P = 3/6 = 0.5 (50%)'
        }
      ],
      advisoryTip: 'Lleva tus tablas de datos a la asesoría de Estadística para verificar que tus frecuencias absolutas y relativas acumulen el 100% correctamente.'
    }
  },

  {
    id: 'res-acad-leng-05',
    title: 'Guía de Comprensión y Producción Textual (Lengua Materna)',
    description: 'Estructuración de textos académicos, argumentación, normas de citación institucional APA y corrección ortográfica.',
    type: 'documento',
    category: 'guias_talleres',
    categoryLabel: 'Guías y talleres prácticos',
    status: 'Disponible',
    placeholderNotice: 'Guía oficial de escritura académica',
    videoTitle: 'Redacción y producción textual académica',
    academicContent: {
      objective: 'Fortalecer las habilidades de argumentación escrita, redacción de ensayos académicos y aplicación correcta de normas de citación APA 7ma edición en trabajos de investigación.',
      topics: [
        'Estructura del ensayo argumentativo: tesis, cuerpo argumentativo, contraargumentación y conclusión',
        'Normas APA 7ma edición: citas textuales cortas, citas en bloque y referencias bibliográficas',
        'Conectores lógicos textuales: de causa, consecuencia, contraste y cierre',
        'Reglas de acentuación diacrítica y ortografía puntual institucional'
      ],
      formulas: [
        { name: 'Estructura Canónica del Ensayo', formula: 'Introducción (Tesis) + Desarrollo (3-4 Argumentos) + Conclusión (Síntesis)', note: 'La tesis debe ser una afirmación debatible' },
        { name: 'Cita Textual Corta (< 40 palabras)', formula: '"Texto citado" (Apellido, Año, p. XX)', note: 'Se incorpora dentro del mismo párrafo entre comillas' },
        { name: 'Cita Textual Larga (≥ 40 palabras)', formula: 'Párrafo independiente con sangría de 1.27 cm, sin comillas', note: 'Interlineado doble y tamaño de fuente regular' },
        { name: 'Referencia Libro Impreso', formula: 'Apellido, Inicial. (Año). Título del libro en cursiva. Editorial.', note: 'Formato estándar de lista de referencias APA 7ma ed.' }
      ],
      solvedExercises: [
        {
          title: 'Corrección y Modelado de Cita en Formato APA 7ma Edición',
          problem: 'Un estudiante cita el libro "Metodología de la Investigación" de Roberto Hernández Sampieri publicado en 2018, página 45. Corregir y redactar la cita parentética y narrativa.',
          steps: [
            { stepTitle: 'Formular Cita Parentética (énfasis en el texto)', stepDetail: '"La investigación científica es sistemática y empírica" (Hernández Sampieri, 2018, p. 45).' },
            { stepTitle: 'Formular Cita Narrativa (énfasis en el autor)', stepDetail: 'Según Hernández Sampieri (2018), "la investigación científica es sistemática y empírica" (p. 45).' },
            { stepTitle: 'Construir la entrada de la lista de referencias', stepDetail: 'Hernández Sampieri, R. (2018). Metodología de la investigación: Las rutas cuantitativa, cualitativa y mixta. McGraw-Hill Education.' }
          ],
          answer: 'Cita correctamente formulada en las dos variantes oficiales de APA 7ma edición.',
          pedagogicalTip: 'Siempre verifica que cada cita en el texto tenga su correspondiente entrada en la lista final de referencias.'
        }
      ],
      practiceExercises: [
        {
          problem: '¿Qué conector textual es el más adecuado para contraponer dos ideas?: ¿"Por consiguiente", "No obstante" o "Además"?',
          hint: 'Busca el conector de naturaleza adversativa o de contraste.',
          answer: '"No obstante"'
        },
        {
          problem: 'Identificar la palabra con tilde diacrítica correcta: "Él vino a la asesoría" vs "El vino a la asesoría".',
          hint: '"Él" lleva tilde cuando funciona como pronombre personal de tercera persona.',
          answer: '"Él vino a la asesoría"'
        }
      ],
      advisoryTip: 'Lleva el borrador de tu ensayo o informe de laboratorio a la asesoría de Lengua Materna para recibir sugerencias de cohesión y coherencia.'
    }
  },

  {
    id: 'res-acad-bio-06',
    title: 'Guía Conceptual de Biología y Bioquímica Básica',
    description: 'Estructura celular, funciones de biomoléculas esenciales (carbohidratos, lípidos, proteínas) y procesos bioenergéticos.',
    type: 'guia',
    category: 'guias_talleres',
    categoryLabel: 'Guías y talleres prácticos',
    status: 'Disponible',
    placeholderNotice: 'Guía conceptual disponible',
    videoTitle: 'Conceptos clave de Biología para Ciencias Básicas',
    academicContent: {
      objective: 'Comprender los principios fundamentales de la organización biológica celular y las rutas metabólicas de respiración y fotosíntesis.',
      topics: [
        'Diferencias entre células procariotas y eucariotas (animal y vegetal)',
        'Estructura y función de las cuatro biomoléculas esenciales',
        'Membrana plasmática, transporte pasivo (ósmosis) y transporte activo',
        'Bioenergética celular: glucólisis, ciclo de Krebs y síntesis de ATP'
      ],
      formulas: [
        { name: 'Ecuación General de la Respiración Celular', formula: 'C₆H₁₂O₆ + 6 O₂  ➔  6 CO₂ + 6 H₂O + ~36 ATP', note: 'Catabolismo oxidativo de la glucosa' },
        { name: 'Ecuación General de la Fotosíntesis', formula: '6 CO₂ + 6 H₂O + Luz solar  ➔  C₆H₁₂O₆ + 6 O₂', note: 'Fijación de carbono en organismos autótrofos' }
      ],
      solvedExercises: [
        {
          title: 'Identificación de Procesos de Transporte Celular',
          problem: 'Si un glóbulo rojo se sumerge en una solución hipertónica, describe el fenómeno osmótico que experimenta.',
          steps: [
            { stepTitle: 'Analizar la concentración de solutos', stepDetail: 'En una solución hipertónica la concentración de solutos exterior es mayor que la intracelular.' },
            { stepTitle: 'Dirección del flujo de agua', stepDetail: 'Por ósmosis, el agua se desplaza desde donde hay menor concentración de soluto hacia donde hay mayor concentración (hacia el exterior).' },
            { stepTitle: 'Efecto celular', stepDetail: 'La célula pierde volumen y se deshidrata, proceso conocido como crenación.' }
          ],
          answer: 'Crenación (deshidratación y colapso celular por pérdida osmótica de agua)',
          pedagogicalTip: 'Recuerda que en células vegetales el mismo fenómeno recibe el nombre de plasmólisis.'
        }
      ],
      practiceExercises: [
        {
          problem: '¿Qué organelo celular es el responsable principal de la síntesis de ATP en células animales?',
          hint: 'Es la central energética celular dotada de doble membrana.',
          answer: 'La Mitocondria'
        }
      ],
      advisoryTip: 'Lleva tus dudas sobre rutas metabólicas y biomoléculas a las sesiones de asesoría docente en Teams.'
    }
  },

  // =========================================================================
  // Categoría: Técnicas y métodos de estudio
  // =========================================================================
  {
    id: 'res-tec-01',
    title: 'Técnicas de Estudio y Repaso Activo para Ciencias Básicas',
    description: 'Estrategias comprobadas: método Feynman, práctica espaciada (Spaced Repetition) y formulación de mapas conceptuales para asignaturas cuantitativas.',
    type: 'guia',
    category: 'tecnicas',
    categoryLabel: 'Técnicas y métodos de estudio',
    status: 'Disponible',
    placeholderNotice: 'Metodologías comprobadas de aprendizaje activo',
    videoTitle: 'Técnicas de estudio activo y retención conceptual',
    academicContent: {
      objective: 'Adquirir técnicas metacognitivas efectivas para estudiar asignaturas cuantitativas complejas (matemáticas, física, estadística), optimizando el tiempo y consolidando la memoria a largo plazo.',
      topics: [
        'Método Feynman en 4 pasos: explicar un concepto técnico con lenguaje simple y sin tecnicismos',
        'Práctica Espaciada (Spaced Repetition) vs. Sesiones maratónicas de estudio antes del examen',
        'Técnica Pomodoro 50/10 adaptada a problemas de cálculo y física',
        'Formulación de mapas conceptuales y fichas de fórmulas con aplicaciones'
      ],
      formulas: [
        { name: 'Ciclo del Método Feynman', formula: 'Elegir concepto ➔ Explicar a un niño ➔ Detectar lagunas ➔ Simplificar y conectar', note: 'Revela instantáneamente si realmente comprendes el tema' },
        { name: 'Intervalo Óptimo de Repaso', formula: 'Día 1 (Clase) ➔ Día 2 (Repaso 15 min) ➔ Día 4 (Taller) ➔ Día 7 (Autoevaluación)', note: 'Aplana la curva del olvido de Ebbinghaus' }
      ],
      solvedExercises: [
        {
          title: 'Aplicación Práctica del Método Feynman a un Concepto de Cálculo',
          problem: 'Explica qué es una "derivada" a una persona sin conocimientos matemáticos avanzados.',
          steps: [
            { stepTitle: 'Paso 1: Analogía de la vida cotidiana', stepDetail: 'Imagina que vas en un automóvil y miras el velocímetro. La aguja te indica qué tan rápido cambias de posición en ese segundo exacto.' },
            { stepTitle: 'Paso 2: Conexión con la definición técnica', stepDetail: 'Eso es exactamente la derivada: el velocímetro de una función. Mide la rapidez instantánea con la que cambia una variable cuando se mueve otra.' },
            { stepTitle: 'Paso 3: Verificación de comprensión', stepDetail: 'Si la gráfica de una función sube muy empinada, su derivada es grande y positiva; si está plana, su derivada es cero.' }
          ],
          answer: 'La derivada es el medidor instantáneo de cambio de cualquier fenómeno del universo.',
          pedagogicalTip: 'Si no puedes explicar un ejercicio con palabras sencillas, significa que estás memorizando pasos mecánicos sin entender el concepto de fondo.'
        }
      ],
      practiceExercises: [
        {
          problem: 'Intenta explicar con tus propias palabras la diferencia entre distancia y desplazamiento a un compañero.',
          hint: 'La distancia es el camino total recorrido; el desplazamiento es la línea recta entre el inicio y el fin.',
          answer: 'La distancia es un escalar positivo; el desplazamiento es un vector con dirección y sentido.'
        }
      ],
      advisoryTip: 'Utiliza las asesorías en Teams no sólo para que el docente resuelva el ejercicio, sino para explicarle tú mismo cómo lo resolverías y recibir validación.'
    }
  },
  {
    id: 'res-tec-02',
    title: 'Cómo preparar tus dudas antes de ingresar a la asesoría',
    description: 'Guía paso a paso para identificar bloqueos de comprensión, organizar tus ejercicios resueltos a medias y formular preguntas puntuales al docente.',
    type: 'tutorial',
    category: 'tecnicas',
    categoryLabel: 'Técnicas y métodos de estudio',
    status: 'Disponible',
    placeholderNotice: 'Guía práctica para aprovechar tu sesión',
    videoTitle: 'Preparación estratégica para asesorías académicas',
    academicContent: {
      objective: 'Optimizar el tiempo de asesoría virtual en Teams logrando que el docente te brinde explicaciones de alto impacto enfocadas exactamente en tu bloqueo de aprendizaje.',
      topics: [
        'Los 3 errores más comunes al entrar a una asesoría ("no entiendo nada", llegar sin intentar, no tener Teams listo)',
        'Estrategia de los 3 pasos previos: intentar el ejercicio, marcar el renglón del bloqueo y formular la pregunta específica',
        'Uso eficiente de Microsoft Teams: cómo compartir pantalla, usar la pizarra o enviar la foto del cuaderno por el chat'
      ],
      formulas: [
        { name: 'Fórmula de la Pregunta Eficaz', formula: 'Enunciado claro + Intento previo + Duda en el paso X', note: 'Ahorra hasta un 80% de tiempo en la sesión' }
      ],
      solvedExercises: [
        {
          title: 'Transformación de una Pregunta Vaga en una Pregunta Estratégica',
          problem: 'Caso real: El estudiante dice al docente "Profe, no entiendo la regla de la cadena".',
          steps: [
            { stepTitle: 'Paso 1: Identificar el ejercicio concreto', stepDetail: 'Seleccionar el ejercicio exacto del taller: f(x) = (3x² - 5x)⁴.' },
            { stepTitle: 'Paso 2: Mostrar el avance logrado', stepDetail: '"Profe, identifiqué que la función exterior es u⁴ y su derivada es 4u³".' },
            { stepTitle: 'Paso 3: Señalar el punto exacto de duda', stepDetail: '"Mi duda es si debo multiplicar la derivada exterior por la derivada interior antes o después de evaluar u".' }
          ],
          answer: 'El docente responde en 60 segundos con exactitud y el estudiante supera su bloqueo conceptual.',
          pedagogicalTip: 'Los asesores disfrutan mucho más guiar a estudiantes que muestran sus intentos previos.'
        }
      ],
      practiceExercises: [
        {
          problem: 'Formula por escrito tu duda principal de la materia antes de ingresar a la asesoría de hoy.',
          hint: 'Escribe: "Intenté el ejercicio X, apliqué la fórmula Y, pero en el paso Z no sé cómo continuar porque..."',
          answer: 'Estructura lista para compartir en Teams.'
        }
      ],
      advisoryTip: 'Ten listo el archivo o foto de tu ejercicio en tu computador antes de hacer clic en "Abrir Teams".'
    }
  },
  {
    id: 'res-tec-03',
    title: 'Planificación del Tiempo y Cronograma de Repaso Autónomo',
    description: 'Plantillas y métodos de organización semanal para equilibrar clases, horas de estudio individual y sesiones de asesoría en semanas de parciales.',
    type: 'documento',
    category: 'tecnicas',
    categoryLabel: 'Técnicas y métodos de estudio',
    status: 'Disponible',
    placeholderNotice: 'Cronograma semanal descargable',
    videoTitle: 'Gestión del tiempo y cronograma de estudio',
    academicContent: {
      objective: 'Distribuir equitativamente las horas de estudio autónomo por créditos académicos, asignando bloques fijos semanales para asistir a asesorías de Ciencias Básicas.',
      topics: [
        'Regla de créditos académicos: por cada hora de clase magistral, dedicar 2 horas de estudio autónomo',
        'Matriz de Eisenhower para priorizar entregas vs. preparación de exámenes parciales',
        'Cómo agendar asesorías fijas en tu calendario semanal para no estudiar a última hora'
      ],
      formulas: [
        { name: 'Cálculo de Horas de Estudio Autónomo', formula: 'Horas Autónomas Semanales = Créditos Asignatura × 2', note: 'Estándar del Ministerio de Educación Nacional' }
      ],
      solvedExercises: [
        {
          title: 'Cálculo de Carga Semanal para Cálculo Diferencial (4 créditos)',
          problem: '¿Cuántas horas de estudio independiente debe programar un estudiante para aprobar con solvencia?',
          steps: [
            { stepTitle: 'Cálculo de horas autónomas', stepDetail: '4 créditos × 2 horas autónomas = 8 horas semanales fuera del aula.' },
            { stepTitle: 'Distribución semanal recomendada', stepDetail: '2 horas de repaso conceptual + 4 horas de taller práctico + 2 horas en asesoría de Territorio TdeA.' }
          ],
          answer: '8 horas semanales organizadas en 4 bloques de 2 horas.',
          pedagogicalTip: 'Bloquear 2 horas para asesorías semanales evita que se acumulen dudas previo al parcial.'
        }
      ],
      practiceExercises: [
        {
          problem: 'Calcula cuántas horas de estudio autónomo requiere una materia de 3 créditos como Física Mecánica.',
          hint: 'Multiplica 3 créditos por 2.',
          answer: '6 horas a la semana.'
        }
      ],
      advisoryTip: 'Usa el botón "Recordatorio / Agendar" en cada asesoría del catálogo para sincronizar la alerta en tu Google Calendar.'
    }
  },

  // =========================================================================
  // Categoría: Grabaciones y clases
  // =========================================================================
  {
    id: 'res-grab-01',
    title: 'Repositorio de Grabaciones de Asesorías en Microsoft Teams',
    description: 'Canal institucional para consultar y repasar las explicaciones y ejercicios desarrollados por los docentes en las asesorías virtuales pasadas.',
    type: 'guia',
    category: 'grabaciones',
    categoryLabel: 'Grabaciones y clases',
    status: 'Disponible',
    placeholderNotice: 'Acceso directo con cuenta @correo.tdea.edu.co',
    videoTitle: 'Repositorio institucional de asesorías grabadas',
    academicContent: {
      objective: 'Instruir al estudiante en la consulta y reproducción de las grabaciones de asesorías académicas almacenadas en los canales de Microsoft Teams y OneDrive institucional del TdeA.',
      topics: [
        'Requisitos de autenticación: inicio de sesión obligatorio con @correo.tdea.edu.co',
        'Ubicación de grabaciones en Teams: Pestaña "Archivos" -> Carpeta "Recordings"',
        'Vigencia y descarga de videos para estudio sin conexión',
        'Búsqueda de marcas de tiempo por temas y ejercicios específicos'
      ],
      formulas: [
        { name: 'Ruta Oficial en Teams', formula: 'Equipo Territorio TdeA ➔ Canal Ciencias Básicas ➔ Archivos ➔ Recordings', note: 'Acceso con correo institucional de estudiante' }
      ],
      solvedExercises: [
        {
          title: 'Procedimiento para Ver una Asesoría Grabada',
          problem: 'El estudiante no pudo asistir a la asesoría de Matemáticas del martes a las 4:00 PM y desea ver la grabación.',
          steps: [
            { stepTitle: 'Paso 1', stepDetail: 'Abrir Microsoft Teams e ingresar con las credenciales @correo.tdea.edu.co.' },
            { stepTitle: 'Paso 2', stepDetail: 'Ingresar a la sala o canal correspondiente de la asesoría de Ciencias Básicas.' },
            { stepTitle: 'Paso 3', stepDetail: 'En el historial de chat de la reunión o en la pestaña "Archivos / Recordings", hacer clic sobre el video grabado.' }
          ],
          answer: 'Reproducción inmediata del video con controles de velocidad (1.25x / 1.5x).',
          pedagogicalTip: 'Aprovecha la función de velocidad 1.25x o 1.5x de Teams para repasar rápidamente los ejercicios que ya entiendes.'
        }
      ],
      practiceExercises: [
        {
          problem: '¿Qué dominio de correo es obligatorio para acceder a las grabaciones protegidas del TdeA?',
          hint: 'Es el correo institucional de estudiante del Tecnológico de Antioquia.',
          answer: '@correo.tdea.edu.co'
        }
      ],
      advisoryTip: 'Si un video no reproduce o pide permisos adicionales, escribe un correo a auxcienciasbasicas2@tdea.edu.co indicando el día y materia.'
    }
  },
  {
    id: 'res-grab-02',
    title: 'Cápsulas de Clase: Resolución de Ejercicios Típicos',
    description: 'Micro-lecciones en video de 5 a 10 minutos con docentes de Ciencias Básicas explicando los problemas de mayor frecuencia en evaluaciones.',
    type: 'video',
    category: 'grabaciones',
    categoryLabel: 'Grabaciones y clases',
    status: 'Próximamente',
    placeholderNotice: 'Cápsulas audiovisuales en producción pedagógica',
    videoTitle: 'Cápsulas conceptuales y resolución de ejercicios'
  },
  {
    id: 'res-grab-03',
    title: 'Grabaciones de Talleres de Repaso Previo a Parciales',
    description: 'Sesiones grabadas de refuerzo grupal intensivo realizadas antes de cada jornada de parciales institucionales.',
    type: 'video',
    category: 'grabaciones',
    categoryLabel: 'Grabaciones y clases',
    status: 'Próximamente',
    placeholderNotice: 'Sesiones grabadas durante el calendario de parciales',
    videoTitle: 'Talleres de refuerzo previo a evaluaciones'
  },

  // =========================================================================
  // Categoría: Campus Vital (Bienestar emocional, afrontamiento, adaptación y proyecto de vida)
  // =========================================================================
  {
    id: 'res-vital-01',
    title: 'Cápsulas de Bienestar Emocional y Gestión del Estrés',
    description: 'Micro-lecciones audiovisuales con profesionales de Bienestar Institucional orientadas al equilibrio emocional, autorregulación y manejo de la ansiedad académica.',
    type: 'video',
    category: 'campus_vital',
    categoryLabel: 'Bienestar emocional',
    status: 'Próximamente',
    placeholderNotice: 'Cápsulas audiovisuales en producción pedagógica',
    videoTitle: 'Bienestar emocional y autorregulación'
  },
  {
    id: 'res-vital-02',
    title: 'Grabaciones de Talleres: Afrontamiento Universitario',
    description: 'Sesiones de orientación y refuerzo grupal para fortalecer la resiliencia estudiantil, superar la frustración y afrontar los desafíos de la formación profesional.',
    type: 'video',
    category: 'campus_vital',
    categoryLabel: 'Afrontamiento universitario',
    status: 'Próximamente',
    placeholderNotice: 'Sesiones grabadas y talleres programados',
    videoTitle: 'Afrontamiento universitario y resiliencia'
  },
  {
    id: 'res-vital-03',
    title: 'Talleres de Adaptación Universitaria y Hábitos Académicos',
    description: 'Estrategias prácticas para una adecuada transición a la vida universitaria, organización del tiempo, métodos de estudio y vinculación al entorno TdeA.',
    type: 'video',
    category: 'campus_vital',
    categoryLabel: 'Adaptación universitaria',
    status: 'Próximamente',
    placeholderNotice: 'Talleres y materiales en producción pedagógica',
    videoTitle: 'Adaptación a la vida universitaria'
  },
  {
    id: 'res-vital-04',
    title: 'Talleres de Proyecto de Vida y Orientación Vocacional',
    description: 'Guías y sesiones participativas para la clarificación de metas profesionales, toma de decisiones, proyección personal y permanencia académica.',
    type: 'documento',
    category: 'campus_vital',
    categoryLabel: 'Proyecto de vida',
    status: 'Próximamente',
    placeholderNotice: 'Guías y talleres en producción pedagógica',
    videoTitle: 'Proyecto de vida y proyección estudiantil'
  }
];

/**
 * Obtiene recursos filtrados por categoría
 */
export function getResourcesByCategory(categoryId) {
  if (!categoryId || categoryId === 'all') {
    return RESOURCES_DATA;
  }
  return RESOURCES_DATA.filter(r => r.category === categoryId);
}

/**
 * Obtiene un recurso por su identificador
 */
export function getResourceById(id) {
  return RESOURCES_DATA.find(r => r.id === id);
}

/**
 * Obtiene múltiples recursos por sus identificadores
 */
export function getResourcesByIds(ids = []) {
  return ids.map(id => getResourceById(id)).filter(Boolean);
}
