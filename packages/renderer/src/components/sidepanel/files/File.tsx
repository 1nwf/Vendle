import { settings } from "@/state/settings";
import { createSignal, onCleanup } from "solid-js";
import { file } from "../../../state/file";
import { deleteFile, renameFile } from "@/util/files";
import { useNavigate } from "@solidjs/router";
import { Icon } from "solid-heroicons";
import { ellipsisVertical, pencilSquare, trash } from "solid-heroicons/outline";
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

  const toggleRename = () => {
    setEditable(true);
    nameRef.focus();
  };
  const handleKeyDown = async (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      await renameFile(id, fileName, newName());
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

  const handleFileDelete = async () => {
    await deleteFile(id);
    navigate("/");
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
              path={ellipsisVertical}
              style={settings.theme.sidePanelFg}
              class="h-5 w-5 mr-auto hover:cursor-pointer"
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
                  onClick={async () => await handleFileDelete()}
                  class="hover:(text-white)  text-sm"
                >
                  delete
                </p>
              </div>
              <div class="flex items-center p-2 rounded-xl hover:(bg-blue-500 text-white cursor-pointer)">
                <Icon
                  path={pencilSquare}
                  class="h-4 w-4 mr-2 hover:cursor-pointer"
                  stroke-width={2}
                />
                <p
                  onClick={() => toggleRename()}
                  class="hover:(text-white)  text-sm"
                >
                  rename
                </p>
              </div>
            </SelectListbox>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
