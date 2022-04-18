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
        ? `<input class="editor__title" name="title" type="text" placeholder="제목 없음">
          <div class="editor__content" name="content" contentEditable placeholder="텍스트를 입력해주세요."></div>
          <div class="editor__child-documents"></div>
          `
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

      console.log(content, "content");
      $editor.querySelector("[name=title]").value = title;
      $editor.querySelector("[name=content]").innerHTML = content ? content : `<div><br></div>`;

      if (this.state.documents) {
        const $childDocuments = $editor.querySelector(".editor__child-documents");
        console.log($childDocuments);
        $childDocuments.innerHTML = this.state.documents
          .map(
            (doc) =>
              `<div data-id=${doc.id} class="editor__child-document" contentEditable="false"><i class="fa-solid fa-file-lines"></i><span>${doc.title}</span></div>`
          )
          .join("");
        $editor.appendChild($childDocuments);
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

    $content.addEventListener("keyup", (e) => {
      const selection = window.getSelection();
      const node = selection.anchorNode;
      const parentNode = node.parentNode;
      const text = node.textContent;
      console.log(selection);

      const nextState = {
        ...this.state,
        content: e.target.innerHTML,
      };

      if (e.isComposing) {
        onEditing(nextState);
        return;
      }

      const newTag = EditorShortcut(text);
      if (parentNode.nodeName === "DIV") {
        if (newTag) {
          e.preventDefault();

          parentNode.innerHTML = "";
          parentNode.appendChild(newTag);

          selection.selectAllChildren(newTag);
          selection.collapseToEnd();
        }
      }

      onEditing(nextState);
    });

    const EditorShortcut = (text) => {
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

    $content.addEventListener("click", (e) => {
      const { target } = e;
      if (e.target.matches(".editor__child-document")) {
        const documentId = target.dataset.id;
        push(`/documents/${documentId}`);
      }
    });
  };

  this.init();
  this.render();
}
