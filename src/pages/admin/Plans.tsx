import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, PackagePlus, Edit, Trash2, Users } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { SalesPlanAdminAPI } from "@/api/admin/controllers/SalesPlanAdminAPI"
import { SalesPlanCreateDTO, SalesPlanResponseDTO, PlanType } from "@/api/dtos/salesPlanDtos"

const AdminPlans = () => {
  const { toast } = useToast()
  const [plans, setPlans] = useState<SalesPlanResponseDTO[]>([])
  const [isNewPlanOpen, setIsNewPlanOpen] = useState(false)
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<SalesPlanResponseDTO | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)

  return(<div>Em breve</div>)

  // Fetch all plans on component mount
  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const response = await SalesPlanAdminAPI.getAllPlans()
      setPlans(response)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar os planos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleNewPlan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newPlan: SalesPlanCreateDTO = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      type: formData.get("type") as PlanType,
      resources: (formData.get("features") as string).split("\n").filter(Boolean),
    }

    try {
      setLoading(true)
      await SalesPlanAdminAPI.createPlan(newPlan)
      setIsNewPlanOpen(false)
      toast({
        title: "Plano criado",
        description: "O novo plano foi criado com sucesso.",
      })
      fetchPlans()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar o plano",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditPlan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedPlan) return

    const formData = new FormData(e.currentTarget)
    
    const updatedPlan: SalesPlanCreateDTO = {
      name: formData.get("editName") as string,
      description: formData.get("editDescription") as string,
      price: formData.get("editPrice") as string,
      type: formData.get("editType") as PlanType,
      resources: (formData.get("editFeatures") as string).split("\n").filter(Boolean),
    }

    try {
      setLoading(true)
      await SalesPlanAdminAPI.updatePlan(selectedPlan.id, updatedPlan)
      setIsEditPlanOpen(false)
      toast({
        title: "Plano atualizado",
        description: "O plano foi atualizado com sucesso.",
      })
      fetchPlans()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar o plano",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePlan = async () => {
    if (!selectedPlan) return

    try {
      setLoading(true)
      await SalesPlanAdminAPI.deletePlan(selectedPlan.id)
      setIsDeleteDialogOpen(false)
      toast({
        title: "Plano removido",
        description: "O plano foi removido com sucesso.",
      })
      fetchPlans()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao remover o plano",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredPlans = plans.filter(plan => 
    plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Gerenciar Planos
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Configure os planos disponíveis na plataforma
          </p>
        </div>
        <Button 
          onClick={() => setIsNewPlanOpen(true)}
          size="lg"
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        >
          <PackagePlus className="w-5 h-5 mr-2" />
          Novo Plano
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Buscar planos..." 
            className="pl-10 py-6 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {filteredPlans.map((plan) => (
    <Card key={plan.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-primary/5">
      <CardHeader>
        <div className="flex justify-between items-start mb-4">
          <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">234 assinantes</span>
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Preço mensal</div>
            <div className="text-2xl font-bold text-purple-600">R$ {plan.price}</div>
          </div>
          <div className="text-sm text-muted-foreground">{plan.description}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            className="w-full border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
            onClick={() => {
              setSelectedPlan(plan);
              setIsEditPlanOpen(true);
            }}
            disabled={loading}
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button 
            variant="destructive" 
            className="w-full hover:bg-red-700 transition-all duration-300"
            onClick={() => {
              setSelectedPlan(plan);
              setIsDeleteDialogOpen(true);
            }}
            disabled={loading}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remover
          </Button>
        </div>
      </CardContent>
    </Card>
  ))}
</div>

      {/* Modal Novo Plano */}
      <Dialog open={isNewPlanOpen} onOpenChange={setIsNewPlanOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Criar Novo Plano</DialogTitle>
            <DialogDescription>
              Preencha as informações do novo plano abaixo.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNewPlan} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do plano</Label>
              <Input id="name" name="name" required className="text-lg py-6" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea 
                id="description" 
                name="description"
                required 
                className="min-h-[100px] text-lg"
                placeholder="Descreva os benefícios do plano"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço mensal (R$)</Label>
                <Input 
                  id="price" 
                  name="price"
                  type="number" 
                  step="0.01" 
                  required 
                  className="text-lg py-6"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select name="type">
                  <SelectTrigger className="text-lg py-6">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem value={PlanType.MENSAL}>Mensal</SelectItem>
                  <SelectItem value={PlanType.ANUAL}>Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="features">Recursos (um por linha)</Label>
              <Textarea 
                id="features" 
                name="features"
                required 
                className="min-h-[150px] text-lg"
                placeholder="Digite os recursos do plano, um por linha
Exemplo:
✓ Acesso a todos os cursos
✓ Mentoria semanal
✓ Certificados premium"
              />
            </div>
            <DialogFooter>
              <Button 
                type="submit"
                size="lg"
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
              >
                Criar Plano
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Editar Plano */}
      <Dialog open={isEditPlanOpen} onOpenChange={setIsEditPlanOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Editar Plano</DialogTitle>
            <DialogDescription>
              Edite as informações do plano {selectedPlan?.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditPlan} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editName">Nome do plano</Label>
              <Input 
                id="editName" 
                name="editName"
                defaultValue={selectedPlan?.name || ""} 
                required 
                className="text-lg py-6"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDescription">Descrição</Label>
              <Textarea 
                id="editDescription" 
                name="editDescription"
                required 
                className="min-h-[100px] text-lg"
                defaultValue={selectedPlan?.description || ""}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editPrice">Preço mensal (R$)</Label>
                <Input 
                  id="editPrice" 
                  name="editPrice"
                  type="number" 
                  step="0.01" 
                  defaultValue={selectedPlan?.price || ""}
                  required 
                  className="text-lg py-6"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editType">Tipo</Label>
                <Select name="editType" defaultValue={selectedPlan?.type}>
                  <SelectTrigger className="text-lg py-6">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem value={PlanType.MENSAL}>Mensal</SelectItem>
                  <SelectItem value={PlanType.ANUAL}>Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editFeatures">Recursos (um por linha)</Label>
              <Textarea 
                id="editFeatures" 
                name="editFeatures"
                required 
                className="min-h-[150px] text-lg"
                defaultValue={selectedPlan?.resources.join("\n") || ""}
              />
            </div>
            <DialogFooter>
              <Button 
                type="submit"
                size="lg"
                disabled={loading}
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
            <AlertDialogTitle className="text-2xl">Remover Plano</AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              Tem certeza que deseja remover o plano {selectedPlan?.name}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="text-lg">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePlan}
              className="bg-red-600 hover:bg-red-700 text-lg transition-colors"
              disabled={loading}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminPlans

