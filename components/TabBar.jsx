import { useCallback, useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { COLORS } from "../constants/colors";
import { useTheme } from "../hooks/useTheme";

const ACCENT = COLORS.accent;
const STROKE_INACTIVE = 1.8;

function IconHome({ size, active, muted }) {
  const fill = active ? ACCENT : "none";
  const stroke = active ? ACCENT : muted;
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20">
      <Path
        d="M3 7.5l7-5.5 7 5.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V7.5z"
        fill={fill}
        stroke={stroke}
        strokeWidth={active ? 0 : STROKE_INACTIVE}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function IconBars({ size, active, muted }) {
  const fill = active ? ACCENT : "none";
  const stroke = active ? ACCENT : muted;
  const sw = active ? 0 : STROKE_INACTIVE;
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20">
      <Rect x="3" y="9" width="3" height="7" rx="1" fill={fill} stroke={stroke} strokeWidth={sw} />
      <Rect x="8.5" y="6" width="3" height="10" rx="1" fill={fill} stroke={stroke} strokeWidth={sw} />
      <Rect x="14" y="3" width="3" height="13" rx="1" fill={fill} stroke={stroke} strokeWidth={sw} />
    </Svg>
  );
}

function IconCart({ size, active, muted }) {
  const fill = active ? ACCENT : "none";
  const stroke = active ? ACCENT : muted;
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20">
      <Path
        d="M6 2L3 6v11a1 1 0 001 1h12a1 1 0 001-1V6l-3-4z"
        fill={fill}
        stroke={stroke}
        strokeWidth={active ? 0 : STROKE_INACTIVE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M3 6h14" stroke={stroke} strokeWidth={active ? 0 : STROKE_INACTIVE} strokeLinecap="round" />
      <Path
        d="M13 9a3 3 0 01-6 0"
        stroke={stroke}
        strokeWidth={active ? 0 : STROKE_INACTIVE}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function IconGear({ size, active, muted }) {
  const stroke = active ? ACCENT : muted;
  const sw = active ? 2 : STROKE_INACTIVE;
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18">
      <Circle cx="9" cy="9" r="2.2" fill={active ? ACCENT : "none"} stroke={stroke} strokeWidth={active ? 0 : sw} />
      <Path
        d="M14.7 11.3a1.2 1.2 0 00.24 1.3l.04.04a1.45 1.45 0 11-2.05 2.05l-.04-.04a1.2 1.2 0 00-1.3-.24 1.2 1.2 0 00-.73 1.1v.12a1.45 1.45 0 01-2.9 0v-.07a1.2 1.2 0 00-.79-1.1 1.2 1.2 0 00-1.3.24l-.04.04a1.45 1.45 0 11-2.05-2.05l.04-.04a1.2 1.2 0 00.24-1.3 1.2 1.2 0 00-1.1-.73H3.5a1.45 1.45 0 010-2.9h.07a1.2 1.2 0 001.1-.79 1.2 1.2 0 00-.24-1.3l-.04-.04a1.45 1.45 0 112.05-2.05l.04.04a1.2 1.2 0 001.3.24h.08a1.2 1.2 0 00.73-1.1V3.5a1.45 1.45 0 012.9 0v.07a1.2 1.2 0 00.73 1.1 1.2 1.2 0 001.3-.24l.04-.04a1.45 1.45 0 112.05 2.05l-.04.04a1.2 1.2 0 00-.24 1.3v.08a1.2 1.2 0 001.1.73h.12a1.45 1.45 0 010 2.9h-.07a1.2 1.2 0 00-1.1.73z"
        fill={active ? ACCENT : "none"}
        stroke={stroke}
        strokeWidth={active ? 0 : sw}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function IconPlus({ size, color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M11 5v12M5 11h12"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

const ICON_PX = 24;

const TABS = [
  { id: "home", label: "Home", icon: "home" },
  { id: "restock", label: "Restock", icon: "cart", badge: true },
  { id: "add", label: "Add", fab: true },
  { id: "stats", label: "Stats", icon: "bars" },
  { id: "settings", label: "Settings", icon: "gear" },
];

function TabLabel({ active, children, muted }) {
  const fade = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: active ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [active, fade]);

  const color = fade.interpolate({
    inputRange: [0, 1],
    outputRange: [muted, ACCENT],
  });

  return (
    <Animated.Text style={[styles.tabLabel, { color }]}>
      {children}
    </Animated.Text>
  );
}

/**
 * Bottom tab strip — PROTOTYPE_REFERENCE.jsx `TabBar`
 * @param {object} props
 * @param {"home"|"restock"|"stats"|"settings"|"add"} props.active
 * @param {(id: string) => void} props.onTab
 * @param {number} props.restockCount
 */
export default function TabBar({ active, onTab, restockCount = 0 }) {
  const { theme } = useTheme();
  const muted = theme.muted;

  const renderIcon = useCallback(
    (tab, isActive) => {
      const s = ICON_PX;
      switch (tab.icon) {
        case "home":
          return <IconHome size={s} active={isActive} muted={muted} />;
        case "cart":
          return <IconCart size={s} active={isActive} muted={muted} />;
        case "bars":
          return <IconBars size={s} active={isActive} muted={muted} />;
        case "gear":
          return <IconGear size={s} active={isActive} muted={muted} />;
        default:
          return null;
      }
    },
    [muted]
  );

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.border,
        },
      ]}
    >
      {TABS.map((tab) => {
        if (tab.fab) {
          return (
            <Pressable
              key="add"
              onPress={() => onTab("add")}
              style={({ pressed }) => [
                styles.fab,
                {
                  backgroundColor: theme.accent,
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                  shadowColor: "#F9A602",
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.35,
                  shadowRadius: 14,
                  elevation: 12,
                },
              ]}
            >
              <View style={styles.fabIconWrap}>
                <IconPlus size={ICON_PX} color="#fff" />
              </View>
              <Text style={[styles.fabCaption, { color: theme.sub }]}>Add</Text>
            </Pressable>
          );
        }

        const isActive = active === tab.id;
        const showBadge = tab.badge && restockCount > 0;

        return (
          <Pressable key={tab.id} onPress={() => onTab(tab.id)} style={styles.tab}>
            <View style={styles.iconSlot}>
              {renderIcon(tab, isActive)}
              {showBadge ? (
                <View style={[styles.badge, { backgroundColor: ACCENT }]}>
                  <Text style={styles.badgeText}>{restockCount}</Text>
                </View>
              ) : null}
            </View>
            <TabLabel active={isActive} muted={muted}>
              {tab.label}
            </TabLabel>
            <View style={styles.dotTrack}>
              <View style={[styles.dot, isActive && styles.dotActive]} />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    paddingBottom: 20,
    paddingTop: 0,
    borderTopWidth: 0.5,
    minHeight: 72,
    flexShrink: 0,
  },
  tab: {
    alignItems: "center",
    gap: 2,
    paddingVertical: 8,
    paddingHorizontal: 10,
    minWidth: 56,
  },
  iconSlot: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 24,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.2,
    marginTop: 2,
  },
  dotTrack: {
    height: 6,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "transparent",
  },
  dotActive: {
    backgroundColor: ACCENT,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 18,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  /** Keeps the + SVG above any future overlays; crisp icon without inner highlights. */
  fabIconWrap: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  fabCaption: {
    position: "absolute",
    bottom: -14,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
