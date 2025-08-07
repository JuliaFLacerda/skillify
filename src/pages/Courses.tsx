import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BookOpen, Clock, Filter, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const levelLabels = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
}

const categories = ["Todos", "Frontend", "Backend", "Programação", "DevOps", "Mobile"]
const levels = ["Todos", "beginner", "intermediate", "advanced"]

const mockCourses = [
  {
    id: "1",
    title: "Fundamentos do React",
    description: "Domine os fundamentos do React com projetos práticos",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    duration: "8 horas",
    level: "beginner" as const,
    category: "Frontend",
    enrolled: true,
    progress: 65,
    totalLessons: 10,
    completedLessons: 6,
  },
  {
    id: "2",
    title: "TypeScript Avançado",
    description: "Aprenda recursos avançados e boas práticas de TypeScript",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    duration: "12 horas",
    level: "advanced" as const,
    category: "Programação",
    enrolled: true,
    progress: 30,
    totalLessons: 15,
    completedLessons: 5,
  },
  {
    id: "3",
    title: "Desenvolvimento Backend com Node.js",
    description: "Construa aplicações escaláveis com Node.js",
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479",
    duration: "15 horas",
    level: "intermediate" as const,
    category: "Backend",
    enrolled: false,
    progress: 0,
    totalLessons: 20,
    completedLessons: 0,
  },
] as const

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedLevel, setSelectedLevel] = useState("Todos")

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "Todos" || course.category === selectedCategory
    const matchesLevel = selectedLevel === "Todos" || course.level === selectedLevel
    return matchesSearch && matchesCategory && matchesLevel
  })

  return (
    <div className="container py-8 space-y-8 animate-fadeIn">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Cursos Disponíveis</h1>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative">
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
              src={course.thumbnail}
              alt={course.title}
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
                  {levelLabels[course.level]}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  {course.duration}
                </div>
              </div>
              <CardTitle className="line-clamp-1">{course.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {course.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {course.enrolled && (
                <div className="mb-4">
                  <div className="text-sm text-muted-foreground mb-2">
                    Progresso: {course.progress}%
                  </div>
                  <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="mt-auto">
              <Button className="w-full" asChild>
                <a href={`/cursos/${course.id}`}>
                  {course.enrolled ? "Continuar" : "Começar Agora"}
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Courses