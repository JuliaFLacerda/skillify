import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { CourseLessonCategoryResponseDTO } from "@/api/dtos/courseLessonCategoryDtos";

interface LessonDialogsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  isLoading: boolean;
  categories: CourseLessonCategoryResponseDTO[];
  selectedCategoryId: string;
  onCategoryChange: (id: string) => void;
  onNewCategoryOpen: () => void;
  lessonForm: { name: string; duration: number; files: string; categoryId: string };
  setLessonForm: (form: { name: string; duration: number; files: string; categoryId: string }) => void;
}

export const LessonDialogs = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading,
  categories,
  selectedCategoryId,
  onCategoryChange,
  onNewCategoryOpen,
  lessonForm,
  setLessonForm,
}: LessonDialogsProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/80 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Aula</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="lesson-title">Nome da Aula</Label>
            <Input
              id="lesson-title"
              value={lessonForm.name}
              onChange={(e) => setLessonForm({ ...lessonForm, name: e.target.value })}
              disabled={isLoading}
              className="bg-white/5 border-slate-800"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lesson-duration">Duração (minutos)</Label>
            <Input
              id="lesson-duration"
              type="number"
              value={lessonForm.duration}
              onChange={(e) => setLessonForm({ ...lessonForm, duration: parseInt(e.target.value) || 0 })}
              disabled={isLoading}
              className="bg-white/5 border-slate-800"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lesson-category">Categoria da Aula</Label>
            <div className="flex gap-2">
              <Select
                value={selectedCategoryId}
                onValueChange={onCategoryChange}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full bg-white/5 border-slate-800">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={onNewCategoryOpen}
                disabled={isLoading}
                className="border-slate-800 text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lesson-files">Arquivos da Aula (URLs)</Label>
            <Input
              id="lesson-files"
              placeholder="Insira URLs separadas por vírgula"
              value={lessonForm.files}
              onChange={(e) => setLessonForm({ ...lessonForm, files: e.target.value })}
              disabled={isLoading}
              className="bg-white/5 border-slate-800"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="border-slate-800 text-white"
          >
            Cancelar
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? "Adicionando..." : "Adicionar Aula"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface NewCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  isLoading: boolean;
  categoryName: string;
  onCategoryNameChange: (name: string) => void;
}

export const NewCategoryDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading,
  categoryName,
  onCategoryNameChange,
}: NewCategoryDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/80 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle>Criar Nova Categoria</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Nome da Categoria</Label>
            <Input
              id="category-name"
              value={categoryName}
              onChange={(e) => onCategoryNameChange(e.target.value)}
              disabled={isLoading}
              className="bg-white/5 border-slate-800"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="border-slate-800 text-white"
          >
            Cancelar
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isLoading || !categoryName}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? "Criando..." : "Criar Categoria"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};