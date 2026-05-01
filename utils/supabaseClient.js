import { createClient } from "@supabase/supabase-js";

/**
 * Optional real SMS OTP via Supabase Auth (configure Phone provider + e.g. Twilio in dashboard).
 *
 * Set in `.env` or `app.config` extra → env:
 *   EXPO_PUBLIC_SUPABASE_URL
 *   EXPO_PUBLIC_SUPABASE_ANON_KEY
 *
 * If either is missing, the app uses demo OTP (see `DEV_OTP_CODE` in otp screen).
 */
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabasePhoneEnabled = Boolean(
  url && anonKey && String(url).startsWith("http")
);

export const supabase = isSupabasePhoneEnabled
  ? createClient(String(url), String(anonKey), {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

export function e164India(phone10Digits) {
  const d = String(phone10Digits).replace(/\D/g, "");
  if (d.length !== 10) return null;
  return `+91${d}`;
}
