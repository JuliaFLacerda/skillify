import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import { GoalExecutionStudentAPI } from "@/api/student/controllers/GoalExecutionStudentAPI";
import { GoalExecutionResponseDTO } from "@/api/dtos/goalExecutionDtos";

interface DisplayGoal {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const RecentAchievements = () => {
  const [goals, setGoals] = useState<DisplayGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoalExecutions = async () => {
      setLoading(true);
      try {
        const executions = await GoalExecutionStudentAPI.getAllGoalExecutions();
        // Group executions by goal.id and select the latest execution
        const goalMap = new Map<string, GoalExecutionResponseDTO>();
        executions.forEach((execution) => {
          const current = goalMap.get(execution.goal.id);
          if (!current || new Date(execution.createdAt) > new Date(current.createdAt)) {
            goalMap.set(execution.goal.id, execution);
          }
        });

        // Convert to display format
        const displayGoals: DisplayGoal[] = Array.from(goalMap.values())
          .map((execution) => {
            const goal = execution.goal;
            const typeDisplay =
              goal.type === "QUESTION" ? "questões" : goal.type === "ESSAY" ? "redações" : "aulas";
            const formattedDate = new Date(execution.createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
            return {
              id: goal.id,
              title: `${goal.number} ${typeDisplay}`,
              description: `Concluído em ${formattedDate}`,
              icon: "🏆",
            };
          })
          .sort((a, b) => {
            const dateA = new Date(a.description.split("em ")[1]);
            const dateB = new Date(b.description.split("em ")[1]);
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, 3);

        setGoals(displayGoals);
      } catch (error) {
        console.error("Error fetching goal executions:", error);
        setError("Falha ao carregar desafios recentes");
      } finally {
        setLoading(false);
      }
    };

    fetchGoalExecutions();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          Desafios Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <p className="text-muted-foreground">Carregando desafios...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : goals.length === 0 ? (
            <p className="text-muted-foreground">Nenhum desafio concluído recentemente</p>
          ) : (
            goals.map((goal) => (
              <div
                key={goal.id}
                className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg"
              >
                <div className="p-2 bg-white rounded-full">
                  <span className="text-2xl">{goal.icon}</span>
                </div>
                <div>
                  <p className="font-medium">{goal.title}</p>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      </Card>
  );
};