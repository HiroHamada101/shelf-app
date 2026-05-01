import { StyleSheet, Text, View } from "react-native";
import { getCategoryAvatarStyle } from "../constants/categoryAvatar";
import { FONTS } from "../constants/typography";

const ROW_SIZE = 44;
const ROW_FONT = 18;
const DETAIL_FONT = 24;

function initialLetter(name) {
  const s = (name ?? "").trim();
  if (!s.length) return "?";
  return s.charAt(0).toLocaleUpperCase();
}

/**
 * Letter avatar for listed items (not the add-screen emoji picker).
 * @param {object} props
 * @param {string} props.name Product display name — first character shown
 * @param {string} [props.category] Category id (food, medicine, …)
 * @param {number} [props.size] Square size in px (default 44 list / hero uses 64)
 * @param {number} [props.fontSize] Override letter size (defaults from size)
 */
export default function ProductLetterAvatar({
  name,
  category,
  size = ROW_SIZE,
  fontSize: fontSizeProp,
}) {
  const { backgroundColor, color } = getCategoryAvatarStyle(category);
  const borderRadius = Math.round((14 / ROW_SIZE) * size);
  const fontSize =
    fontSizeProp ?? (size >= 56 ? DETAIL_FONT : ROW_FONT);

  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius,
          backgroundColor,
        },
      ]}
    >
      <Text
        style={[
          styles.letter,
          {
            color,
            fontSize,
            fontFamily: FONTS.montserratBold,
          },
        ]}
      >
        {initialLetter(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  letter: {
    textAlign: "center",
    includeFontPadding: false,
  },
});
