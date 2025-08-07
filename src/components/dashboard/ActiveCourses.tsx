import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play } from "lucide-react"

export function ActiveCourses() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="p-6">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Aula ao Vivo</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Resolução de exercícios de Matemática
            </p>
            <p className="text-sm font-medium">Hoje às 19h</p>
          </div>
          <div className="mt-4 flex justify-center">
            <Button className="w-full">
              <Play className="w-4 h-4 mr-2" />
              Entrar na Aula
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Aula ao Vivo</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Resolução de exercícios de Português
            </p>
            <p className="text-sm font-medium">Hoje às 20h</p>
          </div>
          <div className="mt-4 flex justify-center">
            <Button className="w-full">
              <Play className="w-4 h-4 mr-2" />
              Entrar na Aula
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Aula ao Vivo</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Resolução de exercícios de Ciências
            </p>
            <p className="text-sm font-medium">Hoje às 21h</p>
          </div>
          <div className="mt-4 flex justify-center">
            <Button className="w-full">
              <Play className="w-4 h-4 mr-2" />
              Entrar na Aula
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
