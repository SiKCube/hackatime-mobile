import { Stack } from "expo-router";

export default function ProjectsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="projects/[projectId]" options={{ headerTitle: "Details" }} />
      <Stack.Screen name="projects/index" options={{ headerTitle: "Projects" }} />
    </Stack>
  )
}