import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MessageSquare, Star, Users } from "lucide-react"
import { availableMentors } from "@/data/mock"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const Mentoring = () => {
  const navigate = useNavigate()

  const handleScheduleMentoring = (mentorId: string) => {
    navigate(`/mentoria/agendar/${mentorId}`)
    toast.success("Redirecionando para agendamento...")
  }

  return (
    <div className="container py-8 space-y-8 animate-fadeIn">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Mentoria</h1>
        <p className="text-muted-foreground">
          Conecte-se com mentores experientes para acelerar seu aprendizado
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {availableMentors.map((mentor) => (
          <Card key={mentor.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <CardTitle className="text-xl">{mentor.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {mentor.specialty}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{mentor.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>50+ alunos</span>
                </div>
              </div>

              <div className="space-y-2 flex-grow">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Próxima disponibilidade: Hoje, 15:00</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="w-4 h-4" />
                  <span>Responde em até 2 horas</span>
                </div>
              </div>

              <Button 
                className="w-full mt-auto" 
                onClick={() => handleScheduleMentoring(mentor.id)}
              >
                Agendar Mentoria
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Mentoring