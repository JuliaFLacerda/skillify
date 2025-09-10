import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useParams } from "react-router-dom"
import { Check, MessageSquare, Award } from "lucide-react"
import { useEffect, useState } from "react"
import { EssayCorrectionStudentAPI } from "../../api/student/controllers/EssayCorrectionStudentAPI"
import { EssayCorrectionResponseDTO } from "../../api/dtos/essayCorrectionDtos"
import { toast } from "sonner"

const EssayCorrection = () => {
  const { id } = useParams<{ id: string }>()
  const [correction, setCorrection] = useState<EssayCorrectionResponseDTO | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCorrection = async () => {
      if (!id) {
        toast.error("ID da correção não fornecido")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await EssayCorrectionStudentAPI.getEssayCorrectionById(id)
        setCorrection(data)
      } catch (error) {
        toast.error("Erro ao carregar a correção")
        console.error('Error fetching correction:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCorrection()
  }, [id])

  const calculateTotalScore = (correction: EssayCorrectionResponseDTO) => {
    return (
      correction.competencia1Score +
      correction.competencia2Score +
      correction.competencia3Score +
      correction.competencia4Score +
      correction.competencia5Score
    )
  }

  if (loading) {
    return (
      <div className="container py-8">
        <p>Carregando correção...</p>
      </div>
    )
  }

  if (!correction) {
    return (
      <div className="container py-8">
        <p className="text-muted-foreground">Correção não encontrada</p>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Correção da Redação</h1>
          <p className="text-muted-foreground">
            Feedback detalhado do seu texto
          </p>
        </div>
        <Badge variant="secondary" className="text-lg py-2">
          Nota Final: {calculateTotalScore(correction)}/1000
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Texto Original</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">
                {correction.essayExecution.text}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comentários do Corretor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Estrutura e Coesão</p>
                  <p className="text-muted-foreground">
                    {correction.estruturaCoesaoComentario}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Argumentação</p>
                  <p className="text-muted-foreground">
                    {correction.argumentacaoComentario}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Critérios de Avaliação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Competência 1</span>
                  <Badge variant="outline" className="flex gap-1">
                    <Check className="w-4 h-4" /> {correction.competencia1Score}/200
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Competência 2</span>
                  <Badge variant="outline" className="flex gap-1">
                    <Check className="w-4 h-4" /> {correction.competencia2Score}/200
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Competência 3</span>
                  <Badge variant="outline" className="flex gap-1">
                    <Check className="w-4 h-4" /> {correction.competencia3Score}/200
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Competência 4</span>
                  <Badge variant="outline" className="flex gap-1">
                    <Check className="w-4 h-4" /> {correction.competencia4Score}/200
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Competência 5</span>
                  <Badge variant="outline" className="flex gap-1">
                    <Check className="w-4 h-4" /> {correction.competencia5Score}/200
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {correction.conquistas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Conquistas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {correction.conquistas.map((conquista, index) => (
                    <Badge key={index} className="w-full justify-center py-2">
                      {conquista}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default EssayCorrection