import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calendar, Star, Target } from "lucide-react";
import { CourseLessonContentWatchEventStudentAPI } from "@/api/student/controllers/CourseLessonContentWatchEventStudentAPI";
import { CourseStudentAPI } from "@/api/student/controllers/CourseStudentAPI";
import { CourseLessonContentWatchEventResponseDTO } from "@/api/dtos/courseLessonContentWatchEventDtos";
import { CourseLessonResponseDTO } from "@/api/dtos/courseLessonDtos";

export const LearningStats = () => {
  const [distinctCourses, setDistinctCourses] = useState<number>(0);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [dailyAverageHours, setDailyAverageHours] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLearningStats = async () => {
      setLoading(true);
      try {
        // Fetch all watch events
        const watchEvents = await CourseLessonContentWatchEventStudentAPI.getAllWatchEvents();

        // Fetch all available courses
        const courses = await CourseStudentAPI.getAllCourses();
        const lessonMap = new Map<string, CourseLessonResponseDTO>(); // Map contentId to lesson
        const courseIds = new Set<string>();
        const uniqueLessons = new Set<string>(); // Track unique lesson IDs
        let totalMinutes = 0;
        const eventDates: Date[] = [];

        // Fetch lessons for each course and build content-to-lesson mapping
        for (const course of courses) {
          const lessons = await CourseStudentAPI.getCourseLessons(course.id);
          lessons.forEach((lesson) => {
            courseIds.add(course.id);
            lesson.content.forEach((content) => {
              lessonMap.set(content.id, lesson);
            });
          });
        }

        // Process watch events
        watchEvents.forEach((event) => {
          const lesson = lessonMap.get(event.courseLessonContentId);
          if (lesson) {
            // Cursos Completos: Track course IDs
            courseIds.add(lesson.course.id);

            // Horas Estudadas and Média Diária: Sum unique lesson durations
            if (!uniqueLessons.has(lesson.id)) {
              uniqueLessons.add(lesson.id);
              totalMinutes += lesson.duration;
            }

            // Média Diária: Collect valid event dates
            const eventDate = new Date(event.createdAt);
            if (!isNaN(eventDate.getTime())) {
              eventDates.push(eventDate);
            }
          }
        });

        // Calculate Cursos Completos
        setDistinctCourses(courseIds.size);

        // Calculate Horas Estudadas (convert minutes to hours)
        const totalHoursValue = Math.round((totalMinutes / 60) * 10) / 10; // Round to 1 decimal
        setTotalHours(totalHoursValue);

        // Calculate Média Diária (smart average based on time span)
        let dailyAverageHoursValue = 0;
        if (eventDates.length > 0) {
          const minDate = new Date(Math.min(...eventDates.map((d) => d.getTime())));
          const maxDate = new Date(Math.max(...eventDates.map((d) => d.getTime())));
          // Calculate time span in days (inclusive, minimum 1 day)
          const timeSpanDays = Math.max(
            1,
            Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
          );
          dailyAverageHoursValue = Math.round((totalMinutes / 60 / timeSpanDays) * 10) / 10; // Round to 1 decimal
        }
        setDailyAverageHours(dailyAverageHoursValue);
      } catch (err) {
        console.error("Error fetching learning stats:", err);
        setError("Falha ao carregar estatísticas de aprendizado");
      } finally {
        setLoading(false);
      }
    };

    fetchLearningStats();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Estatísticas de Aprendizado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <p className="text-muted-foreground">Carregando estatísticas...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Cursos Completos</p>
                  <p className="text-2xl font-bold">{distinctCourses}</p>
                </div>
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Horas Estudadas</p>
                  <p className="text-2xl font-bold">{totalHours}h</p>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Média Diária</p>
                  <p className="text-2xl font-bold">{dailyAverageHours}h</p>
                </div>
                <Star className="w-8 h-8 text-primary" />
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};