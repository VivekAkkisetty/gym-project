"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Shield,
  Activity,
  Save,
  Lock,
  AlertTriangle,
  Trash2,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/AuthProvider";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Personal Info Form State
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "prefer_not_to_say">("male");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [activityLevel, setActivityLevel] = useState<"sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extra_active">("moderately_active");
  const [fitnessGoal, setFitnessGoal] = useState<"cut_fat" | "maintain_weight" | "lean_bulk" | "build_muscle" | "endurance" | "general_health">("build_muscle");

  // Preferences State
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
  const [calorieTarget, setCalorieTarget] = useState("2400");
  const [proteinTarget, setProteinTarget] = useState("160");
  const [carbsTarget, setCarbsTarget] = useState("240");
  const [fatTarget, setFatTarget] = useState("65");
  const [waterTarget, setWaterTarget] = useState("3000");
  const [stepTarget, setStepTarget] = useState("10000");

  // Security Form State
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Danger Zone State
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isPurgingData, setIsPurgingData] = useState(false);

  // Load real profile and preferences on mount
  useEffect(() => {
    if (!user) return;
    const supabase = createClient();

    async function loadData() {
      try {
        setIsLoading(true);
        const [profRes, prefRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle(),
          supabase.from("user_preferences").select("*").eq("user_id", user!.id).maybeSingle(),
        ]);

        if (profRes.data) {
          const p = profRes.data;
          setFullName(p.full_name || user!.user_metadata?.full_name || "");
          if (p.gender) setGender(p.gender);
          setHeightCm(p.height_cm ? String(p.height_cm) : "");
          setWeightKg(p.weight_kg ? String(p.weight_kg) : "");
          if (p.activity_level) setActivityLevel(p.activity_level);
          if (p.fitness_goal) setFitnessGoal(p.fitness_goal);
        } else {
          setFullName(user!.user_metadata?.full_name || "");
        }

        if (prefRes.data) {
          const pref = prefRes.data;
          if (pref.unit_system) setUnitSystem(pref.unit_system);
          if (pref.calorie_target) setCalorieTarget(String(pref.calorie_target));
          if (pref.protein_target_g) setProteinTarget(String(pref.protein_target_g));
          if (pref.carbs_target_g) setCarbsTarget(String(pref.carbs_target_g));
          if (pref.fat_target_g) setFatTarget(String(pref.fat_target_g));
          if (pref.water_target_ml) setWaterTarget(String(pref.water_target_ml));
          if (pref.step_target) setStepTarget(String(pref.step_target));
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: fullName.trim(),
        gender,
        height_cm: heightCm ? parseFloat(heightCm) : null,
        weight_kg: weightKg ? parseFloat(weightKg) : null,
        activity_level: activityLevel,
        fitness_goal: fitnessGoal,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      toast.success("Profile details updated successfully!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("user_preferences").upsert(
        {
          user_id: user.id,
          unit_system: unitSystem,
          calorie_target: parseInt(calorieTarget) || 2000,
          protein_target_g: parseInt(proteinTarget) || 150,
          carbs_target_g: parseInt(carbsTarget) || 200,
          fat_target_g: parseInt(fatTarget) || 60,
          water_target_ml: parseInt(waterTarget) || 3000,
          step_target: parseInt(stepTarget) || 10000,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

      if (error) throw error;
      toast.success("Daily targets and preferences saved!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setIsSaving(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setNewPassword("");
      setConfirmNewPassword("");
      toast.success("Password updated successfully!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePurgeData = async () => {
    if (!window.confirm("Are you sure you want to purge all your tracking records, workouts, and progress photos? This action cannot be undone.")) {
      return;
    }

    try {
      setIsPurgingData(true);
      const res = await fetch("/api/account/purge", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to purge data");
      toast.success(data.message || "All personal tracking data purged successfully.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error purging data");
    } finally {
      setIsPurgingData(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationInput !== "DELETE") {
      toast.error('Please type "DELETE" to confirm permanent account deletion.');
      return;
    }

    try {
      setIsDeletingAccount(true);
      const res = await fetch("/api/account/delete", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete account");
      toast.success("Account deleted. Signing out...");
      await signOut?.();
      router.push("/login?deleted=true");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error deleting account");
      setIsDeletingAccount(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
        <div className="h-44 rounded-2xl bg-muted/60" />
        <div className="h-10 w-64 rounded-lg bg-muted/60" />
        <div className="h-72 rounded-2xl bg-muted/40" />
      </div>
    );
  }

  const userInitial = fullName ? fullName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || "A";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Profile Header Card */}
      <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800">
        <div className="h-28 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 relative" />
        <CardContent className="relative px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-12 sm:-mt-14 gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-zinc-900 border-4 border-background text-3xl font-black text-white shadow-xl">
                {userInitial}
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl font-bold text-foreground">
                    {fullName || user?.user_metadata?.full_name || "Athlete Profile"}
                  </h2>
                  <Badge variant="outline" className="text-[11px] border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
                    Active Account
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {user?.email || "athlete@apexfit.local"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Cloud Synced</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="general" className="gap-2">
            <User className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="targets" className="gap-2">
            <Activity className="h-4 w-4" />
            <span>Targets</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        {/* General Profile Tab */}
        <TabsContent value="general" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information & Physical Stats</CardTitle>
              <CardDescription>
                Calibrate automated calorie and macro formulas using your physical baseline.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="profFullName">Full Name</Label>
                    <Input
                      id="profFullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="mt-1.5"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="genderSelect">Gender</Label>
                    <select
                      id="genderSelect"
                      value={gender}
                      onChange={(e) => setGender(e.target.value as "male" | "female" | "other" | "prefer_not_to_say")}
                      className="mt-1.5 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="heightInput">Height (cm)</Label>
                    <Input
                      id="heightInput"
                      type="number"
                      placeholder="e.g. 178"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weightInput">Current Weight (kg)</Label>
                    <Input
                      id="weightInput"
                      type="number"
                      step="0.1"
                      placeholder="e.g. 75.0"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="activitySelect">Activity Level</Label>
                    <select
                      id="activitySelect"
                      value={activityLevel}
                      onChange={(e) => setActivityLevel(e.target.value as "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extra_active")}
                      className="mt-1.5 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      <option value="sedentary">Sedentary (Desk job, minimal exercise)</option>
                      <option value="lightly_active">Lightly Active (1-3 sessions/week)</option>
                      <option value="moderately_active">Moderately Active (3-5 sessions/week)</option>
                      <option value="very_active">Very Active (6-7 sessions/week)</option>
                      <option value="extra_active">Extra Active (Athlete / Physical job)</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="fitnessGoalSelect">Primary Fitness Goal</Label>
                    <select
                      id="fitnessGoalSelect"
                      value={fitnessGoal}
                      onChange={(e) => setFitnessGoal(e.target.value as "cut_fat" | "maintain_weight" | "lean_bulk" | "build_muscle" | "endurance" | "general_health")}
                      className="mt-1.5 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      <option value="cut_fat">Cut Body Fat (Caloric Deficit)</option>
                      <option value="maintenance">Maintain Weight & Recomposition</option>
                      <option value="build_muscle">Hypertrophy & Muscle Gain</option>
                      <option value="strength">Strength & Powerlifting</option>
                      <option value="endurance">Endurance & Conditioning</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={isSaving} className="gap-2">
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {isSaving ? "Saving..." : "Save Profile Details"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Targets & Nutrition Tab */}
        <TabsContent value="targets" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Targets & Unit Preference</CardTitle>
              <CardDescription>
                Define baseline caloric and macronutrient targets used across dashboard rings and tracking.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSavePreferences} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="unitSystemSelect">Preferred Unit System</Label>
                    <select
                      id="unitSystemSelect"
                      value={unitSystem}
                      onChange={(e) => setUnitSystem(e.target.value as "metric" | "imperial")}
                      className="mt-1.5 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      <option value="metric">Metric (kg, cm, ml)</option>
                      <option value="imperial">Imperial (lbs, in, oz)</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="calorieTarget">Daily Calorie Target (kcal)</Label>
                    <Input
                      id="calorieTarget"
                      type="number"
                      value={calorieTarget}
                      onChange={(e) => setCalorieTarget(e.target.value)}
                      className="mt-1.5"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="proteinTarget">Protein Goal (g)</Label>
                    <Input
                      id="proteinTarget"
                      type="number"
                      value={proteinTarget}
                      onChange={(e) => setProteinTarget(e.target.value)}
                      className="mt-1.5"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="carbsTarget">Carbohydrates Goal (g)</Label>
                    <Input
                      id="carbsTarget"
                      type="number"
                      value={carbsTarget}
                      onChange={(e) => setCarbsTarget(e.target.value)}
                      className="mt-1.5"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="fatTarget">Healthy Fats Goal (g)</Label>
                    <Input
                      id="fatTarget"
                      type="number"
                      value={fatTarget}
                      onChange={(e) => setFatTarget(e.target.value)}
                      className="mt-1.5"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="waterTarget">Daily Hydration Target (ml)</Label>
                    <Input
                      id="waterTarget"
                      type="number"
                      value={waterTarget}
                      onChange={(e) => setWaterTarget(e.target.value)}
                      className="mt-1.5"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="stepTarget">Daily Step Target</Label>
                    <Input
                      id="stepTarget"
                      type="number"
                      value={stepTarget}
                      onChange={(e) => setStepTarget(e.target.value)}
                      className="mt-1.5"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={isSaving} className="gap-2">
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {isSaving ? "Saving..." : "Save Daily Targets"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Security & Password</CardTitle>
              <CardDescription>
                Update your login credentials securely managed via Supabase Auth.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                <div>
                  <Label htmlFor="newPass">New Password</Label>
                  <Input
                    id="newPass"
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1.5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmNewPass">Confirm New Password</Label>
                  <Input
                    id="confirmNewPass"
                    type="password"
                    placeholder="Re-type new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="mt-1.5"
                    required
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" disabled={isSaving} className="gap-2">
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                    {isSaving ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Danger Zone Card */}
          <Card className="border-red-500/30 bg-red-950/10 mt-6">
            <CardHeader>
              <div className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="h-5 w-5" />
                <CardTitle className="text-red-500">Danger Zone</CardTitle>
              </div>
              <CardDescription>
                Irreversible data purging and permanent account deletion under GDPR & CCPA privacy standards.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Purge Fitness Logs */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-red-500/20 bg-background/50">
                <div>
                  <h4 className="font-semibold text-foreground text-sm">Purge Fitness & Tracking Logs</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 max-w-md">
                    Permanently wipe all logged daily tracking data, body measurements, workout sessions, and private progress photos. Your profile and account credentials remain active.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handlePurgeData}
                  disabled={isPurgingData}
                  className="border-red-500/40 text-red-500 hover:bg-red-500/10 shrink-0 gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isPurgingData ? "animate-spin" : ""}`} />
                  {isPurgingData ? "Purging..." : "Purge Tracking Data"}
                </Button>
              </div>

              {/* Delete Account */}
              <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 space-y-3">
                <div className="flex items-center gap-2 text-red-500">
                  <Trash2 className="h-4 w-4" />
                  <h4 className="font-semibold text-sm">Delete Account Permanently</h4>
                </div>
                <p className="text-xs text-muted-foreground">
                  Permanently deletes your account, authentication identity, custom diet plans, workout routines, tracking records, and storage assets. This action is instantaneous and cannot be reversed.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <Input
                    placeholder='Type "DELETE" to confirm'
                    value={deleteConfirmationInput}
                    onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                    className="max-w-xs border-red-500/30 focus-visible:ring-red-500"
                  />
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmationInput !== "DELETE" || isDeletingAccount}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isDeletingAccount ? "Deleting Account..." : "Delete My Account"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
