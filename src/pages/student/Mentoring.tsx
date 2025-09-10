import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { UserResponseDTO } from '@/api/dtos/userDtos'
import { UserStudentAPI } from "@/api/student/controllers/UserStudentAPI"
import { TutorSessionStudentAPI } from "@/api/student/controllers/TutorSessionStudentAPI"
import { TutorSessionResponseDTO } from "@/api/dtos/tutorSessionDtos"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const Mentoring = () => {
  const navigate = useNavigate()
  const [mentors, setMentors] = useState<UserResponseDTO[]>([])
  const [scheduledSessions, setScheduledSessions] = useState<TutorSessionResponseDTO[]>([])
  const [loadingMentors, setLoadingMentors] = useState(true)
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchScheduledSessions = async () => {
    try {
      setLoadingSessions(true)
      const sessions = await TutorSessionStudentAPI.getMyTutorSessions()
      // Filter future sessions
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const futureSessions = sessions.filter(session => {
        const sessionDate = new Date(session.date)
        return sessionDate >= today
      })
      setScheduledSessions(futureSessions)
    } catch (error) {
      toast.error("Erro ao carregar mentorias agendadas")
    } finally {
      setLoadingSessions(false)
    }
  }

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const availableMentors = await UserStudentAPI.findAvailableMentors()
        setMentors(availableMentors)
      } catch (error) {
        toast.error("Erro ao carregar mentores disponíveis")
      } finally {
        setLoadingMentors(false)
      }
    }

    fetchMentors()
    fetchScheduledSessions()
  }, [])

  const handleScheduleMentoring = (mentorId: string) => {
    navigate(`/dashboard/mentoria/agendar/${mentorId}`)
    toast.success("Redirecionando para agendamento...")
  }

  const handleCancelSession = (sessionId: string) => {
    setSessionToDelete(sessionId)
    setShowConfirmDialog(true)
  }

  const handleConfirmCancel = async () => {
    if (!sessionToDelete) return

    setIsDeleting(true)
    try {
      await TutorSessionStudentAPI.deleteTutorSession(sessionToDelete)
      toast.success("Mentoria cancelada com sucesso")
      await fetchScheduledSessions() // Refresh the session list
    } catch (error) {
      toast.error("Erro ao cancelar mentoria")
      console.error('Error canceling session:', error)
    } finally {
      setIsDeleting(false)
      setShowConfirmDialog(false)
      setSessionToDelete(null)
    }
  }

  if (loadingMentors || loadingSessions) {
    return (
      <div className="container py-8">
        <p>Carregando informações...</p>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-8 animate-fadeIn">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Mentoria</h1>
        <p className="text-muted-foreground">
          Conecte-se com mentores experientes para acelerar seu aprendizado
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Mentores Disponíveis</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mentors.map((mentor) => (
            <Card key={mentor.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <img
                    src={mentor.avatar || "https://via.placeholder.com/64"}
                    alt={mentor.name.substring(0,1)}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle className="text-xl">{mentor.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {mentor.biography.substring(0, 50) + "..."}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow space-y-4">
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

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Mentorias Agendadas</h2>
        {scheduledSessions.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma mentoria agendada no momento.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {scheduledSessions.map((session) => (
              <Card key={session.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">{session.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Mentor: {session.mentor.name}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2 flex flex-col flex-grow">
                  <p className="text-sm">
                    Data: {format(new Date(session.date), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                  <p className="text-sm">
                    Horário: {session.dateHour}
                  </p>
                  <Button
                    variant="destructive"
                    className="w-full mt-auto"
                    onClick={() => handleCancelSession(session.id)}
                    disabled={isDeleting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full mt-auto"
                    onClick={() => window.open(session.link, '_blank', 'noopener,noreferrer')}
                  >
                    {session.link.length !== 0 && session.link !== null ? "Acessar chamada" : "Link não disponível"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Cancelamento</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Deseja realmente cancelar esta mentoria?</p>
            {sessionToDelete && scheduledSessions.find(s => s.id === sessionToDelete) && (
              <>
                <p className="text-muted-foreground mt-2">
                  Mentor: {scheduledSessions.find(s => s.id === sessionToDelete)!.mentor.name}
                </p>
                <p className="text-muted-foreground">
                  Data: {format(new Date(scheduledSessions.find(s => s.id === sessionToDelete)!.date), "dd/MM/yyyy", { locale: ptBR })}
                </p>
                <p className="text-muted-foreground">
                  Horário: {scheduledSessions.find(s => s.id === sessionToDelete)!.dateHour}
                </p>
              </>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowConfirmDialog(false)
                setSessionToDelete(null)
              }}
              disabled={isDeleting}
            >
              Voltar
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={isDeleting}
            >
              {isDeleting ? "Cancelando..." : "Confirmar Cancelamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Mentoring