import Editor from "./Editor.js";
import { setItem, getItem, removeItem } from "../util/storage.js";
import { fetchEditDocument } from "../util/api.js";

export default function EditorContainer({ $target, initialState }) {
  const $container = document.createElement("div");
  $target.appendChild($container);

  this.state = initialState;

  this.setState = (nextState) => {
    this.state = nextState;
    editor.setState(nextState);
  };

  let timer = null;

  const documentLocalSaveKey = `$temp-document-${this.state.id}`;

  const documentData = getItem(documentLocalSaveKey, { id: "", title: "", content: "" });

  const editor = new Editor({
    $target: $container,
    initialState: documentData,
    onEditing: (document) => {
      if (timer !== null) {
        clearTimeout(timer);
      }

      timer = setTimeout(async () => {
        setItem(documentLocalSaveKey, {
          ...document,
          tempSaveDate: new Date(),
        });

        await fetchEditDocument(document);
        removeItem(documentLocalSaveKey);
      }, 1000);
    },
  });
}
