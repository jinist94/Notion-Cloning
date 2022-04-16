const DOCUMENT_CHANGE_TITLE = "change-title";

export const inItchangeTitle = (callback) => {
  window.addEventListener(DOCUMENT_CHANGE_TITLE, (e) => {
    const { text } = e.detail;

    callback();
    // url을 변경하고 route를 호출함으로써 페이지를 다시 그린다.
  });
};

export const changeTitle = (text) => {
  window.dispatchEvent(
    new CustomEvent(DOCUMENT_CHANGE_TITLE, {
      detail: {
        text,
      },
    })
  );
};
