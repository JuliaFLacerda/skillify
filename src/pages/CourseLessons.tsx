
import { useState } from "react"
import { useParams } from "react-router-dom"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CoursePlayer } from "@/components/CoursePlayer"
import { CourseChat } from "@/components/CourseChat"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { toast } from "sonner"

const mockCourseData = {
  id: "1",
  title: "Fundamentos do React",
  description: "Aprenda React do zero ao avançado",
  thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
  progress: 65,
  totalLessons: 24,
  completedLessons: 16,
  category: "Desenvolvimento Frontend",
  level: "intermediate" as const,
  duration: "8 semanas",
  currentLesson: {
    id: "l1",
    title: "Introdução ao React",
    videoUrl: "https://example.com/video1",
    completed: false
  },
  modules: [
    {
      id: "m1",
      title: "Introdução",
      lessons: [
        {
          id: "l1",
          title: "Introdução ao React",
          videoUrl: "https://example.com/video1",
          completed: false
        },
        {
          id: "l2",
          title: "Configurando o Ambiente",
          videoUrl: "https://example.com/video2",
          completed: false
        }
      ]
    },
    {
      id: "m2",
      title: "Fundamentos",
      lessons: [
        {
          id: "l3",
          title: "Componentes React",
          videoUrl: "https://example.com/video3",
          completed: false
        },
        {
          id: "l4",
          title: "Props e Estado",
          videoUrl: "https://example.com/video4",
          completed: false
        }
      ]
    }
  ],
  quiz: {
    id: "q1",
    questions: [
      {
        id: "q1_1",
        question: "O que é React?",
        options: [
          "Uma linguagem de programação",
          "Uma biblioteca JavaScript para construção de interfaces",
          "Um banco de dados",
          "Um servidor web"
        ],
        correctAnswer: 1
      },
      {
        id: "q1_2",
        question: "O que são componentes React?",
        options: [
          "Arquivos CSS",
          "Funções JavaScript",
          "Blocos de construção reutilizáveis da UI",
          "Arquivos HTML"
        ],
        correctAnswer: 2
      }
    ]
  }
}

const CourseLessons = () => {
  const { id } = useParams()
  const [course] = useState(mockCourseData)

  const handleLessonComplete = (lessonId: string) => {
    toast.success("Lição concluída com sucesso!")
    // Aqui você implementaria a lógica para marcar a lição como concluída
  }

  return (
    <div className="h-screen flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={75}>
          <ScrollArea className="h-full">
            <CoursePlayer course={course} onLessonComplete={handleLessonComplete} />
          </ScrollArea>
        </ResizablePanel>
        
        <ResizableHandle />
        
        <ResizablePanel defaultSize={25}>
          <CourseChat />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default CourseLessons
