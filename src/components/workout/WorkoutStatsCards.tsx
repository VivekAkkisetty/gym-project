"use client";

import React from "react";
import { Dumbbell, Trophy, Flame, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WorkoutStatsCardsProps {
  weeklyCount: number;
  totalVolumeKg: number;
  personalRecordsCount: number;
  totalDurationMinutes: number;
}

export function WorkoutStatsCards({
  weeklyCount,
  totalVolumeKg,
  personalRecordsCount,
  totalDurationMinutes,
}: WorkoutStatsCardsProps) {
  const stats = [
    {
      label: "Workouts (Last 7 Days)",
      value: `${weeklyCount}`,
      subtext: weeklyCount >= 4 ? "Optimal training frequency" : "Aim for 3-4 sessions",
      icon: Dumbbell,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Weekly Volume",
      value: `${(totalVolumeKg / 1000).toFixed(1)}k kg`,
      subtext: `${totalVolumeKg.toLocaleString()} kg total load`,
      icon: Flame,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Personal Records",
      value: `${personalRecordsCount}`,
      subtext: "Overload milestones hit",
      icon: Trophy,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Active Training Time",
      value: `${totalDurationMinutes}m`,
      subtext: `~${Math.round(totalDurationMinutes / Math.max(1, weeklyCount))} min / session`,
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <Card key={idx} className="border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
                <p className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
                  {stat.value}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{stat.subtext}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${stat.bgColor} ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
