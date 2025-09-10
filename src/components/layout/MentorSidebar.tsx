import {
  Users,
  BookOpen,
  LayoutDashboard,
  FileText,
  Target,
  UserCheck,
  Trophy,
  BarChart,
  MessageSquare,
  GraduationCap,
  LogOut,
  HelpCircle, // Add this icon import
  Settings
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/mentor/dashboard" },
  { title: "Alunos", icon: Users, url: "/mentor/alunos" },
  { title: "Turmas", icon: GraduationCap, url: "/mentor/turmas" },
  { title: "Cursos", icon: BookOpen, url: "/mentor/cursos" },
  { title: "Redações", icon: FileText, url: "/mentor/redacoes" },
  { title: "Simulados", icon: Target, url: "/mentor/simulados" },
  { title: "Questões", icon: HelpCircle, url: "/mentor/questoes" }, // Add this menu item
  { title: "Mentoria", icon: UserCheck, url: "/mentor/mentoria" },
  { title: "Desafios", icon: Trophy, url: "/mentor/desafios" },
  { title: "Mensagens", icon: MessageSquare, url: "/mentor/mensagens" },
  { title: "Progresso", icon: BarChart, url: "/mentor/progresso" },
  { title: "Configurações", icon: Settings, url: "/mentor/configuracoes" },
  { title: "Logout", icon: LogOut, url: "/logout" },
]

export function MentorSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Mentor</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}