// src/components/redacoes/EssayCorrectionCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock, Edit } from "lucide-react"

interface EssayCorrectionCardProps {
  title: string
  student: string
  status: "pending" | "corrected"
  submissionDate: string
  deadline: string
  essayId: string // Add essayId to link to the essay details
  onCorrect: () => void
  onView: () => void
}

export const EssayCorrectionCard = ({ 
  title, 
  student, 
  status, 
  submissionDate, 
  deadline, 
  essayId, // Add essayId to the destructured props
  onCorrect, 
  onView 
}: EssayCorrectionCardProps) => (
  <Card className="overflow-hidden bg-gradient-to-br from-black/40 to-black/20 border-slate-800 hover:border-slate-700 transition-all duration-300">
    <CardHeader className="p-4 pb-0">
      <div className="flex justify-between items-start gap-4">
        <CardTitle className="text-lg text-white">{title}</CardTitle>
        <Badge 
          variant={status === "pending" ? "destructive" : "secondary"}
          className={status === "pending" ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}
        >
          {status === "pending" ? "A corrigir" : "Corrigida"}
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="flex flex-col justify-between h-[calc(100%-60px)] p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <FileText className="w-4 h-4" />
          <span>Aluno: {student}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Clock className="w-4 h-4" />
          <span>Enviado: {submissionDate}</span>
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
          onClick={onCorrect}
          disabled={status === "corrected"}
        >
          <Edit className="w-4 h-4 mr-2" />
          Corrigir Redação
        </Button>
        <Button 
          variant="outline" 
          className="w-full bg-white/5 border-slate-800 hover:bg-white/10 hover:border-slate-700 text-white"
          onClick={onView}
        >
          Ver Detalhes
        </Button>
      </div>
    </CardContent>
  </Card>
)