import { useParams } from "@solidjs/router";
import { ipcRenderer } from "electron";
import { createResource, createSignal } from "solid-js";

export default function Plugins() {
  const fetchReadMe = async (name: string) => {
    const readme = await ipcRenderer.invoke("getPluginReadme", name);
    console.log("readme: ", readme);

    setReadme(readme ?? "");
  };
  const params = useParams();
  createResource(() => params.name, fetchReadMe);
  const [readme, setReadme] = createSignal("");

  return (
    <div class="px-10 mt-5">
      <h1>{params.name}</h1>
      <div innerHTML={readme()} />
    </div>
  );
}
