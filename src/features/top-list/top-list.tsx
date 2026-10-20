import { View } from "react-native";
import { gethoursAndMinutes } from "../get-stats";
import TopCard from "./top-card";

interface Props {
  total_time_secs: number
  top_project: string
  top_language: string
}

export default function TopList({ total_time_secs, top_language, top_project }: Props) {
  return (
    <View style={{ flexDirection: "column", gap: 10, justifyContent: "center", alignItems: "center" }}>
      <TopCard
        title="Total time"
        value={gethoursAndMinutes(total_time_secs)}
      />
      <View style={{ flexDirection: "row", gap: 10, justifyContent: "space-between", alignItems: "center" }}>
        <TopCard
          title="Top language"
          value={top_language}
        />
        <TopCard
          title="Top project"
          value={top_project}
        />
      </View>
    </View>
  )
}