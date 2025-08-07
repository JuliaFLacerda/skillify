import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from 'react'
import { UserAdminAPI } from '@/api/admin/controllers/UserAdminAPI'
import { CourseAdminAPI } from '@/api/admin/controllers/CourseAdminAPI'
import { UserResponseDTO } from "@/api/dtos/userDtos"
import { CourseResponseDTO } from "@/api/dtos/courseDtos"

interface NewClassDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (e: React.FormEvent, values: { name: string; mentorId: string; courseIds: string[] }) => void
}

export function NewClassDialog({ open, onOpenChange, onSubmit }: NewClassDialogProps) {
  const [mentors, setMentors] = useState<UserResponseDTO[]>([])
  const [courses, setCourses] = useState<CourseResponseDTO[]>([])
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [mentorUsers, courseData] = await Promise.all([
          UserAdminAPI.getAllMentors(),
          CourseAdminAPI.getAllCourses()
        ])
        setMentors(mentorUsers)
        setCourses(courseData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (open) {
      fetchData()
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const values = {
      name: formData.get('name') as string,
      mentorId: formData.get('mentor') as string,
      courseIds: selectedCourses
    }
    onSubmit(e, values)
  }

  const handleCourseToggle = (courseId: string) => {
    setSelectedCourses(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Turma</DialogTitle>
          <DialogDescription>
            Preencha as informações da nova turma abaixo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da turma</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mentor">Mentor responsável</Label>
            <Select name="mentor" disabled={loading}>
              <SelectTrigger>
                <SelectValue 
                  placeholder={
                    loading ? "Carregando mentores..." : "Selecione um mentor"
                  } 
                />
              </SelectTrigger>
              <SelectContent>
                {mentors.map((mentor) => (
                  <SelectItem key={mentor.id} value={mentor.id}>
                    {mentor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Cursos (opcional)</Label>
            <div className="max-h-40 overflow-y-auto border rounded-md p-2">
              {courses.map((course) => (
                <div key={course.id} className="flex items-center space-x-2 py-1">
                  <input
                    type="checkbox"
                    id={`course-${course.id}`}
                    checked={selectedCourses.includes(course.id)}
                    onChange={() => handleCourseToggle(course.id)}
                  />
                  <label htmlFor={`course-${course.id}`}>{course.name}</label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              Criar Turma
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}