import Editor from "./Editor.js";
import { setItem, getItem, removeItem } from "../util/storage.js";
import { fetchEditDocument } from "../util/api.js";
import { changeTitle } from "../util/custom.js";
import { createElement } from "../util/util.js";

export default function EditorContainer({ $target, initialState }) {
  const $container = createElement("div", "editor-container");

  $target.appendChild($container);

  this.state = initialState;

  let documentLocalSaveKey = `temp-document-${this.state.id}`;
  const documentData = getItem(documentLocalSaveKey, { id: "", title: "", content: "" });

  this.setState = (nextState) => {
    console.log(nextState, "editorState");
    documentLocalSaveKey = `temp-document-${nextState.id}`;
    this.state = nextState;
    editor.setState(nextState);
  };

  let timer = null;

  const editor = new Editor({
    $target: $container,
    initialState: documentData,
    onEditing: (document) => {
      if (timer !== null) {
        clearTimeout(timer);
      }

      timer = setTimeout(async () => {
        console.log(documentLocalSaveKey, "key");
        setItem(documentLocalSaveKey, {
          ...document,
          tempSaveDate: new Date(),
        });

        await fetchEditDocument(document);
        removeItem(documentLocalSaveKey); // 서버에 제대로 저장이 되면 localstorage삭제
        changeTitle(document.title);
      }, 1000);
    },
  });

  this.init = () => {
    if (documentData.tempSaveDate && documentData.tempSaveDate > this.state.updatedAt) {
      if (confirm("저장되지 않은 임시 데이터가 있습니다. 불러올까요?")) {
        this.setState({
          ...this.state,
          ...documentData,
        });
        return;
      }
    }
  };

  this.init();
}
