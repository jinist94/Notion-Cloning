import PostHeader from './PostHeader.js';
import PostList from './PostList.js';
import AddPostButton from './AddPostButton.js';
import MenuButton from './MenuButton.js';
import { fetchAddDocument, fetchGetDocuments, fetchRemoveDocument, fetchRootDocument, X_USERNAME } from 'util/api.js';
import { on, emit } from 'util/custom.js';
import { push } from 'util/router.js';
import { SELECTED_DOCUMENT, setItem } from 'util/storage.js';
import { createElement, addClass } from 'util/helper.js';

export default function PostPage({ $target, initialState = [] }) {
  const $sidebar = createElement('div', 'sidebar');
  const $ul = createElement('ul', 'post__items');

  this.state = initialState;

  this.setState = async () => {
    this.state = await fetchGetDocuments();
    postList.setState(this.state);
  };

  $target.appendChild($sidebar);

  new MenuButton({
    $target: $sidebar,
    className: 'menu__button-close',
    iconClass: 'fa-solid fa-angles-left',
    onClickButton: () => {
      const $editorContainer = document.querySelector('.editor__container');
      addClass($sidebar, 'hide');
      addClass($editorContainer, 'hide');
    },
  });

  new PostHeader({
    $target: $sidebar,
    title: X_USERNAME,
  });

  $sidebar.appendChild($ul);

  new AddPostButton({
    $target: $sidebar,
    addRootDocument: async () => {
      await fetchRootDocument();
      await this.setState();

      const newDocId = this.state[this.state.length - 1].id;

      setItem(SELECTED_DOCUMENT, { id: newDocId });
      push(`/documents/${newDocId}`);
    },
  });

  const postList = new PostList({
    $target: $ul,
    initialState: this.state,
    onAdd: async (documentId) => {
      const newDoc = await fetchAddDocument(documentId);

      setItem(SELECTED_DOCUMENT, { id: newDoc.id });
      push(`/documents/${newDoc.id}`);
      this.setState();
    },
    onRemove: async (documentId) => {
      await fetchRemoveDocument(documentId);
      emit.removeChild(documentId);
      this.setState();
    },
    onSelect: (documentId) => {
      setItem(SELECTED_DOCUMENT, { id: documentId });
      push(`/documents/${documentId}`);
      this.setState();
    },
  });

  on.changeTitle(() => {
    this.setState();
  });

  this.setState();
}
