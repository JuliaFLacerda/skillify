import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { XPChart } from "@/components/progress/XPChart";
import { Users, BookOpen, FileText, Target, Trophy } from "lucide-react";
import { MonthlyStudentsXpDTO, UserResponseDTO } from "@/api/dtos/userDtos";
import { EssayCorrectionResponseDTO } from "@/api/dtos/essayCorrectionDtos";
import { CourseResponseDTO } from "@/api/dtos/courseDtos";
import { UserMentorAPI } from "@/api/mentor/controllers/UserMentorAPI";
import api from "@/api/api";

const MentorDashboard = () => {
  const [totalStudents, setTotalStudents] = useState<number | null>(null);
  const [correctedEssays, setCorrectedEssays] = useState<number | null>(null);
  const [activeCourses, setActiveCourses] = useState<number | null>(null);
  const [performanceData, setPerformanceData] = useState<
    { month: string; completed: number; xp: number }[]
  >([]);
  const [topStudents, setTopStudents] = useState<UserResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch total students
        const students: UserResponseDTO[] = await UserMentorAPI.getAllStudents();
        setTotalStudents(students.length);

        // Fetch top 3 students by XP
        const sortedStudents = students.sort((a, b) => (b.xp ? parseInt(b.xp) : 0) - (a.xp ? parseInt(a.xp) : 0)).slice(0, 3);
        setTopStudents(sortedStudents);

        // Fetch corrected essays
        const essays: EssayCorrectionResponseDTO[] = await api.get(
          "/api/mentor/essay-corrections"
        );
        setCorrectedEssays(essays.length);

        // Fetch active courses
        const courses: CourseResponseDTO[] = await api.get(
          "/api/mentor/courses"
        );
        setActiveCourses(courses.length);

        // Fetch monthly XP data
        const xpData: MonthlyStudentsXpDTO[] =
          await UserMentorAPI.getXpCountAllStudentsMonthly();
        const formattedData = xpData.map((item) => {
          const date = new Date(`${item.month}-01`);
          const monthName = date.toLocaleString("pt-BR", { month: "short" });
          return {
            month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
            completed: 0,
            xp: item.totalXp || 0,
          };
        });
        setPerformanceData(formattedData.reverse());

        setLoading(false);
      } catch (err) {
        setError("Erro ao carregar os dados do dashboard.");
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: "Total de Alunos",
      value: totalStudents !== null && totalStudents !== undefined ? totalStudents.toString() : "0",
      icon: Users,
      trend: "neutral",
    },
    {
      title: "Média de Desempenho",
      value: "Não disponível",
      icon: Target,
      trend: "neutral",
    },
    {
      title: "Redações Corrigidas",
      value: correctedEssays !== null && correctedEssays !== undefined ? correctedEssays.toString() : "0",
      icon: FileText,
      trend: "neutral",
    },
    {
      title: "Cursos Ativos",
      value: activeCourses !== null && activeCourses !== undefined ? activeCourses.toString() : "0",
      icon: BookOpen,
      trend: "neutral",
    },
  ];

  if (loading) {
    return <div className="container py-8">Carregando...</div>;
  }

  if (error) {
    return <div className="container py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Dashboard do Mentor
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Bem-vindo de volta! Aqui está um resumo das suas atividades.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-primary/5"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p
                className={`text-sm ${
                  stat.trend === "up"
                    ? "text-green-600"
                    : stat.trend === "down"
                    ? "text-red-600"
                    : "text-muted-foreground"
                }`}
              ></p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-primary/5">
          <CardHeader>
            <CardTitle>Desempenho dos Alunos</CardTitle>
          </CardHeader>
          <CardContent>
            <XPChart data={performanceData} />
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-primary/5">
          <CardHeader>
            <CardTitle>Ranking dos Estudantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topStudents.length === 0 ? (
                <p className="text-muted-foreground">Nenhum estudante disponível</p>
              ) : (
                topStudents.map((student, index) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 bg-primary/5 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-primary">
                        {index + 1}º
                      </span>
                      <img
                        src={student.avatar || "/placeholder.svg"}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="text-primary">{student.xp ?? 0} XP</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MentorDashboard;