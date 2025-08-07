import { useEffect, useState } from "react";
import { HeroSection } from "@/components/progress/HeroSection";
import { RecentAchievements } from "@/components/progress/RecentAchievements";
import { LearningStats } from "@/components/progress/LearningStats";
import { XPChart } from "@/components/progress/XPChart";
import { RankingSection } from "@/components/progress/RankingSection";
import { UserStudentAPI } from "@/api/student/controllers/UserStudentAPI";
import { ExperienceEventStudentAPI } from "@/api/student/controllers/ExperienceEventStudentAPI";
import { StudentRankingResponseDTO } from "@/api/dtos/studentRankingDtos";
import { currentUser } from "@/data/mock";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PerformanceData {
  month: string;
  completed: number;
  xp: number;
}

const Progress = () => {
  const [classrooms, setClassrooms] = useState<StudentRankingResponseDTO[]>([]);
  const [selectedClassroomId, setSelectedClassroomId] = useState<string | null>(null);
  const [selectedRanking, setSelectedRanking] = useState<StudentRankingResponseDTO | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all classrooms and XP data for the last 6 months on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch classrooms
        const classroomResponse = await UserStudentAPI.getStudentRankingsForAllClassrooms();
        // Filter out classrooms with invalid classroomId
        const validClassrooms = classroomResponse.filter(
          (classroom) => classroom.classroomId && classroom.classroomId.trim() !== ""
        );
        setClassrooms(validClassrooms);
        if (validClassrooms.length > 0) {
          setSelectedClassroomId(validClassrooms[0].classroomId);
        }
      } catch (err) {
        setError("Falha ao carregar turmas");
        console.error(err);
      }

      try {
        // Fetch XP data for the last 6 months
        const months = getLastSixMonths();
        const xpDataPromises = months.map(async ({ year, month, monthName }) => {
          const xp = await ExperienceEventStudentAPI.getExperiencePerMonth(year, month);
          return { month: monthName, completed: 0, xp };
        });
        const xpData = await Promise.all(xpDataPromises);
        console.log(xpData)
        setPerformanceData(xpData);
      } catch (err) {
        setError("Falha ao carregar dados de XP");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch ranking for selected classroom
  useEffect(() => {
    const fetchRanking = async () => {
      if (!selectedClassroomId) return;
      setLoading(true);
      try {
        const response = await UserStudentAPI.getStudentRanking(selectedClassroomId);
        setSelectedRanking(response);
      } catch (err) {
        setError("Falha ao carregar ranking da turma selecionada");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [selectedClassroomId]);

  // Helper function to get the last 6 months with year, month, and month name
  const getLastSixMonths = () => {
    const months = [];
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        monthName: monthNames[date.getMonth()],
      });
    }
    return months;
  };

  const isUser = (userId: string) => userId === currentUser.id;

  return (
    <div className="container py-8 space-y-8 animate-fade-in">
      <HeroSection user={currentUser} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RecentAchievements />
        <LearningStats />
        <XPChart data={performanceData} />
      </div>

      <div className="space-y-2 max-w-md">
        <Label htmlFor="classroom-select" className="text-white">Selecionar Turma</Label>
        <Select
          value={selectedClassroomId ?? "none"}
          onValueChange={(value) => setSelectedClassroomId(value === "none" ? null : value)}
          disabled={loading || classrooms.length === 0}
        >
          <SelectTrigger id="classroom-select" className="bg-white/5 border-slate-800 text-white">
            <SelectValue placeholder="Selecione uma turma" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800">
            {classrooms.length === 0 ? (
              <SelectItem value="none" disabled className="text-white">
                Nenhuma turma disponível
              </SelectItem>
            ) : (
              classrooms.map((classroom) => (
                <SelectItem
                  key={classroom.classroomId}
                  value={classroom.classroomId}
                  className="text-white hover:bg-slate-800"
                >
                  {classroom.classroomName || `Turma ${classroom.classroomName}`}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {loading && <p>Carregando ranking...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && !selectedRanking && <p>Nenhum ranking disponível para a turma selecionada</p>}
      {!loading && !error && selectedRanking && (
        <RankingSection
          ranking={selectedRanking.ranking}
          isUser={isUser}
          title={`Ranking na turma`}
          description={`Sua posição: ${selectedRanking.yourPosition}`}
        />
      )}
    </div>
  );
};

export default Progress;