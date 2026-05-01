import {
  Fraunces_400Regular,
  Fraunces_700Bold,
} from "@expo-google-fonts/fraunces";
import {
  Montserrat_500Medium,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
} from "@expo-google-fonts/montserrat";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../hooks/useAuth";
import { ThemeProvider, useTheme } from "../hooks/useTheme";
import { COLORS } from "../constants/colors";
import { registerNotificationHandler } from "../utils/notifications";

registerNotificationHandler();

/** Prefer `index` on cold start so routing is deterministic. */
export const unstable_settings = {
  initialRouteName: "index",
};

function FontsGate({ children }) {
  const [loaded] = useFonts({
    Fraunces_400Regular,
    Fraunces_700Bold,
    Montserrat_500Medium,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
  });
  if (!loaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.accent,
        }}
      >
        <ActivityIndicator size="small" color={COLORS.white} />
      </View>
    );
  }
  return children;
}

function RootNavigator() {
  const { mode, theme } = useTheme();
  const { isReady } = useAuth();

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.bg,
        }}
      >
        <ActivityIndicator size="small" color={theme.accent} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.bg },
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add" options={{ presentation: "modal" }} />
        <Stack.Screen name="detail/[id]" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <FontsGate>
            <AuthProvider>
              <RootNavigator />
            </AuthProvider>
          </FontsGate>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
