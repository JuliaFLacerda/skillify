import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Trash2, ImageIcon, TextCursorInput, Edit2, Video } from "lucide-react";
import { CourseMentorAPI } from "@/api/mentor/controllers/CourseMentorAPI";
import { CourseLessonMentorAPI } from "@/api/mentor/controllers/CourseLessonMentorAPI";
import { CourseLessonContentMentorAPI } from "@/api/mentor/controllers/CourseLessonContentMentorAPI";
import { CourseLessonCategoryMentorAPI } from "@/api/mentor/controllers/CourseLessonCategoryMentorAPI";
import { CourseResponseDTO } from "@/api/dtos/courseDtos";
import { CourseLessonResponseDTO, CourseLessonCreateDTO } from "@/api/dtos/courseLessonDtos";
import { CourseLessonContentCreateDTO, CourseLessonContentType } from "@/api/dtos/courseLessonContentDtos";
import { CourseLessonCategoryResponseDTO, CourseLessonCategoryCreateDTO } from "@/api/dtos/courseLessonCategoryDtos";
import { LessonDialogs, NewCategoryDialog } from "@/components/mentor/LessonDialogs";
import { LessonEditDialog } from "@/components/mentor/LessonEditDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface LessonContentItem {
  id: string;
  type: CourseLessonContentType | null;
  value: string;
  videoFile?: File | null;
}

// Utility function to extract YouTube embed URL
const getYouTubeEmbedUrl = (url: string): string | null => {
  try {
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return null;
  } catch {
    return null;
  }
};

// Optional: Validate video URLs
const validateVideoUrl = (url: string): boolean => {
  const isYouTube = getYouTubeEmbedUrl(url) !== null;
  const isVideoFile = /\.(mp4|webm|ogg)$/i.test(url);
  return isYouTube || isVideoFile;
};

const MentorCoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<CourseResponseDTO | null>(null);
  const [lessons, setLessons] = useState<CourseLessonResponseDTO[]>([]);
  const [categories, setCategories] = useState<CourseLessonCategoryResponseDTO[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [isNewLessonOpen, setIsNewLessonOpen] = useState(false);
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [isEditLessonOpen, setIsEditLessonOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<CourseLessonResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lessonForm, setLessonForm] = useState({
    name: "",
    duration: 0,
    files: "",
    categoryId: "",
  });
  const [contentItems, setContentItems] = useState<Record<string, LessonContentItem[]>>({});
  const [editContentItems, setEditContentItems] = useState<any[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setIsLoading(true);
      const [courseData, lessonsData, categoriesData] = await Promise.all([
        CourseMentorAPI.getCourseById(courseId!),
        CourseLessonMentorAPI.getLessonsByCourse(courseId!),
        CourseLessonCategoryMentorAPI.getCategoriesByCourse(courseId!),
      ]);
      setCourse(courseData);
      setLessons(lessonsData);
      setCategories(categoriesData);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar dados do curso",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewLesson = async () => {
    try {
      setIsLoading(true);
      const fileUrls = lessonForm.files
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      const lessonData: CourseLessonCreateDTO = {
        courseId: courseId!,
        courseLessonCategoryId: selectedCategoryId,
        files: fileUrls,
        name: lessonForm.name,
        duration: lessonForm.duration,
      };

      const newLesson = await CourseLessonMentorAPI.createLesson(lessonData);
      setLessons([...lessons, newLesson]);
      setLessonForm({ name: "", duration: 0, files: "", categoryId: "" });
      setSelectedCategoryId("");
      setIsNewLessonOpen(false);
      toast({
        title: "Aula adicionada",
        description: "A nova aula foi adicionada com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao adicionar a aula",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    try {
      if (!newCategoryName.trim()) {
        toast({
          title: "Erro",
          description: "O nome da categoria não pode estar vazio",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      const categoryData: CourseLessonCategoryCreateDTO = {
        courseId: courseId!,
        name: newCategoryName,
      };

      const newCategory = await CourseLessonCategoryMentorAPI.createCategory(categoryData);
      setCategories([...categories, newCategory]);
      setSelectedCategoryId(newCategory.id);
      setNewCategoryName("");
      setIsNewCategoryOpen(false);
      toast({
        title: "Categoria criada",
        description: "A nova categoria foi criada com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar categoria",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditLesson = (lesson: CourseLessonResponseDTO) => {
    setEditingLesson(lesson);
    setLessonForm({
      name: lesson.name,
      duration: lesson.duration,
      files: lesson.files.join(","),
      categoryId: lesson.courseLessonCategory.id,
    });
    setEditContentItems(
      (lesson.content || []).map((content) => ({
        ...content,
        isEditing: false,
        editValue: content.value,
      }))
    );
    setIsEditLessonOpen(true);
  };

  const handleSaveLesson = async () => {
    if (!editingLesson) return;

    try {
      setIsLoading(true);

      // Update lesson metadata
      const fileUrls = lessonForm.files
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      const lessonData: CourseLessonCreateDTO = {
        courseId: courseId!,
        courseLessonCategoryId: lessonForm.categoryId || editingLesson.courseLessonCategory.id,
        files: fileUrls,
        name: lessonForm.name,
        duration: lessonForm.duration,
      };

      const updatedLesson = await CourseLessonMentorAPI.updateLesson(editingLesson.id, lessonData);

      // Update content positions and values
      const contentPromises = editContentItems.map((content, index) => {
        const contentData: CourseLessonContentCreateDTO = {
          courseLessonId: editingLesson.id,
          position: index + 1,
          type: content.type,
          value: content.editValue,
        };
        return CourseLessonContentMentorAPI.updateContent(content.id, contentData);
      });

      const updatedContents = await Promise.all(contentPromises);

      // Update state
      setLessons((prev) =>
        prev.map((lesson) =>
          lesson.id === editingLesson.id
            ? { ...updatedLesson, content: updatedContents }
            : lesson
        )
      );

      setIsEditLessonOpen(false);
      setEditingLesson(null);
      setLessonForm({ name: "", duration: 0, files: "", categoryId: "" });
      setEditContentItems([]);
      toast({
        title: "Aula atualizada",
        description: "As alterações foram salvas com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar a aula",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta aula? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      setIsLoading(true);
      await CourseLessonMentorAPI.deleteLesson(lessonId);
      await fetchCourseData();
      toast({
        title: "Aula excluída",
        description: "A aula foi removida com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao excluir a aula",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditContent = (contentId: string, value: string) => {
    setEditContentItems((prev) =>
      prev.map((content) =>
        content.id === contentId
          ? { ...content, isEditing: true, editValue: value }
          : content
      )
    );
  };

  const handleSaveContent = (contentId: string) => {
    setEditContentItems((prev) =>
      prev.map((content) =>
        content.id === contentId
          ? { ...content, isEditing: false, value: content.editValue }
          : content
      )
    );
  };

  const moveContent = (dragIndex: number, hoverIndex: number) => {
    setEditContentItems((prev) => {
      const updatedItems = [...prev];
      const [draggedItem] = updatedItems.splice(dragIndex, 1);
      updatedItems.splice(hoverIndex, 0, draggedItem);
      return updatedItems.map((item, index) => ({
        ...item,
        position: index + 1,
      }));
    });
  };

  const addContentItem = (lessonId: string) => {
    setContentItems((prev) => ({
      ...prev,
      [lessonId]: [
        ...(prev[lessonId] || []),
        { id: crypto.randomUUID(), type: null, value: "", videoFile: null },
      ],
    }));
  };

  const removeContentItem = (lessonId: string, id: string) => {
    setContentItems((prev) => ({
      ...prev,
      [lessonId]: (prev[lessonId] || []).filter((item) => item.id !== id),
    }));
  };

  const updateContentItem = (
    lessonId: string,
    id: string,
    field: "type" | "value" | "videoFile",
    newValue: string | CourseLessonContentType | File | null
  ) => {
    if (field === "value" && typeof newValue === "string" && contentItems[lessonId]?.find((item) => item.id === id)?.type === CourseLessonContentType.VIDEO) {
      if (!validateVideoUrl(newValue)) {
        toast({
          title: "Aviso",
          description: "Por favor, insira uma URL válida do YouTube ou um arquivo de vídeo (mp4, webm, ogg).",
          variant: "destructive",
        });
      }
    }
    setContentItems((prev) => ({
      ...prev,
      [lessonId]: (prev[lessonId] || []).map((item) =>
        item.id === id ? { ...item, [field]: newValue } : item
      ),
    }));
  };

  const handleNewContent = async (lessonId: string) => {
    try {
      setIsLoading(true);
      const items = contentItems[lessonId] || [];
      const validItems = items.filter((item) => item.type && (item.value || item.videoFile));

      if (validItems.length === 0) {
        toast({
          title: "Erro",
          description: "Adicione pelo menos um conteúdo válido",
          variant: "destructive",
        });
        return;
      }

      const lesson = lessons.find((l) => l.id === lessonId);
      const maxPosition = lesson?.content?.length
        ? Math.max(...lesson.content.map((c) => c.position))
        : 0;

      const contentPromises = validItems.map((item, index) => {
        const contentData: CourseLessonContentCreateDTO = {
          courseLessonId: lessonId,
          position: maxPosition + index + 1,
          type: item.type!,
          value: item.value,
          videoFile: item.videoFile || undefined,
        };
        return CourseLessonContentMentorAPI.createContent(contentData);
      });

      const newContents = await Promise.all(contentPromises);
      setLessons((prev) =>
        prev.map((lesson) =>
          lesson.id === lessonId
            ? { ...lesson, content: [...(lesson.content || []), ...newContents] }
            : lesson
        )
      );
      setContentItems((prev) => ({ ...prev, [lessonId]: [] }));
      toast({
        title: "Conteúdo adicionado",
        description: "O novo conteúdo foi adicionado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao adicionar conteúdo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteContent = async (lessonId: string, contentId: string) => {
    try {
      setIsLoading(true);
      await CourseLessonContentMentorAPI.deleteContent(contentId);
      await fetchCourseData();
      toast({
        title: "Conteúdo excluído",
        description: "O conteúdo foi removido com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao excluir o conteúdo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderContentBuilder = (lessonId: string) => (
    <div className="space-y-4">
      <Label>Conteúdo da Aula</Label>
      <div className="space-y-3">
        {(contentItems[lessonId] || []).map((item) => (
          <div key={item.id} className="relative group">
            {item.type === null ? (
              <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center hover:border-slate-600 transition-colors">
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    className="border-slate-700 hover:bg-slate-800"
                    onClick={() =>
                      updateContentItem(lessonId, item.id, "type", CourseLessonContentType.TEXT)
                    }
                  >
                    <TextCursorInput className="h-4 w-4 mr-2" />
                    Texto
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-700 hover:bg-slate-800"
                    onClick={() =>
                      updateContentItem(lessonId, item.id, "type", CourseLessonContentType.IMAGE)
                    }
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Imagem
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-700 hover:bg-slate-800"
                    onClick={() =>
                      updateContentItem(lessonId, item.id, "type", CourseLessonContentType.VIDEO)
                    }
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Vídeo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border border-slate-800 rounded-lg p-4 bg-white/5">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="outline" className="bg-slate-900 text-slate-300">
                    {item.type === CourseLessonContentType.TEXT
                      ? "Texto"
                      : item.type === CourseLessonContentType.IMAGE
                      ? "Imagem"
                      : "Vídeo"}
                  </Badge>
                  {(contentItems[lessonId]?.length || 0) > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-400 hover:text-red-300"
                      onClick={() => removeContentItem(lessonId, item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                {item.type === CourseLessonContentType.TEXT ? (
                  <Textarea
                    className="bg-slate-900 border-slate-800 text-white"
                    value={item.value}
                    onChange={(e) => updateContentItem(lessonId, item.id, "value", e.target.value)}
                    placeholder="Digite o conteúdo textual..."
                    rows={3}
                  />
                ) : item.type === CourseLessonContentType.VIDEO ? (
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="video/mp4,video/webm,video/ogg"
                      className="bg-slate-900 border-slate-800 text-white"
                      onChange={(e) => updateContentItem(lessonId, item.id, "videoFile", e.target.files?.[0] || null)}
                    />
                    <Input
                      className="bg-slate-900 border-slate-800 text-white"
                      value={item.value}
                      onChange={(e) => updateContentItem(lessonId, item.id, "value", e.target.value)}
                      placeholder="URL do vídeo (YouTube ou arquivo mp4, webm, ogg)..."
                    />
                    {item.value && (
                      <div className="mt-2">
                        {getYouTubeEmbedUrl(item.value) ? (
                          <div className="relative w-full" style={{ paddingTop: "56.25%" /* 16:9 aspect ratio */ }}>
                            <iframe
                              src={getYouTubeEmbedUrl(item.value)!}
                              title="YouTube video"
                              className="absolute top-0 left-0 w-full h-full rounded-md border border-slate-800"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <video
                            src={item.value}
                            controls
                            className="max-w-full h-40 rounded-md border border-slate-800"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                          />
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Input
                      className="bg-slate-900 border-slate-800 text-white"
                      value={item.value}
                      onChange={(e) => updateContentItem(lessonId, item.id, "value", e.target.value)}
                      placeholder="URL da imagem..."
                    />
                    {item.value && item.type === CourseLessonContentType.IMAGE && (
                      <div className="mt-2">
                        <img
                          src={item.value}
                          alt="Preview"
                          className="max-h-40 rounded-md border border-slate-800"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="mt-2 border-slate-800 text-white"
          onClick={() => addContentItem(lessonId)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Seção
        </Button>
        {(contentItems[lessonId]?.length || 0) > 0 && (
          <Button
            className="mt-2 bg-purple-600 hover:bg-purple-700"
            onClick={() => handleNewContent(lessonId)}
            disabled={isLoading}
          >
            Salvar Conteúdo
          </Button>
        )}
      </div>
    </div>
  );

  if (isLoading || !course) {
    return <div className="text-center text-white p-6">Carregando...</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/mentor/cursos")}
              className="text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-white">{course.name}</h1>
          </div>
          <Button
            onClick={() => setIsNewLessonOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white border-none"
            disabled={isLoading}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Aula
          </Button>
        </div>

        <div className="bg-white/5 p-4 rounded-lg border border-slate-800">
          <h2 className="text-lg font-semibold text-white mb-2">Informações do Curso</h2>
          <p className="text-slate-400">Descrição: {course.description}</p>
          <p className="text-slate-400">Nível: {course.level}</p>
          <p className="text-slate-400">Duração: {course.duration} minutos</p>
          {course.imageUrl && (
            <img src={course.imageUrl} alt={course.name} className="mt-2 max-w-xs rounded" />
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Aulas</h2>
          {lessons.length === 0 ? (
            <p className="text-slate-400">Nenhuma aula cadastrada ainda</p>
          ) : (
            lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white/5 p-4 rounded-lg border border-slate-800 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-medium">{lesson.name}</h3>
                    <p className="text-slate-400">Duração: {lesson.duration} minutos</p>
                    {lesson.courseLessonCategory.id && (
                      <p className="text-slate-400">
                        Categoria:{" "}
                        {categories.find((c) => c.id === lesson.courseLessonCategory.id)?.name ||
                          "Desconhecida"}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-slate-800 text-white"
                      onClick={() => handleEditLesson(lesson)}
                      disabled={isLoading}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-800 text-red-400 hover:text-red-300 hover:border-red-400"
                      onClick={() => handleDeleteLesson(lesson.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm text-white font-medium mb-2">Conteúdo</h4>
                  {lesson.content?.length === 0 && !(contentItems[lesson.id]?.length > 0) ? (
                    <p className="text-slate-400 text-sm">Nenhum conteúdo ainda</p>
                  ) : (
                    <div className="space-y-4">
                      {lesson.content
                        ?.sort((a, b) => a.position - b.position)
                        .map((content) => (
                          <div
                            key={content.id}
                            className="bg-white/10 p-4 rounded-lg border border-slate-800"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-slate-900 text-slate-300">
                                  {content.type === CourseLessonContentType.TEXT
                                    ? "Texto"
                                    : content.type === CourseLessonContentType.IMAGE
                                    ? "Imagem"
                                    : "Vídeo"}
                                </Badge>
                                <span className="text-slate-400 text-sm">
                                  Posição {content.position}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-red-400 hover:text-red-300"
                                onClick={() => handleDeleteContent(lesson.id, content.id)}
                                disabled={isLoading}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            {content.type === CourseLessonContentType.TEXT ? (
                              <p className="text-white whitespace-pre-wrap">{content.value}</p>
                            ) : content.type === CourseLessonContentType.IMAGE ? (
                              <img
                                src={content.value}
                                alt="Content"
                                className="max-w-full h-auto rounded-md border border-slate-800"
                                onError={(e) => (e.currentTarget.style.display = "none")}
                              />
                            ) : (
                              getYouTubeEmbedUrl(content.value) ? (
                                <div className="relative w-full" style={{ paddingTop: "56.25%" /* 16:9 aspect ratio */ }}>
                                  <iframe
                                    src={getYouTubeEmbedUrl(content.value)!}
                                    title="YouTube video"
                                    className="absolute top-0 left-0 w-full h-full rounded-md border border-slate-800"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                </div>
                              ) : (
                                <video
                                  src={content.url || content.value}
                                  controls
                                  className="max-w-full h-auto rounded-md border border-slate-800"
                                  onError={(e) => (e.currentTarget.style.display = "none")}
                                />
                              )
                            )}
                          </div>
                        ))}
                      {renderContentBuilder(lesson.id)}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <LessonDialogs
          isOpen={isNewLessonOpen}
          onOpenChange={setIsNewLessonOpen}
          onSubmit={handleNewLesson}
          isLoading={isLoading}
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onCategoryChange={setSelectedCategoryId}
          onNewCategoryOpen={() => {
            console.log("Opening new category modal");
            setIsNewCategoryOpen(true);
          }}
          lessonForm={lessonForm}
          setLessonForm={setLessonForm}
        />

        <NewCategoryDialog
          isOpen={isNewCategoryOpen}
          onOpenChange={(open) => {
            setIsNewCategoryOpen(open);
            if (!open) setNewCategoryName("");
          }}
          onSubmit={handleCreateCategory}
          isLoading={isLoading}
          categoryName={newCategoryName}
          onCategoryNameChange={setNewCategoryName}
        />

        {editingLesson && (
          <LessonEditDialog
            isOpen={isEditLessonOpen}
            onOpenChange={(open) => {
              setIsEditLessonOpen(open);
              if (!open) {
                setEditingLesson(null);
                setLessonForm({ name: "", duration: 0, files: "", categoryId: "" });
                setEditContentItems([]);
              }
            }}
            lesson={editingLesson}
            categories={categories}
            onSubmit={handleSaveLesson}
            isLoading={isLoading}
            onCategoryChange={(id) => setLessonForm({ ...lessonForm, categoryId: id })}
            onNewCategoryOpen={() => setIsNewCategoryOpen(true)}
            lessonForm={lessonForm}
            setLessonForm={setLessonForm}
            contentItems={editContentItems}
            setContentItems={setEditContentItems}
            handleEditContent={handleEditContent}
            handleSaveContent={handleSaveContent}
            moveContent={moveContent}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default MentorCoursePage;