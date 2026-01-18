"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { Header } from "@/components/common/Header";
import { TextInput } from "@/components/forms/TextInput";
import { useFamilyStore } from "@/stores/familyStore";
import { updateDependent } from "@/lib/services/dependentService";
import { getMaxDateForChild, getMinDateForChild, isUnder18 } from "@/lib/utils/dateUtils";
import { ROUTES } from "@/lib/constants";

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

export default function EditDependentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const getDependentById = useFamilyStore((state) => state.getDependentById);
  const updateDependentInStore = useFamilyStore((state) => state.updateDependent);

  const dependent = getDependentById(id);

  // Redirect if dependent not found
  useEffect(() => {
    if (!dependent) {
      router.replace(ROUTES.FAMILY);
    }
  }, [dependent, router]);

  // Original values for comparison
  const [originalData, setOriginalData] = useState<FormData>({
    name: "",
    dateOfBirth: "",
    gender: "",
  });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    dateOfBirth: "",
    gender: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Initialize form with dependent data
  useEffect(() => {
    if (dependent) {
      const initialData: FormData = {
        name: dependent.name,
        dateOfBirth: dependent.dateOfBirth,
        gender: dependent.gender,
      };
      setFormData(initialData);
      setOriginalData(initialData);
    }
  }, [dependent]);

  // Check if form has changes
  const hasChanges = useMemo(() => {
    return (
      formData.name !== originalData.name ||
      formData.dateOfBirth !== originalData.dateOfBirth ||
      formData.gender !== originalData.gender
    );
  }, [formData, originalData]);

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

    if (!validateForm() || !hasChanges) {
      return;
    }

    if (!dependent) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateDependent(dependent.id, {
        name: formData.name.trim(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender as "male" | "female",
      });

      if (result.success && result.dependent) {
        // Update in store
        updateDependentInStore(dependent.id, result.dependent);

        // Show success toast
        setShowSuccessToast(true);

        // Navigate back after a short delay
        setTimeout(() => {
          router.back();
        }, 1000);
      } else {
        // Show error toast
        alert(result.error || "Failed to save changes");
      }
    } catch {
      alert("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!dependent) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <Header title="Edit Details" showBack />

      {/* Divider */}
      <div className="h-px bg-neutral-400" />

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col px-6">
        {/* Title */}
        <h1 className="mb-8 mt-6 text-xl font-bold text-neutral-900">
          Update your child&apos;s information
        </h1>

        {/* Form Fields */}
        <div className="flex-1">
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
                className={`h-12 w-full rounded-xl border-neutral-400 border-[1.5px] ${
                  errors.dateOfBirth
                    ? "border-error-900 focus-visible:border-error-900"
                    : "border-neutral-300 focus-visible:border-primary-900"
                } px-4 text-base placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-0`}
                placeholder="Select date"
              />
              {/* <Calendar className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-600" /> */}
            </div>
            {!errors.dateOfBirth && (
              <p className="mt-2 text-sm text-neutral-700">Child must be under 18 years old</p>
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
            disabled={!isFormValid() || !hasChanges || isSubmitting}
            className="h-12 w-full rounded-xl bg-primary-900 text-base font-bold text-neutral-900 border-2 border-neutral-900 transition-colors hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="rounded-xl bg-success-900 px-6 py-3 text-neutral-900 shadow-lg">
            <p className="text-sm font-medium">Changes saved</p>
          </div>
        </div>
      )}
    </div>
  );
}
