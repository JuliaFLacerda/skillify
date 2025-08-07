import { Trophy } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { currentUser } from "@/data/mock"

export const DashboardHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Olá, {currentUser.name}!
        </h1>
        <p className="text-muted-foreground">
          Continue sua jornada de aprendizado
        </p>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-purple-500/10 p-3 rounded-lg border border-primary/20 hover:border-primary/40 transition-all">
              <Trophy className="h-5 w-5 text-primary animate-pulse" />
              <span className="font-semibold text-primary">Nível {currentUser.level}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{currentUser.xp} XP acumulados</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}