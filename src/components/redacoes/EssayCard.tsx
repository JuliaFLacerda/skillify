// src/components/redacoes/EssayCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock, CheckCircle2 } from "lucide-react"

interface EssayCardProps {
  title: string
  student: string
  status: "pending" | "corrected"
  date: string
  score?: number
  onCorrect?: () => void
  onView: () => void
}

export const EssayCard = ({ title, student, status, date, score, onCorrect, onView }: EssayCardProps) => (
  <Card className="overflow-hidden bg-gradient-to-br from-black/40 to-black/20 border-slate-800 hover:border-slate-700 transition-all duration-300">
    <CardHeader className="p-4 pb-0">
      <div className="flex justify-between items-start gap-4">
        <CardTitle className="text-lg text-white">{title}</CardTitle>
        <Badge 
          variant={status === "pending" ? "destructive" : "secondary"}
          className={status === "pending" ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}
        >
          {status === "pending" ? "Pendente" : "Corrigida"}
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="flex flex-col justify-between h-[calc(100%-60px)] p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <FileText className="w-4 h-4" />
          <span>{student}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Clock className="w-4 h-4" />
          <span>{date}</span>
        </div>
        {status === "corrected" && (
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-white">Nota: {score}/1000</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 gap-2 mt-4">
        <Button 
          variant="outline" 
          className="w-full bg-white/5 border-slate-800 hover:bg-white/10 hover:border-slate-700 text-white"
          onClick={status === "pending" ? onCorrect : onView}
        >
          {status === "pending" ? "Ver Detalhes" : "Ver Correção"}
        </Button>
      </div>
    </CardContent>
  </Card>
)