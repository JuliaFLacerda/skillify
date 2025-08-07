import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { EssayAssignmentCard } from "@/components/redacoes/EssayAssignmentCard"
import { EssayCorrectionCard } from "@/components/redacoes/EssayCorrectionCard"
import { CorrectedEssayCard } from "@/components/redacoes/CorrectedEssayCard"
import { CorrectionDialog } from "@/components/redacoes/CorrectionDialog"
import { UpdateCorrectionDialog } from "@/components/redacoes/UpdateCorrectionDialog"
import { EssayDetailsDialog } from "@/components/redacoes/EssayDetailsDialog"
import { NewEssayDialog } from "@/components/redacoes/NewEssayDialog"
import { CorrectionDetailsDialog } from "@/components/redacoes/CorrectionDetailsDialog"
import { EssayMentorAPI } from "@/api/mentor/controllers/EssayMentorAPI"
import { EssayExecutionMentorAPI } from "@/api/mentor/controllers/EssayExecutionMentorAPI"
import { EssayCorrectionMentorAPI } from "@/api/mentor/controllers/EssayCorrectionMentorAPI"
import { EssayCreateDTO, EssayResponseDTO } from "@/api/dtos/essayDtos"
import { EssayExecutionResponseDTO } from "@/api/dtos/essayExecutionDtos"
import { EssayCorrectionResponseDTO, EssayCorrectionCreateDTO, EssayConquest } from "@/api/dtos/essayCorrectionDtos"
import { ClassroomMentorAPI } from "@/api/mentor/controllers/ClassroomMentorAPI"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface CorrectionForm {
  estruturaCoesaoComentario: string
  argumentacaoComentario: string
  structureScore: string
  argumentationScore: string
  proposalScore: string
  languageScore: string
  competencyScore: string
}

