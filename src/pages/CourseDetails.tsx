import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Clock,
  PlayCircle,
  FileText,
  CheckCircle2,
  Trophy,
  Users,
} from "lucide-react"
import { toast } from "sonner"

const mockCourseData = {
  id: "1",
  title: "Fundamentos do React",
  description:
    "Domine os fundamentos do desenvolvimento React através de projetos práticos e exemplos do mundo real. Aprenda arquitetura de componentes, gerenciamento de estado, hooks e práticas modernas do React.",
  instructor: {
    name: "Sarah Johnson",
    role: "Desenvolvedora Frontend Sênior",
    avatar: "/placeholder.svg",
  },
  duration: "8 semanas",
  totalLessons: 24,
  completedLessons: 16,
  level: "Intermediário",
  category: "Desenvolvimento Frontend",
  rating: 4.8,
  totalStudents: 1234,
  lastUpdated: "2024-02-15",
  thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
  modules: [
    {
      id: "m1",
      title: "Começando com React",
      lessons: [
        {
          id: "l1",
          title: "Introdução ao React",
          duration: "15 min",
          type: "video",
          completed: true,
        },
        {
          id: "l2",
          title: "Configurando seu Ambiente de Desenvolvimento",
          duration: "20 min",
          type: "video",
          completed: true,
        },
        {
          id: "l3",
          title: "Seu Primeiro Componente React",
          duration: "25 min",
          type: "video",
          completed: false,
        },
      ],
    },
    {
      id: "m2",
      title: "Componentes React & Props",
      lessons: [
        {
          id: "l4",
          title: "Ciclo de Vida do Componente",
          duration: "30 min",
          type: "video",
          completed: false,
        },
        {
          id: "l5",
          title: "Props e Estado",
          duration: "25 min",
          type: "video",
          completed: false,
        },
        {
          id: "l6",
          title: "Projeto do Módulo",
          duration: "45 min",
          type: "project",
          completed: false,
        },
      ],
    },
  ],
}

const CourseDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const course = mockCourseData

  const handleContinueCourse = () => {
    navigate(`/cursos/${id}/aula`)
    toast.success("Aula carregada com sucesso!")
  }

  const completionPercentage = Math.round(
    (course.completedLessons / course.totalLessons) * 100
  )

  return (
    <div className="container py-8 space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Badge variant="secondary">{course.category}</Badge>
            <Badge variant="outline">{course.level}</Badge>
          </div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">{course.description}</p>
          <div className="flex items-center gap-4">
            <img
              src={course.instructor.avatar}
              alt={course.instructor.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-medium">{course.instructor.name}</p>
              <p className="text-sm text-muted-foreground">
                {course.instructor.role}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full aspect-video rounded-lg object-cover"
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{course.totalLessons} aulas</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{course.level}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{course.totalStudents} alunos</span>
            </div>
          </div>
          {completionPercentage > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Seu progresso</span>
                <span>{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} />
            </div>
          )}
          <Button className="w-full" onClick={handleContinueCourse}>
            {completionPercentage > 0 ? "Continuar Curso" : "Começar Curso"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="curriculum" className="space-y-4">
        <TabsList>
          <TabsTrigger value="curriculum">Currículo</TabsTrigger>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="reviews">Avaliações</TabsTrigger>
        </TabsList>

        <TabsContent value="curriculum" className="space-y-4">
          <div className="grid gap-4">
            <Accordion type="single" collapsible className="w-full">
              {course.modules.map((module) => (
                <AccordionItem key={module.id} value={module.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span>{module.title}</span>
                      <Badge variant="outline" className="ml-2">
                        {module.lessons.length} lessons
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                        >
                          <div className="flex items-center gap-2">
                            {lesson.type === "video" ? (
                              <PlayCircle className="w-4 h-4" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                            <span>{lesson.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {lesson.duration}
                            </span>
                            {lesson.completed && (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </TabsContent>

        <TabsContent value="overview">
          <div className="prose max-w-none">
            <h3>Course Overview</h3>
            <p>
              This comprehensive course will take you from the basics of React to
              building complex applications. Through hands-on projects and
              real-world examples, you'll learn:
            </p>
            <ul>
              <li>Component architecture and best practices</li>
              <li>State management with hooks</li>
              <li>Routing and navigation</li>
              <li>Form handling and validation</li>
              <li>API integration and data fetching</li>
              <li>Performance optimization</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Reviews coming soon!</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CourseDetails
