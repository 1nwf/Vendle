/* @refresh reload */
import "virtual:windi.css";

import { render } from "solid-js/web";
import { createIntegration, Router } from "@solidjs/router";
import App from "./app";
import { HopeProvider, HopeThemeConfig, Spinner } from "@hope-ui/solid";
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
    },
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
  const [pluginsLoaded, setPluginsLoaded] = createSignal(false);
  createRenderEffect(async () => {
    initEditor();
    await initPlugins();
    setPluginsLoaded(true);
  });
  return (
    <Router source={electronIntegration()}>
      <HopeProvider config={config}>
        {!pluginsLoaded() && (
          <div
            class="fixed  bottom-7 left-[50%] p-1 rounded-md"
            style={settings.theme.sidePanelBg}
          >
            <div class="items-center flex gap-2">
              <Spinner size="sm" style={settings.theme.appFg} />
              <p class="text-sm" style={settings.theme.appFg}>
                loading plugins...
              </p>
            </div>
          </div>
        )}
        <App />
      </HopeProvider>
    </Router>
  );
}, document.getElementById("root") as HTMLElement);