const MentorRedacoes = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isCorrectionOpen, setIsCorrectionOpen] = useState(false)
  const [isUpdateCorrectionOpen, setIsUpdateCorrectionOpen] = useState(false)
  const [isNewEssayOpen, setIsNewEssayOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isCorrectionDetailsOpen, setIsCorrectionDetailsOpen] = useState(false)
  const [selectedEssayExecution, setSelectedEssayExecution] = useState<string>("")
  const [selectedEssay, setSelectedEssay] = useState<string>("")
  const [selectedCorrectionId, setSelectedCorrectionId] = useState<string>("")
  const [essays, setEssays] = useState<EssayResponseDTO[]>([])
  const [essayExecutions, setEssayExecutions] = useState<EssayExecutionResponseDTO[]>([])
  const [correctedEssays, setCorrectedEssays] = useState<EssayCorrectionResponseDTO[]>([])
  const [classrooms, setClassrooms] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const [correctionForm, setCorrectionForm] = useState<CorrectionForm>({
    estruturaCoesaoComentario: "",
    argumentacaoComentario: "",
    structureScore: "",
    argumentationScore: "",
    proposalScore: "",
    languageScore: "",
    competencyScore: ""
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const classroomData = await ClassroomMentorAPI.getAllClassrooms()
        setClassrooms(classroomData.map(c => ({ id: c.id, name: c.name })))

        const allEssays: EssayResponseDTO[] = []
        for (const classroom of classroomData) {
          const classroomEssays = await EssayMentorAPI.getEssaysByClassroom(classroom.id)
          allEssays.push(...classroomEssays)
        }
        setEssays(allEssays)

        const executionData = await EssayExecutionMentorAPI.getAllEssayExecutions()
        setEssayExecutions(executionData)

        const correctionData = await EssayCorrectionMentorAPI.getAllEssayCorrections()
        setCorrectedEssays(correctionData)

      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao carregar os dados",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [toast])

  const handleStartCorrection = (executionId: string) => {
    setSelectedEssayExecution(executionId)
    setCorrectionForm({
      estruturaCoesaoComentario: "",
      argumentacaoComentario: "",
      structureScore: "",
      argumentationScore: "",
      proposalScore: "",
      languageScore: "",
      competencyScore: ""
    })
    setIsCorrectionOpen(true)
  }

  const handleUpdateCorrection = (correction: EssayCorrectionResponseDTO) => {
    setSelectedCorrectionId(correction.id)
    setSelectedEssayExecution(correction.essayExecution.id)
    setCorrectionForm({
      estruturaCoesaoComentario: correction.estruturaCoesaoComentario,
      argumentacaoComentario: correction.argumentacaoComentario,
      structureScore: correction.competencia1Score.toString(),
      argumentationScore: correction.competencia2Score.toString(),
      proposalScore: correction.competencia3Score.toString(),
      languageScore: correction.competencia4Score.toString(),
      competencyScore: correction.competencia5Score.toString()
    })
    setIsUpdateCorrectionOpen(true)
  }

  const handleSubmitCorrection = async (form: CorrectionForm) => {
    try {
      const execution = essayExecutions.find(e => e.id === selectedEssayExecution)
      if (!execution) {
        throw new Error("Essay execution not found")
      }

      const mentorId = localStorage.getItem("userId") // Replace with actual mentor ID from auth

      const createDTO: EssayCorrectionCreateDTO = {
        essayId: execution.essay.id,
        mentorId: mentorId,
        essayExecutionId: selectedEssayExecution,
        estruturaCoesaoComentario: form.estruturaCoesaoComentario,
        argumentacaoComentario: form.argumentacaoComentario,
        conquistas: [EssayConquest.ARGUMENTACAO_SOLIDA],
        competencia1Score: parseInt(form.structureScore) || 0,
        competencia2Score: parseInt(form.argumentationScore) || 0,
        competencia3Score: parseInt(form.proposalScore) || 0,
        competencia4Score: parseInt(form.languageScore) || 0,
        competencia5Score: parseInt(form.competencyScore) || 0,
      }

      const newCorrection = await EssayCorrectionMentorAPI.createEssayCorrection(createDTO)
      setCorrectedEssays([...correctedEssays, newCorrection])
      
      toast({
        title: "Correção enviada",
        description: "A correção foi salva com sucesso!"
      })
      setIsCorrectionOpen(false)
    } catch (error) {
      toast({
        title: "Erro ao enviar correção",
        description: "Não foi possível salvar a correção",
        variant: "destructive",
      })
      console.error('Error submitting correction:', error)
    }
  }

  const handleSubmitUpdateCorrection = async (form: CorrectionForm) => {
    try {
      const execution = essayExecutions.find(e => e.id === selectedEssayExecution)
      if (!execution) {
        throw new Error("Essay execution not found")
      }

      const mentorId = localStorage.getItem("userId") // Replace with actual mentor ID from auth

      const updateDTO: EssayCorrectionCreateDTO = {
        essayId: execution.essay.id,
        mentorId: mentorId,
        essayExecutionId: selectedEssayExecution,
        estruturaCoesaoComentario: form.estruturaCoesaoComentario,
        argumentacaoComentario: form.argumentacaoComentario,
        conquistas: [EssayConquest.ARGUMENTACAO_SOLIDA],
        competencia1Score: parseInt(form.structureScore) || 0,
        competencia2Score: parseInt(form.argumentationScore) || 0,
        competencia3Score: parseInt(form.proposalScore) || 0,
        competencia4Score: parseInt(form.languageScore) || 0,
        competencia5Score: parseInt(form.competencyScore) || 0,
      }

      const updatedCorrection = await EssayCorrectionMentorAPI.updateEssayCorrection(selectedCorrectionId, updateDTO)
      setCorrectedEssays(correctedEssays.map(c => c.id === selectedCorrectionId ? updatedCorrection : c))
      
      toast({
        title: "Correção atualizada",
        description: "A correção foi atualizada com sucesso!"
      })
      setIsUpdateCorrectionOpen(false)
    } catch (error) {
      toast({
        title: "Erro ao atualizar correção",
        description: "Não foi possível atualizar a correção",
        variant: "destructive",
      })
      console.error('Error updating correction:', error)
    }
  }

  const handleCreateEssay = async (values: EssayCreateDTO) => {
    try {
      const createdEssay = await EssayMentorAPI.createEssay(values)
      setEssays([...essays, createdEssay])
      toast({
        title: "Redação criada",
        description: "A redação foi criada com sucesso!"
      })
      setIsNewEssayOpen(false)
    } catch (error) {
      toast({
        title: "Erro ao criar redação",
        description: "Não foi possível criar a redação",
        variant: "destructive",
      })
    }
  }

  const handleViewDetails = (essayId: string) => {
    setSelectedEssay(essayId)
    setIsDetailsOpen(true)
    toast({
      title: "Visualizando detalhes",
      description: "Carregando detalhes da redação..."
    })
  }

  const handleViewCorrection = (correctionId: string) => {
    setSelectedCorrectionId(correctionId)
    setIsCorrectionDetailsOpen(true)
    toast({
      title: "Visualizando correção",
      description: "Carregando detalhes da correção..."
    })
  }

  const handleDeleteEssay = (essayId: string) => {
    setEssays(essays.filter(essay => essay.id !== essayId))
  }

  const filteredEssays = essays.filter(essay =>
    essay.theme.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredExecutions = essayExecutions.filter(execution => {
    const isCorrected = correctedEssays.some(c => c.essayExecution.id === execution.id)
    return !isCorrected && (
      execution.essay.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      execution.student.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const filteredCorrections = correctedEssays.filter(correction =>
    correction.essay.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
    correction.essayExecution.student.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div className="p-6">Carregando...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Gerenciar Redações
          </h1>
          <p className="text-slate-400">
            Corrija e avalie as redações dos alunos
          </p>
        </div>
        <Button 
          onClick={() => setIsNewEssayOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white border-none"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Redação
        </Button>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Buscar redações..." 
            className="pl-10 bg-white/5 border-slate-800 text-white placeholder:text-slate-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-[300px] grid-cols-3 bg-white/5">
            <TabsTrigger value="all" className="text-white data-[state=active]:bg-purple-600">
              Todas
            </TabsTrigger>
            <TabsTrigger value="correct" className="text-white data-[state=active]:bg-purple-600">
              Corrigir
            </TabsTrigger>
            <TabsTrigger value="corrected" className="text-white data-[state=active]:bg-purple-600">
              Corrigidas
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
              {filteredEssays.map(essay => (
                <EssayAssignmentCard 
                  key={essay.id}
                  essayId={essay.id}
                  title={essay.theme}
                  classroom={essay.classroom.name}
                  deadline={new Date(essay.maxDate).toLocaleDateString()}
                  onView={() => handleViewDetails(essay.id)}
                  onDelete={handleDeleteEssay}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="correct">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
              {filteredExecutions.length > 0 ? (
                filteredExecutions.map(execution => (
                  <EssayCorrectionCard 
                    key={execution.id}
                    title={execution.essay.theme}
                    student={execution.student.name}
                    status="pending"
                    submissionDate={new Date(Date.now()).toLocaleDateString()}
                    deadline={new Date(execution.essay.maxDate).toLocaleDateString()}
                    essayId={execution.essay.id}
                    onCorrect={() => handleStartCorrection(execution.id)}
                    onView={() => handleViewDetails(execution.essay.id)}
                  />
                ))
              ) : (
                <div className="mt-4 text-slate-400">
                  <p>Nenhuma redação para corrigir no momento.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="corrected">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
              {filteredCorrections.length > 0 ? (
                filteredCorrections.map(correction => (
                  <CorrectedEssayCard
                    key={correction.id}
                    title={correction.essay.theme}
                    student={correction.essayExecution.student.name}
                    correctionDate={new Date(Date.now()).toLocaleDateString()}
                    essayId={correction.essay.id}
                    correctionId={correction.id}
                    onView={() => handleViewCorrection(correction.id)}
                    onUpdate={() => handleUpdateCorrection(correction)}
                  />
                ))
              ) : (
                <div className="mt-4 text-slate-400">
                  <p>Nenhuma redação corrigida no momento.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CorrectionDialog 
        open={isCorrectionOpen}
        onOpenChange={setIsCorrectionOpen}
        form={correctionForm}
        onFormChange={setCorrectionForm}
        onSubmit={handleSubmitCorrection}
        executionId={selectedEssayExecution}
      />

      <UpdateCorrectionDialog 
        open={isUpdateCorrectionOpen}
        onOpenChange={setIsUpdateCorrectionOpen}
        form={correctionForm}
        onFormChange={setCorrectionForm}
        onSubmit={handleSubmitUpdateCorrection}
        executionId={selectedEssayExecution}
        correctionId={selectedCorrectionId}
      />

      <EssayDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        essayId={selectedEssay}
      />

      <NewEssayDialog
        open={isNewEssayOpen}
        onOpenChange={setIsNewEssayOpen}
        onSubmit={handleCreateEssay}
        classrooms={classrooms}
      />

      <CorrectionDetailsDialog
        open={isCorrectionDetailsOpen}
        onOpenChange={setIsCorrectionDetailsOpen}
        correctionId={selectedCorrectionId}
      />
    </div>
  )
}

export default MentorRedacoes