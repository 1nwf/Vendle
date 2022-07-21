import { createEffect, createSignal, For, on } from "solid-js";
import { BlockType } from "../types";
import { generateBlock } from "../util/block";
import Block from "./block";
import { file, fileContents, setFileContents } from "../state/file";
import { colorscheme, plugins, settings } from "../state/settings";
import { Dynamic } from "solid-js/web";

export default function Editor() {
  const [activeBlock, setActiveBlock] = createSignal(
    fileContents[0].id ?? null
  );

  const getBlockIdxFromId = (blockId: string): number => {
    return fileContents.map((b) => b.id).indexOf(blockId);
  };

  const addBlock = (blockId: string) => {
    let idx = getBlockIdxFromId(blockId);
    let newBlocks = [...fileContents];
    let genBlock = generateBlock(fileContents.length);
    newBlocks.splice(idx + 1, 0, genBlock);
    setFileContents(newBlocks);
    focusBlock(genBlock.position);
  };

  const focusBlock = (position: number) => {
    let b = document.querySelector(`[data-position="${position}"]`);
    if (b) {
      b.focus();
    }
  };
  const deleteBlock = (blockId: string) => {
    const idx = getBlockIdxFromId(blockId);
    if (idx == 0) return;
    const newBlocks = [...fileContents];
    newBlocks.splice(idx, 1);
    setFileContents(newBlocks);
    focusBlock(fileContents[idx - 1].position);
  };

  const updateBlock = (value: Partial<BlockType>, id: string) => {
    setFileContents((block) => block.id == id, value);
  };

  createEffect(
    on(
      () => file.name,
      () => {
        setTimeout(() => {
          focusBlock(0);
        }, 10);
      }
    )
  );

  const focusUpBlock = (blockId: string) => {
    const idx = getBlockIdxFromId(blockId);
    if (idx == 0) return;
    focusBlock(fileContents[idx - 1].position);
  };
  const focusDownBlock = (blockId: string) => {
    const idx = getBlockIdxFromId(blockId);
    if (idx == fileContents.length - 1) return;
    focusBlock(fileContents[idx + 1].position);
  };

  const deleteAllBlocks = () => {};

  return (
    <div
      class={`pt-10 flex m-4 rounded-xl justify-center ${colorscheme.editorBg} text-black h-[93vh]`}
    >
      <div>
        <For each={plugins.MenuItems}>
          {(Item) => (
            <Dynamic component={Item(createEffect, createSignal)}></Dynamic>
          )}
        </For>
        <For each={fileContents}>
          {(b, index) => (
            <Block
              block={b}
              updateBlock={(updatedBlock) => updateBlock(updatedBlock, b.id)}
              addBlockHandler={addBlock}
              deleteBlockHandler={deleteBlock}
              focusUpBlock={focusUpBlock}
              focusDownBlock={focusDownBlock}
              deleteAllBlocks={deleteAllBlocks}
              activeBlock={activeBlock}
              setActiveBlock={setActiveBlock}
            />
          )}
        </For>
      </div>
    </div>
  );
}
