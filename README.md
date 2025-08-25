# Simulacro Académico – Landing Page

Este proyecto implementa una **landing page modular** para simulacros académicos con preguntas de selección múltiple, cargadas dinámicamente desde un archivo **JSON**. Al finalizar, el usuario obtiene su **calificación** y una **retroalimentación detallada** de sus respuestas.

## Características

- Carga dinámica desde JSON de preguntas, opciones, retroalimentación y textos de la interfaz.  
- Selección múltiple de única respuesta con validación obligatoria.  
- Retroalimentación posterior a la revisión final, con explicación de la opción elegida y de la correcta.  
- Diseño responsivo y accesible, pensado en mobile-first, con uso de atributos `aria-live` y navegación por teclado.  
- Progreso en tiempo real mediante contador y barra visual.  
- Demo incluida con una trivia de la **Copa Sudamericana** de 5 preguntas.  

## Estructura del proyecto
/ (raíz)
├─ index.html # Landing y contenedor principal
├─ styles.css # Estilos base (simple y moderno)
├─ /data
│ └─ sudamericana-trivia-v1.json # Preguntas de ejemplo
└─ /src
├─ main.js # Orquestación y eventos
├─ render.js # Renderizado de UI
├─ state.js # Estado global y lógica de calificación
└─ utils.js # Funciones auxiliares (DOM, scroll, validación)

## Requisitos

- Navegador moderno compatible con **ES Modules**.  
- Servidor local o GitHub Pages (no funciona abriendo el `index.html` directo por CORS al leer JSON).  

   
