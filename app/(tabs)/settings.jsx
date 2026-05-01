import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/layout";
import { TYPOGRAPHY } from "../../constants/typography";
import SectionCard from "../../components/SectionCard";
import Toggle from "../../components/Toggle";
import { auth } from "../../config/firebase";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import {
  BEFORE_EXPIRY_LEAD_OPTIONS,
  NOTIFY_TIME_OPTIONS,
  getNotificationPrefs,
  setBeforeExpiryLeadDays,
  setNotificationPref,
  setNotifyTime,
} from "../../utils/notificationPrefs";
import { rescheduleAllNotifications } from "../../utils/notifications";

const appVersion =
  Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? "1.0.0";

export default function SettingsScreen() {
  const { mode, theme, toggleMode } = useTheme();
  const { phone } = useAuth();
  const [notify, setNotify] = useState({
    beforeExpiry: true,
    dailySummary: false,
    expiredAlert: true,
    beforeExpiryLeadDays: 3,
    notifyTime: "09:00",
  });

  useEffect(() => {
    let active = true;
    getNotificationPrefs().then((prefs) => {
      if (active) setNotify(prefs);
    });
    return () => {
      active = false;
    };
  }, []);

  const updateNotify = useCallback(async (key, value) => {
    setNotify((prev) => ({ ...prev, [key]: value }));
    await setNotificationPref(key, value);
    if (key === "beforeExpiry") {
      await rescheduleAllNotifications();
    }
  }, []);

  const pickLeadDays = useCallback(async (days) => {
    setNotify((prev) => ({ ...prev, beforeExpiryLeadDays: days }));
    await setBeforeExpiryLeadDays(days);
    await rescheduleAllNotifications();
  }, []);

  const pickNotifyTime = useCallback(async (value) => {
    setNotify((prev) => ({ ...prev, notifyTime: value }));
    await setNotifyTime(value);
    await rescheduleAllNotifications();
  }, []);

  const onSignOut = async () => {
    await auth().signOut();
    router.replace("/(auth)/phone");
  };

  const phoneDisplay =
    phone && phone.length === 10 ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}` : "—";

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.bg }]}
      edges={["top"]}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

        <Text style={[styles.sectionOverline, { color: theme.sub }]}>Appearance</Text>
        <SectionCard style={styles.card}>
          <View style={styles.row}>
            <View>
              <Text style={[styles.label, { color: theme.text }]}>Dark mode</Text>
              <Text style={[styles.hint, { color: theme.sub }]}>
                Saved on this device (Async Storage)
              </Text>
            </View>
            <Toggle value={mode === "dark"} onValueChange={toggleMode} />
          </View>
        </SectionCard>

        <Text style={[styles.sectionOverline, { color: theme.sub, marginTop: SPACING.lg }]}>
          Notifications
        </Text>
        <SectionCard style={styles.card}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.text }]}>Before expiry</Text>
            <Toggle
              value={notify.beforeExpiry}
              onValueChange={(v) => updateNotify("beforeExpiry", v)}
            />
          </View>
          {notify.beforeExpiry ? (
            <>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <Text style={[styles.leadCaption, { color: theme.sub }]}>
                Remind me before expiry
              </Text>
              <View style={styles.pillWrap}>
                {BEFORE_EXPIRY_LEAD_OPTIONS.map((d) => {
                  const on = notify.beforeExpiryLeadDays === d;
                  return (
                    <Pressable
                      key={d}
                      onPress={() => pickLeadDays(d)}
                      style={[
                        styles.pill,
                        {
                          borderColor: on ? theme.accent : theme.border,
                          backgroundColor: on ? theme.accentLight : theme.card,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.pillText,
                          { color: on ? theme.accent : theme.text },
                        ]}
                      >
                        {d} day{d === 1 ? "" : "s"}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <Text style={[styles.leadCaption, { color: theme.sub }]}>
                Notification time
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.timePillRow}
              >
                {NOTIFY_TIME_OPTIONS.map((opt) => {
                  const on = notify.notifyTime === opt.value;
                  return (
                    <Pressable
                      key={opt.value}
                      onPress={() => pickNotifyTime(opt.value)}
                      style={[
                        styles.pill,
                        {
                          borderColor: on ? theme.accent : theme.border,
                          backgroundColor: on ? theme.accentLight : theme.card,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.pillText,
                          { color: on ? theme.accent : theme.text },
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </>
          ) : null}
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.text }]}>Daily summary</Text>
            <Toggle
              value={notify.dailySummary}
              onValueChange={(v) => updateNotify("dailySummary", v)}
            />
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.text }]}>Expired alert</Text>
            <Toggle
              value={notify.expiredAlert}
              onValueChange={(v) => updateNotify("expiredAlert", v)}
            />
          </View>
        </SectionCard>

        <Text style={[styles.sectionOverline, { color: theme.sub, marginTop: SPACING.lg }]}>
          Account
        </Text>
        <SectionCard style={styles.card}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.text }]}>Phone</Text>
            <Text style={[styles.value, { color: theme.sub }]}>{phoneDisplay}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.text }]}>Plan</Text>
            <Text style={[styles.value, { color: theme.sub }]}>Free</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.text }]}>Export</Text>
            <Text style={[styles.value, { color: theme.sub }]}>Soon</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.text }]}>Version</Text>
            <Text style={[styles.value, { color: theme.sub }]}>{appVersion}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <Pressable style={styles.row} onPress={onSignOut}>
            <Text style={[styles.label, { color: COLORS.danger }]}>Sign out</Text>
          </Pressable>
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: SPACING.xxl,
    paddingBottom: SPACING.xxxl + 32,
  },
  title: {
    ...TYPOGRAPHY.display,
    fontSize: 32,
  },
  sectionOverline: {
    ...TYPOGRAPHY.overline,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  card: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.lg,
  },
  row: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACING.md,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
  },
  label: {
    ...TYPOGRAPHY.subtitle,
    fontSize: 15,
    flexShrink: 1,
  },
  hint: {
    ...TYPOGRAPHY.caption,
    marginTop: 2,
    maxWidth: 220,
  },
  value: {
    ...TYPOGRAPHY.subtitle,
    fontSize: 15,
  },
  leadCaption: {
    ...TYPOGRAPHY.caption,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  pillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  timePillRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingBottom: SPACING.sm,
    paddingRight: SPACING.xxl,
  },
  pill: {
    borderWidth: 1.5,
    borderRadius: RADIUS.md,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  pillText: {
    ...TYPOGRAPHY.caption,
    fontWeight: "700",
    fontSize: 12,
  },
});
