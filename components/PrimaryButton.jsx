import { ActivityIndicator, Platform, Pressable, StyleSheet, Text } from "react-native";
import { COLORS } from "../constants/colors";
import { ELEVATION, RADIUS, SPACING } from "../constants/layout";
import { TYPOGRAPHY } from "../constants/typography";

export default function PrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
}) {
  const pressDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={pressDisabled}
      style={[styles.button, disabled && styles.buttonDisabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.white} />
      ) : (
        <Text style={[styles.label, disabled && styles.labelDisabled, textStyle]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    height: 52,
    paddingVertical: 0,
    paddingHorizontal: 22,
    alignItems: "center",
    justifyContent: "center",
    ...ELEVATION.accent,
  },
  buttonDisabled: {
    backgroundColor: COLORS.borderSoft,
    shadowOpacity: 0,
    elevation: 0,
  },
  label: {
    ...TYPOGRAPHY.button,
    color: COLORS.white,
    textAlign: "center",
    ...(Platform.OS === "android" ? { includeFontPadding: false } : {}),
  },
  labelDisabled: {
    color: COLORS.muted,
  },
});
