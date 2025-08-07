import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Book, PenLine, User as UserIcon, Lock } from "lucide-react";
import { useTheme } from "next-themes";
import { ProfileTab } from "@/components/settings/ProfileTab";
import { PasswordChangeTab } from "@/components/settings/PasswordChangeTab";
import { UserStudentAPI } from "@/api/student/controllers/UserStudentAPI";
import { UserResponseDTO, UserRole } from "@/api/dtos/userDtos";
import { LevelProgressResponseDTO } from "@/api/dtos/levelProgressDtos";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyProgress: boolean;
}

interface User extends UserResponseDTO {
  preferences: UserPreferences;
}

const Settings = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [levelProgress, setLevelProgress] = useState<LevelProgressResponseDTO | null>(null);
  const [themeColor, setThemeColor] = useState("purple");
  const [themeStyle, setThemeStyle] = useState("default");

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        const profile = await UserStudentAPI.getStudentProfile();
        const progress = await UserStudentAPI.getLevelProgress();
        console.log("progress: ")
        console.log(progress)
        setUser({
          ...profile,
          preferences: {
            emailNotifications: profile.emailNotifications,
            pushNotifications: profile.pushNotifications,
            weeklyProgress: profile.weeklyReport,
          },
        });
        setLevelProgress(progress);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao carregar dados do perfil.",
          variant: "destructive",
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const currentTheme = theme || "light";
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(currentTheme);
    document.documentElement.style.setProperty(
      "color-scheme",
      currentTheme === "dark" ? "dark" : "light"
    );
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const validThemeClasses = [
      "theme-blue",
      "theme-green",
      "theme-pink",
      "theme-orange",
      "theme-minimal",
      "theme-glass",
    ];
    document.body.classList.remove(...validThemeClasses);
    if (themeColor && !/\s/.test(themeColor)) {
      document.body.classList.add(`theme-${themeColor}`);
    }
    if (themeStyle !== "default" && !/\s/.test(themeStyle)) {
      document.body.classList.add(`theme-${themeStyle}`);
    }
  }, [themeColor, themeStyle, mounted]);

  const handleSaveProfile = async (updatedUser: User) => {
    try {
      await UserStudentAPI.updateStudentProfile({
        name: updatedUser.name,
        email: updatedUser.email,
        password: "", // Password not updated via this form
        tel: updatedUser.tel,
        biography: updatedUser.biography,
        emailNotifications: updatedUser.preferences.emailNotifications,
        pushNotifications: updatedUser.preferences.pushNotifications,
        weeklyReport: updatedUser.preferences.weeklyProgress,
        studyReminder: updatedUser.studyReminder,
        role: updatedUser.role,
      });
      setUser(updatedUser);
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar o perfil.",
        variant: "destructive",
      });
    }
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const updatedProfile = await UserStudentAPI.updateStudentPassword({
        currentPassword,
        newPassword,
      });
      setUser({
        ...updatedProfile,
        preferences: {
          emailNotifications: updatedProfile.emailNotifications,
          pushNotifications: updatedProfile.pushNotifications,
          weeklyProgress: updatedProfile.weeklyReport,
        },
      });
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi alterada com sucesso.",
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Falha ao atualizar a senha.";
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleTogglePreference = (key: keyof UserPreferences) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        [key]: !user.preferences[key],
      },
    };
    setUser(updatedUser);
    handleSaveProfile(updatedUser);
  };

  const handleThemeColorChange = (color: string) => {
    if (/\s/.test(color)) {
      toast({
        title: "Erro",
        description: "A cor do tema não pode conter espaços.",
        variant: "destructive",
      });
      return;
    }
    setThemeColor(color);
    toast({
      title: "Cor do tema atualizada",
      description: "A cor de destaque foi alterada com sucesso.",
    });
  };

  const handleThemeStyleChange = (style: string) => {
    if (/\s/.test(style)) {
      toast({
        title: "Erro",
        description: "O estilo do tema não pode conter espaços.",
        variant: "destructive",
      });
      return;
    }
    setThemeStyle(style);
    toast({
      title: "Estilo visual atualizado",
      description: "O estilo visual foi alterado com sucesso.",
    });
  };

  if (!mounted || !user) return null;

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
          {user.role === UserRole.ESTUDANTE ? "Estudante" : user.role}
        </Badge>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Senha
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab
            user={user}
            levelProgress={levelProgress}
            onUserUpdate={setUser}
            onSubmit={handleSaveProfile}
          />
        </TabsContent>
        <TabsContent value="password">
          <PasswordChangeTab onSubmit={handleChangePassword} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;