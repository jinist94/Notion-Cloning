import { push } from "../util/router.js";
import { addOpenListId, getItem, OPEN_LIST, removeOpenListId, SELECTED_DOCUMENT, setItem } from "../util/storage.js";
import { createElement, findDocumentId } from "../util/util.js";

export default function PostList({ $target, initialState, onAdd, onRemove, onSelect }) {
  this.state = initialState;

  const $document = createElement("li", "post__item");
  $target.appendChild($document);

  let openList = getItem(OPEN_LIST, null);
  let isOpen = (openList && openList[this.state.id]) || false;

  this.setState = (nextState) => {
    if (nextState) {
      this.state = nextState;
    }

    isOpen ? addOpenListId(this.state.id) : removeOpenListId(this.state.id);

    this.render();
  };

  this.render = () => {
    const { id, title, depth, documents } = this.state;

    $document.innerHTML = "";
    $document.dataset.id = id;

    const MAX_DEPTH = 5;
    const POST_PADDING = depth * 10;

    const selected = getItem(SELECTED_DOCUMENT, null);

    $document.innerHTML = `
        <div class="item__content ${selected && selected.id == id ? "selected" : ""}"
          style="padding-left:${depth === MAX_DEPTH ? POST_PADDING + 10 : POST_PADDING}px">
            ${depth < MAX_DEPTH ? `<button class="item__button--toggle"> ${isOpen ? "▼" : "▶"}</button> ` : ""}
            <div class="item__title"><span>${title ? title : "제목 없음"}</span></div>
            <div class="item__buttons">
              <button class="item__button--remove"><i class="fa-solid fa-trash-can"></i> </button>
              ${depth < MAX_DEPTH ? `<button class="item__button--add"><i class="fa-solid fa-plus"></i></button> ` : ""}
            </div>
        </div>
    `;

    if (isOpen) {
      if (documents && documents.length > 0) {
        const $ul = createElement("ul");
        $document.appendChild($ul);

        documents.map((doc) => {
          new PostList({ $target: $ul, initialState: { ...doc, depth: depth + 1 }, onAdd, onRemove, onSelect });
        });
      } else {
        if (depth < MAX_DEPTH) {
          const $emptyMessage = createElement("div", "empty-post-message");
          $document.appendChild($emptyMessage);
          $emptyMessage.style.paddingLeft = `${POST_PADDING}px`;

          $emptyMessage.innerHTML = `<span>하위 페이지가 없습니다</span>`;
        }
      }

      isOpen = true;
    }
  };

  this.render();

  $document.addEventListener("click", async (e) => {
    e.stopPropagation();

    const clickElement = e.target.tagName === "I" ? e.target.closest("button") : e.target;
    const $li = clickElement.closest(".post__item");

    if ($li) {
      const documentId = $li.dataset.id;

      switch (clickElement.className) {
        case "item__button--remove":
          removeOpenListId(documentId);
          const paramId = findDocumentId();

          if (documentId === paramId) push("/");

          onRemove(documentId);
          break;

        case "item__button--add":
          addOpenListId(documentId);
          onAdd(documentId);
          break;

        case "item__button--toggle":
          isOpen = !isOpen;
          this.setState();
          break;

        default:
          onSelect(documentId);
      }
    }
  });
}
