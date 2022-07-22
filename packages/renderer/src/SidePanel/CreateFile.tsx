import { nanoid } from "nanoid";
import { createEffect, createSignal, Show } from "solid-js";
import { saveFile } from "../util/files";

export default function CreateFile() {
  const [fileName, setFileName] = createSignal("");
  const [showInput, setShowInput] = createSignal(false);

  let inputRef: HTMLInputElement;
  const handleFileCreate = async () => {
    if (!showInput()) {
      setShowInput(true);
      inputRef.focus();
      return;
    }
    setShowInput(!showInput());
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
  createEffect(() => {
    console.log("input ref: ", inputRef);
  });

  const handleKeyDown = async (e: any) => {
    if (e.key != "Enter") return;
    setFileName(e.target.value);
    await handleFileCreate();
  };
  return (
    <div>
      <Show when={showInput()}>
        <input
          class="p-2 rounded-lg pl-3 w-full mt-2 text-black"
          placeholder="name"
          value={fileName()}
          onChange={(e) => setFileName(e.target.value)}
          onKeyDown={async (e) => await handleKeyDown(e)}
          ref={inputRef}
        />
      </Show>
      <div
        class="bg-black bg-opacity-25 mt-2 p-2 text-sm rounded-lg items-center flex hover:(cursor-pointer bg-opacity-60)"
        onClick={async () => await handleFileCreate()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width={2}
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Create File
      </div>
    </div>
  );
}
