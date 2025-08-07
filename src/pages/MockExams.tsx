import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Trophy, BarChart, BookOpen, Award } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const MockExams = () => {
  const [examProgress] = useState(75)
  const navigate = useNavigate()

  const handleNewExam = () => {
    navigate("/simulados/novo")
    toast.success("Preparando novo simulado...")
  }

  const handleStartExam = () => {
    navigate("/simulados/prova/1")
    toast.success("Iniciando simulado...")
  }

  const handleViewResults = () => {
    navigate("/simulados/resultado/1")
    toast.success("Carregando resultados...")
  }

  return (
    <div className="container py-8 space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Simulados</h1>
          <p className="text-muted-foreground">
            Prepare-se para o sucesso com nossos simulados completos
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary-600" onClick={handleNewExam}>
          <BookOpen className="w-4 h-4 mr-2" />
          Iniciar Novo Simulado
        </Button>
      </div>

      <Card className="bg-gradient-to-r from-primary-100 to-primary-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            Seu Progresso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progresso Geral</span>
            <span className="text-sm font-medium">{examProgress}%</span>
          </div>
          <Progress value={examProgress} className="h-2" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-3 bg-white/50 rounded-lg p-4">
              <Award className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm font-medium">Simulados Completos</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/50 rounded-lg p-4">
              <BarChart className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm font-medium">Média Geral</p>
                <p className="text-2xl font-bold">785</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/50 rounded-lg p-4">
              <Clock className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm font-medium">Tempo Médio</p>
                <p className="text-2xl font-bold">4h20</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>Simulado Nacional</CardTitle>
              <Badge className="bg-primary">Disponível</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Simulado completo com todas as disciplinas e questões no formato oficial
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Duração: 5 horas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BarChart className="w-4 h-4" />
                <span>90 questões</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleStartExam}>
              Começar Simulado
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>Simulado Regional</CardTitle>
              <Badge variant="secondary">Concluído</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Simulado realizado em 15/03/2024
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span>Nota: 850/1000</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BarChart className="w-4 h-4" />
                <span>Acertos: 76/90</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={handleViewResults}>
              Ver Resultados
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>Simulado de Treino</CardTitle>
              <Badge variant="outline">Personalizado</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Crie um simulado personalizado com as disciplinas que você deseja praticar
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Duração personalizada</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BarChart className="w-4 h-4" />
                <span>Questões personalizadas</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={handleNewExam}>
              Criar Simulado
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default MockExams