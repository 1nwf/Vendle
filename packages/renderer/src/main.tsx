/* @refresh reload */
import "virtual:windi.css";

import { render } from "solid-js/web";
import { Router, createIntegration } from "@solidjs/router";
import App from "./app";
import { HopeThemeConfig, HopeProvider } from "@hope-ui/solid";
import { createRenderEffect } from "solid-js";
import { initPlugins } from "./util/plugins";
import { settings } from "./state/settings";
import { initEditor } from "./state/editor";
function bindEvent(target: EventTarget, type: string, handler: EventListener) {
  target.addEventListener(type, handler);
  return () => target.removeEventListener(type, handler);
}
const loadSettings = async () => {
  const loadedSettings = window.settings;
  if (loadedSettings) {
    Object.keys(loadedSettings).forEach((key) => {
      let k = key as keyof typeof settings;
      if (k == "theme") return;
      settings[k] = loadedSettings[k];
    });
  }
};

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
    Select: {
      defaultProps: {
        root: {
          variant: "unstyled",
        },
      },
      baseStyle: {
        trigger: {
          transition: "none",
          color: "inherit",
        },
      },
    },
  },
};
render(() => {
  createRenderEffect(async () => {
    await Promise.all([initPlugins(), loadSettings()]).then(() => {
      initEditor();
    });
  });
  return (
    <Router source={electronIntegration()}>
      <HopeProvider config={config}>
        <App />
      </HopeProvider>
    </Router>
  );
}, document.getElementById("root") as HTMLElement);
