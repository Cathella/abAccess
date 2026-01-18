"use client";

import { ContactMethod } from "@/types";
import { cn } from "@/lib/utils";

interface ContactMethodCardProps {
  method: ContactMethod;
  onAction: () => void;
}

const iconBgColors: Record<ContactMethod["type"], string> = {
  whatsapp: "bg-secondary-100",
  phone: "bg-secondary-100",
  email: "bg-secondary-100",
};

export function ContactMethodCard({ method, onAction }: ContactMethodCardProps) {
  return (
    <div className="bg-white rounded-4xl border border-neutral-400 p-4">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            iconBgColors[method.type]
          )}
        >
          <span className="text-2xl">{method.icon}</span>
        </div>
        <div>
          <h3 className="text-base mb-1 font-semibold text-neutral-900">{method.title}</h3>
          <p className="text-sm text-neutral-700">
            {method.type === "whatsapp"
              ? "Chat with us on WhatsApp"
              : method.value}
          </p>
        </div>
      </div>

      <button
        onClick={onAction}
        className="w-full mt-3 h-10 bg-primary-100 border-[1.5px] border-neutral-900 rounded-xl font-semibold text-neutral-900"
        type="button"
      >
        {method.actionLabel}
      </button>

      <p className="text-sm text-neutral-600 text-center mt-2">
        {method.responseTime}
      </p>
    </div>
  );
}
