export const createElement = (tagName, className = "") => {
  const element = document.createElement(tagName);

  if (className) {
    element.classList.add(className);
  }

  return element;
};

export const addClass = (element, className) => {
  element.classList.add(className);
}

export const removeClass = (element, className) => {
  element.classList.remove(className);
}