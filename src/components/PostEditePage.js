import Editor from "./Editor.js";
import { fetchEditDocument } from "../util/api.js";
import { changeTitle } from "../util/custom.js";
import { createElement } from "../util/util.js";

export default function PostEditePage({ $target, initialState }) {
  const $container = createElement("div", "editor-container");

  $target.appendChild($container);

  this.state = initialState;

  this.setState = (nextState) => {
    this.state = nextState;
    editor.setState(nextState);
  };

  let timer = null;

  const editor = new Editor({
    $target: $container,
    initialState,
    onEditing: (document) => {
      if (timer !== null) {
        clearTimeout(timer);
      }

      timer = setTimeout(async () => {
        await fetchEditDocument(document);
        changeTitle(document.title);
      }, 1000);
    },
  });
}
