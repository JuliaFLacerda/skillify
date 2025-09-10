import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Flame, Trophy } from "lucide-react";
import { UserStudentAPI } from "@/api/student/controllers/UserStudentAPI";
import { ExperienceEventStudentAPI } from "@/api/student/controllers/ExperienceEventStudentAPI";
import { GoalExecutionStudentAPI } from "@/api/student/controllers/GoalExecutionStudentAPI";
import { LevelProgressResponseDTO } from "@/api/dtos/levelProgressDtos";
import { User } from "@/types";

interface HeroSectionProps {
  user: User;
}

export const HeroSection = ({ user }: HeroSectionProps) => {
  const [levelProgress, setLevelProgress] = useState<LevelProgressResponseDTO | null>(null);
  const [streakDays, setStreakDays] = useState<number>(0);
  const [uniqueGoalsCount, setUniqueGoalsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch level progress
        const progress = await UserStudentAPI.getLevelProgress();
        setLevelProgress(progress);

        // Fetch streak
        const streak = await ExperienceEventStudentAPI.getExperienceEventStreak();
        setStreakDays(streak);

        // Fetch goal executions and count unique goals
        const goalExecutions = await GoalExecutionStudentAPI.getAllGoalExecutions();
        const uniqueGoalIds = new Set(goalExecutions.map((execution) => execution.goal.id));
        setUniqueGoalsCount(uniqueGoalIds.size);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Falha ao carregar dados do progresso");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateLevelThreshold = (level: number): number => {
    if (level < 1) return 0;
    return 100 * level * level;
  };

  const calculateRelativeXp = (currentXp: number, currentLevel: number): number => {
    const currentThreshold = calculateLevelThreshold(currentLevel);
    return Math.max(0, currentXp - currentThreshold);
  };

  const calculateProgressPercentage = (relativeXp: number, xpToNextLevel: number): number => {
    if (xpToNextLevel === 0) return 0;
    return Math.min((relativeXp / xpToNextLevel) * 100, 100);
  };

  const nextLevel = levelProgress ? levelProgress.currentLevel + 1 : 1;
  const xpForNextLevel = levelProgress ? levelProgress.xpToNextLevel : 1000;
  const relativeXp = levelProgress ? calculateRelativeXp(levelProgress.currentXp, levelProgress.currentLevel) : 0;
  const xpProgress = levelProgress ? calculateProgressPercentage(relativeXp, xpForNextLevel) : 0;

  return (
    <div className="bg-gradient-to-r from-primary-100 to-primary-200 rounded-lg p-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="text-center md:text-left">
        {loading ? (
          <p className="text-xl text-primary-700">Carregando progresso...</p>
        ) : error ? (
          <p className="text-xl text-red-500">{error}</p>
        ) : (
          <>
            <h1 className="text-3xl font-bold">Nível {levelProgress?.currentLevel || 0}</h1>
            <p className="text-xl text-primary-700">
              {levelProgress?.currentXp || 0} XP • {xpForNextLevel - relativeXp} XP para o próximo nível
            </p>
            <Progress value={xpProgress} className="h-3 mt-4 w-full md:w-64" />
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="bg-white p-4 rounded-full">
            <Flame className="w-8 h-8 text-orange-500" />
          </div>
          <p className="mt-2 font-semibold">{streakDays} dias</p>
          <p className="text-sm text-primary-700">Sequência</p>
        </div>
        <div className="text-center">
          <div className="bg-white p-4 rounded-full">
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="mt-2 font-semibold">{uniqueGoalsCount}</p>
          <p className="text-sm text-primary-700">Desafios</p>
        </div>
      </div>
    </div>
  );
};