import { push } from "../util/router.js";
import { getItem, setItem } from "../util/storage.js";
import { createElement, findDocumentId } from "../util/util.js";

export default function PostList({ $target, initialState, onAdd, onRemove, postDepth = 0, onSelect }) {
  this.state = initialState;

  postDepth += 1;

  const $document = createElement("li", "post__item");
  $target.appendChild($document);

  let openData = getItem("open-data", null);
  let isOpen = (openData && openData[this.state.id]) || false;

  const removeOpenId = (openData) => {
    delete openData[this.state.id];
    setItem("open-data", openData);
    openData = getItem("open-data", null);
  };

  const addOpenId = (openData) => {
    setItem("open-data", { ...openData, [this.state.id]: true });
    openData = getItem("open-data", null);
  };

  this.setState = (nextState) => {
    if (nextState) {
      this.state = nextState;
      console.log(this.state, "RootState");
    }

    openData = getItem("open-data", null);

    console.log(this.state.id, "thisstate");
    isOpen ? addOpenId(openData) : removeOpenId(openData);

    this.render();
  };

  this.render = () => {
    $document.innerHTML = "";
    $document.dataset.id = this.state.id;

    const MAX_DEPTH = 5;
    const POST_PADDING = postDepth * 10;

    const selected = getItem("selectedDocument", null);

    $document.innerHTML = `
        <div class="item__content ${selected.id == this.state.id ? "selected" : ""}"
          style="padding-left:${postDepth === MAX_DEPTH ? POST_PADDING + 10 : POST_PADDING}px">
            ${postDepth < MAX_DEPTH ? `<button class="item__button--toggle"> ${isOpen ? "▼" : "▶"}</button> ` : ""}
            <div class="item__title">${this.state.title ? this.state.title : "제목 없음"} </div>
            <div class="item__buttons">
              <button class="item__button--remove"><i class="fa-solid fa-trash-can"></i> </button>
              ${postDepth < MAX_DEPTH ? `<button class="item__button--add"><i class="fa-solid fa-plus"></i></button> ` : ""}
            </div>
        </div>
    `;

    if (isOpen) {
      if (this.state.documents && this.state.documents.length > 0) {
        const $ul = createElement("ul");
        $document.appendChild($ul);

        this.state.documents.map((doc) => {
          new PostList({ $target: $ul, initialState: doc, onAdd, onRemove, postDepth, onSelect });
        });
      } else {
        if (postDepth < MAX_DEPTH) {
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

    console.log(clickElement);
    if ($li) {
      const documentId = $li.dataset.id;

      if (clickElement.className === "item__button--remove") {
        removeOpenId(openData);
        const paramId = findDocumentId();

        if (documentId === paramId) {
          push("/");
        }
        onRemove(documentId);
      } else if (clickElement.className === "item__button--add") {
        addOpenId(openData);
        onAdd(documentId);
      } else if (clickElement.className === "item__button--toggle") {
        isOpen = !isOpen;
        this.setState();
      } else {
        onSelect(documentId);
      }
    }
  });
}
