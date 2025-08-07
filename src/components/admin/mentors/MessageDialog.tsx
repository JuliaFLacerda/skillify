// MessageDialog.tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { MessageAdminAPI } from "@/api/admin/controllers/MessageAdminAPI"
import { MessageCreateDTO } from "@/api/dtos/messageDtos"

interface MessageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mentorId: string | null // ID of the mentor to receive the message
  mentorName: string | null // For display purposes
  senderId: string // ID of the admin sending the message
}

const MessageDialog = ({ open, onOpenChange, mentorId, mentorName, senderId }: MessageDialogProps) => {
  const { toast } = useToast()
  const [messageContent, setMessageContent] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mentorId || !senderId) {
      toast({
        title: "Erro",
        description: "Informações do remetente ou destinatário ausentes.",
        variant: "destructive"
      })
      return
    }

    const messageData: MessageCreateDTO = {
      remetenteId: senderId,
      destinatarioId: mentorId,
      content: messageContent
    }

    console.log(messageData)

    setIsSending(true)
    try {
      await MessageAdminAPI.sendMessage(messageData)
      setMessageContent("")
      setIsSending(false)
      onOpenChange(false)
      toast({
        title: "Mensagem enviada",
        description: `Sua mensagem foi enviada com sucesso para ${mentorName}.`,
      })
    } catch (error) {
      setIsSending(false)
      toast({
        title: "Erro ao enviar mensagem",
        description: "Não foi possível enviar a mensagem.",
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enviar Mensagem</DialogTitle>
          <DialogDescription>
            Envie uma mensagem para {mentorName}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea 
              id="message" 
              required 
              className="min-h-[100px]" 
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              disabled={isSending}
            />
          </div>
          <DialogFooter>
            <Button 
              type="submit"
              disabled={isSending}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              {isSending ? "Enviando..." : "Enviar Mensagem"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default MessageDialog