import { Redirect, Tabs, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import TabBar from "../../components/TabBar";
import { useAuth } from "../../hooks/useAuth";
import { useDatabase } from "../../hooks/useDatabase";

function ConnectedTabBar(props) {
  const { state, navigation } = props;
  const router = useRouter();
  const { getBuyList } = useDatabase();
  const [restockCount, setRestockCount] = useState(0);

  const refresh = useCallback(() => {
    getBuyList()
      .then((rows) => setRestockCount(rows.length))
      .catch(() => {});
  }, [getBuyList]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const active = state.routes[state.index]?.name ?? "home";

  const onTab = (id) => {
    if (id === "add") {
      router.push("/add");
      return;
    }
    navigation.navigate(id);
  };

  return <TabBar active={active} onTab={onTab} restockCount={restockCount} />;
}

export default function TabsLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/splash" />;
  }

  return (
    <Tabs
      tabBar={(tabBarProps) => <ConnectedTabBar {...tabBarProps} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="restock" options={{ title: "Restock" }} />
      <Tabs.Screen name="stats" options={{ title: "Stats" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
