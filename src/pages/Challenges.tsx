import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Clock, Target } from "lucide-react"

export default function Challenges() {
  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Desafios</h1>
        <p className="text-muted-foreground">
          Complete desafios para ganhar pontos e subir no ranking
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>Desafio Semanal</CardTitle>
              <Badge className="bg-primary">Em Andamento</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Resolva 50 exercícios de matemática em uma semana
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span>500 XP</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>5 dias restantes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="w-4 h-4" />
                <span>30/50 exercícios</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Continuar Desafio</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>Desafio Mensal</CardTitle>
              <Badge className="bg-primary">Em Andamento</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Resolva 200 exercícios de matemática em um mês
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span>1500 XP</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>20 dias restantes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="w-4 h-4" />
                <span>50/200 exercícios</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Continuar Desafio</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>Desafio Anual</CardTitle>
              <Badge className="bg-primary">Em Andamento</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Resolva 1000 exercícios de matemática em um ano
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span>5000 XP</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>365 dias restantes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="w-4 h-4" />
                <span>0/1000 exercícios</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Continuar Desafio</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
