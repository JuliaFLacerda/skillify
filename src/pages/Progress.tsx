import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { currentUser } from "@/data/mock"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts"
import { Award, Flame, Star, Trophy, Target, BookOpen, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const performanceData = [
  { month: "Jan", completed: 4, xp: 1200 },
  { month: "Fev", completed: 3, xp: 900 },
  { month: "Mar", completed: 6, xp: 1800 },
  { month: "Abr", completed: 8, xp: 2400 },
  { month: "Mai", completed: 7, xp: 2100 },
  { month: "Jun", completed: 9, xp: 2700 },
]

const ProgressPage = () => {
  const nextLevel = currentUser.level + 1
  const xpForNextLevel = nextLevel * 1000
  const xpProgress = (currentUser.xp % 1000) / 10

  return (
    <div className="container py-8 space-y-8 animate-fade-in">
      {/* Hero Section with Level and Streak */}
      <div className="bg-gradient-to-r from-primary-100 to-primary-200 rounded-lg p-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold">Nível {currentUser.level}</h1>
          <p className="text-xl text-primary-700">
            {currentUser.xp} XP • {xpForNextLevel - currentUser.xp} XP para o próximo nível
          </p>
          <Progress value={xpProgress} className="h-3 mt-4 w-full md:w-64" />
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="bg-white p-4 rounded-full">
              <Flame className="w-8 h-8 text-orange-500" />
            </div>
            <p className="mt-2 font-semibold">{currentUser.streakDays} dias</p>
            <p className="text-sm text-primary-700">Sequência</p>
          </div>
          <div className="text-center">
            <div className="bg-white p-4 rounded-full">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="mt-2 font-semibold">{currentUser.achievements.length}</p>
            <p className="text-sm text-primary-700">Conquistas</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Conquistas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentUser.achievements.slice(0, 3).map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg"
                >
                  <div className="p-2 bg-white rounded-full">
                    <span className="text-2xl">{achievement.icon}</span>
                  </div>
                  <div>
                    <p className="font-medium">{achievement.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                    {achievement.progress && achievement.maxProgress && (
                      <Progress
                        value={(achievement.progress / achievement.maxProgress) * 100}
                        className="h-1 mt-2"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Estatísticas de Aprendizado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Cursos Completos</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Horas Estudadas</p>
                  <p className="text-2xl font-bold">48h</p>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Média Diária</p>
                  <p className="text-2xl font-bold">2.5h</p>
                </div>
                <Star className="w-8 h-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* XP Chart */}
        <Card className="col-span-full md:col-span-1">
          <CardHeader>
            <CardTitle>Ganho de XP</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={performanceData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Line
                  type="monotone"
                  dataKey="xp"
                  stroke="#6366f1"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Ranking Section */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking Global</CardTitle>
          <CardDescription>Sua posição entre todos os alunos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { position: 1, name: "João Silva", xp: 15000, avatar: "/placeholder.svg" },
              { position: 2, name: "Maria Santos", xp: 14500, avatar: "/placeholder.svg" },
              { position: 3, name: "Você", xp: 14000, avatar: currentUser.avatar, isUser: true },
              { position: 4, name: "Pedro Oliveira", xp: 13800, avatar: "/placeholder.svg" },
            ].map((user) => (
              <div
                key={user.position}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg",
                  user.isUser ? "bg-primary-50" : "hover:bg-gray-50"
                )}
              >
                <span className="font-bold w-8">{user.position}º</span>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.xp} XP</p>
                </div>
                {user.position <= 3 && (
                  <Trophy
                    className={cn(
                      "w-6 h-6",
                      user.position === 1
                        ? "text-yellow-500"
                        : user.position === 2
                        ? "text-gray-400"
                        : "text-orange-500"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProgressPage