import { Dialog } from "@radix-ui/themes"

export default function CustomDialog({
  open,
  onOpenChange,
  title,
}: {
  open: boolean
  onOpenChange: () => void
  title: string
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>
          This is a custom dialog component using Radix UI.
        </Dialog.Description>
      </Dialog.Content>
    </Dialog.Root>
  )
}
