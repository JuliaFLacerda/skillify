// AdminMentors.tsx
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import MentorCard from "@/components/admin/mentors/MentorCard"
import NewMentorDialog from "@/components/admin/mentors/NewMentorDialog"
import EditMentorDialog from "@/components/admin/mentors/EditMentorDialog"
import MessageDialog from "@/components/admin/mentors/MessageDialog"
import ProfileDialog from "@/components/admin/mentors/ProfileDialog"
import { UserResponseDTO, UserUpdateRequest } from "@/api/dtos/userDtos"
import { UserAdminAPI } from "@/api/admin/controllers/UserAdminAPI"
import { RegisterRequest } from "@/api/dtos/authDtos"

// Assuming there's an auth context or similar to get the current admin's ID
const currentAdminId = localStorage.getItem("userId")

const AdminMentors = () => {
  const { toast } = useToast()
  const [isNewMentorOpen, setIsNewMentorOpen] = useState(false)
  const [isEditMentorOpen, setIsEditMentorOpen] = useState(false)
  const [isMessageOpen, setIsMessageOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState<UserResponseDTO | null>(null)
  const [selectedMentorName, setSelectedMentorName] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [mentors, setMentors] = useState<UserResponseDTO[]>([])

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const mentorList = await UserAdminAPI.getAllMentors()
        setMentors(mentorList)
      } catch (error) {
        toast({
          title: "Erro ao carregar mentores",
          description: "Não foi possível carregar a lista de mentores.",
          variant: "destructive"
        })
      }
    }
    fetchMentors()
  }, [toast])

  const handleNewMentor = async (mentorData: RegisterRequest) => {
    try {
      const newMentor = await UserAdminAPI.createUser(mentorData)
      setMentors(prev => [...prev, newMentor])
      setIsNewMentorOpen(false)
      toast({
        title: "Mentor adicionado",
        description: "O novo mentor foi cadastrado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao adicionar mentor",
        description: "Não foi possível cadastrar o novo mentor.",
        variant: "destructive"
      })
    }
  }

  const handleEditMentor = async (mentorData: UserUpdateRequest) => {
    if (!selectedMentor) return
    try {
      const updatedMentor = await UserAdminAPI.updateUser(selectedMentor.id, mentorData)
      setMentors(prev => prev.map(mentor => mentor.id === updatedMentor.id ? updatedMentor : mentor))
      setIsEditMentorOpen(false)
      setSelectedMentor(null)
      toast({
        title: "Mentor atualizado",
        description: "Os dados do mentor foram atualizados com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao atualizar mentor",
        description: "Não foi possível atualizar os dados do mentor.",
        variant: "destructive"
      })
    }
  }

  const openMessageDialog = (mentorId: string, mentorName: string) => {
    setSelectedMentor(mentors.find(mentor => mentor.id === mentorId) || null)
    setSelectedMentorName(mentorName)
    setIsMessageOpen(true)
  }

  const openProfileDialog = (mentorId: string) => {
    setSelectedMentor(mentors.find(mentor => mentor.id === mentorId) || null)
    setIsProfileOpen(true)
  }

  const openEditDialog = (mentorId: string) => {
    setSelectedMentor(mentors.find(mentor => mentor.id === mentorId) || null)
    setIsEditMentorOpen(true)
  }

  const filteredMentors = mentors.filter(mentor => 
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.biography?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container py-8 space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Mentores
            <span className="text-primary ml-2">{mentors.length}</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os mentores da plataforma e suas atribuições
          </p>
        </div>
        <Button 
          onClick={() => setIsNewMentorOpen(true)}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Novo Mentor
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar mentores por nome, especialidade..." 
            className="pl-10 py-6 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMentors.map(mentor => (
          <MentorCard
            key={mentor.id}
            name={mentor.name}
            specialty={mentor.expertise || 'Especialidade não informada'}
            biography={mentor.biography || "Biografia não informada"}
            onViewProfile={() => openProfileDialog(mentor.id)}
            onEdit={() => openEditDialog(mentor.id)}
          />
        ))}
      </div>

      <NewMentorDialog
        open={isNewMentorOpen}
        onOpenChange={setIsNewMentorOpen}
        onSubmit={handleNewMentor}
      />

      <EditMentorDialog
        open={isEditMentorOpen}
        onOpenChange={setIsEditMentorOpen}
        onSubmit={handleEditMentor}
        mentor={selectedMentor}
      />

      <MessageDialog
        open={isMessageOpen}
        onOpenChange={setIsMessageOpen}
        mentorId={selectedMentor?.id || null}
        mentorName={selectedMentorName}
        senderId={currentAdminId}
      />

      <ProfileDialog
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        mentorId={selectedMentor?.id || null}
      />
    </div>
  )
}
export default AdminMentors