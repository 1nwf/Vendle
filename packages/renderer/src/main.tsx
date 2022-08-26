/* @refresh reload */
import "virtual:windi.css";

import { render } from "solid-js/web";
import { Router, createIntegration } from "@solidjs/router";
import App from "./app";
import { HopeThemeConfig, HopeProvider, Spinner } from "@hope-ui/solid";
import { createRenderEffect, createSignal } from "solid-js";
import { initPlugins } from "./util/plugins";
import { initEditor } from "./state/editor";
import { settings } from "./state/settings";
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
const Loading = () => {
  return (
    <div
      class="w-screen h-screen flex items-center justify-center"
      style={window.settings.theme.appBg}
    >
      <Spinner thickness="4px" style={settings.theme.appFg} />
    </div>
  );
};

render(() => {
  const [loading, setLoading] = createSignal(false);
  createRenderEffect(async () => {
    setLoading(true);
    await Promise.all([initPlugins()]).then(() => {
      initEditor();
    });
    setLoading(false);
  });
  return (
    <Router source={electronIntegration()}>
      <HopeProvider config={config}>
        {loading() ? <Loading /> : <App />}
      </HopeProvider>
    </Router>
  );
}, document.getElementById("root") as HTMLElement);
