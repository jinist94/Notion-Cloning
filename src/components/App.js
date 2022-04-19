import PostEditePage from "./PostEditePage.js";
import PostPage from "./postPage.js";
import { inItRouter, push } from "../util/router.js";
import { fetchGetDocument } from "../util/api.js";
import { OPEN_LIST, removeItem, SELECTED_DOCUMENT, setItem } from "../util/storage.js";

export default function App({ $target }) {
  const initialEditorState = {
    id: "",
    title: "",
    content: "",
  };

  new PostPage({
    $target,
    initialState: [],
  });

  const postEditPage = new PostEditePage({
    $target,
    initialState: initialEditorState,
  });

  this.route = async () => {
    const { pathname } = window.location;

    if (pathname === "/") {
      postEditPage.setState(initialEditorState);
      setItem(SELECTED_DOCUMENT, null);
      return;
    }
    if (pathname.indexOf("/documents/") === 0) {
      const [, , documentId] = pathname.split("/");
      const document = await fetchGetDocument(documentId);
      setItem(SELECTED_DOCUMENT, { id: document.id });

      if (!document) return push("/");
      postEditPage.setState(document);
    }
  };

  this.init = () => {
    this.route();

    inItRouter(this.route);

    // 새로고침 시 local Storage 초기화
    removeItem(OPEN_LIST);
    removeItem(SELECTED_DOCUMENT);

    window.addEventListener("popstate", this.route);
  };

  this.init();
}
