"use client";

import React, { useState, useMemo } from "react";
import {
  ShoppingCart,
  Copy,
  ListChecks,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DietPlan } from "@/lib/validations/nutrition";
import { ShoppingListItem } from "@/types/ai";
import {
  generateShoppingList,
  saveCheckedItemState,
  getStoredCheckedItems,
  formatShoppingListForClipboard,
} from "@/lib/ai/shopping-list";

interface ShoppingListTabProps {
  activePlan: DietPlan;
}

export function ShoppingListTab({ activePlan }: ShoppingListTabProps) {
  const [daysMultiplier, setDaysMultiplier] = useState<number>(7);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(() => getStoredCheckedItems());

  const rawList = useMemo(
    () => generateShoppingList(activePlan, daysMultiplier),
    [activePlan, daysMultiplier]
  );

  const items = useMemo(
    () => rawList.map((item) => ({ ...item, checked: checkedIds.has(item.id) })),
    [rawList, checkedIds]
  );

  const handleToggleCheck = (id: string, currentState: boolean) => {
    const newState = !currentState;
    saveCheckedItemState(id, newState);
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (newState) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleCopyClipboard = () => {
    const text = formatShoppingListForClipboard(items);
    navigator.clipboard.writeText(text);
    toast.success("Grocery list copied to clipboard!");
  };

  const handleResetChecklist = () => {
    items.forEach((i) => saveCheckedItemState(i.id, false));
    setCheckedIds(new Set());
    toast.info("Shopping checklist reset.");
  };


  // Group by aisle
  const grouped: Record<string, ShoppingListItem[]> = {};
  for (const item of items) {
    if (!grouped[item.aisle]) grouped[item.aisle] = [];
    grouped[item.aisle].push(item);
  }

  const completedCount = items.filter((i) => i.checked).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Control Banner */}
      <Card className="border-border">
        <CardHeader className="py-4 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-emerald-500" />
              <CardTitle className="text-sm font-bold">Smart Grocery Shopping List</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Consolidated ingredients aggregated across all meals in <strong>{activePlan.name}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={daysMultiplier}
              onChange={(e) => setDaysMultiplier(parseInt(e.target.value))}
              className="h-8 rounded-md border border-input bg-background px-2.5 text-xs font-semibold"
            >
              <option value="3">3-Day Prep</option>
              <option value="5">5-Day Work Week</option>
              <option value="7">7-Day Full Week</option>
              <option value="14">14-Day Bulk Buy</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyClipboard}
              className="h-8 text-xs gap-1.5"
            >
              <Copy className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Copy</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleResetChecklist}
              className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
              title="Reset Checks"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardHeader>

        {/* Progress Bar */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <ListChecks className="h-3.5 w-3.5 text-emerald-500" />
              <span>Cart Progress</span>
            </span>
            <span className="font-mono font-semibold text-emerald-500">
              {completedCount} of {items.length} items ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Aisle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(grouped).map(([aisle, aisleItems]) => (
          <Card key={aisle} className="border-border">
            <CardHeader className="py-2.5 px-4 bg-muted/40 border-b border-border flex flex-row items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                {aisle}
              </span>
              <Badge variant="outline" className="text-[10px] font-mono">
                {aisleItems.length} items
              </Badge>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border/40">
              {aisleItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleCheck(item.id, item.checked)}
                  className={`flex items-center justify-between px-4 py-2.5 text-xs cursor-pointer hover:bg-muted/30 transition-colors ${
                    item.checked ? "bg-muted/20 text-muted-foreground line-through" : ""
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => {}} // Controlled by row div onClick
                      className="rounded accent-emerald-500 cursor-pointer h-4 w-4"
                    />
                    <span className={`font-medium ${item.checked ? "text-muted-foreground" : "text-foreground"}`}>
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-semibold text-emerald-400">
                      {item.totalQuantity} {item.unit}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
