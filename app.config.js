const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, ".env") });

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...(config.extra ?? {}),
    googleVisionApiKey:
      process.env.GOOGLE_VISION_API_KEY ??
      process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY ??
      "",
    firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? "",
    firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? "",
  },
});
