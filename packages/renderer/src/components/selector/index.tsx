import handleOutsideClick from "@/hooks/handleOutsideClick";
import { matchSorter } from "match-sorter";
import { Component, createEffect, createSignal, For } from "solid-js";

interface Item {
  name: string;
  description: string;
}
interface ChildProps<T extends Item> {
  item: T;
}
interface Props<T extends Item> {
  closeHandler: () => void;
  items: T[];
  Child?: Component<ChildProps<T>>;
  onClick: (e: any, item: T) => void;
  onFocus: (e: any, item: T) => void;
  placeholder: string;
}

const DefaultChildComponent = <T extends Item>(
  { item }: ChildProps<T>,
) => {
  return (
    <div
      class={"w-fit p-2 text-sm outline-4 outline-white outline-offset-2 hover:(cursor-pointer bg-gray-700) focus:(cursor-pointer bg-gray-700)"}
    >
      <p>{item.name}</p>
      <p>{item.description}</p>
    </div>
  );
};

export default function Selector<T extends Item>(
  {
    closeHandler,
    items,
    Child = DefaultChildComponent,
    onFocus,
    onClick,
    placeholder,
  }: Props<T>,
) {
  const [list, setList] = createSignal(items);

  let ref: any;
  const handleKeyDown = (e: KeyboardEvent) => {
    const active = document.activeElement as HTMLHtmlElement;

    if (e.key === "ArrowDown" && active.nextSibling) {
      active.nextSibling.focus();
    }
    if (e.key === "ArrowUp" && active.previousSibling) {
      active.previousSibling.focus();
    }
    if (e.key == "Enter") {
      if (active) {
        active.click();
      }
      closeHandler();
    }
  };
  let inputRef: any;
  createEffect(() => {
    inputRef.focus();
    ref.addEventListener("keydown", handleKeyDown);
    handleOutsideClick(ref, closeHandler);
  });
  const handleOnInput = (e: any) => {
    setList(
      matchSorter(items, e.target.value, {
        keys: ["name", "description"],
      }),
    );
    const active = ref as Element;
    console.log("");
    if (active.children[1]) {
      console.log(active.children[1]);
      active.children[1].focus();
    }
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
          placeholder={placeholder}
        />
        <For each={list()}>
          {(p, idx) => {
            return (
              <div
                tabindex={idx() + 1}
                onFocus={(e) => onFocus(e, p)}
                onClick={(e) => onClick(e, p)}
              >
                <Child item={p} />
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}
