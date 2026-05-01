import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS } from "../../constants/colors";
import { RADIUS, SPACING } from "../../constants/layout";
import { TYPOGRAPHY } from "../../constants/typography";
import ProductLetterAvatar from "../../components/ProductLetterAvatar";
import { inferCategoryFromIcon } from "../../constants/categories";
import SectionCard from "../../components/SectionCard";
import { useDatabase } from "../../hooks/useDatabase";
import { useTheme } from "../../hooks/useTheme";
import { formatDate } from "../../utils/dates";

function reasonLabel(reason) {
  if (reason === "tossed") return "Tossed";
  if (reason === "expired") return "Expired";
  if (reason === "used") return "Used";
  if (!reason) return "";
  return reason.charAt(0).toUpperCase() + reason.slice(1);
}

export default function RestockScreen() {
  const { theme } = useTheme();
  const { getBuyList, removeBuyItem, clearBuyList } = useDatabase();
  const [items, setItems] = useState([]);
  const [checked, setChecked] = useState({});

  const loadList = useCallback(async () => {
    const list = await getBuyList();
    setItems(list);
  }, [getBuyList]);

  useFocusEffect(
    useCallback(() => {
      loadList();
    }, [loadList])
  );

  const doneCount = useMemo(
    () => Object.values(checked).filter(Boolean).length,
    [checked]
  );

  const toggleCheck = (id) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.bg }]}
      edges={["top"]}
    >
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Text style={[styles.title, { color: theme.text }]}>Restock</Text>
          {items.length > 0 && (
            <Pressable
              hitSlop={8}
              onPress={async () => {
                await clearBuyList();
                setChecked({});
                await loadList();
              }}
            >
              <Text style={{ color: theme.accent, fontWeight: "700" }}>Clear all</Text>
            </Pressable>
          )}
        </View>
        <Text style={[styles.subtitle, { color: theme.sub }]}>
          Auto-added when items expire, get tossed, or you mark them used
        </Text>

        {items.length === 0 ? (
          <SectionCard
            style={[
              styles.emptyCard,
              { borderColor: theme.border, backgroundColor: theme.card },
            ]}
          >
            <Text style={styles.cartIcon} accessibilityLabel="Empty cart">
              🛒
            </Text>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>Nothing here yet</Text>
            <Text style={[styles.emptyBody, { color: theme.sub }]}>
              When something expires, you toss it, or you mark it used from the home list, it
              appears here so you can restock. Check things off as you shop.
            </Text>
          </SectionCard>
        ) : (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.list}
            >
              <View
                style={[
                  styles.listCard,
                  { borderColor: theme.border, backgroundColor: theme.card },
                ]}
              >
                {items.map((item, index) => {
                  const isChecked = !!checked[item.id];
                  const meta = `${reasonLabel(item.reason)} · ${formatDate(item.date)}`;
                  return (
                    <View
                      key={item.id}
                      style={[
                        styles.row,
                        index > 0 && { borderTopWidth: 1, borderTopColor: theme.border },
                      ]}
                    >
                      <Pressable
                        style={[
                          styles.check,
                          {
                            borderColor: isChecked ? theme.accent : theme.muted,
                            backgroundColor: isChecked ? theme.accent : "transparent",
                          },
                        ]}
                        onPress={() => toggleCheck(item.id)}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: isChecked }}
                      >
                        <Text style={styles.checkMark}>{isChecked ? "✓" : ""}</Text>
                      </Pressable>
                      <ProductLetterAvatar
                        name={item.name}
                        category={item.category ?? inferCategoryFromIcon(item.icon)}
                      />
                      <View style={styles.rowText}>
                        <Text
                          style={[
                            styles.itemName,
                            { color: theme.text },
                            isChecked && styles.strike,
                          ]}
                          numberOfLines={2}
                        >
                          {item.name}
                        </Text>
                        <Text
                          style={[
                            styles.itemMeta,
                            { color: theme.sub },
                            isChecked && styles.strike,
                          ]}
                        >
                          {meta}
                        </Text>
                      </View>
                      <Pressable
                        hitSlop={10}
                        onPress={async () => {
                          await removeBuyItem(item.id);
                          setChecked((prev) => {
                            const next = { ...prev };
                            delete next[item.id];
                            return next;
                          });
                          await loadList();
                        }}
                        accessibilityRole="button"
                        accessibilityLabel={`Delete ${item.name} from restock list`}
                      >
                        <Text style={[styles.deleteLabel, { color: COLORS.danger }]}>
                          Delete
                        </Text>
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
            {doneCount > 0 && (
              <View style={[styles.banner, { backgroundColor: theme.accentLight }]}>
                <Text style={{ color: theme.accent, fontWeight: "700" }}>
                  {doneCount} checked off
                </Text>
              </View>
            )}
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
    padding: SPACING.xxl,
  },
  title: {
    ...TYPOGRAPHY.display,
    fontSize: 32,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    marginTop: SPACING.sm,
    lineHeight: 18,
  },
  list: {
    paddingTop: SPACING.lg,
    paddingBottom: 88,
  },
  listCard: {
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  checkMark: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
  itemName: {
    ...TYPOGRAPHY.subtitle,
    fontWeight: "600",
  },
  itemMeta: {
    ...TYPOGRAPHY.caption,
    marginTop: 2,
  },
  strike: {
    textDecorationLine: "line-through",
  },
  deleteLabel: {
    ...TYPOGRAPHY.caption,
    fontWeight: "700",
    fontSize: 13,
  },
  emptyCard: {
    marginTop: SPACING.xl,
    borderWidth: 1,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: "center",
  },
  cartIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    ...TYPOGRAPHY.title,
    marginTop: SPACING.md,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyBody: {
    ...TYPOGRAPHY.subtitle,
    marginTop: SPACING.sm,
    textAlign: "center",
    lineHeight: 20,
  },
  banner: {
    position: "absolute",
    left: SPACING.xxl,
    right: SPACING.xxl,
    bottom: SPACING.lg,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: "center",
  },
});
