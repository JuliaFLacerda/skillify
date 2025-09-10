import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useNavigate, Link } from "react-router-dom"
import {
  Users,
  BookOpen,
  BarChart,
  TrendingUp,
  Bell,
  FileText,
  UserCog,
  Plus,
  Send,
  FileBarChart
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { UserAdminAPI } from "@/api/admin/controllers/UserAdminAPI"
import { CourseAdminAPI } from "@/api/admin/controllers/CourseAdminAPI"
import { EssayExecutionAdminAPI } from "@/api/admin/controllers/EssayExecutionAdminAPI"

const AdminDashboard = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [showMentorDialog, setShowMentorDialog] = useState(false)
  const [showCourseDialog, setShowCourseDialog] = useState(false)
  const [showNotificationDialog, setShowNotificationDialog] = useState(false)
  const [studentsCount, setStudentsCount] = useState(0)
  const [mentorsCount, setMentorsCount] = useState(0)
  const [coursesCount, setCoursesCount] = useState(0)
  const [essaysCount, setEssaysCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const students = await UserAdminAPI.getStudentsCount()
        setStudentsCount(students)
        
        const mentors = await UserAdminAPI.getMentorsCount()
        setMentorsCount(mentors)
        
        const courses = await CourseAdminAPI.getAllCourses()
        setCoursesCount(courses.length)
        
        const essays = await EssayExecutionAdminAPI.getAllExecutions()
        setEssaysCount(essays.length)
      } catch (error) {
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar as informações do dashboard",
          className: "bg-red-500 text-white",
        })
      }
    }
    fetchData()
  }, [toast])

  const handleAddMentor = () => {
    toast({
      title: "Novo Mentor",
      description: "Redirecionando para página de mentores...",
      className: "bg-green-500 text-white",
    })
    navigate("/admin/mentores")
  }

  const handleCreateCourse = () => {
    toast({
      title: "Novo Curso",
      description: "Redirecionando para página de cursos...",
      className: "bg-blue-500 text-white",
    })
    navigate("/admin/cursos")
  }

  const handleSendNotification = () => {
    toast({
      title: "Em Breve",
      description: "Funcionalidade de envio de notificação estará disponível em breve!",
      className: "bg-gray-500 text-white",
    })
  }

  const handleGenerateReport = () => {
    toast({
      title: "Em Breve",
      description: "Funcionalidade de geração de relatório estará disponível em breve!",
      className: "bg-gray-500 text-white",
    })
  }

  return (
    <div className="container py-8 space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-900 bg-clip-text text-transparent">
            Dashboard Administrativo
          </h1>
          <p className="text-muted-foreground">
            Gestão geral da plataforma
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="group hover:shadow-lg transition-all hover:-translate-y-1 bg-gradient-to-br from-background to-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
            <Users className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentsCount}</div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all hover:-translate-y-1 bg-gradient-to-br from-background to-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mentores</CardTitle>
            <UserCog className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mentorsCount}</div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all hover:-translate-y-1 bg-gradient-to-br from-background to-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Ativos</CardTitle>
            <BookOpen className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coursesCount}</div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all hover:-translate-y-1 bg-gradient-to-br from-background to-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <BarChart className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all hover:-translate-y-1 bg-gradient-to-br from-background to-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Redações Enviadas</CardTitle>
            <FileText className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{essaysCount}</div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all hover:-translate-y-1 bg-gradient-to-br from-background to-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="group hover:shadow-lg transition-all hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              Últimas Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Nenhuma notificação disponível</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button 
              asChild
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white flex items-center gap-2 shadow-lg hover:shadow-green-500/20 transition-all"
            >
              <Link to="/admin/mentores">
                <UserCog className="w-4 h-4" />
                Adicionar Novo Mentor
              </Link>
            </Button>
            <Button 
              asChild
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center gap-2 shadow-lg hover:shadow-blue-500/20 transition-all"
            >
              <Link to="/admin/cursos">
                <BookOpen className="w-4 h-4" />
                Criar Novo Curso
              </Link>
            </Button>
            <Button 
              onClick={handleSendNotification}
              disabled
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white flex items-center gap-2 shadow-lg transition-all"
            >
              <Send className="w-4 h-4" />
              Enviar Notificação (Em breve)
            </Button>
            <Button 
              onClick={handleGenerateReport}
              disabled
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white flex items-center gap-2 shadow-lg transition-all"
            >
              <FileBarChart className="w-4 h-4" />
              Gerar Relatório (Em breve)
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showMentorDialog} onOpenChange={setShowMentorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Mentor</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mentor-name">Nome do Mentor</Label>
              <Input id="mentor-name" placeholder="Digite o nome completo" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mentor-specialty">Especialidade</Label>
              <Input id="mentor-specialty" placeholder="Ex: Matemática, Português..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mentor-bio">Biografia</Label>
              <Textarea 
                id="mentor-bio" 
                placeholder="Breve descrição sobre o mentor..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMentorDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              toast({
                title: "Mentor Adicionado",
                description: "O novo mentor foi cadastrado com sucesso!",
                className: "bg-green-500 text-white",
              })
              setShowMentorDialog(false)
            }}>
              Adicionar Mentor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCourseDialog} onOpenChange={setShowCourseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Curso</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="course-title">Título do Curso</Label>
              <Input id="course-title" placeholder="Digite o título do curso" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-description">Descrição</Label>
              <Textarea 
                id="course-description" 
                placeholder="Descreva o curso..."
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-duration">Duração (horas)</Label>
              <Input id="course-duration" type="number" placeholder="Ex: 40" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCourseDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              toast({
                title: "Curso Criado",
                description: "O novo curso foi criado com sucesso!",
                className: "bg-blue-500 text-white",
              })
              setShowCourseDialog(false)
            }}>
              Criar Curso
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Notificação</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notification-title">Título da Notificação</Label>
              <Input id="notification-title" placeholder="Digite o título" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notification-message">Mensagem</Label>
              <Textarea 
                id="notification-message" 
                placeholder="Digite a mensagem da notificação..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNotificationDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              toast({
                title: "Notificação Enviada",
                description: "A notificação foi enviada com sucesso para todos os usuários!",
                className: "bg-purple-500 text-white",
              })
              setShowNotificationDialog(false)
            }}>
              Enviar Notificação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminDashboard