import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ALPHA, COLORS } from "../../constants/colors";
import { FONTS, TYPOGRAPHY } from "../../constants/typography";
import ShelfLogo from "../../components/ShelfLogo";

export default function SplashScreen() {
  const scale = useRef(new Animated.Value(0.8)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const logoIn = Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 7,
      tension: 58,
    });

    const textIn = Animated.timing(textOpacity, {
      toValue: 1,
      duration: 400,
      delay: 500,
      useNativeDriver: true,
    });

    const fadeOut = Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 500,
      delay: 2000,
      useNativeDriver: true,
    });

    logoIn.start();
    textIn.start();
    fadeOut.start(({ finished }) => {
      if (finished) {
        router.replace("/(auth)/phone");
      }
    });
  }, [scale, textOpacity, screenOpacity]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
        <StatusBar style="light" />
        <Animated.View style={{ transform: [{ scale }] }}>
          <ShelfLogo size={72} bg="transparent" fg={COLORS.white} />
        </Animated.View>
        <Animated.View style={[styles.textWrap, { opacity: textOpacity }]}>
          <Text style={[styles.title, { fontFamily: FONTS.montserratExtraBold }]}>
            Shelf.
          </Text>
          <Text style={[styles.oneLiner, { fontFamily: FONTS.montserratMedium }]}>
            Never let anything expire again.
          </Text>
          <Text style={[styles.tagline, { fontFamily: FONTS.montserratMedium }]}>
            Track it. Use it. Waste less.
          </Text>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.accent,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.accent,
    gap: 12,
    padding: 24,
  },
  textWrap: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    ...TYPOGRAPHY.display,
    fontSize: 36,
    color: COLORS.white,
    letterSpacing: -0.8,
  },
  oneLiner: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.white,
    textAlign: "center",
    marginTop: 10,
  },
  tagline: {
    fontSize: 13,
    fontWeight: "500",
    color: ALPHA.white60,
    textAlign: "center",
    marginTop: 6,
  },
});
