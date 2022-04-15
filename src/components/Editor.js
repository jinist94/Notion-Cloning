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
    if (this.state && this.state.id) {
      const { title, content } = this.state;

      $editor.innerHTML = `
      <input class="editor-title" name="title" type="text" placeholder="제목을 입력해주세요.">
      <div class="editor-content" name="content" contentEditable placeholder="텍스트를 입력해주세요."></div>
      `;

      $editor.querySelector("[name=title]").value = title;
      $editor.querySelector("[name=content]").innerHTML = content ? content : "";
    }
  };

  this.render();
  if (this.state && this.state.id) {
    $editor.querySelector("[name=title]").addEventListener("keyup", (e) => {
      const { target } = e;
      const nextState = {
        ...this.state,
        title: target.value,
      };

      onEditing(nextState);
    });

    $editor.querySelector("[name=content]").addEventListener("input", (e) => {
      const { target } = e;
      const nextState = {
        ...this.state,
        content: target.innerHTML,
      };

      onEditing(nextState);
    });
  }
}
