import Alert from "@/components/alert";
import StyledButton from "@/components/ui/button";
import StyledLinkButton from "@/components/ui/button-link";
import { ScrollView, View } from "react-native";
import { useReminders } from "./context/reminder-ctx-provider";
import ReminderCard from "./reminder-card";

export default function ReminderList() {
  const { notis, permission, askPermission, } = useReminders()

  return (
    <ScrollView
      contentContainerStyle={{ gap: 20 }}
    >
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <StyledLinkButton text="Add reminder" type="primary" href={{
          pathname: "/in-app/streak/new-reminder",
        }} fullWidth />
      </View>
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
    </ScrollView>
  )
}