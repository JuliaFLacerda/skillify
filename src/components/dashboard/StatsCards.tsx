
import { BookOpen, Target, Star, Award } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { activeChallenges, activeCourses, currentUser } from "@/data/mock"

export const StatsCards = () => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="group hover:shadow-lg transition-all hover:-translate-y-1 bg-gradient-to-br from-background to-primary/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cursos Ativos</CardTitle>
          <BookOpen className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeCourses.length}</div>
          <Progress value={65} className="h-2 mt-2" />
        </CardContent>
      </Card>

      <Card className="group hover:shadow-lg transition-all hover:-translate-y-1 bg-gradient-to-br from-background to-primary/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Desafios</CardTitle>
          <Target className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeChallenges.length}</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-500 font-medium">2 pendentes</span>
            <Award className="h-3 w-3 text-emerald-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-lg transition-all hover:-translate-y-1 bg-gradient-to-br from-background to-primary/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sequência</CardTitle>
          <Star className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentUser.streakDays} dias</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-500 font-medium">Continue assim!</span>
            <div className="animate-pulse h-2 w-2 rounded-full bg-amber-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
