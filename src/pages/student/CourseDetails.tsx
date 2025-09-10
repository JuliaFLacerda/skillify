import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  Clock,
  CheckCircle,
  FileText,
  Download,
} from "lucide-react";
import { CourseStudentAPI } from "@/api/student/controllers/CourseStudentAPI";
import { CourseLessonContentStudentAPI } from "@/api/student/controllers/CourseLessonContentStudentAPI";
import { CourseLessonContentWatchEventStudentAPI } from "@/api/student/controllers/CourseLessonContentWatchEventStudentAPI";
import { CourseLessonCategoryStudentAPI } from "@/api/student/controllers/CourseLessonCategoryStudentAPI";
import { CourseResponseDTO } from "@/api/dtos/courseDtos";
import { CourseLessonResponseDTO } from "@/api/dtos/courseLessonDtos";
import { CourseLessonContentResponseDTO } from "@/api/dtos/courseLessonContentDtos";
import { CourseLessonContentWatchEventResponseDTO } from "@/api/dtos/courseLessonContentWatchEventDtos";
import { CourseLessonCategoryResponseDTO } from "@/api/dtos/courseLessonCategoryDtos";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Mock level labels for consistency
const levelLabels = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
};

export default function CourseDetails() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("content");
  const [course, setCourse] = useState<CourseResponseDTO | null>(null);
  const [lessons, setLessons] = useState<CourseLessonResponseDTO[]>([]);
  const [watchEvents, setWatchEvents] = useState<CourseLessonContentWatchEventResponseDTO[]>([]);
  const [categories, setCategories] = useState<CourseLessonCategoryResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCourseData() {
      try {
        setLoading(true);
        const courseId = id || "";
        
        // Fetch course details
        const courseData = await CourseStudentAPI.getCourseById(courseId);
        setCourse(courseData);

        // Fetch all lessons for the course
        const courseLessons = await CourseStudentAPI.getCourseLessons(courseId);
        
        // Fetch content for each lesson
        const lessonsWithContent = await Promise.all(
          courseLessons.map(async (lesson) => {
            const content = await CourseLessonContentStudentAPI.getContentByLessonId(lesson.id);
            return { ...lesson, content };
          })
        );
        setLessons(lessonsWithContent);

        // Fetch watch events to determine completion status
        const watchEventsData = await CourseLessonContentWatchEventStudentAPI.getAllWatchEvents();
        setWatchEvents(watchEventsData);

        // Fetch course lesson categories
        const courseCategories = await CourseLessonCategoryStudentAPI.getCategoriesByCourse(courseId);
        setCategories(courseCategories);
      } catch (error) {
        toast({
          title: "Erro ao carregar dados do curso",
          description: "Não foi possível carregar os detalhes do curso. Tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchCourseData();
    }
  }, [id, toast]);

  // Calculate progress based on watch events and total content
  const totalContentItems = lessons.reduce((sum, lesson) => sum + lesson.content.length, 0);
  const completedContentItems = watchEvents.length;
  const progress = totalContentItems > 0 ? Math.round((completedContentItems / totalContentItems) * 100) : 0;

  // Find the last watched content and determine the next lesson
  const lastWatchedEvent = watchEvents.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];

  // Create ordered lessons based on category and lesson array order
  const orderedLessons = categories.flatMap(category => 
    lessons.filter(lesson => lesson.courseLessonCategory?.id === category.id)
  );
  console.log("Ordered Lessons:", orderedLessons.map(l => l.name));

  let nextLesson = null;
  let lastWatchedLesson = null;
  let lastWatchedContent = null;

  if (lastWatchedEvent && orderedLessons.length > 0) {
    lastWatchedLesson = lessons.find(lesson => 
      lesson.content.some(content => content.id === lastWatchedEvent.courseLessonContentId)
    );
    lastWatchedContent = lessons
      .flatMap(lesson => lesson.content)
      .find(content => content.id === lastWatchedEvent.courseLessonContentId);

    if (lastWatchedLesson) {
      const lastLessonIndex = orderedLessons.findIndex(lesson => lesson.id === lastWatchedLesson.id);
      console.log("Last Watched Lesson:", lastWatchedLesson.name, "Index:", lastLessonIndex);
      // Get the next lesson if it exists, otherwise fall back to the last watched lesson
      nextLesson = lastLessonIndex + 1 < orderedLessons.length 
        ? orderedLessons[lastLessonIndex + 1]
        : lastWatchedLesson;
      console.log("Next Lesson:", nextLesson ? nextLesson.name : "None");
    }
  } else if (orderedLessons.length > 0) {
    // If no watch events but lessons exist, set nextLesson to the first lesson
    nextLesson = orderedLessons[0];
    console.log("No watch events, setting nextLesson to first lesson:", nextLesson.name);
  }

  // Group lessons by fetched categories for display
  const modules = categories.map(category => ({
    id: category.id,
    title: category.name,
    lessons: lessons.filter(lesson => lesson.courseLessonCategory?.id === category.id),
  }));

  if (loading || !course) {
    return (
      <div className="container py-8">
        <p className="text-center">Carregando detalhes do curso...</p>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link to="/cursos">
                <Button variant="ghost" size="sm">
                  Cursos
                </Button>
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-sm text-muted-foreground">Detalhes do curso</span>
            </div>
            <h1 className="text-3xl font-bold">{course.name}</h1>
            <p className="text-muted-foreground mt-2">{course.description}</p>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={course.imageUrl || "https://github.com/shadcn.png"} alt={course.creator.name} />
                <AvatarFallback>{course.creator.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{course.creator.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{lessons.length} aulas</span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{course.duration} horas</span>
            </div>

            <Badge variant="outline">{levelLabels[course.level as keyof typeof levelLabels]}</Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            {[...course.categories].map((cat) => (
              <Badge key={cat.id} variant="secondary">{cat.categoryName}</Badge>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Progresso do curso</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="flex-1"
              onClick={() => {
                if (nextLesson) {
                  navigate(`/dashboard/cursos/${course.id}/visualizar/aulas/${nextLesson.id}`);
                } else {
                  navigate(`/dashboard/cursos/${course.id}/visualizar/aulas`);
                }
              }}
              disabled={!nextLesson && orderedLessons.length === 0}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              {nextLesson ? "Continuar curso" : "Iniciar curso"}
            </Button>
            <Link to={`/dashboard/cursos/${course.id}/visualizar/aulas`}>
              <Button variant="outline" className="flex-1">
                Ver Todas as Aulas
              </Button>
            </Link>
          </div>
        </div>

        <div className="md:w-80 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Última aula visualizada</CardTitle>
            </CardHeader>
            <CardContent>
              {lastWatchedLesson && lastWatchedContent ? (
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{lastWatchedLesson.name}</h3>
                    <p className="text-sm text-muted-foreground">Continuar de onde parou</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma aula visualizada ainda</p>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                disabled={!nextLesson}
                onClick={() => {
                  if (nextLesson) {
                    navigate(`/dashboard/cursos/${course.id}/visualizar/aulas/${nextLesson.id}`);
                  }
                }}
              >
                Continuar visualizando
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Materiais do curso</CardTitle>
              <CardDescription>Recursos disponíveis para download</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Apostila do curso</span>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Código fonte</span>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="about">Sobre o curso</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 mt-6">
          {modules.map((module) => (
            <Card key={module.id}>
              <CardHeader>
                <CardTitle>{module.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {module.lessons.map((lesson) => {
                  const isCompleted = lesson.content.every((content) =>
                    watchEvents.some((event) => event.courseLessonContentId === content.id)
                  );
                  return (
                    <div key={lesson.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <BookOpen className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div>
                          <p className={`${isCompleted ? "text-muted-foreground" : "font-medium"}`}>
                            {lesson.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{lesson.duration} minutos</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          navigate(`/dashboard/cursos/${course.id}/visualizar/aulas/${lesson.id}`);
                        }}
                      >
                        {isCompleted ? "Rever" : "Visualizar"}
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sobre este curso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{course.description}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}