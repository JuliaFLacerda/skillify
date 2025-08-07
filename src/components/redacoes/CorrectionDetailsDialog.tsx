// src/components/redacoes/CorrectionDetailsDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EssayCorrectionResponseDTO } from "@/api/dtos/essayCorrectionDtos"
import { useEffect, useState } from "react"
import { EssayCorrectionMentorAPI } from "@/api/mentor/controllers/EssayCorrectionMentorAPI"
import { useToast } from "@/hooks/use-toast"

interface CorrectionDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  correctionId: string
}

export const CorrectionDetailsDialog = ({ 
  open, 
  onOpenChange, 
  correctionId 
}: CorrectionDetailsDialogProps) => {
  const [correction, setCorrection] = useState<EssayCorrectionResponseDTO | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open && correctionId) {
      const fetchCorrection = async () => {
        try {
          setLoading(true)
          const data = await EssayCorrectionMentorAPI.getEssayCorrectionById(correctionId)
          setCorrection(data)
        } catch (error) {
          toast({
            title: "Erro",
            description: "Falha ao carregar os detalhes da correção",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }
      fetchCorrection()
    }
  }, [open, correctionId, toast])

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-slate-900 text-white border-slate-800">
          <DialogHeader>
            <DialogTitle>Carregando...</DialogTitle>
          </DialogHeader>
          <div className="p-4">Carregando detalhes da correção...</div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!correction) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 text-white border-slate-800 max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Correção</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 p-4">
          <div>
            <h3 className="font-semibold text-lg">Informações Gerais</h3>
            <div className="mt-2 space-y-2">
              <p><span className="text-slate-400">Tema:</span> {correction.essay.theme}</p>
              <p><span className="text-slate-400">Estudante:</span> {correction.essayExecution.student.name}</p>
              <p><span className="text-slate-400">Mentor:</span> {correction.mentor.name}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg">Comentários</h3>
            <div className="mt-2 space-y-2">
              <p><span className="text-slate-400">Estrutura e Coesão:</span> {correction.estruturaCoesaoComentario}</p>
              <p><span className="text-slate-400">Argumentação:</span> {correction.argumentacaoComentario}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg">Notas</h3>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <p><span className="text-slate-400">Competência 1:</span> {correction.competencia1Score}</p>
              <p><span className="text-slate-400">Competência 2:</span> {correction.competencia2Score}</p>
              <p><span className="text-slate-400">Competência 3:</span> {correction.competencia3Score}</p>
              <p><span className="text-slate-400">Competência 4:</span> {correction.competencia4Score}</p>
              <p><span className="text-slate-400">Competência 5:</span> {correction.competencia5Score}</p>
            </div>
          </div>

          {correction.conquistas.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg">Conquistas</h3>
              <ul className="mt-2 list-disc list-inside">
                {correction.conquistas.map((conquista, index) => (
                  <li key={index}>{conquista}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}