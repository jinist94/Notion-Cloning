import { createElement } from 'util/helper.js';

export default function MenuButton({ $target, className, iconClass, onClickButton }) {
  const $button = createElement('button', className);
  $target.appendChild($button);

  this.render = () => {
    $button.innerHTML = `<i class="${iconClass}"></i>`;
  };

  $button.addEventListener('click', onClickButton);
  this.render();
}
