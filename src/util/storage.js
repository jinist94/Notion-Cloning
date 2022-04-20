const storage = window.localStorage;

export const SELECTED_DOCUMENT = "selected-document";
export const OPEN_LIST = "open-list";

export const getItem = (key, defaultValue) => {
  try {
    const storedValue = storage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};
export const setItem = (key, value) => {
  storage.setItem(key, JSON.stringify(value));
};

export const removeItem = (key) => {
  storage.removeItem(key);
};

export const removeOpenListId = (documentId) => {
  let list = getItem(OPEN_LIST, {});
  delete list[documentId];
  setItem(OPEN_LIST, list);
  list = getItem(OPEN_LIST, null);
  return list;
};

export const addOpenListId = (documentId) => {
  let list = getItem(OPEN_LIST, {});
  setItem(OPEN_LIST, { ...list, [documentId]: true });
  list = getItem(OPEN_LIST, null);

  return list;
};
