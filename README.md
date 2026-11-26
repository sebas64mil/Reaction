# 🏀 Reaction Hoops — Plataforma Web & Analítica VR

> **Proyecto de Grado / Tesis de Grado**  
> **Universidad de San Buenaventura - Sede Bogotá**  
> **Objetivo de Investigación**: Evaluación y mejora de la capacidad de reacción en jugadores universitarios de baloncesto mediante una experiencia inmersiva en Realidad Virtual con **Meta Quest 3**.

---

## 👥 Integrantes del Proyecto

| Nombre | Rol en el Proyecto | Perfil / Portafolio |
| :--- | :--- | :--- |
| **Sebastian Villamil** | Desarrollo Web / UX / VR | [serbew.games](https://www.serbew.games) |
| **Katherine Guayazan** | Artista 3D y Diseñadora UI | [Behance](https://www.behance.net/swnoswift) |
| **Miguel Guerrero** | Desarrollador VR & Environment Artist | [Instagram](https://www.instagram.com/miguel_guerrero.01) |
| **Juan Sierra** | Desarrollo Web | [Instagram](https://www.instagram.com/juan_diego2804) |

---

## 🎯 1. Planteamiento y Propósito de la Tesis

En el baloncesto competitivo, fracciones de segundo determinan la efectividad de un pase, un desmarque o una intercepción defensiva. Tradicionalmente, la velocidad de reacción y la toma de decisiones se entrenan mediante métodos analógicos (conos, silbatos, luces físicas) que son difíciles de estandarizar y cuantificar de forma objetiva.

### La Solución: Reaction Hoops
Este proyecto de tesis propone una **herramienta tecnológica integral** compuesta por:

1. **Entorno VR Calibrado (Meta Quest 3 + Unity)**: Los jugadores universitarios se sumergen en una cancha virtual donde ejecutan protocolos estandarizados de estímulo-respuesta con demandas visuales, auditivas y motrices reales.
2. **Plataforma Web de Analítica (Esta Aplicación)**: Captura la telemetría de cada sesión en la nube para que entrenadores, preparadores físicos y evaluadores puedan analizar métricas objetivas (tiempos de respuesta en milisegundos, precisión de pases, control de bote y cadencia).

---

## ⚙️ 2. Arquitectura del Sistema y Flujo de Datos

`	ext
 ┌────────────────────────────────────────────────────────┐
 │            VISOR VR: META QUEST 3                      │
 │  - Motor: Unity 3D (C#)                                │
 │  - Tracking 6DoF de cabeza y mandos Touch Plus         │
 │  - Protocolos de prueba: Luces, Pases, Dribble y Mov.  │
 └──────────────────────────┬─────────────────────────────┘
                            │
                            │  1. Telemetría por sesión (ms, aciertos, fallos)
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │           BASE DE DATOS: CLOUD FIRESTORE               │
 │  - Colección /players: Identidad y código universitario│
 │  - Colección /sessions: Historial de rondas evaluadas  │
 │  - Colección /exercises: Catálogo de pruebas           │
 └──────────────────────────┬─────────────────────────────┘
                            │
                            │  2. Sincronización en tiempo real (SDK v12)
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │          PLATAFORMA WEB: REACTION HOOPS               │
 │  - Frontend: React 19 + Vite                           │
 │  - Render 3D: Three.js (Landing Page)                  │
 │  - Analítica: Chart.js (Curvas de aprendizaje)         │
 └────────────────────────────────────────────────────────┘
`

### Comunicación entre Componentes Web
- **Modules/firebase.service.js**: Actúa como la capa de abstracción de datos. Expone la clase FirestoreService que centraliza las consultas asíncronas de atletas y sesiones hacia Firestore.
- **src/Components/Page/Dashboard.jsx**: Es el componente contenedor de analítica. Gestiona el estado reactivo (selectedPlayer, ctiveExercise, sessionList), filtrando los datos del atleta y delegando la renderización visual a los módulos de gráficos.
- **src/Components/Graficos/**: Subcomponentes modulares especializados (MovementCharts, LightsCharts, PassesCharts, DribbleCharts, ExerciseHistoricalChart) que transforman los registros brutos en gráficos de radar, barras, dispersión y líneas temporales mediante **Chart.js**.
- **src/Components/Sections/Landing/LandingBasketball.jsx**: Módulo desacoplado de renderizado que monta un viewport interactivo con **Three.js** para visualizar en 3D el balón oficial del proyecto (asketball.glb).

---

## 📁 3. Organización del Código

`	ext
Reaction/
├── Modules/                         # Capa de integración y servicios en la nube
│   ├── firebase_init.js            # Inicialización de Firebase con variables de entorno
│   └── firebase.service.js         # Métodos de negocio para Firestore (Jugadores, Sesiones)
├── public/                          # Archivos estáticos directos
├── src/
│   ├── assets/                      # Recursos multimedia del proyecto
│   │   ├── Fonts/                  # Fuentes tipográficas (College, etc.)
│   │   ├── Img/                    # Fotos del equipo, evidencias de laboratorio
│   │   └── modelo/                 # Modelo 3D (basketball.glb)
│   ├── Components/                  # Arquitectura de componentes React
│   │   ├── Graficos/               # Visualizaciones estadísticas con Chart.js
│   │   │   ├── DribbleCharts.jsx               # Control de balón
│   │   │   ├── ExerciseHistoricalChart.jsx     # Evolución temporal
│   │   │   ├── GeneralHistorySection.jsx       # Resumen general
│   │   │   ├── LightsCharts.jsx                # Luces de reacción (ms)
│   │   │   ├── MovementCharts.jsx              # Desplazamiento y agilidad
│   │   │   └── PassesCharts.jsx                # Precisión y velocidad de pase
│   │   ├── Page/                   # Vistas principales (Routing)
│   │   │   ├── Landing.jsx                     # Página principal institucional
│   │   │   ├── About.jsx                       # Marco teórico y metodología
│   │   │   ├── Dashboard.jsx                   # Analítica y registro de jugadores
│   │   │   └── ExerciseDetail.jsx              # Ficha técnica de cada ejercicio VR
│   │   ├── Sections/               # Secciones específicas por página (About, Dashboard, Landing)
│   │   └── Ui/                     # Componentes atómicos reutilizables (Botones, Modales, Cards, Nav)
│   ├── hooks/                       # Hooks personalizados (useScrollReveal, etc.)
│   ├── Styles/                      # Arquitectura CSS modular y Sistema de Diseño (SystemDesign.css)
│   ├── App.jsx                      # Configuración de rutas (HashRouter)
│   └── main.jsx                     # Punto de entrada de la aplicación
├── .env.example                     # Plantilla pública de variables de entorno
├── .gitignore                       # Configuración de exclusión segura de Git
├── package.json                     # Definición de dependencias
├── vite.config.js                   # Configuración del bundler Vite
└── README.md                        # Documentación principal
`

---

## 🔬 4. Pruebas VR Implementadas

El sistema evalúa cuatro dimensiones motrices y perceptuales en los deportistas:

1. **Luces de Reacción (lights)**: Estímulos perimétricos aleatorios en el campo visual del atleta; mide el tiempo de respuesta en milisegundos desde la aparición del estímulo hasta el impacto.
2. **Sistema de Pases (passes)**: Detección de receptores dinámicos y cálculo de la precisión del pase y velocidad de decisión.
3. **Control y Dribble (dribble)**: Evaluación de la consistencia del bote bajo distractores visuales simulados.
4. **Desplazamiento y Movilidad (movement)**: Coordinación de cambios de dirección y agilidad lateral sobre la cancha virtual.

---

## 🛠️ 5. Tecnologías Utilizadas

- **Visor VR**: Meta Quest 3 (Standalone)
- **Motor de Desarrollo VR**: Unity 3D / C#
- **Frontend Web**: React 19, Vite 8
- **Base de Datos**: Cloud Firestore (Firebase SDK v12)
- **Visualización Gráfica**: Chart.js, react-chartjs-2
- **Gráficos 3D Web**: Three.js
- **Enrutamiento**: React Router DOM (HashRouter)
- **Despliegue y Hosting**: Vercel

---

## 🚀 6. Instalación y Ejecución Local

1. **Clonar el repositorio**:
   `ash
   git clone https://github.com/sebas64mil/Reaction.git
   cd Reaction
   `

2. **Instalar dependencias**:
   `ash
   npm install
   `

3. **Configurar credenciales locales**:
   Copia el archivo de ejemplo:
   `ash
   cp .env.example .env
   `
   Configura tus variables en .env:
   `env
   VITE_FIREBASE_API_KEY=tu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
   VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   VITE_FIREBASE_APP_ID=tu_app_id
   `

4. **Iniciar el servidor de desarrollo**:
   `ash
   npm run dev
   `

5. **Compilar para producción**:
   `ash
   npm run build
   `

---

## ⏳ 7. Estado del Proyecto & Próximas Entregas (Roadmap)

> **Nota para evaluadores y visitantes**:  
> La arquitectura técnica y la conexión con la base de datos ya se encuentran 100% operativas. Durante las próximas semanas se estará completando la capa de contenidos y divulgación del proyecto:

- [ ] **Material Audiovisual Real**: Incorporación de videos demostrativos que muestran a los jugadores universitarios interactuando con las **Meta Quest 3** en las sesiones de prueba.
- [ ] **Galería Fotográfica de Campo**: Fotografías en alta resolución del proceso de validación en la universidad, preparación de atletas y equipo de trabajo.
- [ ] **Textos Académicos Definitivos**: Redacción formal del marco metodológico, muestra evaluada, hipótesis y conclusiones estadísticas dentro de la sección *About*.
- [ ] **Exportación de Reportes**: Generación de informes consolidados de rendimiento por atleta para el cuerpo técnico.

---

## 🎓 Universidad de San Buenaventura - Bogotá
**Facultad de Ingeniería / Trabajo de Grado**  
Bogotá D.C., Colombia
