import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { Plan } from "@/types"

const plans: Plan[] = [
  {
    id: "1",
    name: "Free",
    price: 0,
    interval: "monthly",
    features: [
      "Acesso a cursos básicos",
      "Comunidade de estudantes",
      "Exercícios práticos",
      "Certificados básicos",
    ],
    description: "Perfeito para começar sua jornada de aprendizado",
  },
  {
    id: "2",
    name: "Pro",
    price: 49.90,
    interval: "monthly",
    features: [
      "Todos os cursos",
      "Projetos práticos",
      "Mentoria em grupo",
      "Certificados avançados",
      "Suporte prioritário",
    ],
    recommended: true,
    description: "Ideal para desenvolvedores comprometidos",
  },
  {
    id: "3",
    name: "Enterprise",
    price: 99.90,
    interval: "monthly",
    features: [
      "Tudo do plano Pro",
      "Mentoria individual",
      "Projetos personalizados",
      "Acesso antecipado",
      "Suporte 24/7",
    ],
    description: "Para profissionais que buscam excelência",
  },
]

const Plans = () => {
  return (
    <div className="container py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Escolha seu Plano</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Invista em sua carreira com nossos planos flexíveis. Escolha a opção que
          melhor se adapta às suas necessidades e objetivos.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${
              plan.recommended
                ? "border-primary shadow-lg scale-105"
                : "border-border"
            }`}
          >
            {plan.recommended && (
              <Badge
                className="absolute -top-3 left-1/2 -translate-x-1/2"
                variant="secondary"
              >
                Recomendado
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  R$ {plan.price.toFixed(2)}
                </span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {plan.description}
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.recommended ? "default" : "outline"}
              >
                Começar Agora
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Plans