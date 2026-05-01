import { Pressable, StyleSheet, View } from "react-native";
import { COLORS } from "../constants/colors";
import { useTheme } from "../hooks/useTheme";

export default function Toggle({ value, onValueChange }) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={() => onValueChange?.(!value)}
      style={[
        styles.track,
        { backgroundColor: theme.border },
        value && { backgroundColor: theme.accent },
      ]}
    >
      <View style={[styles.thumb, value && styles.thumbOn]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 26,
    borderRadius: 13,
    padding: 2,
    justifyContent: "center",
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.white,
  },
  thumbOn: {
    transform: [{ translateX: 18 }],
  },
});
