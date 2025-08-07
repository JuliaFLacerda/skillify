import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"
import { CourseMentorAPI } from '@/api/mentor/controllers/CourseMentorAPI'
import { CourseLessonMentorAPI } from '@/api/mentor/controllers/CourseLessonMentorAPI'
import { CourseResponseDTO } from '@/api/dtos/courseDtos'
import { CourseCard } from "@/components/mentor/CourseCard"
import { CourseDialogs } from "@/components/mentor/CourseDialogs"

interface CourseForm {
  name: string
  description: string
  level: string
  duration: number
  imageUrl?: string
}

interface EnhancedCourse extends CourseResponseDTO {
  lessonCount: number
  studentCount: number
  materialCount: number
}

const MentorCourses = () => {
  const { toast } = useToast()
  const [courses, setCourses] = useState<EnhancedCourse[]>([])
  const [isNewCourseOpen, setIsNewCourseOpen] = useState(false)
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<EnhancedCourse | null>(null)
  const [courseForm, setCourseForm] = useState<CourseForm>({
    name: "",
    description: "",
    level: "beginner",
    duration: 0,
    imageUrl: ""
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      const coursesResponse = await CourseMentorAPI.getAllCoursesByMentor()
      
      const enhancedCourses = await Promise.all(coursesResponse.map(async (course) => {
        const lessons = await CourseLessonMentorAPI.getLessonsByCourse(course.id)
        return {
          ...course,
          lessonCount: lessons.length,
          studentCount: 0,
          materialCount: lessons.reduce((acc, lesson) => acc + lesson.files.length, 0)
        }
      }))
      
      setCourses(enhancedCourses)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar os cursos",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewCourse = async () => {
    try {
      setIsLoading(true)
      const formData = {
        name: courseForm.name,
        description: courseForm.description,
        level: courseForm.level,
        duration: courseForm.duration,
        categoryIds: [],
        creatorId: 'current-user-id', // Replace with actual user ID logic
        imageUrl: courseForm.imageUrl || undefined
      }

      const newCourse = await CourseMentorAPI.createCourse(formData)
      const enhancedNewCourse: EnhancedCourse = {
        ...newCourse,
        lessonCount: 0,
        studentCount: 0,
        materialCount: 0
      }
      setCourses([...courses, enhancedNewCourse])
      setCourseForm({ name: "", description: "", level: "beginner", duration: 0, imageUrl: "" })
      setIsNewCourseOpen(false)
      toast({
        title: "Curso criado",
        description: "O novo curso foi criado com sucesso!"
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar o curso",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditCourse = async () => {
    if (!selectedCourse) return

    try {
      setIsLoading(true)
      const formData = {
        name: courseForm.name,
        description: courseForm.description,
        level: courseForm.level,
        duration: courseForm.duration,
        categoryIds: Array.from(selectedCourse.categories).map(c => c.id),
        creatorId: selectedCourse.creator.id,
        imageUrl: courseForm.imageUrl || selectedCourse.imageUrl
      }

      const updatedCourse = await CourseMentorAPI.updateCourse(selectedCourse.id, formData)
      const enhancedUpdatedCourse: EnhancedCourse = {
        ...updatedCourse,
        lessonCount: selectedCourse.lessonCount,
        studentCount: selectedCourse.studentCount,
        materialCount: selectedCourse.materialCount
      }
      setCourses(courses.map(c => c.id === updatedCourse.id ? enhancedUpdatedCourse : c))
      setIsEditCourseOpen(false)
      toast({
        title: "Curso atualizado",
        description: "O curso foi atualizado com sucesso!"
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar o curso",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Meus Cursos
          </h1>
          <p className="text-slate-400">
            Gerencie os cursos que você ministra
          </p>
        </div>
        <Button 
          onClick={() => setIsNewCourseOpen(true)} 
          className="bg-purple-600 hover:bg-purple-700 text-white border-none"
          disabled={isLoading}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Curso
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Buscar cursos..." 
          className="pl-10 bg-white/5 border-slate-800 text-white placeholder:text-slate-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="text-center text-white">Carregando cursos...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map(course => (
            <CourseCard 
              key={course.id}
              course={course}
              onEdit={() => {
                setSelectedCourse(course)
                setCourseForm({ 
                  name: course.name, 
                  description: course.description, 
                  level: course.level,
                  duration: course.duration,
                  imageUrl: course.imageUrl
                })
                setIsEditCourseOpen(true)
              }}
              onNewLesson={() => {
                // Instead of opening LessonDialogs here, redirect to the course page
                window.location.href = `/mentor/courses/${course.id}`
              }}
            />
          ))}
        </div>
      )}

      <CourseDialogs
        isOpen={isNewCourseOpen}
        onOpenChange={setIsNewCourseOpen}
        title="Criar Novo Curso"
        form={courseForm}
        onFormChange={setCourseForm}
        onSubmit={handleNewCourse}
        isLoading={isLoading}
      />

      <CourseDialogs
        isOpen={isEditCourseOpen}
        onOpenChange={setIsEditCourseOpen}
        title="Editar Curso"
        form={courseForm}
        onFormChange={setCourseForm}
        onSubmit={handleEditCourse}
        isLoading={isLoading}
        isEdit
      />
    </div>
  )
}

export default MentorCourses