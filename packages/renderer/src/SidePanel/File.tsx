import { createSignal, onCleanup, Show } from "solid-js";
import { updateFileContents } from "../state/editor";
import { file, setFile } from "../state/file";
import { deleteFile, renameFile, saveFile } from "../util/files";

export default function File({
  id,
  fileName,
}: {
  id: string;
  fileName: string;
}) {
  const [editable, setEditable] = createSignal(false);
  const [showMenu, setShowMenu] = createSignal(false);
  const [newName, setNewName] = createSignal("");
  let nameRef;
  const handleClick = async (e) => {
    if (e.detail == 1) {
      if (file.name && file.id && file.id != id) {
        updateFileContents();
        await saveFile(file.id, file.name, file.contents);
      }
      setFile({ id: id, name: fileName });
    } else if (e.detail == 2) {
      setEditable(true);
    }

    e.stopImmediatePropagation();
  };
  const handleMouseDown = (e) => {
    let contain = nameRef.contains(e.target);
    if (!contain) {
      setEditable(false);
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      await renameFile(id, newName());
      setEditable(false);
    }
  };
  document.addEventListener("mousedown", handleMouseDown);
  onCleanup(() => {
    document.removeEventListener("mousedown", handleMouseDown);
  });

  const handleToggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu());
  };
  return (
    <div
      class={`flex rounded-md select-text ${
        editable()
          ? "bg-black shadow-xl"
          : `hover:(cursor-pointer bg-black bg-opacity-10 font-bold) ${
              file.name == fileName && "bg-white bg-opacity-25"
            }`
      }`}
      onClick={handleClick}
    >
      <p
        ref={nameRef}
        class="p-2  w-8/12 outline-none break-all"
        contentEditable={editable()}
        onInput={(e) => setNewName(e.target.textContent)}
        onKeyDown={handleKeyDown}
      >
        {fileName}
      </p>
      <div class="my-auto ml-auto mr-1" onClick={handleToggleMenu}>
        <div class="hover:(bg-gray-300 bg-opacity-30) rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width={2}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </div>
        <Show when={showMenu()}>
          <div
            class="bg-white text-black p-2 rounded-xl shadow-xl font-normal text-sm"
            onMouseEnter={(e) => e.stopPropagation()}
          >
            <p
              onClick={() => deleteFile(id)}
              class="hover:(bg-red-500 text-white) p-2 rounded-xl"
            >
              delete
            </p>
          </div>
        </Show>
      </div>
    </div>
  );
}
