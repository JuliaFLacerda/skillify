import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Camera } from "lucide-react";
import { UserRole } from "@/api/dtos/userDtos";
import { LevelProgressResponseDTO } from "@/api/dtos/levelProgressDtos";
import { useToast } from "@/components/ui/use-toast";
import { UserStudentAPI } from "@/api/student/controllers/UserStudentAPI";

interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyProgress: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  tel: string;
  biography: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReport: boolean;
  studyReminder: boolean;
  role: UserRole;
  preferences: UserPreferences;
  avatar?: string;
}

interface ProfileTabProps {
  user: User;
  levelProgress: LevelProgressResponseDTO | null;
  onUserUpdate: Dispatch<SetStateAction<User | null>>;
  onSubmit: (user: User) => void;
}

export function ProfileTab({ user, levelProgress, onUserUpdate, onSubmit }: ProfileTabProps) {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(user);
  };

  const handleAvatarUpdate = async (imageUrl: string) => {
    try {
      const updatedProfile = await UserStudentAPI.updateStudentAvatar({ imageUrl });
      onUserUpdate({
        ...user,
        avatar: updatedProfile.avatar,
      });
      toast({
        title: "Avatar atualizado",
        description: "Sua imagem de perfil foi alterada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar o avatar.",
        variant: "destructive",
      });
    }
  };

  const calculateLevelThreshold = (level: number): number => {
    if (level < 1) return 0;
    return 100 * level * level;
  };

  const calculateRelativeXp = (currentXp: number, currentLevel: number): number => {
    const currentThreshold = calculateLevelThreshold(currentLevel);
    return Math.max(0, currentXp - currentThreshold);
  };

  const calculateProgressPercentage = (relativeXp: number, xpToNextLevel: number): number => {
    if (xpToNextLevel === 0) return 0;
    return Math.min((relativeXp / xpToNextLevel) * 100, 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <img
                src={user.avatar || "/default-avatar.png"}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <Button
                size="icon"
                variant="outline"
                className="absolute bottom-0 right-0 rounded-full"
                onClick={() => {
                  const url = prompt("Enter new avatar URL:");
                  if (url) handleAvatarUpdate(url);
                }}
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-lg font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {levelProgress ? (
                <div className="mt-2">
                  <p className="text-sm font-medium">
                    Nível: {levelProgress.currentLevel}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {calculateRelativeXp(levelProgress.currentXp, levelProgress.currentLevel)} / {levelProgress.xpToNextLevel} XP
                  </p>
                  <Progress
                    value={calculateProgressPercentage(
                      calculateRelativeXp(levelProgress.currentXp, levelProgress.currentLevel),
                      levelProgress.xpToNextLevel
                    )}
                    className="w-full mt-1"
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Carregando progresso...</p>
              )}
            </div>
          </div>

          <div className="grid gap-6 mt-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={user.name}
                onChange={(e) => onUserUpdate({ ...user, name: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                onChange={(e) => onUserUpdate({ ...user, email: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <div className="flex gap-2">
                <Select
                  defaultValue="BR"
                  onValueChange={(value) => {
                    const countryCode = value === "BR" ? "+55" : value === "US" ? "+1" : "+351";
                    onUserUpdate({ ...user, tel: countryCode + user.tel.replace(/^\+\d+/, "") });
                  }}
                >
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
                  value={user.tel}
                  onChange={(e) => onUserUpdate({ ...user, tel: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                value={user.biography}
                onChange={(e) => onUserUpdate({ ...user, biography: e.target.value })}
                placeholder="Conte um pouco sobre você..."
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => onUserUpdate(user)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}