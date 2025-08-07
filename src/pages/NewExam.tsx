import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, BookOpen, Target } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const NewExam = () => {
  const navigate = useNavigate()
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])

  const handleCreateExam = () => {
    if (selectedSubjects.length === 0) {
      toast.error("Selecione pelo menos uma disciplina")
      return
    }
    
    toast.success("Simulado criado com sucesso!")
    navigate("/simulados")
  }

  return (
    <div className="container py-8 space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Criar Simulado Personalizado</h1>
          <p className="text-muted-foreground">
            Configure seu simulado de acordo com suas necessidades
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Disciplinas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {[
                "Matemática",
                "Português",
                "História",
                "Geografia",
                "Física",
                "Química",
                "Biologia",
                "Literatura",
              ].map((subject) => (
                <div key={subject} className="flex items-center space-x-2">
                  <Checkbox
                    id={subject}
                    checked={selectedSubjects.includes(subject)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSubjects([...selectedSubjects, subject])
                      } else {
                        setSelectedSubjects(selectedSubjects.filter((s) => s !== subject))
                      }
                    }}
                  />
                  <Label htmlFor={subject}>{subject}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tempo de Prova (minutos)</Label>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <Input type="number" defaultValue={180} min={30} max={300} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Número de Questões</Label>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <Input type="number" defaultValue={90} min={10} max={180} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Nível de Dificuldade</Label>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="easy">Fácil</option>
                    <option value="medium">Médio</option>
                    <option value="hard">Difícil</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            className="w-full" 
            size="lg"
            onClick={handleCreateExam}
          >
            Criar Simulado
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NewExam