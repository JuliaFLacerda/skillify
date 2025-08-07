import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil } from "lucide-react"

interface MentorCardProps {
  name: string
  specialty: string
  isActive?: boolean
  biography: string
  onViewProfile: () => void
  onEdit: () => void
}

const MentorCard = ({ 
  name, 
  specialty, 
  isActive = true, 
  biography,
  onViewProfile,
  onEdit
}: MentorCardProps) => {
  return (
    <Card className="group hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-card to-primary/5 border-primary/10">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-1">{name}</CardTitle>
            <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
              {specialty}
            </Badge>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">
            {isActive ? "Ativo" : "Inativo"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Biografia</p>
            <p className="text-base">{biography}</p>
          </div>

          <div className="pt-4 flex gap-2">
            <Button 
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 py-6"
              onClick={onViewProfile}
            >
              Ver Perfil
            </Button>
            <Button 
              variant="outline"
              className="flex-1 border-primary/20 hover:bg-primary/10 text-primary shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 py-6"
              onClick={onEdit}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MentorCard