import { Routes, Route, Navigate } from "react-router-dom";
import StudentDashboard from "@/pages/student/Dashboard";
import Courses from "@/pages/student/Courses";
import Progress from "@/pages/student/Progress";
import Settings from "@/pages/student/Settings";
import Challenges from "@/pages/student/Challenges";
import Mentoring from "@/pages/student/Mentoring";
import ScheduleMentoring from "@/pages/student/ScheduleMentoring";
import LiveClass from "@/pages/student/LiveClass";
import CourseDetails from "@/pages/student/CourseDetails";
import CourseLessons from "@/pages/student/CourseLessons";
import Essays from "@/pages/student/Essays";
import EssayEditor from "@/pages/student/EssayEditor";
import EssayCorrection from "@/pages/student/EssayCorrection";
import NewEssay from "@/pages/student/NewEssay";
import MockExams from "@/pages/student/MockExams";
import ExamPage from "@/pages/student/ExamPage";
import ExamResults from "@/pages/student/ExamResults";
import NewExam from "@/pages/student/NewExam";
import ViewAllLessons from "@/pages/student/ViewAllLessons";
import PlanDetails from "@/pages/student/PlanDetails";
import ContinueChallenge from "@/pages/student/ContinueChallenge";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import StudentMessages from "@/pages/student/Messages";
import CourseLessonPage from "@/pages/student/CourseLessonPage";

export const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="cursos" element={<Courses />} />
      <Route path="cursos/:id" element={<CourseDetails />} />
      <Route path="cursos/:id/aulas" element={<CourseLessons />} />
      <Route path="cursos/:id/todas-aulas" element={<ViewAllLessons />} />
      <Route path="aula-ao-vivo" element={<LiveClass />} />
      <Route path="progresso" element={<Progress />} />
      <Route path="desafios" element={<Challenges />} />
      <Route path="desafios/:id" element={<ContinueChallenge />} />
      <Route path="mentoria" element={<Mentoring />} />
      <Route path="mentoria/agendar/:id" element={<ScheduleMentoring />} />
      <Route path="redacoes" element={<Essays />} />
      <Route path="redacoes/nova" element={<NewEssay />} />
      <Route path="redacoes/editor/:id" element={<EssayEditor />} />
      <Route path="redacoes/correcao/:id" element={<EssayCorrection />} />
      <Route path="simulados" element={<MockExams />} />
      <Route path="simulados/novo" element={<NewExam />} />
      <Route path="simulados/prova/:id" element={<ExamPage />} />
      <Route path="simulados/resultado/:id" element={<ExamResults />} />
      <Route path="configuracoes" element={<Settings />} />
      <Route path="planos/:id" element={<PlanDetails />} />
      <Route path="mensagens" element={<StudentMessages />} />
      <Route path="/cursos/:courseId/visualizar/aulas/:lessonId?" element={<CourseLessonPage />} />
    </Routes>
  );
};