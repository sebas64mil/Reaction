# 🏀 Reaction Hoops — Plataforma Web & Analítica VR

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black&style=for-the-badge" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white&style=for-the-badge" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=black&style=for-the-badge" alt="Firebase Firestore" />
  <img src="https://img.shields.io/badge/Unity-VR_Engine-black?logo=unity&logoColor=white&style=for-the-badge" alt="Unity" />
  <img src="https://img.shields.io/badge/Meta_Quest_3-Immersive-0082FB?logo=meta&logoColor=white&style=for-the-badge" alt="Meta Quest 3" />
  <img src="https://img.shields.io/badge/Chart.js-Visualizations-FF6384?logo=chartdotjs&logoColor=white&style=for-the-badge" alt="Chart.js" />
  <img src="https://img.shields.io/badge/Three.js-3D_Viewport-black?logo=threedotjs&logoColor=white&style=for-the-badge" alt="Three.js" />
</p>

> **Proyecto de Grado / Trabajo de Tesis**  
> **Universidad de San Buenaventura - Sede Bogotá**  
> **Línea de Investigación**: Evaluación y optimización de la velocidad de reacción y toma de decisiones en deportistas universitarios de baloncesto mediante entornos virtuales inmersivos con **Meta Quest 3**.

---

## 👥 Equipo de Investigación y Desarrollo

