import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { StudentRankingPositionDTO } from "@/api/dtos/studentRankingDtos";

interface RankingSectionProps {
  ranking: StudentRankingPositionDTO[];
  isUser: (userId: string) => boolean;
  title?: string;
  description?: string;
}

export const RankingSection = ({ ranking, isUser, title = "Ranking Global", description = "Sua posição entre todos os alunos" }: RankingSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ranking.map((user) => (
            <div
              key={user.userId}
              className={cn(
                "flex items-center gap-4 p-4 rounded-lg",
                isUser(user.userId) ? "bg-primary-50" : "hover:bg-gray-50"
              )}
            >
              <span className="font-bold w-8">{user.position}º</span>
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={user.userName}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p className="font-medium">{user.userName}</p>
                <p className="text-sm text-muted-foreground">{user.xpAmount} XP</p>
              </div>
              {user.position <= 3 && (
                <Trophy
                  className={cn(
                    "w-6 h-6",
                    user.position === 1
                      ? "text-yellow-500"
                      : user.position === 2
                      ? "text-gray-400"
                      : "text-orange-500"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};