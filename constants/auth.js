/** Used when Supabase phone auth is off (no real SMS). Set `EXPO_PUBLIC_DEV_OTP` to override. */
export const DEMO_SMS_OTP = process.env.EXPO_PUBLIC_DEV_OTP || "123456";

/** expo-secure-store keys for Firebase phone auth */
export const SECURE_STORE_KEYS = {
  idToken: "shelf.auth.idToken",
  phone: "shelf.auth.phone",
};
