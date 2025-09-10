import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { MentorSidebar } from "@/components/layout/MentorSidebar";
import Index from "@/pages/Index";
import { StudentRoutes } from "@/routes/studentRoutes";
import { AdminRoutes } from "@/routes/adminRoutes";
import { MentorRoutes } from "@/routes/mentorRoutes";
import { ThemeProvider } from "next-themes";
import Login from "@/pages/Login";
import Register from "./pages/Register";
import { Toaster } from "./components/ui/toaster";
import { useEffect, useState } from "react";
import { StudentSidebar } from "./components/layout/StudentSidebar";

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole")?.toUpperCase();
    setIsAuthenticated(!!token);
    setUserRole(role);
    setAuthChecked(true);
  }, []);

  const getDashboardPath = () => {
    switch (userRole) {
      case "ESTUDANTE":
        return "/dashboard";
      case "ADMIN":
        return "/admin";
      case "MENTOR":
        return "/mentor";
      default:
        return "/login";
    }
  };

  const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      setIsAuthenticated(false);
      setUserRole(null);
      navigate("/");
    }, [navigate]);

    return null;
  };

  // ShouldHideSidebar component to check if the current route should hide the sidebar
  const ShouldHideSidebar = ({ children }) => {
    const location = useLocation();
    const lessonPageRegex = /^\/dashboard\/cursos\/[^/]+\/visualizar\/aulas(\/[^/]+)?$/;
    
    // Check if the current path matches our lesson page pattern
    const hideSidebar = lessonPageRegex.test(location.pathname);

    return hideSidebar ? (
      // Return just the main content without the sidebar
      <main className="flex-1 w-full">
        {children}
      </main>
    ) : (
      // Return the regular layout with sidebar
      <div className="flex min-h-screen w-full">
        <StudentSidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  };

  const AuthWrapper = ({ children, requiredRole }) => {
    if (!authChecked) {
      return null; // or loading spinner
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (requiredRole && userRole !== requiredRole) {
      return <Navigate to={getDashboardPath()} replace />;
    }

    return children;
  };

  // Only render routes after auth state is initialized
  if (!authChecked) {
    return null; // or loading spinner
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to={getDashboardPath()} replace />
              ) : (
                <Login 
                  onLoginSuccess={(token, role) => {
                    localStorage.setItem("token", token);
                    localStorage.setItem("userRole", role);
                    setIsAuthenticated(true);
                    setUserRole(role.toUpperCase());
                  }}
                />
              )
            }
          />
          <Route path="/registro" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          
          <Route
            path="/dashboard/*"
            element={
              <AuthWrapper requiredRole="ESTUDANTE">
                <SidebarProvider>
                  <ShouldHideSidebar>
                    <StudentRoutes />
                  </ShouldHideSidebar>
                </SidebarProvider>
              </AuthWrapper>
            }
          />
          
          <Route
            path="/admin/*"
            element={
              <AuthWrapper requiredRole="ADMIN">
                <SidebarProvider>
                  <div className="flex min-h-screen w-full">
                    <AdminSidebar />
                    <main className="flex-1">
                      <AdminRoutes />
                    </main>
                  </div>
                </SidebarProvider>
              </AuthWrapper>
            }
          />
          
          <Route
            path="/mentor/*"
            element={
              <AuthWrapper requiredRole="MENTOR">
                <SidebarProvider>
                  <div className="flex min-h-screen w-full">
                    <MentorSidebar />
                    <main className="flex-1">
                      <MentorRoutes />
                    </main>
                  </div>
                </SidebarProvider>
              </AuthWrapper>
            }
          />
          
          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? getDashboardPath() : "/login"} replace />} 
          />
        </Routes>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;