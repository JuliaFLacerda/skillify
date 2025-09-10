// ProfileDialog.tsx
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { UserResponseDTO } from "@/api/dtos/userDtos"
import { UserAdminAPI } from "@/api/admin/controllers/UserAdminAPI"

interface ProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mentorId: string | null // Changed from mentorName to mentorId
}

const ProfileDialog = ({ open, onOpenChange, mentorId }: ProfileDialogProps) => {
  const { toast } = useToast()
  const [mentor, setMentor] = useState<UserResponseDTO | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchMentor = async () => {
      if (!mentorId || !open) return
      
      setLoading(true)
      try {
        const mentorData = await UserAdminAPI.getUserById(mentorId)
        setMentor(mentorData)
      } catch (error) {
        toast({
          title: "Erro ao carregar perfil",
          description: "Não foi possível carregar os dados do mentor.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMentor()
  }, [mentorId, open, toast])

  if (loading || !mentor) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Perfil do Mentor</DialogTitle>
            <DialogDescription>Carregando dados do mentor...</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Perfil do Mentor</DialogTitle>
          <DialogDescription>
            Detalhes completos do perfil de {mentor.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nome</Label>
              <p className="text-lg font-medium mt-1">{mentor.name}</p>
            </div>
            <div>
              <Label>Email</Label>
              <p className="text-lg font-medium mt-1">{mentor.email}</p>
            </div>
            <div>
              <Label>Especialidade</Label>
              <div className="mt-1">
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {mentor.expertise ?? "Especialidade não especificada"}
                </Badge>
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <div className="mt-1">
                <Badge className="bg-emerald-500/10 text-emerald-600">
                  Ativo
                </Badge>
              </div>
            </div>
          </div>
          
          <div>
            <Label>Biografia</Label>
            <p className="text-muted-foreground mt-1">
              {mentor.biography || "Biografia não fornecida."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileDialog