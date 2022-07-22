/* @refresh reload */
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
