const DOCUMENT_CHANGE_TITLE = "change-title";

export const watchTitleChange = (callback) => {
  window.addEventListener(DOCUMENT_CHANGE_TITLE, (e) => {
    callback();
  });
};

export const changeTitle = () => {
  window.dispatchEvent(new CustomEvent(DOCUMENT_CHANGE_TITLE));
};
