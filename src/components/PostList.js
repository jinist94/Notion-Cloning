import { push } from "../util/router.js";
import { addOpenListId, getItem, OPEN_LIST, removeOpenListId, SELECTED_DOCUMENT, setItem } from "../util/storage.js";
import { findDocumentId } from "../util/util.js";
import { createElement } from "../util/helper.js";

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

  const toggleBtn = (isOpen) => {
    return `<button class="item__button--toggle"> ${isOpen ? "▼" : "▶"}</button>`;
  }

  const AddDocumentBtn = () => {
    return '<button class="item__button--add"><i class="fa-solid fa-plus"></i></button>';
  }

  const childDocuments = (documents, depth) => {
    if(documents.length > 0){
      return `<ul>${createPost(documents, depth + 1)}</ul>`;
    } 
    
    return  `<ul><li class="empty-post-message"> <span>하위 페이지가 없습니다</span></li> <ul>`;
  }


  const createPost = (documents, depth) => {
    const MAX_DEPTH = 5;
    const POST_PADDING = depth * 10;

    const selected = getItem(SELECTED_DOCUMENT, null);

    return `
    ${documents
      .map(({ id, title, documents }) => {
        const isOpen = (openList && openList[id]) || false;
        const paddingLeft = depth === MAX_DEPTH ? POST_PADDING + 10 : POST_PADDING;
        const isSelected = selected && selected.id == id ? "selected" : "";
 
        return `
          <li class="post__item" data-id="${id}">
            <div class="item__content ${isSelected}" style="padding-left:${paddingLeft}px">
              ${depth < MAX_DEPTH ? toggleBtn(isOpen) : ""}
              <div class="item__title">${title ? title : "제목 없음"}</div>
              <div class="item__buttons">
                <button class="item__button--remove"><i class="fa-solid fa-trash-can"></i> </button>
                ${depth < MAX_DEPTH ? AddDocumentBtn() : ''}
              </div>
            </div>
            ${isOpen ? childDocuments(documents, depth + 1) : "" }
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
