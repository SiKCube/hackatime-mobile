import OptionBtn from '@/components/ui/option-btn';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useStatsCtx } from './context/statsCtxProvider';

interface Option {
  text: string
  key: string
  icon: string
  onClick: () => [Date, Date]
}

const getFirstDateOfTheWeekByISOString = (isoString: string, firstDayofTheWeek: number = 1): Date => {
  const date = new Date(isoString.slice(0, 10))

  const dayNumber = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + firstDayofTheWeek - dayNumber)

  return date
}

const OPTIONS: Option[] = [
  {
    text: "All time", icon: "time", key: "alltime", /*5 years ago*/
    onClick: () => {
      const start = new Date(new Date().getFullYear() - 5, 0, 1, 1)
      const end = new Date(new Date(new Date().getFullYear() + 1, 0, 1).getTime() - 24 * 60 * 60 * 1000)

      return [start, end]
    }
  },
  {
    text: "This year", icon: "flag", key: "thisyear",
    onClick: () => {
      const start = new Date(new Date().getFullYear(), 0, 1, 1)
      const end = new Date(new Date(new Date().getFullYear() + 1, 0, 1).getTime() - 24 * 60 * 60 * 1000)

      return [start, end]
    }
  },
  {
    text: "Today", icon: "sunny", key: "today",
    onClick: () => {
      const today = new Date()

      const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 1)
      const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23)

      return [start, end]
    }
  },
  {
    text: "Yesterday", icon: "watch", key: "yesterday",
    onClick: () => {
      const today = new Date()

      const start = new Date(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 1).getTime() - 24 * 60 * 60 * 1000)
      const end = new Date(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23).getTime() - 24 * 60 * 60 * 1000)

      return [start, end]
    }
  },
  {
    text: "This week", icon: "calendar", key: "thisweek",
    onClick: () => {
      const today = new Date()
      const monday = getFirstDateOfTheWeekByISOString(today.toISOString())
      const sunday = new Date(monday.getTime() + 7 * 24 * 60 * 60 * 1000)

      return [monday, sunday]
    }
  },
  {
    text: "This month", icon: "calendar-number", key: "thismonth",
    onClick: () => {
      const today = new Date()

      const start = new Date(today.getFullYear(), today.getMonth(), 1, 0)
      const end = new Date(new Date(today.getFullYear(), today.getMonth() + 1, 1, 23).getTime() - 24 * 60 * 60 * 1000)

      return [start, end]
    }
  },
  {
    text: "Last 30 days", icon: "calendar-number", key: "last30days",
    onClick: () => {
      const today = new Date()

      const start = new Date(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 1).getTime() - 30 * 24 * 60 * 60 * 1000)
      const end = new Date(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23).getTime() - 24 * 60 * 60 * 1000)

      return [start, end]
    }
  },
  {
    text: "Last 12 months", icon: "flag", key: "last12months",
    onClick: () => {
      const today = new Date()

      const start = new Date(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 1).getTime() - 12 * 30 * 24 * 60 * 60 * 1000)
      const end = new Date(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23).getTime() - 24 * 60 * 60 * 1000)

      return [start, end]
    }
  }
]

export default function DateRangePickerDialogExample() {
  const { loading,
    startDate,
    setStartDate,
    endDate,
    setEndDate
  } = useStatsCtx()
  const [selected, setSelected] = useState<string>("thisyear")

  return (
    <View style={{ margin: 10 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: "center", flexDirection: "row", gap: 10 }}>
        {
          OPTIONS.map((opt, i) => <OptionBtn
            text={opt.text}
            icon={opt.icon}
            key={i}
            selectedKey={opt.key}
            onClick={() => {
              setSelected(opt.key)
              const [start, end] = opt.onClick()

              setStartDate(start)
              setEndDate(end)
            }}
            selected={selected}
            disable={loading}
          />)
        }
      </ScrollView>
    </View>
  );
}
