
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Clock, Trophy, Target, ArrowLeft, Check, 
  ChevronRight, AlertCircle, CheckCircle, XCircle, Play 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Mock data for the challenge
const challengeData = {
  id: "ch1",
  title: "Desafio Semanal de Programação",
  description: "Resolva 50 exercícios de programação em uma semana para ganhar 500 XP e destravar novos conteúdos.",
  type: "weekly",
  xp: 500,
  deadline: "2023-12-31T23:59:59",
  progress: 30,
  total: 50,
  exercises: [
    { id: "ex1", title: "Variáveis e Tipos", completed: true, difficulty: "easy" },
    { id: "ex2", title: "Estruturas Condicionais", completed: true, difficulty: "easy" },
    { id: "ex3", title: "Estruturas de Repetição", completed: true, difficulty: "medium" },
    { id: "ex4", title: "Funções e Métodos", completed: true, difficulty: "medium" },
    { id: "ex5", title: "Arrays e Listas", completed: true, difficulty: "medium" },
    { id: "ex6", title: "Manipulação de Strings", completed: false, difficulty: "hard" },
    { id: "ex7", title: "Algoritmos de Ordenação", completed: false, difficulty: "hard" },
    { id: "ex8", title: "Estruturas de Dados", completed: false, difficulty: "expert" },
  ]
};

// Get difficulty badge color
const getDifficultyColor = (difficulty: string) => {
  switch(difficulty) {
    case "easy": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "medium": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "hard": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
    case "expert": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default: return "";
  }
};

export default function ContinueChallenge() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [exercisesData, setExercisesData] = useState(challengeData.exercises);
  const [progress, setProgress] = useState(challengeData.progress);
  
  // Calculate remaining time
  const deadline = new Date(challengeData.deadline);
  const now = new Date();
  const diffTime = Math.abs(deadline.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Calculate progress percentage
  const progressPercent = (progress / challengeData.total) * 100;
  
  const handleStartExercise = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
    setActiveExercise(exerciseId);
    toast({
      title: "Exercício iniciado",
      description: "Boa sorte! Você pode salvar seu progresso a qualquer momento.",
    });
    
    // In a real application, you would navigate to the exercise page
    // For demonstration, we'll just show a toast
    toast({
      title: "Exercício iniciado",
      description: "Em um aplicativo real, você seria redirecionado para a página do exercício.",
    });
  };
  
  const handleCompleteExercise = (exerciseId: string) => {
    // Update exercise completion status
    const updatedExercises = exercisesData.map(ex => 
      ex.id === exerciseId ? { ...ex, completed: true } : ex
    );
    setExercisesData(updatedExercises);
    
    // Update progress
    const newCompletedCount = updatedExercises.filter(ex => ex.completed).length;
    setProgress(newCompletedCount);
    
    // Reset active exercise
    setActiveExercise(null);
    
    toast({
      title: "Exercício concluído!",
      description: "Parabéns! Você ganhou pontos por concluir este exercício.",
    });
  };
  
  const handleFinishChallenge = () => {
    // Check if all exercises are completed
    const allCompleted = exercisesData.every(ex => ex.completed);
    
    if (allCompleted) {
      toast({
        title: "Desafio concluído!",
        description: `Parabéns! Você completou o desafio e ganhou ${challengeData.xp} XP.`,
      });
      
      // Navigate back to challenges list
      setTimeout(() => {
        navigate("/desafios");
      }, 2000);
    } else {
      const remainingCount = exercisesData.filter(ex => !ex.completed).length;
      
      toast({
        title: "Desafio incompleto",
        description: `Você ainda tem ${remainingCount} exercícios para completar.`,
        variant: "destructive"
      });
    }
  };
  
  const renderExerciseStatus = (completed: boolean) => {
    if (completed) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
  };
  
  return (
    <div className="container py-8 space-y-6">
      <Link to="/desafios" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para desafios
      </Link>
      
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{challengeData.title}</h1>
          <p className="text-muted-foreground max-w-2xl">
            {challengeData.description}
          </p>
          
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span>{challengeData.xp} XP</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>{diffDays} dias restantes</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4" />
              <span>{progress}/{challengeData.total} exercícios</span>
            </div>
          </div>
        </div>
        
        <Card className="w-full md:w-80">
          <CardHeader>
            <CardTitle>Progresso do Desafio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {progress} de {challengeData.total} completados
                </span>
                <span className="text-sm font-medium">{progressPercent.toFixed(0)}%</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <Badge 
                  variant="outline"
                  className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                >
                  Em andamento
                </Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={handleFinishChallenge}
            >
              Finalizar Desafio
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Exercícios</h2>
        <div className="grid gap-4">
          {exercisesData.map((exercise) => (
            <Card 
              key={exercise.id} 
              className={`transition-all ${
                exercise.completed ? 'border-green-200 dark:border-green-800' : ''
              } ${
                selectedExercise === exercise.id ? 'ring-2 ring-primary' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {renderExerciseStatus(exercise.completed)}
                    <div>
                      <h3 className="font-medium">{exercise.title}</h3>
                      <Badge 
                        variant="outline" 
                        className={`mt-1 ${getDifficultyColor(exercise.difficulty)}`}
                      >
                        {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  {activeExercise === exercise.id ? (
                    <Button 
                      onClick={() => handleCompleteExercise(exercise.id)}
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Concluir
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleStartExercise(exercise.id)}
                      disabled={exercise.completed}
                      variant={exercise.completed ? "outline" : "default"}
                    >
                      {exercise.completed ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Concluído
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Iniciar
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
