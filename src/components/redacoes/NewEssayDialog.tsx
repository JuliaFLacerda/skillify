import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EssayCreateDTO } from "@/api/dtos/essayDtos"
import { useState, useEffect } from "react"

interface NewEssayDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: EssayCreateDTO) => void
  classrooms: { id: string; name: string }[]
}

export const NewEssayDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit,
  classrooms
}: NewEssayDialogProps) => {
  const [form, setForm] = useState<EssayCreateDTO>({
    theme: "",
    description: "",
    minWords: 0,
    maxDate: "",
    classroomId: ""
  })
  const [error, setError] = useState<string>("")
  const [date, setDate] = useState<string>("")
  const [time, setTime] = useState<string>("12:00")

  // Set default date and time when dialog opens
  useEffect(() => {
    if (open) {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      const defaultDate = tomorrow.toISOString().split('T')[0]
      const defaultTime = "23:59" // Default to end of day
      
      setDate(defaultDate)
      setTime(defaultTime)
      setForm(prev => ({
        ...prev,
        maxDate: `${defaultDate}T${defaultTime}:00.000Z`
      }))
    }
  }, [open])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value
    setDate(newDate)
    updateMaxDate(newDate, time)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setTime(newTime)
    updateMaxDate(date, newTime)
  }

  const updateMaxDate = (dateStr: string, timeStr: string) => {
    if (dateStr && timeStr) {
      const [hours, minutes] = timeStr.split(':')
      const date = new Date(dateStr)
      date.setHours(parseInt(hours, 10))
      date.setMinutes(parseInt(minutes, 10))
      
      setForm(prev => ({
        ...prev,
        maxDate: date.toISOString()
      }))
    }
  }

  const handleSubmit = () => {
    // Validate required fields
    if (!form.theme || !form.classroomId) {
      setError("Por favor, preencha todos os campos obrigatórios (tema e turma)")
      return
    }

    // Validate date
    if (!date) {
      setError("Por favor, selecione uma data válida")
      return
    }

    // Validate time
    if (!time) {
      setError("Por favor, selecione um horário válido")
      return
    }

    const essayData: EssayCreateDTO = {
      ...form,
      minWords: Number(form.minWords) || 0
    }

    setError("")
    onSubmit(essayData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-white">Nova Redação</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {error && (
            <div className="text-red-400 text-sm p-2 bg-red-900/20 rounded">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="theme" className="text-white">Tema da Redação</Label>
            <Input
              id="theme"
              value={form.theme}
              onChange={(e) => setForm({ ...form, theme: e.target.value })}
              placeholder="Digite o tema da redação..."
              className="bg-white/5 border-slate-800 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Descrição</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Detalhes adicionais sobre o tema..."
              className="bg-white/5 border-slate-800 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minWords" className="text-white">Número Mínimo de Palavras</Label>
              <Input
                id="minWords"
                type="number"
                value={form.minWords}
                onChange={(e) => setForm({ ...form, minWords: Number(e.target.value) })}
                placeholder="Ex: 500"
                className="bg-white/5 border-slate-800 text-white"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classroomId" className="text-white">Turma</Label>
              <Select 
                value={form.classroomId} 
                onValueChange={(value) => setForm({ ...form, classroomId: value })}
              >
                <SelectTrigger className="bg-white/5 border-slate-800 text-white">
                  <SelectValue placeholder="Selecione uma turma" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800">
                  {classrooms.map(classroom => (
                    <SelectItem 
                      key={classroom.id} 
                      value={classroom.id}
                      className="text-white hover:bg-slate-800"
                    >
                      {classroom.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-white">Data de Entrega</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={handleDateChange}
                className="bg-white/5 border-slate-800 text-white"
                min={new Date().toISOString().split('T')[0]} // Today's date
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-white">Horário</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={handleTimeChange}
                className="bg-white/5 border-slate-800 text-white"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="bg-white/5 border-slate-800 hover:bg-white/10 hover:border-slate-700 text-white"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white border-none"
          >
            Criar Redação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}