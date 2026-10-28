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
      }
    }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[projectId]" options={{ headerTitle: "Details", headerTintColor: themeData.surface_content }} />
    </Stack>
  )
}