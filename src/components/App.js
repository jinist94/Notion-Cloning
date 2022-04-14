import EditorContainer from "./EditorContainer.js";
import DocumentList from "./DocumentList.js";
import { inItRouter } from "../util/router.js";
import { fetchGetDocument } from "../util/api.js";

export default function App({ $target }) {
  // const onSelectDocument = async (doc) => {
  //   editorContainer.setState(doc);
  // };

  const documentList = new DocumentList({ $target, initialState: [] });

  const editorContainer = new EditorContainer({
    $target,
    initialState: {
      id: "",
      title: "",
      content: "",
    },
  });

  this.route = async () => {
    const { pathname } = window.location;
    if (pathname === "/") {
      editorContainer.setState({
        id: "",
        title: "",
        content: "",
      });
    } else if (pathname.indexOf("/documents/") === 0) {
      const [, , documentId] = pathname.split("/");
      const document = await fetchGetDocument(documentId);
      console.log(documentId);
      editorContainer.setState(document);
    }
  };

  this.route();

  inItRouter(this.route);
}
