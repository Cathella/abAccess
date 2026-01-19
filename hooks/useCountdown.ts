"use client";

import { useState, useEffect, useCallback } from "react";

interface UseCountdownReturn {
  timeRemaining: number;
  isExpired: boolean;
  formattedTime: string;
  percentRemaining: number;
}

export function useCountdown(
  expiresAt: string,
  totalDuration?: number
): UseCountdownReturn {
  const [timeRemaining, setTimeRemaining] = useState(() => {
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    return Math.max(0, Math.floor((expiry - now) / 1000));
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const remaining = Math.max(0, Math.floor((expiry - now) / 1000));
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const formatTime = useCallback((seconds: number): string => {
    if (seconds <= 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const isExpired = timeRemaining <= 0;
  const formattedTime = formatTime(timeRemaining);
  const percentRemaining = totalDuration
    ? Math.round((timeRemaining / totalDuration) * 100)
    : 100;

  return { timeRemaining, isExpired, formattedTime, percentRemaining };
}
