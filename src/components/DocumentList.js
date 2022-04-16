import { fetchAddDocument, fetchGetDocuments, fetchRemoveDocument, fetchRootDocument } from "../util/api.js";
import { inItchangeTitle } from "../util/custom.js";
import { push } from "../util/router.js";
import AddDocumentButton from "./AddDocumentButton.js";
import DocumentItem from "./DocumentItem.js";

export default function DocumentList({ $target, initialState = [] }) {
  const $documentList = document.createElement("div");
  const $ul = document.createElement("ul");

  $documentList.classList.add("document-list");
  $target.appendChild($documentList);

  this.state = initialState;

  this.setState = async () => {
    this.state = await fetchGetDocuments();
    this.render();
  };

  this.render = () => {
    $documentList.appendChild($ul);
    $ul.innerHTML = "";
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

    new AddDocumentButton({
      $target: $ul,
      addRootDocument: async () => {
        await fetchRootDocument();
        this.setState();
      },
    });
  };

  this.render();

  this.setState();

  inItchangeTitle(() => {
    this.setState();
  });
}
