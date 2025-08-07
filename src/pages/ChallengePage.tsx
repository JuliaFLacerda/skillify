
import { useParams } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Trophy,
  Clock,
  Target,
  CheckCircle2,
  BookOpen,
} from "lucide-react"
import { toast } from "sonner"

const mockChallenge = {
  id: "1",
  title: "Desafio de Redação",
  description: "Escreva 7 redações em 7 dias",
  progress: 3,
  total: 7,
  deadline: "2024-03-20",
  xpReward: 1000,
  streakDays: 3,
  tasks: [
    { id: 1, title: "Redação 1", completed: true },
    { id: 2, title: "Redação 2", completed: true },
    { id: 3, title: "Redação 3", completed: true },
    { id: 4, title: "Redação 4", completed: false },
    { id: 5, title: "Redação 5", completed: false },
    { id: 6, title: "Redação 6", completed: false },
    { id: 7, title: "Redação 7", completed: false },
  ],
}

export default function ChallengePage() {
  const { id } = useParams()
  const progress = (mockChallenge.progress / mockChallenge.total) * 100

  const handleCompleteTask = (taskId: number) => {
    toast.success("Tarefa concluída!")
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{mockChallenge.title}</h1>
            <p className="text-muted-foreground">{mockChallenge.description}</p>
          </div>
          <div className="space-y-2">
            <Badge variant="outline" className="flex gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              {mockChallenge.xpReward} XP
            </Badge>
            <Badge variant="secondary" className="flex gap-2">
              <Clock className="w-4 h-4" />
              {new Date(mockChallenge.deadline).toLocaleDateString()}
            </Badge>
          </div>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Progresso Geral</p>
                <div className="text-2xl font-bold">
                  {mockChallenge.progress} de {mockChallenge.total} completadas
                </div>
              </div>
              <Target className="w-8 h-8 text-primary" />
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </Card>
      </div>

      <div className="grid gap-4">
        {mockChallenge.tasks.map((task) => (
          <Card key={task.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {task.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                )}
                <span className="font-medium">{task.title}</span>
              </div>
              {!task.completed && (
                <Button onClick={() => handleCompleteTask(task.id)}>
                  Concluir
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button className="px-8">
          <BookOpen className="w-4 h-4 mr-2" />
          Começar Próxima Tarefa
        </Button>
      </div>
    </div>
  )
}
