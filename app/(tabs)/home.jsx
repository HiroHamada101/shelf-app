import { router } from "expo-router";
import * as Notifications from "expo-notifications";
import { useCallback, useMemo, useState } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { CATS } from "../../constants/categories";
import { COLORS } from "../../constants/colors";
import ItemRow from "../../components/ItemRow";
import PrimaryButton from "../../components/PrimaryButton";
import ShelfLogo from "../../components/ShelfLogo";
import { RADIUS, SPACING } from "../../constants/layout";
import { TYPOGRAPHY } from "../../constants/typography";
import { useDatabase } from "../../hooks/useDatabase";
import { useTheme } from "../../hooks/useTheme";
import { daysUntil } from "../../utils/dates";

export default function HomeScreen() {
  const { mode, theme } = useTheme();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { getItems, consumeItem, tossItem } = useDatabase();
  const [items, setItems] = useState([]);
  const [notificationsDenied, setNotificationsDenied] = useState(false);

  const loadItems = useCallback(async () => {
    const nextItems = await getItems();
    setItems(nextItems);
  }, [getItems]);

  const handleSwipe = useCallback(
    async (item, action) => {
      try {
        if (action === "consumed") {
          await consumeItem(item);
        } else {
          await tossItem(item);
        }
        await loadItems();
      } catch {
        /* ignore */
      }
    },
    [consumeItem, tossItem, loadItems]
  );

  useFocusEffect(
    useCallback(() => {
      loadItems();
      let cancelled = false;
      (async () => {
        try {
          const { status } = await Notifications.getPermissionsAsync();
          if (!cancelled) setNotificationsDenied(status === "denied");
        } catch {
          if (!cancelled) setNotificationsDenied(false);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [loadItems])
  );

  const filteredItems = useMemo(() => {
    if (categoryFilter === "all") return items;
    return items.filter((item) => item.category === categoryFilter);
  }, [items, categoryFilter]);

  const expired = filteredItems.filter((item) => daysUntil(item.expiry) < 0);
  const expiring = filteredItems.filter((item) => {
    const days = daysUntil(item.expiry);
    return days >= 0 && days <= 3;
  });
  const fresh = filteredItems.filter((item) => daysUntil(item.expiry) > 3);
  const statCardBgs = useMemo(
    () =>
      mode === "dark"
        ? {
            expired: "rgba(224, 96, 80, 0.22)",
            expiring: "rgba(212, 168, 64, 0.2)",
            fresh: "rgba(90, 170, 101, 0.22)",
            total: theme.accentLight,
          }
        : {
            expired: "rgba(212, 67, 50, 0.1)",
            expiring: "rgba(192, 139, 30, 0.14)",
            fresh: "rgba(46, 139, 68, 0.12)",
            total: theme.accentLight,
          },
    [mode, theme.accentLight]
  );

  const sections = [
    { key: "expired", label: "Expired", items: expired, dot: theme.urgentDot },
    { key: "soon", label: "Use soon", items: expiring, dot: theme.warnDot },
    { key: "fresh", label: "Fresh", items: fresh, dot: theme.okDot },
  ];

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.bg }]}
      edges={["top"]}
    >
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <View style={styles.header}>
          <ShelfLogo size={30} />
          <Text style={[styles.brand, { color: theme.accent }]}>Shelf.</Text>
        </View>
        {notificationsDenied ? (
          <View
            style={[
              styles.notifyBanner,
              {
                backgroundColor: theme.accentLight,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.notifyBannerText, { color: theme.sub }]}>
              Enable notifications to get expiry reminders
            </Text>
            <Pressable
              onPress={() => Linking.openSettings()}
              hitSlop={8}
              style={styles.notifyBannerBtn}
            >
              <Text style={[styles.notifyBannerBtnText, { color: theme.accent }]}>
                Open Settings
              </Text>
            </Pressable>
          </View>
        ) : null}
        {items.length === 0 ? (
          <>
            <View style={[styles.emptyCircle, { backgroundColor: theme.accentLight }]}>
              <ShelfLogo size={40} backgroundColor="transparent" foregroundColor={theme.accent} />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>Your shelf is empty</Text>
            <Text style={[styles.body, { color: theme.sub }]}>
              Start by adding your first item.
            </Text>
            <PrimaryButton
              label="+ Add your first item"
              onPress={() => router.push("/add")}
              style={styles.button}
            />
            <View style={styles.hintRow}>
              {[
                { emoji: "🍚", label: "Food" },
                { emoji: "💊", label: "Medicine" },
                { emoji: "🧴", label: "Beauty" },
              ].map((entry) => (
                <View key={entry.label} style={styles.hintTile}>
                  <Text style={styles.hintEmoji}>{entry.emoji}</Text>
                  <Text style={[styles.hintLabel, { color: theme.sub }]}>{entry.label}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <>
            <View style={styles.statsCardsRow}>
              {[
                {
                  key: "expired",
                  count: expired.length,
                  label: "expired",
                  color: theme.urgent,
                  bg: statCardBgs.expired,
                },
                {
                  key: "expiring",
                  count: expiring.length,
                  label: "expiring",
                  color: theme.warn,
                  bg: statCardBgs.expiring,
                },
                {
                  key: "fresh",
                  count: fresh.length,
                  label: "fresh",
                  color: theme.ok,
                  bg: statCardBgs.fresh,
                },
                {
                  key: "total",
                  count: items.length,
                  label: "total",
                  color: theme.accent,
                  bg: statCardBgs.total,
                },
              ].map((s) => (
                <View
                  key={s.key}
                  style={[styles.statCard, { backgroundColor: s.bg }]}
                >
                  <Text style={[styles.statNumber, { color: s.color }]}>{s.count}</Text>
                  <Text style={[styles.statLabel, { color: theme.sub }]}>{s.label}</Text>
                </View>
              ))}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pillScrollContent}
              style={styles.pillScroll}
            >
              {CATS.map((cat) => {
                const selected = categoryFilter === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => setCategoryFilter(cat.id)}
                    style={[
                      styles.catPill,
                      {
                        borderColor: selected ? theme.accent : theme.border,
                        backgroundColor: selected ? theme.accentLight : theme.card,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.catPillText,
                        { color: selected ? theme.accent : theme.text },
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            <ScrollView
              style={styles.listScroll}
              contentContainerStyle={styles.list}
            >
              {filteredItems.length === 0 && items.length > 0 ? (
                <Text style={[styles.filterEmpty, { color: theme.sub }]}>
                  No items in this category. Try another filter.
                </Text>
              ) : (
                <View style={styles.sectionsColumn}>
                  {sections.map((section) =>
                    section.items.length > 0 ? (
                      <View key={section.key}>
                        <View style={styles.sectionHead}>
                          <View style={[styles.sectionDot, { backgroundColor: section.dot }]} />
                          <Text style={[styles.sectionTitle, { color: theme.sub }]}>
                            {section.label}
                          </Text>
                          <Text style={[styles.sectionCount, { color: theme.muted }]}>
                            {section.items.length}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.sectionBody,
                            {
                              borderRadius: 14,
                              overflow: "hidden",
                              shadowColor: "#000",
                              shadowOffset: { width: 0, height: 1 },
                              shadowOpacity: 0.03,
                              shadowRadius: 2,
                              elevation: 1,
                            },
                          ]}
                        >
                          {section.items.map((item) => (
                            <ItemRow
                              key={item.id}
                              item={item}
                              onPress={() => router.push(`/detail/${item.id}`)}
                              onSwipe={handleSwipe}
                            />
                          ))}
                        </View>
                      </View>
                    ) : null
                  )}
                </View>
              )}
              <Text style={[styles.swipeHint, { color: theme.muted }]}>
                swipe right = used · swipe left = tossed
              </Text>
            </ScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: SPACING.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: 12,
  },
  brand: {
    fontSize: 26,
    fontWeight: "700",
  },
  notifyBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: SPACING.md,
  },
  notifyBannerText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  notifyBannerBtn: {
    flexShrink: 0,
  },
  notifyBannerBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
  statsCardsRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xs,
    borderRadius: RADIUS.md,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 32,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: SPACING.xs,
    textAlign: "center",
  },
  pillScroll: {
    marginBottom: 10,
    flexGrow: 0,
  },
  pillScrollContent: {
    flexDirection: "row",
    gap: SPACING.sm,
    paddingRight: SPACING.xl,
    paddingVertical: 2,
  },
  catPill: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  catPillText: {
    fontSize: 14,
    fontWeight: "600",
  },
  listScroll: {
    flex: 1,
  },
  list: {
    flexGrow: 1,
    paddingBottom: SPACING.xxl,
  },
  sectionsColumn: {
    gap: 10,
  },
  filterEmpty: {
    ...TYPOGRAPHY.body,
    textAlign: "center",
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs + 1,
    marginBottom: 4,
  },
  sectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  sectionCount: {
    ...TYPOGRAPHY.caption,
  },
  sectionBody: {},
  swipeHint: {
    ...TYPOGRAPHY.caption,
    textAlign: "center",
    paddingTop: 4,
  },
  emptyCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 80,
  },
  title: {
    ...TYPOGRAPHY.title,
    marginTop: SPACING.xl,
    fontWeight: "600",
    textAlign: "center",
  },
  body: {
    ...TYPOGRAPHY.body,
    marginTop: SPACING.sm,
    textAlign: "center",
  },
  button: {
    marginTop: SPACING.xxl,
    alignSelf: "center",
  },
  hintRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: SPACING.lg,
    marginTop: 28,
  },
  hintTile: {
    alignItems: "center",
    gap: SPACING.xs + 2,
  },
  hintEmoji: {
    fontSize: 24,
  },
  hintLabel: {
    ...TYPOGRAPHY.caption,
  },
});
