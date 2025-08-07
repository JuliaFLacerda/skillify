
import { useState } from "react"
import { useParams } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Trophy, CheckCircle2, HelpCircle } from "lucide-react"
import { toast } from "sonner"

const mockExam = {
  id: "1",
  title: "Simulado Nacional ENEM 2024",
  totalQuestions: 90,
  timeLimit: 180, // minutes
  xpReward: 500,
  subjects: ["Matemática", "Português", "Ciências", "Humanas"],
}

export default function ExamPage() {
  const { id } = useParams()
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [timeLeft, setTimeLeft] = useState(mockExam.timeLimit * 60) // in seconds
  const [isFinished, setIsFinished] = useState(false)

  const progress = (currentQuestion / mockExam.totalQuestions) * 100

  const handleFinishExam = () => {
    setIsFinished(true)
    toast.success("Simulado concluído! Parabéns!")
    window.location.href = `/simulados/resultado/${id}`
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{mockExam.title}</h1>
          <p className="text-muted-foreground">
            Questão {currentQuestion} de {mockExam.totalQuestions}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            {mockExam.xpReward} XP
          </Badge>
          <Badge variant="secondary" className="flex gap-2">
            <Clock className="w-4 h-4" />
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </Badge>
        </div>
      </div>

      <Progress value={progress} className="w-full" />

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Questão {currentQuestion}
            </h3>
            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?
            </p>
            <div className="space-y-2">
              {['A', 'B', 'C', 'D', 'E'].map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  className="w-full justify-start h-auto py-4 px-6"
                >
                  <span className="font-semibold mr-4">{option})</span>
                  Alternativa {option}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(Math.max(1, currentQuestion - 1))}
              disabled={currentQuestion === 1}
            >
              Anterior
            </Button>
            {currentQuestion === mockExam.totalQuestions ? (
              <Button onClick={handleFinishExam}>
                Finalizar Simulado
              </Button>
            ) : (
              <Button 
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                disabled={currentQuestion === mockExam.totalQuestions}
              >
                Próxima
              </Button>
            )}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Questões Respondidas
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: mockExam.totalQuestions }).map((_, idx) => (
              <Button
                key={idx}
                variant={idx + 1 === currentQuestion ? "default" : "outline"}
                className="w-full h-10"
                onClick={() => setCurrentQuestion(idx + 1)}
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
