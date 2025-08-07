import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { StatsCards } from "@/components/dashboard/StatsCards"
import { UpdatesMural } from "@/components/UpdatesMural"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { ActiveCourses } from "@/components/dashboard/ActiveCourses"

export default function Dashboard() {
  return (
    <div className="container py-8 space-y-8 animate-fadeIn">
      <DashboardHeader />
      <StatsCards />
      <UpdatesMural />
      <QuickActions />
      <ActiveCourses />
    </div>
  )
}