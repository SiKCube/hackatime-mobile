import { useTheme } from "@/features/theme/context/theme-ctx-provider";
import { Stack, useLocalSearchParams } from "expo-router";

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
      <Stack.Screen name="[username]" options={{ headerTintColor: themeData.surface_content, headerTitleStyle: {
        fontWeight: "bold"
      } }} />
    </Stack>
  )
}