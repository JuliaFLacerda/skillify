import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, ChevronDown, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PracticeResponseDTO } from "@/api/dtos/practiceDtos";
import { PracticeMentorAPI } from "@/api/mentor/controllers/PracticeMentorAPI";
import { QuestionMentorAPI } from "@/api/mentor/controllers/QuestionMentorAPI";
import { QuestionResponseDTO, QuestionContentType } from "@/api/dtos/questionDtos";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CourseMentorAPI } from "@/api/mentor/controllers/CourseMentorAPI";
import { CourseResponseDTO } from "@/api/dtos/courseDtos";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface EditQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  simulado: PracticeResponseDTO | null;
  onQuestionRemoved: (updatedSimulado: PracticeResponseDTO) => void;
  onAddQuestion: () => void;
}

export function EditQuestionsDialog({ 
  open, 
  onOpenChange, 
  simulado, 
  onQuestionRemoved,
  onAddQuestion 
}: EditQuestionsDialogProps) {
  const { toast } = useToast();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [mentorQuestions, setMentorQuestions] = useState<QuestionResponseDTO[]>([]);
  const [superAdminQuestions, setSuperAdminQuestions] = useState<QuestionResponseDTO[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [localQuestions, setLocalQuestions] = useState<QuestionResponseDTO[]>([]);
  const [courses, setCourses] = useState<CourseResponseDTO[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  useEffect(() => {
    if (simulado?.questions) {
      setLocalQuestions(Array.from(simulado.questions));
    } else {
      setLocalQuestions([]);
    }
  }, [simulado]);

  useEffect(() => {
    if (open) {
      fetchBankQuestions();
      fetchCourses();
    }
  }, [open]);

  const fetchBankQuestions = async () => {
    try {
      setLoadingQuestions(true);
      const [mentorQs, superAdminQs] = await Promise.all([
        QuestionMentorAPI.getAllQuestions(),
        QuestionMentorAPI.getSuperAdminQuestions()
      ]);
      setMentorQuestions(mentorQs);
      setSuperAdminQuestions(superAdminQs);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar questões da banca",
        variant: "destructive"
      });
    } finally {
      setLoadingQuestions(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const courses = await CourseMentorAPI.getAllCoursesByMentor();
      setCourses(courses);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar cursos",
        variant: "destructive"
      });
    }
  };

  const filterQuestions = (questions: QuestionResponseDTO[]) => {
    let filtered = questions;
    
    if (selectedCourse !== 'all') {
      filtered = filtered.filter(q => q.course?.id === selectedCourse);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(question =>
        question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.content.some(content => 
          content.value.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    return filtered;
  };

  const filteredMentorQuestions = filterQuestions(mentorQuestions);
  const filteredSuperAdminQuestions = filterQuestions(superAdminQuestions);

  const renderQuestionContent = (question: QuestionResponseDTO) => {
    if (!question.content || question.content.length === 0) {
      return (
        <div className="text-sm text-slate-300 mt-2 p-2 bg-slate-900/50 rounded">
          {question.title}
        </div>
      );
    }

    return (
      <div className="space-y-2 mt-2">
        {question.content.map((content, idx) => (
          <div key={`${question.id}-${idx}`} className="border border-slate-800 rounded-lg p-2 bg-slate-900/50">
            {content.type === QuestionContentType.TEXT ? (
              <div 
                className="text-sm text-slate-300"
                dangerouslySetInnerHTML={{ __html: content.value }}
              />
            ) : (
              <img 
                src={content.value} 
                alt="Question content" 
                className="max-h-40 rounded-md border border-slate-800"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const handleRemoveQuestion = async (questionId: string) => {
    if (!simulado || isDeleting) return;

    try {
      setIsDeleting(questionId);
      setLocalQuestions(prev => prev.filter(q => q.id !== questionId));
      
      await PracticeMentorAPI.removeQuestionFromPractice(simulado.id, questionId);
      
      toast({
        title: "Questão removida",
        description: "A questão foi removida do simulado com sucesso.",
        variant: "default"
      });

      const updatedSimulado = await PracticeMentorAPI.getPracticeById(simulado.id);
      onQuestionRemoved(updatedSimulado);
      
    } catch (error) {
      if (simulado?.questions) {
        setLocalQuestions(Array.from(simulado.questions));
      }
      toast({
        title: "Erro",
        description: "Falha ao remover a questão",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleAddFromBank = async (questionId: string) => {
    if (!simulado) return;

    try {
      const updatedSimulado = await PracticeMentorAPI.addQuestionToPractice(simulado.id, questionId);
      
      if (updatedSimulado.questions) {
        setLocalQuestions(Array.from(updatedSimulado.questions));
      }
      
      toast({
        title: "Questão adicionada",
        description: "Questão da banca adicionada com sucesso",
        variant: "default"
      });
      
      setShowAddMenu(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao adicionar questão da banca",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] bg-black/80 border-slate-800 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            {simulado ? `Editar Questões - ${simulado.title}` : 'Editar Questões'}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {simulado ? `Total de questões: ${localQuestions.length}` : 'Nenhum simulado selecionado'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-between items-center mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-white/5 border-slate-800 hover:bg-white/10 hover:border-slate-700 text-white"
                disabled={!simulado}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Questão
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-900 border-slate-800 w-56">
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-slate-800"
                onClick={onAddQuestion}
              >
                Nova questão
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-slate-800"
                onClick={() => setShowAddMenu(!showAddMenu)}
              >
                Questão da banca
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {showAddMenu && (
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-[180px] bg-white/5 border-slate-800 text-white">
                <SelectValue placeholder="Filtrar por curso" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800">
                <SelectItem value="all">Todos os cursos</SelectItem>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {showAddMenu && (
          <div className="mb-6 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar questões..."
                className="pl-10 bg-white/5 border-slate-800 text-white placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Tabs defaultValue="mentor-questions" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 bg-white/5">
                <TabsTrigger value="mentor-questions">Minhas Questões</TabsTrigger>
                <TabsTrigger value="superadmin-questions">Questões Prontas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="mentor-questions">
                {loadingQuestions ? (
                  <p className="text-slate-400">Carregando questões...</p>
                ) : filteredMentorQuestions.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto space-y-3">
                    {filteredMentorQuestions.map(question => (
                      <div 
                        key={question.id} 
                        className="p-3 bg-slate-800/50 rounded-md hover:bg-slate-700/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-white">{question.title}</h4>
                            {question.course && (
                              <Badge variant="outline" className="mt-1 bg-slate-900 text-slate-300">
                                {question.course.name}
                              </Badge>
                            )}
                            {renderQuestionContent(question)}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAddFromBank(question.id)}
                            className="text-green-400 hover:text-green-300"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">
                    {searchTerm ? 'Nenhuma questão encontrada' : 'Nenhuma questão disponível'}
                  </p>
                )}
              </TabsContent>
              
              <TabsContent value="superadmin-questions">
                {loadingQuestions ? (
                  <p className="text-slate-400">Carregando questões...</p>
                ) : filteredSuperAdminQuestions.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto space-y-3">
                    {filteredSuperAdminQuestions.map(question => (
                      <div 
                        key={question.id} 
                        className="p-3 bg-slate-800/50 rounded-md hover:bg-slate-700/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-white">{question.title}</h4>
                            {question.course && (
                              <Badge variant="outline" className="mt-1 bg-slate-900 text-slate-300">
                                {question.course.name}
                              </Badge>
                            )}
                            {renderQuestionContent(question)}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAddFromBank(question.id)}
                            className="text-green-400 hover:text-green-300"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">
                    {searchTerm ? 'Nenhuma questão encontrada' : 'Nenhuma questão disponível'}
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        <div className="space-y-4">
          {localQuestions.length > 0 ? (
            localQuestions.map((question) => (
              <div key={question.id} className="p-4 bg-white/5 rounded-md border border-slate-800">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{question.title}</h3>
                    {question.course && (
                      <Badge variant="outline" className="mt-1 bg-slate-900 text-slate-300">
                        {question.course.name}
                      </Badge>
                    )}
                    {renderQuestionContent(question)}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveQuestion(question.id)}
                    className="text-red-400 hover:text-red-300"
                    disabled={isDeleting === question.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-6 border-2 border-dashed border-slate-700 rounded-lg">
              <p className="text-slate-400 mb-4">
                {simulado 
                  ? "Nenhuma questão encontrada neste simulado." 
                  : "Nenhum simulado selecionado."}
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-white/5 border-slate-800 hover:bg-white/10 hover:border-slate-700 text-white"
                    disabled={!simulado}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar primeira questão
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-900 border-slate-800 w-56">
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-slate-800"
                    onClick={onAddQuestion}
                  >
                    Nova questão
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-slate-800"
                    onClick={() => setShowAddMenu(!showAddMenu)}
                  >
                    Questão da banca
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}