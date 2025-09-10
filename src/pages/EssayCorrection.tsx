import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useParams } from "react-router-dom"
import { Check, MessageSquare, Award } from "lucide-react"

const EssayCorrection = () => {
  const { id } = useParams()

  return (
    <div className="container py-8 space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Correção da Redação</h1>
          <p className="text-muted-foreground">
            Feedback detalhado do seu texto
          </p>
        </div>
        <Badge variant="secondary" className="text-lg py-2">
          Nota Final: 950/1000
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Texto Original</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comentários do Corretor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Estrutura e Coesão</p>
                  <p className="text-muted-foreground">
                    Excelente organização textual. Os parágrafos estão bem conectados e as ideias fluem naturalmente.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Argumentação</p>
                  <p className="text-muted-foreground">
                    Argumentos bem desenvolvidos e fundamentados em exemplos pertinentes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Critérios de Avaliação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Competência 1</span>
                  <Badge variant="outline" className="flex gap-1">
                    <Check className="w-4 h-4" /> 200/200
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Competência 2</span>
                  <Badge variant="outline" className="flex gap-1">
                    <Check className="w-4 h-4" /> 180/200
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Competência 3</span>
                  <Badge variant="outline" className="flex gap-1">
                    <Check className="w-4 h-4" /> 200/200
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Competência 4</span>
                  <Badge variant="outline" className="flex gap-1">
                    <Check className="w-4 h-4" /> 190/200
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Competência 5</span>
                  <Badge variant="outline" className="flex gap-1">
                    <Check className="w-4 h-4" /> 180/200
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Conquistas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge className="w-full justify-center py-2">Argumentação Sólida</Badge>
                <Badge className="w-full justify-center py-2">Coesão Perfeita</Badge>
                <Badge className="w-full justify-center py-2">Vocabulário Rico</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default EssayCorrection