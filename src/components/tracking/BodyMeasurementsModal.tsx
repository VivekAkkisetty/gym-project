"use client";

import React, { useState } from "react";
import { Ruler, Scale, Check, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BodyMeasurements } from "@/types/tracking";
import { bodyMeasurementsSchema } from "@/lib/validations/tracking";

interface BodyMeasurementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (measurement: BodyMeasurements) => void;
  latestWeight?: number;
}

export function BodyMeasurementsModal({
  isOpen,
  onClose,
  onSave,
  latestWeight = 80,
}: BodyMeasurementsModalProps) {
  const [recordedDate, setRecordedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [weightKg, setWeightKg] = useState(latestWeight.toString());
  const [bodyFat, setBodyFat] = useState("");
  const [waist, setWaist] = useState("");
  const [chest, setChest] = useState("");
  const [arms, setArms] = useState("");
  const [thighs, setThighs] = useState("");
  const [hips, setHips] = useState("");
  const [neck, setNeck] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload: BodyMeasurements = {
        id: `meas-${Date.now()}`,
        recordedDate,
        weightKg: parseFloat(weightKg),
        bodyFatPercentage: bodyFat ? parseFloat(bodyFat) : null,
        waistCm: waist ? parseFloat(waist) : null,
        chestCm: chest ? parseFloat(chest) : null,
        armsCm: arms ? parseFloat(arms) : null,
        thighsCm: thighs ? parseFloat(thighs) : null,
        hipsCm: hips ? parseFloat(hips) : null,
        neckCm: neck ? parseFloat(neck) : null,
        photoUrls: [],
        notes,
      };

      const validated = bodyMeasurementsSchema.parse(payload);
      onSave(validated);
      toast.success("Progress check-in recorded successfully!");
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Failed to validate check-in data.");
      } else {
        toast.error("Failed to validate check-in data.");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-500 mb-1">
            <Ruler className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Progress Check-In</span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            Record Weight & Circumferences
          </DialogTitle>
          <DialogDescription>
            Log your latest scale weight and tape measurements to monitor body composition and hypertrophy changes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs sm:text-sm">
          {/* Date & Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="checkinDate" className="flex items-center gap-1.5 font-semibold">
                <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                <span>Check-in Date</span>
              </Label>
              <Input
                id="checkinDate"
                type="date"
                value={recordedDate}
                onChange={(e) => setRecordedDate(e.target.value)}
                required
                className="bg-card"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="checkinWeight" className="flex items-center gap-1.5 font-semibold">
                <Scale className="h-3.5 w-3.5 text-emerald-500" />
                <span>Body Weight (kg)</span>
              </Label>
              <Input
                id="checkinWeight"
                type="number"
                step="0.1"
                min="25"
                max="400"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                required
                placeholder="80.0"
                className="bg-card font-bold"
              />
            </div>
          </div>

          {/* Body Fat & Waist */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="checkinBf">Body Fat (%)</Label>
              <Input
                id="checkinBf"
                type="number"
                step="0.1"
                min="3"
                max="65"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                placeholder="15.0"
                className="bg-card"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="checkinWaist">Waist (cm)</Label>
              <Input
                id="checkinWaist"
                type="number"
                step="0.5"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                placeholder="81.5"
                className="bg-card"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="checkinChest">Chest (cm)</Label>
              <Input
                id="checkinChest"
                type="number"
                step="0.5"
                value={chest}
                onChange={(e) => setChest(e.target.value)}
                placeholder="106.0"
                className="bg-card"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="checkinArms">Arms / Biceps (cm)</Label>
              <Input
                id="checkinArms"
                type="number"
                step="0.5"
                value={arms}
                onChange={(e) => setArms(e.target.value)}
                placeholder="41.0"
                className="bg-card"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="checkinThighs">Thighs (cm)</Label>
              <Input
                id="checkinThighs"
                type="number"
                step="0.5"
                value={thighs}
                onChange={(e) => setThighs(e.target.value)}
                placeholder="62.0"
                className="bg-card"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="checkinNeck">Neck (cm)</Label>
              <Input
                id="checkinNeck"
                type="number"
                step="0.5"
                value={neck}
                onChange={(e) => setNeck(e.target.value)}
                placeholder="38.5"
                className="bg-card"
              />
            </div>

            <div className="space-y-1 col-span-2 sm:col-span-1">
              <Label htmlFor="checkinHips">Hips (cm)</Label>
              <Input
                id="checkinHips"
                type="number"
                step="0.5"
                value={hips}
                onChange={(e) => setHips(e.target.value)}
                placeholder="99.0"
                className="bg-card"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <Label htmlFor="checkinNotes">Notes / Observations</Label>
            <textarea
              id="checkinNotes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g., Morning weigh-in after fasted state, visibly sharper midsection..."
              className="w-full text-xs p-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full py-6 font-bold text-base bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-md"
          >
            <Check className="h-5 w-5" />
            <span>Save Progress Check-in</span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
