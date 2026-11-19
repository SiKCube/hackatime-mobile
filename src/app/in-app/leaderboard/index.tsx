import Board from "@/features/leaderboard/board";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LeaderBoard() { 
  return (
    <SafeAreaView style={{ padding: 20 }}>
      <Board />
    </SafeAreaView>
  )
}