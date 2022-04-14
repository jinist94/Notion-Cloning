import DocumentList from "./DocumentList.js";

export default function App({ $target }) {
  const documentList = new DocumentList({ $target, initialState: [] });
}
