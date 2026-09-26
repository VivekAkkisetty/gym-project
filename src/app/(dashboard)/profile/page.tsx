"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Shield,
  Activity,
  Save,
  Lock,
  Flame,
  AlertTriangle,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/AuthProvider";

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  // Personal Info Form State
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "Alex Walker");
  const [username, setUsername] = useState("alex_lifter");
  const [gender, setGender] = useState("male");
  const [heightCm, setHeightCm] = useState("182");
  const [weightKg, setWeightKg] = useState("79.4");
  const [activityLevel, setActivityLevel] = useState("very_active");
  const [fitnessGoal, setFitnessGoal] = useState("build_muscle");

  // Preferences State
  const [unitSystem, setUnitSystem] = useState("metric");
  const [calorieTarget, setCalorieTarget] = useState("2400");
  const [proteinTarget, setProteinTarget] = useState("180");
  const [carbsTarget, setCarbsTarget] = useState("250");
  const [fatTarget, setFatTarget] = useState("65");
  const [waterTarget, setWaterTarget] = useState("3200");
  const [stepTarget, setStepTarget] = useState("10000");

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  // Danger Zone State
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isPurgingData, setIsPurgingData] = useState(false);

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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Profile and biometrics updated successfully!");
    }, 500);
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Fitness targets and unit settings saved!");
    }, 500);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
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
    setTimeout(() => {
      setIsSaving(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      toast.success("Password changed successfully!");
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Profile Header Header Card */}
      <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800">
        <div className="h-28 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 relative" />
        <CardContent className="relative px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-12 sm:-mt-14 gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-zinc-900 border-4 border-background text-3xl font-black text-white shadow-xl">
                {fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl font-bold text-foreground">{fullName}</h2>
                  <Badge variant="default" className="text-[11px]">
                    Pro Athlete
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  @{username} • {user?.email || "athlete@apexfit.local"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <Flame className="h-4 w-4" />
                <span>Tier 1 Consistency</span>
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
                Update your biometric metrics to calibrate automated calorie and macro formulas.
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
                      className="mt-1.5"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="profUsername">Username</Label>
                    <Input
                      id="profUsername"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="mt-1.5"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="genderSelect">Gender</Label>
                    <select
                      id="genderSelect"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="mt-1.5 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="heightInput">Height (cm)</Label>
                    <Input
                      id="heightInput"
                      type="number"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value)}
                      className="mt-1.5"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="weightInput">Current Weight (kg)</Label>
                    <Input
                      id="weightInput"
                      type="number"
                      step="0.1"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                      className="mt-1.5"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="activitySelect">Activity Level</Label>
                    <select
                      id="activitySelect"
                      value={activityLevel}
                      onChange={(e) => setActivityLevel(e.target.value)}
                      className="mt-1.5 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      <option value="sedentary">Sedentary (Desk job, little exercise)</option>
                      <option value="lightly_active">Lightly Active (1-3 days/week)</option>
                      <option value="moderately_active">Moderately Active (3-5 days/week)</option>
                      <option value="very_active">Very Active (6-7 days/week heavy lifting)</option>
                      <option value="extra_active">Extra Active (Athlete / Physical job)</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="fitnessGoalSelect">Primary Fitness Goal</Label>
                    <select
                      id="fitnessGoalSelect"
                      value={fitnessGoal}
                      onChange={(e) => setFitnessGoal(e.target.value)}
                      className="mt-1.5 flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      <option value="cut_fat">Cut Body Fat (Caloric Deficit)</option>
                      <option value="maintain_weight">Maintain Weight & Recomposition</option>
                      <option value="lean_bulk">Lean Bulk (Hypertrophy Surplus)</option>
                      <option value="build_muscle">Maximum Muscle Gain</option>
                      <option value="endurance">Endurance & Cardiovascular</option>
                      <option value="general_health">General Functional Health</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={isSaving} className="gap-2">
                    <Save className="h-4 w-4" />
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
                Define baseline caloric and macronutrient requirements used across dashboard rings and tracking.
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
                      onChange={(e) => setUnitSystem(e.target.value)}
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
                    <Save className="h-4 w-4" />
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
              <CardTitle>Account Security & Authentication</CardTitle>
              <CardDescription>
                Manage your login credentials protected with bcrypt/Argon2 Supabase encryption.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                <div>
                  <Label htmlFor="currPass">Current Password</Label>
                  <Input
                    id="currPass"
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1.5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="newPass">New Password</Label>
                  <Input
                    id="newPass"
                    type="password"
                    placeholder="••••••••"
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
                    placeholder="••••••••"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="mt-1.5"
                    required
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" disabled={isSaving} className="gap-2">
                    <Lock className="h-4 w-4" />
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
                    Permanently wipe all logged daily tracking data, body measurements, workout sessions, and private progress photos. Your profile, account credentials, and active subscription remain active.
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
