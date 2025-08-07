import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Trophy, BarChart, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PracticeResponseDTO } from "@/api/dtos/practiceDtos";
import { PracticeStudentAPI } from "@/api/student/controllers/PracticeStudentAPI";
import { PracticeExecutionResponseDTO } from "@/api/dtos/practiceExecutionDtos";
import { PracticeExecutionStudentAPI } from "@/api/student/controllers/PracticeExecutionStudentAPI";

const StudentExams = () => {
  const [examProgress, setExamProgress] = useState(0);
  const [practices, setPractices] = useState<PracticeResponseDTO[]>([]);
  const [executions, setExecutions] = useState<PracticeExecutionResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [practiceData, executionData] = await Promise.all([
          PracticeStudentAPI.getAllPractices(),
          PracticeExecutionStudentAPI.getAllStudentPracticeExecutions()
        ]);
        
        console.log("Fetched practices:", practiceData);
        console.log("Fetched executions:", executionData);
        
        setPractices(practiceData);
        setExecutions(executionData);
        
        // Calculate progress based on unique completed practices
        const uniqueCompletedPracticeIds = new Set(executionData.map(exec => exec.practice.id));
        const totalPractices = practiceData.length;
        const progress = totalPractices > 0 
          ? Math.round((uniqueCompletedPracticeIds.size / totalPractices) * 100) 
          : 0;
        setExamProgress(progress);
        
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Não foi possível carregar os dados. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleStartExam = (practiceId: string) => {
    navigate(`/dashboard/simulados/prova/${practiceId}`);
    toast.success("Iniciando simulado...");
  };

  const handleViewResults = (practiceId: string) => {
    navigate(`/simulados/resultado/${practiceId}`);
    toast.success("Carregando resultados...");
  };

  const getPracticeStatus = (practice: PracticeResponseDTO) => {
    const now = new Date();
    const openingDate = new Date(practice.openingDate);
    const maximumDate = new Date(practice.maximumDate);

    if (openingDate >= maximumDate) {
      return { status: "Datas Inválidas", variant: "destructive" as const };
    }
    
    if (now < openingDate) {
      return { status: "Agendado", variant: "outline" as const };
    }
    if (now > maximumDate) {
      return { status: "Concluído", variant: "secondary" as const };
    }
    return { status: "Disponível", variant: "default" as const };
  };

  // Get the number of attempts for a specific practice
  const getAttemptCountForPractice = (practiceId: string) => {
    return executions.filter(exec => exec.practice.id === practiceId).length;
  };

  // Calculate statistics from executions
  const getStats = () => {
    if (executions.length === 0) {
      return {
        completedPracticeCount: 0,
        avgScore: 0,
        avgTime: 0
      };
    }

    // Count unique completed practices
    const completedPracticeIds = new Set(executions.map(exec => exec.practice.id));
    const completedPracticeCount = completedPracticeIds.size;

    // Calculate average score based on actual questions array length
    const totalScore = executions.reduce((sum, exec) => {
      const questionCount = new Set(exec.practice.questions).size;
      console.log(`Execution ${exec.id}: ${exec.correctAnswers}/${questionCount} questions correct`);
      return sum + (questionCount > 0 ? (exec.correctAnswers / questionCount * 100) : 0);
    }, 0);
    const avgScore = Math.round(totalScore / executions.length);
    
    // Calculate average time across all executions
    const totalTime = executions.reduce((sum, exec) => sum + (exec.duration || 0), 0);
    const avgTime = Math.round(totalTime / executions.length / 60); // Convert to minutes

    return { completedPracticeCount, avgScore, avgTime };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center">
        <div className="animate-pulse text-lg">Carregando simulados...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-red-800">{error}</h3>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Simulados</h1>
          <p className="text-muted-foreground">
            Prepare-se para o sucesso com nossos simulados completos
          </p>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-primary-100 to-primary-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            Seu Progresso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progresso Geral</span>
            <span className="text-sm font-medium">{examProgress}%</span>
          </div>
          <Progress value={examProgress} className="h-2" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-3 bg-white/50 rounded-lg p-4">
              <Award className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm font-medium">Simulados Completos</p>
                <p className="text-2xl font-bold">{stats.completedPracticeCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/50 rounded-lg p-4">
              <BarChart className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm font-medium">Média Geral</p>
                <p className="text-2xl font-bold">{stats.avgScore}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/50 rounded-lg p-4">
              <Clock className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm font-medium">Tempo Médio</p>
                <p className="text-2xl font-bold">{stats.avgTime}m</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {practices.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-blue-800">Nenhum simulado disponível</h3>
          <p className="text-blue-600 mt-2">Quando houver simulados disponíveis, eles aparecerão aqui.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {practices.map((practice) => {
            const { status, variant } = getPracticeStatus(practice);
            const isInvalid = status === "Datas Inválidas";
            const isCompleted = status === "Concluído";
            const isAvailable = status === "Disponível";
            const attemptCount = getAttemptCountForPractice(practice.id);
            const maxAttemptsReached = attemptCount >= (practice.numberOfAllowedAttempts || 1);

            return (
              <Card key={practice.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{practice.title}</CardTitle>
                    <Badge variant={variant}>{status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {isCompleted 
                      ? `Simulado realizado em ${new Date(practice.openingDate).toLocaleDateString()}`
                      : `Criado por: ${practice.mentor.name}`}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Duração: {Math.floor(practice.duracao / 60)}h{practice.duracao % 60}m</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BarChart className="w-4 h-4" />
                      <span>{new Set(practice.questions).size} questões</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Tentativas: {attemptCount}/{practice.numberOfAllowedAttempts || 1}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {isInvalid ? (
                    <Button variant="destructive" className="w-full" disabled>
                      Datas inválidas
                    </Button>
                  ) : isAvailable ? (
                    <Button 
                      className="w-full" 
                      onClick={() => handleStartExam(practice.id)}
                      disabled={maxAttemptsReached}
                    >
                      {maxAttemptsReached ? "Tentativas esgotadas" : "Começar Simulado"}
                    </Button>
                  ) : isCompleted ? (
                    <Button variant="outline" className="w-full" onClick={() => handleViewResults(practice.id)}>
                      Ver Resultados
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      Aguardando abertura
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentExams;