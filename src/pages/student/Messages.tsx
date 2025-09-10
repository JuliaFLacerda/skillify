import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MessageCircle, UserPlus, ArrowLeft } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { CourseChatStudent } from "@/components/CourseChatStudent"
import { MessageStudentAPI } from "@/api/student/controllers/MessageStudentAPI"
import { MessageResponseDTO } from "@/api/dtos/messageDtos"
import { UserResponseDTO, UserRole } from "@/api/dtos/userDtos"

interface MentorChat {
  id: string
  name: string
  avatar?: string
  lastMessage?: string
  lastMessageTime?: Date
  unread: boolean
}

const StudentMessages = () => {
  const [selectedMentor, setSelectedMentor] = useState<MentorChat | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [mentorsWithChats, setMentorsWithChats] = useState<MentorChat[]>([])
  const [availableMentors, setAvailableMentors] = useState<MentorChat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showChatOnMobile, setShowChatOnMobile] = useState(false)
  
  const studentId = localStorage.getItem('userId')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch existing messages
        const receivedMessages = await MessageStudentAPI.getReceivedMessages()
        const sentMessages = await MessageStudentAPI.getSentMessages()
        const allMessages = [...receivedMessages, ...sentMessages]
        
        // Fetch available mentors
        const availableMentorsResponse = await MessageStudentAPI.findAvailableMentorsForChat()
        
        // Process mentors with existing chats
        const mentorMap = new Map<string, MentorChat>()
        allMessages.forEach((message: MessageResponseDTO) => {
          const mentor = message.remetente.role === UserRole.MENTOR 
            ? message.remetente 
            : message.destinatario.role === UserRole.MENTOR 
              ? message.destinatario 
              : null
          
          if (mentor && mentor.role === UserRole.MENTOR) {
            const mentorId = mentor.id
            if (!mentorMap.has(mentorId)) {
              mentorMap.set(mentorId, {
                id: mentorId,
                name: mentor.name,
                avatar: undefined,
                lastMessage: message.content,
                lastMessageTime: new Date(),
                unread: false
              })
            }
          }
        })
        const mentorsWithChatsList = Array.from(mentorMap.values())
          .sort((a, b) => {
            // Sort by most recent message first
            if (!a.lastMessageTime && !b.lastMessageTime) return 0
            if (!a.lastMessageTime) return 1
            if (!b.lastMessageTime) return -1
            return b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
          })
        setMentorsWithChats(mentorsWithChatsList)

        // Process available mentors without existing chats
        const mentorsWithChatsIds = new Set(mentorsWithChatsList.map(m => m.id))
        const availableMentorsList = availableMentorsResponse
          .filter(mentor => mentor.role === UserRole.MENTOR)
          .filter(mentor => !mentorsWithChatsIds.has(mentor.id))
          .map(mentor => ({
            id: mentor.id,
            name: mentor.name,
            avatar: undefined,
            unread: false
          }))
        setAvailableMentors(availableMentorsList)

        if (mentorsWithChatsList.length === 0 && availableMentorsList.length === 0) {
          setError('Nenhum mentor disponível encontrado')
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
        setError('Erro ao carregar mensagens. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    if (studentId) {
      fetchData()
    } else {
      setError('ID do estudante não encontrado no localStorage')
      setLoading(false)
    }
  }, [studentId])

  const filteredMentorsWithChats = mentorsWithChats.filter(mentor => 
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredAvailableMentors = availableMentors.filter(mentor => 
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = async (content: string) => {
    if (!selectedMentor || !studentId) return

    try {
      const messageData = {
        remetenteId: studentId,
        destinatarioId: selectedMentor.id,
        content
      }
      
      const sentMessage = await MessageStudentAPI.sendMessage(messageData)
      
      // If this was a new mentor, move them to the with-chats list
      if (!mentorsWithChats.some(m => m.id === selectedMentor.id)) {
        const newMentorChat: MentorChat = {
          ...selectedMentor,
          lastMessage: sentMessage.content,
          lastMessageTime: new Date(),
          unread: false
        }
        setAvailableMentors(prev => prev.filter(m => m.id !== selectedMentor.id))
        setMentorsWithChats(prev => [newMentorChat, ...prev])
      } else {
        // Update existing mentor chat
        setMentorsWithChats(prev => {
          const updated = prev.filter(m => m.id !== selectedMentor.id)
          const updatedMentor: MentorChat = {
            ...selectedMentor,
            lastMessage: sentMessage.content,
            lastMessageTime: new Date(),
            unread: false
          }
          return [updatedMentor, ...updated]
        })
      }
      
      setSelectedMentor({
        ...selectedMentor,
        lastMessage: content,
        lastMessageTime: new Date()
      })
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleMentorSelect = (mentor: MentorChat) => {
    setSelectedMentor(mentor)
    setShowChatOnMobile(true)
  }

  const handleBackToList = () => {
    setShowChatOnMobile(false)
  }

  const formatMessageTime = (date?: Date) => {
    if (!date) return ''
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return 'agora'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
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
            Converse com seus mentores
          </p>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {!showChatOnMobile ? (
          <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800">
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
                  placeholder="Buscar mentores..."
                  className="pl-8 bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-400 focus-visible:ring-purple-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <ScrollArea className="h-[60vh]">
                {loading ? (
                  <div className="text-slate-400 text-center py-4">Carregando...</div>
                ) : error ? (
                  <div className="text-red-400 text-center py-4">{error}</div>
                ) : (
                  <div className="space-y-4">
                    {/* Existing Chats */}
                    {filteredMentorsWithChats.length > 0 && (
                      <div className="space-y-2">
                        {filteredMentorsWithChats.map((mentor) => (
                          <button
                            key={mentor.id}
                            className="w-full p-4 rounded-lg text-left transition-colors hover:bg-slate-800/50 border border-transparent hover:border-purple-500/20"
                            onClick={() => handleMentorSelect(mentor)}
                          >
                            <div className="flex items-start gap-3">
                              <Avatar className="flex-shrink-0">
                                <AvatarImage src={mentor.avatar} />
                                <AvatarFallback className="bg-purple-500/20 text-purple-400">{mentor.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-white truncate">{mentor.name}</span>
                                  <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
                                    {formatMessageTime(mentor.lastMessageTime)}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-400 truncate">
                                  {mentor.lastMessage}
                                </p>
                              </div>
                              {mentor.unread && (
                                <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Available Mentors */}
                    {filteredAvailableMentors.length > 0 && (
                      <>
                        <div className="text-white font-semibold flex items-center gap-2 mt-6 px-2">
                          <UserPlus className="w-5 h-5 text-purple-400" />
                          Mentores Disponíveis
                        </div>
                        <div className="space-y-2">
                          {filteredAvailableMentors.map((mentor) => (
                            <button
                              key={mentor.id}
                              className="w-full p-4 rounded-lg text-left transition-colors hover:bg-slate-800/50 border border-transparent hover:border-purple-500/20"
                              onClick={() => handleMentorSelect(mentor)}
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="flex-shrink-0">
                                  <AvatarImage src={mentor.avatar} />
                                  <AvatarFallback className="bg-purple-500/20 text-purple-400">{mentor.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <span className="font-medium text-white">{mentor.name}</span>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {filteredMentorsWithChats.length === 0 && filteredAvailableMentors.length === 0 && (
                      <div className="text-slate-400 text-center py-4">Nenhum mentor encontrado</div>
                    )}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white p-2"
                  onClick={handleBackToList}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedMentor?.avatar} />
                    <AvatarFallback className="bg-purple-500/20 text-purple-400">
                      {selectedMentor?.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold text-white">{selectedMentor?.name}</h2>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[60vh]">
                <CourseChatStudent
                  mentorId={selectedMentor!.id}
                  onSendMessage={handleSendMessage}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6">
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
                placeholder="Buscar mentores..."
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
                  {filteredMentorsWithChats.length > 0 && (
                    <div className="space-y-2">
                      {filteredMentorsWithChats.map((mentor) => (
                        <button
                          key={mentor.id}
                          className={`w-full p-3 rounded-lg text-left transition-colors ${
                            selectedMentor?.id === mentor.id
                              ? "bg-purple-500/10 border border-purple-500/20"
                              : "hover:bg-slate-800/50"
                          }`}
                          onClick={() => setSelectedMentor(mentor)}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src={mentor.avatar} />
                              <AvatarFallback className="bg-purple-500/20 text-purple-400">{mentor.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-white">{mentor.name}</span>
                                <span className="text-xs text-slate-400">
                                  {formatMessageTime(mentor.lastMessageTime)}
                                </span>
                              </div>
                              <p className="text-sm text-slate-400 truncate">
                                {mentor.lastMessage}
                              </p>
                            </div>
                            {mentor.unread && (
                              <div className="w-2 h-2 rounded-full bg-purple-500" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Available Mentors */}
                  {filteredAvailableMentors.length > 0 && (
                    <>
                      <div className="text-white font-semibold flex items-center gap-2 mt-4">
                        <UserPlus className="w-5 h-5 text-purple-400" />
                        Mentores Disponíveis
                      </div>
                      <div className="space-y-2">
                        {filteredAvailableMentors.map((mentor) => (
                          <button
                            key={mentor.id}
                            className={`w-full p-3 rounded-lg text-left transition-colors ${
                              selectedMentor?.id === mentor.id
                                ? "bg-purple-500/10 border border-purple-500/20"
                                : "hover:bg-slate-800/50"
                            }`}
                            onClick={() => setSelectedMentor(mentor)}
                          >
                            <div className="flex items-start gap-3">
                              <Avatar>
                                <AvatarImage src={mentor.avatar} />
                                <AvatarFallback className="bg-purple-500/20 text-purple-400">{mentor.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <span className="font-medium text-white">{mentor.name}</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {filteredMentorsWithChats.length === 0 && filteredAvailableMentors.length === 0 && (
                    <div className="text-slate-400 text-center py-4">Nenhum mentor encontrado</div>
                  )}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800">
          {selectedMentor && studentId ? (
            <div className="h-[600px]">
              <CourseChatStudent
                mentorId={selectedMentor.id}
                onSendMessage={handleSendMessage}
              />
            </div>
          ) : (
            <div className="h-[600px] flex flex-col items-center justify-center text-slate-400">
              <MessageCircle className="w-12 h-12 mb-4" />
              <p>Selecione um mentor para iniciar uma conversa</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default StudentMessages