import Alert from "@/components/alert";
import StyledButton from "@/components/ui/button";
import StyledCard from "@/components/ui/card";
import StyledText from "@/components/ui/text";
import DateTimePicker from "@expo/ui/community/datetime-picker";
import Slider from "@expo/ui/community/slider";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { gethoursAndMinutes } from "../stats/get-stats";
import { useReminders } from "./context/reminder-ctx-provider";
import ProjectsOptions from "./projects-options";
import WeekDAyPicker from "./weekday-picker";

export default function ReminderForm() {
  const [show, setShow] = useState(false);
  const [block, setBlock] = useState<boolean>(false)

  const { createWeeklyNoti } = useReminders()

  const [date, setDate] = useState<Date>(new Date());
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([])
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [hours, setHours] = useState<number>(1)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const handleNewReminder = async () => {
    if (selectedWeekdays.length > 0 && Number(hours) > 0.5 && date) {
      setBlock(true)

      await createWeeklyNoti({
        hour: date.getHours(),
        min: date.getMinutes(),
        projects: selectedProjects,
        weekdays: selectedWeekdays.map((v) => Number(v))
      })

      router.navigate("/in-app/streak")
      return
    }
    setError(`Invalid inputs`)
  }

  return (
    <>
      <Alert type="error" msg={error} />
      <ScrollView contentContainerStyle={{ gap: 20, padding: 20, }}>
        <StyledCard>
          <StyledText weight="bold" size={20}>Pick a time</StyledText>
          <View style={{ marginTop: 10 }}>
            <StyledButton type="primary" text={date.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })} onClick={() => setShow(true)} />
            {show && (
              <DateTimePicker
                value={date}
                onValueChange={(event: any, selectedDate: Date) => {
                  setShow(false);
                  setDate(selectedDate);
                }}
                onDismiss={() => {
                  setShow(false);
                }}
                mode="time"
                presentation="dialog"
              />
            )}
          </View>
        </StyledCard>
        <StyledCard>
          <StyledText weight="bold" size={20}>Amount of hours {gethoursAndMinutes(Number(hours.toFixed(2)) * 3600)}</StyledText>
          <View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <StyledText type="seconday" size={12}>0.5h</StyledText>
              <StyledText type="seconday" size={12}>5h</StyledText>
              <StyledText type="seconday" size={12}>10h</StyledText>
            </View>
            <Slider
              value={hours}
              onValueChange={setHours}
              minimunValue={0.5}
              maximumValue={10}
              disable={block}
              step={0.5}
              lowerLimit={0.5}
            />
          </View>
        </StyledCard>
        <StyledCard>
          <StyledText weight="bold" size={20}>Select your days</StyledText>
          <WeekDAyPicker
            selectedWeekdays={selectedWeekdays}
            setSelectedWeekdays={setSelectedWeekdays}
            disable={block}
          />
        </StyledCard>
        <StyledCard>
          <StyledText weight="bold" size={20}>For what project?</StyledText>
          <ProjectsOptions
            selectedProjects={selectedProjects}
            setSelectedProjects={setSelectedProjects}
            disable={block}
          />
        </StyledCard>
        <StyledButton type="primary" text="Create reminder" onClick={async () => await handleNewReminder()} />
      </ScrollView>
    </>
  );
}

