"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { signupSchema } from "@/lib/validations/auth";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = signupSchema.safeParse({
      fullName,
      email,
      password,
      confirmPassword,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        fieldErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes("already registered")) {
          toast.error("An account with this email already exists. Try logging in.");
        } else {
          toast.error(error.message);
        }
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Create corresponding profile record using strictly authenticated user ID
        try {
          await supabase.from("profiles").upsert(
            { id: data.user.id, full_name: fullName },
            { onConflict: "id" }
          );
          await supabase.from("user_preferences").upsert(
            { user_id: data.user.id },
            { onConflict: "user_id" }
          );
        } catch {
          // Profile may already exist via DB trigger — safe to ignore
        }
      }

      if (data.session) {
        // Email confirmation disabled in Supabase — user is immediately active
        toast.success("Account created! Welcome to ApexFit 🎉");
        router.push("/dashboard");
      } else {
        // Email confirmation required
        toast.success("Account created! Please check your email to verify your account.", {
          duration: 6000,
        });
        router.push("/login?confirmed=pending");
      }
    } catch {
      toast.error("Registration failed. Please try again.");
      setIsLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center md:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Create Athlete Account
        </h2>
        <p className="text-sm text-muted-foreground">
          Join ApexFit to unlock automated macro targets and workout splits.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="fullName"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="pl-9"
              required
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-destructive">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="athlete@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9"
              required
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9"
              required
            />
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password}</p>
          )}

          {/* Password complexity checklist */}
          <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-muted-foreground">
            <span className={`flex items-center gap-1 ${hasMinLength ? "text-emerald-500 font-medium" : ""}`}>
              <CheckCircle2 className="h-3 w-3" /> 8+ chars
            </span>
            <span className={`flex items-center gap-1 ${hasUpperCase ? "text-emerald-500 font-medium" : ""}`}>
              <CheckCircle2 className="h-3 w-3" /> Uppercase
            </span>
            <span className={`flex items-center gap-1 ${hasNumber ? "text-emerald-500 font-medium" : ""}`}>
              <CheckCircle2 className="h-3 w-3" /> Number
            </span>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-9"
              required
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full font-semibold mt-2"
          disabled={isLoading}
        >
          {isLoading ? "Creating Profile..." : "Create Account"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-emerald-500 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
