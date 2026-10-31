import StyledButton from "@/components/ui/button";
import StyledCard from "@/components/ui/card";
import StyledText from "@/components/ui/text";
import { View } from "react-native";
import { useReminders } from "./context/reminder-ctx-provider";
import { Noti } from "./context/types";

const getWeekdayName = (dayNumber: number) => {
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return weekdays[dayNumber - 1] || "Invalid day number";
}

const formatTime = (hour: number, min: number) => {
  const formattedHour = hour.toString().padStart(2, '0');
  const formattedMin = min.toString().padStart(2, '0');
  return `${formattedHour}:${formattedMin}`;
}

export default function ReminderCard({ hour, min, groupid, weekdays, projects }: Noti) {
  const { deleteNotiGroup } = useReminders()

  return (
    <StyledCard>
      <StyledText weight="bold" size={20}>Reminder at: {formatTime(hour, min)}</StyledText>
      <View style={{ flexDirection: "column", gap: 10 }}>
        {
          projects.length > 0 ?
            <StyledText size={13} type="seconday">Projects: {projects.join(", ")}</StyledText>
            :
            <StyledText size={13} type="seconday">All projects</StyledText>
        }
        <StyledText size={13} type="seconday">Each: {weekdays.map((weekday) => `${getWeekdayName(weekday)}`).join(", ")}</StyledText>
        <StyledButton type="primary" text="Delete" onClick={() => deleteNotiGroup(groupid)} />
      </View>
    </StyledCard>
  )
}