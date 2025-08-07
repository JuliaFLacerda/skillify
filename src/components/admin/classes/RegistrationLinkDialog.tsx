
import { Button } from "@/components/ui/button"
import { Link as LinkIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface RegistrationLinkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCopyLink: () => void
  selectedClass: string | null
  registrationLink: string
}

export const RegistrationLinkDialog = ({
  open,
  onOpenChange,
  onCopyLink,
  selectedClass,
  registrationLink,
}: RegistrationLinkDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Link de Cadastro</DialogTitle>
          <DialogDescription>
            Compartilhe este link com os alunos para que eles possam se cadastrar na turma {selectedClass}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg break-all">
            {registrationLink}
          </div>
          <Button
            onClick={onCopyLink}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            Copiar Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}