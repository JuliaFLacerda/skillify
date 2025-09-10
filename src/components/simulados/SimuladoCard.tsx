import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Target, BarChart, Eye, Edit2, Trash2 } from "lucide-react";
import { PracticeResponseDTO } from "@/api/dtos/practiceDtos";

interface SimuladoCardProps {
  simulado?: PracticeResponseDTO;
  onViewResults: () => void;
  onAddQuestion: () => void;
  onViewSimulado: () => void;
  onEditQuestions: () => void;
  onEditSimulado: () => void; // New prop for editing
  onDeleteSimulado: () => void; // New prop for deleting
}

export function SimuladoCard({
  simulado,
  onViewResults,
  onViewSimulado,
  onEditQuestions,
  onEditSimulado,
  onDeleteSimulado,
}: SimuladoCardProps) {
  const title = simulado?.title || "Simulado ENEM 2024";
  const questions = simulado?.numberOfQuestions || 90;
  const maxDate = simulado?.maximumDate || new Date().toISOString();

  const hasQuestions = simulado?.questions
    ? simulado.questions.size > 0 || simulado.numberOfQuestions > 0
    : false;

  return (
    <Card className="group overflow-hidden bg-gradient-to-br from-black/40 to-black/20 border-slate-800 hover:border-slate-700 transition-all duration-300">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-lg text-white">{title}</CardTitle>
          <Badge className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30">
            Em Andamento
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-400">
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Clock className="w-4 h-4" />
              <span>
                Termina em{" "}
                {Math.ceil(
                  (new Date(maxDate).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                dias
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Target className="w-4 h-4" />
              <span>{questions} questões</span>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <Button
              variant="outline"
              onClick={onViewResults}
              className="w-full bg-white/5 border-slate-800 hover:bg-white/10 hover:border-slate-700 text-white"
            >
              <BarChart className="w-4 h-4 mr-2" />
              Ver Resultados Parciais
            </Button>
            <Button
              variant="outline"
              onClick={onEditQuestions}
              className="w-full bg-white/5 border-slate-800 hover:bg-white/10 hover:border-slate-700 text-white"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Editar Questões
            </Button>
            <Button
              variant="outline"
              onClick={onEditSimulado}
              className="w-full bg-white/5 border-slate-800 hover:bg-white/10 hover:border-slate-700 text-white"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Editar Simulado
            </Button>
            <Button
              variant="outline"
              onClick={onDeleteSimulado}
              className="w-full bg-red-500/20 border-red-800 hover:bg-red-500/30 hover:border-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir Simulado
            </Button>
            <Button
              variant="outline"
              onClick={hasQuestions ? onViewSimulado : undefined}
              className={`w-full bg-white/5 border-slate-800 text-white ${
                hasQuestions
                  ? "hover:bg-white/10 hover:border-slate-700"
                  : "opacity-50 cursor-not-allowed"
              }`}
              disabled={!hasQuestions}
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver Simulado
              {!hasQuestions && (
                <span className="sr-only">(Adicione questões primeiro)</span>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}