import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { EssayMentorAPI } from "@/api/mentor/controllers/EssayMentorAPI"
import { useToast } from "@/hooks/use-toast"

interface EssayAssignmentCardProps {
  title: string
  classroom: string
  deadline: string
  essayId: string // Added essayId prop
  onView: () => void
  onDelete: (essayId: string) => void // Added onDelete callback
}

export const EssayAssignmentCard = ({
  title,
  classroom,
  deadline,
  essayId,
  onView,
  onDelete,
}: EssayAssignmentCardProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      await EssayMentorAPI.deleteEssay(essayId)
      onDelete(essayId)
      toast({
        title: "Redação excluída",
        description: "A redação foi removida com sucesso!",
      })
      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast({
        title: "Erro ao excluir redação",
        description: "Não foi possível excluir a redação",
        variant: "destructive",
      })
      console.error('Error deleting essay:', error)
    }
  }

  return (
    <>
      <Card className="overflow-hidden bg-gradient-to-br from-black/40 to-black/20 border-slate-800 hover:border-slate-700 transition-all duration-300">
        <CardHeader className="p-4 pb-0">
          <CardTitle className="text-lg text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-between h-[calc(100%-60px)] p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>{classroom}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Clock className="w-4 h-4" />
              <span>Prazo: {deadline}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button 
              variant="outline" 
              className="w-full bg-white/5 border-slate-800 hover:bg-white/10 hover:border-slate-700 text-white"
              onClick={onView}
            >
              Ver Detalhes
            </Button>
            <Button
              variant="outline"
              className="w-full bg-red-900/20 border-red-800 hover:bg-red-900/30 hover:border-red-700 text-red-400"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-slate-400">
              Tem certeza que deseja excluir a redação "{title}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="bg-white/5 border-slate-800 hover:bg-white/10 text-white"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}