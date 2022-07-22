import {
  Accessor,
  batch,
  createEffect,
  createSignal,
  Setter,
  Show,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { file, fileContents } from "../state/file";
import { colorscheme, plugins, settings } from "../state/settings";
import { BlockType, tags } from "../types";
import { getCaretCoordinates, setCursorToIdx } from "../util/cursor";
import { saveFile } from "../util/files";
import { OverlayCommandsPopup } from "./overlayCommandsPopup";

interface BlockProps {
  block: BlockType;
  updateBlock: (value: Partial<BlockType>) => void;
  addBlockHandler: (blockId: string) => void;
  deleteBlockHandler: (blockId: string) => void;
  focusUpBlock: (blockId: string) => void;
  focusDownBlock: (blockId: string) => void;
  deleteAllBlocks: () => void;
  activeBlock: Accessor<string>;
  setActiveBlock: Setter<string>;
}
export default function Block({
  block,
  updateBlock,
  addBlockHandler,
  deleteBlockHandler,
  focusDownBlock,
  focusUpBlock,
  deleteAllBlocks,
  activeBlock,
  setActiveBlock,
}: BlockProps) {
  const [Tag, setTag] = createSignal(block.tag);
  const [prevKey, setPrevKey] = createSignal("");
  const [cursorPosition, setCursorPosition] = createSignal(
    block.content.length
  );
  let blockRef;

  function getCaretIndex(element) {
    let position = 0;
    const isSupported = typeof window.getSelection !== "undefined";
    if (isSupported) {
      const selection = window.getSelection();
      if (selection.rangeCount !== 0) {
        const range = window.getSelection().getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        position = preCaretRange.toString().length;
      }
    }
    return position;
  }
  const handleKeyDown = async (e) => {
    plugins.onKeyDown.forEach((fn) => {
      fn(e, blockRef, settings, setCursorPosition);
    });

    if (
      !settings.allowEditing &&
      e.key != "ArrowLeft" &&
      e.key != "ArrowRight"
    ) {
      e.preventDefault();
    }
    if (isCommandsPopupOpen()) return;
    else if (e.key == "Enter") {
      e.preventDefault();
      updateBlockContent(e);
      addBlockHandler(block.id);
    } else if (e.key == "Backspace" && !e.currentTarget.textContent) {
      deleteBlockHandler(block.id);
    } else if (e.key == "ArrowUp") {
      focusUpBlock(block.id);
    } else if (e.key == "ArrowDown") {
      focusDownBlock(block.id);
    }
    let cp = getCaretIndex(blockRef);
    if (cp == block.content.length && e.key == "ArrowRight") {
      focusDownBlock(block.id);
    } else if (cp == 0 && e.key == "ArrowLeft") {
      focusUpBlock(block.id);
    } else if (e.key == "s" && prevKey() == "Meta") {
      await saveFile(file.id, file.name, fileContents);
    } else if (e.key == "b" && prevKey() == "Meta") {
      if (!["p", "strong"].includes(block.tag)) return;
      const caretPos = getCaretIndex(blockRef);
      batch(() => {
        updateBlockContent(e);
        updateBlock({ tag: block.tag == "p" ? "strong" : "p" });
        setCursorPosition(caretPos);
      });
      blockRef.focus();
    }
    setPrevKey(e.key);
  };

  const updateBlockContent = (e: any) => {
    if (isCommandsPopupOpen()) {
      return;
    }
    if (settings.allowEditing && block.content != e.currentTarget.textContent) {
      updateBlock({ content: e.currentTarget.textContent });
    }
  };

  const [isCommandsPopupOpen, setIsCommandsPopupOpen] = createSignal(false);
  const [position, setPosition] = createSignal({ x: null, y: null });

  const closeCommandsPopup = () => {
    setIsCommandsPopupOpen(false);
    if (block.tag != Tag()) {
      updateBlock({ tag: Tag(), content: prevText() });
    } else {
      blockRef.innerText = prevText();
    }
    setCursorToIdx(
      blockRef,
      cursorPosition() > block.content.length
        ? block.content.length
        : cursorPosition()
    );
  };

  const openCommandsPopup = () => {
    setPosition(getCaretCoordinates());
    setCursorPosition(getCaretIndex(blockRef));
    setIsCommandsPopupOpen(true);
  };

  const selectionHandler = (tag: tags) => {
    if (Tag() == tag) return;
    setTag(tag);
  };

  const [prevText, setPrevText] = createSignal(block.content);
  const handleKeyUp = (e) => {
    if (e.key == "/") {
      const content = e.currentTarget.textContent;
      const cidx = getCaretIndex(blockRef);
      let text =
        content.slice(0, cidx - 1) + content.slice(cidx, content.length);
      setPrevText(text);
      openCommandsPopup();
    }
  };

  const handleOnFocus = (e) => {
    setActiveBlock(block.id);
    setCursorToIdx(blockRef, cursorPosition());
  };
  createEffect(() => {
    if (!(activeBlock() == block.id)) return;
    setCursorToIdx(blockRef, cursorPosition());
  });

  return (
    <div class="w-xl">
      <Show when={isCommandsPopupOpen()}>
        <OverlayCommandsPopup
          position={position()}
          selectionHandler={selectionHandler}
          closeHandler={closeCommandsPopup}
        />
      </Show>
      <Dynamic
        ref={blockRef}
        component={block.tag}
        contentEditable
        class={`outline-none m-0 ${colorscheme.editorFg} ${
          "font-" + colorscheme.editorFont
        }`}
        onKeyDown={async (e) => handleKeyDown(e)}
        data-position={block.position}
        onKeyUp={handleKeyUp}
        onFocus={handleOnFocus}
        onBLur={updateBlockContent}
      >
        {block.content}
      </Dynamic>
    </div>
  );
}
