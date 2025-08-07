import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, Plus, Users, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { GoalMentorAPI } from "@/api/mentor/controllers/GoalMentorAPI"; // Adjusted path
import { GoalResponseDTO, GoalType } from "@/api/dtos/goalDtos";

export default function MentorDesafios() {
  const [activeTab, setActiveTab] = useState("active");
  const [goals, setGoals] = useState<GoalResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch goals when component mounts or tab changes
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        setError(null);

        let fetchedGoals: GoalResponseDTO[] = [];
        switch (activeTab) {
          case "active":
            fetchedGoals = await GoalMentorAPI.getActiveGoals();
            break;
          case "completed":
            // We'll filter completed goals based on finalDate
            fetchedGoals = await GoalMentorAPI.getAllGoals();
            fetchedGoals = fetchedGoals.filter(goal => 
              new Date(goal.finalDate) < new Date()
            );
            break;
          case "draft":
            // Note: The API doesn't have a specific draft endpoint
            // This could be implemented on backend or we'll assume goals without classrooms are drafts
            fetchedGoals = await GoalMentorAPI.getAllGoals();
            fetchedGoals = fetchedGoals.filter(goal => !goal.classrooms.length);
            break;
          case "all":
            fetchedGoals = await GoalMentorAPI.getAllGoals();
            break;
        }
        setGoals(fetchedGoals);
      } catch (err) {
        setError("Erro ao carregar os desafios");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [activeTab]);

  // Helper function to calculate days left
  const getDaysLeft = (finalDate: string) => {
    const now = new Date();
    const end = new Date(finalDate);
    const diffTime = end.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return <div className="container py-8">Carregando desafios...</div>;
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Desafios</h1>
          <p className="text-muted-foreground">
            Gerencie os desafios para seus alunos
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Link to="/mentor/desafios/novo">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Novo Desafio
            </Button>
          </Link>
          
          <Button variant="outline" className="w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-center">{error}</div>
      )}
      
      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
          <TabsTrigger value="draft">Rascunhos</TabsTrigger>
          <TabsTrigger value="all">Todos</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {goals.length > 0 ? (
              goals.map((goal) => {
                const daysLeft = getDaysLeft(goal.finalDate);
                const isActive = daysLeft > 0 && new Date(goal.openingDate) <= new Date();
                const isCompleted = new Date(goal.finalDate) < new Date();
                const isDraft = !goal.classrooms.length;

                return (
                  <Card key={goal.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">
                          {goal.type === GoalType.QUESTION 
                            ? "Desafio de Questões" 
                            :(goal.type === GoalType.ESSAY ? "Desafio de Redação" : "Desafio de Aulas")}
                        </CardTitle>
                        {isActive && <Badge>Ativo</Badge>}
                        {isCompleted && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                            Concluído
                          </Badge>
                        )}
                        {isDraft && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                            Rascunho
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {goal.type === GoalType.QUESTION
                          ? `Resolver ${goal.number} questões`
                          : `Escrever ${goal.number} redações`}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span>{goal.number * 100} XP</span>
                        </div>
                        {isActive && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{daysLeft} dias restantes</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{goal.classrooms.length} turmas atribuídas</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex gap-2 w-full">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          asChild
                        >
                          <Link to={`/mentor/desafios/${goal.id}`}>
                            {isDraft ? "Editar" : "Ver Resultados"}
                          </Link>
                        </Button>
                        {isDraft && (
                          <Button className="flex-1">Publicar</Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum desafio encontrado nesta categoria.
                </p>
                <Link to="/mentor/desafios/novo">
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Novo Desafio
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}