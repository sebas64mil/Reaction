# 🏀 Reaction Hoops — Plataforma Web de Rendimiento & Analítica VR

> **Proyecto de Grado / Tesis**  
> **Universidad de San Buenaventura - Bogotá**  
> Plataforma de visualización, analítica de datos deportivos y gestión de rendimiento conectada en tiempo real a una experiencia de Realidad Virtual (VR) para baloncesto desarrollada en Unity para **Meta Quest**.

---

## 📌 1. Descripción del Proyecto

**Reaction Hoops** es un ecosistema tecnológico diseñado para evaluar, medir y mejorar habilidades técnico-cognitivas y físicas en jugadores de baloncesto mediante **Realidad Virtual Inmersiva**.

El sistema se compone de dos frentes complementarios:
1. **Entorno VR (Meta Quest / Unity)**: Experiencia inmersiva en la que el atleta ejecuta ejercicios técnicos y cognitivos (luces de reacción, desplazamientos, control de balón y pases). Los datos de cada sesión se registran y procesan en el visor.
2. **Plataforma Web (Esta aplicación)**: Dashboard analítico y portal institucional donde atletas, entrenadores y evaluadores pueden consultar el histórico de sesiones, métricas de precisión, tiempos de reacción y evolución de cada deportista en tiempo real.

---

## 🏛️ 2. Arquitectura y Flujo de Comunicación

El flujo de información entre la experiencia de realidad virtual y la plataforma web opera mediante una arquitectura desacoplada a través de la nube:

`	ext
  ┌─────────────────────────┐
  │   Meta Quest / Unity    │
  │  (Experiencia VR Inmersiva)│
  └────────────┬────────────┘
               │  1. Envío de telemetría y métricas por sesión
               ▼
  ┌─────────────────────────┐
  │     Cloud Firestore     │
  │  (Base de Datos NoSQL)  │
  └────────────┬────────────┘
               │  2. Lectura en tiempo real / Consultas indexadas
               ▼
  ┌─────────────────────────┐
  │   Reaction Hoops Web    │
  │     (React + Vite)      │
  │                         │
  │  - Dashboard Analítico  │
  │  - Gráficos (Chart.js)  │
  │  - Visor 3D (Three.js)  │
  └─────────────────────────┘
`

### ¿Cómo se comunican los componentes en la Web?
- **Servicio Centralizado (Modules/firebase.service.js)**: Gestiona la lógica de acceso a datos para las colecciones de Firestore (players, sessions, exercises). Implementa métodos asíncronos para registrar nuevos atletas, guardar sesiones y consultar métricas históricas.
- **Enrutamiento y Vistas (src/App.jsx)**: Administrado con HashRouter para asegurar compatibilidad total en despliegues estáticos (Vercel).
  - / → **Landing Page**: Presentación del proyecto, llamados a la acción y render 3D interactivo.
  - /dashboard → **Panel Analítico**: Permite seleccionar jugadores, filtrar por fecha/sesión y renderizar comparativas de rendimiento.
  - /about → **Acerca del Proyecto**: Contextualización académica del proceso de tesis.
  - /exercises/:slug → **Detalle de Ejercicios**: Explicación técnica de cada prueba VR.
- **Capa Gráfica Modular (src/Components/Graficos/)**: Cada disciplina cuenta con su propio componente de gráficos reactivos (MovementCharts, LightsCharts, PassesCharts, DribbleCharts) que reciben los datos procesados desde Dashboard.jsx y generan visualizaciones interactivas mediante **Chart.js**.
- **Motor 3D (src/Components/Sections/Landing/LandingBasketball.jsx)**: Integra **Three.js** para cargar y animar interactivamente el modelo de baloncesto (asketball.glb), reforzando la estética inmersiva del proyecto.

---

## 📂 3. Estructura del Proyecto

