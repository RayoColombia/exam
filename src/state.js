// src/state.js
// Estado global mínimo y funciones puras para mutarlo.
// Mantener el estado centralizado facilita pruebas y escalabilidad.

export const createInitialState = (examData) => ({
  exam: examData.exam,
  ui: examData.ui,
  questions: examData.questions,
  // answers: { [questionId]: optionKey }
  answers: {},
  submitted: false,
  score: null // { correct: number, total: number, percentage: number }
});

export const setAnswer = (state, questionId, optionKey) => {
  state.answers[questionId] = optionKey;
};

export const clearAnswers = (state) => {
  state.answers = {};
  state.submitted = false;
  state.score = null;
};

export const isAllAnswered = (state) => {
  const total = state.questions.length;
  return Object.keys(state.answers).length === total;
};

export const computeScore = (state) => {
  const total = state.questions.length;
  let correct = 0;

  for (const q of state.questions) {
    const chosenKey = state.answers[q.id];
    const chosenOpt = q.options.find(o => o.key === chosenKey);
    if (chosenOpt?.isCorrect) correct++;
  }

  const percentage = Math.round((correct / total) * 100);
  state.score = { correct, total, percentage };
  state.submitted = true;
};
