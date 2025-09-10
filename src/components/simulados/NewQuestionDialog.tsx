// src/components/simulados/NewQuestionDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"

interface OptionForm {
  title: string
  correct: boolean
}

interface NewQuestionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (question: { title: string; options: OptionForm[] }) => void
}

export function NewQuestionDialog({ open, onOpenChange, onSubmit }: NewQuestionDialogProps) {
  const [questionTitle, setQuestionTitle] = useState("")
  const [options, setOptions] = useState<OptionForm[]>([
    { title: "", correct: false }
  ])

  const handleAddOption = () => {
    setOptions([...options, { title: "", correct: false }])
  }

  const handleOptionChange = (index: number, field: keyof OptionForm, value: string | boolean) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], [field]: value }
    setOptions(newOptions)
  }

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (!questionTitle || options.length === 0 || options.some(opt => !opt.title)) {
      return
    }
    onSubmit({ title: questionTitle, options })
    setQuestionTitle("")
    setOptions([{ title: "", correct: false }])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-black/80 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-white">Nova Questão</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Título da Questão</Label>
            <Input
              id="title"
              value={questionTitle}
              onChange={(e) => setQuestionTitle(e.target.value)}
              className="bg-white/5 border-slate-800 text-white"
              placeholder="Digite o título da questão"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Opções</Label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Checkbox
                  checked={option.correct}
                  onCheckedChange={(checked) => handleOptionChange(index, "correct", checked)}
                />
                <Input
                  value={option.title}
                  onChange={(e) => handleOptionChange(index, "title", e.target.value)}
                  className="bg-white/5 border-slate-800 text-white flex-1"
                  placeholder={`Opção ${index + 1}`}
                />
                {options.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={handleAddOption}
              className="w-full bg-white/5 border-slate-800 hover:bg-white/10 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Opção
            </Button>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            disabled={!questionTitle || options.length === 0 || options.some(opt => !opt.title)}
          >
            Criar Questão
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}