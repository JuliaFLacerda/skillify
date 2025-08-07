import {
  Users,
  BookOpen,
  LayoutDashboard,
  UserCog,
  Package,
  GraduationCap,
  LogOut,
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
  { title: "Dashboard", icon: LayoutDashboard, url: "/admin/dashboard" },
  { title: "Mentores", icon: UserCog, url: "/admin/mentores" },
  { title: "Cursos", icon: BookOpen, url: "/admin/cursos" },
  { title: "Alunos", icon: Users, url: "/admin/alunos" },
  { title: "Turmas", icon: GraduationCap, url: "/admin/turmas" },
  { title: "Planos", icon: Package, url: "/admin/planos" },
  { title: "Configurações", icon: Settings, url: "/admin/configuracoes" },
  { title: "Logout", icon: LogOut, url: "/logout" },
]

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
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