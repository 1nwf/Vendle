import { createSignal, onCleanup } from "solid-js";
import { colorscheme, user } from "../state/settings";
import { saveFile } from "../util/files";

export default function Workspace() {
  const [editable, setEditable] = createSignal(false);
  let usernameRef;
  const handleClick = (e) => {
    if (e.detail == 2) {
      setEditable(true);
    }
    e.stopPropagation();
  };
  const handleKeyDown = async (e) => {
    if (e.key != "Enter") return;
    console.log(e.target.textContent);
    user.name = e.target.textContent;
    setEditable(false);
    await saveFile("user", "", { name: e.target.textContent });
  };

  const handleMouseDown = (e) => {
    let contain = usernameRef.contains(e.target);
    if (!contain) {
      setEditable(false);
    }
  };
  document.addEventListener("mousedown", handleMouseDown);

  onCleanup(() => {
    document.removeEventListener("mousedown", handleMouseDown);
  });
  return (
    <div
      class={`${colorscheme.sidePanelBg} ${colorscheme.sidePanelFg} py-2 pl-2 rounded-r-2xl  mb-5`}
    >
      <div class=" rounded-r-xl p-2  flex items-center w-[95%] mr-42 hover:(bg-black bg-opacity-15 cursor-pointer)">
        <img
          src="https://www.mintface.xyz/content/images/2021/08/QmdhoQdQ1oB2rdJD3ZpexSwwfspqAWGMdDjPR3mYeWGpZT.png"
          class="w-10 h-10 rounded-xl shadow-stone-2xl"
        />
        <p
          class={`ml-2 w-full ${
            editable() && "bg-black bg-opacity-50"
          } p-2 rounded-md outline-none select-text`}
          contentEditable={editable()}
          onClick={handleClick}
          onKeyDown={async (e) => await handleKeyDown(e)}
          ref={usernameRef}
        >
          {user.name}
        </p>
      </div>
    </div>
  );
}
