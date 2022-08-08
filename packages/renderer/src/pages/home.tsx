import { Component } from "solid-js";
import { settings } from "../state/settings";

const App: Component = () => {
  return (
    <div class="mt-10 w-full justify-center">
      <div class="ml-12">
        <h1 class="text-4xl" style={settings.theme.appFg}>
          Hello {settings.username}
        </h1>
      </div>
    </div>
  );
};

export default App;
