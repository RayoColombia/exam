// src/render.js
// Renderizado de landing, preguntas, validación y resultados.
// Feedback solo post-revisión final (tras "Obtener calificación").

import { el, smoothScrollIntoView, setLiveError, computeProgress } from './utils.js';
import { setAnswer, isAllAnswered, computeScore } from './state.js';

export const mountLanding = (state) => {
  // Setear textos del header desde el JSON
  document.getElementById('exam-title').textContent = state.exam.title;
  document.getElementById('exam-subtitle').textContent = state.exam.subtitle;
  document.getElementById('exam-description').textContent = state.exam.description;

  const startBtn = document.getElementById('start-btn');
  startBtn.textContent = state.ui.primaryCTA || 'Iniciar';
};

export const showQuiz = () => {
  document.getElementById('progress-section').hidden = false;
  document.getElementById('questions-section').hidden = false;
  document.getElementById('actions-section').hidden = false;
  // Ocultar landing
  document.getElementById('landing').hidden = true;
};

export const renderQuestions = (state) => {
  const container = document.getElementById('questions-section');
  container.innerHTML = '';

  state.questions.forEach((q, idx) => {
    const indexLabel = `Pregunta ${idx + 1}`;
    const card = el('article', {
      class: 'question-card',
      id: `qcard-${q.id}`,
      'data-qid': q.id
    });

    // Encabezado
    const header = el('div', { class: 'question-header' }, [
      el('span', { class: 'question-index', text: indexLabel }),
      el('h3', { class: 'question-text', text: q.question })
    ]);

    // Meta (categoría y dificultad)
    const meta = el('div', { class: 'meta' },
      `${q.category ?? ''}${q.difficulty ? ' · Dificultad: ' + q.difficulty : ''}`
    );

    // Opciones (radios)
    const opts = el('div', { class: 'options', role: 'radiogroup', 'aria-label': q.question });

    q.options.forEach((opt) => {
      const inputId = `radio-${q.id}-${opt.key}`;
      const radio = el('input', {
        type: 'radio',
        id: inputId,
        name: `q-${q.id}`,
        value: opt.key,
        'aria-describedby': `qcard-${q.id}`
      });
      // Pre-selección si el usuario ya respondió (ej. al reiniciar render)
      if (state.answers[q.id] === opt.key) radio.checked = true;

      // Al cambiar, guardar respuesta y actualizar progreso
      radio.addEventListener('change', () => {
        setAnswer(state, q.id, opt.key);
        markAnsweredState(card, true);
        updateProgressUI(state);
      });

      const label = el('label', { for: inputId, class: 'option-label' }, [
        el('strong', { text: `${opt.key}. ` }),
        el('span', { class: 'option-text', text: opt.text })
      ]);

      const optionWrap = el('div', { class: 'option' }, [radio, label]);
      opts.appendChild(optionWrap);
    });

    card.appendChild(header);
    card.appendChild(meta);
    card.appendChild(opts);
    container.appendChild(card);
  });

  // Botón para ir a primera sin responder
  document.getElementById('goto-first-missing').onclick = () => {
    // Marcar temporalmente preguntas sin responder para localizarlas fácil
    tagMissingQuestions(state);
    const first = container.querySelector('.question-card[data-missing="true"]') ||
                  container.querySelector('.question-card:not([data-answered="true"])');
    if (first) smoothScrollIntoView(first);
  };

  // Estado inicial del progreso
  updateProgressUI(state);
};

export const markAnsweredState = (card, answered) => {
  if (!card) return;
  if (answered) {
    card.removeAttribute('data-missing');
    card.setAttribute('data-answered', 'true');
    card.classList.remove('card-error');
  } else {
    card.removeAttribute('data-answered');
  }
};

export const tagMissingQuestions = (state) => {
  // Marca visualmente las preguntas sin respuesta
  state.questions.forEach((q) => {
    const card = document.getElementById(`qcard-${q.id}`);
    const hasAns = !!state.answers[q.id];
    if (!hasAns) {
      card.setAttribute('data-missing', 'true');
      card.classList.add('card-error');
    } else {
      card.removeAttribute('data-missing');
      card.classList.remove('card-error');
    }
  });
};

export const updateProgressUI = (state) => {
  const total = state.questions.length;
  const answered = Object.keys(state.answers).length;
  const percent = computeProgress(answered, total);

  // Contador visible y barra
  const counter = document.getElementById('progress-counter');
  if (counter) {
    counter.textContent = `${answered}/${total}`;
    counter.setAttribute('data-counter-text', `${answered}/${total}`);
  }
  const fill = document.getElementById('progress-fill');
  if (fill) fill.style.width = `${percent}%`;
};

export const handleSubmit = (state) => {
  // Validar que todas estén respondidas
  if (!isAllAnswered(state)) {
    tagMissingQuestions(state);
    setLiveError('Debes responder todas las preguntas antes de obtener tu calificación.');
    // Desplazar a la primera faltante
    const container = document.getElementById('questions-section');
    const firstMissing = container.querySelector('.question-card[data-missing="true"]');
    if (firstMissing) smoothScrollIntoView(firstMissing);
    return;
  }

  // Calcular score y pasar a revisión final
  computeScore(state);
  renderResults(state);

  // Ocultar secciones del examen, mostrar resultados
  const progressSection = document.getElementById('progress-section');
  const questionsSection = document.getElementById('questions-section');
  const actionsSection = document.getElementById('actions-section');

  progressSection.hidden = true;
  actionsSection.hidden = true;

  // Ocultar y limpiar preguntas para que solo quede la retroalimentación visible
  questionsSection.hidden = true;
  questionsSection.innerHTML = '';

  document.getElementById('results-section').hidden = false;
};

export const renderResults = (state) => {
  // Feedback solo post-revisión final
  const results = document.getElementById('results-section');
  const scoreText = document.getElementById('score-text');
  const reviewList = document.getElementById('review-list');

  scoreText.textContent = `Puntaje: ${state.score.correct}/${state.score.total} (${state.score.percentage}%)`;
  reviewList.innerHTML = '';

  state.questions.forEach((q, idx) => {
    const chosenKey = state.answers[q.id];
    const chosenOpt = q.options.find(o => o.key === chosenKey);
    const isOk = !!chosenOpt?.isCorrect;

    const card = el('article', { class: 'review-card' });

    const header = el('div', { class: 'review-header' }, [
      el('span', { class: 'question-index', text: `Pregunta ${idx + 1}` }),
      el('strong', { text: q.question }),
      el('span', { class: `badge ${isOk ? 'ok' : 'err'}`, text: isOk ? 'Correcta' : 'Incorrecta' })
    ]);

    // Opción elegida
    const chosenP = el('p', {}, [
      el('strong', { text: 'Tu respuesta: ' }),
      `${chosenKey}. ${chosenOpt?.text ?? '(sin respuesta)'}`
    ]);

    // Feedback de la opción elegida (solo en revisión final)
    let feedback;
    if (chosenOpt?.feedback && state.ui.showPerQuestionFeedbackOnReview !== false) {
      feedback = el('p', { class: 'feedback' }, [
        el('strong', { text: 'Retroalimentación: ' }),
        chosenOpt.feedback
      ]);
    }

    // Explicación de la correcta (siempre en revisión final)
    const expl = el('p', { class: 'explanation' }, [
      el('strong', { text: 'Explicación de la respuesta correcta: ' }),
      q.explanationCorrectAnswer || '—'
    ]);

    card.appendChild(header);
    card.appendChild(chosenP);
    if (feedback) card.appendChild(feedback);
    card.appendChild(expl);
    reviewList.appendChild(card);
  });
};
