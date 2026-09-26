"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, X, Plus, Bell, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RestTimerBarProps {
  initialSeconds: number;
  isOpen: boolean;
  onClose: () => void;
  exerciseName?: string;
}

function playChime() {
  try {
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.8);
  } catch {
    // AudioContext may be blocked by autoplay policies
  }
}

export function RestTimerBar({ initialSeconds, isOpen, onClose, exerciseName }: RestTimerBarProps) {
  const [prevInitial, setPrevInitial] = useState(initialSeconds);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state when initialSeconds changes during render (official React pattern)
  if (initialSeconds !== prevInitial) {
    setPrevInitial(initialSeconds);
    setSecondsLeft(initialSeconds);
    setTotalSeconds(initialSeconds);
    setIsRunning(true);
  }

  // Accurate countdown timer
  useEffect(() => {
    if (!isOpen || !isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          playChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isRunning]);

  if (!isOpen) return null;

  const progressPercent = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 100;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  const addTime = (secs: number) => {
    setSecondsLeft((prev) => prev + secs);
    setTotalSeconds((prev) => prev + secs);
    if (!isRunning) setIsRunning(true);
  };

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 transition-all duration-300 ${
        isMinimized ? "max-w-xs" : ""
      }`}
    >
      <div className="bg-card/95 backdrop-blur-md border-2 border-emerald-500/50 shadow-2xl rounded-2xl overflow-hidden text-card-foreground">
        {/* Progress bar line */}
        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5">
          <div
            className="h-full bg-emerald-500 transition-all duration-500 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center h-10 w-10 rounded-xl font-mono text-lg font-bold text-white shadow-xs ${
                  secondsLeft === 0
                    ? "bg-amber-500 animate-pulse"
                    : isRunning
                    ? "bg-emerald-600"
                    : "bg-zinc-600"
                }`}
              >
                {secondsLeft === 0 ? <Bell className="h-5 w-5" /> : formattedTime}
              </div>

              {!isMinimized && (
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
                      Rest Timer
                    </span>
                    <Volume2 className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <p className="text-xs font-medium text-foreground truncate max-w-[180px]">
                    {secondsLeft === 0 ? "Rest Complete! Next Set Ready" : exerciseName || "Catch your breath"}
                  </p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs font-medium"
                onClick={() => addTime(30)}
              >
                <Plus className="h-3 w-3 mr-0.5" /> 30s
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 text-emerald-500" />}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setSecondsLeft(totalSeconds);
                  setIsRunning(true);
                }}
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <span className="text-xs font-mono">{isMinimized ? "▲" : "▼"}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-500"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
