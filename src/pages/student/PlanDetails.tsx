
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowLeft, ChevronRight } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock plans data
const plans = [
  {
    id: "basic",
    name: "Básico",
    price: 0,
    isPopular: false,
    description: "Perfeito para começar sua jornada de aprendizado",
    features: [
      "Acesso a cursos básicos",
      "Comunidade de estudantes",
      "Exercícios práticos",
      "Certificados básicos",
    ],
    limitations: [
      "Sem mentoria individual",
      "Acesso limitado a conteúdos premium",
      "Sem projetos avançados"
    ]
  },
  {
    id: "pro",
    name: "Profissional",
    price: 49.90,
    isPopular: true,
    description: "Ideal para desenvolvedores comprometidos",
    features: [
      "Acesso a todos os cursos",
      "Mentoria em grupo semanal",
      "Projetos práticos guiados",
      "Certificados avançados",
      "Acesso à comunidade exclusiva",
      "Suporte prioritário",
    ],
    limitations: [
      "Mentoria individual limitada",
    ]
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99.90,
    isPopular: false,
    description: "Para profissionais que buscam excelência",
    features: [
      "Tudo do plano Profissional",
      "Mentoria individual (2h/mês)",
      "Projetos personalizados com feedback",
      "Acesso a eventos exclusivos",
      "Acesso antecipado a novos cursos",
      "Suporte 24/7",
    ],
    limitations: []
  },
];

export default function PlanDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const plan = plans.find(p => p.id === id) || plans[0];
  
  const handleSubscribe = () => {
    toast({
      title: "Assinatura iniciada",
      description: `Você selecionou o plano ${plan.name}. Redirecionando para pagamento...`,
    });
    // In a real app, redirect to checkout page
  };
  
  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para a página inicial
      </Link>
      
      <h1 className="text-4xl font-bold mb-2">{plan.name}</h1>
      <p className="text-xl text-muted-foreground mb-10">{plan.description}</p>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="text-2xl">Detalhes do Plano</CardTitle>
            <CardDescription>
              Plano {plan.name} - <span className="font-bold text-primary">
                {plan.price === 0 ? "Grátis" : `R$ ${plan.price.toFixed(2)}/mês`}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-3">O que está incluído:</h3>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {plan.limitations.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mt-6 mb-3">Limitações:</h3>
                <ul className="space-y-2">
                  {plan.limitations.map((limitation, i) => (
                    <li key={i} className="flex items-start text-muted-foreground">
                      <ChevronRight className="h-5 w-5 shrink-0 mr-2" />
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSubscribe}
              className="w-full"
              size="lg"
            >
              {plan.price === 0 ? "Começar Agora (Grátis)" : "Assinar Plano"}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Benefícios exclusivos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                  <span>Cancele quando quiser - sem multa</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                  <span>Acesso imediato após confirmação</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                  <span>Atualizações de conteúdo incluídas</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                  <span>Certificados de conclusão</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Perguntas Frequentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">Como funciona a cobrança?</h4>
                <p className="text-muted-foreground">A cobrança é mensal e automática. Você pode cancelar a qualquer momento.</p>
              </div>
              <div>
                <h4 className="font-medium">Posso mudar de plano?</h4>
                <p className="text-muted-foreground">Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento.</p>
              </div>
              <div>
                <h4 className="font-medium">Como funciona o reembolso?</h4>
                <p className="text-muted-foreground">Garantia de 7 dias. Se não estiver satisfeito, devolvemos seu dinheiro.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
