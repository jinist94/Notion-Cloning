export default function DocumentItem({ $target, initialState, onSelectDocument }) {
  this.state = initialState;

  const $document = document.createElement("li");
  $document.classList.add("document-item");

  $target.appendChild($document);

  this.setState = (nextState) => {
    this.state = nextState;
    console.log(this.state, "RootState");
    this.render();
  };

  this.render = () => {
    $document.innerHTML = "";
    $document.dataset.id = this.state.id;

    $document.innerHTML = `
        <div class="document-item-inner">
            <span>${this.state.title}</span>
            <button class="addBtn"> + </button>
            <button class="removeBtn"> 삭제 </button>
            
        </div>
    `;

    if (this.state.documents && this.state.documents.length > 0) {
      const $ul = document.createElement("ul");
      $document.appendChild($ul);

      this.state.documents.map((doc) => {
        new DocumentItem({ $target: $ul, initialState: doc, onSelectDocument });
      });
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
        onAdd();
      } else {
        onSelectDocument(this.state);
      }
    }
  });
}
