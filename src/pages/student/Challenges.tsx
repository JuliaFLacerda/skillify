import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { GoalResponseDTO, GoalType } from "@/api/dtos/goalDtos";
import { GoalStudentAPI } from "@/api/student/controllers/GoalStudentAPI";
import { GoalExecutionResponseDTO } from "@/api/dtos/goalExecutionDtos";
import { GoalExecutionStudentAPI } from "@/api/student/controllers/GoalExecutionStudentAPI";

// Utility function to calculate remaining time from finalDate
const getRemainingTime = (finalDate: string): string => {
  const now = new Date();
  const end = new Date(finalDate);
  const diffMs = end.getTime() - now.getTime();
  if (diffMs <= 0) return "Expirado";

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days > 0) return `${days} dias restantes`;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours > 0) return `${hours} horas restantes`;
  return "Menos de uma hora restante";
};

// Utility function to calculate XP based on goal number (example logic)
const calculateXP = (number: number): number => {
  return number * 10; // Example: 10 XP per exercise
};

// Utility function to get challenge title based on goal type and number
const getChallengeTitle = (goal: GoalResponseDTO): string => {
  switch (goal.type) {
    case GoalType.QUESTION:
      return `Desafio de ${goal.number} Questões`;
    case GoalType.ESSAY:
      return `Desafio de ${goal.number} Redações`;
    case GoalType.LESSON:
      return `Desafio de ${goal.number} Lições`;
    default:
      return "Desafio";
  }
};

// Utility function to get challenge description
const getChallengeDescription = (goal: GoalResponseDTO): string => {
  switch (goal.type) {
    case GoalType.QUESTION:
      return `Resolva ${goal.number} questões até ${new Date(goal.finalDate).toLocaleDateString()}`;
    case GoalType.ESSAY:
      return `Escreva ${goal.number} redações até ${new Date(goal.finalDate).toLocaleDateString()}`;
    case GoalType.LESSON:
      return `Complete ${goal.number} lições até ${new Date(goal.finalDate).toLocaleDateString()}`;
    default:
      return `Complete ${goal.number} tarefas até ${new Date(goal.finalDate).toLocaleDateString()}`;
  }
};

// Utility function to count completed executions for a goal
const getCompletedCount = (goalId: string, executions: GoalExecutionResponseDTO[]): number => {
  return executions.filter((execution) => execution.goal.id === goalId).length;
};

export default function Challenges() {
  const [goals, setGoals] = useState<GoalResponseDTO[]>([]);
  const [executions, setExecutions] = useState<GoalExecutionResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch active goals and goal executions on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [activeGoals, goalExecutions] = await Promise.all([
          GoalStudentAPI.getActiveGoals(),
          GoalExecutionStudentAPI.getAllGoalExecutions(),
        ]);
        setGoals(activeGoals);
        setExecutions(goalExecutions);
        console.log(goalExecutions)
      } catch (err) {
        setError("Falha ao carregar os desafios ou progressos. Tente novamente mais tarde.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold">Desafios</h1>
        <p className="text-muted-foreground">Carregando desafios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold">Desafios</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Desafios</h1>
        <p className="text-muted-foreground">
          Complete desafios para ganhar pontos e subir no ranking
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.length === 0 ? (
          <p className="text-muted-foreground">Nenhum desafio ativo no momento.</p>
        ) : (
          goals.map((goal) => {
            const completedCount = getCompletedCount(goal.id, executions);
            return (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{getChallengeTitle(goal)}</CardTitle>
                    <Badge className="bg-primary">Em Andamento</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {getChallengeDescription(goal)}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span>{calculateXP(goal.number)} XP</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{getRemainingTime(goal.finalDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Target className="w-4 h-4" />
                      <span>
                        {completedCount}/{goal.number} {goal.type.toLowerCase()}s
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                <Link
  to={
    goal.type === GoalType.QUESTION
      ? "/dashboard/simulados"
      : goal.type === GoalType.ESSAY
      ? "/dashboard/redacoes"
      : "/dashboard/cursos"
  }
  className="w-full"
>
  <Button className="w-full">Continuar Desafio</Button>
</Link>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}