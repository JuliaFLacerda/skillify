import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Link as LinkIcon, Edit, Trash2 } from "lucide-react"

interface ClassItemProps {
  name: string
  mentor: string
  students: number
  onGenerateLink: () => void
  onEdit: () => void
  onDelete: () => void
}

export function ClassCard({ 
  name, 
  mentor, 
  students,
  onGenerateLink,
  onEdit,
  onDelete
}: ClassItemProps) {
  return (
    <Card className="group flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-primary/5">
      <CardHeader className="pb-4 flex-1">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{students} alunos</span>
          </div>
        </div>

        <div className="mt-4">
          <CardTitle className="text-xl line-clamp-1">{name}</CardTitle>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <p className="text-sm text-muted-foreground truncate">Mentor: {mentor}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-3 gap-2">
          <Button 
            variant="outline" 
            className="w-full h-auto py-2 px-2 border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
            onClick={onGenerateLink}
          >
            <div className="flex flex-col items-center gap-1">
              <LinkIcon className="w-4 h-4" />
              <span className="text-xs">Gerar Link</span>
            </div>
          </Button>
          <Button 
            variant="outline"
            className="w-full h-auto py-2 px-2 border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
            onClick={onEdit}
          >
            <div className="flex flex-col items-center gap-1">
              <Edit className="w-4 h-4" />
              <span className="text-xs">Editar</span>
            </div>
          </Button>
          <Button 
            variant="destructive" 
            className="w-full h-auto py-2 px-2 hover:bg-red-700 transition-all duration-300"
            onClick={onDelete}
          >
            <div className="flex flex-col items-center gap-1">
              <Trash2 className="w-4 h-4" />
              <span className="text-xs">Remover</span>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}