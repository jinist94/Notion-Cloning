import DocumentList from "./DocumentList.js";
import Editor from "./Editor.js";

export default function App({ $target }) {
  const onSelectDocument = async (doc) => {
    editor.setState(doc);
  };

  const documentList = new DocumentList({ $target, initialState: [], onSelectDocument });

  const editor = new Editor({
    $target,
    initialState: {
      title: "",
      content: "",
    },
  });
}
