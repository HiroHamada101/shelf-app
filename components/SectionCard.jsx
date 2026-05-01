import { StyleSheet, View } from "react-native";
import { RADIUS } from "../constants/layout";
import { useTheme } from "../hooks/useTheme";

export default function SectionCard({ children, style }) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
  },
});
