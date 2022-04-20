import { createElement } from "../util/util.js";

export default function AddDocumentButton({ $target, addRootDocument }) {
  const $button = createElement("button", "post__add-button");
  $target.appendChild($button);

  $button.innerHTML = `<i class="fa-solid fa-plus"></i>페이지 추가`;

  $button.addEventListener("click", addRootDocument);
}
