import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CourseForm {
  name: string
  description: string
  level: string
  duration: number
  imageUrl?: string
}

interface CourseDialogsProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
  form: CourseForm
  onFormChange: (form: CourseForm) => void
  onSubmit: () => void
  isLoading: boolean
  isEdit?: boolean
}

export const CourseDialogs = ({
  isOpen,
  onOpenChange,
  title,
  form,
  onFormChange,
  onSubmit,
  isLoading,
  isEdit = false
}: CourseDialogsProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor={`${isEdit ? 'edit-' : ''}name`}>Nome do Curso</Label>
            <Input
              id={`${isEdit ? 'edit-' : ''}name`}
              value={form.name}
              onChange={(e) => onFormChange({ ...form, name: e.target.value })}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${isEdit ? 'edit-' : ''}description`}>Descrição</Label>
            <Input
              id={`${isEdit ? 'edit-' : ''}description`}
              value={form.description}
              onChange={(e) => onFormChange({ ...form, description: e.target.value })}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${isEdit ? 'edit-' : ''}level`}>Nível</Label>
            <Input
              id={`${isEdit ? 'edit-' : ''}level`}
              value={form.level}
              onChange={(e) => onFormChange({ ...form, level: e.target.value })}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${isEdit ? 'edit-' : ''}duration`}>Duração (minutos)</Label>
            <Input
              id={`${isEdit ? 'edit-' : ''}duration`}
              type="number"
              value={form.duration}
              onChange={(e) => onFormChange({ ...form, duration: parseInt(e.target.value) || 0 })}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${isEdit ? 'edit-' : ''}imageUrl`}>URL da Imagem de Capa</Label>
            <Input
              id={`${isEdit ? 'edit-' : ''}imageUrl`}
              value={form.imageUrl || ""}
              onChange={(e) => onFormChange({ ...form, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={onSubmit}
            disabled={isLoading}
          >
            {isLoading ? (isEdit ? "Salvando..." : "Criando...") : (isEdit ? "Salvar Alterações" : "Criar Curso")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}