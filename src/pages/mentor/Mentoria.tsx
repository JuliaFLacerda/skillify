import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Calendar as CalendarIcon, Clock, MessageSquare, Video } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { useState, useEffect, useCallback, Component } from "react"
import { toast } from "sonner"
import { format, isValid, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { TutorSessionMentorAPI } from "@/api/mentor/controllers/TutorSessionMentorAPI"
import { UserMentorAPI } from "@/api/mentor/controllers/UserMentorAPI"
import { TutorSessionResponseDTO, TutorSessionCreateDTO, SessionType } from "@/api/dtos/tutorSessionDtos"

interface CalendarEvent {
  date: Date;
  sessions: number;
}

// Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-8 text-red-400">
          <p>Erro ao carregar as sessões. Por favor, tente novamente.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const MentorMentoria = () => {
  const [date, setDate] = useState<Date>(new Date())
  const [mentoringSessions, setMentoringSessions] = useState<TutorSessionResponseDTO[]>([])
  const [activeSession, setActiveSession] = useState<string | null>(null)
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showEditLinkDialog, setShowEditLinkDialog] = useState(false)
  const [sessionToEdit, setSessionToEdit] = useState<TutorSessionResponseDTO | null>(null)
  const [newLink, setNewLink] = useState("")
  const [isUpdatingLink, setIsUpdatingLink] = useState(false)
  const mentorId = localStorage.getItem('userId') // Get mentor's ID from localStorage

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true)
      const sessions = await TutorSessionMentorAPI.getAllSessions()
      const mentorSessions = sessions.filter(session => session?.mentor?.id === mentorId)
      setMentoringSessions(mentorSessions)
      updateCalendarEvents(mentorSessions)
    } catch (error) {
      toast.error("Erro ao carregar sessões de mentoria")
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }, [mentorId])

  const updateCalendarEvents = useCallback((sessions: TutorSessionResponseDTO[]) => {
    const eventMap = new Map<string, number>()
    sessions.forEach(session => {
      if (!session?.date) {
        console.warn(`Missing date in session ${session?.id}`)
        return
      }
      try {
        const sessionDate = parseISO(session.date)
        if (isValid(sessionDate)) {
          const dateStr = sessionDate.toDateString()
          eventMap.set(dateStr, (eventMap.get(dateStr) || 0) + 1)
        } else {
          console.warn(`Invalid date in session ${session.id}: ${session.date}`)
        }
      } catch (error) {
        console.warn(`Error parsing date for session ${session.id}: ${session.date}`, error)
      }
    })
    const events = Array.from(eventMap.entries()).map(([dateStr, sessions]) => ({
      date: new Date(dateStr),
      sessions
    }))
    setCalendarEvents(events)
  }, [])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const handleStartMentoring = (sessionId: string, type: SessionType, link?: string) => {
    if (type === SessionType.CHAMADA_DE_VIDEO) {
      if (!link || !link.trim()) {
        toast.error("Link da chamada não disponível!")
        return
      }
      window.open(link, '_blank', 'noopener,noreferrer')
      return
    }

    if (activeSession) {
      toast.error("Você já possui uma sessão ativa!", {
        description: "Finalize a sessão atual antes de iniciar uma nova."
      })
      return
    }

    setActiveSession(sessionId)
    toast.success("Chat iniciado!", {
      description: "Você pode começar a conversar com o aluno.",
      action: {
        label: "Encerrar chat",
        onClick: () => handleEndSession(sessionId)
      }
    })
  }

  const handleEndSession = async (sessionId: string) => {
    try {
      await TutorSessionMentorAPI.deleteSession(sessionId)
      setActiveSession(null)
      setMentoringSessions(sessions => sessions.filter(s => s.id !== sessionId))
      updateCalendarEvents(mentoringSessions.filter(s => s.id !== sessionId))
      toast.success("Sessão encerrada com sucesso!", {
        description: "Um resumo da sessão será enviado para o aluno."
      })
    } catch (error) {
      toast.error("Erro ao encerrar sessão")
      console.error('Error ending session:', error)
    }
  }

  const handleRefuseSession = (sessionId: string) => {
    setSessionToDelete(sessionId)
    setShowDeleteDialog(true)
  }

  const handleConfirmRefuse = async () => {
    if (!sessionToDelete) return

    setIsDeleting(true)
    try {
      await TutorSessionMentorAPI.deleteSession(sessionToDelete)
      setMentoringSessions(sessions => sessions.filter(s => s.id !== sessionToDelete))
      updateCalendarEvents(mentoringSessions.filter(s => s.id !== sessionToDelete))
      toast.success("Sessão recusada com sucesso!", {
        description: "O aluno será notificado da recusa."
      })
    } catch (error) {
      toast.error("Erro ao recusar sessão")
      console.error('Error refusing session:', error)
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
      setSessionToDelete(null)
    }
  }

  const handleEditLink = (session: TutorSessionResponseDTO) => {
    setSessionToEdit(session)
    setNewLink(session.link || "")
    setShowEditLinkDialog(true)
  }

  const handleConfirmEditLink = async () => {
    if (!sessionToEdit || !newLink.trim()) {
      toast.error("Por favor, insira um link válido")
      return
    }

    setIsUpdatingLink(true)
    try {
      const updateData: TutorSessionCreateDTO = {
        mentorId: sessionToEdit.mentor.id,
        studentId: sessionToEdit.student.id,
        title: sessionToEdit.title,
        date: sessionToEdit.date,
        dateHour: sessionToEdit.dateHour,
        type: sessionToEdit.type,
        link: newLink.trim()
      }
      const updatedSession = await TutorSessionMentorAPI.updateSession(sessionToEdit.id, updateData)
      setMentoringSessions(sessions =>
        sessions.map(session =>
          session.id === sessionToEdit.id ? updatedSession : session
        )
      )
      toast.success("Link atualizado com sucesso!", {
        description: "O novo link foi salvo."
      })
    } catch (error) {
      toast.error("Erro ao atualizar link")
      console.error('Error updating link:', error)
    } finally {
      setIsUpdatingLink(false)
      setShowEditLinkDialog(false)
      setSessionToEdit(null)
      setNewLink("")
    }
  }

  const isDayWithSession = useCallback((day: Date) => {
    return calendarEvents.some(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    )
  }, [calendarEvents])

  const getSessionCount = useCallback((day: Date) => {
    const event = calendarEvents.find(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    )
    return event?.sessions || 0
  }, [calendarEvents])

  if (loading) {
    return <div className="container py-8">Carregando sessões...</div>
  }

  return (
    <ErrorBoundary>
      <div className="container py-8 space-y-8 animate-fadeIn">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Sessões de Mentoria
            </h1>
            <p className="text-slate-400">
              Gerencie suas sessões de mentoria
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="group overflow-hidden bg-gradient-to-br from-black/40 to-black/20 border-slate-800 hover:border-slate-700 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white">Próximas Sessões</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mentoringSessions.length === 0 ? (
                <p className="text-slate-400">Nenhuma sessão agendada.</p>
              ) : (
                mentoringSessions.map((session) => {
                  let sessionDate: Date | null = null
                  try {
                    if (session.date) {
                      sessionDate = parseISO(session.date)
                    }
                  } catch (error) {
                    console.warn(`Failed to parse date for session ${session.id}: ${session.date}`, error)
                  }
                  return (
                    <div key={session.id} className="p-4 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-white">{session.student?.name || "Aluno desconhecido"}</p>
                          <p className="text-sm text-slate-400">{session.title || "Sem título"}</p>
                        </div>
                        <Badge variant="secondary" className="bg-slate-500/20 text-slate-400">
                          {sessionDate && isValid(sessionDate) ? format(sessionDate, "dd/MM") : "Data inválida"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{session.dateHour ? session.dateHour : "Horário inválido"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {session.type === SessionType.CHAMADA_DE_VIDEO ? (
                            <Video className="w-4 h-4" />
                          ) : (
                            <MessageSquare className="w-4 h-4" />
                          )}
                          <span>{session.type === SessionType.CHAMADA_DE_VIDEO ? "Chamada de Vídeo" : "Chat"}</span>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => handleRefuseSession(session.id)}
                          disabled={isDeleting}
                        >
                          Recusar
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="bg-white/5 border-slate-800 hover:bg-white/10 hover:border-slate-700 text-white"
                          onClick={() => handleEditLink(session)}
                        >
                          Editar Link
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          onClick={() => handleStartMentoring(session.id, session.type, session.link)}
                        >
                          Iniciar {session.type === SessionType.CHAMADA_DE_VIDEO ? "Chamada" : "Chat"}
                        </Button>
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>

          <Card className="group overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 hover:border-slate-700 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-purple-400" />
                Calendário de Mentorias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={ptBR}
                modifiers={{ booked: isDayWithSession }}
                className="rounded-md border-slate-800 bg-slate-900/50"
              />
              {isDayWithSession(date) && (
                <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-purple-400" />
                    {format(date, "dd/MM/yyyy", { locale: ptBR })}
                  </h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
                      {getSessionCount(date)} sessões
                    </Badge>
                    <span className="text-sm text-slate-400">agendadas para este dia</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Recusa</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Deseja realmente recusar esta mentoria?</p>
              {sessionToDelete && mentoringSessions.find(s => s.id === sessionToDelete) && (
                <>
                  <p className="text-muted-foreground mt-2">
                    Aluno: {mentoringSessions.find(s => s.id === sessionToDelete)!.student.name || "Desconhecido"}
                  </p>
                  <p className="text-muted-foreground">
                    Título: {mentoringSessions.find(s => s.id === sessionToDelete)!.title || "Sem título"}
                  </p>
                  <p className="text-muted-foreground">
                    Data: {(() => {
                      const session = mentoringSessions.find(s => s.id === sessionToDelete)!
                      try {
                        const sessionDate = parseISO(session.date)
                        return isValid(sessionDate) ? format(sessionDate, "dd/MM/yyyy", { locale: ptBR }) : "Data inválida"
                      } catch {
                        return "Data inválida"
                      }
                    })()}
                  </p>
                  <p className="text-muted-foreground">
                    Horário: {mentoringSessions.find(s => s.id === sessionToDelete)!.dateHour && /^[0-2][0-9]:[0-5][0-9]$/.test(mentoringSessions.find(s => s.id === sessionToDelete)!.dateHour) ? mentoringSessions.find(s => s.id === sessionToDelete)!.dateHour : "Horário inválido"}
                  </p>
                </>
              )}
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowDeleteDialog(false)
                  setSessionToDelete(null)
                }}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive"
                onClick={handleConfirmRefuse}
                disabled={isDeleting}
              >
                {isDeleting ? "Recusando..." : "Confirmar Recusa"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showEditLinkDialog} onOpenChange={setShowEditLinkDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Link da Mentoria</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                type="text"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="Insira o novo link (ex: https://meet.google.com/abc)"
                disabled={isUpdatingLink}
              />
              {sessionToEdit && (
                <>
                  <p className="text-muted-foreground mt-2">
                    Aluno: {sessionToEdit.student.name || "Desconhecido"}
                  </p>
                  <p className="text-muted-foreground">
                    Título: {sessionToEdit.title || "Sem título"}
                  </p>
                  <p className="text-muted-foreground">
                    Data: {(() => {
                      try {
                        const sessionDate = parseISO(sessionToEdit.date)
                        return isValid(sessionDate) ? format(sessionDate, "dd/MM/yyyy", { locale: ptBR }) : "Data inválida"
                      } catch {
                        return "Data inválida"
                      }
                    })()}
                  </p>
                </>
              )}
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowEditLinkDialog(false)
                  setSessionToEdit(null)
                  setNewLink("")
                }}
                disabled={isUpdatingLink}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirmEditLink}
                disabled={isUpdatingLink || !newLink.trim()}
              >
                {isUpdatingLink ? "Salvando..." : "Salvar Link"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ErrorBoundary>
  )
}

export default MentorMentoria