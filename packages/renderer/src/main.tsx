/* @refresh reload */
import "virtual:windi.css";

import { render } from "solid-js/web";
import { Router, createIntegration } from "@solidjs/router";
import App from "./app";
import { HopeThemeConfig, HopeProvider } from "@hope-ui/solid";
function bindEvent(target: EventTarget, type: string, handler: EventListener) {
  target.addEventListener(type, handler);
  return () => target.removeEventListener(type, handler);
}

function electronIntegration() {
  return createIntegration(
    () => window.location.hash.slice(1),
    ({ value, scroll }) => {
      if (value.includes("index.html#")) {
        value = new URL("file://" + value).hash;
      }
      window.location.hash = value.startsWith("/#/") ? value.slice(2) : value;
      if (scroll) {
        window.scrollTo(0, 0);
      }
    },
    (notify) => bindEvent(window, "hashchange", () => notify()),
    {
      go: (delta) => window.history.go(delta),
      renderPath: (path) => `#${path}`,
    }
  );
}
const config: HopeThemeConfig = {
  components: {
    Modal: {
      baseStyle: {
        content: {
          borderRadius: "$xl",
        },
      },
    },
  },
};
render(() => {
  return (
    <Router source={electronIntegration()}>
      <HopeProvider config={config}>
        <App />
      </HopeProvider>
    </Router>
  );
}, document.getElementById("root") as HTMLElement);
