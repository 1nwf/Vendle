import { nanoid } from "nanoid";
import { createSignal } from "solid-js";
import { saveFile } from "@/util/files";
import { useNavigate } from "@solidjs/router";

export default function CreateFile({
  ref,
  closeHandler,
}: {
  ref: any;
  closeHandler: () => void;
}) {
  const [fileName, setFileName] = createSignal("");

  const handleFileCreate = async (fileId: string) => {
    if (!fileName()) return;
    let initialData = {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: fileName() }],
        },
      ],
    };

    await saveFile(fileId, fileName(), initialData);
    setFileName("");
  };

  const navigate = useNavigate();
  const handleKeyDown = async (e: any) => {
    if (e.key != "Enter") return;
    setFileName(e.target.value);
    const fileId = nanoid();
    await handleFileCreate(fileId);
    closeHandler();
    navigate(`/file/${fileId}`);
  };
  return (
    <div class="ml-auto">
      <input
        class="p-2 rounded-md pl-3 w-full mt-2 text-black outline-none drop-shadow-3xl"
        placeholder="name"
        value={fileName()}
        onChange={(e) => setFileName(e.target.value)}
        onKeyDown={async (e) => await handleKeyDown(e)}
        ref={ref}
      />
    </div>
  );
}
