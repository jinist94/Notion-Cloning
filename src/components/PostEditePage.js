import Editor from "./Editor.js";
import { fetchEditDocument } from "../util/api.js";
import { changeTitle } from "../util/custom.js";
import { debounce } from "../util/util.js";
import MenuButton from "./MenuButton.js";
import { createElement, removeClass } from "../util/helper.js";

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
    onClickButton: () => {
      const $sidebar = document.querySelector(".sidebar");
      removeClass($sidebar, "hide");
      removeClass($container, "hide");
    },
  });

  const editor = new Editor({
    $target: $container,
    initialState,
    onEditContent: (document) => {
      debounce(async () => {
        await fetchEditDocument(document);
      }, 1000);
    },
    onEditTitle: (document) => {
      debounce(async () => {
        await fetchEditDocument(document);
        changeTitle();
      }, 300);
    }
  });
}
