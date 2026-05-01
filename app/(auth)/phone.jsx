import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/layout";
import { auth } from "../../config/firebase";
import PrimaryButton from "../../components/PrimaryButton";
import ShelfLogo from "../../components/ShelfLogo";
import { TYPOGRAPHY } from "../../constants/typography";
import { setPendingPhoneSession } from "../../utils/otpSession";

const INTRO_COPY =
  "Shelf tracks expiry dates on everything you own — food, medicine, skincare, and more. Just scan or add, and we'll remind you before anything goes to waste.";

export default function PhoneScreen() {
  const [phone, setPhone] = useState("");
  const [focused, setFocused] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const isValid = useMemo(() => phone.length === 10, [phone]);

  const onContinue = useCallback(async () => {
    if (!isValid || sending) {
      return;
    }
    setSendError("");
    setSending(true);
    try {
      const confirmation = await auth().signInWithPhoneNumber(`+91${phone}`);
      setPendingPhoneSession(confirmation);
      router.push({
        pathname: "/(auth)/otp",
        params: {
          phone,
        },
      });
    } catch (error) {
      setSendError(error?.message || "Failed to send code. Try again.");
    } finally {
      setSending(false);
    }
  }, [isValid, sending, phone]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inner}>
            <ShelfLogo size={44} bg={COLORS.accent} fg={COLORS.white} />
            <Text style={styles.title}>Welcome to Shelf.</Text>
            <Text style={styles.intro}>{INTRO_COPY}</Text>
            <View style={styles.row}>
              <View style={styles.codeBox}>
                <Text style={styles.codeText}>+91</Text>
              </View>
              <TextInput
                placeholder="Phone number"
                keyboardType="number-pad"
                maxLength={10}
                value={phone}
                onChangeText={(value) => setPhone(value.replace(/\D/g, "").slice(0, 10))}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={[styles.input, focused && styles.inputFocused]}
                placeholderTextColor={COLORS.muted}
                returnKeyType="done"
                onSubmitEditing={onContinue}
                editable={!sending}
              />
            </View>
            <PrimaryButton
              label="Continue"
              onPress={onContinue}
              disabled={!isValid}
              loading={sending}
              style={[styles.button, isValid && styles.buttonActive]}
            />
            {sendError ? <Text style={styles.error}>{sendError}</Text> : null}
            <Text style={styles.terms}>
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    backgroundColor: COLORS.surfaceSoft,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 24,
  },
  inner: {
    paddingHorizontal: 32,
  },
  title: {
    ...TYPOGRAPHY.title,
    marginTop: 20,
    color: COLORS.textDark,
    letterSpacing: -0.5,
    fontSize: 24,
  },
  intro: {
    fontSize: 14,
    lineHeight: 22.4,
    color: COLORS.mutedStrong,
    marginTop: 12,
    maxWidth: 300,
    alignSelf: "center",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: 32,
  },
  codeBox: {
    width: 64,
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  codeText: {
    color: COLORS.textDark,
    fontWeight: "600",
  },
  input: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    fontSize: 16,
    letterSpacing: 0.8,
    color: COLORS.textDark,
  },
  inputFocused: {
    borderColor: COLORS.accent,
  },
  button: {
    marginTop: 20,
    borderRadius: RADIUS.lg,
  },
  buttonActive: {
    shadowColor: COLORS.accent,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  error: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.danger,
    textAlign: "center",
    fontWeight: "600",
  },
  terms: {
    marginTop: 20,
    color: COLORS.mutedStrong,
    ...TYPOGRAPHY.caption,
    textAlign: "center",
    lineHeight: 18,
  },
});
