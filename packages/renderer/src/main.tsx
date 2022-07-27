/* @refresh reload */
import "virtual:windi.css";

import { render } from "solid-js/web";
import App from "./app";

render(() => {
  return <App />;
}, document.getElementById("root") as HTMLElement);
