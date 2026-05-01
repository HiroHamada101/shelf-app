import { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { ALPHA, COLORS } from "../../constants/colors";
import { CAT_LABELS } from "../../constants/categories";
import { RADIUS, SPACING } from "../../constants/layout";
import { FONTS, TYPOGRAPHY } from "../../constants/typography";
import SectionCard from "../../components/SectionCard";
import { useDatabase } from "../../hooks/useDatabase";
import { useTheme } from "../../hooks/useTheme";

const INR_PER_SAVED_ITEM = 150;

export default function StatsScreen() {
  const { theme } = useTheme();
  const { getStats, getCategoryBreakdown } = useDatabase();
  const [consumed, setConsumed] = useState(0);
  const [tossed, setTossed] = useState(0);
  const [breakdown, setBreakdown] = useState([]);

  const loadData = useCallback(async () => {
    const [stats, cats] = await Promise.all([getStats(), getCategoryBreakdown()]);
    setConsumed(stats.consumed);
    setTossed(stats.tossed);
    setBreakdown(cats);
  }, [getStats, getCategoryBreakdown]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const total = consumed + tossed;
  const usagePct = useMemo(
    () => (total === 0 ? 0 : Math.round((consumed / total) * 100)),
    [consumed, tossed]
  );

  const savings = useMemo(() => consumed * INR_PER_SAVED_ITEM, [consumed]);

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.bg }]}
      edges={["top"]}
    >
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.pageTitle, { color: theme.text }]}>Stats</Text>

      <View style={[styles.hero, { backgroundColor: theme.accent }]}>
        <Text
          style={[styles.heroPct, { fontFamily: FONTS.frauncesBold, color: COLORS.white }]}
        >
          {usagePct}%
        </Text>
        <Text style={[styles.heroSub, { color: ALPHA.white70 }]}>
          Used before expiry
        </Text>
        <View style={styles.heroRow}>
          <View style={[styles.heroBox, { backgroundColor: ALPHA.white18 }]}>
            <Text style={[styles.heroNum, { color: COLORS.white }]}>{consumed}</Text>
            <Text style={[styles.heroLabel, { color: ALPHA.white75 }]}>Consumed</Text>
          </View>
          <View style={[styles.heroBox, { backgroundColor: ALPHA.white18 }]}>
            <Text style={[styles.heroNum, { color: COLORS.white }]}>{tossed}</Text>
            <Text style={[styles.heroLabel, { color: ALPHA.white75 }]}>Tossed</Text>
          </View>
        </View>
        <Text style={[styles.heroFoot, { color: ALPHA.white60 }]}>
          Swipe counts since you started tracking on this device.
        </Text>
      </View>

      <View style={[styles.savingsCard, { backgroundColor: theme.accentLight }]}>
        <Text style={[styles.overline, { color: theme.accent }]}>Estimated savings</Text>
        <Text
          style={[
            styles.savingsAmount,
            { color: theme.accent, fontFamily: FONTS.frauncesBold },
          ]}
        >
          ₹{savings.toFixed(0)}
        </Text>
        <Text style={[styles.savingsHint, { color: theme.sub }]}>
          Rough guess: ~₹{INR_PER_SAVED_ITEM} per item you finish on time.
        </Text>
      </View>

      {breakdown.length > 0 && (
        <SectionCard style={styles.breakdown}>
          <Text style={[styles.overline, { color: theme.sub }]}>Category breakdown</Text>
          {breakdown.map((entry) => (
            <View key={entry.category} style={styles.breakdownRow}>
              <Text style={{ color: theme.text }}>
                {CAT_LABELS[entry.category] ?? entry.category}
              </Text>
              <Text style={{ color: theme.text, fontWeight: "700" }}>{entry.count}</Text>
            </View>
          ))}
        </SectionCard>
      )}

      <View style={[styles.premium, { backgroundColor: theme.accent }]}>
        <Text style={styles.premiumTitle}>Shelf Premium</Text>
        <Text style={[styles.premiumBody, { color: ALPHA.white70 }]}>
          Unlimited items, smart reminders, and deeper insights.
        </Text>
        <View style={styles.premiumCtaDisabled}>
          <Text style={[styles.premiumCtaTextMuted, { color: ALPHA.white70 }]}>
            Coming Soon
          </Text>
        </View>
      </View>
    </ScrollView>
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
  content: {
    padding: SPACING.xxl,
    paddingBottom: SPACING.xxxl + 24,
  },
  pageTitle: {
    ...TYPOGRAPHY.display,
    fontSize: 32,
  },
  hero: {
    marginTop: SPACING.lg,
    borderRadius: RADIUS.xxl,
    padding: SPACING.xl,
    alignItems: "center",
  },
  heroPct: {
    fontSize: 56,
    lineHeight: 58,
    letterSpacing: -1.5,
  },
  heroSub: {
    ...TYPOGRAPHY.subtitle,
    marginTop: SPACING.xs,
    textAlign: "center",
  },
  heroRow: {
    marginTop: SPACING.xl,
    flexDirection: "row",
    gap: SPACING.sm,
    alignSelf: "stretch",
  },
  heroBox: {
    flex: 1,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    alignItems: "center",
  },
  heroNum: {
    fontSize: 22,
    fontWeight: "700",
  },
  heroLabel: {
    ...TYPOGRAPHY.caption,
    marginTop: 2,
  },
  heroFoot: {
    ...TYPOGRAPHY.caption,
    marginTop: SPACING.md,
    textAlign: "center",
  },
  savingsCard: {
    marginTop: SPACING.md,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  overline: {
    ...TYPOGRAPHY.overline,
  },
  savingsAmount: {
    marginTop: SPACING.xs,
    fontSize: 36,
    lineHeight: 40,
  },
  savingsHint: {
    ...TYPOGRAPHY.caption,
    marginTop: SPACING.sm,
  },
  breakdown: {
    marginTop: SPACING.md,
    padding: SPACING.lg - 2,
    gap: SPACING.sm,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SPACING.xs,
  },
  premium: {
    marginTop: SPACING.md,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl - 2,
  },
  premiumTitle: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  premiumBody: {
    ...TYPOGRAPHY.subtitle,
    marginTop: SPACING.xs,
    textAlign: "center",
  },
  premiumCtaDisabled: {
    marginTop: SPACING.md,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: RADIUS.md,
    paddingHorizontal: 18,
    paddingVertical: SPACING.sm,
    opacity: 0.85,
  },
  premiumCtaTextMuted: {
    ...TYPOGRAPHY.button,
    fontWeight: "700",
  },
});
