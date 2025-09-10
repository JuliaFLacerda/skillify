
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatsCards } from "@/components/dashboard/StatsCards"
import { UpdatesMural } from "@/components/UpdatesMural"
import {
  BookOpen,
  Video,
  Clock,
  FileText,
  MessageSquare,
  Plus,
  Trophy,
  Target,
  BarChart,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const StudentDashboard = () => {
  const navigate = useNavigate()

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Dashboard do Aluno
          </h1>
          <p className="text-muted-foreground">
            Acompanhe seu progresso e atividades
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span>Nível 15</span>
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Cursos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">4</p>
            <p className="text-sm text-muted-foreground">Em andamento</p>
            <Progress value={75} className="mt-4" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Redações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">8</p>
            <p className="text-sm text-muted-foreground">Enviadas</p>
            <div className="flex items-center gap-2 mt-4">
              <Badge variant="secondary">5 corrigidas</Badge>
              <Badge variant="outline">3 pendentes</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Mentorias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <p className="text-sm text-muted-foreground">Agendadas</p>
            <div className="flex items-center gap-2 mt-4">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm">Próxima: Hoje, 19h</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-primary" />
              Próximas Aulas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-primary" />
                <div>
                  <p className="font-medium">React Avançado</p>
                  <p className="text-sm text-muted-foreground">Aula ao vivo</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>Hoje, 19h</span>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-primary" />
                <div>
                  <p className="font-medium">TypeScript Básico</p>
                  <p className="text-sm text-muted-foreground">Aula gravada</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>Amanhã, 20h</span>
              </div>
            </div>

            <Button className="w-full" variant="outline">
              Ver todas as aulas
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-primary" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full flex items-center gap-2 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700" 
              onClick={() => navigate("/cursos")}
            >
              <Plus className="w-4 h-4" />
              Explorar Novos Cursos
            </Button>
            <Button 
              className="w-full flex items-center gap-2" 
              variant="outline"
              onClick={() => navigate("/redacoes/nova")}
            >
              <FileText className="w-4 h-4" />
              Nova Redação
            </Button>
            <Button 
              className="w-full flex items-center gap-2" 
              variant="outline"
              onClick={() => navigate("/mentoria/agendar")}
            >
              <MessageSquare className="w-4 h-4" />
              Agendar Mentoria
            </Button>
          </CardContent>
        </Card>
      </div>

      <StatsCards />
      <UpdatesMural />
    </div>
  )
}

export default StudentDashboard
