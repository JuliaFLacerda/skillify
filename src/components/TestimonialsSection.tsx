import { Avatar } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Ana Silva",
    role: "Desenvolvedora Frontend",
    image: "/placeholder.svg",
    testimonial: "A plataforma revolucionou minha forma de aprender. As trilhas personalizadas e mentoria em tempo real fizeram toda diferença no meu desenvolvimento profissional.",
  },
  {
    name: "Carlos Santos",
    role: "Tech Lead",
    image: "/placeholder.svg",
    testimonial: "Como líder técnico, recomendo o Skillify para toda minha equipe. A qualidade do conteúdo e o suporte dos mentores são excepcionais.",
  },
  {
    name: "Mariana Costa",
    role: "UX Designer",
    image: "/placeholder.svg",
    testimonial: "Os desafios práticos e o feedback instantâneo dos mentores me ajudaram a evoluir rapidamente na minha carreira de UX.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            O que dizem nossos alunos
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Histórias reais de profissionais que transformaram suas carreiras
          </p>
        </div>
        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="flex flex-col items-center space-y-4 text-center bg-white p-6 rounded-lg shadow-md"
            >
              <Avatar className="w-20 h-20">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="rounded-full"
                />
              </Avatar>
              <p className="text-gray-600 italic">"{testimonial.testimonial}"</p>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {testimonial.name}
                </h3>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;