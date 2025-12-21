import { z } from "zod";

// Authentication Schemas
export const phoneSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

export const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const pinSchema = z.object({
  pin: z.string().length(6, "PIN must be 6 digits"),
});

// User Profile Schemas
export const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional(),
  dateOfBirth: z.string().optional(),
});

// Family Member Schema
export const familyMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  relationship: z.string().min(2, "Relationship is required"),
  dateOfBirth: z.string(),
  gender: z.enum(["male", "female", "other"]),
});

// Package Schema
export const packageSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number().positive(),
});

// Types
export type PhoneInput = z.infer<typeof phoneSchema>;
export type OTPInput = z.infer<typeof otpSchema>;
export type PinInput = z.infer<typeof pinSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type FamilyMemberInput = z.infer<typeof familyMemberSchema>;
export type PackageInput = z.infer<typeof packageSchema>;
