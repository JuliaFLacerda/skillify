
import { Bell, MessageCircle, Video } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

interface Update {
  id: string
  type: "important" | "mentor" | "live"
  title: string
  content: string
  timestamp: string
  actionUrl?: string
}

const updates: Update[] = [
  {
    id: "1",
    type: "important",
    title: "Nova Funcionalidade",
    content: "Agora você pode acompanhar seu progresso em tempo real!",
    timestamp: "Há 2 horas",
  },
  {
    id: "2",
    type: "mentor",
    title: "Mensagem do Mentor João",
    content: "Parabéns pelo seu progresso no curso de React!",
    timestamp: "Há 3 horas",
  },
  {
    id: "3",
    type: "live",
    title: "Aula ao Vivo: React Avançado",
    content: "A aula começará em 30 minutos",
    timestamp: "Agora",
    actionUrl: "/aula-ao-vivo/1",
  },
]

export function UpdatesMural() {
  const navigate = useNavigate()

  const getIcon = (type: Update["type"]) => {
    switch (type) {
      case "important":
        return <Bell className="w-5 h-5 text-orange-500" />
      case "mentor":
        return <MessageCircle className="w-5 h-5 text-primary" />
      case "live":
        return <Video className="w-5 h-5 text-red-500" />
    }
  }

  const getActionButton = (update: Update) => {
    if (update.type === "live") {
      return (
        <Button
          onClick={() => navigate(update.actionUrl!)}
          className="w-full mt-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Entrar na Aula
        </Button>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent inline-block">
        Mural de Atualizações
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {updates.map((update) => (
          <Card
            key={update.id}
            className="group p-4 hover:shadow-lg transition-all duration-300 relative overflow-hidden hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-800 border border-slate-200 dark:border-slate-700"
          >
            <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] transform rotate-12">
              {getIcon(update.type)}
            </div>
            <div className="relative z-10 flex items-start gap-3">
              <div className="mt-1 p-2 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-700 shadow-sm">
                {getIcon(update.type)}
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="font-semibold text-lg">{update.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {update.content}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                  {update.timestamp}
                </div>
                {getActionButton(update)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
