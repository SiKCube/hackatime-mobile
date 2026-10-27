import StyledText from "@/components/ui/text";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GoalProgress from "@/features/goal/goal-progress";
import ReminderList from "@/features/reminders/reminder-list";

export default function StreakScreen() {
  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        <StyledText weight="bold" size={20}>
          Check And Remind
          <StyledText weight="bold" type="primary" size={20}> Your </StyledText>
          Goals
        </StyledText>
        <GoalProgress />
        <ReminderList />
      </ScrollView>
    </SafeAreaView>
  )
}
