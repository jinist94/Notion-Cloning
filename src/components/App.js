import EditorContainer from "./EditorContainer.js";
import DocumentList from "./DocumentList.js";

export default function App({ $target }) {
  const onSelectDocument = async (doc) => {
    editorContainer.setState(doc);
  };

  const documentList = new DocumentList({ $target, initialState: [], onSelectDocument });

  const editorContainer = new EditorContainer({
    $target,
    initialState: {
      title: "",
      content: "",
    },
  });
}
