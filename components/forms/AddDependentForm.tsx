"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextInput } from "@/components/forms/TextInput";
import {
  useFamilyStore,
  selectCanAddMore
} from "@/stores/familyStore";
import { useAuth } from "@/hooks/useAuth";
import { addDependent } from "@/lib/services/dependentService";
import { getMaxDateForChild, getMinDateForChild, isUnder18 } from "@/lib/utils/dateUtils";
import { ROUTES } from "@/lib/constants";
import { LimitReachedModal } from "@/components/modals/LimitReachedModal";

interface FormData {
  name: string;
  dateOfBirth: string;
  gender: "male" | "female" | "";
}

interface FormErrors {
  name?: string;
  dateOfBirth?: string;
  gender?: string;
}

export function AddDependentForm() {
  const router = useRouter();
  const { user } = useAuth();
  const addToStore = useFamilyStore((state) => state.addDependent);
  const canAddMore = useFamilyStore(selectCanAddMore);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    dateOfBirth: "",
    gender: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Validate date of birth
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else if (!isUnder18(formData.dateOfBirth)) {
      newErrors.dateOfBirth = "Child must be under 18 years old";
    }

    // Validate gender
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = (): boolean => {
    return (
      formData.name.trim().length >= 2 &&
      formData.dateOfBirth !== "" &&
      formData.gender !== "" &&
      (!formData.dateOfBirth || isUnder18(formData.dateOfBirth))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Check if at max dependents
    if (!canAddMore) {
      setShowLimitModal(true);
      return;
    }

    if (!user?.id) {
      alert("User not found. Please sign in again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await addDependent(user.id, {
        name: formData.name.trim(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender as "male" | "female",
      });

      if (result.success && result.dependent) {
        // Add to store
        addToStore(result.dependent);

        // Navigate to success page with dependent data
        router.push(`${ROUTES.FAMILY_ADD_SUCCESS}?name=${encodeURIComponent(result.dependent.name)}`);
      } else {
        // Show error toast
        alert(result.error || "Failed to add dependent");
      }
    } catch {
      alert("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex min-h-screen flex-col bg-white px-6">
      {/* Description */}
      <p className="mt-6 text-base leading-[160%] text-neutral-700">
        Enter your child&apos;s details. They&apos;ll share your bundles and appear in your visit history.
      </p>

      {/* Form Fields */}
      <div className="mt-8 flex-1">
        {/* Full Name Input */}
        <div className="mb-6">
          <TextInput
            id="name"
            label="Full name"
            placeholder="Enter child&apos;s name"
            value={formData.name}
            onChange={(value) => {
              setFormData({ ...formData, name: value });
              if (errors.name) {
                setErrors({ ...errors, name: undefined });
              }
            }}
            error={errors.name}
            className="h-12"
          />
        </div>

        {/* Date of Birth Input */}
        <div className="mb-6">
          <label htmlFor="dateOfBirth" className="mb-2 block text-base text-neutral-900">
            Date of birth
          </label>
          <div className="relative">
            <input
              type="date"
              id="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={(e) => {
                setFormData({ ...formData, dateOfBirth: e.target.value });
                if (errors.dateOfBirth) {
                  setErrors({ ...errors, dateOfBirth: undefined });
                }
              }}
              max={getMaxDateForChild()}
              min={getMinDateForChild()}
              className={`h-12 w-full rounded-xl border-[1.5px] ${
                errors.dateOfBirth
                  ? "border-error-900 focus-visible:border-error-900"
                  : "border-neutral-400 focus-visible:border-primary-900"
              } px-4 text-base placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-0`}
              placeholder="Select date"
            />
            {/* <Calendar className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-600" /> */}
          </div>
          {!errors.dateOfBirth && (
            <p className="mt-2 text-sm text-neutral-600">Child must be under 18 years old</p>
          )}
          {errors.dateOfBirth && (
            <p className="mt-2 text-sm text-error-900">{errors.dateOfBirth}</p>
          )}
        </div>

        {/* Gender Selection */}
        <div>
          <label className="mb-2 block text-base text-neutral-900">Gender</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setFormData({ ...formData, gender: "male" });
                if (errors.gender) {
                  setErrors({ ...errors, gender: undefined });
                }
              }}
              className={`flex h-12 flex-1 items-center justify-center rounded-xl border transition-colors ${
                formData.gender === "male"
                  ? "border-primary-900 border-[1.5px] bg-primary-100 text-neutral-900"
                  : "border-neutral-400 border-[1.5px] bg-white text-neutral-900"
              }`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({ ...formData, gender: "female" });
                if (errors.gender) {
                  setErrors({ ...errors, gender: undefined });
                }
              }}
              className={`flex h-12 flex-1 items-center justify-center rounded-xl border transition-colors ${
                formData.gender === "female"
                  ? "border-primary-900 border-[1.5px] bg-primary-100 text-neutral-900"
                  : "border-neutral-400 border-[1.5px] bg-white text-neutral-900"
              }`}
            >
              Female
            </button>
          </div>
          {errors.gender && (
            <p className="mt-2 text-sm text-error-900">{errors.gender}</p>
          )}
        </div>
      </div>

      {/* Submit Button (Fixed at bottom) */}
      <div className="pb-6 pt-6">
        <button
          type="submit"
          disabled={!isFormValid() || isSubmitting}
          className="h-12 w-full rounded-xl bg-primary-900 text-base font-bold border-2 border-neutral-900 text-neutral-900 transition-colors hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Adding child..." : "Add child"}
        </button>
      </div>

      {/* Limit Reached Modal */}
      <LimitReachedModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
      />
    </form>
  );
}
