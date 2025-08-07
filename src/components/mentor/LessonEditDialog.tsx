import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit2 } from "lucide-react";
import { CourseLessonCategoryResponseDTO } from "@/api/dtos/courseLessonCategoryDtos";
import { CourseLessonResponseDTO } from "@/api/dtos/courseLessonDtos";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useDrag, useDrop } from "react-dnd";
import { CourseLessonContentType } from "@/api/dtos/courseLessonContentDtos";

const ItemTypes = {
  CONTENT: "content",
};

interface DraggableContentProps {
  content: any;
  index: number;
  moveContent: (dragIndex: number, hoverIndex: number) => void;
  handleEditContent: (contentId: string, value: string) => void;
  handleSaveContent: (contentId: string) => void;
}

const DraggableContent = ({
  content,
  index,
  moveContent,
  handleEditContent,
  handleSaveContent,
}: DraggableContentProps) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CONTENT,
    item: { id: content.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.CONTENT,
    hover(item: { id: string; index: number }) {
      if (item.index !== index) {
        moveContent(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`bg-white/10 p-4 rounded-lg border border-slate-800 ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-slate-900 text-slate-300">
            {content.type === CourseLessonContentType.TEXT ? "Texto" : "Imagem"}
          </Badge>
          <span className="text-slate-400 text-sm">Posição {content.position}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-blue-400 hover:text-blue-300"
          onClick={() => handleEditContent(content.id, content.value)}
        >
          <Edit2 className="h-3 w-3" />
        </Button>
      </div>
      {content.isEditing ? (
        <div className="space-y-2">
          {content.type === CourseLessonContentType.TEXT ? (
            <Textarea
              className="bg-slate-900 border-slate-800 text-white"
              value={content.editValue}
              onChange={(e) => handleEditContent(content.id, e.target.value)}
              placeholder="Digite o conteúdo textual..."
              rows={3}
            />
          ) : (
            <Input
              className="bg-slate-900 border-slate-800 text-white"
              value={content.editValue}
              onChange={(e) => handleEditContent(content.id, e.target.value)}
              placeholder="URL da imagem..."
            />
          )}
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => handleSaveContent(content.id)}
          >
            Salvar
          </Button>
        </div>
      ) : content.type === CourseLessonContentType.TEXT ? (
        <p className="text-white whitespace-pre-wrap">{content.value}</p>
      ) : (
        <img
          src={content.value}
          alt="Content"
          className="max-w-full h-auto rounded-md border border-slate-800"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      )}
    </div>
  );
};

interface LessonEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  lesson: CourseLessonResponseDTO;
  categories: CourseLessonCategoryResponseDTO[];
  onSubmit: () => void;
  isLoading: boolean;
  onCategoryChange: (id: string) => void;
  onNewCategoryOpen: () => void;
  lessonForm: { name: string; duration: number; files: string; categoryId: string };
  setLessonForm: (form: { name: string; duration: number; files: string; categoryId: string }) => void;
  contentItems: any[];
  setContentItems: (items: any[]) => void;
  handleEditContent: (contentId: string, value: string) => void;
  handleSaveContent: (contentId: string) => void;
  moveContent: (dragIndex: number, hoverIndex: number) => void;
}

export const LessonEditDialog = ({
  isOpen,
  onOpenChange,
  lesson,
  categories,
  onSubmit,
  isLoading,
  onCategoryChange,
  onNewCategoryOpen,
  lessonForm,
  setLessonForm,
  contentItems,
  setContentItems,
  handleEditContent,
  handleSaveContent,
  moveContent,
}: LessonEditDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/80 border-slate-800 text-white max-w-3xl">
        <DialogHeader>
          <DialogTitle>Editar Aula: {lesson.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Lesson Metadata Editing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Detalhes da Aula</h3>
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
                  value={lessonForm.categoryId || lesson.courseLessonCategory.id}
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

          {/* Content Editing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Conteúdo da Aula</h3>
            <p className="text-slate-300">Arraste os conteúdos para alterar sua posição</p>
            {contentItems.length === 0 ? (
              <p className="text-slate-400">Nenhum conteúdo disponível</p>
            ) : (
              <div className="space-y-4">
                {contentItems.map((content, index) => (
                  <DraggableContent
                    key={content.id}
                    content={content}
                    index={index}
                    moveContent={moveContent}
                    handleEditContent={handleEditContent}
                    handleSaveContent={handleSaveContent}
                  />
                ))}
              </div>
            )}
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
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};