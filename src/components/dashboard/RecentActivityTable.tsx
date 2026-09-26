import React from "react";
import { Utensils, Dumbbell, Droplets, Scale, Clock } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RecentLogItem } from "@/types/fitness";

interface RecentActivityTableProps {
  logs: RecentLogItem[];
}

export function RecentActivityTable({ logs }: RecentActivityTableProps) {
  const getIcon = (type: RecentLogItem["type"]) => {
    switch (type) {
      case "food":
        return <Utensils className="h-4 w-4 text-emerald-500" />;
      case "workout":
        return <Dumbbell className="h-4 w-4 text-cyan-500" />;
      case "water":
        return <Droplets className="h-4 w-4 text-blue-500" />;
      case "weight":
        return <Scale className="h-4 w-4 text-amber-500" />;
    }
  };

  const getBadgeVariant = (type: RecentLogItem["type"]) => {
    switch (type) {
      case "food":
        return "default";
      case "workout":
        return "cyan";
      case "water":
        return "secondary";
      case "weight":
        return "amber";
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Type</TableHead>
            <TableHead>Activity</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-right">Logged Metric</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted">
                    {getIcon(log.type)}
                  </div>
                  <Badge variant={getBadgeVariant(log.type)} className="capitalize text-[11px]">
                    {log.type}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground text-sm">
                    {log.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {log.subtitle}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{log.time}</span>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium text-foreground text-sm">
                {log.metric}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
