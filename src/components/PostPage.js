import PostHeader from "./PostHeader.js";
import PostList from "./PostList.js";
import AddPostButton from "./AddPostButton.js";
import { fetchAddDocument, fetchGetDocuments, fetchRemoveDocument, fetchRootDocument, X_USERNAME } from "../util/api.js";
import { inItchangeTitle } from "../util/custom.js";
import { push } from "../util/router.js";
import { createElement } from "../util/util.js";

export default function PostPage({ $target, initialState = [] }) {
  const $documentList = createElement("div", "sidebar");
  const $ul = createElement("ul", "post__items");

  this.state = initialState;

  this.setState = async () => {
    this.state = await fetchGetDocuments();
    this.render();
  };

  this.init = () => {
    $target.appendChild($documentList);

    new PostHeader({
      $target: $documentList,
      title: X_USERNAME,
    });

    $documentList.appendChild($ul);

    new AddPostButton({
      $target: $documentList,
      addRootDocument: async () => {
        await fetchRootDocument();
        this.setState();
      },
    });

    this.setState();
  };

  this.render = () => {
    $ul.innerHTML = "";
    if (this.state.length === 0) {
      $ul.innerHTML = `<div class="empty-post-message"><span>새로운 페이지를 추가해주세요!</span></div>`;
      return;
    }
    this.state.map((doc) => {
      new PostList({
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

  inItchangeTitle(() => {
    this.setState();
  });

  this.init();
}
