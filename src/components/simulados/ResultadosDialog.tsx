import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { Trophy, Users, Target } from "lucide-react"
import { PracticeExecutionResponseDTO } from "@/api/dtos/practiceExecutionDtos"

interface ResultadosDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  executions: PracticeExecutionResponseDTO[]
}

export function ResultadosDialog({ open, onOpenChange, executions }: ResultadosDialogProps) {
  // Calculate overall statistics
  const totalParticipants = new Set(executions.map(exec => exec.student.id)).size
  const averageScore = executions.length > 0 
    ? Math.round(executions.reduce((sum, exec) => sum + exec.correctAnswers, 0) / executions.length)
    : 0
  const totalPossible = executions.length > 0 
    ? executions[0].practice.numberOfQuestions 
    : 1
  const hitRate = totalPossible > 0 
    ? Math.round((averageScore / totalPossible) * 100) 
    : 0

  // Calculate subject performance based on courses
  const subjectBreakdown = executions.length > 0 
    ? Array.from(new Set(executions[0].practice.courses.map(course => course.name))).map((courseName, index) => {
        const courseQuestions = executions.flatMap(exec => 
          Array.from(exec.practice.questions).filter(q => 
            q.course?.name.toLowerCase() === courseName.toLowerCase()
          )
        )
        const courseCorrect = executions.reduce((sum, exec) => {
          const correctInCourse = Array.from(exec.selectedAnswers).filter(answer => 
            answer.correct && courseQuestions.some(q => q.options.some(opt => opt.id === answer.id))
          ).length
          return sum + correctInCourse
        }, 0)
        const totalCourseQuestions = courseQuestions.length * executions.length
        const score = totalCourseQuestions > 0 
          ? Math.round((courseCorrect / totalCourseQuestions) * 100) 
          : 0

        return {
          subject: courseName,
          score,
          color: `text-${['blue', 'green', 'yellow', 'purple', 'red', 'pink'][index % 6]}-500`
        }
      })
    : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-white">Resultados Parciais</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-white/5 border-slate-800">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-sm text-slate-400">Participantes</p>
                  <p className="text-2xl font-bold text-white">{totalParticipants}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-white/5 border-slate-800">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-amber-400" />
                <div>
                  <p className="text-sm text-slate-400">Média Geral</p>
                  <p className="text-2xl font-bold text-white">{averageScore}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-white/5 border-slate-800">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-emerald-400" />
                <div>
                  <p className="text-sm text-slate-400">Taxa de Acerto</p>
                  <p className="text-2xl font-bold text-white">{hitRate}%</p>
                </div>
              </div>
            </Card>
          </div>

          {subjectBreakdown.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Desempenho por Área</h2>
              {subjectBreakdown.map((subject) => (
                <div key={subject.subject} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={subject.color}>{subject.subject}</span>
                    <span className="text-slate-400">{subject.score}%</span>
                  </div>
                  <Progress value={subject.score} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}