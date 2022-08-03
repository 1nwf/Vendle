import { Icon } from "solid-heroicons";
import { cube } from "solid-heroicons/outline";

export default function ShowPlugins({ onClick }: { onClick: () => void }) {
  return (
    <div onClick={() => onClick()}>
      <Icon
        path={cube}
        class="h-6 w-6 mr-auto hover:cursor-pointer"
        stroke-width={2}
      />
    </div>
  );
}
