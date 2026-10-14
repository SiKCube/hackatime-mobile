import { useEffect, useState } from "react";
import { Text } from "react-native";
import { ContributionGraph, CalendarHeatmap } from "react-native-chart-kit/v2";

interface Props {

}

export default function RhythmChart() {
  const [daysCount, setDaysCount] = useState<number | null>(null)
  const [limitDate, setLimitDate] = useState<string | null>(null)
  const [chartData, setChartData] = useState<{ date: string, count: number }[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const endDate = "2026-05-03";
    const numDays = 24;
    const values = Array.from({ length: numDays }, (_, index) => {
      const end = new Date(`${endDate}T00:00:00.000Z`);
      const date = new Date(
        end.valueOf() - (numDays - 1 - index) * 24 * 60 * 60 * 1000
      );
      const weekday = date.getUTCDay();
      const cycle = (index * 7 + weekday * 3) % 17;
      const launchWeekBoost = index > 110 && index < 126 ? 8 : 0;
      const weekendDip = weekday === 0 || weekday === 6 ? -4 : 0;

      return {
        date: date.toISOString().slice(0, 10),
        count: Math.max(0, cycle + launchWeekBoost + weekendDip)
      };
    });

    setDaysCount(numDays)
    setLimitDate(endDate)
    setChartData(values)
  }, [])

  return (
    <>
      <Text>{error}</Text>
      {
        loading ?
          <Text>Loading...</Text>
          :
          chartData ?
            // <ContributionGraph
            //   values={chartData}
            //   endDate={limitDate as any}
            //   numDays={daysCount as any}
            //   width={410}
            //   height={162}
            //   weekStartsOn={1}
            //   showOutOfRangeDays
            //   cellSize={40}
            // />
            <CalendarHeatmap
              height={260}
              width={400}
              values={[
                { date: "00:00", duration: 2 },
                { date: "01:00", duration: 2 },
                { date: "02:00", duration: 2 },
                { date: "03:00", duration: 2 },
                { date: "04:00", duration: 2 },
                { date: "05:00", duration: 2 },
                { date: "06:00", duration: 2 },
                { date: "07:00", duration: 2 },
                { date: "08:00", duration: 2 },
                { date: "09:00", duration: 2 },
                { date: "10:00", duration: 20 },
                { date: "11:00", duration: 7 },
                { date: "12:00", duration: 27 },
                { date: "13:00", duration: 10 },
                { date: "14:00", duration: 0 },
                { date: "15:00", duration: 2 },
                { date: "16:00", duration: 10 },
                { date: "17:00", duration: 0 },
                { date: "18:00", duration: 2 },
                { date: "19:00", duration: 10 },
                { date: "20:00", duration: 0 },
                { date: "21:00", duration: 2 },
                { date: "22:00", duration: 2 },
                { date: "23:00", duration: 2 },
              ]}
              numDays={7}
              showWeekdayLabels
              endDate={"2026-10-13"}
            />
            :
            <Text>No data</Text>
      }
    </>
  )
}
