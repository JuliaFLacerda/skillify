import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock, Eye, Edit } from "lucide-react"

interface CorrectedEssayCardProps {
  title: string
  student: string
  correctionDate: string
  essayId: string
  correctionId: string
  onView: () => void
  onUpdate: () => void
}

export const CorrectedEssayCard = ({
  title,
  student,
  correctionDate,
  essayId,
  correctionId,
  onView,
  onUpdate
}: CorrectedEssayCardProps) => (
  <Card className="overflow-hidden bg-gradient-to-br from-black/40 to-black/20 border-slate-800 hover:border-slate-700 transition-all duration-300">
    <CardHeader className="p-4 pb-0">
      <div className="flex justify-between items-start gap-4">
        <CardTitle className="text-lg text-white">{title}</CardTitle>
        <Badge className="bg-green-500/20 text-green-400">
          Corrigida
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
          <span>Corrigido em: {correctionDate}</span>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Button
          variant="outline"
          className="w-full bg-white/5 border-slate-800 hover:bg-white/10 hover:border-slate-700 text-white"
          onClick={onView}
        >
          <Eye className="w-4 h-4 mr-2" />
          Ver Correção
        </Button>
        <Button
          variant="outline"
          className="w-full bg-white/5 border-slate-800 hover:bg-white/10 hover:border-slate-700 text-white"
          onClick={onUpdate}
        >
          <Edit className="w-4 h-4 mr-2" />
          Atualizar Correção
        </Button>
      </div>
    </CardContent>
  </Card>
)