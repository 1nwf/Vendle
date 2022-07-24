import { nanoid } from "nanoid";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import { saveFile } from "../util/files";

export default function CreateFile({
  ref,
  closeHandler,
}: {
  ref: any;
  closeHandler: () => void;
}) {
  const [fileName, setFileName] = createSignal("");

  const handleFileCreate = async () => {
    if (!fileName()) return;
    let initialData = {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: fileName() }],
        },
      ],
    };

    await saveFile(nanoid(), fileName(), initialData);
    setFileName("");
  };

  const handleKeyDown = async (e: any) => {
    if (e.key != "Enter") return;
    setFileName(e.target.value);
    await handleFileCreate();
    closeHandler();
  };
  return (
    <div class="ml-auto">
      <input
        class="p-2 rounded-lg pl-3 w-full mt-2 text-black"
        placeholder="name"
        value={fileName()}
        onChange={(e) => setFileName(e.target.value)}
        onKeyDown={async (e) => await handleKeyDown(e)}
        ref={ref}
      />
    </div>
  );
}
