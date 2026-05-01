import { useCallback, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../hooks/useTheme";
import { daysUntil, formatDate } from "../utils/dates";
import ProductLetterAvatar from "./ProductLetterAvatar";

const SWIPE_THRESHOLD = 70;
const OFFSCREEN = 400;

/**
 * List row with swipe — PROTOTYPE_REFERENCE.jsx `ItemRow`
 * Swipe right → used (consumed), swipe left → tossed
 * @param {object} props
 * @param {object} props.item
 * @param {() => void} [props.onPress]
 * @param {(item: object, action: "consumed"|"tossed") => void} [props.onSwipe]
 */
export default function ItemRow({ item, onPress, onSwipe }) {
  const { theme } = useTheme();
  const exp = item?.expiry ?? item?.exp;
  const days = daysUntil(exp ?? new Date().toISOString().split("T")[0]);

  let statusColor = theme.ok;
  let statusLabel = `${days}d`;
  if (days < 0) {
    statusColor = theme.urgent;
    statusLabel = `${Math.abs(days)}d ago`;
  } else if (days === 0) {
    statusColor = theme.urgent;
    statusLabel = "today";
  } else if (days <= 3) {
    statusColor = theme.warn;
    statusLabel = `${days}d`;
  }

  const translateX = useSharedValue(0);
  const dismissed = useSharedValue(false);

  useEffect(() => {
    translateX.value = 0;
    dismissed.value = false;
  }, [item?.id]);

  const fireToss = useCallback(() => {
    onSwipe?.(item, "tossed");
  }, [item, onSwipe]);

  const fireConsume = useCallback(() => {
    onSwipe?.(item, "consumed");
  }, [item, onSwipe]);

  const firePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  const tap = Gesture.Tap().onEnd(() => {
    if (onPress) runOnJS(firePress)();
  });

  const pan = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .onUpdate((e) => {
      if (dismissed.value) return;
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (dismissed.value) return;
      const x = e.translationX;
      if (x < -SWIPE_THRESHOLD) {
        dismissed.value = true;
        translateX.value = withTiming(-OFFSCREEN, { duration: 250 }, (fin) => {
          if (fin) runOnJS(fireToss)();
        });
      } else if (x > SWIPE_THRESHOLD) {
        dismissed.value = true;
        translateX.value = withTiming(OFFSCREEN, { duration: 250 }, (fin) => {
          if (fin) runOnJS(fireConsume)();
        });
      } else {
        translateX.value = withSpring(0);
      }
    });

  const gesture = Gesture.Exclusive(pan, tap);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.shell}>
      <View style={styles.backRow}>
        <View style={[styles.backLeft, { backgroundColor: theme.ok }]}>
          <Text style={styles.backLabel}>Used</Text>
        </View>
        <View style={[styles.backRight, { backgroundColor: theme.urgent }]}>
          <Text style={styles.backLabel}>Tossed</Text>
        </View>
      </View>
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            styles.row,
            frontStyle,
            {
              backgroundColor: theme.card,
              borderBottomColor: theme.border,
            },
          ]}
        >
          <ProductLetterAvatar name={item?.name} category={item?.category} />
          <View style={styles.content}>
            <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
              {item?.name ?? "Item"}
            </Text>
            <Text style={[styles.meta, { color: theme.muted }]} numberOfLines={1}>
              {item?.sub || "—"} · {formatDate(exp ?? "2000-01-01")}
            </Text>
          </View>
          <View style={styles.statusWrap}>
            <View style={[styles.dot, { backgroundColor: statusColor }]} />
            <Text style={[styles.status, { color: statusColor }]}>
              {statusLabel}
            </Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: "relative",
    overflow: "hidden",
  },
  backRow: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
  },
  backLeft: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 20,
  },
  backRight: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 20,
  },
  backLabel: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 21,
  },
  meta: {
    fontSize: 13,
    marginTop: 3,
    lineHeight: 18,
  },
  statusWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 0,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
  },
});
