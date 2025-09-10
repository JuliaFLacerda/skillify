import { useState } from "react"
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
import { RegisterRequest } from "@/api/dtos/authDtos"
import { UserRole } from "@/api/dtos/userDtos"
import { X, Plus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface NewMentorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: RegisterRequest) => void
}

const NewMentorDialog = ({ open, onOpenChange, onSubmit }: NewMentorDialogProps) => {
  const [horarios, setHorarios] = useState<string[]>([])
  const [horarioInput, setHorarioInput] = useState("")
  
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
    const mentorData: RegisterRequest = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      tel: formData.get('tel') as string || undefined,
      biography: formData.get('biography') as string || undefined,
      emailNotifications: formData.get('emailNotifications') === 'on',
      pushNotifications: formData.get('pushNotifications') === 'on',
      weeklyReport: formData.get('weeklyReport') === 'on',
      studyReminder: formData.get('studyReminder') === 'on',
      role: UserRole.MENTOR,
      expertise: formData.get('specialty') as string || undefined,
      classId: undefined, // Optional field, not included in form for now
      horarios: horarios.length > 0 ? horarios : undefined,
    }
    onSubmit(mentorData)
  }
  
  const handleClose = () => {
    setHorarios([])
    setHorarioInput("")
    onOpenChange(false)
  }
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Mentor</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo mentor abaixo.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <form onSubmit={handleSubmit} className="space-y-4 p-1">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tel">Telefone</Label>
              <Input id="tel" name="tel" type="tel" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="biography">Biografia</Label>
              <Input id="biography" name="biography" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Especialidade</Label>
              <Input id="specialty" name="specialty" required />
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
            
            <DialogFooter className="pt-4">
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                Adicionar Mentor
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default NewMentorDialog