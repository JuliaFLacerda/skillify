import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PenTool, Clock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { EssayStudentAPI } from "../../api/student/controllers/EssayStudentAPI"
import { EssayCorrectionStudentAPI } from "../../api/student/controllers/EssayCorrectionStudentAPI"
import { EssayExecutionStudentAPI } from "../../api/student/controllers/EssayExecutionStudentAPI"
import { EssayResponseDTO } from "../../api/dtos/essayDtos"
import { EssayCorrectionResponseDTO } from "../../api/dtos/essayCorrectionDtos"
import { EssayExecutionResponseDTO } from "../../api/dtos/essayExecutionDtos"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Essays = () => {
  const navigate = useNavigate()
  const [essays, setEssays] = useState<EssayResponseDTO[]>([])
  const [correctedEssays, setCorrectedEssays] = useState<EssayCorrectionResponseDTO[]>([])
  const [essayExecutions, setEssayExecutions] = useState<EssayExecutionResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("pending")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch pending essays
        const studentEssays = await EssayStudentAPI.getStudentEssays()
        console.log('Fetched essays:', studentEssays)
        setEssays(studentEssays)

        // Fetch corrected essays
        const corrections = await EssayCorrectionStudentAPI.getAllEssayCorrections()
        console.log('Fetched corrections:', corrections)
        setCorrectedEssays(corrections)

        // Fetch essay executions
        const executions = await EssayExecutionStudentAPI.getAllMyEssayExecutions()
        console.log('Fetched essay executions:', executions)
        setEssayExecutions(executions)

        setLoading(false)
      } catch (error) {
        toast.error("Erro ao carregar os dados")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleStartEssay = (essayId: string) => {
    console.log('Navigating to essay editor with ID:', essayId)
    navigate(`/dashboard/redacoes/editor/${essayId}`)
    toast.success("Editor de redação aberto!")
  }

  const handleViewCorrection = (correctionId: string) => {
    console.log('Navigating to correction with ID:', correctionId)
    navigate(`/dashboard/redacoes/correcao/${correctionId}`)
    toast.success("Carregando correção...")
  }

  const getTimeDifference = (dateString: string) => {
    const now = new Date()
    const essayDate = new Date(dateString)
    const diffInDays = Math.ceil((essayDate.getTime() - now.getTime()) / (1000 * 3600 * 24))
    
    if (diffInDays > 0) {
      return `Prazo: ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`
    } else if (diffInDays < 0) {
      return `Enviada há ${Math.abs(diffInDays)} dia${Math.abs(diffInDays) > 1 ? 's' : ''}`
    }
    return "Prazo: Hoje"
  }

  const calculateTotalScore = (correction: EssayCorrectionResponseDTO) => {
    return (
      correction.competencia1Score +
      correction.competencia2Score +
      correction.competencia3Score +
      correction.competencia4Score +
      correction.competencia5Score
    )
  }

  // Check if an essay has an execution
  const hasEssayExecution = (essayId: string) => {
    return essayExecutions.some(execution => execution.essay.id === essayId)
  }

  // Check if an essay has a correction
  const hasEssayCorrection = (essayId: string) => {
    return correctedEssays.some(correction => correction.essay.id === essayId)
  }

  if (loading) {
    return (
      <div className="container py-8">
        <p>Carregando dados...</p>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Redações</h1>
        <p className="text-muted-foreground">
          Pratique sua escrita e receba feedback personalizado dos mentores
        </p>
      </div>

      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-[200px] grid-cols-2">
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="corrected">Corrigidas</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {essays.length === 0 ? (
            <p className="text-muted-foreground mt-4">Nenhuma redação pendente no momento</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
              {essays
                .filter(essay => new Date(essay.maxDate) > new Date() && !hasEssayCorrection(essay.id))
                .map((essay) => (
                  <Card key={essay.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{essay.theme}</CardTitle>
                        <Badge variant="destructive">Pendente</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {essay.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{getTimeDifference(essay.maxDate)}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        onClick={() => handleStartEssay(essay.id)}
                        disabled={hasEssayExecution(essay.id)}
                      >
                        {hasEssayExecution(essay.id) ? "Redação já realizada" : "Começar Redação"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="corrected">
          {correctedEssays.length === 0 ? (
            <p className="text-muted-foreground mt-4">Nenhuma redação corrigida no momento</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
              {correctedEssays.map((correction) => (
                <Card key={correction.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{correction.essay.theme}</CardTitle>
                      <Badge variant="secondary">Corrigida</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Corrigido por: {correction.mentor.name}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{getTimeDifference(correction.essay.maxDate)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <PenTool className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">
                        Nota: {calculateTotalScore(correction)}/1000
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => handleViewCorrection(correction.id)}
                    >
                      Ver Correção
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Essays