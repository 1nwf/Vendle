import { createResource } from "solid-js";
import { createStore } from "solid-js/store";
import { getAllFileNames } from "../util/files";

export const [fileContents, setFileContents] = createStore({});
export const [file, setFile] = createStore({
  id: "",
  name: "",
  contents: {},
});
export const [allFiles, { refetch: refetchAllFiles }] = createResource(
  getAllFileNames,
  {
    initialValue: [],
  }
);
