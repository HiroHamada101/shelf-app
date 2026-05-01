import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CAT_LABELS, STORES } from "../../constants/categories";
import { RADIUS, SPACING } from "../../constants/layout";
import { FONTS, TYPOGRAPHY } from "../../constants/typography";
import ProductLetterAvatar from "../../components/ProductLetterAvatar";
import SectionCard from "../../components/SectionCard";
import { useDatabase } from "../../hooks/useDatabase";
import { useTheme } from "../../hooks/useTheme";
import { daysUntil, formatDate } from "../../utils/dates";

function expiryProgressPct(days) {
  if (days < 0) return 100;
  if (days <= 14) {
    return Math.max(8, Math.min(100, ((14 - days) / 14) * 100));
  }
  return 12;
}

function storageLabel(id) {
  return STORES.find((s) => s.id === id)?.label ?? id;
}

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const { getItem, deleteItem } = useDatabase();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadItem() {
      if (!id) {
        setLoading(false);
        return;
      }
      const data = await getItem(Number(id));
      if (!cancelled) {
        setItem(data || null);
        setLoading(false);
      }
    }
    loadItem();
    return () => {
      cancelled = true;
    };
  }, [id, getItem]);

  const days = item ? daysUntil(item.expiry) : 0;

  const statusColor = useMemo(() => {
    if (days < 0) return theme.urgent;
    if (days <= 3) return theme.warn;
    return theme.ok;
  }, [days, theme]);

  const daysMainLine = useMemo(() => {
    if (days < 0) return String(Math.abs(days));
    if (days === 0) return "0";
    return String(days);
  }, [days]);

  const daysSubLine = useMemo(() => {
    if (days < 0) return days === -1 ? "day overdue" : "days overdue";
    if (days === 0) return "Expires today";
    if (days === 1) return "day left";
    return "days left";
  }, [days]);

  const progress = item ? expiryProgressPct(days) : 0;

  const onRemove = async () => {
    if (!item) return;
    await deleteItem(item.id);
    router.replace("/(tabs)/home");
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.bg }]}>
        <ActivityIndicator color={theme.accent} />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.bg }]}>
        <Text style={{ color: theme.sub }}>Item not found.</Text>
      </View>
    );
  }

  const catLabel = CAT_LABELS[item.category] ?? item.category;
  const storeLabel = storageLabel(item.storage);

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.bg }]} edges={["top"]}>
      <View style={styles.header}>
        <Pressable hitSlop={12} onPress={() => router.back()}>
          <Text style={[styles.headerLink, { color: theme.sub }]}>Back</Text>
        </Pressable>
        <Pressable hitSlop={12} onPress={onRemove}>
          <Text style={[styles.headerLink, { color: theme.urgent, fontWeight: "600" }]}>
            Remove
          </Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.hero}>
          <ProductLetterAvatar
            name={item.name}
            category={item.category}
            size={64}
            fontSize={24}
          />
          <Text
            style={[
              styles.name,
              { color: theme.text, fontFamily: FONTS.frauncesRegular },
            ]}
          >
            {item.name}
          </Text>
          {!!item.sub && (
            <Text style={[styles.subtitle, { color: theme.sub }]}>{item.sub}</Text>
          )}
          <Text style={[styles.metaLine, { color: theme.sub }]}>
            {catLabel} · {storeLabel}
          </Text>

          <View style={styles.daysBlock}>
            <Text
              style={[
                styles.daysNumber,
                { color: statusColor, fontFamily: FONTS.frauncesBold },
              ]}
            >
              {daysMainLine}
            </Text>
            <Text style={[styles.daysLabel, { color: statusColor }]}>{daysSubLine}</Text>
          </View>

          <Text style={[styles.useBy, { color: theme.sub }]}>
            Use by {formatDate(item.expiry)}
          </Text>

          <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%`, backgroundColor: statusColor },
              ]}
            />
          </View>
        </View>

        <SectionCard style={styles.infoCard}>
          {[
            { label: "Added", value: formatDate(item.added) },
            { label: "Expires", value: formatDate(item.expiry) },
            { label: "Category", value: catLabel },
            { label: "Storage", value: storeLabel },
          ].map((row, index) => (
            <View
              key={row.label}
              style={[
                styles.infoRow,
                index < 3 && { borderBottomWidth: 1, borderBottomColor: theme.border },
              ]}
            >
              <Text style={[styles.infoLabel, { color: theme.sub }]}>{row.label}</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{row.value}</Text>
            </View>
          ))}
        </SectionCard>

        <Pressable
          onPress={onRemove}
          style={({ pressed }) => [
            styles.removeBtn,
            {
              borderColor: theme.urgent,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text style={[styles.removeBtnText, { color: theme.urgent }]}>Remove</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  headerLink: {
    ...TYPOGRAPHY.subtitle,
    fontSize: 15,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xxl,
    paddingBottom: SPACING.xxxl,
  },
  hero: {
    alignItems: "center",
    paddingTop: SPACING.md,
  },
  name: {
    fontSize: 22,
    marginTop: SPACING.md,
    textAlign: "center",
  },
  subtitle: {
    ...TYPOGRAPHY.subtitle,
    marginTop: SPACING.xs + 2,
    textAlign: "center",
  },
  metaLine: {
    ...TYPOGRAPHY.caption,
    marginTop: SPACING.xs + 2,
    textAlign: "center",
  },
  daysBlock: {
    marginTop: SPACING.xl,
    alignItems: "center",
  },
  daysNumber: {
    fontSize: 48,
    lineHeight: 52,
    letterSpacing: -1,
  },
  daysLabel: {
    ...TYPOGRAPHY.subtitle,
    fontWeight: "600",
    marginTop: SPACING.xs,
  },
  useBy: {
    ...TYPOGRAPHY.subtitle,
    marginTop: SPACING.sm + 2,
  },
  progressTrack: {
    marginTop: SPACING.lg,
    alignSelf: "stretch",
    maxWidth: 280,
    width: "100%",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  infoCard: {
    marginTop: SPACING.xl,
    overflow: "hidden",
    borderRadius: RADIUS.lg,
  },
  infoRow: {
    minHeight: 48,
    paddingHorizontal: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoLabel: {
    ...TYPOGRAPHY.subtitle,
  },
  infoValue: {
    ...TYPOGRAPHY.subtitle,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
    marginLeft: SPACING.md,
  },
  removeBtn: {
    marginTop: SPACING.xl,
    borderWidth: 1.5,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: "center",
  },
  removeBtnText: {
    ...TYPOGRAPHY.button,
  },
});
