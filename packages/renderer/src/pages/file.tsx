import { allFiles, file, setFile } from "@/state/file";
import { getFileContents } from "@/util/files";
import { batch, createEffect, createResource } from "solid-js";
import Editor from "@/components/editor";
import { useParams } from "@solidjs/router";

export default function File() {
  const fetchFileContents = async (id: string) => {
    if (!id) return;
    let contents = await getFileContents<any>(id);

    batch(() => {
      setFile("contents", contents);
      setFile("name", name);
      setFile("id", id);
    });
  };
  const params = useParams();
  const name = allFiles().find((f) => f.id == params.id).name;
  createResource(() => params.id, fetchFileContents);
  return (
    <div>
      <Editor />
    </div>
  );
}
