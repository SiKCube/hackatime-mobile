import OptionBtn from "@/components/ui/option-btn";
import { Dispatch, SetStateAction, useState } from "react";
import { View } from "react-native";

interface WeekDayType {
  name: string
  weeknum: string
}

const WEEKDAYS: WeekDayType[] = [
  { name: "Sunday", weeknum: "1" },
  { name: "Monday", weeknum: "2" },
  { name: "Tuesday", weeknum: "3" },
  { name: "Wednesday", weeknum: "4" },
  { name: "Thursday", weeknum: "5" },
  { name: "Friday", weeknum: "6" },
  { name: "Saturday", weeknum: "7" }
]

interface Props { 
  selectedWeekdays: string[]
  setSelectedWeekdays: Dispatch<SetStateAction<string[]>>
  disable: boolean
}

export default function WeekDAyPicker({ selectedWeekdays, setSelectedWeekdays, disable }: Props) {
  return (
    <View style={{ marginTop: 10, flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
      {WEEKDAYS.map((weekday, i) => {
        const r = selectedWeekdays.find((v) => v === weekday.weeknum)

        return (
          <OptionBtn
            key={i}
            text={weekday.name}
            selectedKey={weekday.weeknum}
            disable={disable}
            icon="today"
            selected={r ? r : "XD"}
            onClick={() => {
              if (r) {
                setSelectedWeekdays(selectedWeekdays.filter((v) => v !== r))
              } else {
                setSelectedWeekdays([...selectedWeekdays, weekday.weeknum])
              }
            }}
          />
        )
      })}
    </View>
  )
}