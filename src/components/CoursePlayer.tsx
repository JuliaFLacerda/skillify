import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, PlayCircle, RotateCcw } from "lucide-react"
import { Course } from "@/types"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"

interface CoursePlayerProps {
  course: Course
  onLessonComplete: (lessonId: string) => void
}

export function CoursePlayer({ course, onLessonComplete }: CoursePlayerProps) {
  const [currentVideo, setCurrentVideo] = useState(course.currentLesson?.videoUrl)
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})

  const handleLessonClick = (videoUrl: string, lessonId: string) => {
    setCurrentVideo(videoUrl)
    setShowQuiz(false)
    // Update current lesson in course object
    course.currentLesson = course.modules?.flatMap(m => m.lessons).find(l => l.id === lessonId)
    toast.success("Aula carregada com sucesso!")
  }

  const handleQuizSubmit = () => {
    // Aqui você implementaria a lógica para verificar as respostas
    // e dar feedback ao usuário
    onLessonComplete(course.currentLesson?.id || "")
  }

  const handleRetryQuiz = () => {
    setSelectedAnswers({})
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        {showQuiz ? (
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Quiz da Aula</h3>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleRetryQuiz}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
              {course.quiz?.questions.map((question, idx) => (
                <div key={question.id} className="space-y-4">
                  <p className="font-medium">
                    {idx + 1}. {question.question}
                  </p>
                  <div className="space-y-2">
                    {question.options.map((option, optionIdx) => (
                      <Button
                        key={optionIdx}
                        variant={
                          selectedAnswers[question.id] === optionIdx
                            ? "default"
                            : "outline"
                        }
                        className="w-full justify-start"
                        onClick={() =>
                          setSelectedAnswers((prev) => ({
                            ...prev,
                            [question.id]: optionIdx,
                          }))
                        }
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              <Button
                className="w-full"
                onClick={handleQuizSubmit}
                disabled={
                  Object.keys(selectedAnswers).length !==
                  (course.quiz?.questions.length || 0)
                }
              >
                Enviar Respostas
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            {currentVideo ? (
              <iframe
                src={currentVideo}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <PlayCircle className="w-16 h-16 text-primary animate-pulse" />
              </div>
            )}
          </div>
        )}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setShowQuiz(!showQuiz)}
          >
            {showQuiz ? "Voltar ao Vídeo" : "Fazer Quiz"}
          </Button>
          {!showQuiz && (
            <Button onClick={() => setShowQuiz(true)}>
              Próxima Aula
            </Button>
          )}
        </div>
      </div>

      <Card className="bg-background">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">Playlist do Curso</h3>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {course.modules?.map((module) => (
                <div key={module.id} className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    {module.title}
                  </h4>
                  {module.lessons.map((lesson) => (
                    <Button
                      key={lesson.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start",
                        lesson.completed && "text-primary",
                        course.currentLesson?.id === lesson.id && "bg-accent"
                      )}
                      onClick={() => handleLessonClick(lesson.videoUrl, lesson.id)}
                    >
                      <div className="flex items-center gap-2">
                        {lesson.completed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <PlayCircle className="w-4 h-4" />
                        )}
                        <span>{lesson.title}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
