# AGENT GUIDE — Simulacro Académico (Landing JSON-driven)

## 1) Propósito del proyecto
Landing page modular para simulacros académicos. Carga preguntas desde JSON, valida que todas estén respondidas, calcula la calificación y muestra retroalimentación **solo al final** (post-revisión).

## 2) Flujo de usuario
1. Ver landing (título, subtítulo, descripción desde JSON).
2. Iniciar simulacro.
3. Responder N preguntas (3 opciones, única respuesta).
4. Enviar → Validación “todas respondidas”.
5. Mostrar resultados (puntaje) y retroalimentación por opción elegida + explicación de la correcta.

## 3) Mapa del repositorio (resumen)
- `index.html`: estructura base y contenedores.
- `styles.css`: estilos (simple, responsivo, accesible).
- `data/sudamericana-trivia-v1.json`: demo de preguntas.
- `src/state.js`: estado global + scoring/validación.
- `src/render.js`: render de landing, preguntas y resultados.
- `src/utils.js`: utilitarios DOM/scroll/aria-live.
- `src/main.js`: orquestación (carga JSON, eventos).

## 4) Contrato de datos (JSON)
Cada examen debe cumplir este contrato mínimo:
- `exam`: id, title, subtitle, description, metadata.
- `ui`: textos CTA, flags de validación y feedback.
- `questions[]`: 
  - `id`, `type` = "single_choice"
  - `question`, `category`, `difficulty`
  - `options[]`: `{ key, text, isCorrect, feedback }` (3 por pregunta)
  - `explanationCorrectAnswer`: string (se muestra al final)

Ejemplo mínimo:
{
  "exam": { "id": "demo", "title": "...", "subtitle": "...", "description": "..." },
  "ui": { "primaryCTA": "Iniciar", "submitCTA": "Obtener calificación", "requireAllAnswered": true, "showPerQuestionFeedbackOnReview": true },
  "questions": [
    {
      "id": "q1",
      "type": "single_choice",
      "question": "…",
      "options": [
        { "key": "A", "text": "…", "isCorrect": false, "feedback": "…" },
        { "key": "B", "text": "…", "isCorrect": true,  "feedback": "…" },
        { "key": "C", "text": "…", "isCorrect": false, "feedback": "…" }
      ],
      "explanationCorrectAnswer": "…"
    }
  ]
}

## 5) Invariantes importantes (no romper)
- **Feedback solo post-revisión**: no mostrar retroalimentación durante el llenado.
- **Validación estricta**: no permitir enviar si falta alguna respuesta.
- **Una sola respuesta por pregunta**.
- **Accesibilidad básica**: `aria-live` para mensajes, navegación por teclado, foco y scroll a faltantes.

## 6) Puntos de extensión (dónde tocar)
- **Temporizador**: leer `exam.timeLimitSeconds` y mostrar countdown en `render.js` (sección progreso).
- **Barajado**: antes de renderizar, barajar `questions` u `options` en `main.js`.
- **Modo práctica**: bandera `ui.mode = "practice"`; en `render.js`, si está activa, mostrar feedback inmediato tras cada `change`.
- **Persistencia**: en `state.js` exponer `save/load` a `localStorage` (clave por `exam.id`).

## 7) Criterios de aceptación (rápidos)
- Cargar JSON y pintar landing.
- No calificar si hay preguntas sin respuesta (se resaltan).
- Calcular puntaje correcto.
- En resultados: ver elección, estado Correcta/Incorrecta, feedback de la opción elegida y explicación de la correcta.
- Sin errores en consola.

## 8) Guía de estilos de código
- JS ES Modules, funciones puras en `state.js` cuando sea posible.
- Nombres semánticos: `renderQuestions`, `computeScore`, `isAllAnswered`.
- No dependencias externas para el core (estático, fácil de hostear).
- Evitar cambios de DOM innecesarios; preferir render por secciones.

## 9) Cómo ejecutar
- Servidor local (ej.: `python3 -m http.server 8080`).
- Abrir `http://localhost:8080`.
- Probar flujo completo con el JSON de demo.

## 10) Pruebas manuales rápidas
- Caso feliz: responder todas correctamente → ver 100%.
- Caso mixto: respuestas variadas → ver conteo correcto.
- Caso inválido: dejar 1 sin responder → bloqueo con scroll a faltante.
- Accesibilidad: tabular por radios, submit, leer mensaje `aria-live`.

## 11) Limitaciones conocidas
- Proyecto estático; no hay backend.
- Sin i18n dinámico (se puede agregar leyendo etiquetas desde `ui`).
- Sin analítica integrada (agregar hook en `handleSubmit`).

## 12) Checklist para nuevas contribuciones
- [ ] JSON válido contra el esquema (ver `docs/exam.schema.json`).
- [ ] Mantener 3 opciones por pregunta, 1 correcta.
- [ ] Incluir `explanationCorrectAnswer`.
- [ ] No introducir feedback durante el llenado salvo en modo práctica.
- [ ] Pasar pruebas manuales rápidas.

