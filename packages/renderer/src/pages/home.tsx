import { Component } from "solid-js";
import { settings } from "../state/settings";

const App: Component = () => {
  return (
    <div class="w-full h-full justify-center" style={settings.theme.appBg}>
      <h1 class="text-4xl">
        Hello {settings.username}
      </h1>
    </div>
  );
};

export default App;
