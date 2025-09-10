import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PenTool, Clock, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const Essays = () => {
  const navigate = useNavigate()

  const handleNewEssay = () => {
    navigate("/redacoes/nova")
    toast.success("Nova redação iniciada!")
  }

  const handleStartEssay = () => {
    navigate("/redacoes/editor")
    toast.success("Editor de redação aberto!")
  }

  const handleViewCorrection = (id: string) => {
    navigate(`/redacoes/correcao/${id}`)
    toast.success("Carregando correção...")
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Redações</h1>
          <p className="text-muted-foreground">
            Pratique sua escrita e receba feedback personalizado dos mentores
          </p>
        </div>
        <Button onClick={handleNewEssay}>Nova Redação</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>Tecnologia e Sociedade</CardTitle>
              <Badge variant="secondary">Corrigida</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Discuta os impactos da inteligência artificial na sociedade contemporânea
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Enviada há 2 dias</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center gap-2">
              <PenTool className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Nota: 850/1000</span>
            </div>
            <Button variant="outline" onClick={() => handleViewCorrection("1")}>
              Ver Correção
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>Meio Ambiente</CardTitle>
              <Badge variant="destructive">Pendente</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Analise as políticas ambientais e seus impactos na preservação da biodiversidade
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Prazo: 5 dias</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleStartEssay}>
              Começar Redação
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Essays