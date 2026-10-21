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
      }
    }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[projectId]" options={{ headerTitle: "Details", headerTintColor: THEME.surface_content }} />
    </Stack>
  )
}