import { setFile } from "@/state/file";
import { getFileContents } from "@/util/files";
import { useParams } from "@solidjs/router";
import { createEffect, createResource } from "solid-js";
import Editor from "@/components/editor";
import { BlockType } from "@/types";

export default function File() {
  const fetchFileContents = async () => {
    if (!id) return;
    let contents = await getFileContents<BlockType>(id);
    setFile("contents", contents);
    setFile({ id: id, contents: contents });
  };
  const { id } = useParams();
  createResource(id, fetchFileContents);
  createEffect(() => {
    setFile("id", id);
  });

  return (
    <div>
      {window.location.href}
      <Editor />
    </div>
  );
}
