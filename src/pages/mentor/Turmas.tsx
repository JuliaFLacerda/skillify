import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Users, Link as LinkIcon, Calendar, GraduationCap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ClassroomMentorAPI } from "@/api/mentor/controllers/ClassroomMentorAPI"
import { ClassroomAccessTokenMentorAPI } from "@/api/mentor/controllers/ClassroomAccessTokenMentorAPI"
import { ClassroomResponseDTO } from "@/api/dtos/classroomDtos"
import { ClassroomAccessTokenResponseDTO } from "@/api/dtos/classroomAccessTokenDtos"

const MentorTurmas = () => {
  const { toast } = useToast()
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [isStudentsDialogOpen, setIsStudentsDialogOpen] = useState(false)
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [registrationLink, setRegistrationLink] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [studentSearchQuery, setStudentSearchQuery] = useState("")
  const [classrooms, setClassrooms] = useState<ClassroomResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        setLoading(true)
        const classroomData = await ClassroomMentorAPI.getAllClassrooms()
        setClassrooms(classroomData)
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao carregar as turmas",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchClassrooms()
  }, [toast])

  const filteredClassrooms = classrooms.filter(classroom =>
    classroom.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const generateLink = async (classroomId: string) => {
    try {
      const generatedToken: ClassroomAccessTokenResponseDTO = await ClassroomAccessTokenMentorAPI.generateToken(classroomId)
      const className = classrooms.find(c => c.id === classroomId)?.name || ""
      setSelectedClassId(classroomId)
      setRegistrationLink(`${window.location.origin}/registro?classId=${generatedToken.token}`)
      setIsLinkDialogOpen(true)
    } catch (error) {
      toast({
        title: "Erro ao gerar link",
        description: "Não foi possível gerar o link de registro.",
        variant: "destructive",
      })
    }
  }

  const handleCopyLink = () => {
    if (registrationLink) {
      navigator.clipboard.writeText(registrationLink)
      toast({
        title: "Link copiado!",
        description: "O link de cadastro foi copiado para sua área de transferência.",
      })
      setIsLinkDialogOpen(false)
    }
  }

  const openStudentsDialog = (classroomId: string) => {
    const classroom = classrooms.find(c => c.id === classroomId)
    if (classroom) {
      setSelectedClassId(classroomId)
      setSelectedStudents(classroom.students.map(student => student.id))
      setStudentSearchQuery("")
      setIsStudentsDialogOpen(true)
    }
  }

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const handleSaveStudents = async () => {
    if (!selectedClassId) return
    try {
      const updatedClassroom = await ClassroomMentorAPI.updateClassroomStudents(selectedClassId, selectedStudents)
      setClassrooms(prev =>
        prev.map(c => c.id === selectedClassId ? updatedClassroom : c)
      )
      toast({
        title: "Sucesso",
        description: "Lista de alunos atualizada com sucesso.",
      })
      setIsStudentsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar a lista de alunos.",
        variant: "destructive",
      })
    }
  }

  const getStatus = (startDate: string) => {
    const today = new Date()
    const classroomStart = new Date(startDate)
    return today >= classroomStart ? "Em andamento" : "Planejada"
  }

  if (loading) {
    return <div className="container py-8">Carregando turmas...</div>
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Minhas Turmas
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie suas turmas e compartilhe links de cadastro
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Buscar turmas..." 
            className="pl-10 py-6 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredClassrooms.map((classroom) => (
          <Card 
            key={classroom.id}
            className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-primary/5"
          >
            <CardHeader>
              <div className="flex justify-between items-start mb-4">
                <Badge 
                  variant="outline" 
                  className={getStatus("2024-03-15") === "Em andamento" 
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}
                >
                  {getStatus("2024-03-15")}
                </Badge>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {classroom.students.length} alunos
                  </span>
                </div>
              </div>
              <CardTitle className="text-xl mb-4">{classroom.name}</CardTitle>
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="w-4 h-4" />
                  <span>Cursos:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {classroom.courses.length > 0 ? (
                    classroom.courses.map((course) => (
                      <Badge 
                        key={course.id}
                        variant="secondary"
                        className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                      >
                        {course.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Nenhum curso atribuído
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  onClick={() => generateLink(classroom.id)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Gerar Link de Cadastro
                </Button>
                <Button
                  onClick={() => openStudentsDialog(classroom.id)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Editar Alunos
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Link de Cadastro</DialogTitle>
            <DialogDescription>
              Compartilhe este link com os alunos para que eles possam se cadastrar na turma.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg break-all">
              {registrationLink}
            </div>
            <Button 
              onClick={handleCopyLink}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              Copiar Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isStudentsDialogOpen} onOpenChange={setIsStudentsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Alunos</DialogTitle>
            <DialogDescription>
              Selecione os alunos que devem fazer parte desta turma.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Buscar alunos..." 
                className="pl-10 py-6 text-lg"
                value={studentSearchQuery}
                onChange={(e) => setStudentSearchQuery(e.target.value)}
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {selectedClassId && classrooms
                .find(c => c.id === selectedClassId)
                ?.students
                .filter(student => 
                  student.name.toLowerCase().includes(studentSearchQuery.toLowerCase())
                )
                .map(student => (
                  <div key={student.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={student.id}
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={() => handleStudentToggle(student.id)}
                    />
                    <Label htmlFor={student.id} className="text-sm">
                      {student.name} ({student.email})
                    </Label>
                  </div>
                ))}
            </div>
            <Button 
              onClick={handleSaveStudents}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MentorTurmas