import { Dialog } from "@radix-ui/themes"
import type { Dispatch, SetStateAction } from "react"

export default function CustomDialog({
  open,
  onOpenChange,
  title,
}: {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
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
