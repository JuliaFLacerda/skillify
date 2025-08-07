import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, BookOpen, CheckCircle, Menu } from "lucide-react";
import { CourseStudentAPI } from "@/api/student/controllers/CourseStudentAPI";
import { CourseLessonContentStudentAPI } from "@/api/student/controllers/CourseLessonContentStudentAPI";
import { CourseLessonContentWatchEventStudentAPI } from "@/api/student/controllers/CourseLessonContentWatchEventStudentAPI";
import { CourseLessonResponseDTO } from "@/api/dtos/courseLessonDtos";
import { CourseLessonContentResponseDTO, CourseLessonContentType } from "@/api/dtos/courseLessonContentDtos";
import { useToast } from "@/hooks/use-toast";

export default function CourseLessonPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId?: string }>();
  const [lessons, setLessons] = useState<CourseLessonResponseDTO[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<CourseLessonResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [watchEvents, setWatchEvents] = useState<Record<string, boolean>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toast } = useToast();
  const studentId = localStorage.getItem("userId");

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

  useEffect(() => {
    async function fetchData() {
      console.log("Starting fetchData with courseId:", courseId, "and lessonId:", lessonId);
      try {
        setLoading(true);
        if (!courseId) {
          console.error("Course ID is undefined or empty");
          throw new Error("Course ID is missing");
        }

        // Fetch all lessons for the course
        console.log("Fetching lessons for courseId:", courseId);
        const courseLessons = await CourseStudentAPI.getCourseLessons(courseId);
        console.log("Fetched lessons:", courseLessons);

        // Fetch content for each lesson
        const lessonsWithContent = await Promise.all(
          courseLessons.map(async (lesson) => {
            console.log("Fetching content for lessonId:", lesson.id);
            const content = await CourseLessonContentStudentAPI.getContentByLessonId(lesson.id);
            return { ...lesson, content };
          })
        );
        console.log("Lessons with content:", lessonsWithContent);

        // Sort lessons by name for consistent ordering
        const sortedLessons = lessonsWithContent.sort((a, b) => a.name.localeCompare(b.name));
        console.log("Sorted lessons:", sortedLessons);

        setLessons(sortedLessons);

        // Fetch all watch events for the student
        const allWatchEvents = await CourseLessonContentWatchEventStudentAPI.getAllWatchEvents();
        console.log("Fetched watch events:", allWatchEvents);
        
        // Create a map of content IDs to watch status
        const watchEventMap = allWatchEvents.reduce((acc, event) => {
          acc[event.courseLessonContentId] = true;
          return acc;
        }, {} as Record<string, boolean>);
        
        setWatchEvents(watchEventMap);

        // Select lesson based on lessonId; if no lessonId or invalid, default to first lesson
        let initialLesson: CourseLessonResponseDTO | null = null;
        if (lessonId) {
          console.log("Attempting to find lesson with lessonId:", lessonId);
          initialLesson = sortedLessons.find((lesson) => lesson.id === lessonId) || null;
          if (!initialLesson && sortedLessons.length > 0) {
            console.warn("No lesson found for lessonId:", lessonId, "defaulting to first lesson");
            initialLesson = sortedLessons[0];
          }
        } else if (sortedLessons.length > 0) {
          console.log("No lessonId provided, selecting first lesson");
          initialLesson = sortedLessons[0];
        }
        console.log("Selected initial lesson:", initialLesson);
        setSelectedLesson(initialLesson);

        if (!sortedLessons.length) {
          console.warn("No lessons found for courseId:", courseId);
          toast({
            title: "Nenhuma aula encontrada",
            description: "O curso não possui aulas cadastradas.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
        toast({
          title: "Erro ao carregar aulas",
          description: "Não foi possível carregar as aulas do curso. Tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        console.log("Setting loading to false");
        setLoading(false);
      }
    }

    fetchData();
  }, [courseId, lessonId, toast]);

  const handleLessonSelect = (lesson: CourseLessonResponseDTO) => {
    console.log("Selected lesson:", lesson);
    setSelectedLesson(lesson);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleCompleteLesson = async () => {
    if (!selectedLesson || !courseId || !studentId) {
      toast({
        title: "Erro",
        description: "Nenhuma aula selecionada, curso inválido ou usuário não autenticado.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Assuming the first content item is representative for the watch event
      const content = selectedLesson.content[0];
      if (!content) {
        throw new Error("Nenhum conteúdo disponível para esta aula.");
      }

      const watchEvent = await CourseLessonContentWatchEventStudentAPI.createWatchEvent({
        courseLessonContentId: content.id,
        studentId: studentId,
      });

      console.log("Watch event created:", watchEvent);
      
      // Update watch events state
      setWatchEvents(prev => ({
        ...prev,
        [content.id]: true
      }));
      
      toast({
        title: "Aula Concluída",
        description: "A aula foi marcada como concluída com sucesso!",
      });
    } catch (error) {
      console.error("Error completing lesson:", error);
      toast({
        title: "Erro ao Concluir Aula",
        description: "Não foi possível marcar a aula como concluída. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Check if the current lesson is completed
  const isLessonCompleted = () => {
    if (!selectedLesson || selectedLesson.content.length === 0) {
      return false;
    }
    
    // Check if the first content item is marked as watched
    const firstContentId = selectedLesson.content[0].id;
    return !!watchEvents[firstContentId];
  };

  console.log("Rendering with loading:", loading, "lessons length:", lessons.length, "selectedLesson:", selectedLesson);

  if (loading) {
    return (
      <div className="container py-8">
        <p className="text-center">Carregando aulas...</p>
      </div>
    );
  }

  if (!lessons.length) {
    return (
      <div className="container py-8">
        <p className="text-center">Nenhuma aula encontrada para este curso.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for lessons */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:w-72`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Aulas do Curso</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsSidebarOpen(false)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            <Link to={`/dashboard/cursos/${courseId}`} className="mt-2 block">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Voltar ao Curso
              </Button>
            </Link>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {lessons.map((lesson) => {
                const isCompleted = lesson.content.length > 0 && !!watchEvents[lesson.content[0].id];
                
                return (
                  <Button
                    key={lesson.id}
                    variant={selectedLesson?.id === lesson.id ? "default" : "ghost"}
                    className="w-full justify-start text-left"
                    onClick={() => handleLessonSelect(lesson)}
                    asChild
                  >
                    <Link to={`/dashboard/cursos/${courseId}/visualizar/aulas/${lesson.id}`}>
                      <div className="flex items-center w-full">
                        <BookOpen className="h-4 w-4 mr-2" />
                        <span className="flex-1 truncate">{lesson.name}</span>
                        {isCompleted && <CheckCircle className="h-4 w-4 ml-2 text-green-500" />}
                      </div>
                    </Link>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 p-8 ml-0 md:ml-72">
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden mb-4"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
          <span className="ml-2">Menu</span>
        </Button>
        <Card className="max-w-7xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{selectedLesson?.name || "Selecione uma aula"}</CardTitle>
                {selectedLesson && (
                  <p className="text-sm text-muted-foreground">Duração: {selectedLesson.duration} minutos</p>
                )}
              </div>
              {selectedLesson && (
                isLessonCompleted() ? (
                  <Button variant="outline" size="sm" disabled>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Aula Concluída
                  </Button>
                ) : (
                  <Button onClick={handleCompleteLesson} variant="default" size="sm">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Concluir Aula
                  </Button>
                )
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedLesson ? (
              selectedLesson.content
                .sort((a, b) => a.position - b.position)
                .map((content: CourseLessonContentResponseDTO) => (
                  <div key={content.id} className="border-b pb-4 last:border-b-0">
                    {content.type === CourseLessonContentType.TEXT && (
                      <div className="prose max-w-none">
                        <p className="whitespace-pre-wrap">{content.value}</p>
                      </div>
                    )}
                    {content.type === CourseLessonContentType.IMAGE && (
                      <div className="mt-2">
                        <img
                          src={content.value}
                          alt="Lesson content"
                          className="max-w-full h-auto rounded-md border mx-auto"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      </div>
                    )}
                    {content.type === CourseLessonContentType.VIDEO && (
                      <div className="mt-2">
                        {getYouTubeEmbedUrl(content.url || content.value) ? (
                          <div className="relative w-full" style={{ paddingTop: "56.25%" /* 16:9 aspect ratio */ }}>
                            <iframe
                              src={getYouTubeEmbedUrl(content.url || content.value)!}
                              title="YouTube video"
                              className="absolute top-0 left-0 w-full h-full rounded-md border mx-auto"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <video
                            src={content.url || content.value}
                            controls
                            className="max-w-full h-auto rounded-md border mx-auto"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <p className="text-muted-foreground text-center">Selecione uma aula para visualizar o conteúdo.</p>
            )}
            {selectedLesson && selectedLesson.content.length === 0 && (
              <p className="text-muted-foreground text-center">Nenhum conteúdo disponível para esta aula.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}