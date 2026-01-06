/**
 * Seed sample facilities (partners) into Supabase.
 *
 * Usage:
 *   npx tsx scripts/seedFacilities.ts
 *
 * Requires:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials.");
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

const operatingHours = {
  mon: { open: "08:00", close: "18:00" },
  tue: { open: "08:00", close: "18:00" },
  wed: { open: "08:00", close: "18:00" },
  thu: { open: "08:00", close: "18:00" },
  fri: { open: "08:00", close: "18:00" },
  sat: { open: "09:00", close: "16:00" },
  sun: { open: "10:00", close: "14:00" },
};

const facilities = [
  {
    name: "Mukono Family Clinic",
    address: "Jinja Road, Mukono",
    latitude: 0.3512,
    longitude: 32.7514,
    phone: "+256 414 123 001",
    photo_url: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3",
    rating: 4.6,
    rating_count: 214,
    services: ["Consultations", "Pharmacy", "Maternal Care"],
    operating_hours: operatingHours,
    accepts_booking: true,
    is_partner: true,
  },
  {
    name: "Kampala Central Medical",
    address: "Kampala Road, Kampala",
    latitude: 0.3136,
    longitude: 32.5811,
    phone: "+256 414 123 002",
    photo_url: "https://images.unsplash.com/photo-1576765608622-067973a79f53",
    rating: 4.4,
    rating_count: 180,
    services: ["Consultations", "Lab Tests", "Imaging"],
    operating_hours: operatingHours,
    accepts_booking: true,
    is_partner: true,
  },
  {
    name: "Nakasero Lab Hub",
    address: "Nakasero Hill, Kampala",
    latitude: 0.3229,
    longitude: 32.5815,
    phone: "+256 414 123 003",
    photo_url: "https://images.unsplash.com/photo-1581091012184-5c1b4c9b19b3",
    rating: 4.7,
    rating_count: 96,
    services: ["Lab Tests", "Diagnostics"],
    operating_hours: operatingHours,
    accepts_booking: true,
    is_partner: true,
  },
  {
    name: "Ntinda Wellness Centre",
    address: "Ntinda, Kampala",
    latitude: 0.3468,
    longitude: 32.6109,
    phone: "+256 414 123 004",
    photo_url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
    rating: 4.5,
    rating_count: 132,
    services: ["Consultations", "Pediatrics", "Pharmacy"],
    operating_hours: operatingHours,
    accepts_booking: true,
    is_partner: true,
  },
  {
    name: "Rubaga Community Clinic",
    address: "Rubaga, Kampala",
    latitude: 0.3045,
    longitude: 32.5522,
    phone: "+256 414 123 005",
    photo_url: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc",
    rating: 4.2,
    rating_count: 74,
    services: ["Consultations", "Maternal Care"],
    operating_hours: operatingHours,
    accepts_booking: true,
    is_partner: true,
  },
  {
    name: "Luzira Family Pharmacy",
    address: "Luzira, Kampala",
    latitude: 0.3008,
    longitude: 32.6362,
    phone: "+256 414 123 006",
    photo_url: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88",
    rating: 4.3,
    rating_count: 58,
    services: ["Pharmacy", "Consultations"],
    operating_hours: operatingHours,
    accepts_booking: false,
    is_partner: true,
  },
  {
    name: "Bugolobi Health Point",
    address: "Bugolobi, Kampala",
    latitude: 0.3118,
    longitude: 32.6177,
    phone: "+256 414 123 007",
    photo_url: "https://images.unsplash.com/photo-1504439468489-c8920d796a29",
    rating: 4.1,
    rating_count: 65,
    services: ["Consultations", "Lab Tests", "Pharmacy"],
    operating_hours: operatingHours,
    accepts_booking: true,
    is_partner: true,
  },
  {
    name: "Entebbe Lakeside Clinic",
    address: "Entebbe Road, Entebbe",
    latitude: 0.0424,
    longitude: 32.4545,
    phone: "+256 414 123 008",
    photo_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d",
    rating: 4.6,
    rating_count: 102,
    services: ["Consultations", "Imaging", "Lab Tests"],
    operating_hours: operatingHours,
    accepts_booking: true,
    is_partner: true,
  },
  {
    name: "Wandegeya Care Clinic",
    address: "Wandegeya, Kampala",
    latitude: 0.3375,
    longitude: 32.5661,
    phone: "+256 414 123 009",
    photo_url: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb",
    rating: 4.0,
    rating_count: 49,
    services: ["Consultations", "Pediatrics"],
    operating_hours: operatingHours,
    accepts_booking: true,
    is_partner: true,
  },
  {
    name: "Kira Diagnostics Lab",
    address: "Kira Road, Kampala",
    latitude: 0.3501,
    longitude: 32.5937,
    phone: "+256 414 123 010",
    photo_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    rating: 4.4,
    rating_count: 88,
    services: ["Lab Tests", "Diagnostics"],
    operating_hours: operatingHours,
    accepts_booking: true,
    is_partner: true,
  },
  {
    name: "Gulu Regional Clinic",
    address: "Lacor Road, Gulu",
    latitude: 2.7746,
    longitude: 32.2980,
    phone: "+256 471 123 011",
    photo_url: "https://images.unsplash.com/photo-1579154204601-01588f351e67",
    rating: 4.1,
    rating_count: 40,
    services: ["Consultations", "Maternal Care", "Pharmacy"],
    operating_hours: operatingHours,
    accepts_booking: false,
    is_partner: true,
  },
  {
    name: "Mbarara Medical Centre",
    address: "Rwebikoona, Mbarara",
    latitude: -0.6167,
    longitude: 30.6583,
    phone: "+256 483 123 012",
    photo_url: "https://images.unsplash.com/photo-1504814532849-9272f5c8c810",
    rating: 4.3,
    rating_count: 77,
    services: ["Consultations", "Lab Tests", "Imaging"],
    operating_hours: operatingHours,
    accepts_booking: true,
    is_partner: true,
  },
  {
    name: "Jinja River Health",
    address: "Main Street, Jinja",
    latitude: 0.4244,
    longitude: 33.2042,
    phone: "+256 434 123 013",
    photo_url: "https://images.unsplash.com/photo-1519494080410-f9aa76cb4283",
    rating: 4.2,
    rating_count: 54,
    services: ["Consultations", "Pharmacy"],
    operating_hours: operatingHours,
    accepts_booking: true,
    is_partner: true,
  },
  {
    name: "Masaka Care Hospital",
    address: "Masaka Road, Masaka",
    latitude: -0.3338,
    longitude: 31.7346,
    phone: "+256 482 123 014",
    photo_url: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528",
    rating: 4.0,
    rating_count: 61,
    services: ["Consultations", "Maternal Care"],
    operating_hours: operatingHours,
    accepts_booking: false,
    is_partner: true,
  },
  {
    name: "Hoima Wellness Hub",
    address: "Kampala Road, Hoima",
    latitude: 1.4333,
    longitude: 31.3433,
    phone: "+256 465 123 015",
    photo_url: "https://images.unsplash.com/photo-1580281658629-6e8a6d9b3f1f",
    rating: 4.2,
    rating_count: 43,
    services: ["Consultations", "Lab Tests"],
    operating_hours: operatingHours,
    accepts_booking: true,
    is_partner: true,
  },
  {
    name: "Fort Portal Family Clinic",
    address: "Rukidi Road, Fort Portal",
    latitude: 0.6710,
    longitude: 30.2757,
    phone: "+256 483 123 016",
    photo_url: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb",
    rating: 4.3,
    rating_count: 38,
    services: ["Consultations", "Pediatrics", "Pharmacy"],
    operating_hours: operatingHours,
    accepts_booking: true,
    is_partner: true,
  },
  {
    name: "Arua City Health",
    address: "Hospital Road, Arua",
    latitude: 3.0201,
    longitude: 30.9110,
    phone: "+256 476 123 017",
    photo_url: "https://images.unsplash.com/photo-1504814532849-9272f5c8c810",
    rating: 4.1,
    rating_count: 35,
    services: ["Consultations", "Lab Tests"],
    operating_hours: operatingHours,
    accepts_booking: false,
    is_partner: true,
  },
  {
    name: "Mbale Regional Lab",
    address: "Republic Street, Mbale",
    latitude: 1.0644,
    longitude: 34.1790,
    phone: "+256 454 123 018",
    photo_url: "https://images.unsplash.com/photo-1581091012184-5c1b4c9b19b3",
    rating: 4.2,
    rating_count: 52,
    services: ["Lab Tests", "Diagnostics"],
    operating_hours: operatingHours,
    accepts_booking: true,
    is_partner: true,
  },
  {
    name: "Soroti Medical Centre",
    address: "Lira Road, Soroti",
    latitude: 1.7120,
    longitude: 33.6110,
    phone: "+256 454 123 019",
    photo_url: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb",
    rating: 4.0,
    rating_count: 29,
    services: ["Consultations", "Maternal Care"],
    operating_hours: operatingHours,
    accepts_booking: false,
    is_partner: true,
  },
  {
    name: "Lira Health Partners",
    address: "Obote Avenue, Lira",
    latitude: 2.2490,
    longitude: 32.9000,
    phone: "+256 473 123 020",
    photo_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d",
    rating: 4.2,
    rating_count: 33,
    services: ["Consultations", "Pharmacy", "Lab Tests"],
    operating_hours: operatingHours,
    accepts_booking: true,
    is_partner: true,
  },
];

async function seedFacilities() {
  console.log("🌱 Seeding facilities...");

  const { error } = await supabase
    .from("facilities")
    .upsert(facilities, { onConflict: "name" });

  if (error) {
    console.error("❌ Failed to upsert facilities:", error.message);
    process.exit(1);
  }

  console.log(`✅ Seeded ${facilities.length} facilities.`);
}

seedFacilities().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
