import { allFiles } from "@/state/file";
import Selector from "./Selector";
import { useNavigate } from "@solidjs/router";

export default function FilePicker(
  { closeHandler }: { closeHandler: () => void },
) {
  const navigate = useNavigate();
  const files = allFiles();
  const onClick = (e: any, f: any) => {
    navigate(`/file/${f.id}`);
  };
  return (
    <Selector
      placeholder="choose a file"
      closeHandler={closeHandler}
      items={files}
      onClick={onClick}
      onFocus={() => {}}
    />
  );
}
