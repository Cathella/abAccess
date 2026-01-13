"use client";

import { CONTACT_METHODS } from "@/lib/constants";
import { ContactMethodCard } from "@/components/cards/ContactMethodCard";

export default function ContactUsPage() {
  const handleContactAction = (type: string, value: string) => {
    switch (type) {
      case "whatsapp":
        window.open(
          `https://wa.me/${value.replace(/\D/g, "")}?text=${encodeURIComponent(
            "Hello, I need help with ABA Access"
          )}`,
          "_blank"
        );
        break;
      case "phone":
        window.location.href = `tel:${value}`;
        break;
      case "email":
        window.location.href = `mailto:${value}?subject=${encodeURIComponent(
          "Support Request"
        )}`;
        break;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Get in touch</h2>
        <p className="text-gray-600 mb-6">
          We're here to help. Choose how you'd like to reach us.
        </p>

        <div className="space-y-4">
          {CONTACT_METHODS.map((method) => (
            <ContactMethodCard
              key={method.id}
              method={method}
              onAction={() => handleContactAction(method.type, method.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
