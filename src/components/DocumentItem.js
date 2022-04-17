import { push } from "../util/router.js";
import { getItem, setItem } from "../util/storage.js";
import { createElement, findDocumentId } from "../util/util.js";

export default function DocumentItem({ $target, initialState, onAdd, onRemove }) {
  this.state = initialState;

  const $document = createElement("li", "document-item");
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

    $document.innerHTML = `
        <div class="document-item-inner">
            <button class="toggleBtn"> ${isOpen ? "▼" : "▶"}</button>
            <span>${this.state.title ? this.state.title : "제목 없음"}</span>
            <button class="addBtn"> + </button>
            <button class="removeBtn"> 삭제 </button>
        </div>
    `;
    if (isOpen) {
      if (this.state.documents && this.state.documents.length > 0) {
        const $ul = createElement("ul");
        $document.appendChild($ul);

        this.state.documents.map((doc) => {
          new DocumentItem({ $target: $ul, initialState: doc, onAdd, onRemove });
        });
      } else {
        const $ul = createElement("ul");
        $document.appendChild($ul);
        $ul.innerHTML = `<li>하위 페이지가 없습니다</li>`;
      }

      isOpen = true;
    }
  };

  this.render();

  $document.addEventListener("click", async (e) => {
    e.stopPropagation();

    const { target } = e;
    const $li = target.closest(".document-item");

    if ($li) {
      const documentId = $li.dataset.id;

      if (target.matches(".removeBtn")) {
        removeOpenId(openData);
        const paramId = findDocumentId();

        if (documentId === paramId) {
          push("/");
        }
        onRemove(documentId);
      } else if (target.matches(".addBtn")) {
        addOpenId(openData);
        onAdd(documentId);
      } else if (target.matches(".toggleBtn")) {
        isOpen = !isOpen;
        this.setState();
      } else {
        push(`/documents/${documentId}`);
      }
    }
  });
}
