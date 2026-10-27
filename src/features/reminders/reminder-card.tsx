import StyledButton from "@/components/ui/button";
import StyledCard from "@/components/ui/card";
import StyledText from "@/components/ui/text";
import { View } from "react-native";
import { useReminders } from "./context/reminder-ctx-provider";
import { Noti } from "./context/types";

const getWeekdayName = (dayNumber: number) => {
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return weekdays[dayNumber] || "Invalid day number";
}

export default function ReminderCard({ hour, min, groupid, weekdays, projects, notisids }: Noti) {
  const { deleteNotiGroup } = useReminders()

  return (
    <StyledCard>
      <View style={{ flexDirection: "column", gap: 5 }}>
        <StyledText weight="bold" size={20}>Reminder at: {hour}:{min}</StyledText>
        <StyledText type="seconday">Each: {weekdays.map((weekday) => `${getWeekdayName(weekday)} `)}</StyledText>
        {
          projects.length > 0 ?
            <StyledText size={13} type="seconday">Projects: {projects.join(", ")}</StyledText>
            :
            <StyledText size={13} type="seconday">All projects</StyledText>
        }
        <StyledButton type="primary" text="Delete" onClick={() => deleteNotiGroup(groupid)} />
      </View>
    </StyledCard>
  )
}