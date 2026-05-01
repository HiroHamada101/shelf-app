import { Redirect } from "expo-router";
import { useAuth } from "../hooks/useAuth";

export default function Index() {
  const { isReady, isAuthenticated } = useAuth();
  if (!isReady) {
    return null;
  }
  return (
    <Redirect href={isAuthenticated ? "/(tabs)/home" : "/(auth)/splash"} />
  );
}
