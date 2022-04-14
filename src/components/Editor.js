export default function Editor({ $target, initialState, onEditing }) {
  const $editor = document.createElement("div");

  $target.appendChild($editor);
  $editor.classList.add("editor");

  this.state = initialState;
  this.setState = (nextState) => {
    console.log(nextState, "Editor nextState");
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    const { title, content } = this.state;

    $editor.innerHTML = `
      <input class="editor-title" name="title" type="text" placeholder="제목을 입력해주세요." value="${title}">
      <textarea class="editor-content" name="content" placeholder="텍스트를 입력해주세요.">${content ? content : ""}</textarea>
    `;
  };

  this.render();

  $editor.addEventListener("keyup", (e) => {
    const { target } = e;

    const name = target.getAttribute("name");
    if (this.state[name] !== undefined) {
      const nextState = {
        ...this.state,
        [name]: target.value,
      };

      onEditing(nextState);
    }
  });
}
