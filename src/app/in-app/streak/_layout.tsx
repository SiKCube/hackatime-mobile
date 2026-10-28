import ReminderProvider from "@/features/reminders/context/reminder-ctx-provider";
import { useTheme } from "@/features/theme/context/theme-ctx-provider";
import { Stack } from "expo-router";

export default function ProjectsLayout() {
  const { themeData } = useTheme()

  return (
    <ReminderProvider>
      <Stack screenOptions={{
        contentStyle: {
          backgroundColor: themeData.darker
        },
        headerStyle: {
          backgroundColor: themeData.darkless,
        }
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="new-reminder" options={{ headerTitle: "New Reminder", headerTintColor: themeData.surface_content }} />
      </Stack>
    </ReminderProvider>
  )
}