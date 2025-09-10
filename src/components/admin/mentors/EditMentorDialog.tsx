import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { UserUpdateRequest, UserResponseDTO, UserRole } from "@/api/dtos/userDtos"
import { X, Plus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface EditMentorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: UserUpdateRequest) => void
  mentor: UserResponseDTO | null
}

const EditMentorDialog = ({ open, onOpenChange, onSubmit, mentor }: EditMentorDialogProps) => {
  const [horarios, setHorarios] = useState<string[]>([])
  const [horarioInput, setHorarioInput] = useState("")
  
  // Initialize horarios when mentor changes
  useEffect(() => {
    if (mentor?.horarios) {
      setHorarios(mentor.horarios)
    } else {
      setHorarios([])
    }
  }, [mentor])
  
  const addHorario = () => {
    if (horarioInput && !horarios.includes(horarioInput)) {
      setHorarios(prev => [...prev, horarioInput])
      setHorarioInput("")
    }
  }
  
  const removeHorario = (horario: string) => {
    setHorarios(prev => prev.filter(h => h !== horario))
  }
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const mentorData: UserUpdateRequest = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      tel: formData.get('tel') as string,
      biography: formData.get('biography') as string,
      expertise: formData.get('expertise') as string,
      emailNotifications: formData.get('emailNotifications') === 'on',
      pushNotifications: formData.get('pushNotifications') === 'on',
      weeklyReport: formData.get('weeklyReport') === 'on',
      studyReminder: formData.get('studyReminder') === 'on',
      role: UserRole.MENTOR,
      horarios: horarios.length > 0 ? horarios : undefined,
    }
    onSubmit(mentorData)
  }
  
  const handleClose = () => {
    // Reset the horario input state when dialog closes
    setHorarioInput("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Editar Mentor</DialogTitle>
          <DialogDescription>
            Atualize os dados do mentor abaixo.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <form onSubmit={handleSubmit} className="space-y-4 p-1">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" name="name" defaultValue={mentor?.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={mentor?.email} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tel">Telefone</Label>
              <Input id="tel" name="tel" type="tel" defaultValue={mentor?.tel} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="biography">Biografia</Label>
              <Input id="biography" name="biography" defaultValue={mentor?.biography} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expertise">Especialidade</Label>
              <Input id="expertise" name="expertise" defaultValue={mentor?.expertise} required />
            </div>
            
            <div className="space-y-2">
              <Label>Horários disponíveis</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Ex: 8:00, 14:30" 
                  value={horarioInput}
                  onChange={(e) => setHorarioInput(e.target.value)}
                />
                <Button 
                  type="button" 
                  onClick={addHorario}
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {horarios.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {horarios.map((horario, index) => (
                    <Badge key={index} variant="secondary" className="px-2 py-1">
                      {horario}
                      <button 
                        type="button" 
                        onClick={() => removeHorario(horario)}
                        className="ml-2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Notificações</Label>
              <div className="flex items-center space-x-2">
                <Switch id="emailNotifications" name="emailNotifications" defaultChecked={mentor?.emailNotifications} />
                <Label htmlFor="emailNotifications">Notificações por Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="pushNotifications" name="pushNotifications" defaultChecked={mentor?.pushNotifications} />
                <Label htmlFor="pushNotifications">Notificações Push</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="weeklyReport" name="weeklyReport" defaultChecked={mentor?.weeklyReport} />
                <Label htmlFor="weeklyReport">Relatório Semanal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="studyReminder" name="studyReminder" defaultChecked={mentor?.studyReminder} />
                <Label htmlFor="studyReminder">Lembrete de Estudo</Label>
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                Atualizar Mentor
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default EditMentorDialog