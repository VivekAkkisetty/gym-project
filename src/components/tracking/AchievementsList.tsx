"use client";

import React from "react";
import { Trophy, Flame, Dumbbell, Footprints, Target, Droplets, Calendar, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AchievementItem } from "@/types/tracking";

interface AchievementsListProps {
  achievements: AchievementItem[];
}

const iconMap = {
  Flame,
  Trophy,
  Footprints,
  Droplets,
  Dumbbell,
  Target,
  Calendar,
};

export function AchievementsList({ achievements }: AchievementsListProps) {
  const unlockedCount = achievements.filter((a) => a.unlockedAt !== null).length;

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-purple-500" />
            <CardTitle className="text-base font-bold">Consistency Milestones & Badges</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs font-mono text-purple-500 border-purple-500/30">
            {unlockedCount} of {achievements.length} Unlocked
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {achievements.map((ach) => {
            const Icon = iconMap[ach.iconName] || Trophy;
            const isUnlocked = ach.unlockedAt !== null;

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2.5 transition-all ${
                  isUnlocked
                    ? "bg-purple-500/10 border-purple-500/30 shadow-xs"
                    : "bg-muted/20 border-border opacity-75"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isUnlocked
                          ? "bg-purple-600 text-white shadow-xs"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-foreground">{ach.title}</h4>
                      <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                        {ach.description}
                      </p>
                    </div>
                  </div>

                  {isUnlocked && (
                    <CheckCircle2 className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                  )}
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>
                      {ach.metricCurrent.toLocaleString()} / {ach.metricTarget.toLocaleString()} {ach.unit}
                    </span>
                    <span className="font-bold font-mono text-foreground">{ach.progressPercent}%</span>
                  </div>
                  <Progress
                    value={ach.progressPercent}
                    className="h-1.5"
                    indicatorClassName={isUnlocked ? "bg-purple-500" : "bg-zinc-600"}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
