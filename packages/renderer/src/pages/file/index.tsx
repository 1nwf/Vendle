import Editor from "@/components/editor";
import { useRouteData } from "@solidjs/router";

export default function File() {
  useRouteData();
  return (
    <div>
      <Editor />
    </div>
  );
}
