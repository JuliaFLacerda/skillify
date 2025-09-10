import { Route, Routes, Navigate } from "react-router-dom"
import AdminDashboard from "@/pages/admin/Dashboard"
import AdminMentors from "@/pages/admin/Mentors"
import AdminCourses from "@/pages/admin/Courses"
import AdminStudents from "@/pages/admin/Students"
import AdminClasses from "@/pages/admin/Classes"
import AdminPlans from "@/pages/admin/Plans"
import Settings from "@/pages/admin/Settings"

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="mentores" element={<AdminMentors />} />
      <Route path="cursos" element={<AdminCourses />} />
      <Route path="alunos" element={<AdminStudents />} />
      <Route path="turmas" element={<AdminClasses />} />
      <Route path="planos" element={<AdminPlans />} />
      <Route path="configuracoes" element={<Settings />} />
    </Routes>
  )
}