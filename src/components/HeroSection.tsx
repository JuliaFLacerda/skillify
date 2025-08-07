
import { Button } from "@/components/ui/button"
import { GraduationCap, LogIn, UserPlus, Rocket, Target, Award } from "lucide-react"

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-purple-900 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 -top-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -right-4 -bottom-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <GraduationCap className="w-8 h-8 text-purple-400" />
            <span className="text-lg font-medium text-purple-400">EduPlatform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-400 leading-tight mb-6">
            Transforme seu<br />
            <span className="text-white">Aprendizado Profissional</span>
          </h1>

          <p className="mt-3 max-w-md mx-auto text-lg text-slate-300 sm:text-xl md:mt-5 md:max-w-3xl">
            Plataforma inteligente de aprendizado com trilhas personalizadas, mentoria em tempo real e análise de progresso detalhada.
          </p>

          <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-8 gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white mb-4 sm:mb-0 group"
              onClick={() => window.location.href = '/login'}
            >
              <LogIn className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Fazer Login
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-purple-400 text-purple-400 hover:bg-purple-400/10 group"
              onClick={() => window.location.href = '/registro'}
            >
              <UserPlus className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Criar Conta
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 hover:border-purple-500/30 transition-all group">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
              <Rocket className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Aprendizado Acelerado</h3>
            <p className="text-slate-300">Metodologia otimizada para maximizar sua absorção de conhecimento.</p>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 hover:border-purple-500/30 transition-all group">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Mentoria Personalizada</h3>
            <p className="text-slate-300">Acompanhamento individual com profissionais experientes.</p>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 hover:border-purple-500/30 transition-all group">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
              <Award className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Certificação Reconhecida</h3>
            <p className="text-slate-300">Certificados válidos e reconhecidos pelo mercado.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
