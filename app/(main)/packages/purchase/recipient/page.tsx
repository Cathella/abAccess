"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";
import RecipientOption from "@/components/forms/RecipientOption";
import InfoCard from "@/components/common/InfoCard";
import { useAuthStore } from "@/stores/authStore";
import { useFamilyStore } from "@/stores/familyStore";
import { usePurchaseStore } from "@/stores/purchaseStore";
import { RecipientType } from "@/types";

export default function SelectRecipientPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const dependents = useFamilyStore((state) => state.dependents);
  const { recipient, setRecipient } = usePurchaseStore();

  const [selectedRecipient, setSelectedRecipient] = useState<RecipientType>(recipient);

  const hasDependents = dependents.length > 0;

  useEffect(() => {
    setSelectedRecipient(recipient);
  }, [recipient]);

  const handleContinue = () => {
    setRecipient(selectedRecipient);
    router.push("/packages/purchase/confirm");
  };

  const recipientOptions = [
    {
      value: "myself" as RecipientType,
      label: "Myself",
      description: user ? `${user.firstName} ${user.lastName}` : "For my own use",
    },
    ...(hasDependents
      ? [
          {
            value: "child" as RecipientType,
            label: "My child",
            description: "For one of my children",
          },
          {
            value: "family" as RecipientType,
            label: "My family",
            description: "Shared across everyone",
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Header */}
      <Header title="Select recipient" showBack />

      {/* Main content */}
      <div className="px-4 pt-6 pb-32 space-y-6">
        {/* Title and subtitle */}
        <div>
          <h1 className="text-xl font-bold text-neutral-900 mb-2">
            Who is this package for?
          </h1>
          <p className="text-neutral-700">
            This helps us personalize your experience. The package will be shared
            across your whole family.
          </p>
        </div>

        {/* Recipient options card */}
        <div className="rounded-2xl border border-neutral-400 divide-y divide-neutral-400">
          {recipientOptions.map((option) => (
            <RecipientOption
              key={option.value}
              value={option.value}
              label={option.label}
              description={option.description}
              selected={selectedRecipient === option.value}
              onSelect={() => setSelectedRecipient(option.value)}
            />
          ))}
        </div>

        {/* Empty state info card - Only show when no dependents */}
        {!hasDependents && (
          <InfoCard title="Want to share with your children?" variant="info">
            <p className="mb-4 text-base">Add them to your account after purchase.</p>
            <button
              onClick={() => router.push("/family/add")}
              className="w-full h-12 rounded-xl font-semibold border-[1.5px] border-neutral-900 bg-white text-neutral-900 transition-colors hover:bg-neutral-50"
            >
              Add children
            </button>
          </InfoCard>
        )}
      </div>

      {/* Fixed bottom button */}
      <div className="fixed bottom-0 left-0 right-0 p-4">
        <button
          onClick={handleContinue}
          className="w-full h-12 rounded-xl font-bold text-neutral-900 border-[1.5px] border-neutral-900 transition-colors"
          style={{ backgroundColor: "#32C28A" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#2AAA75";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#32C28A";
          }}
        >
          Continue
        </button>
      </div>
    </>
  );
}
