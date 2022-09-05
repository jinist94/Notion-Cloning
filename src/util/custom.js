const DOCUMENT_CHANGE_TITLE = 'change-title';
const REMOVE_CHILD_DOCUMENT = 'remove-child-document';

export const on = {
  changeTitle(callback) {
    window.addEventListener(DOCUMENT_CHANGE_TITLE, (e) => {
      callback();
    });
  },
  removeChild(callback) {
    window.addEventListener(REMOVE_CHILD_DOCUMENT, (e) => {
      const { id } = e.detail;
      callback(id);
    });
  },
};

export const emit = {
  changeTitle() {
    window.dispatchEvent(new CustomEvent(DOCUMENT_CHANGE_TITLE));
  },
  removeChild(id) {
    window.dispatchEvent(
      new CustomEvent(REMOVE_CHILD_DOCUMENT, {
        detail: { id },
      })
    );
  },
};
