import { useParams, useNavigate } from "react-router-dom" // Added useNavigate
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Trophy,
  Target,
  Zap,
  Clock,
  BookOpen,
} from "lucide-react"
import { PracticeExecutionStudentAPI } from "@/api/student/controllers/PracticeExecutionStudentAPI"
import { PracticeStudentAPI } from "@/api/student/controllers/PracticeStudentAPI"
import { PracticeExecutionResponseDTO } from "@/api/dtos/practiceExecutionDtos"
import { PracticeResponseDTO } from "@/api/dtos/practiceDtos"

export default function ExamResults() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate() // Added navigate hook
  const [execution, setExecution] = useState<PracticeExecutionResponseDTO | null>(null)
  const [practice, setPractice] = useState<PracticeResponseDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("No execution ID provided")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        const executionData = await PracticeExecutionStudentAPI.getPracticeExecutionById(id)
        setExecution(executionData)

        const practiceData = await PracticeStudentAPI.getPracticeById(executionData.practice.id)
        setPractice(practiceData)
      } catch (err) {
        setError("Failed to load exam results: " + (err instanceof Error ? err.message : String(err)))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "N/A"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const results = (() => {
    if (!execution || !practice) return null
    
    if (!execution.practice?.numberOfQuestions || !execution.correctAnswers) {
      console.error('Missing required data:', { 
        numberOfQuestions: execution.practice?.numberOfQuestions, 
        correctAnswers: execution.correctAnswers,
        courses: practice.courses 
      })
      return null
    }

    const courses = practice.courses ? Array.from(practice.courses) : null

    return {
      score: execution.correctAnswers * 100,
      maxScore: execution.practice.numberOfQuestions * 100,
      correctAnswers: execution.correctAnswers,
      totalQuestions: execution.practice.numberOfQuestions,
      timeSpent: formatDuration(execution.duration),
      xpEarned: execution.correctAnswers * 10,
      subjectBreakdown: courses?.map((course, index) => {
        const baseScore = (execution.correctAnswers / execution.practice.numberOfQuestions) * 100
        const variation = 0;
        const score = Math.max(0, Math.min(100, Math.round(baseScore + variation)))
        
        return {
          subject: course.name ?? 'Unknown Course',
          score,
          color: `text-${['blue', 'green', 'yellow', 'purple', 'red', 'pink'][index % 6]}-500`
        }
      })
    }
  })()

  if (loading) {
    return <div className="container py-8 text-center">Loading...</div>
  }

  if (error || !results) {
    return <div className="container py-8 text-center text-red-500">{error || "No results available - data might be incomplete"}</div>
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Resultado do Simulado</h1>
        <div className="flex justify-center items-center gap-4">
          <Badge variant="secondary" className="text-xl py-2 px-4">
            {results.score} / {results.maxScore}
          </Badge>
          <Badge variant="outline" className="flex gap-2 py-2 px-4">
            <Trophy className="w-5 h-5 text-yellow-500" />
            +{results.xpEarned} XP
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
                {results.correctAnswers} / {results.totalQuestions}
              </p>
            </div>
          </div>
          <Progress 
            value={(results.correctAnswers / results.totalQuestions) * 100} 
            className="mt-4"
          />
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Clock className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Tempo Total</p>
              <p className="text-2xl font-bold">{results.timeSpent}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Zap className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">XP Ganho</p>
              <p className="text-2xl font-bold">+{results.xpEarned}</p>
            </div>
          </div>
        </Card>
      </div>

      {results.subjectBreakdown && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">Desempenho por Área</h2>
          <div className="space-y-6">
            {results.subjectBreakdown.map((subject) => (
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
      )}

      <div className="flex justify-center">
        <Button onClick={() => navigate('/dashboard/simulados')}>
          <BookOpen className="w-4 h-4 mr-2" />
          Novo Simulado
        </Button>
      </div>
    </div>
  )
}