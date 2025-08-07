import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Video, FileText, Pencil, Eye } from "lucide-react"
import { CourseResponseDTO } from "@/api/dtos/courseDtos"
import { useNavigate } from "react-router-dom"

interface EnhancedCourse extends CourseResponseDTO {
  lessonCount: number
  studentCount: number
  materialCount: number
}

interface CourseCardProps {
  course: EnhancedCourse
  onEdit: () => void
  onNewLesson: () => void
}

export const CourseCard = ({ course, onEdit, onNewLesson }: CourseCardProps) => {
  const navigate = useNavigate()

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-black/40 to-black/20 border-slate-800 hover:border-slate-700 transition-all duration-300">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <img 
            src={course.imageUrl || "https://images.unsplash.com/photo-1498050108023-c5249f4df085"}
            alt={course.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
          <div className="absolute bottom-0 p-4">
            <CardTitle className="text-xl text-white">{course.name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-lg bg-white/5 text-center">
            <Users className="w-4 h-4 mx-auto mb-1 text-purple-400" />
            <p className="text-sm font-medium text-white">{course.studentCount}</p>
            <p className="text-xs text-slate-400">Alunos</p>
          </div>
          <div className="p-3 rounded-lg bg-white/5 text-center">
            <Video className="w-4 h-4 mx-auto mb-1 text-indigo-400" />
            <p className="text-sm font-medium text-white">{course.lessonCount}</p>
            <p className="text-xs text-slate-400">Aulas</p>
          </div>
          <div className="p-3 rounded-lg bg-white/5 text-center">
            <FileText className="w-4 h-4 mx-auto mb-1 text-blue-400" />
            <p className="text-sm font-medium text-white">{course.materialCount}</p>
            <p className="text-xs text-slate-400">Materiais</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline"
            onClick={onEdit}
            className="bg-white/5 border-slate-800 hover:bg-white/10 hover:border-slate-700 text-white"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button
            onClick={() => navigate(`/mentor/cursos/${course.id}`)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white border-none"
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Curso
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}