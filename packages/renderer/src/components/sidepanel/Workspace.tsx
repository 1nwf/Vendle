import { createSignal, onCleanup } from "solid-js";
import { persistSettings, settings } from "@/state/settings";
import { ipcRenderer } from "electron";

export default function Workspace() {
  const [editable, setEditable] = createSignal(false);
  let usernameRef: HTMLParagraphElement;
  const handleClick = (e: MouseEvent) => {
    if (e.detail == 2) {
      setEditable(true);
      usernameRef.focus();
    }
    e.stopPropagation();
  };
  const handleKeyDown = async (e) => {
    if (e.key != "Enter") return;
    settings.username = e.target.textContent;
    setEditable(false);
    await persistSettings();
  };

  const handleMouseDown = (e: MouseEvent) => {
    let contain = usernameRef.contains(e.target);
    if (!contain) {
      setEditable(false);
    }
  };
  document.addEventListener("mousedown", handleMouseDown);

  onCleanup(() => {
    document.removeEventListener("mousedown", handleMouseDown);
  });
  let fileRef;
  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    settings.pfpPath = await ipcRenderer.invoke("pfpUpload", file.path);
    await persistSettings();
  };
  return (
    <div class={`py-2 rounded-r-2xl  mb-1`}>
      <div class="rounded-r-xl p-2  flex items-center w-full">
        <img
          src={settings.pfpPath
            ? `atom://${settings.pfpPath}`
            : "https://www.mintface.xyz/content/images/2021/08/QmdhoQdQ1oB2rdJD3ZpexSwwfspqAWGMdDjPR3mYeWGpZT.png"}
          class="w-10 h-10 rounded-xl shadow-stone-2xl hover:(p-1 cursor-pointer)"
          style={settings.theme.appBg}
          onClick={() => fileRef.click()}
        />
        <input
          type="file"
          ref={fileRef}
          hidden
          onChange={async (e) => handleImageUpload(e)}
        />

        <p
          style={settings.theme.sidePanelFg}
          class={`ml-2 w-full ${
            editable() &&
            `${settings.isLightTheme ? "bg-black/20" : "bg-gray-300/20"}`
          } p-2 rounded-md outline-none select-text border-1 border-transparent hover:( border-gray-500 cursor-pointer)`}
          contentEditable={editable()}
          onClick={handleClick}
          onKeyDown={async (e) => await handleKeyDown(e)}
          ref={usernameRef}
        >
          {settings.username}
        </p>
      </div>
    </div>
  );
}
