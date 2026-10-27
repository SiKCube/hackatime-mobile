import { THEME } from "@/components/theme";
import { Stack } from "expo-router";

export default function ProjectsLayout() {
  return (
    <Stack screenOptions={{
      contentStyle: {
        backgroundColor: THEME.darker
      },
      headerStyle: {
        backgroundColor: THEME.darkless,
      },
      headerTitleStyle: {
        color: THEME.primary,
        fontWeight: "bold"
      }
    }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="programs" options={{ headerTitle: "Programs", headerTintColor: THEME.surface_content }} />
      <Stack.Screen name="theme" options={{ headerTitle: "Theme", headerTintColor: THEME.surface_content }} />
    </Stack>
  )
}