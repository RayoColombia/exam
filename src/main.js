// src/main.js
// Orquestación: carga del JSON, montaje de la UI y wiring de eventos.

import { createInitialState, clearAnswers } from './state.js';
import { mountLanding, showQuiz, renderQuestions, handleSubmit, updateProgressUI } from './render.js';

// Ruta del JSON (puedes cambiarla por un endpoint o versión CDN)
const DATA_URL = './data/sudamericana-trivia-v1.json';

let appState = null;

const init = async () => {
  const data = await fetch(DATA_URL).then(r => {
    if (!r.ok) throw new Error('No se pudo cargar el archivo JSON de preguntas.');
    return r.json();
  });

  appState = createInitialState(data);

  // Montar landing con textos del JSON
  mountLanding(appState);

  // Acciones del landing
  document.getElementById('start-btn').addEventListener('click', () => {
    showQuiz();
    renderQuestions(appState);
  });

  // Botón enviar/calificar
  const submitBtn = document.getElementById('submit-btn');
  submitBtn.textContent = appState.ui.submitCTA || 'Obtener calificación';
  submitBtn.addEventListener('click', () => handleSubmit(appState));

  // Reinicio del simulacro
  document.getElementById('restart-btn').addEventListener('click', () => {
    clearAnswers(appState);
    // Mostrar nuevamente el quiz desde cero
    document.getElementById('results-section').hidden = true;
    document.getElementById('landing').hidden = false;
    // Reset visual del progreso
    updateProgressUI(appState);
    // Limpieza de mensajes
    const live = document.getElementById('validation-live');
    if (live) live.textContent = '';
  });
};

// Arranque
init().catch(err => {
  console.error(err);
  const app = document.getElementById('app');
  const msg = document.createElement('p');
  msg.textContent = 'Hubo un error al cargar el simulacro. Revisa la consola para más detalles.';
  app.appendChild(msg);
});
