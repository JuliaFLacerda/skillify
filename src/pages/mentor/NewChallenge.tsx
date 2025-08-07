import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Calendar, Clock, Plus, Trash, Trophy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { GoalMentorAPI } from "@/api/mentor/controllers/GoalMentorAPI";
import { GoalRequestDTO, GoalType } from "@/api/dtos/goalDtos";
import { ClassroomMentorAPI } from "@/api/mentor/controllers/ClassroomMentorAPI";
import { ClassroomResponseDTO } from "@/api/dtos/classroomDtos";

export default function NewChallenge() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [number, setNumber] = useState("1");
  const [goalType, setGoalType] = useState<GoalType>(GoalType.QUESTION);
  const [openingDate, setOpeningDate] = useState(new Date().toISOString().split('T')[0]);
  const [finalDate, setFinalDate] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [classroomIds, setClassroomIds] = useState<string[]>([]);
  const [availableClassrooms, setAvailableClassrooms] = useState<ClassroomResponseDTO[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [classroomsLoading, setClassroomsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch classrooms when component mounts
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        setClassroomsLoading(true);
        const classrooms = await ClassroomMentorAPI.getAllClassrooms();
        setAvailableClassrooms(classrooms);
      } catch (err) {
        setError("Erro ao carregar as turmas");
        console.error("Error fetching classrooms:", err);
      } finally {
        setClassroomsLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  const handleCourseToggle = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleClassroomSelect = () => {
    const filteredClassroomIds = availableClassrooms
      .filter((classroom) =>
        classroom.courses.some((course) => selectedCourses.includes(course.id))
      )
      .map((classroom) => classroom.id);

    setClassroomIds([...new Set([...classroomIds, ...filteredClassroomIds])]);
    setDialogOpen(false);
    setSelectedCourses([]);
  };

  const handleCreateChallenge = async () => {
    if (!title.trim()) {
      toast({
        title: "Erro ao criar desafio",
        description: "O título do desafio é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (!number || Number(number) <= 0) {
      toast({
        title: "Erro ao criar desafio",
        description: "O número de itens deve ser maior que zero",
        variant: "destructive",
      });
      return;
    }

    if (!finalDate) {
      toast({
        title: "Erro ao criar desafio",
        description: "A data limite é obrigatória",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const goalData: GoalRequestDTO = {
        classroomIds: isPublic ? availableClassrooms.map((c) => c.id) : classroomIds,
        number: Number(number),
        type: goalType,
        openingDate: new Date(openingDate).toISOString(),
        finalDate: new Date(finalDate).toISOString(),
      };

      const createdGoal = await GoalMentorAPI.createGoal(goalData);

      toast({
        title: "Desafio criado com sucesso!",
        description: "O desafio foi criado e atribuído às turmas selecionadas.",
      });

      navigate("/mentor/desafios");
    } catch (error) {
      toast({
        title: "Erro ao criar desafio",
        description: "Ocorreu um erro ao salvar o desafio. Tente novamente.",
        variant: "destructive",
      });
      console.error("Error creating goal:", error);
    } finally {
      setLoading(false);
    }
  };

  if (classroomsLoading) {
    return <div className="container py-8">Carregando turmas...</div>;
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-red-500">{error}</div>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Tentar novamente
        </Button>
      </div>
    );
  }

  // Collect all unique courses from available classrooms
  const allCourses = Array.from(
    new Set(
      availableClassrooms.flatMap((classroom) =>
        classroom.courses.map((course) => ({ id: course.id, name: course.name }))
      )
    )
  );

  return (
    <div className="container py-8 space-y-6">
      <Link
        to="/mentor/desafios"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para desafios
      </Link>

      <div>
        <h1 className="text-3xl font-bold">Novo Desafio</h1>
        <p className="text-muted-foreground">Crie um novo desafio para seus alunos</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Desafio</Label>
                <Input
                  id="title"
                  placeholder="Ex: Desafio de questões de programação"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o objetivo do desafio..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="number">Quantidade</Label>
                  <Input
                    id="number"
                    type="number"
                    placeholder="1"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Desafio</Label>
                  <RadioGroup
                    value={goalType}
                    onValueChange={(value) => setGoalType(value as GoalType)}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={GoalType.QUESTION} id="question" />
                      <Label htmlFor="question" className="font-normal">
                        Questões
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={GoalType.ESSAY} id="essay" />
                      <Label htmlFor="essay" className="font-normal">
                        Redações
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={GoalType.LESSON} id="lesson" />
                      <Label htmlFor="lesson" className="font-normal">
                        Aulas
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="openingDate">Data de Início</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="openingDate"
                      type="date"
                      className="pl-10"
                      value={openingDate}
                      onChange={(e) => setOpeningDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="finalDate">Data Limite</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="finalDate"
                      type="date"
                      className="pl-10"
                      value={finalDate}
                      onChange={(e) => setFinalDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-bold">Configurações do Desafio</h3>

              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label>Desafio Público</Label>
                  <p className="text-sm text-muted-foreground">Disponível para todas as turmas</p>
                </div>
                <Switch checked={isPublic} onCheckedChange={setIsPublic} />
              </div>

              {!isPublic && (
                <div className="space-y-2 pt-2">
                  <Label>Selecionar Turmas</Label>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar turmas por curso
                  </Button>
                  <div className="mt-2 space-y-1">
                    {classroomIds.map((id) => (
                      <div key={id} className="flex items-center justify-between text-sm">
                        <span>{availableClassrooms.find((c) => c.id === id)?.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setClassroomIds(classroomIds.filter((cid) => cid !== id))
                          }
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between py-2 border-t">
                <div className="space-y-0.5">
                  <Label>Total de Itens</Label>
                  <p className="text-sm text-muted-foreground"> {goalType === GoalType.QUESTION ? "Questões" : goalType === GoalType.ESSAY ? "Redações" : "Aulas"} </p>
                </div>
                <span className="font-bold">{number}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-t">
                <div className="space-y-0.5">
                  <Label>Turmas Atribuídas</Label>
                  <p className="text-sm text-muted-foreground">Número de turmas</p>
                </div>
                <span className="font-bold">
                  {isPublic ? availableClassrooms.length : classroomIds.length}
                </span>
              </div>

              <Button
                onClick={handleCreateChallenge}
                className="w-full mt-4"
                disabled={loading || classroomsLoading}
              >
                {loading ? "Criando..." : "Criar Desafio"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-2">Dicas para Desafios</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Defina metas realistas para o número de itens
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Escolha datas que deem tempo suficiente aos alunos
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Forneça instruções claras na descrição
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Selecionar Cursos</DialogTitle>
            <DialogDescription>
              Escolha os cursos para adicionar as turmas correspondentes ao desafio.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Cursos</Label>
              <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                {allCourses.map((course) => (
                  <div key={course.id} className="flex items-center space-x-2 py-1">
                    <input
                      type="checkbox"
                      id={`course-${course.id}`}
                      checked={selectedCourses.includes(course.id)}
                      onChange={() => handleCourseToggle(course.id)}
                    />
                    <label htmlFor={`course-${course.id}`}>{course.name}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleClassroomSelect}
              disabled={selectedCourses.length === 0}
            >
              Adicionar Turmas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}