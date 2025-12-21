"use client";

import { useState } from "react";

interface PinInputProps {
  length?: number;
  onComplete?: (pin: string) => void;
}

export function PinInput({ length = 6, onComplete }: PinInputProps) {
  const [pin, setPin] = useState("");

  return (
    <div className="flex gap-2">
      {Array.from({ length }).map((_, index) => (
        <div
          key={index}
          className="flex h-12 w-12 items-center justify-center rounded-lg border bg-background text-center text-xl font-semibold"
        >
          {pin[index] ? "•" : ""}
        </div>
      ))}
    </div>
  );
}
