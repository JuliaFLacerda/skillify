
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const tiers = [
  {
    id: "basic",
    name: "Básico",
    price: "Grátis",
    description: "Perfeito para começar sua jornada de aprendizado",
    features: [
      "Acesso a cursos básicos",
      "Trilhas de aprendizado",
      "Comunidade de alunos",
      "Certificados básicos",
    ],
  },
  {
    id: "pro",
    name: "Profissional",
    price: "R$ 49,90/mês",
    description: "Ideal para profissionais em busca de crescimento",
    features: [
      "Todos os recursos do plano Básico",
      "Mentoria em grupo",
      "Cursos avançados",
      "Certificados profissionais",
    ],
  },
  {
    id: "enterprise",
    name: "Corporativo",
    price: "Sob consulta",
    description: "Para empresas que desejam desenvolver suas equipes",
    features: [
      "Todos os recursos do plano Profissional",
      "Mentoria individual",
      "Dashboard corporativo",
      "Conteúdo personalizado",
    ],
  },
];

const PricingSection = () => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Planos para todos os objetivos
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Escolha o plano ideal para sua jornada de aprendizado
          </p>
        </div>

        <div className="mt-10 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">{tier.name}</h3>
                <p className="mt-4 text-sm text-gray-500">{tier.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {tier.price}
                  </span>
                </p>
                <Link to={`/planos/${tier.id}`}>
                  <Button className="mt-8 w-full bg-primary-600 hover:bg-primary-700">
                    Começar agora
                  </Button>
                </Link>
              </div>
              <div className="px-6 pt-6 pb-8">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide">
                  O que está incluído
                </h4>
                <ul className="mt-6 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex space-x-3">
                      <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
