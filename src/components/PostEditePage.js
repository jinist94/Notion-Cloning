import Editor from "./Editor.js";
import { fetchEditDocument } from "../util/api.js";
import { changeTitle } from "../util/custom.js";
import { createElement, debounce } from "../util/util.js";
import MenuButton from "./MenuButton.js";

export default function PostEditePage({ $target, initialState }) {
  const $container = createElement("div", "editor__container");

  $target.appendChild($container);

  this.state = initialState;

  this.setState = (nextState) => {
    this.state = nextState;
    editor.setState(nextState);
  };

  new MenuButton({
    $target: $container,
    className: "menu__button-open",
    iconClass: "fa-solid fa-align-left",
    onButtonClick: () => {
      const $sidebar = document.querySelector(".sidebar");
      $sidebar.classList.remove("hide");
      $container.classList.remove("hide");
    },
  });

  const editor = new Editor({
    $target: $container,
    initialState,
    onEditing: (document) => {
      debounce(async () => {
        await fetchEditDocument(document);
        changeTitle();
      }, 1000);
    },
  });
}
