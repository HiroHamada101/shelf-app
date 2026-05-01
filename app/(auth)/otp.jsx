import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/layout";
import { TYPOGRAPHY } from "../../constants/typography";
import { auth } from "../../config/firebase";
import { requestPermission } from "../../utils/notifications";
import {
  clearPendingPhoneSession,
  getPendingPhoneSession,
  setPendingPhoneSession,
} from "../../utils/otpSession";

function CheckIcon() {
  return (
    <Svg
      width={14}
      height={14}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M3 8l3.5 3.5L13 4" />
    </Svg>
  );
}

function normalizePhoneParam(value) {
  if (value == null) return "";
  const s = Array.isArray(value) ? value[0] : value;
  return String(s ?? "").trim();
}

export default function OtpScreen() {
  const params = useLocalSearchParams();
  const phone = normalizePhoneParam(params.phone);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [resending, setResending] = useState(false);
  const refs = useRef([]);
  const verifyLockRef = useRef(false);

  useEffect(() => {
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length !== 10) {
      router.replace("/(auth)/phone");
      return;
    }
    if (!getPendingPhoneSession()) {
      router.replace("/(auth)/phone");
    }
  }, [phone]);

  const clearDigits = useCallback(() => {
    setDigits(["", "", "", "", "", ""]);
    refs.current[0]?.focus();
  }, []);

  const handleVerify = useCallback(
    async (code) => {
      if (verifyLockRef.current || isVerified) {
        return;
      }

      const confirmation = getPendingPhoneSession();
      if (!confirmation) {
        setVerifyError("Session expired. Go back and request a new code.");
        return;
      }

      verifyLockRef.current = true;
      setIsVerifying(true);
      setVerifyError("");
      try {
        await confirmation.confirm(String(code).trim());

        setIsVerified(true);
        await new Promise((r) => setTimeout(r, 600));
        clearPendingPhoneSession();
        await requestPermission();
        router.replace("/(tabs)/home");
      } catch {
        setVerifyError("Invalid code. Try again.");
        clearDigits();
      } finally {
        setIsVerifying(false);
        verifyLockRef.current = false;
      }
    },
    [clearDigits, isVerified]
  );

  const onChangeDigit = useCallback(
    (index, value) => {
      if (!/^\d*$/.test(value)) {
        return;
      }

      const nextValue = value.slice(-1);
      setDigits((prev) => {
        const next = [...prev];
        next[index] = nextValue;
        const full = next.join("");
        if (full.length === 6) {
          queueMicrotask(() => handleVerify(full));
        }
        return next;
      });

      if (nextValue && index < refs.current.length - 1) {
        refs.current[index + 1]?.focus();
      }
    },
    [handleVerify]
  );

  const onKeyPress = (index, event) => {
    if (event.nativeEvent.key !== "Backspace") {
      return;
    }
    if (digits[index] || index === 0) {
      return;
    }
    refs.current[index - 1]?.focus();
  };

  const digitsDisplay = phone.replace(/\D/g, "");

  const onResend = useCallback(() => {
    if (isVerifying || isVerified || resending) {
      return;
    }
    setVerifyError("");
    setResending(true);
    auth()
      .signInWithPhoneNumber(`+91${digitsDisplay}`)
      .then((confirmation) => {
        setPendingPhoneSession(confirmation);
        clearDigits();
      })
      .catch((error) => {
        setVerifyError(error?.message || "Failed to resend code. Try again.");
      })
      .finally(() => {
        setResending(false);
      });
  }, [isVerifying, isVerified, resending, digitsDisplay, clearDigits]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.title}>Verify your number</Text>
        <Text style={styles.tagline}>Never let anything expire again.</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to +91 {digitsDisplay}
        </Text>
        <View style={styles.digitRow}>
          {digits.map((digit, index) => (
            <TextInput
              key={index}
              ref={(node) => {
                refs.current[index] = node;
              }}
              value={digit}
              onChangeText={(value) => onChangeDigit(index, value)}
              onKeyPress={(event) => onKeyPress(index, event)}
              keyboardType="number-pad"
              maxLength={1}
              autoFocus={index === 0}
              style={[styles.digitInput, digit && styles.digitInputFilled]}
              editable={!isVerifying && !isVerified}
            />
          ))}
        </View>
        {verifyError ? <Text style={styles.inlineError}>{verifyError}</Text> : null}
        {isVerifying && (
          <View style={styles.statusRow}>
            <ActivityIndicator size="small" color={COLORS.accent} />
            <Text style={styles.statusText}>Verifying...</Text>
          </View>
        )}
        {isVerified && (
          <View style={styles.verifiedRow}>
            <Text style={styles.verifiedIcon}>
              <CheckIcon />
            </Text>
            <Text style={styles.verified}>Verified</Text>
          </View>
        )}
        <Pressable onPress={onResend} disabled={isVerifying || isVerified || resending}>
          <Text style={styles.resend}>
            <Text style={styles.resendMuted}>Didn&apos;t receive the code? </Text>
            <Text style={styles.resendAction}>{resending ? "Sending..." : "Resend"}</Text>
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.surfaceSoft,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
    backgroundColor: COLORS.surfaceSoft,
    gap: SPACING.sm + 2,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: SPACING.sm + 2,
  },
  backText: {
    color: COLORS.textDark,
    fontSize: 20,
  },
  title: {
    ...TYPOGRAPHY.title,
    fontSize: 22,
    color: COLORS.textDark,
  },
  tagline: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.mutedStrong,
    marginTop: 6,
  },
  subtitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.mutedStrong,
    marginTop: 8,
    marginBottom: 8,
  },
  digitRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  digitInput: {
    width: 46,
    height: 56,
    borderWidth: 1.5,
    borderColor: COLORS.borderSoft,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.white,
    textAlign: "center",
    fontSize: 24,
    color: COLORS.textDark,
    fontWeight: "700",
  },
  digitInputFilled: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentLight,
  },
  inlineError: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.danger,
    textAlign: "center",
    fontWeight: "600",
  },
  statusRow: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
  },
  statusText: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.accent,
    fontWeight: "600",
  },
  verifiedRow: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  verifiedIcon: {
    color: COLORS.success,
  },
  verified: {
    color: COLORS.success,
    fontWeight: "700",
  },
  resend: {
    marginTop: 32,
    ...TYPOGRAPHY.caption,
    fontSize: 13,
    textAlign: "center",
  },
  resendMuted: {
    color: COLORS.mutedStrong,
  },
  resendAction: {
    color: COLORS.accent,
    fontWeight: "600",
  },
});