| Integrante | Rol Principal | Enlace Profesional |
| :--- | :--- | :--- |
| **Sebastian Villamil** | Desarrollo Web / UX / VR | [serbew.games](https://www.serbew.games) |
| **Katherine Guayazan** | Artista 3D y Diseñadora UI | [Behance](https://www.behance.net/swnoswift) |
| **Miguel Guerrero** | Desarrollador VR & Environment Artist | [Instagram](https://www.instagram.com/miguel_guerrero.01) |
| **Juan Sierra** | Desarrollo Web | [Instagram](https://www.instagram.com/juan_diego2804) |

---

## 🎯 1. Planteamiento de la Tesis

En el baloncesto formativo y competitivo, la capacidad de procesar estímulos visuales y reaccionar en milésimas de segundo es fundamental para el rendimiento técnico (desmarques, pases bajo presión y transiciones defensivas). Los métodos analógicos tradicionales carecen de estandarización y no permiten medir con precisión milimétrica la evolución motriz del atleta.

**Reaction Hoops** integra una experiencia inmersiva con visores **Meta Quest 3** y un **Dashboard Web de Telemetría** para:
- Estandarizar pruebas perceptivo-motrices bajo condiciones de laboratorio idénticas.
- Capturar tiempos de reacción en milisegundos y porcentajes de precisión.
- Proporcionar a entrenadores y evaluadores curvas de aprendizaje objetivas y comparativas entre jugadores universitarios.

---

## 📐 2. Arquitectura del Ecosistema (Diagrama Interactivo)

El ecosistema opera mediante una arquitectura desacoplada conectada a través de la nube:

`mermaid
flowchart TD
    subgraph VR ["🥽 Entorno Virtual (Meta Quest 3)"]
        Unity["Unity 3D Engine (C#)"]
        Track["Tracking 6DoF de Cabeza y Mandos"]
        Pruebas["Protocolos de Evaluación: Luces, Pases, Dribble y Movilidad"]
        Unity --> Track --> Pruebas
    end

    subgraph Cloud ["☁️ Cloud Backend (Firebase / Google Cloud)"]
        Firestore[("Cloud Firestore")]
        ColPlayers["Colección /players (Perfiles de Atletas)"]
        ColSessions["Colección /sessions (Tiempos de Reacción en ms)"]
        Firestore --- ColPlayers
        Firestore --- ColSessions
    end

    subgraph WebApp ["💻 Plataforma Web de Analítica (React 19 + Vite)"]
        Service["Modules/firebase.service.js"]
        Dashboard["Dashboard Principal (Dashboard.jsx)"]
        Charts["Módulos Estadísticos (Chart.js)"]
        ThreeModel["Visor 3D Interactivo (Three.js)"]
        
        Service --> Dashboard
        Dashboard --> Charts
    end

    Pruebas == 1. Registro de telemetría por sesión ==> Firestore
    Firestore == 2. Sincronización en tiempo real ==> Service
`

---

## 🔄 3. Comunicación entre Componentes Web

El flujo interno de datos en la aplicación web desacopla la obtención de datos de su representación gráfica:

`mermaid
flowchart LR
    subgraph DataLayer ["Capa de Datos"]
        DB[("Cloud Firestore")]
        FService["FirestoreService (Modules)"]
        DB <--> FService
    end

    subgraph Container ["Componente Contenedor"]
        Dash["Dashboard.jsx (Manejo de Estado)"]
        FService --> Dash
    end

    subgraph Visualizers ["Capa de Gráficos (Chart.js)"]
        L["LightsCharts.jsx (Tiempos de Reacción en ms)"]
        P["PassesCharts.jsx (Precisión y Decisiones)"]
        D["DribbleCharts.jsx (Control de Balón)"]
        M["MovementCharts.jsx (Agilidad Lateral)"]
        H["ExerciseHistoricalChart.jsx (Curva de Progreso)"]
    end

    Dash --> L
    Dash --> P
    Dash --> D
    Dash --> M
    Dash --> H
`

- **FirestoreService**: Centraliza todas las consultas asíncronas hacia Firestore, abstrayendo a los componentes de UI de la lógica de red y autenticación.
- **Dashboard.jsx**: Administra el estado reactivo (selectedPlayer, sessionList, ctiveExercise) y orquesta el filtrado temporal por rondas.
- **Módulos de Gráficos**: Componentes atómicos especializados que transforman las métricas en diagramas de radar, barras, dispersión y líneas continuas.
- **LandingBasketball.jsx**: Componente 3D autónomo basado en **Three.js** que carga y renderiza interactivamente el modelo asketball.glb.

---

## 🔬 4. Dimensiones Evaluadas en el Entorno VR

`mermaid
mindmap
  root((Reaction Hoops VR))
    Luces de Reacción
      Estímulos perimétricos aleatorios
      Medición en milisegundos (ms)
      Atención dividida
    Sistema de Pases
      Identificación de receptores libres
      Cálculo de trayectoria y velocidad
      Precisión en toma de decisiones
    Control y Dribble
      Cadencia de bote
      Resistencia a distractores visuales
      Coordinación ojo-mano
    Movilidad y Agilidad
      Desplazamientos laterales
      Cambios de dirección rápidos
      Coordinación espacial 6DoF
`

---

## 📁 5. Estructura de Directorios

<details>
<summary><b>Haz clic aquí para desplegar la estructura de carpetas</b></summary>

`	ext
Reaction/
├── Modules/                         # Servicios de integración
│   ├── firebase_init.js            # Inicialización de Firebase con variables de entorno
│   └── firebase.service.js         # API de persistencia y consultas a Firestore
├── public/                          # Recursos estáticos servidos directamente
├── src/
│   ├── assets/                      # Multimedia del proyecto
│   │   ├── Fonts/                  # Fuentes tipográficas (College, etc.)
│   │   ├── Img/                    # Fotos del equipo y evidencias de laboratorio
│   │   └── modelo/                 # Modelo 3D (basketball.glb)
│   ├── Components/                  # Componentes de la interfaz
│   │   ├── Graficos/               # Visualizaciones con Chart.js
│   │   │   ├── DribbleCharts.jsx
│   │   │   ├── ExerciseHistoricalChart.jsx
│   │   │   ├── GeneralHistorySection.jsx
│   │   │   ├── LightsCharts.jsx
│   │   │   ├── MovementCharts.jsx
│   │   │   └── PassesCharts.jsx
│   │   ├── Page/                   # Vistas principales (Routing)
│   │   │   ├── About.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ExerciseDetail.jsx
│   │   │   └── Landing.jsx
│   │   ├── Sections/               # Secciones específicas por página (About, Dashboard, Landing)
│   │   └── Ui/                     # Componentes atómicos reutilizables (Botones, Modales, Cards)
│   ├── hooks/                       # Custom hooks de React (useScrollReveal)
│   ├── Styles/                      # CSS modular y Sistema de Diseño (SystemDesign.css)
│   ├── App.jsx                      # Configuración de rutas (HashRouter)
│   └── main.jsx                     # Punto de entrada de la aplicación
├── .env.example                     # Plantilla de variables de entorno
├── .gitignore                       # Exclusiones de seguridad para Git
├── package.json                     # Dependencias del proyecto
├── vite.config.js                   # Configuración del bundler Vite
└── README.md                        # Documentación principal
`

</details>

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

3. **Configurar variables de entorno**:
   `ash
   cp .env.example .env
   `
   *Configura tus credenciales de Firebase en .env (el archivo está protegido por .gitignore y no se subirá a Git).*

4. **Ejecutar en desarrollo**:
   `ash
   npm run dev
   `

5. **Compilar para producción**:
   `ash
   npm run build
   `

---

## ⏳ 7. Estado del Proyecto & Hoja de Ruta (Roadmap de la Tesis)

> [!NOTE]
> La arquitectura de software, la base de datos y la conexión con el entorno VR se encuentran **100% implementadas y operativas**. Durante las siguientes semanas se estará finalizando la capa de divulgación y validación experimental:

- [ ] **Material Audiovisual**: Integración de videos demostrativos de deportistas universitarios ejecutando las pruebas con los visores **Meta Quest 3**.
- [ ] **Galería Fotográfica Oficial**: Registro fotográfico de alta resolución de las sesiones de captura en laboratorio y campo.
- [ ] **Redacción del Marco Teórico y Metodológico**: Redacción y pulido de los textos definitivos de la tesis en la sección *About* (muestra evaluada, metodología, hipótesis y resultados estadísticos).
- [ ] **Módulo de Reportes**: Exportación de informes individuales y comparativos de rendimiento en PDF/CSV.

---

<p align="center">
  <b>Universidad de San Buenaventura - Sede Bogotá</b><br />
  Facultad de Ingeniería — Trabajo de Grado 2026
</p>
