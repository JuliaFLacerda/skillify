
import { useState } from "react"
import { currentUser } from "@/data/mock"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { User } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import {
  Book,
  Calendar,
  Camera,
  Moon,
  PenLine,
  Phone,
  Sun,
  User as UserIcon,
} from "lucide-react"
import { useTheme } from "next-themes"

const Settings = () => {
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState<User>({
    ...currentUser,
    preferences: {
      emailNotifications: true,
      pushNotifications: false,
      weeklyProgress: true,
    },
  })

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso.",
    })
  }

  const handleTogglePreference = (
    key: keyof NonNullable<User["preferences"]>
  ) => {
    setUser((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences!,
        [key]: !prev.preferences![key],
      },
    }))
  }

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Estudante
        </Badge>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Book className="w-4 h-4" />
            Preferências
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <PenLine className="w-4 h-4" />
            Aparência
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute bottom-0 right-0 rounded-full"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-lg font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="grid gap-6 mt-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={user.name}
                      onChange={(e) =>
                        setUser((prev) => ({ ...prev, name: e.target.value }))
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      onChange={(e) =>
                        setUser((prev) => ({ ...prev, email: e.target.value }))
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <div className="flex gap-2">
                      <Select defaultValue="BR">
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="País" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BR">+55</SelectItem>
                          <SelectItem value="US">+1</SelectItem>
                          <SelectItem value="PT">+351</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="bio">Biografia</Label>
                    <Textarea
                      id="bio"
                      placeholder="Conte um pouco sobre você..."
                      rows={4}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button variant="outline">Cancelar</Button>
                  <Button type="submit">Salvar Alterações</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba atualizações sobre cursos e mentoria
                  </p>
                </div>
                <Switch
                  checked={user.preferences?.emailNotifications}
                  onCheckedChange={() =>
                    handleTogglePreference("emailNotifications")
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Notificações Push</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações no navegador
                  </p>
                </div>
                <Switch
                  checked={user.preferences?.pushNotifications}
                  onCheckedChange={() =>
                    handleTogglePreference("pushNotifications")
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Relatório Semanal</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba um resumo do seu progresso
                  </p>
                </div>
                <Switch
                  checked={user.preferences?.weeklyProgress}
                  onCheckedChange={() => handleTogglePreference("weeklyProgress")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Lembrete de Estudos</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba lembretes diários para estudar
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="18:00">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Horário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08:00">08:00</SelectItem>
                      <SelectItem value="12:00">12:00</SelectItem>
                      <SelectItem value="18:00">18:00</SelectItem>
                      <SelectItem value="20:00">20:00</SelectItem>
                    </SelectContent>
                  </Select>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Tema e Aparência</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Tema da Interface</Label>
                  <p className="text-sm text-muted-foreground">
                    Escolha entre tema claro ou escuro
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Alternar tema</span>
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Formato de Data</Label>
                  <p className="text-sm text-muted-foreground">
                    Escolha como as datas serão exibidas
                  </p>
                </div>
                <Select defaultValue="dd/MM/yyyy">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Formato de data" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
                    <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
                    <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Fuso Horário</Label>
                  <p className="text-sm text-muted-foreground">
                    Defina seu fuso horário
                  </p>
                </div>
                <Select defaultValue="America/Sao_Paulo">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Fuso horário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Sao_Paulo">
                      São Paulo (GMT-3)
                    </SelectItem>
                    <SelectItem value="America/New_York">
                      New York (GMT-4)
                    </SelectItem>
                    <SelectItem value="Europe/London">
                      London (GMT+1)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Settings
