import { request } from "../util/api.js";
import DocumentItem from "./DocumentItem.js";

export default function DocumentList({ $target, initialState = [], onSelectDocument }) {
  const $documentList = document.createElement("div");
  const $ul = document.createElement("ul");

  $documentList.classList.add("document-list");
  $target.appendChild($documentList);

  this.state = initialState;

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    $documentList.appendChild($ul);
    $ul.innerHTML = "";
    this.state.map((doc) => {
      new DocumentItem({
        $target: $ul,
        initialState: doc,
        onSelectDocument,
      });
    });
  };

  this.render();

  const fetchGetDocuments = async () => {
    const documents = await request("/documents");
    this.setState(documents);
  };

  fetchGetDocuments();
}
