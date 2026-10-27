import Alert from "@/components/alert";
import StyledButton from "@/components/ui/button";
import { ScrollView } from "react-native";
import { useReminders } from "./context/reminder-ctx-provider";
import ReminderCard from "./reminder-card";
import StyledLinkButton from "@/components/ui/button-link";

export default function ReminderList() {
  const { notis, permission, askPermission, killAllNotis, printAllNotis } = useReminders()

  return (
    <ScrollView contentContainerStyle={{ gap: 20 }}>
      {
        notis.length > 0 && permission ?
          notis.map((noti, i) => <ReminderCard key={i} {...noti} />)
          :
          !permission ?
            <>
              <Alert type="error" msg={"No permision granted"} />
              <StyledButton type="primary" text="Cant I?" onClick={askPermission} />
            </>
            :
            <Alert type="wow" msg={"No reminders"} />
      }
      <StyledLinkButton text="New reminder" type="primary" href={{
        pathname: "/in-app/streak/new-reminder",
      }} />
    </ScrollView>
  )
}