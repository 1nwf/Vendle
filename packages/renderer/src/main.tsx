/* @refresh reload */
// import "tailwindcss/tailwind.css";
import "virtual:windi.css";

import { onMount } from "solid-js";
import { render } from "solid-js/web";
import App from "./app";

render(() => {
  onMount(() => {
    window.removeLoading();
  });

  return <App />;
}, document.getElementById("root") as HTMLElement);

console.log("fs", window.fs);
console.log("ipcRenderer", window.ipcRenderer);

// Usage of ipcRenderer.on
window.ipcRenderer.on("main-process-message", (_event, ...args) => {
  console.log("[Receive Main-process message]:", ...args);
});
