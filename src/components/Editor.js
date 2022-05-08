import { push } from "../util/router.js";
import { createElement, EditorShortcut } from "../util/util.js";
export default function Editor({ $target, initialState, onEditContent, onEditTitle }) {
  const $editor = createElement("div", "editor");

  $target.appendChild($editor);

  this.state = initialState;
  this.setState = (nextState, isRender = true) => {
    if (this.state.id && nextState.id) {
      // 이전 state와 nextState 둘 다 id가 있는 상태라면
      // innerHtml과 event를 다시 만들지 않는다.
      this.state = nextState;
      isRender && this.render();

      return;
    }

    this.state = nextState;

    if (isRender) {
      this.init();
      this.render();
    }
  };

  this.init = () => {
    $editor.innerHTML = `
    ${
      this.state.id
        ? `<input class="editor__title" name="title" type="text" placeholder="제목 없음">
          <div class="editor__content" name="content" contentEditable placeholder="텍스트를 입력해주세요."></div>
          <div class="editor__child-documents"></div> 
          `
        : ""
    }
    `;

    if (this.state && this.state.id) {
      this.setEvent();
    }

    this.render();
  };

  this.render = () => {
    const $input = $editor.querySelector(".editor__title");
    const $content = $editor.querySelector(".editor__content");

    if (this.state && this.state.id) {
      const { title, content } = this.state;

      $input.value = title;
      $content.innerHTML = content ? content : `<div><br></div>`;

      if (this.state.documents) {
        const $childDocuments = $editor.querySelector(".editor__child-documents");
        $childDocuments.innerHTML = this.state.documents
          .map(
            (doc) =>
              `<div data-id=${doc.id} class="editor__child-document" contentEditable="false">
                <i class="fa-solid fa-file-lines"></i>
                <span>${doc.title ? doc.title : "제목 없음"}</span>
              </div>`
          )
          .join("");
        $editor.appendChild($childDocuments);
      }
    }

    if ($input && !this.state.title) {
      $input.focus();
    }
  };

  this.setEvent = () => {
    const $title = $editor.querySelector(".editor__title");
    const $content = $editor.querySelector(".editor__content");
    const $childDocuments = $editor.querySelector(".editor__child-documents");

    $title.addEventListener("keyup", (e) => {
      const { target } = e;
      const nextState = {
        ...this.state,
        title: target.value,
      };

      this.setState(nextState, false);
      onEditTitle(nextState);
    });

    $content.addEventListener("keyup", (e) => {
      const selection = window.getSelection();
      const node = selection.anchorNode;
      const parentNode = node.parentNode;
      const text = node.textContent;

      const nextState = {
        ...this.state,
        content: e.target.innerHTML,
      };

      if (e.isComposing) {
        onEditContent(nextState);
        return;
      }

      const newTag = EditorShortcut(text);
      if (parentNode.nodeName === "DIV") {
        if (newTag) {
          newTag.innerHTML = "<br>";

          e.preventDefault();

          parentNode.innerHTML = "";
          parentNode.appendChild(newTag);

          selection.selectAllChildren(newTag);
          selection.collapseToStart();
        }
      }

      this.setState(nextState, false);
      onEditContent(nextState);
    });

    $childDocuments.addEventListener("click", (e) => {
      const { target } = e;
      const clickElement = target.closest(".editor__child-document");

      if (clickElement) {
        const documentId = clickElement.dataset.id;
        push(`/documents/${documentId}`);
      }
    });
  };

  this.init();
}
