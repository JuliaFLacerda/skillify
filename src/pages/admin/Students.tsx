import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Edit, Trash2, GraduationCap, BookOpen, Medal, Star, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserAdminAPI } from "@/api/admin/controllers/UserAdminAPI"
import { UserResponseDTO, UserRole, UserUpdateRequest } from "@/api/dtos/userDtos"


const AdminStudents = () => {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<UserResponseDTO | null>(null)
  const [students, setStudents] = useState<UserResponseDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const allUsers = await UserAdminAPI.getAllUsers()
      const studentUsers = allUsers.filter(user => user.role === "ESTUDANTE")
      setStudents(studentUsers)
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

  const handleDeleteStudent = async () => {
    if (!selectedStudent?.id) return
    try {
      await UserAdminAPI.deleteUser(selectedStudent.id)
      setStudents(students.filter(student => student.id !== selectedStudent.id))
      setIsDeleteDialogOpen(false)
      toast({
        title: "Aluno removido",
        description: `O aluno ${selectedStudent.name} foi removido com sucesso.`,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao remover o aluno",
        variant: "destructive"
      })
    }
  }

  const handleEditStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedStudent?.id) return

    const formData = new FormData(e.currentTarget)
    const updatedStudent: UserUpdateRequest = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      tel: selectedStudent.tel, // Assuming tel isn't editable in this form
      biography: selectedStudent.biography, // Assuming biography isn't editable
      emailNotifications: selectedStudent.emailNotifications,
      pushNotifications: selectedStudent.pushNotifications,
      weeklyReport: selectedStudent.weeklyReport,
      studyReminder: selectedStudent.studyReminder,
      role: formData.get("plan") as string
    }

    try {
      const response = await UserAdminAPI.updateUser(selectedStudent.id, updatedStudent)
      setStudents(students.map(student => 
        student.id === selectedStudent.id ? response : student
      ))
      setIsEditDialogOpen(false)
      toast({
        title: "Aluno atualizado",
        description: `As informações de ${selectedStudent.name} foram atualizadas com sucesso.`,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar o aluno",
        variant: "destructive"
      })
    }
  }

  const openDeleteDialog = (student: UserResponseDTO) => {
    setSelectedStudent(student)
    setIsDeleteDialogOpen(true)
  }

  const openEditDialog = (student: UserResponseDTO) => {
    setSelectedStudent(student)
    setIsEditDialogOpen(true)
  }

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div className="container py-8">Carregando...</div>
  }

  return (
    <div className="container py-8 space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Alunos
            <span className="text-primary ml-2">{students.length}</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Visualize e gerencie os alunos da plataforma
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar alunos por nome ou email..." 
            className="pl-10 py-6 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-primary/5">
            <CardHeader className="pb-2">
              <div className="flex items-start gap-4">
                <img 
                  src={student.avatar} 
                  alt={""} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
                      {student.role === UserRole.ESTUDANTE ? "Estudante" : student.role}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Medal className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">Nível {student.level}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{student.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-3 pt-4">
                  <Button 
                    variant="destructive" 
                    className="flex-1 py-6 hover:bg-red-700 transition-all duration-300"
                    onClick={() => openDeleteDialog(student)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remover
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Aluno</DialogTitle>
            <DialogDescription>
              Atualize as informações do aluno {selectedStudent?.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditStudent} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" name="name" defaultValue={selectedStudent?.name || ""} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email"
                type="email" 
                defaultValue={selectedStudent?.email || ""} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Plano</Label>
              <Select name="plan" defaultValue={selectedStudent?.role}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um plano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.ESTUDANTE}>Estudante</SelectItem>
                  {/* Add other roles if needed */}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
              >
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Remoção */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Aluno</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o aluno {selectedStudent?.name}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteStudent}
              className="bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminStudents