export default function AddDocumentButton({ $target, addRootDocument }) {
  const $button = document.createElement("button");
  $target.appendChild($button);
  console.log($target);

  $button.innerHTML = "새 페이지 추가";

  $button.addEventListener("click", addRootDocument);
}
