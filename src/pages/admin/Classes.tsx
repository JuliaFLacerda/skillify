import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, GraduationCap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ClassCard } from "@/components/admin/classes/ClassCard"
import { NewClassDialog } from "@/components/admin/classes/NewClassDialog"
import { EditClassDialog } from "@/components/admin/classes/EditClassDialog"
import { DeleteClassDialog } from "@/components/admin/classes/DeleteClassDialog"
import { RegistrationLinkDialog } from "@/components/admin/classes/RegistrationLinkDialog"
import { ClassroomAdminAPI } from "@/api/admin/controllers/ClassroomAdminAPI"
import { ClassroomCreateDTO, ClassroomResponseDTO } from "@/api/dtos/classroomDtos"
import { ClassroomAccessTokenAdminAPI } from "@/api/admin/controllers/ClassroomAccessTokenAdminAPI"

const AdminClasses = () => {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isNewClassOpen, setIsNewClassOpen] = useState(false)
  const [isEditClassOpen, setIsEditClassOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [registrationLink, setRegistrationLink] = useState("")
  const [classes, setClasses] = useState<ClassroomResponseDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchClasses() {
      try {
        setLoading(true)
        const classrooms = await ClassroomAdminAPI.getAllClassrooms()
        setClasses(classrooms)
      } catch (error) {
        toast({
          title: "Erro ao carregar turmas",
          description: "Não foi possível carregar as turmas. Tente novamente mais tarde.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [toast])

  const handleNewClass = async (e: React.FormEvent, values: { name: string; mentorId: string; courseIds: string[] }) => {
    e.preventDefault()
    try {
      const newClass: ClassroomCreateDTO = {
        studentIds: new Set(),
        name: values.name,
        mentorId: values.mentorId,
        courseIds: values.courseIds
      }
      const createdClass = await ClassroomAdminAPI.createClassroom(newClass)
      setClasses([...classes, createdClass])
      setIsNewClassOpen(false)
      toast({
        title: "Turma criada",
        description: "A nova turma foi criada com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao criar turma",
        description: "Não foi possível criar a turma.",
        variant: "destructive",
      })
    }
  }

  const handleEditClass = async (e: React.FormEvent, values: { name: string; mentorId: string; courseIds: string[] }) => {
    e.preventDefault()
    if (!selectedClassId) return
    try {
      const updatedClassData: ClassroomCreateDTO = {
        name: values.name,
        mentorId: values.mentorId,
        studentIds: new Set(),
        courseIds: values.courseIds
      }
      const updatedClass = await ClassroomAdminAPI.editCourseClassrooms(selectedClassId, updatedClassData)
      setClasses(classes.map(c => c.id === selectedClassId ? updatedClass : c))
      setIsEditClassOpen(false)
      toast({
        title: "Turma atualizada",
        description: "A turma e seus cursos foram atualizados com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao atualizar turma",
        description: "Não foi possível atualizar a turma.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteClass = async () => {
    if (!selectedClassId) return
    try {
      await ClassroomAdminAPI.deleteClassroom(selectedClassId)
      setClasses(classes.filter(c => c.id !== selectedClassId))
      setIsDeleteDialogOpen(false)
      toast({
        title: "Turma removida",
        description: "A turma foi removida com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao remover turma",
        description: "Não foi possível remover a turma.",
        variant: "destructive",
      })
    }
  }

  const generateLink = async (classId: string) => {
    try {
      const generatedToken = await ClassroomAccessTokenAdminAPI.generateToken(classId)
      const className = classes.find(c => c.id === classId)?.name || ""
      setSelectedClassId(classId)
      setRegistrationLink(`${window.location.origin}/registro?classId=${generatedToken.token}`)
      setIsLinkDialogOpen(true)
    } catch (error) {
      toast({
        title: "Erro ao gerar link",
        description: "Não foi possível gerar o link de registro.",
        variant: "destructive",
      })
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(registrationLink)
    toast({
      title: "Link copiado",
      description: "O link de cadastro foi copiado para a área de transferência.",
    })
  }

  const filteredClasses = classes.filter(classItem =>
    classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    classItem.mentor.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="container py-8">
        <p className="text-center">Carregando turmas...</p>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Turmas
            <span className="text-primary ml-2">{classes.length}</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as turmas e seus mentores
          </p>
        </div>
        <Button
          onClick={() => setIsNewClassOpen(true)}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        >
          <GraduationCap className="w-5 h-5 mr-2" />
          Nova Turma
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar turmas por nome ou mentor..."
            className="pl-10 py-6 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.map((classItem) => (
          <ClassCard
            key={classItem.id}
            name={classItem.name}
            mentor={classItem.mentor.name}
            students={classItem.students.length}
            onGenerateLink={() => generateLink(classItem.id)}
            onEdit={() => {
              setSelectedClassId(classItem.id)
              setIsEditClassOpen(true)
            }}
            onDelete={() => {
              setSelectedClassId(classItem.id)
              setIsDeleteDialogOpen(true)
            }}
          />
        ))}
      </div>

      <NewClassDialog
        open={isNewClassOpen}
        onOpenChange={setIsNewClassOpen}
        onSubmit={handleNewClass}
      />

      <EditClassDialog
        open={isEditClassOpen}
        onOpenChange={setIsEditClassOpen}
        onSubmit={handleEditClass}
        selectedClass={selectedClassId ? classes.find(c => c.id === selectedClassId)?.name || null : null}
        classId={selectedClassId}
      />

      <DeleteClassDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteClass}
        selectedClass={selectedClassId ? classes.find(c => c.id === selectedClassId)?.name || null : null}
      />

      <RegistrationLinkDialog
        open={isLinkDialogOpen}
        onOpenChange={setIsLinkDialogOpen}
        onCopyLink={copyLink}
        selectedClass={selectedClassId ? classes.find(c => c.id === selectedClassId)?.name || null : null}
        registrationLink={registrationLink}
      />
    </div>
  )
}

export default AdminClasses