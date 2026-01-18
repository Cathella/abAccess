"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { IssueType } from "@/types";
import { ISSUE_TYPE_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface IssueTypeSelectProps {
  value: IssueType | null;
  onChange: (value: IssueType) => void;
  error?: string;
}

export function IssueTypeSelect({
  value,
  onChange,
  error,
}: IssueTypeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = ISSUE_TYPE_OPTIONS.find(
    (option) => option.value === value
  )?.label;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 border rounded-xl",
          error ? "border-red-500" : "border-gray-200"
        )}
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {selectedLabel || "Select an issue type"}
        </span>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-gray-400 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-xl border border-gray-100 shadow-lg">
          {ISSUE_TYPE_OPTIONS.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-4 text-left",
                index < ISSUE_TYPE_OPTIONS.length - 1 &&
                  "border-b border-gray-100"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  value === option.value
                    ? "border-secondary-900"
                    : "border-gray-300"
                )}
              >
                {value === option.value && (
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary-900" />
                )}
              </div>
              <span className="text-base text-gray-900">{option.label}</span>
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
