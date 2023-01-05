interface Shortcuts {
  [key: string]: {
    [key: string]: () => void;
  };
}
let keyboardShortcuts: Shortcuts = {};
export interface KeyboardShortcut {
  modifier: Modifier;
  key: string;
  handler: () => void;
}
export enum Modifier {
  Ctrl = "ctrlKey",
  Meta = "metaKey",
  Shift = "shiftKey",
  Alt = "altKey",
}

function getModifier(e: KeyboardEvent) {
  if (e.metaKey) {
    return Modifier.Meta;
  } else if (e.ctrlKey) {
    return Modifier.Ctrl;
  } else if (e.shiftKey) {
    return Modifier.Shift;
  } else if (e.altKey) {
    return Modifier.Alt;
  } else {
    return "";
  }
}
export function handleKeyboardShortcuts(e: KeyboardEvent) {
  const modifier = getModifier(e);
  if (
    !Object.keys(keyboardShortcuts).includes(modifier) ||
    !Object.keys(keyboardShortcuts[modifier]).includes(e.key)
  ) {
    return;
  }
  let fn = keyboardShortcuts[modifier][e.key];
  fn();
}

export default function useKeyboardShortcut(shortcut: KeyboardShortcut) {
  if (Object.keys(keyboardShortcuts).includes(shortcut.modifier)) {
    let k = keyboardShortcuts[shortcut.modifier];
    k[shortcut.key] = shortcut.handler;
  } else {
    keyboardShortcuts[shortcut.modifier] = { [shortcut.key]: shortcut.handler };
  }
}
