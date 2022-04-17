export const createElement = (tagName, className = "") => {
  const element = document.createElement(tagName);

  if (className) {
    element.classList.add(className);
  }

  return element;
};

export const $ = (selector) => document.querySelector(selector);

export const findDocumentId = () => {
  const { pathname } = window.location;
  if (pathname.indexOf("/documents/") === 0) {
    const [, , documentId] = pathname.split("/");
    return documentId;
  } else {
    return null;
  }
};
