import { createEffect, createSignal } from "solid-js";

export default function useResize(ref: HTMLElement) {
  const [width, setWidth] = createSignal(0);
  const [isResizing, setIsResizing] = createSignal(false);

  createEffect(() => {
    if (ref) {
      const onMouseDown = (e: MouseEvent) => {
        setIsResizing(true);
      };
      const onMouseMove = (e: MouseEvent) => {
        if (isResizing()) {
          setWidth(e.clientX);
        }
      };
      const onMouseUp = () => {
        setIsResizing(false);
      };
      ref.addEventListener("mousedown", onMouseDown);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      return () => {
        ref.removeEventListener("mousedown", onMouseDown);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
    }
  });
  return width;
}
