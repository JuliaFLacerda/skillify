import {
    Users,
    BookOpen,
    LayoutDashboard,
    UserCog,
    Target,
    Calendar,
    PenSquare,
    FileText,
    Settings,
    LogOut,
    MessageSquare
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
    { title: "Cursos", icon: BookOpen, url: "/dashboard/cursos" },
    { title: "Progresso", icon: Target, url: "/dashboard/progresso" },
    { title: "Desafios", icon: Users, url: "/dashboard/desafios" },
    { title: "Mentoria", icon: UserCog, url: "/dashboard/mentoria" },
    { title: "Mensagens", icon: MessageSquare, url: "/dashboard/mensagens" },
    { title: "Aula ao Vivo", icon: Calendar, url: "/dashboard/aula-ao-vivo" },
    { title: "Redações", icon: PenSquare, url: "/dashboard/redacoes" },
    { title: "Simulados", icon: FileText, url: "/dashboard/simulados" },
    { title: "Configurações", icon: Settings, url: "/dashboard/configuracoes" },
    { title: "Logout", icon: LogOut, url: "/logout" },
  ]
  
  export function StudentSidebar() {
    return (
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Estudante</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.url} 
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                      >
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