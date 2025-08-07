// src/components/redacoes/EssayDetailsDialog.tsx
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { EssayMentorAPI } from "@/api/mentor/controllers/EssayMentorAPI"
import { EssayResponseDTO } from "@/api/dtos/essayDtos"

interface EssayDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  essayId: string
}

export const EssayDetailsDialog = ({ open, onOpenChange, essayId }: EssayDetailsDialogProps) => {
  const [essay, setEssay] = useState<EssayResponseDTO | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && essayId) {
      const fetchEssay = async () => {
        try {
          setLoading(true)
          const data = await EssayMentorAPI.getEssayById(essayId)
          setEssay(data)
        } catch (error) {
          console.error('Failed to fetch essay details:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchEssay()
    }
  }, [open, essayId])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-white">Detalhes da Redação</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {loading ? (
            <p className="text-sm text-slate-400">Carregando...</p>
          ) : essay ? (
            <>
              <div className="space-y-2">
                <Label className="text-white">Tema</Label>
                <Card className="p-4 bg-white/5 border-slate-800">
                  <p className="text-sm text-slate-400">{essay.theme}</p>
                </Card>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Descrição</Label>
                <Card className="p-4 bg-white/5 border-slate-800">
                  <p className="text-sm text-slate-400 whitespace-pre-line">{essay.description}</p>
                </Card>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Mínimo de Palavras</Label>
                  <Card className="p-4 bg-white/5 border-slate-800">
                    <p className="text-sm text-slate-400">{essay.minWords}</p>
                  </Card>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Prazo</Label>
                  <Card className="p-4 bg-white/5 border-slate-800">
                    <p className="text-sm text-slate-400">{new Date(essay.maxDate).toLocaleDateString()}</p>
                  </Card>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Turma</Label>
                <Card className="p-4 bg-white/5 border-slate-800">
                  <p className="text-sm text-slate-400">{essay.classroom.name}</p>
                </Card>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-400">Erro ao carregar os detalhes da redação</p>
          )}
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="bg-white/5 border-slate-800 hover:bg-white/10 hover:border-slate-700 text-white"
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}