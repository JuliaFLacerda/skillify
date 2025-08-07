import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Search, ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { QuestionMentorAPI } from '@/api/mentor/controllers/QuestionMentorAPI';
import { OptionMentorAPI } from '@/api/mentor/controllers/OptionMentorAPI';
import { QuestionResponseDTO, QuestionContentType, QuestionContentCreateDTO } from '@/api/dtos/questionDtos';
import { OptionCreateDTO } from '@/api/dtos/optionDtos'; // Ensure OptionCreateDTO is imported
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DeleteQuestionDialog } from '@/components/mentor/question/DeleteQuestionDialog';
import { CreateQuestionDialog } from '@/components/mentor/question/CreateQuestionDialog';
import { EditQuestionDialog } from '@/components/mentor/question/EditQuestionDialog';

export default function MentorQuestionBank() {
  const { toast } = useToast();
  const [mentorQuestions, setMentorQuestions] = useState<QuestionResponseDTO[]>([]);
  const [superAdminQuestions, setSuperAdminQuestions] = useState<QuestionResponseDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState<QuestionResponseDTO | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const mentorId = localStorage.getItem('userId') || '';

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const [mentorQs, superAdminQs] = await Promise.all([
          QuestionMentorAPI.getAllQuestions(),
          QuestionMentorAPI.getSuperAdminQuestions(),
        ]);
        setMentorQuestions(mentorQs);
        setSuperAdminQuestions(superAdminQs);
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Falha ao carregar as questões',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [toast]);

  const filterQuestions = (questions: QuestionResponseDTO[]) =>
    questions.filter(question =>
      question.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const filteredMentorQuestions = filterQuestions(mentorQuestions);
  const filteredSuperAdminQuestions = filterQuestions(superAdminQuestions);

  const toggleQuestionExpansion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const handleDeleteQuestion = async () => {
    if (!questionToDelete) return;

    try {
      await QuestionMentorAPI.deleteQuestion(questionToDelete);
      setMentorQuestions(mentorQuestions.filter(q => q.id !== questionToDelete));
      toast({
        title: 'Sucesso',
        description: 'Questão removida com sucesso',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao remover a questão',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setQuestionToDelete(null);
    }
  };

  const handleCreateQuestion = async (
    question: { 
      title: string; 
      options: { title: string; correct: boolean }[]; 
      courseId?: string 
    }, 
    contentItems: { type: QuestionContentType; value: string }[]
  ) => {
    try {
      const createdQuestion = await QuestionMentorAPI.createQuestion({
        title: question.title,
        mentorId,
        courseId: question.courseId
      });
  
      const optionPromises = question.options
        .filter(option => option.title.trim())
        .map(option => 
          OptionMentorAPI.createOption({
            questionId: createdQuestion.id,
            title: option.title,
            correct: option.correct,
          })
        );
      await Promise.all(optionPromises);
  
      const validContentItems = contentItems
        .filter(item => item.type && item.value.trim())
        .map((item, index) => ({
          questionId: createdQuestion.id,
          position: index,
          type: item.type,
          value: item.value
        }));
  
      if (validContentItems.length > 0) {
        await QuestionMentorAPI.updateQuestionContent(
          createdQuestion.id,
          validContentItems
        );
      }
  
      const updatedQuestions = await QuestionMentorAPI.getAllQuestions();
      setMentorQuestions(updatedQuestions);
  
      toast({
        title: 'Sucesso',
        description: 'Questão criada com sucesso',
        variant: 'default',
      });
  
      return true;
    } catch (error) {
      console.error('Error creating question:', error);
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Falha ao criar a questão',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleEditQuestion = async (
    question: { 
      title: string; 
      options: { id?: string; title: string; correct: boolean }[]; 
      courseId?: string 
    }, 
    contentItems: { id: string; type: QuestionContentType; value: string }[]
  ) => {
    if (!questionToEdit) return false;

    try {
      // Update the question
      await QuestionMentorAPI.updateQuestion(questionToEdit.id, {
        title: question.title,
        mentorId,
        courseId: question.courseId,
      });

      // Handle options: update existing, create new, delete removed
      const existingOptionIds = questionToEdit.options.map(opt => opt.id);
      const submittedOptionIds = question.options.filter(opt => opt.id).map(opt => opt.id);
      
      // Delete options that were removed
      const optionsToDelete = existingOptionIds.filter(id => !submittedOptionIds.includes(id));
      await Promise.all(
        optionsToDelete.map(optionId =>
          OptionMentorAPI.deleteOption(optionId) // Use OptionMentorAPI.deleteOption
        )
      );

      // Update or create options
      const optionPromises = question.options
        .filter(option => option.title.trim())
        .map(option => {
          if (option.id) {
            // Update existing option using OptionMentorAPI.updateOption
            return OptionMentorAPI.updateOption(option.id, {
              questionId: questionToEdit.id,
              title: option.title,
              correct: option.correct,
            });
          } else {
            // Create new option
            return OptionMentorAPI.createOption({
              questionId: questionToEdit.id,
              title: option.title,
              correct: option.correct,
            });
          }
        });
      await Promise.all(optionPromises);

      // Update content items
      const validContentItems = contentItems
        .filter(item => item.type && item.value.trim())
        .map((item, index) => ({
          id: item.id,
          questionId: questionToEdit.id,
          position: index,
          type: item.type,
          value: item.value
        }));
      
      if (validContentItems.length > 0) {
        await QuestionMentorAPI.updateQuestionContent(
          questionToEdit.id,
          validContentItems
        );
      }

      // Refresh questions list
      const updatedQuestions = await QuestionMentorAPI.getAllQuestions();
      setMentorQuestions(updatedQuestions);

      toast({
        title: 'Sucesso',
        description: 'Questão atualizada com sucesso',
        variant: 'default',
      });

      return true;
    } catch (error) {
      console.error('Error updating question:', error);
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Falha ao atualizar a questão',
        variant: 'destructive',
      });
      return false;
    }
  };

  const renderQuestionList = (questions: QuestionResponseDTO[], editable: boolean) => (
    isLoading ? (
      <div className="flex justify-center items-center h-64">
        <p className="text-slate-400">Carregando questões...</p>
      </div>
    ) : questions.length === 0 ? (
      <div className="flex justify-center items-center h-64">
        <p className="text-slate-400">
          {searchTerm ? 'Nenhuma questão encontrada' : 'Nenhuma questão disponível'}
        </p>
      </div>
    ) : (
      <div className="space-y-4">
        {questions.map((question) => (
          <div
            key={question.id}
            className="p-4 bg-white/5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <button
                  className="w-full text-left"
                  onClick={() => toggleQuestionExpansion(question.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">{question.title}</h3>
                    {expandedQuestions.has(question.id) ? (
                      <ChevronUp className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    {question.options.length} opções | Criada por: {question.mentor.name}
                  </p>
                </button>
              </div>
              {editable && (
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-blue-400 hover:text-blue-300"
                    onClick={() => {
                      setQuestionToEdit(question);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-300"
                    onClick={() => {
                      setQuestionToDelete(question.id);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {expandedQuestions.has(question.id) && (
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                {question.content.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-slate-300">Conteúdo:</h4>
                    {question.content.sort((a, b) => a.position - b.position).map((content) => (
                      <div key={content.id} className="p-3 rounded-md bg-white/5">
                        {content.type === QuestionContentType.TEXT ? (
                          <p className="text-white">{content.value}</p>
                        ) : (
                          <img 
                            src={content.value} 
                            alt="Question content" 
                            className="max-h-40 rounded-md"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <h4 className="text-sm font-medium text-slate-300">Opções:</h4>
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <div
                      key={option.id}
                      className={`p-3 rounded,as-- rounded-md ${option.correct ? 'bg-green-900/30 border border-green-800' : 'bg-white/5'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={option.correct ? 'text-green-400' : 'text-white'}>
                          {option.title}
                        </span>
                        {option.correct && (
                          <Badge variant="secondary" className="bg-green-900/50 text-green-400">
                            Correta
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Banco de Questões</h1>
          <p className="text-slate-400">
            Gerencie suas questões disponíveis para uso em simulados
          </p>
        </div>
        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Questão
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Buscar questões..."
          className="pl-10 bg-white/5 border-slate-800 text-white placeholder:text-slate-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="my-questions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-white/5">
          <TabsTrigger value="my-questions">Minhas Questões</TabsTrigger>
          <TabsTrigger value="ready-questions">Questões Prontas</TabsTrigger>
        </TabsList>
        <TabsContent value="my-questions">
          {renderQuestionList(filteredMentorQuestions, true)}
        </TabsContent>
        <TabsContent value="ready-questions">
          {renderQuestionList(filteredSuperAdminQuestions, false)}
        </TabsContent>
      </Tabs>

      <DeleteQuestionDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteQuestion}
      />

      <CreateQuestionDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateQuestion}
      />

      <EditQuestionDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        question={questionToEdit}
        onSubmit={handleEditQuestion}
      />
    </div>
  );
}