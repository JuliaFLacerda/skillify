import { MessageCircle, FileText, BookOpen, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export const QuickActions = () => {
  const { toast } = useToast()

  const showToast = (message: string) => {
    toast({
      title: "Informação",
      description: message,
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Ações Rápidas</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2 hover:bg-primary/5 group w-full"
              onClick={() => showToast("Iniciando nova mentoria...")}
            >
              <MessageCircle className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <span>Mentoria</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Agendar Mentoria</DialogTitle>
              <DialogDescription>
                Escolha um mentor disponível para sua próxima sessão.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="mentor">Mentor</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um mentor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="joao">João Silva - Português</SelectItem>
                    <SelectItem value="maria">Maria Santos - Redação</SelectItem>
                    <SelectItem value="pedro">Pedro Costa - Literatura</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Data</Label>
                <Input type="date" id="date" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Horário</Label>
                <Input type="time" id="time" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => showToast("Mentoria agendada com sucesso!")}>
                Agendar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2 hover:bg-primary/5 group w-full"
              onClick={() => showToast("Acessando redações...")}
            >
              <FileText className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <span>Redações</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Redação</DialogTitle>
              <DialogDescription>
                Envie uma nova redação para correção.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" placeholder="Digite o título da sua redação" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea
                  id="content"
                  placeholder="Cole ou digite sua redação aqui"
                  className="min-h-[200px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => showToast("Redação enviada para correção!")}>
                Enviar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2 hover:bg-primary/5 group w-full"
              onClick={() => showToast("Carregando simulados...")}
            >
              <BookOpen className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <span>Simulados</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Iniciar Simulado</DialogTitle>
              <DialogDescription>
                Escolha o tipo de simulado que deseja realizar.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Tipo de Simulado</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete">Prova Completa</SelectItem>
                    <SelectItem value="portuguese">Português</SelectItem>
                    <SelectItem value="math">Matemática</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duração</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a duração" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="90">90 minutos</SelectItem>
                    <SelectItem value="120">2 horas</SelectItem>
                    <SelectItem value="180">3 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => showToast("Iniciando simulado...")}>
                Começar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2 hover:bg-primary/5 group w-full"
              onClick={() => showToast("Verificando desafios...")}
            >
              <Trophy className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              <span>Desafios</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Desafios Disponíveis</DialogTitle>
              <DialogDescription>
                Escolha um desafio para começar.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Desafio de Redação</h4>
                    <p className="text-sm text-muted-foreground">Escreva 7 redações em 7 dias</p>
                  </div>
                  <Button variant="outline">Participar</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Maratona de Exercícios</h4>
                    <p className="text-sm text-muted-foreground">100 exercícios em 24h</p>
                  </div>
                  <Button variant="outline">Participar</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Quiz Relâmpago</h4>
                    <p className="text-sm text-muted-foreground">Responda 50 questões em 30min</p>
                  </div>
                  <Button variant="outline">Participar</Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}