import AddDocumentButton from "./AddDocumentButton.js";
import DocumentItem from "./DocumentItem.js";
import { fetchAddDocument, fetchGetDocuments, fetchRemoveDocument, fetchRootDocument } from "../util/api.js";
import { inItchangeTitle } from "../util/custom.js";
import { push } from "../util/router.js";
import { createElement } from "../util/util.js";

export default function DocumentList({ $target, initialState = [] }) {
  const $documentList = createElement("div", "document-list");
  const $ul = createElement("ul");

  $target.appendChild($documentList);
  $documentList.appendChild($ul);

  this.state = initialState;

  this.setState = async () => {
    this.state = await fetchGetDocuments();
    this.render();
  };

  this.render = () => {
    $ul.innerHTML = "";
    if (this.state.length === 0) {
      $ul.innerHTML = "<p>새로운 페이지를 추가해주세요!</p>";
      return;
    }
    this.state.map((doc) => {
      new DocumentItem({
        $target: $ul,
        initialState: doc,
        onAdd: async (documentId) => {
          await fetchAddDocument(documentId);
          push(`/documents/${documentId}`);
          this.setState();
        },
        onRemove: async (document) => {
          await fetchRemoveDocument(document);
          this.setState();
        },
      });
    });
  };

  new AddDocumentButton({
    $target: $documentList,
    addRootDocument: async () => {
      await fetchRootDocument();
      this.setState();
    },
  });

  inItchangeTitle(() => {
    this.setState();
  });

  this.setState();
}
