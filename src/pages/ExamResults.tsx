
import { useParams } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Trophy,
  Target,
  Zap,
  Clock,
  BarChart,
  BookOpen,
} from "lucide-react"

const mockResults = {
  score: 850,
  maxScore: 1000,
  correctAnswers: 76,
  totalQuestions: 90,
  timeSpent: "4h 15min",
  xpEarned: 500,
  subjectBreakdown: [
    { subject: "Matemática", score: 85, color: "text-blue-500" },
    { subject: "Português", score: 92, color: "text-green-500" },
    { subject: "Ciências", score: 78, color: "text-yellow-500" },
    { subject: "Humanas", score: 88, color: "text-purple-500" },
  ],
}

export default function ExamResults() {
  const { id } = useParams()

  return (
    <div className="container py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Resultado do Simulado</h1>
        <div className="flex justify-center items-center gap-4">
          <Badge variant="secondary" className="text-xl py-2 px-4">
            {mockResults.score} / {mockResults.maxScore}
          </Badge>
          <Badge variant="outline" className="flex gap-2 py-2 px-4">
            <Trophy className="w-5 h-5 text-yellow-500" />
            +{mockResults.xpEarned} XP
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Target className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Acertos</p>
              <p className="text-2xl font-bold">
                {mockResults.correctAnswers} / {mockResults.totalQuestions}
              </p>
            </div>
          </div>
          <Progress 
            value={(mockResults.correctAnswers / mockResults.totalQuestions) * 100} 
            className="mt-4"
          />
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Clock className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Tempo Total</p>
              <p className="text-2xl font-bold">{mockResults.timeSpent}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Zap className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">XP Ganho</p>
              <p className="text-2xl font-bold">+{mockResults.xpEarned}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-6">Desempenho por Área</h2>
        <div className="space-y-6">
          {mockResults.subjectBreakdown.map((subject) => (
            <div key={subject.subject} className="space-y-2">
              <div className="flex justify-between">
                <span className={subject.color}>{subject.subject}</span>
                <span>{subject.score}%</span>
              </div>
              <Progress value={subject.score} />
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-center gap-4">
        <Button variant="outline">
          <BarChart className="w-4 h-4 mr-2" />
          Ver Detalhes
        </Button>
        <Button>
          <BookOpen className="w-4 h-4 mr-2" />
          Novo Simulado
        </Button>
      </div>
    </div>
  )
}
