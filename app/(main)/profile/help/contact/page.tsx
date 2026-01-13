"use client";

import { MessageCircle, Phone, Mail, ChevronRight, Info } from "lucide-react";
import type { ContactMethod } from "@/types";
import { CONTACT_METHODS } from "@/lib/constants";

const ICON_MAP = {
  whatsapp: MessageCircle,
  phone: Phone,
  email: Mail,
} as const;

const ICON_STYLES = {
  whatsapp: {
    bg: "bg-[#25D366]/10",
    color: "text-[#25D366]",
  },
  phone: {
    bg: "bg-secondary-100",
    color: "text-secondary-900",
  },
  email: {
    bg: "bg-primary-100",
    color: "text-primary-900",
  },
} as const;

export default function ContactPage() {
  const handleContactAction = (method: ContactMethod) => {
    switch (method.type) {
      case "whatsapp": {
        const message = encodeURIComponent("Hi, I need help with ABA Access.");
        const phoneNumber = method.value.replace(/[^0-9]/g, "");
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
        break;
      }
      case "phone": {
        const phoneNumber = method.value.replace(/\s/g, "");
        window.location.href = `tel:${phoneNumber}`;
        break;
      }
      case "email": {
        window.location.href = `mailto:${method.value}?subject=Support Request`;
        break;
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-200">
      <div className="px-4 py-6 space-y-4">
        {/* Title Section */}
        <div className="px-1">
          <h2 className="text-2xl font-bold text-neutral-900">Get in touch</h2>
          <p className="text-sm text-neutral-600 mt-1">
            Choose how you&apos;d like to contact us
          </p>
        </div>

        {/* Contact Options Card */}
        <div className="bg-white rounded-2xl px-4">
          {CONTACT_METHODS.map((method, index) => {
            const IconComponent = ICON_MAP[method.type];
            const iconStyle = ICON_STYLES[method.type];
            const isLast = index === CONTACT_METHODS.length - 1;

            return (
              <button
                key={method.id}
                onClick={() => handleContactAction(method)}
                className={`w-full flex items-center gap-3 py-4 text-left ${
                  !isLast ? "border-b border-neutral-300" : ""
                }`}
              >
                {/* Icon Circle */}
                <div
                  className={`w-10 h-10 rounded-full ${iconStyle.bg} flex items-center justify-center flex-shrink-0`}
                >
                  <IconComponent size={20} className={iconStyle.color} />
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <span className="block text-base font-medium text-neutral-900">
                    {method.title}
                  </span>
                  <span className="block text-sm text-neutral-600 mt-0.5">
                    {method.responseTime}
                  </span>
                </div>

                {/* Chevron */}
                <ChevronRight
                  size={20}
                  className="text-neutral-500 flex-shrink-0"
                />
              </button>
            );
          })}
        </div>

        {/* Support Hours Info */}
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: "#E3F1FC" }}
        >
          <div className="flex items-start gap-3">
            <Info size={20} className="text-secondary-900 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-base font-medium text-neutral-900 mb-1">
                Support hours
              </p>
              <p className="text-sm text-neutral-700">
                Our team is available Monday to Friday, 9:00 AM - 6:00 PM.
                WhatsApp messages sent outside these hours will be responded to
                on the next business day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
