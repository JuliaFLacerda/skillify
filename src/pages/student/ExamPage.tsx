import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Trophy, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { PracticeStudentAPI } from "@/api/student/controllers/PracticeStudentAPI"
import { PracticeResponseDTO } from "@/api/dtos/practiceDtos"
import { QuestionResponseDTO, QuestionContentType } from "@/api/dtos/questionDtos"
import { PracticeExecutionStudentAPI } from "@/api/student/controllers/PracticeExecutionStudentAPI"
import { PracticeExecutionCreateDTO } from "@/api/dtos/practiceExecutionDtos"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type UserAnswer = {
  questionId: string;
  optionId: string | null;
};

export default function ExamPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [practice, setPractice] = useState<PracticeResponseDTO | null>(null)
  const [questions, setQuestions] = useState<QuestionResponseDTO[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [startTime, setStartTime] = useState<number | null>(null) // New state for tracking start time
  const [isFinished, setIsFinished] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch practice data
  useEffect(() => {
    const fetchPractice = async () => {
      if (!id) return

      try {
        setIsLoading(true)
        setIsFinished(false)
        const practiceData = await PracticeStudentAPI.getPracticeById(id)
        setPractice(practiceData)
        const questionsArray = Array.from(practiceData.questions)
        setQuestions(questionsArray)
        setTimeLeft(practiceData.duracao * 60)
        setStartTime(Date.now()) // Set start time when practice loads
        setUserAnswers(questionsArray.map(question => ({
          questionId: question.id,
          optionId: null
        })))
      } catch (err) {
        setError("Failed to load practice. Please try again later.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPractice()
  }, [id])

  // Timer logic
  useEffect(() => {
    if (isLoading || timeLeft === null || isFinished) return

    if (timeLeft <= 0) {
      handleAutoSubmit()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev !== null ? prev - 1 : null))
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, isFinished, isLoading])

  const handleOptionSelect = (optionId: string) => {
    setUserAnswers(prev => {
      const newAnswers = [...prev]
      newAnswers[currentQuestionIndex] = {
        questionId: questions[currentQuestionIndex].id,
        optionId
      }
      return newAnswers
    })
  }

  const handleAutoSubmit = async () => {
    setShowConfirmation(false)
    await submitExam()
  }

  const handleConfirmFinish = () => {
    const unansweredQuestions = userAnswers.filter(answer => !answer.optionId).length
    if (unansweredQuestions > 0) {
      toast.warning(`Você tem ${unansweredQuestions} questão(ões) não respondida(s). Deseja finalizar mesmo assim?`)
    }
    setShowConfirmation(true)
  }

  const submitExam = async () => {
    try {
      setIsSubmitting(true)

      const correctAnswers = userAnswers.reduce((count, answer, index) => {
        const question = questions[index]
        if (!question || !answer.optionId) return count
        const selectedOption = Array.from(question.options).find(opt => opt.id === answer.optionId)
        return selectedOption?.correct ? count + 1 : count
      }, 0)

      // Calculate duration in seconds
      const endTime = Date.now()
      const duration = startTime ? Math.floor((endTime - startTime) / 1000) : 0

      const executionData: PracticeExecutionCreateDTO = {
        studentId: localStorage.getItem("userId") || "",
        practiceId: id!,
        selectedAnswerIds: userAnswers
          .map(answer => answer.optionId)
          .filter(Boolean) as string[],
        correctAnswers,
        duration // Add duration to the execution data
      }

      console.log(executionData)

      const execution = await PracticeExecutionStudentAPI.createPracticeExecution(executionData)
      
      setIsFinished(true)
      toast.success("Simulado concluído! Parabéns!")
      navigate(`/dashboard/simulados/resultado/${execution.id}`)
    } catch (error) {
      console.error('Error finishing exam:', error)
      toast.error("Ocorreu um erro ao finalizar o simulado")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "N/A"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const renderQuestionContent = (question: QuestionResponseDTO) => {
    if (!question.content || question.content.length === 0) {
      return <p className="text-muted-foreground">{question.title}</p>
    }
  
    return (
      <div className="space-y-4">
        {question.content
          .sort((a, b) => a.position - b.position)
          .map((content) => {
            return (
              <div key={content.id} className="content-block">
                {content.type === QuestionContentType.TEXT ? (
                  <p className="text-muted-foreground">{content.value}</p>
                ) : (
                  <div className="image-container bg-gray-100 rounded-md p-2">
                    <img 
                      src={content.value}
                      alt="Question content"
                      className="max-h-96 mx-auto block"
                      onLoad={() => console.log('Image loaded successfully:', content.value)}
                      onError={(e) => {
                        console.error('Image failed to load:', content.value);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = `
                          <div class="text-center text-gray-500">
                            <p>Image not available</p>
                          </div>
                        `;
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
      </div>
    );
  };

  if (isLoading) {
    return <div className="container py-8">Loading practice...</div>
  }

  if (error) {
    return <div className="container py-8 text-destructive">{error}</div>
  }

  if (!practice) {
    return <div className="container py-8">Practice not found</div>
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const currentAnswer = userAnswers[currentQuestionIndex]?.optionId
  const answeredQuestions = userAnswers.filter(answer => answer.optionId !== null).length

  return (
    <div className="container py-8 space-y-6">
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizar Simulado</DialogTitle>
            <DialogDescription>
              Você respondeu {answeredQuestions} de {questions.length} questões. 
              {answeredQuestions < questions.length && (
                <span className="text-yellow-600 font-medium"> Você tem {questions.length - answeredQuestions} questão(ões) não respondida(s).</span>
              )}
              <br />
              Tem certeza que deseja finalizar agora?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={submitExam}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Finalizar Simulado"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{practice.title}</h1>
          <p className="text-muted-foreground">
            Questão {currentQuestionIndex + 1} de {questions.length}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            {questions.length * 10} XP
          </Badge>
          <Badge variant={timeLeft !== null && timeLeft < 300 ? "destructive" : "secondary"} className="flex gap-2">
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </Badge>
        </div>
      </div>

      <Progress value={progress} className="w-full" />

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <Card className="p-6 space-y-6">
          {currentQuestion ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Questão {currentQuestionIndex + 1}
              </h3>
              
              {renderQuestionContent(currentQuestion)}

              <div className="space-y-2">
                {Array.from(currentQuestion.options).map((option, index) => (
                  <Button
                    key={option.id}
                    variant={
                      currentAnswer === option.id 
                        ? "secondary" 
                        : "outline"
                    }
                    className="w-full justify-start h-auto py-4 px-6"
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    <span className="font-semibold mr-4">
                      {String.fromCharCode(65 + index)})
                    </span>
                    {option.title}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div>Question not available</div>
          )}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
            >
              Anterior
            </Button>
            {currentQuestionIndex === questions.length - 1 ? (
              <Button onClick={handleConfirmFinish}>
                Finalizar Simulado
              </Button>
            ) : (
              <Button 
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                disabled={currentQuestionIndex === questions.length - 1}
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
            {questions.map((_, idx) => (
              <Button
                key={idx}
                variant={
                  idx === currentQuestionIndex 
                    ? "default" 
                    : userAnswers[idx]?.optionId 
                      ? "secondary" 
                      : "outline"
                }
                className="w-full h-10"
                onClick={() => setCurrentQuestionIndex(idx)}
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