import { push } from "../util/router.js";
import { createElement } from "../util/util.js";

export default function Editor({ $target, initialState, onEditing }) {
  const $editor = createElement("div", "editor");

  $target.appendChild($editor);

  this.state = initialState;
  this.setState = (nextState) => {
    if (this.state.id && nextState.id) {
      // 이전 state와 nextState 둘 다 id가 있는 상태라면
      // innerHtml과 event를 다시 만들지 않는다.
      this.state = nextState;
      this.render();
      return;
    }

    this.state = nextState;
    this.init();
    this.render();
  };

  this.init = () => {
    $editor.innerHTML = `
    ${
      this.state.id
        ? `<input class="editor-title" name="title" type="text" placeholder="제목 없음">
    <div class="editor-content" name="content" contentEditable placeholder="텍스트를 입력해주세요."></div>`
        : "<div>선택된 document가 없습니다</div>"
    }
    `;

    if (this.state && this.state.id) {
      this.setEvent();
    }
  };

  this.render = () => {
    if (this.state && this.state.id) {
      const { title, content } = this.state;

      console.log($editor);
      $editor.querySelector("[name=title]").value = title;
      $editor.querySelector("[name=content]").innerHTML = content ? content : "";

      if (this.state.documents) {
        const $childDocuments = createElement("div");
        $childDocuments.innerHTML = this.state.documents
          .map((doc) => `<div data-id=${doc.id} class="child-document-link">${doc.title}</div>`)
          .join("");
        $editor.querySelector("[name=content]").appendChild($childDocuments);
      }
    }
  };

  this.setEvent = () => {
    const $title = $editor.querySelector("[name=title]");
    const $content = $editor.querySelector("[name=content]");

    $title.addEventListener("keyup", (e) => {
      console.log(e.target.value, "value");
      const { target } = e;
      const nextState = {
        ...this.state,
        title: target.value,
      };

      onEditing(nextState);
    });

    $content.addEventListener("input", (e) => {
      const { target } = e;
      const nextState = {
        ...this.state,
        content: target.innerHTML,
      };

      onEditing(nextState);
    });

    $content.addEventListener("click", (e) => {
      const { target } = e;
      if (e.target.matches(".child-document-link")) {
        const documentId = target.dataset.id;
        push(`/documents/${documentId}`);
      }
    });
  };

  this.init();
  this.render();
}
