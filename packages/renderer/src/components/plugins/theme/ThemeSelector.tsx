import handleOutsideClick from "@/hooks/handleOutsideClick";
import { plugins } from "@/state/settings";
import { loadStyles } from "@/util/plugins";
import { matchSorter } from "match-sorter";
import { Plugin } from "packages/types/plugins";
import { createEffect, createSignal, For } from "solid-js";

export {};

export default function ThemeSelector({
  closeHandler,
}: {
  closeHandler: () => void;
}) {
  const [themes, setThemes] = createSignal(plugins.colorscheme);
  let ref: any;
  const handleKeyDown = (e: KeyboardEvent) => {
    const active = document.activeElement as Element;

    if (e.key === "ArrowDown" && active.nextSibling) {
      active.nextSibling.focus();
    }
    if (e.key === "ArrowUp" && active.previousSibling) {
      active.previousSibling.focus();
    }
    if (e.key == "Enter") {
      closeHandler();
    }
  };
  let inputRef;
  createEffect(() => {
    inputRef.focus();
    ref.addEventListener("keydown", handleKeyDown);
    handleOutsideClick(ref, closeHandler);
  });
  const handleFocus = (p: Plugin) => {
    loadStyles(p.module.setColorscheme());
  };
  const handleOnInput = (e: any) => {
    setThemes(
      matchSorter(plugins.colorscheme, e.target.value, {
        keys: ["name", "description"],
      })
    );
    const active = ref as Element;
    if (active.children[1]) active.children[1].focus();
    inputRef.focus();
  };
  return (
    <div class="absolute top-10 w-screen lg:ml-20 z-50">
      <div
        ref={ref}
        class="bg-black text-white rounded-md md:w-5/12 w-10/12  mx-auto shadow-2xl"
      >
        <input
          ref={inputRef}
          class="p-2 w-full rounded-t-md text-black outline-none"
          onInput={handleOnInput}
          placeholder="select a theme"
        />
        <For each={themes()}>
          {(p, idx) => {
            return (
              <div
                class={
                  "w-fit p-2 text-sm outline-4 outline-white outline-offset-2 hover:(cursor-pointer bg-gray-700) focus:(cursor-pointer bg-gray-700)"
                }
                onFocus={() => handleFocus(p)}
                tabindex={idx() + 1}
              >
                <p>{p.displayName}</p>
                <p>{p.description}</p>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}
