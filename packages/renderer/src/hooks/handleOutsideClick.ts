import { createEffect } from "solid-js";

export default function handleOutsideClick(ref: any, cb: () => void) {
  const handleMouseDown = (e: any) => {
    if (ref && !ref.contains(e.target)) {
      cb();
    }
  };
  createEffect(() => {
    document.addEventListener("mousedown", handleMouseDown);
  });
}
