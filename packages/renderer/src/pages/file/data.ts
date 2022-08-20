import { batch, createResource } from "solid-js";
import { allFiles, setFile } from "@/state/file";
import { getFileContents } from "@/util/files";

export default function FileData({ params }) {
  return createResource(
    () => params.id,
    async (id) => {
      if (!id) return;
      let contents = await getFileContents<any>(id);
      const name = allFiles().find((f) => f.id == params.id).name;

      batch(() => {
        setFile("contents", contents);
        setFile("name", name);
        setFile("id", id);
      });
    }
  );
}
