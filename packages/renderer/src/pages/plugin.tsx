import { useParams } from "@solidjs/router";

export default function Plugins() {
  const { name } = useParams();
  return (
    <div class="px-10 mt-3">
      <h1>Plugins</h1>
    </div>
  );
}
