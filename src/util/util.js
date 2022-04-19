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

export const EditorShortcut = (text) => {
  let tag;
  if (/^#\s/.test(text)) {
    // #
    tag = document.createElement("h1");
    tag.innerText = text.substring(1);
    return tag;
  } else if (/^##\s/.test(text)) {
    // ##
    tag = document.createElement("h2");
    tag.innerText = text.substring(2);
    return tag;
  } else if (/^###\s/.test(text)) {
    // ###
    tag = document.createElement("h3");
    tag.innerText = text.substring(3);
    return tag;
  } else {
    return false;
  }
};

const returnSearchList = (documents, keyword, list) => {
  documents.forEach((doc) => {
    if (doc.title.startsWith(keyword)) {
      list.push(doc);
    }
    if (doc.documents.length !== 0) {
      search(doc.documents, keyword, list);
    }
  });
};

export const searchDocuments = (documents, keyword) => {
  let list = [];

  returnSearchList(documents, keyword, list);

  return list;
};
