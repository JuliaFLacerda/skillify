import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Clock, Filter, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CourseStudentAPI } from "@/api/student/controllers/CourseStudentAPI";
import { CourseResponseDTO } from "@/api/dtos/courseDtos";
import { useToast } from "@/hooks/use-toast";

const levelLabels = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
};

const levels = ["Todos", "beginner", "intermediate", "advanced"];

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedLevel, setSelectedLevel] = useState("Todos");
  const [allCourses, setAllCourses] = useState<CourseResponseDTO[]>([]);
  const [categories, setCategories] = useState<string[]>(["Todos"]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        const courses = await CourseStudentAPI.getAllCourses();
        setAllCourses(courses);

        // Extract unique category names from courses
        const uniqueCategories = Array.from(
          new Set(
            courses.flatMap((course) =>
              course.categories.map((cat) => cat.categoryName)
            )
          )
        );
        setCategories(["Todos", ...uniqueCategories]);
      } catch (error) {
        toast({
          title: "Erro ao carregar cursos",
          description: "Não foi possível carregar os cursos. Tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [toast]);

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = course.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todos" ||
      course.categories.some((cat) => cat.categoryName === selectedCategory);
    const matchesLevel =
      selectedLevel === "Todos" || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  if (loading) {
    return (
      <div className="container py-8">
        <p className="text-center">Carregando cursos...</p>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8 animate-fadeIn">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Cursos Disponíveis</h1>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cursos..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedLevel}
              onValueChange={setSelectedLevel}
            >
              <SelectTrigger className="w-[180px]">
                <BookOpen className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Nível" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level === "Todos" ? level : levelLabels[level as keyof typeof levelLabels]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="flex flex-col overflow-hidden">
            <img
              src={course.imageUrl}
              alt={course.name}
              className="h-48 w-full object-cover"
            />
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    course.level === "beginner"
                      ? "default"
                      : course.level === "intermediate"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {levelLabels[course.level as keyof typeof levelLabels]}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  {course.duration} horas
                </div>
              </div>
              <CardTitle className="line-clamp-1">{course.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {course.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-sm text-muted-foreground mb-2">
                Criado por: {course.creator.name}
              </div>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button className="w-full" asChild>
                <a href={`/dashboard/cursos/${course.id}`}>Ver Curso</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Courses;