import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const NewEssay = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [theme, setTheme] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !theme) {
      toast.error("Preencha todos os campos")
      return
    }
    navigate("/redacoes/editor")
    toast.success("Redação criada com sucesso!")
  }

  return (
    <div className="container py-8 space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold">Nova Redação</h1>
        <p className="text-muted-foreground">
          Crie uma nova redação para praticar
        </p>
      </div>

      <Card className="max-w-2xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título da Redação</Label>
            <Input
              id="title"
              placeholder="Ex: Os desafios da educação no século XXI"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">Tema</Label>
            <Textarea
              id="theme"
              placeholder="Descreva o tema da sua redação..."
              className="min-h-[100px]"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/redacoes")}
              className="w-full"
            >
              Cancelar
            </Button>
            <Button type="submit" className="w-full">
              Criar Redação
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default NewEssay