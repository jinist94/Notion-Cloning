import { push } from "../util/router.js";
import { getItem, setItem } from "../util/storage.js";

export default function DocumentItem({ $target, initialState, onAdd, onRemove }) {
  this.state = initialState;

  let openData = getItem("Notion", null);

  const $document = document.createElement("li");
  $document.classList.add("document-item");

  $target.appendChild($document);

  let isOpen = openData[this.state.id] || false;

  this.setState = (nextState) => {
    if (nextState) {
      this.state = nextState;
      console.log(this.state, "RootState");
    }

    if (isOpen) {
      setItem("Notion", { ...openData, [this.state.id]: true });
      openData = getItem("Notion", null);
    } else {
      delete open[this.state.id];
      setItem("Notion", openData);
      openData = getItem("Notion", null);
    }
    this.render();
  };

  const onToggle = () => {
    isOpen = !isOpen;
    console.log(isOpen);
    this.setState();
  };

  this.render = () => {
    $document.innerHTML = "";
    $document.dataset.id = this.state.id;

    $document.innerHTML = `
        <div class="document-item-inner">
            <button class="toggleBtn"> ${isOpen ? "▼" : "▶"}</button>
            <span>${this.state.title}</span>
            <button class="addBtn"> + </button>
            <button class="removeBtn"> 삭제 </button>
            
        </div>
    `;
    if (openData[this.state.id]) {
      if (this.state.documents && this.state.documents.length > 0) {
        const $ul = document.createElement("ul");
        $document.appendChild($ul);

        this.state.documents.map((doc) => {
          new DocumentItem({ $target: $ul, initialState: doc, onAdd, onRemove });
        });
      } else {
        const $ul = document.createElement("ul");
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
        onRemove(documentId);
      } else if (target.matches(".addBtn")) {
        isOpen = true;
        onAdd(documentId);
      } else if (target.matches(".toggleBtn")) {
        onToggle();
      } else {
        push(`/documents/${documentId}`);
      }
    }
  });
}
