import * as SecureStore from "expo-secure-store";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "../config/firebase";
import { SECURE_STORE_KEYS } from "../constants/auth";
import { clearPendingPhoneSession } from "../utils/otpSession";

const AuthContext = createContext({
  isReady: false,
  isAuthenticated: false,
  phone: "",
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [isReady, setIsReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const unsub = auth().onAuthStateChanged(async (user) => {
      try {
        if (user) {
          const token = await user.getIdToken();
          await SecureStore.setItemAsync(SECURE_STORE_KEYS.idToken, token);
          const raw = user.phoneNumber || "";
          const digits = raw.replace(/\D/g, "").slice(-10);
          setPhone(digits);
          if (digits) {
            await SecureStore.setItemAsync(SECURE_STORE_KEYS.phone, digits);
          }
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          setPhone("");
          clearPendingPhoneSession();
          try {
            await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.idToken);
          } catch {
            /* ignore */
          }
          try {
            await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.phone);
          } catch {
            /* ignore */
          }
        }
      } catch {
        /* ignore */
      } finally {
        setIsReady(true);
      }
    });
    return unsub;
  }, []);

  const signIn = useCallback(async (nextPhone) => {
    const digits = String(nextPhone ?? "").replace(/\D/g, "");
    setPhone(digits);
    await SecureStore.setItemAsync(SECURE_STORE_KEYS.phone, digits);
    setAuthenticated(true);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await auth().signOut();
    } catch {
      /* ignore */
    }
    setAuthenticated(false);
    setPhone("");
    clearPendingPhoneSession();
    try {
      await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.idToken);
    } catch {
      /* ignore */
    }
    try {
      await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.phone);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({
      isReady,
      isAuthenticated: authenticated,
      phone,
      signIn,
      signOut,
    }),
    [isReady, authenticated, phone, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
