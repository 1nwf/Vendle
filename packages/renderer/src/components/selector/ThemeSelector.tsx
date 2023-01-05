import Selector from "@/components/selector";
import { plugins } from "@/state/settings";
import { loadStyles } from "@/util/plugins";
import { Plugin } from "packages/types/plugins";

const ItemCard = ({ item }: { item: Plugin }) => {
  return (
    <div
      class={"w-fit p-2 text-sm outline-4 outline-white outline-offset-2 hover:(cursor-pointer bg-gray-700) focus:(cursor-pointer bg-gray-700)"}
    >
      <p class="font-bold">{item.displayName}</p>
      <p>{item.description}</p>
    </div>
  );
};

export default function ThemeSelector({
  closeHandler,
}: {
  closeHandler: () => void;
}) {
  const setTheme = (p: Plugin) => {
    loadStyles(p.module.setColorscheme(), p.name);
  };
  const handleClick = (e: any, p: Plugin) => {
    if (e.detail === 2) {
      closeHandler();
    } else {
      setTheme(p);
    }
  };
  return (
    <Selector
      placeholder="select a theme"
      closeHandler={closeHandler}
      items={plugins.colorscheme}
      onClick={handleClick}
      onFocus={(e, p) => setTheme(p)}
      Child={ItemCard}
    />
  );
}
