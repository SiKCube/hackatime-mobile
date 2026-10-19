import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function Details() {
  const { projectId } = useLocalSearchParams()

  return (
    <View>
      <Text>Details {projectId}</Text>
    </View>
  )
}