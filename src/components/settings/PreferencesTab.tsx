
import { User } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PreferencesTabProps {
  user: User
  onTogglePreference: (key: keyof NonNullable<User["preferences"]>) => void
}

export function PreferencesTab({ user, onTogglePreference }: PreferencesTabProps) {
  return (
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
            onCheckedChange={() => onTogglePreference("emailNotifications")}
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
            onCheckedChange={() => onTogglePreference("pushNotifications")}
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
            onCheckedChange={() => onTogglePreference("weeklyProgress")}
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
  )
}
