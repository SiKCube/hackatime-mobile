import { THEME } from "@/components/theme";
import ReminderProvider from "@/features/reminders/context/reminder-ctx-provider";
import { Stack } from "expo-router";

export default function ProjectsLayout() {
  return (
    <ReminderProvider>
      <Stack screenOptions={{
        contentStyle: {
          backgroundColor: THEME.darker
        },
        headerStyle: {
          backgroundColor: THEME.darkless,
        }
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="new-reminder" options={{ headerTitle: "New Reminder", headerTintColor: THEME.surface_content }} />
      </Stack>
    </ReminderProvider>
  )
}