`	ext
Reaction/
├── Modules/                         # Capa de integración y servicios externos
│   ├── firebase_init.js            # Inicialización segura de Firebase con variables de entorno
│   └── firebase.service.js         # API de persistencia y consultas a Firestore
├── public/                          # Archivos estáticos directos
├── src/
│   ├── assets/                      # Recursos multimedia
│   │   ├── Fonts/                  # Tipografías personalizadas (College, etc.)
│   │   ├── Img/                    # Fotografías del equipo, capturas e infografías
│   │   └── modelo/                 # Modelos 3D (basketball.glb)
│   ├── Components/                  # Componentes de la interfaz de usuario
│   │   ├── Graficos/               # Visualizaciones de datos con Chart.js
│   │   │   ├── DribbleCharts.jsx
│   │   │   ├── ExerciseHistoricalChart.jsx
│   │   │   ├── GeneralHistorySection.jsx
│   │   │   ├── LightsCharts.jsx
│   │   │   ├── MovementCharts.jsx
│   │   │   └── PassesCharts.jsx
│   │   ├── Page/                   # Vistas principales (páginas del router)
│   │   │   ├── About.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ExerciseDetail.jsx
│   │   │   └── Landing.jsx
│   │   ├── Sections/               # Secciones modulares por página
│   │   │   ├── About/              # Hero, Objetivos, Metodología, Galería
│   │   │   ├── Dashboard/          # Identidad del atleta, Registro, Resultados
│   │   │   └── Landing/            # Hero 3D, Estadísticas, Proceso, Equipo
│   │   └── Ui/                     # Componentes de UI reutilizables
│   │       ├── Button.jsx, TextInput.jsx, Navbar.jsx, Footer.jsx...
│   │       └── ChartModal.jsx, ExerciseCard.jsx, StatCard.jsx...
│   ├── hooks/                       # Custom hooks de React (useScrollReveal, etc.)
│   ├── Styles/                      # Hojas de estilo modulares y diseño global
│   │   ├── App.css
│   │   ├── SystemDesign.css        # Variables de color, espaciado y tipografía
│   │   ├── Graficos/
│   │   ├── Page/
│   │   ├── Sections/
│   │   └── Ui/
│   ├── App.jsx                      # Configuración de rutas y layout base
│   └── main.jsx                     # Punto de entrada de la aplicación React
├── .env.example                     # Plantilla de variables de entorno
├── .gitignore                       # Archivos y credenciales protegidas
├── package.json                     # Dependencias y scripts del proyecto
├── vite.config.js                   # Configuración del empaquetador Vite
└── README.md                        # Esta documentación
`

---

## 🛠️ 4. Tecnologías Principales

- **Frontend Core**: [React 19](https://react.dev/), [Vite 8](https://vitejs.dev/)
- **Visualización 3D**: [Three.js](https://threejs.org/)
- **Analítica y Gráficos**: [Chart.js](https://www.chartjs.org/), [react-chartjs-2](https://react-chartjs-2.js.org/)
- **Base de Datos & Backend**: [Cloud Firestore](https://firebase.google.com/docs/firestore), Firebase JS SDK v12
- **Enrutamiento**: [React Router DOM v7](https://reactrouter.com/)
- **Iconografía**: [React Icons](https://react-icons.github.io/react-icons/)
- **Estilos**: CSS3 modularizado con Sistema de Diseño personalizado (SystemDesign.css)
- **Despliegue Web**: [Vercel](https://vercel.com/)
- **Entorno VR**: Unity 3D / Meta Quest SDK (C#)

---

## 🚀 5. Instalación y Ejecución Local

### Prerrequisitos
- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- 
pm o gestor de paquetes de tu preferencia

### Pasos

1. **Clonar el repositorio**:
   `ash
   git clone https://github.com/sebas64mil/Reaction.git
   cd Reaction
   `

2. **Instalar dependencias**:
   `ash
   npm install
   `

3. **Configurar las variables de entorno**:
   Copia el archivo .env.example y renómbralo a .env:
   `ash
   cp .env.example .env
   `
   Rellena tus credenciales de Firebase en .env:
   `env
   VITE_FIREBASE_API_KEY=tu_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
   VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   VITE_FIREBASE_APP_ID=tu_app_id
   `

4. **Iniciar en modo desarrollo**:
   `ash
   npm run dev
   `
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

5. **Compilar para producción**:
   `ash
   npm run build
   `

---

## 📋 6. Próximos Pasos y Hoja de Ruta (Roadmap de la Tesis)

Durante las próximas semanas se estará completando la integración final del contenido del proyecto:

- [ ] **Contenido Audiovisual**: Incorporación de videos demostrativos de usuarios utilizando el visor Meta Quest durante las pruebas de campo.
- [ ] **Galería Fotográfica Oficial**: Actualización de fotos en alta resolución de las sesiones de captura, pruebas físicas y equipo de desarrollo.
- [ ] **Redacción del Marco Metodológico**: Ajuste y enriquecimiento de los textos explicativos en la sección *About* para detallar formalmente el problema de investigación, objetivos y resultados de la tesis.
- [ ] **Métricas Consolidadas**: Incorporación de filtros avanzados para exportación de datos en PDF/CSV para evaluadores académicos.

---

## 👨‍💻 Autor & Contacto

- **Juan Sebastián** — Proyecto de Grado / Tesis
- **Universidad de San Buenaventura - Sede Bogotá**
