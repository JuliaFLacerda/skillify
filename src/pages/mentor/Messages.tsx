import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MessageCircle, UserPlus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CourseChat } from "@/components/CourseChat"
import { MessageMentorAPI } from "@/api/mentor/controllers/MessageMentorAPI"
import { UserMentorAPI } from "@/api/mentor/controllers/UserMentorAPI"
import { MessageResponseDTO } from "@/api/dtos/messageDtos"
import { UserResponseDTO, UserRole } from "@/api/dtos/userDtos"

interface StudentChat {
  id: string
  name: string
  avatar?: string
  lastMessage?: string // Optional since new students won't have messages
  time?: string // Optional since new students won't have timestamps
  unread: boolean
}

const MentorMessages = () => {
  const [selectedStudent, setSelectedStudent] = useState<StudentChat | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [studentsWithChats, setStudentsWithChats] = useState<StudentChat[]>([])
  const [studentsWithoutChats, setStudentsWithoutChats] = useState<StudentChat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const mentorId = localStorage.getItem('userId')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch messages
        const receivedMessages = await MessageMentorAPI.getReceivedMessages()
        const sentMessages = await MessageMentorAPI.getSentMessages()
        const allMessages = [...receivedMessages, ...sentMessages]
        
        // Fetch all students
        const allStudents = await UserMentorAPI.getAllStudents()
        
        // Process students with chats
        const studentMap = new Map<string, StudentChat>()
        allMessages.forEach((message: MessageResponseDTO) => {
          const student = message.remetente.role === UserRole.ESTUDANTE 
            ? message.remetente 
            : message.destinatario.role === UserRole.ESTUDANTE 
              ? message.destinatario 
              : null
          
          if (student && student.role === UserRole.ESTUDANTE) {
            const studentId = student.id
            if (!studentMap.has(studentId)) {
              studentMap.set(studentId, {
                id: studentId,
                name: student.name,
                avatar: undefined,
                lastMessage: message.content,
                time: new Date().toLocaleTimeString(), // Mocked
                unread: false // Mocked
              })
            }
          }
        })
        const studentsWithChatsList = Array.from(studentMap.values())
        setStudentsWithChats(studentsWithChatsList)

        // Process students without chats
        const studentsWithChatIds = new Set(studentsWithChatsList.map(s => s.id))
        const studentsWithoutChatsList = allStudents
          .filter(student => 
            student.role === UserRole.ESTUDANTE && 
            !studentsWithChatIds.has(student.id)
          )
          .map(student => ({
            id: student.id,
            name: student.name,
            avatar: undefined,
            unread: false
          }))
        setStudentsWithoutChats(studentsWithoutChatsList)

        if (studentsWithChatsList.length === 0 && studentsWithoutChatsList.length === 0) {
          setError('Nenhum aluno encontrado')
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
        setError('Erro ao carregar dados. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    if (mentorId) {
      fetchData()
    } else {
      setError('ID do mentor não encontrado no localStorage')
      setLoading(false)
    }
  }, [mentorId])

  const filteredStudentsWithChats = studentsWithChats.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredStudentsWithoutChats = studentsWithoutChats.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = async (content: string) => {
    if (!selectedStudent || !mentorId) return

    try {
      const messageData = {
        remetenteId: mentorId,
        destinatarioId: selectedStudent.id,
        content
      }
      
      await MessageMentorAPI.sendMessage(messageData)
      // Move student to "with chats" list and refresh
      const newStudentChat: StudentChat = {
        ...selectedStudent,
        lastMessage: content,
        time: new Date().toLocaleTimeString(),
        unread: false
      }
      setStudentsWithoutChats(prev => prev.filter(s => s.id !== selectedStudent.id))
      setStudentsWithChats(prev => {
        const updated = prev.filter(s => s.id !== selectedStudent.id) // Remove if already exists
        return [...updated, newStudentChat]
      })
      setSelectedStudent(newStudentChat) // Update selected student with message data
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  return (
    <div className="container py-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            Mensagens
          </h1>
          <p className="text-slate-400">
            Gerencie suas conversas com os alunos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-purple-400" />
              Conversas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar alunos..."
                className="pl-8 bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-400 focus-visible:ring-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <ScrollArea className="h-[500px]">
              {loading ? (
                <div className="text-slate-400 text-center py-4">Carregando...</div>
              ) : error ? (
                <div className="text-red-400 text-center py-4">{error}</div>
              ) : (
                <div className="space-y-4">
                  {/* Existing Chats */}
                  {filteredStudentsWithChats.length > 0 && (
                    <div className="space-y-2">
                      {filteredStudentsWithChats.map((student) => (
                        <button
                          key={student.id}
                          className={`w-full p-3 rounded-lg text-left transition-colors ${
                            selectedStudent?.id === student.id
                              ? "bg-purple-500/10 border border-purple-500/20"
                              : "hover:bg-slate-800/50"
                          }`}
                          onClick={() => setSelectedStudent(student)}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src={student.avatar} />
                              <AvatarFallback className="bg-purple-500/20 text-purple-400">{student.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-white">{student.name}</span>
                                <span className="text-xs text-slate-400">
                                  {student.time}
                                </span>
                              </div>
                              <p className="text-sm text-slate-400 truncate">
                                {student.lastMessage}
                              </p>
                            </div>
                            {student.unread && (
                              <div className="w-2 h-2 rounded-full bg-purple-500" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Students without Chats */}
                  {filteredStudentsWithoutChats.length > 0 && (
                    <>
                      <div className="text-white font-semibold flex items-center gap-2 mt-4">
                        <UserPlus className="w-5 h-5 text-purple-400" />
                        Alunos
                      </div>
                      <div className="space-y-2">
                        {filteredStudentsWithoutChats.map((student) => (
                          <button
                            key={student.id}
                            className={`w-full p-3 rounded-lg text-left transition-colors ${
                              selectedStudent?.id === student.id
                                ? "bg-purple-500/10 border border-purple-500/20"
                                : "hover:bg-slate-800/50"
                            }`}
                            onClick={() => setSelectedStudent(student)}
                          >
                            <div className="flex items-start gap-3">
                              <Avatar>
                                <AvatarImage src={student.avatar} />
                                <AvatarFallback className="bg-purple-500/20 text-purple-400">{student.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <span className="font-medium text-white">{student.name}</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {filteredStudentsWithChats.length === 0 && filteredStudentsWithoutChats.length === 0 && (
                    <div className="text-slate-400 text-center py-4">Nenhum aluno encontrado</div>
                  )}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800">
          {selectedStudent ? (
            <div className="h-[600px]">
              <CourseChat 
                studentId={selectedStudent.id}
                onSendMessage={handleSendMessage}
              />
            </div>
          ) : (
            <div className="h-[600px] flex flex-col items-center justify-center text-slate-400">
              <MessageCircle className="w-12 h-12 mb-4" />
              <p>Selecione um aluno para iniciar uma conversa</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default MentorMessages