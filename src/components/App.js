import EditorContainer from "./EditorContainer.js";
import DocumentList from "./DocumentList.js";
import { inItRouter, push } from "../util/router.js";
import { fetchGetDocument } from "../util/api.js";

export default function App({ $target }) {
  const initialEditorState = {
    id: "",
    title: "",
    content: "",
  };

  const documentList = new DocumentList({ $target, initialState: [] });

  const editorContainer = new EditorContainer({
    $target,
    initialState: initialEditorState,
  });

  this.route = async () => {
    const { pathname } = window.location;

    if (pathname === "/") {
      editorContainer.setState(initialEditorState);
      return;
    }
    if (pathname.indexOf("/documents/") === 0) {
      const [, , documentId] = pathname.split("/");
      const document = await fetchGetDocument(documentId);

      if (!document) return push("/");
      editorContainer.setState(document);
    }
  };

  this.route();
  inItRouter(this.route);

  window.addEventListener("popstate", this.route);
}
