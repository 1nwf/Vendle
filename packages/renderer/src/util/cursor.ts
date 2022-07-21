export function getCaretCoordinates() {
  let x, y;
  const isSupported = typeof window.getSelection !== "undefined";
  if (isSupported) {
    const selection = window.getSelection();
    if (selection.rangeCount !== 0) {
      const range = selection.getRangeAt(0).cloneRange();
      range.collapse(false);
      const rect = range.getClientRects()[0];
      if (rect) {
        x = rect.left;
        y = rect.top;
      }
    }
  }
  return { x, y };
}

export function setCursorToIdx(el: any, idx: number) {
  setTimeout(() => {
    let range, selection;
    range = document.createRange();
    range.setEnd(el.childNodes[0] || el, idx);
    range.collapse(false);
    selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, 0);
}
