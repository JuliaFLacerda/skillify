import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { toast } from "sonner"

const EssayEditor = () => {
  const [content, setContent] = useState("")

  const handleSave = () => {
    toast.success("Rascunho salvo com sucesso!")
  }

  const handleSubmit = () => {
    toast.success("Redação enviada para correção!")
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Editor de Redação</h1>
          <p className="text-muted-foreground">
            Tecnologia e Sociedade: Os impactos da IA no mercado de trabalho
          </p>
        </div>
        <div className="space-x-4">
          <Button variant="outline" onClick={handleSave}>
            Salvar Rascunho
          </Button>
          <Button onClick={handleSubmit}>Enviar para Correção</Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="p-6 space-y-4">
          <div className="prose dark:prose-invert max-w-none">
            <h2>Texto de Apoio</h2>
            <p>
              A inteligência artificial tem revolucionado diversos setores da economia,
              trazendo benefícios significativos para a produtividade e eficiência.
              No entanto, sua implementação também levanta questões importantes sobre
              o futuro do trabalho e o papel do ser humano em um mundo cada vez mais
              automatizado.
            </p>
            <h3>Proposta de Redação</h3>
            <p>
              Com base nos textos motivadores e em seus conhecimentos, redija um texto
              dissertativo-argumentativo sobre o tema "Os impactos da inteligência
              artificial no mercado de trabalho". Apresente proposta de intervenção
              que respeite os direitos humanos.
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <Textarea
            className="min-h-[500px] resize-none"
            placeholder="Digite sua redação aqui..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="mt-4 text-sm text-muted-foreground text-right">
            {content.length} caracteres
          </div>
        </Card>
      </div>
    </div>
  )
}

export default EssayEditor