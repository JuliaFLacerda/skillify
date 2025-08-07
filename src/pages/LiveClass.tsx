
import { useState } from "react"
import { useParams } from "react-router-dom"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { CourseChat } from "@/components/CourseChat"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

const mockLiveClass = {
  id: "1",
  title: "React Avançado",
  instructor: "João Silva",
  videoUrl: "https://example.com/live-video",
  activeViewers: 42,
  description: "Nesta aula vamos aprender sobre hooks avançados e performance em React",
  xpReward: 100,
}

export default function LiveClass() {
  const { id } = useParams()
  const [viewersCount] = useState(mockLiveClass.activeViewers)

  return (
    <div className="h-screen flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={75}>
          <div className="p-6 space-y-4">
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative">
              {/* Player de vídeo seria integrado aqui */}
              <div className="text-white">Stream ao vivo</div>
              <Badge 
                variant="secondary" 
                className="absolute top-4 left-4 flex items-center gap-1"
              >
                <Users className="w-4 h-4" />
                {viewersCount} assistindo
              </Badge>
            </div>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">{mockLiveClass.title}</h1>
                <Badge variant="secondary">
                  +{mockLiveClass.xpReward} XP
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Professor: {mockLiveClass.instructor}
                </p>
                <p>{mockLiveClass.description}</p>
              </div>
            </Card>
          </div>
        </ResizablePanel>
        
        <ResizableHandle />
        
        <ResizablePanel defaultSize={25}>
          <ScrollArea className="h-full">
            <CourseChat />
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
