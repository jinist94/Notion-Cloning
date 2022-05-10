import { createElement } from "../util/helper.js";

export default function MenuButton({ $target, className, iconClass, onButtonClick }) {
  const $button = createElement("button", className);
  $target.appendChild($button);

  this.render = () => {
    $button.innerHTML = `<i class="${iconClass}"></i>`;
  };

  $button.addEventListener("click", onButtonClick);
  this.render();
}
