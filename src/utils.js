// src/utils.js
// Utilitarios DOM y de interacción.

export const el = (tag, props = {}, children = []) => {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') {
      node.addEventListener(k.substring(2).toLowerCase(), v);
    } else if (v !== undefined && v !== null) {
      node.setAttribute(k, v);
    }
  });
  (Array.isArray(children) ? children : [children]).forEach(c => {
    if (c instanceof Node) node.appendChild(c);
    else if (typeof c === 'string') node.appendChild(document.createTextNode(c));
  });
  return node;
};

export const smoothScrollIntoView = (element) => {
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export const firstMissingQuestionCard = (container) => {
  return container.querySelector('.question-card[data-missing="true"]') ||
         container.querySelector('.question-card:not([data-answered="true"])');
};

export const setLiveError = (text) => {
  const live = document.getElementById('validation-live');
  if (live) live.textContent = text;
};

export const updateProgressBar = (percent) => {
  const fill = document.getElementById('progress-fill');
  const counter = document.getElementById('progress-counter');
  if (fill) fill.style.width = `${percent}%`;
  if (counter) counter.textContent = counter.getAttribute('data-counter-text') || counter.textContent;
};

export const computeProgress = (answeredCount, total) => {
  return total === 0 ? 0 : Math.round((answeredCount / total) * 100);
};
