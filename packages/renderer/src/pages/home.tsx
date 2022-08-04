import { Component } from "solid-js";
import { settings } from "../state/settings";

const App: Component = () => {
  return (
    <div>
      <h1 class="text-4xl" style={settings.theme.appFg}>
        Choose a file
      </h1>
    </div>
  );
};

export default App;
