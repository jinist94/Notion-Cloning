import { push } from "../util/router.js";

export default function Editor({ $target, initialState, onEditing }) {
  const $editor = document.createElement("div");

  $target.appendChild($editor);
  $editor.classList.add("editor");

  this.state = initialState;
  this.setState = (nextState) => {
    this.state = nextState;
    console.log(this.state, "Editor this.state");
    this.render();
  };

  $editor.innerHTML = `
  <input class="editor-title" name="title" type="text" placeholder="제목을 입력해주세요.">
  <div class="editor-content" name="content" contentEditable placeholder="텍스트를 입력해주세요."></div>
  `;

  this.render = () => {
    if (this.state && this.state.id) {
      const { title, content } = this.state;

      $editor.querySelector("[name=title]").value = title;
      $editor.querySelector("[name=content]").innerHTML = content ? content : "";

      if (this.state.documents) {
        const $childDocuments = document.createElement("div");
        $childDocuments.innerHTML = this.state.documents
          .map((doc) => `<div data-id=${doc.id} class="child-document-link">${doc.title}</div>`)
          .join("");
        $editor.querySelector("[name=content]").appendChild($childDocuments);
      }
    }
  };

  this.render();

  $editor.querySelector("[name=title]").addEventListener("keyup", (e) => {
    console.log(e.target.value);
    const { target } = e;
    const nextState = {
      ...this.state,
      title: target.value,
    };

    onEditing(nextState);
  });

  $editor.querySelector("[name=content]").addEventListener("input", (e) => {
    const { target } = e;
    const nextState = {
      ...this.state,
      content: target.innerHTML,
    };

    onEditing(nextState);
  });

  $editor.querySelector("[name=content]").addEventListener("click", (e) => {
    const { target } = e;
    if (e.target.matches(".child-document-link")) {
      const documentId = target.dataset.id;
      push(`/documents/${documentId}`);
    }
  });
}
