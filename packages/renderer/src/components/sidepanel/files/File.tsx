import { settings } from "@/state/settings";
import { createSignal, onCleanup } from "solid-js";
import { file } from "../../../state/file";
import { deleteFile, renameFile, saveNote } from "@/util/files";
import { useNavigate } from "@solidjs/router";
import { Icon } from "solid-heroicons";
import { dotsVertical, trash } from "solid-heroicons/outline";
import {
  Select,
  SelectContent,
  SelectListbox,
  SelectTrigger,
} from "@hope-ui/solid";

export default function File({
  id,
  fileName,
}: {
  id: string;
  fileName: string;
}) {
  const navigate = useNavigate();
  const [editable, setEditable] = createSignal(false);
  const [showMenu, setShowMenu] = createSignal(false);
  const [newName, setNewName] = createSignal("");
  let nameRef;
  const handleClick = async (e) => {
    if (e.detail == 1) {
      if (file.id && file.id !== id) {
        await saveNote();
      }
      navigate(`/file/${id}`);
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
          : `hover:(cursor-pointer bg-black text-white bg-opacity-10 font-bold) ${
              file.id == id && "bg-white bg-opacity-25"
            }`
      }`}
      onClick={handleClick}
    >
      <div class={`p-2 text-red-500 w-8/12 break-all no-underline`}>
        <p
          ref={nameRef}
          style={!editable() ? settings.theme.sidePanelFg : "color: white"}
          class="outline-none"
          contentEditable={editable()}
          onInput={(e) => setNewName(e.target.textContent)}
          onKeyDown={handleKeyDown}
        >
          {fileName}
        </p>
      </div>

      <div class="my-auto ml-auto mr-1" onClick={handleToggleMenu}>
        <Select>
          <SelectTrigger>
            <Icon
              path={dotsVertical}
              class="h-6 w-6 mr-auto hover:cursor-pointer"
              stroke-width={2}
            />
          </SelectTrigger>
          <SelectContent css={{ minWidth: "100px", borderRadius: "$xl" }}>
            <SelectListbox>
              <div class="flex items-center p-2 rounded-xl hover:(bg-red-500 text-white cursor-pointer)">
                <Icon
                  path={trash}
                  class="h-4 w-4 mr-2 hover:cursor-pointer"
                  stroke-width={2}
                />
                <p
                  onClick={async () => await deleteFile(id)}
                  class="hover:(bg-red-500 text-white)  text-sm"
                >
                  delete
                </p>
              </div>
            </SelectListbox>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
