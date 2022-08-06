import { ModalBody, ModalContent, ModalHeader } from "@hope-ui/solid";

export default function Settings({ onClose }: { onClose: () => void }) {
  return (
    <ModalContent>
      <ModalHeader>
        <h2>Settings</h2>
      </ModalHeader>
      <ModalBody class="my-4">settings..</ModalBody>
    </ModalContent>
  );
}
