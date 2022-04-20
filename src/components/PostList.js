import { push } from "../util/router.js";
import { addOpenListId, getItem, OPEN_LIST, removeOpenListId, SELECTED_DOCUMENT, setItem } from "../util/storage.js";
import { createElement, findDocumentId } from "../util/util.js";

export default function PostList({ $target, initialState, onAdd, onRemove, onSelect }) {
  this.state = initialState;

  const $document = createElement("ul");
  $target.appendChild($document);

  let openList = getItem(OPEN_LIST, null);

  this.setState = (nextState) => {
    if (nextState) {
      this.state = nextState;
    }

    openList = getItem(OPEN_LIST, null);

    this.render();
  };

  this.render = () => {
    $document.innerHTML = "";
    $document.innerHTML = createPost(this.state, 1);
  };

  const createPost = (documents, depth) => {
    const MAX_DEPTH = 5;
    const POST_PADDING = depth * 10;

    const selected = getItem(SELECTED_DOCUMENT, null);

    return `
    ${documents
      .map(({ id, title, documents }) => {
        const isOpen = (openList && openList[id]) || false;

        return `<li class="post__item" data-id="${id}">
          <div class="item__content ${selected && selected.id == id ? "selected" : ""}"
          style="padding-left:${depth === MAX_DEPTH ? POST_PADDING + 10 : POST_PADDING}px">
            ${depth < MAX_DEPTH ? `<button class="item__button--toggle"> ${isOpen ? "▼" : "▶"}</button> ` : ""}
            <div class="item__title">${title ? title : "제목 없음"}</div>
            <div class="item__buttons">
              <button class="item__button--remove"><i class="fa-solid fa-trash-can"></i> </button>
              ${depth < MAX_DEPTH ? `<button class="item__button--add"><i class="fa-solid fa-plus"></i></button> ` : ""}
            </div>
          </div>
          ${
            isOpen
              ? documents.length > 0
                ? `<ul>${createPost(documents, depth + 1)}</ul>`
                : `<ul><li class="empty-post-message"> <span>하위 페이지가 없습니다</span></li> <ul>`
              : ""
          }
          </li>
         `;
      })
      .join("")}
    `;
  };

  this.render();

  $document.addEventListener("click", async (e) => {
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
          openList && openList[documentId] ? removeOpenListId(documentId) : addOpenListId(documentId);
          this.setState();
          break;

        default:
          onSelect(documentId);
      }
    }
  });
}
