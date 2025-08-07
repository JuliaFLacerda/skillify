import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Mail, MessageSquare, Send, Edit, Trash, Book } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { UserMentorAPI } from "@/api/mentor/controllers/UserMentorAPI"
import { ClassroomMentorAPI } from "@/api/mentor/controllers/ClassroomMentorAPI"
import { UserResponseDTO, RegisterRequest } from "@/api/dtos/userDtos"
import { MessageResponseDTO, MessageCreateDTO } from "@/api/dtos/messageDtos"
import { MessageMentorAPI } from "@/api/mentor/controllers/MessageMentorAPI"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ClassroomResponseDTO } from "@/api/dtos/classroomDtos"
import { MentorProgressStudent } from "@/api/dtos/mentorProgressDtos"
import { Checkbox } from "@/components/ui/checkbox"

const MentorStudents = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [selectedStudentChat, setSelectedStudentChat] = useState<string | null>(null)
  const [students, setStudents] = useState<UserResponseDTO[]>([])
  const [classrooms, setClassrooms] = useState<ClassroomResponseDTO[]>([])
  const [selectedClassroomId, setSelectedClassroomId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<MessageResponseDTO[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const [editStudentId, setEditStudentId] = useState<string | null>(null)
  const [createStudentOpen, setCreateStudentOpen] = useState(false)
  const [deleteStudentId, setDeleteStudentId] = useState<string | null>(null)
  const [editClassroomsStudentId, setEditClassroomsStudentId] = useState<string | null>(null)
  const [classroomSearchTerm, setClassroomSearchTerm] = useState("")
  const [selectedClassroomIds, setSelectedClassroomIds] = useState<string[]>([])
  const [editForm, setEditForm] = useState<RegisterRequest>({
    name: "",
    email: "",
    tel: "",
    biography: "",
    emailNotifications: false,
    pushNotifications: false,
    weeklyReport: false,
    studyReminder: false,
    role: "ESTUDANTE",
    password: ""
  })
  const [createForm, setCreateForm] = useState<RegisterRequest>({
    name: "",
    email: "",
    tel: "",
    biography: "",
    emailNotifications: false,
    pushNotifications: false,
    weeklyReport: false,
    studyReminder: false,
    role: "ESTUDANTE",
    password: ""
  })

  // Fetch classrooms and students on mount
  useEffect(() => {
    const fetchClassroomsAndStudents = async () => {
      setLoading(true)
      try {
        // Fetch classrooms
        const classroomResponse = await ClassroomMentorAPI.getAllClassrooms()
        const validClassrooms = classroomResponse.filter(
          (classroom) => classroom.id && classroom.id.trim() !== ""
        )
        setClassrooms(validClassrooms)
        if (validClassrooms.length > 0) {
          setSelectedClassroomId(validClassrooms[0].id)
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao carregar turmas",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchClassroomsAndStudents()
  }, [toast])

  // Fetch students when classroom changes
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClassroomId) return
      try {
        setLoading(true)
        const studentData: MentorProgressStudent[] = await UserMentorAPI.getStudentsForClassroom(selectedClassroomId)
        // Map MentorProgressStudent to UserResponseDTO by extracting the user property
        setStudents(studentData.map((student) => student.user))
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao carregar os alunos",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [selectedClassroomId, toast])

  // Fetch messages when chat opens
  useEffect(() => {
    if (selectedStudentChat) {
      fetchMessages(selectedStudentChat)
    }
  }, [selectedStudentChat])

  // Populate edit form when edit dialog opens
  useEffect(() => {
    if (editStudentId) {
      const student = students.find(s => s.id === editStudentId)
      if (student) {
        setEditForm({
          name: student.name,
          email: student.email,
          tel: student.tel || "",
          biography: student.biography || "",
          emailNotifications: student.emailNotifications || false,
          pushNotifications: student.pushNotifications || false,
          weeklyReport: student.weeklyReport || false,
          studyReminder: student.studyReminder || false,
          role: "ESTUDANTE",
          password: ""
        })
      }
    }
  }, [editStudentId, students])

  // Populate selected classrooms when edit classrooms dialog opens
  useEffect(() => {
    if (editClassroomsStudentId) {
      const fetchStudentClassrooms = async () => {
        try {
          // Fetch all classrooms to check which ones the student belongs to
          const allClassrooms = await ClassroomMentorAPI.getAllClassrooms()
          const studentClassrooms = allClassrooms.filter(classroom =>
            classroom.students.some(student => student.id === editClassroomsStudentId)
          )
          setSelectedClassroomIds(studentClassrooms.map(classroom => classroom.id))
        } catch (error) {
          toast({
            title: "Erro",
            description: "Falha ao carregar turmas do aluno",
            variant: "destructive"
          })
        }
      }
      fetchStudentClassrooms()
    }
  }, [editClassroomsStudentId, toast])

  const fetchMessages = async (studentId: string) => {
    try {
      setChatLoading(true)
      const messageData = await MessageMentorAPI.getMessagesWithStudent(studentId)
      setMessages(messageData)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar mensagens",
        variant: "destructive"
      })
    } finally {
      setChatLoading(false)
    }
  }

  const sendMessage = async (studentId: string) => {
    if (!newMessage.trim()) return

    try {
      const message: MessageCreateDTO = {
        remetenteId: localStorage.getItem("userId"),
        destinatarioId: studentId,
        content: newMessage
      }
      
      const sentMessage = await MessageMentorAPI.sendMessage(message)
      setMessages(prev => [...prev, sentMessage])
      setNewMessage("")
      toast({
        title: "Sucesso",
        description: "Mensagem enviada",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar mensagem",
        variant: "destructive"
      })
    }
  }

  const handleCreateStudent = async () => {
    if (!selectedClassroomId) {
      toast({
        title: "Erro",
        description: "Selecione uma turma antes de criar um aluno",
        variant: "destructive"
      })
      return
    }

    try {
      const newStudent = await UserMentorAPI.createStudent(createForm)
      setStudents(prev => [...prev, newStudent])
      setCreateStudentOpen(false)
      setCreateForm({
        name: "",
        email: "",
        tel: "",
        biography: "",
        emailNotifications: false,
        pushNotifications: false,
        weeklyReport: false,
        studyReminder: false,
        role: "ESTUDANTE",
        password: ""
      })
      toast({
        title: "Sucesso",
        description: "Aluno criado com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar aluno",
        variant: "destructive"
      })
    }
  }

  const handleUpdateStudent = async () => {
    if (!editStudentId) return

    try {
      const updatedStudent = await UserMentorAPI.updateStudentProfile(editStudentId, editForm)
      setStudents(prev => prev.map(s => s.id === editStudentId ? updatedStudent : s))
      setEditStudentId(null)
      toast({
        title: "Sucesso",
        description: "Perfil do aluno atualizado",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar perfil do aluno",
        variant: "destructive"
      })
    }
  }

  const handleDeleteStudent = async () => {
    if (!deleteStudentId) return

    try {
      await UserMentorAPI.deleteStudent(deleteStudentId)
      setStudents(prev => prev.filter(s => s.id !== deleteStudentId))
      setDeleteStudentId(null)
      toast({
        title: "Sucesso",
        description: "Aluno excluído",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao excluir aluno",
        variant: "destructive"
      })
    }
  }

  const handleUpdateStudentClassrooms = async () => {
    if (!editClassroomsStudentId) return

    try {
      await UserMentorAPI.updateStudentClassrooms(editClassroomsStudentId, selectedClassroomIds)
      setEditClassroomsStudentId(null)
      setClassroomSearchTerm("")
      setSelectedClassroomIds([])
      toast({
        title: "Sucesso",
        description: "Turmas do aluno atualizadas",
      })
      // Refresh students for the selected classroom
      if (selectedClassroomId) {
        const studentData = await UserMentorAPI.getStudentsForClassroom(selectedClassroomId)
        setStudents(studentData.map((student) => student.user))
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar turmas do aluno",
        variant: "destructive"
      })
    }
  }

  const handleViewProgress = (studentName: string) => {
    navigate("/mentor/progresso")
    toast({
      title: "Progresso do Aluno",
      description: `Visualizando progresso de ${studentName}`,
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredClassrooms = classrooms.filter(classroom =>
    classroom.name.toLowerCase().includes(classroomSearchTerm.toLowerCase())
  )

  const StudentCard = ({ student }: { student: UserResponseDTO }) => (
    <Card className="relative group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-primary/5">
      <CardHeader className="pb-2 px-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {student.avatar ? (
              <img 
                src={student.avatar} 
                alt={student.name} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                {getInitials(student.name)}
              </span>
            )}
          </span>
          {student.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className="space-y-2 pb-12">
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              {student.email}
            </p>
          </div>
        </div>
        <div className="absolute bottom-3 left-4 right-4 grid grid-cols-4 gap-2">
          <Button 
            variant="outline" 
            onClick={() => setSelectedStudentChat(student.id)}
            className="hover:bg-primary/5 h-7 text-xs px-5"
          >
            <MessageSquare className="w-3 h-3 mr-1" />
            Mensagem
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setEditStudentId(student.id)}
            className="hover:bg-primary/5 h-7 text-xs px-5"
          >
            <Edit className="w-3 h-3 mr-1" />
            Editar
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setEditClassroomsStudentId(student.id)}
            className="hover:bg-primary/5 h-7 text-xs px-5"
          >
            <Book className="w-3 h-3 mr-1" />
            Turmas
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setDeleteStudentId(student.id)}
            className="hover:bg-destructive/5 h-7 text-xs px-5"
          >
            <Trash className="w-3 h-3 mr-1" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Meus Alunos
          </h1>
          <p className="text-muted-foreground">
            Gerencie os alunos dos seus cursos
          </p>
        </div>
        <Button 
          onClick={() => setCreateStudentOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          Novo aluno
        </Button>
      </div>

      <div className="space-y-2 max-w-md">
        <Label htmlFor="classroom-select" className="text-white">Selecionar Turma</Label>
        <Select
          value={selectedClassroomId ?? "none"}
          onValueChange={(value) => setSelectedClassroomId(value === "none" ? null : value)}
          disabled={loading || classrooms.length === 0}
        >
          <SelectTrigger id="classroom-select" className="bg-white/5 border-slate-800 text-white">
            <SelectValue placeholder="Selecione uma turma" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800">
            {classrooms.length === 0 ? (
              <SelectItem value="none" disabled className="text-white">
                Nenhuma turma disponível
              </SelectItem>
            ) : (
              classrooms.map((classroom) => (
                <SelectItem
                  key={classroom.id}
                  value={classroom.id}
                  className="text-white hover:bg-slate-800"
                >
                  {classroom.name || `Turma ${classroom.id}`}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Pesquise um aluno pelo nome" 
            className="pl-10 py-6 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center">Carregando alunos...</div>
      ) : !selectedClassroomId ? (
        <div className="text-center">Selecione uma turma para visualizar os alunos</div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center">Nenhum aluno encontrado</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredStudents.map(student => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}

      {/* Chat Dialog */}
      <Dialog open={!!selectedStudentChat} onOpenChange={() => setSelectedStudentChat(null)}>
        <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Chat com {students.find(s => s.id === selectedStudentChat)?.name || ""}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatLoading ? (
              <div className="text-center">Carregando mensagens...</div>
            ) : messages.length === 0 ? (
              <div className="text-center text-muted-foreground">
                Nenhuma mensagem ainda
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.content + Math.random()}
                  className={`flex ${
                    msg.remetente.id === localStorage.getItem("userId") 
                      ? "justify-end" 
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-2 rounded-lg ${
                      msg.remetente.id === localStorage.getItem("userId")
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                        : "bg-muted"
                    }`}
                  >
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (selectedStudentChat) sendMessage(selectedStudentChat)
              }}
              className="flex gap-2"
            >
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Student Dialog */}
      <Dialog open={createStudentOpen} onOpenChange={() => setCreateStudentOpen(false)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Criar Novo Aluno</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="create-name">Nome</Label>
              <Input
                id="create-name"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                placeholder="Nome do aluno"
              />
            </div>
            <div>
              <Label htmlFor="create-email">Email</Label>
              <Input
                id="create-email"
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                placeholder="Email do aluno"
              />
            </div>
            <div>
              <Label htmlFor="create-password">Senha</Label>
              <Input
                id="create-password"
                type="password"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                placeholder="Senha do aluno"
              />
            </div>
            <div>
              <Label htmlFor="create-tel">Telefone</Label>
              <Input
                id="create-tel"
                value={createForm.tel}
                onChange={(e) => setCreateForm({ ...createForm, tel: e.target.value })}
                placeholder="Telefone do aluno"
              />
            </div>
            <div>
              <Label htmlFor="create-biography">Biografia</Label>
              <Input
                id="create-biography"
                value={createForm.biography}
                onChange={(e) => setCreateForm({ ...createForm, biography: e.target.value })}
                placeholder="Biografia do aluno"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="create-emailNotifications"
                  checked={createForm.emailNotifications}
                  onCheckedChange={(checked) => setCreateForm({ ...createForm, emailNotifications: !!checked })}
                />
                <Label htmlFor="create-emailNotifications">Notificações por Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="create-pushNotifications"
                  checked={createForm.pushNotifications}
                  onCheckedChange={(checked) => setCreateForm({ ...createForm, pushNotifications: !!checked })}
                />
                <Label htmlFor="create-pushNotifications">Notificações Push</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="create-weeklyReport"
                  checked={createForm.weeklyReport}
                  onCheckedChange={(checked) => setCreateForm({ ...createForm, weeklyReport: !!checked })}
                />
                <Label htmlFor="create-weeklyReport">Relatório Semanal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="create-studyReminder"
                  checked={createForm.studyReminder}
                  onCheckedChange={(checked) => setCreateForm({ ...createForm, studyReminder: !!checked })}
                />
                <Label htmlFor="create-studyReminder">Lembrete de Estudo</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateStudentOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateStudent}>Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editStudentId} onOpenChange={() => setEditStudentId(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Perfil de {students.find(s => s.id === editStudentId)?.name || ""}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Nome do aluno"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                placeholder="Email do aluno"
              />
            </div>
            <div>
              <Label htmlFor="tel">Telefone</Label>
              <Input
                id="tel"
                value={editForm.tel}
                onChange={(e) => setEditForm({ ...editForm, tel: e.target.value })}
                placeholder="Telefone do aluno"
              />
            </div>
            <div>
              <Label htmlFor="biography">Biografia</Label>
              <Input
                id="biography"
                value={editForm.biography}
                onChange={(e) => setEditForm({ ...editForm, biography: e.target.value })}
                placeholder="Biografia do aluno"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emailNotifications"
                  checked={editForm.emailNotifications}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, emailNotifications: !!checked })}
                />
                <Label htmlFor="emailNotifications">Notificações por Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pushNotifications"
                  checked={editForm.pushNotifications}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, pushNotifications: !!checked })}
                />
                <Label htmlFor="pushNotifications">Notificações Push</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="weeklyReport"
                  checked={editForm.weeklyReport}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, weeklyReport: !!checked })}
                />
                <Label htmlFor="weeklyReport">Relatório Semanal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="studyReminder"
                  checked={editForm.studyReminder}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, studyReminder: !!checked })}
                />
                <Label htmlFor="studyReminder">Lembrete de Estudo</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditStudentId(null)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateStudent}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Classrooms Dialog */}
      <Dialog open={!!editClassroomsStudentId} onOpenChange={() => {
        setEditClassroomsStudentId(null)
        setClassroomSearchTerm("")
        setSelectedClassroomIds([])
      }}>
        <DialogContent className="sm:max-w-[500px] max-h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Editar Turmas de {students.find(s => s.id === editClassroomsStudentId)?.name || ""}
            </DialogTitle>
          </DialogHeader>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Pesquise turmas pelo nome" 
              className="pl-10"
              value={classroomSearchTerm}
              onChange={(e) => setClassroomSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredClassrooms.length === 0 ? (
              <div className="text-center text-muted-foreground">
                Nenhuma turma encontrada
              </div>
            ) : (
              filteredClassrooms.map(classroom => (
                <div key={classroom.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`classroom-${classroom.id}`}
                    checked={selectedClassroomIds.includes(classroom.id)}
                    onCheckedChange={(checked) => {
                      setSelectedClassroomIds(prev =>
                        checked
                          ? [...prev, classroom.id]
                          : prev.filter(id => id !== classroom.id)
                      )
                    }}
                  />
                  <Label htmlFor={`classroom-${classroom.id}`}>
                    {classroom.name || `Turma ${classroom.id}`}
                  </Label>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditClassroomsStudentId(null)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateStudentClassrooms}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteStudentId} onOpenChange={() => setDeleteStudentId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir {students.find(s => s.id === deleteStudentId)?.name || ""}? 
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteStudentId(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteStudent}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MentorStudents