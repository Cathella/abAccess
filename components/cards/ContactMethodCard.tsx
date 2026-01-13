"use client";

import { ContactMethod } from "@/types";
import { cn } from "@/lib/utils";

interface ContactMethodCardProps {
  method: ContactMethod;
  onAction: () => void;
}

const iconBgColors: Record<ContactMethod["type"], string> = {
  whatsapp: "bg-purple-100",
  phone: "bg-pink-100",
  email: "bg-pink-100",
};

export function ContactMethodCard({ method, onAction }: ContactMethodCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
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
          <h3 className="font-semibold text-gray-900">{method.title}</h3>
          <p className="text-sm text-gray-500">
            {method.type === "whatsapp"
              ? "Chat with us on WhatsApp"
              : method.value}
          </p>
        </div>
      </div>

      <button
        onClick={onAction}
        className="w-full mt-3 py-3 bg-[#E8F4F1] border border-gray-300 rounded-xl font-semibold text-gray-900"
        type="button"
      >
        {method.actionLabel}
      </button>

      <p className="text-sm text-gray-400 text-center mt-2">
        {method.responseTime}
      </p>
    </div>
  );
}
