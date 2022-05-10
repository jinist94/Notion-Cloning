import { createElement } from "../util/helper.js";

export default function PostHeader({ $target, title }) {
  const $header = createElement("div", "post__header");
  $target.appendChild($header);

  this.render = () => {
    $header.innerHTML = `
        <h3>📑 ${title}님의 Notion</h3>
    `;
  };

  this.render();
}
