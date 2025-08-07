import { Lightbulb, Users, TrendingUp, Brain } from "lucide-react";

const features = [
  {
    name: "Trilhas Personalizadas",
    description: "Aprenda no seu ritmo com conteúdo adaptado ao seu perfil e objetivos.",
    icon: Brain,
  },
  {
    name: "Mentoria em Tempo Real",
    description: "Conecte-se com especialistas para tirar dúvidas e receber orientação.",
    icon: Users,
  },
  {
    name: "Análise de Progresso",
    description: "Acompanhe sua evolução com métricas detalhadas e insights.",
    icon: TrendingUp,
  },
  {
    name: "IA para Aprendizado",
    description: "Recomendações inteligentes baseadas no seu perfil e objetivos.",
    icon: Lightbulb,
  },
];

const FeaturesSection = () => {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Por que escolher o Skillify?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Desenvolvemos a melhor plataforma para impulsionar seu crescimento profissional
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      {feature.name}
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;