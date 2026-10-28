import { useTheme } from "@/features/theme/context/theme-ctx-provider";
import { Stack } from "expo-router";

export default function ProjectsLayout() {
  const { themeData } = useTheme()

  return (
    <Stack screenOptions={{
      contentStyle: {
        backgroundColor: themeData.darker
      },
      headerStyle: {
        backgroundColor: themeData.darkless,
      },
      headerTitleStyle: {
        color: themeData.primary,
        fontWeight: "bold"
      }
    }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="programs" options={{ headerTitle: "Programs", headerTintColor: themeData.surface_content }} />
      <Stack.Screen name="theme" options={{ headerTitle: "Theme", headerTintColor: themeData.surface_content }} />
    </Stack>
  )
}