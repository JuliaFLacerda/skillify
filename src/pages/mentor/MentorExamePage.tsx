// src/pages/mentor/MentorExamPage.tsx
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PracticeMentorAPI } from "@/api/mentor/controllers/PracticeMentorAPI"
import { PracticeResponseDTO } from "@/api/dtos/practiceDtos"

export default function MentorExamPage() {
  const { simuladoId } = useParams<{ simuladoId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [simulado, setSimulado] = useState<PracticeResponseDTO | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSimulado = async () => {
      if (!simuladoId) return
      try {
        const practice = await PracticeMentorAPI.getPracticeById(simuladoId)
        setSimulado(practice)
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao carregar o simulado",
          variant: "destructive"
        })
        navigate("/mentor/simulados")
      } finally {
        setLoading(false)
      }
    }
    fetchSimulado()
  }, [simuladoId, navigate, toast])

  if (loading) {
    return <div className="container py-8">Carregando...</div>
  }

  if (!simulado) {
    return <div className="container py-8">Simulado não encontrado</div>
  }

  const questions = Array.from(simulado.questions)
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const currentQuestionData = questions[currentQuestion]

  return (
    <div className="container py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{simulado.title}</h1>
          <p className="text-muted-foreground">
            Questão {currentQuestion + 1} de {questions.length}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="flex gap-2">
            <Clock className="w-4 h-4" />
            {Math.floor(simulado.duracao / 60)}:{(simulado.duracao % 60).toString().padStart(2, '0')}
          </Badge>
        </div>
      </div>

      <Progress value={progress} className="w-full" />

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Questão {currentQuestion + 1}: {currentQuestionData.title}
            </h3>
            <div className="space-y-2">
              {Array.from(currentQuestionData.options).map((option) => (
                <Button
                  key={option.id}
                  variant={option.correct ? "default" : "outline"}
                  className="w-full justify-start h-auto py-4 px-6"
                  disabled
                >
                  <span className="mr-4">{option.title}</span>
                  {option.correct && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              Anterior
            </Button>
            <Button
              onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
              disabled={currentQuestion === questions.length - 1}
            >
              Próxima
            </Button>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Todas as Questões
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((_, idx) => (
              <Button
                key={idx}
                variant={idx === currentQuestion ? "default" : "outline"}
                className="w-full h-10"
                onClick={() => setCurrentQuestion(idx)}
              >
                {idx + 1}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}