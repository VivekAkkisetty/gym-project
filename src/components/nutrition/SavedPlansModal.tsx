"use client";

import React, { useState } from "react";
import { FolderHeart, Check, Trash2, Bookmark } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DietPlan } from "@/lib/validations/nutrition";

interface SavedPlansModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savedPlans: DietPlan[];
  activePlanId: string;
  onSelectPlan: (plan: DietPlan) => void;
  onDeletePlan: (planId: string) => void;
  onSaveCurrentAsNew: (name: string) => void;
}

export function SavedPlansModal({
  open,
  onOpenChange,
  savedPlans,
  activePlanId,
  onSelectPlan,
  onDeletePlan,
  onSaveCurrentAsNew,
}: SavedPlansModalProps) {
  const [newPlanName, setNewPlanName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanName.trim()) {
      toast.error("Please enter a name for the plan");
      return;
    }
    onSaveCurrentAsNew(newPlanName.trim());
    setNewPlanName("");
    setIsSaving(false);
    toast.success("Diet plan snapshot saved to your history!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <FolderHeart className="h-5 w-5 text-emerald-500" />
            <span>Diet Plan History & Manager</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            Save custom macro distributions, switch between training days and rest days, or reload previous plans.
          </DialogDescription>
        </DialogHeader>

        {/* Save Current Plan as New Form */}
        <div className="p-3.5 rounded-xl bg-muted/50 border border-zinc-200 dark:border-zinc-800 my-2">
          {!isSaving ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-foreground">Save Active Blueprint</p>
                <p className="text-[11px] text-muted-foreground">Snapshot your current meal setup and macro targets</p>
              </div>
              <Button
                size="sm"
                onClick={() => setIsSaving(true)}
                className="gap-1.5 text-xs font-semibold"
              >
                <Bookmark className="h-3.5 w-3.5" />
                <span>Save Current Plan</span>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-3">
              <label htmlFor="planNameInput" className="text-xs font-bold text-foreground">
                Enter Plan Name
              </label>
              <div className="flex gap-2">
                <Input
                  id="planNameInput"
                  placeholder="e.g. Training Day High-Carb (2,400 kcal)"
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
                <Button type="submit" size="sm" className="h-9 text-xs">
                  Save
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSaving(false)}
                  className="h-9 text-xs"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Saved Plans List */}
        <div className="space-y-2 flex-1 overflow-y-auto pr-1 my-1">
          <span className="text-xs font-bold text-foreground">
            Saved Blueprints ({savedPlans.length})
          </span>

          {savedPlans.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">
              No saved diet plans yet. Click &apos;Save Current Plan&apos; above to archive your setup.
            </div>
          ) : (
            savedPlans.map((plan) => {
              const isActive = plan.id === activePlanId;

              return (
                <div
                  key={plan.id}
                  className={`p-3.5 rounded-xl border text-xs transition-all space-y-2 ${
                    isActive
                      ? "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/20 shadow-xs"
                      : "border-zinc-200 dark:border-zinc-800 bg-card hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-foreground">{plan.name}</p>
                        {isActive && (
                          <Badge variant="default" className="text-[10px] font-semibold">
                            Active
                          </Badge>
                        )}
                      </div>
                      {plan.description && (
                        <p className="text-[11px] text-muted-foreground mt-0.5">{plan.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {!isActive && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            onSelectPlan(plan);
                            onOpenChange(false);
                            toast.success(`Switched active plan to "${plan.name}"!`);
                          }}
                          className="h-7 text-xs font-semibold gap-1"
                        >
                          <Check className="h-3 w-3" />
                          <span>Load Plan</span>
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Delete Plan"
                        onClick={() => {
                          if (savedPlans.length <= 1) {
                            toast.error("You must have at least one diet plan.");
                            return;
                          }
                          onDeletePlan(plan.id);
                          toast.info("Deleted diet plan.");
                        }}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px]">
                    <span className="font-bold text-foreground">{plan.dailyCalories} kcal</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-emerald-500 font-semibold">{plan.targetProteinG}g Protein</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-cyan-500 font-semibold">{plan.targetCarbsG}g Carbs</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-amber-500 font-semibold">{plan.targetFatG}g Fat</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{plan.meals.length} meals</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
