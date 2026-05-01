import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";
import { CATS, ICON_OPTIONS, PH, STORES } from "../constants/categories";
import { ALPHA, COLORS } from "../constants/colors";
import { ELEVATION, RADIUS, SPACING } from "../constants/layout";
import PrimaryButton from "../components/PrimaryButton";
import { TYPOGRAPHY } from "../constants/typography";
import { formatExpiryLong } from "../utils/dates";
import { readExpiryDate } from "../utils/ocr";
import { useDatabase } from "../hooks/useDatabase";
import { useTheme } from "../hooks/useTheme";

function IconCamera({ color = "#fff", size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

function IconPen({ color, size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Path
        d="M13 2l3 3L6 15H3v-3z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function parseExpiry(iso) {
  if (!iso) return new Date();
  const [y, m, day] = iso.split("-").map(Number);
  return new Date(y, m - 1, day, 12, 0, 0, 0);
}

/** Local calendar date as YYYY-MM-DD (avoids UTC shift from toISOString). */
function toLocalIsoDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const CATEGORY_ROWS = CATS.filter((c) => c.id !== "all");

export default function AddScreen() {
  const { mode, theme } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const { addItem } = useDatabase();
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();

  const [addPhase, setAddPhase] = useState("choose");
  const [fromScan, setFromScan] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [scanProcessing, setScanProcessing] = useState(false);
  const [expiryHint, setExpiryHint] = useState(null);

  const ocrPulse = useSharedValue(0.35);

  useEffect(() => {
    if (!scanProcessing) {
      ocrPulse.value = 0.35;
      return;
    }
    ocrPulse.value = withRepeat(
      withTiming(1, { duration: 750, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [scanProcessing]);

  const ocrBarPulseStyle = useAnimatedStyle(() => ({
    opacity: ocrPulse.value,
  }));

  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [sub, setSub] = useState("");
  const [expiry, setExpiry] = useState("");
  const [storage, setStorage] = useState("");
  const [saving, setSaving] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pendingDate, setPendingDate] = useState(() => new Date());

  const effectiveCategory = category || "other";

  const canSubmit = useMemo(
    () => Boolean(name.trim() && expiry),
    [name, expiry]
  );

  const resetManualForm = useCallback(() => {
    setCategory("");
    setName("");
    setSub("");
    setExpiry("");
    setStorage("");
    setFromScan(false);
    setExpiryHint(null);
  }, []);

  const openManual = useCallback(() => {
    resetManualForm();
    setExpiryHint(null);
    setAddPhase("form");
  }, [resetManualForm]);

  const onCapture = useCallback(async () => {
    if (!cameraRef.current || capturing || scanProcessing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.85 });
      const uri = photo?.uri;
      setCapturing(false);

      if (!uri) {
        setFromScan(true);
        setExpiry("");
        setExpiryHint({
          kind: "warn",
          message:
            "Couldn't read the date automatically. Please enter it manually.",
        });
        setAddPhase("form");
        return;
      }

      setScanProcessing(true);
      let result;
      try {
        result = await readExpiryDate(uri);
      } catch {
        result = { found: false, error: "network" };
      } finally {
        setScanProcessing(false);
      }

      if (result.found && result.date) {
        setExpiry(result.date);
        setPendingDate(parseExpiry(result.date));
        setExpiryHint({ kind: "success", message: "Expiry date detected ✓" });
      } else if (result.error === "timeout" || result.error === "network") {
        setExpiry("");
        setExpiryHint({
          kind: "network",
          message:
            result.message ?? "No internet. Please enter date manually.",
        });
      } else {
        setExpiry("");
        setExpiryHint({
          kind: "warn",
          message:
            result.message ??
            "Couldn't read the date automatically. Please enter it manually.",
        });
      }
      setFromScan(true);
      setAddPhase("form");
    } catch {
      setFromScan(true);
      setExpiry("");
      setExpiryHint({
        kind: "warn",
        message:
          "Couldn't read the date automatically. Please enter it manually.",
      });
      setAddPhase("form");
    } finally {
      setCapturing(false);
      setScanProcessing(false);
    }
  }, [capturing, scanProcessing]);

  const onSave = async () => {
    if (!canSubmit || saving) return;
    setSaving(true);
    try {
      const cat = category || "other";
      await addItem({
        name: name.trim(),
        sub: sub.trim(),
        expiry,
        storage: storage || "other",
        category: cat,
        icon:
          cat === "other"
            ? "jar"
            : ICON_OPTIONS[cat]?.[0] ?? "milk",
      });
      router.replace("/(tabs)/home");
    } finally {
      setSaving(false);
    }
  };

  const sheetWidth = Math.min(windowWidth - SPACING.xl * 2, 400);
  const pickerInnerWidth = Math.max(
    260,
    Math.min(sheetWidth - SPACING.lg * 2, 380)
  );

  const openExpiryPicker = useCallback(() => {
    const initial = expiry ? parseExpiry(expiry) : new Date();
    setPendingDate(initial);

    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: initial,
        mode: "date",
        display: "calendar",
        onChange: (event, date) => {
          if (event.type === "dismissed") return;
          if (event.type === "set" && date) {
            setPendingDate(date);
            setExpiry(toLocalIsoDate(date));
          }
        },
      });
      return;
    }

    setShowDatePicker(true);
  }, [expiry]);

  const confirmExpiryDate = () => {
    setExpiry(toLocalIsoDate(pendingDate));
    setShowDatePicker(false);
  };

  const dateLabel = expiry ? formatExpiryLong(expiry) : "Select expiry date";

  const placeholderName = PH[effectiveCategory] ?? PH.other;

  if (addPhase === "choose") {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={["top"]}>
        <View style={[styles.container, { backgroundColor: theme.bg }]}>
          <View style={[styles.chooseInner, styles.chooseCentered]}>
            <View style={styles.header}>
              <Pressable onPress={() => router.back()} hitSlop={12}>
                <Text style={[styles.back, { color: theme.sub }]}>Back</Text>
              </Pressable>
              <Text style={[styles.screenTitle, { color: theme.text }]}>Add item</Text>
            </View>

            <Pressable
              style={[
                styles.scanCard,
                { backgroundColor: theme.accent },
                ELEVATION.accent,
              ]}
              onPress={() => {
                setAddPhase("camera");
                if (permission && !permission.granted) {
                  requestPermission();
                }
              }}
            >
              <IconCamera color="#fff" size={24} />
              <Text style={styles.scanCardTitle}>Scan expiry date</Text>
              <Text style={styles.scanCardSubtitle}>Point camera at the label</Text>
            </Pressable>

            <Pressable
              style={[
                styles.manualCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  shadowColor: "#000",
                  shadowOpacity: 0.03,
                  shadowRadius: 2,
                  shadowOffset: { width: 0, height: 1 },
                  elevation: 1,
                },
              ]}
              onPress={openManual}
            >
              <IconPen color={theme.sub} size={22} />
              <Text style={[styles.manualCardTitle, { color: theme.text }]}>Add manually</Text>
              <Text style={[styles.manualCardSubtitle, { color: theme.sub }]}>
                Type name and expiry date
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (addPhase === "camera") {
    if (!permission) {
      return (
        <View style={styles.cameraFallback}>
          <ActivityIndicator color={COLORS.accent} />
        </View>
      );
    }

    if (!permission.granted) {
      return (
        <View style={[styles.cameraFallback, { padding: SPACING.xl }]}>
          <Text style={[styles.permText, { color: theme.text }]}>
            Camera access is needed to scan labels.
          </Text>
          <PrimaryButton label="Allow camera" onPress={requestPermission} />
          <Pressable onPress={() => setAddPhase("choose")} style={styles.permBack}>
            <Text style={{ color: theme.sub }}>Go back</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.cameraRoot}>
        <View style={styles.cameraHeader}>
          <Pressable
            onPress={() => setAddPhase("choose")}
            hitSlop={12}
            disabled={scanProcessing}
          >
            <Text style={[styles.cameraBackText, scanProcessing && { opacity: 0.4 }]}>
              Back
            </Text>
          </Pressable>
          <Text style={styles.cameraHeaderTitle}>Scan expiry date</Text>
        </View>
        <CameraView ref={cameraRef} style={styles.cameraPreview} facing="back" mode="picture" />
        {scanProcessing ? (
          <View style={styles.ocrOverlay} pointerEvents="auto">
            <Text style={styles.ocrOverlayTitle}>Reading expiry date…</Text>
            <View style={styles.ocrTrack}>
              <Animated.View style={[styles.ocrFill, ocrBarPulseStyle]} />
            </View>
          </View>
        ) : null}
        <View style={styles.cameraFooter}>
          <Pressable
            style={[styles.shutterOuter, (capturing || scanProcessing) && styles.shutterBusy]}
            onPress={onCapture}
            disabled={capturing || scanProcessing}
          >
            <View style={styles.shutterInner} />
          </Pressable>
          <Text style={styles.captureHint}>
            {scanProcessing
              ? "Reading expiry date…"
              : capturing
                ? "Capturing…"
                : "Tap to capture"}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={["top"]}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.bg }]}
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={[styles.back, { color: theme.sub }]}>Back</Text>
          </Pressable>
          <Text style={[styles.screenTitle, { color: theme.text }]}>
            {fromScan ? "Add item" : "Add manually"}
          </Text>
        </View>

        <Text style={[styles.fieldLabel, { color: theme.sub }]}>Product name ‧ required</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={placeholderName}
          placeholderTextColor={COLORS.muted}
          style={[
            styles.input,
            { borderColor: theme.border, color: theme.text, backgroundColor: theme.inputBg },
          ]}
        />

        {fromScan && expiryHint ? (
          <View
            style={[
              styles.expiryHintBanner,
              expiryHint.kind === "success" && styles.expiryHintSuccess,
              expiryHint.kind === "warn" && styles.expiryHintWarn,
              expiryHint.kind === "network" && [
                styles.expiryHintNetwork,
                { borderColor: theme.border, backgroundColor: theme.card },
              ],
            ]}
          >
            <Text
              style={[
                styles.expiryHintText,
                expiryHint.kind === "success" && { color: COLORS.success },
                expiryHint.kind === "warn" && { color: COLORS.accent },
                expiryHint.kind === "network" && { color: theme.sub },
              ]}
            >
              {expiryHint.message}
            </Text>
          </View>
        ) : null}

        <Text style={[styles.fieldLabel, { color: theme.sub }]}>Expiry date ‧ required</Text>
        <Pressable
          onPress={openExpiryPicker}
          style={[
            styles.dateTrigger,
            { borderColor: theme.border, backgroundColor: theme.inputBg },
          ]}
        >
          <Text style={[styles.dateTriggerText, { color: expiry ? theme.text : COLORS.muted }]}>
            {dateLabel}
          </Text>
        </Pressable>

        <Text style={[styles.fieldLabel, { color: theme.sub }]}>Category</Text>
        <View style={styles.wrap}>
          {CATEGORY_ROWS.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => setCategory(c.id)}
              style={[
                styles.pill,
                { borderColor: theme.border, backgroundColor: theme.card },
                category === c.id && styles.pillOn,
              ]}
            >
              <Text style={[styles.pillText, category === c.id && styles.pillTextOn]}>{c.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.fieldLabel, { color: theme.sub }]}>Quantity / size</Text>
        <TextInput
          value={sub}
          onChangeText={setSub}
          placeholder="e.g. 500 ml, 200 g (optional)"
          placeholderTextColor={COLORS.muted}
          style={[
            styles.input,
            { borderColor: theme.border, color: theme.text, backgroundColor: theme.inputBg },
          ]}
        />

        <Text style={[styles.fieldLabel, { color: theme.sub }]}>Stored in</Text>
        <View style={styles.wrap}>
          {STORES.map((entry) => (
            <Pressable
              key={entry.id}
              onPress={() => setStorage(entry.id)}
              style={[
                styles.pill,
                { borderColor: theme.border, backgroundColor: theme.card },
                storage === entry.id && styles.pillOn,
              ]}
            >
              <Text style={[styles.pillText, storage === entry.id && styles.pillTextOn]}>
                {entry.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <PrimaryButton
          onPress={onSave}
          disabled={!canSubmit}
          loading={saving}
          label="Add to shelf"
          style={styles.submitButton}
        />
      </ScrollView>

      {Platform.OS !== "android" && showDatePicker ? (
        <View style={styles.dateOverlayRoot} pointerEvents="box-none">
          <Pressable
            style={styles.dateOverlayDim}
            accessibilityLabel="Dismiss date picker"
            onPress={() => setShowDatePicker(false)}
          />
          <View
            style={[styles.dateSheet, { backgroundColor: theme.card, width: sheetWidth }]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>Expiry date</Text>
            <View style={[styles.pickerIosWrap, { width: pickerInnerWidth }]} collapsable={false}>
              <DateTimePicker
                value={pendingDate}
                mode="date"
                display="inline"
                themeVariant={mode === "dark" ? "dark" : "light"}
                accentColor={COLORS.accent}
                onChange={(_, date) => {
                  if (date) setPendingDate(date);
                }}
                style={{ width: pickerInnerWidth, height: 340 }}
              />
            </View>
            <PrimaryButton label="Done" onPress={confirmExpiryDate} style={styles.modalDone} />
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  chooseInner: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
  },
  chooseCentered: {
    justifyContent: "center",
    paddingBottom: SPACING.xxxl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    marginBottom: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  back: {
    fontSize: 16,
    fontWeight: "500",
  },
  screenTitle: {
    ...TYPOGRAPHY.title,
    fontSize: 17,
    fontWeight: "600",
  },
  scanCard: {
    borderRadius: RADIUS.xxl,
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  scanCardTitle: {
    ...TYPOGRAPHY.button,
    color: COLORS.white,
    fontSize: 15,
  },
  scanCardSubtitle: {
    ...TYPOGRAPHY.caption,
    color: ALPHA.white70,
  },
  manualCard: {
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
    alignItems: "center",
    gap: SPACING.sm,
  },
  manualCardTitle: {
    ...TYPOGRAPHY.button,
    fontSize: 15,
  },
  manualCardSubtitle: {
    ...TYPOGRAPHY.caption,
  },
  cameraRoot: {
    flex: 1,
    backgroundColor: COLORS.blackSoft,
  },
  cameraHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.md,
  },
  cameraBackText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "500",
  },
  cameraHeaderTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  cameraPreview: {
    flex: 1,
    marginHorizontal: SPACING.xl,
    borderRadius: RADIUS.xl,
    overflow: "hidden",
  },
  cameraFooter: {
    paddingVertical: SPACING.xxl,
    alignItems: "center",
    gap: SPACING.sm,
  },
  shutterOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBusy: {
    opacity: 0.6,
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
  },
  captureHint: {
    color: ALPHA.white70,
    ...TYPOGRAPHY.caption,
  },
  ocrOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 108,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  ocrOverlayTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  ocrTrack: {
    width: "100%",
    height: 5,
    borderRadius: 3,
    backgroundColor: ALPHA.white18,
    overflow: "hidden",
  },
  ocrFill: {
    height: "100%",
    width: "100%",
    borderRadius: 3,
    backgroundColor: COLORS.accent,
  },
  cameraFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surfaceSoft,
    gap: SPACING.md,
  },
  permText: {
    textAlign: "center",
    ...TYPOGRAPHY.body,
  },
  permBack: {
    marginTop: SPACING.sm,
  },
  formContent: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl + 24,
  },
  expiryHintBanner: {
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: SPACING.md,
    borderWidth: 1,
  },
  expiryHintSuccess: {
    borderColor: COLORS.success,
    backgroundColor: "rgba(46, 139, 68, 0.12)",
  },
  expiryHintWarn: {
    borderColor: COLORS.accent,
    backgroundColor: "#FFF8E8",
  },
  expiryHintNetwork: {
    borderWidth: 1,
  },
  expiryHintText: {
    ...TYPOGRAPHY.caption,
    fontWeight: "600",
    lineHeight: 20,
  },
  fieldLabel: {
    ...TYPOGRAPHY.overline,
    marginBottom: SPACING.xs + 2,
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  pill: {
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pillOn: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  pillText: {
    ...TYPOGRAPHY.caption,
    fontWeight: "500",
    color: COLORS.mutedDark,
  },
  pillTextOn: {
    color: COLORS.white,
  },
  input: {
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: SPACING.lg,
    fontSize: 14,
  },
  dateTrigger: {
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: SPACING.lg,
  },
  dateTriggerText: {
    fontSize: 14,
    fontWeight: "500",
  },
  submitButton: {
    marginTop: SPACING.sm,
  },
  dateOverlayRoot: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
    zIndex: 1000,
    elevation: 1000,
  },
  dateOverlayDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  dateSheet: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    maxWidth: 400,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  pickerIosWrap: {
    alignSelf: "center",
    marginVertical: SPACING.sm,
    overflow: "visible",
  },
  modalTitle: {
    ...TYPOGRAPHY.title,
    fontSize: 17,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  modalDone: {
    marginTop: SPACING.md,
  },
});
