export const findDocumentId = () => {
  const { pathname } = window.location;
  if (pathname.indexOf("/documents/") === 0) {
    const [, , documentId] = pathname.split("/");
    return documentId;
  } else {
    return null;
  }
};

export const compareName = (name, text) => {
  if(name === text){
    return true;
  }
  return false;
}

const shortcutMap = [
  { regex: /^#\s/, tagName: "h1" },
  { regex: /^##\s/, tagName: "h2" },
  { regex: /^###\s/, tagName: "h3" },
];

export const EditorShortcut = (text) => {
  let tag;

  // text.indexOf("# ")사용 시 버벅임 발생

  const shortcut = shortcutMap.find((item) => item.regex.test(text));

  if (shortcut) {
    const remove = text.length - 1;
    tag = document.createElement(shortcut.tagName);
    tag.innerText = text.substring(remove);

    return tag;
  } else {
    return false;
  }
};

let timeout;

export function debounce(callback, limit = 1000) {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    callback();
    timeout = null;
  }, limit);
}
