import { useNavigate } from "@solidjs/router";
import { Plugin } from "packages/types/plugins";

export default function PluginCard({ plugin }: { plugin: Plugin }) {
  const navigate = useNavigate();
  const clickHandler = () => {
    navigate(`/plugins/${plugin.name}`);
  };
  return (
    <div
      class="py-2 text-sm w-full rounded mt-1 hover:(bg-black bg-opacity-20 cursor-pointer)"
      onClick={clickHandler}
    >
      <div class="flex flex-row items-center">
        {plugin.icon && (
          <img src={"atom://" + plugin.icon} class="w-10 h-10 rounded-md " />
        )}
        <div class="block ml-2">
          <p>{plugin.name}</p>
          <p class="text-gray-600 text-xs">{plugin.description}</p>
        </div>
      </div>
    </div>
  );
}
