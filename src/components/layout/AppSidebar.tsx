import { Book, Home, MessageCircle, Award, ChartBar, User, PenTool, FileText, LogOut } from "lucide-react"
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

const mainMenuItems = [
  { title: "Home", icon: Home, url: "/dashboard" },
  { title: "Cursos", icon: Book, url: "/cursos" },
  { title: "Redações", icon: PenTool, url: "/redacoes" },
  { title: "Simulados", icon: FileText, url: "/simulados" },
  { title: "Mentoria", icon: MessageCircle, url: "/mentoria" },
  { title: "Desafios", icon: Award, url: "/desafios" },
  { title: "Progresso", icon: ChartBar, url: "/progresso" },
  { title: "Perfil", icon: User, url: "/configuracoes" },
  { title: "Logout", icon: LogOut, url: "/logout" },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
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